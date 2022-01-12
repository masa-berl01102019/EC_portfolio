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
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\admin\ItemEditRequest;
use App\Http\Requests\admin\ItemRegisterRequest;

class ItemController extends Controller
{
    // TODO Resource APIでレスポンスの返却形式を決めるか要検討
    // TODO フリーワード検索でカラムを指定受けて検索をかける仕様にするか要検討
    // TODO whereHasは処理が重すぎる場合はIN句を使った絞り込みのSQLに変更を検討

    // 該当のカラム以外を扱わないようにホワイトリスト作成
    private $form_items = [  'product_number', 'item_name', 'price', 'cost', 'made_in', 'mixture_ratio', 'description', 'is_published', 'brand_id', 'gender_category', 'main_category', 'sub_category', 'tags_id', 'skus', 'images', 'measurements' ];

    public function __construct()
    {
        // Auth認証
        $this->middleware('auth:admin');
    }

    public function index(Request $request)
    {
        $search_item = Item::select(['items.id', 'is_published', 'product_number', 'item_name', 'price', 'cost', 'made_in', 'mixture_ratio', 'brand_id', 'admin_id', 'posted_at', 'modified_at'])->with([
            'skus.color:id,color_name',
            'skus.size:id,size_name',
            'brand:id,brand_name',
            'categories:id,category_name',
            'tags:id,tag_name',
            'admin:id,last_name,first_name,last_name_kana,first_name_kana',
        ]);

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

        // 1ページ当たり件数の指定の有無を確認
        if($request->input('per_page')) {
            $per_page = $request->input('per_page');
            // 取得件数が指定されていた場合はpaginationに引数としてわたしてあげる * 数字にキャストしないと返り値が文字列になってしまうので注意
            $items = $search_item->paginate((int)$per_page);
        } else {
            // 取得件数が未設定の場合はデフォルトの表示件数　１０件
            $items = $search_item->paginate(10);
        }

        // 各種フィルター用選択肢を取得
        $sizes = Size::select('id','size_name')->orderBy('size_name', 'desc')->get();
        $colors = Color::select('id','color_name')->orderBy('color_name', 'asc')->get();
        $tags = Tag::select('id','tag_name')->get();
        $brands = Brand::select('id','brand_name')->get();
        $gender_categories = Category::select('id', 'category_name')->whereIn('id', [1,2])->get();
        $main_categories = Category::select('id', 'category_name', 'parent_id')->whereIn('parent_id', [1,2])->get();
        $sub_categories = Category::select('depth_3.id', 'depth_3.category_name', 'depth_3.parent_id')->join('categories as depth_2','depth_2.parent_id','=','categories.id')->join('categories as depth_3','depth_3.parent_id','=','depth_2.id')->get();

        // レスポンスを返却
        return response()->json([
            'items' => $items,
            'brands' => $brands,
            'gender_categories' => $gender_categories,
            'main_categories' => $main_categories,
            'sub_categories' => $sub_categories,
            'sizes' => $sizes,
            'colors' => $colors,
            'tags' => $tags,
        ],200);
    }

   public function create()
   {
        // 各種選択肢を取得
        $sizes = Size::select('id','size_name')->orderBy('size_name', 'desc')->get();
        $colors = Color::select('id','color_name')->orderBy('color_name', 'asc')->get();
        $tags = Tag::select('id','tag_name')->get();
        $brands = Brand::select('id','brand_name')->get();
        $gender_categories = Category::select('id', 'category_name')->whereIn('id', [1,2])->get();
        $main_categories = Category::select('id', 'category_name', 'parent_id')->whereIn('parent_id', [1,2])->get();
        $sub_categories = Category::select('depth_3.id', 'depth_3.category_name', 'depth_3.parent_id')->join('categories as depth_2','depth_2.parent_id','=','categories.id')->join('categories as depth_3','depth_3.parent_id','=','depth_2.id')->get();

        // レスポンスを返却
        return response()->json([
            'brands' => $brands,
            'gender_categories' => $gender_categories,
            'main_categories' => $main_categories,
            'sub_categories' => $sub_categories,
            'sizes' => $sizes,
            'colors' => $colors,
            'tags' => $tags,
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
                    // ランダムなファイル名を生成してstorage/app/public/img配下に保存
                    $path_as = Storage::putFile('public/img', $data['images'][$i]['file']);
                    // 画像を呼び出す場合は/storage/img/ファイル名で呼び出す必要があるのでDB保存用にpathを変更
                    $db_reserve_path = str_replace('public/img/', '/storage/img/', $path_as);
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
        $item = Item::where('id', $item)->select(['items.id', 'is_published', 'product_number', 'description', 'item_name', 'price', 'cost', 'made_in', 'mixture_ratio', 'brand_id'])->with([
            'skus:id,item_id,color_id,size_id,quantity,created_at,updated_at',
            'categories:id,category_name',
            'tags:id,tag_name',
            'images:id,item_id,image,image_category,color_id',
            'measurements:id,item_id,size_id,width,shoulder_width,raglan_sleeve_length,sleeve_length,length,waist,hip,rise,inseam,thigh_width,outseam,sk_length,hem_width,weight',
        ])->first();

        $categories_id = $item->categories->pluck('id');

        $arr = [
            'product_number' => $item->product_number,
            'item_name' => $item->item_name,
            'price' => $item->price,
            'cost' => $item->cost,
            'made_in' => $item->made_in,
            'mixture_ratio' => $item->mixture_ratio,
            'description' => $item->description,
            'is_published' => $item->is_published,
            'brand_id' => $item->brand_id,
            'gender_category' => !empty($categories_id[0]) ? $categories_id[0]: '', // 別テーブル
            'main_category' => !empty($categories_id[1]) ? $categories_id[1]: '', // 別テーブル
            'sub_category' => !empty($categories_id[2]) ? $categories_id[2]: '', // 別テーブル
            'sizes_id' => array_values(array_unique($item->skus->pluck('size_id')->toArray())), // 別テーブル * itemに紐づく複数のSKUからsize_idを取り出し配列に変換し、重複の削除と配列の連番の振り直し * 配列の連番を振り直さないとフロント側で受け取る際にオブジェクトに勝手に変換されてしまうので
            'colors_id' => array_values(array_unique($item->skus->pluck('color_id')->toArray())), // 別テーブル
            'tags_id' => $item->tags->pluck('id')->toArray(), // 別テーブル
            'images' => $item->images, // 別テーブル
            'measurements' => $item->measurements, // 別テーブル
            'skus' => $item->skus // 別テーブル
        ];

        // 各種選択肢を取得
        $sizes = Size::select('id','size_name')->orderBy('size_name', 'desc')->get();
        $colors = Color::select('id','color_name')->orderBy('color_name', 'asc')->get();
        $tags = Tag::select('id','tag_name')->get();
        $brands = Brand::select('id','brand_name')->get();
        $gender_categories = Category::select('id', 'category_name')->whereIn('id', [1,2])->get();
        $main_categories = Category::select('id', 'category_name', 'parent_id')->whereIn('parent_id', [1,2])->get();
        $sub_categories = Category::select('depth_3.id', 'depth_3.category_name', 'depth_3.parent_id')->join('categories as depth_2','depth_2.parent_id','=','categories.id')->join('categories as depth_3','depth_3.parent_id','=','depth_2.id')->get();

        // レスポンスを返却
        return response()->json([
            'item' => $arr,
            'brands' => $brands,
            'gender_categories' => $gender_categories,
            'main_categories' => $main_categories,
            'sub_categories' => $sub_categories,
            'sizes' => $sizes,
            'colors' => $colors,
            'tags' => $tags,
        ],200);
    }

    public function update(ItemEditRequest $request, Item $item)
    {
        // 初回登録時に非公開の状態で保存されている場合もあるのでカラム名の出し分け
        $registered_date = $item->posted_at !== null ? 'modified_at': 'posted_at';
        // 項目制限
        $data = $request->only($this->form_items);
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
                $registered_date => $data['is_published'] == 1 ? Carbon::now(): null, // 公開日ベースで更新日を保存したいので条件分岐を追加
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
                    // ランダムなファイル名を生成してstorage/app/public/img配下に保存
                    $path_as = Storage::putFile('public/img', $data['images'][$i]['file']);
                    // 画像を呼び出す場合は/storage/img/ファイル名で呼び出す必要があるのでDB保存用にpathを変更
                    $db_reserve_path = str_replace('public/img/', '/storage/img/', $path_as);
                    // imageカラムにはプレビュー用に生成されたURLが格納されてるのでパスを差し替え
                    $data['images'][$i]['image'] = $db_reserve_path;
                    // 該当IDのインスタンスを取得
                    $img = Image::find($data['images'][$i]['id']);
                    //image DBには画像のパスが格納されてるので画像自体を削除する必要があるので該当IDの画像のファイル名を取得
                    $old_img = str_replace('/storage/img/', 'public/img/', $img !== null ? $img->image : '');
                    // fileの存在をチェックして削除
                    if(Storage::exists($old_img)) Storage::delete($old_img);
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

    public function destroyMeasurement(Request $request)
    {
        // IDが渡ってくるので全て取得する
        $id = $request->input('id');
        // インスタンスを生成して削除
        $measurement = Measurement::find($id);
        $measurement->delete();
        // レスポンスを返却
        return response()->json(['delete' => true, 'message' => '商品サイズの削除を完了しました'], 200);
    }

    public function destroySku(Request $request)
    {
        // IDが渡ってくるので全て取得する
        $id = $request->input('id');
        // インスタンスを生成して削除
        $sku = Sku::find($id);
        $sku->delete();
        // レスポンスを返却
        return response()->json(['delete' => true, 'message' => '商品SKUの削除を完了しました'], 200);
    }

    public function destroyImage(Request $request)
    {
        // IDが渡ってくるので全て取得する
        $id = $request->input('id');
        // インスタンスを生成して削除
        $image = Image::find($id);
        $image->delete();
        // レスポンスを返却
        return response()->json(['delete' => true, 'message' => '商品画像の削除を完了しました'], 200);
    }

   public function csvExport(Request $request)
   {
       // 複数のIDが渡ってくるので全て取得する
       $id = $request->all();

        // 該当のIDのユーザーを取得
       $items = Item::whereIn('id', $id)->select(['items.id', 'is_published', 'product_number', 'item_name', 'price', 'cost', 'made_in', 'mixture_ratio', 'brand_id','admin_id', 'posted_at', 'modified_at'])->with([
            'skus.color:id,color_name',
            'skus.size:id,size_name',
            'brand:id,brand_name',
            'categories:id,category_name',
            'tags:id,tag_name',
            'admin:id,last_name,first_name,last_name_kana,first_name_kana',
        ])->cursor();

       // クロージャの中でエラーが起きても、streamDownloadを呼んだ時点でもうヘッダーとかが返っているのでエラーレスポンスが返せない。
       return response()->streamDownload(function () use ($items) {
           // CSVのヘッダー作成
           $csv_header = ['No', 'ID', '公開状況', '品番', '商品名', '価格', '原価', 'カラー展開', 'サイズ展開', '生産国', '混用率', 'ブランドカテゴリ', '性別カテゴリ', 'メインカテゴリ', 'サブカテゴリ', 'タグ', '最終更新者', '投稿日', '更新日'];
           // SplFileObjectのインスタンスを生成
           $file = new \SplFileObject('php://output', 'w');
           // EXCEL(デフォルトがShift-JIS形式)で開いた時に日本語が文字化けしないように、UTF-8のBOM付きにするためにBOMを書き込み
           $file->fwrite(pack('C*',0xEF,0xBB,0xBF));
           // ヘッダーの読み込み
           $file->fputcsv($csv_header);
           // 一行ずつ連想配列から値を取り出して配列に格納
           $num = 1;
           foreach ($items as $item){
               $file->fputcsv([
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
                   $item->admin->full_name.'('.$item->admin->full_name_kana.')',
                   $item->posted_at !== null ? $item->posted_at->format('Y-m-d'): '　　',
                   $item->modified_at !== null ? $item->modified_at->format('Y-m-d'): '　　',
               ]);
               $num++;
           }
       }, '商品情報出力.csv', [
           'Content-Type' => 'text/csv'
       ]);
   }
}
