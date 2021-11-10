<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\admin\ItemCategoryEditRequest;
use App\Http\Requests\admin\ItemEditRequest;
use App\Http\Requests\admin\ItemImageEditRequest;
use App\Http\Requests\admin\ItemMeasurementEditRequest;
use App\Http\Requests\admin\ItemRegisterRequest;
use App\Http\Requests\admin\ItemSkuEditRequest;
use App\Http\Requests\admin\ItemTagEditRequest;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Color;
use App\Models\Item;
use App\Models\Measurement;
use App\Models\Size;
use App\Models\Sku;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ItemController extends Controller
{
    // TODO Resource APIでレスポンスの返却形式を決めるか要検討
    // TODO フリーワード検索でカラムを指定受けて検索をかける仕様にするか要検討
    // TODO whereHasは処理が重すぎる場合はIN句を使った絞り込みのSQLに変更を検討

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
            //　取得件数が指定されていた場合はpaginationに引数としてわたしてあげる * 数字にキャストしないと返り値が文字列になってしまうので注意
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

//    public function create()
//    {
//        // とりあえずなんか返す
//        return response()->json(['read' => true],200);
//    }
//
//    public function store(ItemRegisterRequest $request)
//    {
//        // ブラウザで不正に仕込んだinputに対してaxios側で制御出来ない上、フォームリクエストを通過してしまうので
//        //　ホワイトリスト以外のカラム名は受け付けないように制御　＊　{last_name: 髙田, first_name: 清雅} の形でPOSTされてくる
//        $data = $request->only($this->form_items);
//
//        // DBに登録
//        Item::create([
//            'last_name' => $data['last_name'],
//            'first_name' => $data['first_name'],
//            'last_name_kana' => $data['last_name_kana'],
//            'first_name_kana' => $data['first_name_kana'],
//            'gender' => $data['gender'],
//            'birthday' => $data['birthday'],
//            'post_code' => $data['post_code'],
//            'prefecture' => $data['prefecture'],
//            'municipality' => $data['municipality'],
//            'street_name' => $data['street_name'],
//            'street_number' => $data['street_number'],
//            'building' => $data['building'],
//            'delivery_post_code' => $data['delivery_post_code'],
//            'delivery_prefecture' => $data['delivery_prefecture'],
//            'delivery_municipality' => $data['delivery_municipality'],
//            'delivery_street_name' => $data['delivery_street_name'],
//            'delivery_street_number' => $data['delivery_street_number'],
//            'delivery_building' => $data['delivery_building'],
//            'tel' => $data['tel'],
//            'email' => $data['email'],
//            'password' => Hash::make($data['password']),
//            'is_received' => $data['is_received'],
//        ]);
//        // レスポンスを返却
//        return response()->json(['create' => true, 'message' => '商品の新規登録を完了しました'], 200);
//    }
//
    public function edit($item)
    {
        $item = Item::where('id', $item)->select(['items.id', 'is_published', 'product_number', 'description', 'item_name', 'price', 'cost', 'made_in', 'mixture_ratio', 'brand_id'])->with([
            'skus:id,item_id,color_id,size_id,quantity,created_at,updated_at',
            'categories:id,category_name',
            'tags:id,tag_name',
            'images:id,item_id,image,image_category',
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
        // ホワイトリストの作成
        $form_items = [ 'item_name', 'product_number', 'price', 'cost', 'description', 'mixture_ratio', 'made_in', 'is_published' ];
        // 初回登録時に非公開の状態で保存されている場合もあるのでカラム名の出し分け
        $registered_date = $item->posted_at !== null ? 'modified_at': 'posted_at';
        // 項目制限
        $data = $request->only($form_items);
        // 編集項目をDBに保存
        $item->fill([
            'admin_id' => Auth::guard('admin')->id(),
            'item_name' => $data['item_name'],
            'product_number' => $data['product_number'],
            'price' => $data['price'],
            'cost' => $data['cost'],
            'description' => $data['description'],
            'mixture_ratio' => $data['mixture_ratio'],
            'made_in' => $data['made_in'],
            'is_published' => $data['is_published'],
            $registered_date => $data['is_published'] == 1 ? Carbon::now(): null, // 公開日ベースで更新日を保存したいので条件分岐を追加
        ])->save();
        // レスポンスを返却
        return response()->json(['update' => true, 'message' => '商品基本情報の編集を完了しました'], 200);
    }

    public function updateCategory(ItemCategoryEditRequest $request, Item $item)
    {
        DB::transaction(function () use($request, $item) {
            // ホワイトリストの作成
            $form_items = [ 'brand_id', 'gender_category', 'main_category', 'sub_category' ];
            // 初回登録時に非公開の状態で保存されている場合もあるのでカラム名の出し分け
            $registered_date = $item->posted_at !== null ? 'modified_at': 'posted_at';
            // 項目制限
            $data = $request->only($form_items);
            // 編集項目をDBに保存
            $item->fill([
                'admin_id' => Auth::guard('admin')->id(),
                'brand_id' => $data['brand_id'],
                $registered_date => $item->is_published == 1 ? Carbon::now(): null, // 公開日ベースで更新日を保存したいので条件分岐を追加
            ])->save();
            // 中間テーブルへの保存 ＊ 配列形式でIDを渡して配列外のIDは削除される
            $item->categories()->sync([$data['gender_category'], $data['main_category'], $data['sub_category']]);
            // レスポンスを返却
            return response()->json(['update' => true, 'message' => '商品カテゴリの編集を完了しました'], 200);
        });
    }

    public function updateTag(ItemTagEditRequest $request, Item $item)
    {
        DB::transaction(function () use($request, $item) {
            // ホワイトリストの作成
            $form_items = [ 'tags_id' ];
            // 初回登録時に非公開の状態で保存されている場合もあるのでカラム名の出し分け
            $registered_date = $item->posted_at !== null ? 'modified_at': 'posted_at';
            // 項目制限
            $data = $request->only($form_items);
            // 編集項目をDBに保存
            $item->fill([
                'admin_id' => Auth::guard('admin')->id(),
                $registered_date => $item->is_published == 1 ? Carbon::now(): null, // 公開日ベースで更新日を保存したいので条件分岐を追加
            ])->save();
            // 中間テーブルへの保存 ＊ 配列形式でIDを渡して配列外のIDは削除される
            $item->tags()->sync($data['tags_id']);
            // レスポンスを返却
            return response()->json(['update' => true, 'message' => '商品タグの編集を完了しました'], 200);
        });
    }

    public function updateSku(ItemSkuEditRequest $request, Item $item)
    {
        DB::transaction(function () use($request, $item) {
            // ホワイトリストの作成
            $form_items = [ 'skus' ];
            // 初回登録時に非公開の状態で保存されている場合もあるのでカラム名の出し分け
            $registered_date = $item->posted_at !== null ? 'modified_at': 'posted_at';
            // 項目制限
            $data = $request->only($form_items);
            // 編集項目をDBに保存
            $item->fill([
                'admin_id' => Auth::guard('admin')->id(),
                $registered_date => $item->is_published == 1 ? Carbon::now(): null, // 公開日ベースで更新日を保存したいので条件分岐を追加
            ])->save();
            // 配列形式で複数レコードが返ってくるのでfor文で展開
            for($i = 0; $i < count($data['skus']); $i++) {
                // 該当のレコードのインスタンスを取得
                $skus = Sku::find($data['skus'][$i]['id']);
                // 該当レコードの更新
                $skus->fill($data['skus'][$i])->save();
            }
            // レスポンスを返却
            return response()->json(['update' => true, 'message' => '商品SKUの編集を完了しました'], 200);
        });
    }

    public function updateImage(ItemImageEditRequest $request, Item $item)
    {
        $t = $request->all();

    }

    public function updateMeasurement(ItemMeasurementEditRequest $request, Item $item)
    {
        DB::transaction(function () use($request, $item) {
            // ホワイトリストの作成
            $form_items = [ 'measurements' ];
            // 初回登録時に非公開の状態で保存されている場合もあるのでカラム名の出し分け
            $registered_date = $item->posted_at !== null ? 'modified_at': 'posted_at';
            // 項目制限
            $data = $request->only($form_items);
            // 編集項目をDBに保存
            $item->fill([
                'admin_id' => Auth::guard('admin')->id(),
                $registered_date => $item->is_published == 1 ? Carbon::now(): null, // 公開日ベースで更新日を保存したいので条件分岐を追加
            ])->save();
            // 配列形式で複数レコードが返ってくるのでfor文で展開
            for($i = 0; $i < count($data['measurements']); $i++) {
                // 更新もしくはIDがnull渡ってくるのでない場合はレコードを挿入
                Measurement::updateOrCreate([
                    'id' => $data['measurements'][$i]['id']
                ], $data['measurements'][$i]);
            }
            // レスポンスを返却
            return response()->json(['update' => true, 'message' => '商品サイズの編集を完了しました'], 200);
        });
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
        // 複数のIDが渡ってくるので全て取得する
        $id = $request->input('id');
        // インスタンスを生成して削除
        $measurement = Measurement::find($id);
        $measurement->delete();
        // レスポンスを返却
        return response()->json(['delete' => true, 'message' => '商品サイズの削除を完了しました'], 200);
    }

    public function destroySku(Request $request)
    {
        // 複数のIDが渡ってくるので全て取得する
        $id = $request->input('id');
        // インスタンスを生成して削除
        $Sku = Sku::find($id);
        $Sku->delete();
        // レスポンスを返却
        return response()->json(['delete' => true, 'message' => '商品SKUの削除を完了しました'], 200);
    }

//    public function csvExport(Request $request)
//    {
//        // 複数のIDが渡ってくるので全て取得する
//        $id = $request->all();
//        // 該当のIDのユーザーを取得
//        $items = Item::select(['last_name', 'first_name', 'last_name_kana', 'first_name_kana', 'gender', 'birthday', 'post_code', 'prefecture', 'municipality', 'street_name', 'street_number', 'building', 'delivery_post_code', 'delivery_prefecture', 'delivery_municipality', 'delivery_street_name', 'delivery_street_number', 'delivery_building', 'tel', 'email', 'is_received', 'created_at', 'updated_at' ])
//            ->whereIn('id', $id)->cursor();
//
//        // クロージャの中でエラーが起きても、streamDownloadを呼んだ時点でもうヘッダーとかが返っているのでエラーレスポンスが返せない。
//        return response()->streamDownload(function () use ($items) {
//            // CSVのヘッダー作成
//            $csv_header = ['No','氏名', '氏名（カナ）', '性別', '生年月日', '郵便番号', '住所', '配送先-郵便番号', '配送先-住所', '電話番号', 'メールアドレス', 'DM登録', '作成日時', '更新日時'];
//            //　SplFileObjectのインスタンスを生成
//            $file = new \SplFileObject('php://output', 'w');
//            // EXCEL(デフォルトがShift-JIS形式)で開いた時に日本語が文字化けしないように、UTF-8のBOM付きにするためにBOMを書き込み
//            $file->fwrite(pack('C*',0xEF,0xBB,0xBF));
//            // ヘッダーの読み込み
//            $file->fputcsv($csv_header);
//            // 一行ずつ連想配列から値を取り出して配列に格納
//            $num = 1;
//            foreach ($items as $item){
//                $file->fputcsv([
//                    $num,                                   // NO
//                    $item->full_name,                       // 氏名
//                    $item->full_name_kana,                  // 氏名（カナ）
//                    $item->gender_text,                     // 性別
//                    $item->birthday->format('Y-m-d'),       // 生年月日
//                    $item->post_code_text,                  // 郵便番号
//                    $item->full_address,                    // 住所
//                    $item->delivery_post_code_text,         // 配送先　郵便番号
//                    $item->full_delivery_address,           // 配送先　住所
//                    $item->tel,                             // 電話番号
//                    $item->email,                           // メールアドレス
//                    $item->is_received_text,                // DM登録
//                    $item->created_at,                      // 作成日時
//                    $item->updated_at,                      // 更新日時
//                ]);
//                $num++;
//            }
//
//        }, '顧客情報出力.csv', [
//            'Content-Type' => 'text/csv'
//        ]);
//    }
}
