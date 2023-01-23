<?php

namespace App\Http\Controllers\Admin;

use Throwable;
use App\Models\Sku;
use App\Models\Tag;
use App\Models\Item;
use App\Models\Size;
use App\Models\Brand;
use App\Models\Color;
use App\Models\Image;
use App\Models\Category;
use App\Models\Measurement;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\TagResource;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\ItemResource;
use App\Http\Resources\SizeResource;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\BrandResource;
use App\Http\Resources\ColorResource;
use App\Http\Requests\admin\ItemEditRequest;
use App\Http\Requests\admin\ItemRegisterRequest;

class ItemController extends Controller
{
    // 該当のカラム以外を扱わないようにホワイトリスト作成
    private $form_items = [  'product_number', 'item_name', 'price', 'cost', 'made_in', 'mixture_ratio', 'description', 'is_published', 'brand_id', 'gender_category', 'main_category', 'sub_category', 'tags_id', 'skus', 'images', 'measurements' ];
    // 各種フィルター用プロパティ
    private $sizes = null;
    private $colors = null;
    private $tags = null;
    private $brands = null;
    private $gender_categories = null;
    private $main_categories = null;
    private $sub_categories = null;

    public function __construct()
    {
        // Auth認証
        $this->middleware('auth:admin');
        // 各種フィルター用選択肢を取得
        $this->sizes = SizeResource::collection(Size::orderBy('size_name', 'desc')->get());
        $this->colors = ColorResource::collection(Color::orderBy('color_name', 'asc')->get());
        $this->tags = TagResource::collection(Tag::all());
        $this->brands = BrandResource::collection(Brand::orderBy('brand_name', 'asc')->get());
        $this->gender_categories = Category::genderCategories()->get();
        $this->main_categories = Category::mainCategories()->get();
        $this->sub_categories = Category::subCategories()->get();
    }

    public function index(Request $request)
    {
        $search_item = Item::with([ 'skus.color', 'skus.size', 'brand', 'genderCategory', 'mainCategory', 'subCategory', 'tags', 'admin' ]);

        // フリーワード検索
        $search_item->filterKeyword($request, ['item_name']);
        // 公開の有無フィルター
        $search_item->filterIsPublished($request);
        // ブランドのフィルター
        $search_item->filterBrand($request);
        // カラーのフィルター
        $search_item->filterColor($request);
        // サイズのフィルター
        $search_item->filterSize($request);
        // カテゴリのフィルター
        $search_item->filterCategory($request);
        // タグのフィルター
        $search_item->filterTag($request);
        // 検索期間の指定フィルター
        $search_item->filterDateRange($request);

        // 品番順->商品名順->価格順->原価順->投稿日順->修正更新日順の優先順位でソートされる仕組み

        // 品番順でソート
        $search_item->orderByProductNumber($request);
        // 商品名順でソート
        $search_item->orderByItemName($request);
        // 価格順でソート
        $search_item->orderByPrice($request);
        // 原価順でソート
        $search_item->orderByCost($request);
        // 投稿日でソート
        $search_item->orderByPostedAt($request);
        // 修正更新日でソート
        $search_item->orderByModifiedAt($request);

        // ページネーション
        $items = $search_item->customPaginate($request);

        // レスポンスを返却
        return (ItemResource::collection($items))->additional([
            // 各種選択肢をmeta情報としてトップレベルに追加
            'brands' => $this->brands,
            'gender_categories' => $this->gender_categories,
            'main_categories' => $this->main_categories,
            'sub_categories' => $this->sub_categories,
            'sizes' => $this->sizes,
            'colors' => $this->colors,
            'tags' => $this->tags,
        ]);
    }

   public function create()
   {
        // レスポンスを返却
        return response()->json([
            'brands' => $this->brands,
            'gender_categories' => $this->gender_categories,
            'main_categories' => $this->main_categories,
            'sub_categories' => $this->sub_categories,
            'sizes' => $this->sizes,
            'colors' => $this->colors,
            'tags' => $this->tags
        ],200);
   }

   public function store(ItemRegisterRequest $request)
   {
        // 項目制限
        $data = $request->only($this->form_items);
        DB::beginTransaction();
        try {
            // 基本情報をDBに保存
            $item = Item::create([
                'product_number' => $data['product_number'],
                'item_name' => $data['item_name'],
                'price' => $data['price'],
                'cost' => $data['cost'],
                'made_in' => $data['made_in'],
                'mixture_ratio' => $data['mixture_ratio'],
                'description' => $data['description'],
                'is_published' => $data['is_published'],
                'admin_id' => Auth::guard('admin')->id(),
                'brand_id' => $data['brand_id'],
                'posted_at' => $data['is_published'] == 1 ? Carbon::now(): null, // 公開日ベースで更新日を保存したいので条件分岐を追加
            ]);
            // カテゴリ中間テーブルへの保存 ＊ 配列形式でIDを渡して配列外のIDは削除される
            $item->categories()->sync([$data['gender_category'], $data['main_category'], $data['sub_category']]);
            // タグ中間テーブルへの保存
            $item->tags()->sync(!empty($data['tags_id'])? $data['tags_id']: []);
            // skusは配列形式で複数レコードが返ってくるのでfor文で展開してレコードを挿入
            for($i = 0; $i < count($data['skus']); $i++) {
                Sku::create([
                    'item_id' => $item->id,
                    'size_id' => $data['skus'][$i]['size_id'],
                    'color_id' => $data['skus'][$i]['color_id'],
                    'quantity' => $data['skus'][$i]['quantity'],
                ]);
            }
            // imagesは配列形式で複数レコードが返ってくるのでfor文で展開してレコードを挿入
            for($i = 0; $i < count($data['images']); $i++) {
                // 更新時に画像ファイルがあるかチェック
                if(!empty($data['images'][$i]['file'])) {
                    // 新しい画像の保存と古い画像の削除
                    $db_reserve_path = saveImage($data['images'][$i]['file']);
                }
                // 更新もしくはIDがnull渡ってくる場合はレコードを挿入
                Image::create([
                    'item_id' => $item->id,
                    'color_id' => $data['images'][$i]['color_id'],
                    'image' => $db_reserve_path,
                    'image_category' => $data['images'][$i]['image_category'],
                ]);
            }
            // measurementsは配列形式で複数レコードが返ってくるのでfor文で展開してレコードを挿入
            for($i = 0; $i < count($data['measurements']); $i++) {
                Measurement::create([
                    'item_id' => $item->id,
                    'size_id' => $data['measurements'][$i]['size_id'],
                    'width' => $data['measurements'][$i]['width'],
                    'shoulder_width' => $data['measurements'][$i]['shoulder_width'],
                    'raglan_sleeve_length' => $data['measurements'][$i]['raglan_sleeve_length'],
                    'sleeve_length' => $data['measurements'][$i]['sleeve_length'],
                    'length' => $data['measurements'][$i]['length'],
                    'waist' => $data['measurements'][$i]['waist'],
                    'hip' => $data['measurements'][$i]['hip'],
                    'rise' => $data['measurements'][$i]['rise'],
                    'inseam' => $data['measurements'][$i]['inseam'],
                    'thigh_width' => $data['measurements'][$i]['thigh_width'],
                    'outseam' => $data['measurements'][$i]['outseam'],
                    'sk_length' => $data['measurements'][$i]['sk_length'],
                    'hem_width' => $data['measurements'][$i]['hem_width'],
                    'weight' => $data['measurements'][$i]['weight']
                ]);
            }
            DB::commit();
            return response()->json(['create' => true, 'message' => '商品の新規登録を完了しました'], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['create' => false, 'message' => '商品の新規登録を失敗しました'], 200);
        }
   }

    public function edit($item)
    {
        $item = Item::where('id', $item)->with(['skus', 'genderCategory', 'mainCategory', 'subCategory','tags','images','measurements'])->first();

        // レスポンスを返却
        return (new ItemResource($item))->additional([
            // 各種選択肢をmeta情報としてトップレベルに追加
            'brands' => $this->brands,
            'gender_categories' => $this->gender_categories,
            'main_categories' => $this->main_categories,
            'sub_categories' => $this->sub_categories,
            'sizes' => $this->sizes,
            'colors' => $this->colors,
            'tags' => $this->tags,
        ]);
    }

    public function update(ItemEditRequest $request, Item $item)
    {
        // 項目制限
        $data = $request->only($this->form_items);
        // 初回登録時に非公開の状態で保存されている場合もあるのでカラム名の出し分け
        $registered_date = $item->posted_at !== null ? 'modified_at': 'posted_at';
        // 編集した内容を非公開で保存する場合は日付を更新したくないので該当インスタンスに登録されてる日付を取得
        $date = $registered_date === 'modified_at'? $item->modified_at : $item->posted_at;
        DB::beginTransaction();
        try {
            // 基本情報をDBに保存
            $item->fill([
                'product_number' => $data['product_number'],
                'item_name' => $data['item_name'],
                'price' => $data['price'],
                'cost' => $data['cost'],
                'made_in' => $data['made_in'],
                'mixture_ratio' => $data['mixture_ratio'],
                'description' => $data['description'],
                'is_published' => $data['is_published'],
                'admin_id' => Auth::guard('admin')->id(),
                'brand_id' => $data['brand_id'],
                $registered_date => $data['is_published'] == 1 ? Carbon::now(): $date, // 公開日ベースで更新日を保存したいので条件分岐を追加
            ])->save();
            // カテゴリ中間テーブルへの保存 ＊ 配列形式でIDを渡して配列外のIDは削除される
            $item->categories()->sync([$data['gender_category'], $data['main_category'], $data['sub_category']]);
            // タグ中間テーブルへの保存
            $item->tags()->sync(!empty($data['tags_id'])? $data['tags_id']: []);
            // skusは配列形式で複数レコードが返ってくるのでfor文で展開してレコードを挿入
            for($i = 0; $i < count($data['skus']); $i++) {
                // 更新もしくはIDがnull渡ってくる場合はレコードを挿入
                Sku::updateOrCreate([
                    'id' => $data['skus'][$i]['id']
                ], $data['skus'][$i]);
            }
            // imagesは配列形式で複数レコードが返ってくるのでfor文で展開してレコードを挿入
            for($i = 0; $i < count($data['images']); $i++) {
                // 更新時に画像ファイルがあるかチェック
                if(!empty($data['images'][$i]['file'])) {
                    // 該当IDのインスタンスを取得
                    $img = Image::find($data['images'][$i]['id']);
                    // 新しい画像の保存と古い画像の削除
                    $db_reserve_path = saveImage($data['images'][$i]['file'], !empty($img) ? $img->image : null);
                    // imageカラムにはプレビュー用に生成されたURLが格納されてるのでパスを差し替え
                    $data['images'][$i]['image'] = $db_reserve_path;
                }
                // 更新もしくはIDがnull渡ってくる場合はレコードを挿入
                Image::updateOrCreate([
                    'id' => $data['images'][$i]['id']
                ], $data['images'][$i]);
            }
            // measurementsは配列形式で複数レコードが返ってくるのでfor文で展開してレコードを挿入
            for($i = 0; $i < count($data['measurements']); $i++) {
                // 更新もしくはIDがnull渡ってくる場合はレコードを挿入
                Measurement::updateOrCreate([
                    'id' => $data['measurements'][$i]['id']
                ], $data['measurements'][$i]);
            }
            DB::commit();
            return response()->json(['update' => true, 'message' => '商品の編集を完了しました'], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['update' => false, 'message' => '商品の編集を失敗しました'], 200);
        }
    }

    public function destroy(Request $request)
    {
        // 複数のIDが渡ってくるので全て取得する
        $items = $request->all();
        foreach($items as $item) {
            // インスタンスを生成して削除
            $item = Item::find($item);
            $item->delete();
        }
        // レスポンスを返却
        return response()->json(['delete' => true, 'message' => '商品の削除を完了しました'], 200);
    }

    public function destroyMeasurement(Measurement $measurement)
    {
        $measurement->delete();
        // レスポンスを返却
        return response()->json(['delete' => true, 'message' => '商品サイズの削除を完了しました'], 200);
    }

    public function destroySku(Sku $sku)
    {
        $sku->delete();
        // レスポンスを返却
        return response()->json(['delete' => true, 'message' => '商品SKUの削除を完了しました'], 200);
    }

    public function destroyImage(Image $image)
    {
        $image->delete();
        // レスポンスを返却
        return response()->json(['delete' => true, 'message' => '商品画像の削除を完了しました'], 200);
    }

   public function csvExport(Request $request)
   {
        // 複数のIDが渡ってくるので全て取得する
        $id = $request->all();
        // 該当のIDのユーザーを取得
       $items = Item::whereIn('id', $id)->with(['skus.color','skus.size','brand','categories','tags','admin',])->cursor();
        // 配列の初期化
        $csv_body = [];
        // CSVに必要な項目を配列に格納
        $num = 1;
        foreach ($items as $item){
            $csv_body[] = [
                $num,
                $item->id,
                $item->is_published_text,
                $item->product_number,
                $item->item_name,
                $item->price_text,
                $item->cost_text,
                implode(' / ', Color::whereIn('id', array_unique($item->skus->pluck('color_id')->toArray()))->pluck('color_name')->toArray()),
                implode(' / ', Size::whereIn('id', array_unique($item->skus->pluck('size_id')->toArray()))->pluck('size_name')->toArray()),
                $item->made_in,
                $item->mixture_ratio,
                $item->brand->brand_name, 
                count($item->categories) > 0 ? $item->categories[0]['category_name'] : '', 
                count($item->categories) > 1 ? $item->categories[1]['category_name'] : '', 
                count($item->categories) > 2 ? $item->categories[2]['category_name'] : '', 
                implode(' / ', $item->tags->pluck('tag_name')->toArray()),
                optional($item->admin)->full_name.'('.optional($item->admin)->full_name_kana.')',
                $item->posted_at !== null ? $item->posted_at->format('Y/m/d H:i'): '　　',
                $item->modified_at !== null ? $item->modified_at->format('Y/m/d H:i'): '　　',
            ];
            $num++;
        }
        // headerの作成
        $csv_header = ['No', 'ID', '公開状況', '品番', '商品名', '価格', '原価', 'カラー展開', 'サイズ展開', '生産国', '混用率', 'ブランドカテゴリ', '性別カテゴリ', 'メインカテゴリ', 'サブカテゴリ', 'タグ', '最終更新者', '投稿日', '更新日'];
        // 独自helper関数呼び出し
        return csvExport($csv_body,$csv_header,'商品情報出力.csv');
   }
}
