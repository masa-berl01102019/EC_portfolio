<?php
namespace Database\Seeders;

use App\Models\Item;
use GuzzleHttp\Client;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoryItemTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;'); // 一時的に外部キー制約を無効化

        DB::table('category_item')->truncate(); // テーブルごと削除して再構築

        // Yahoo商品検索API パラメータ
        $appid = config('services.yahoo.app_id'); // APIキー ＊config:cacheコマンドで.envが読み込まれなくなってしまうのでconfigヘルパ関数で呼び出す
        $results = 1; // 取得件数
        $genre_category_id = '37019,37052,36861,36913,36887,36903,36571,36583,36504,36624,48271'; // カテゴリを絞ってシューズ・アクセサリ・バッグ等の余計なデータが入らない様にする
        $seller_id = 'zozo'; // ストアID
        $brand_id = '2049,33911,9930'; // ブランドID * UNITED ARROWS: 2049, UNITED TOKYO: 33911, nano・universe: 9930

        // 商品を全件取得
        $items = Item::all();

        // 配列の初期化
        $category_item = [];

        // カテゴリの連想配列
        $category1_arr = array( 36504 => 3 , 36583 => 4 , 36571 => 5 , 36624 => 6 , 48271 => 7 , 36861 => 8 , 37052 => 9 , 37019 => 10 , 36913 => 11 , 36903 => 12 , 36887 => 13 );       
        $category2_arr = array(
            // men's tops
            36505 => 14, 48269 => 15, 36532 => 16, 36535 => 17, 36541 => 18, 36554 => 19, 36559 => 20, 36540 => 21, 36550 => 22, 36531 => 23, 36530 => 23,
                // men's tops children
                36507 => 14, 36508 => 14, 36509 => 14,
                36536 => 17, 36537 => 17, 36538 => 17,
                36551 => 22, 36552 => 22, 48270 => 22,
            // men's jakect
            36584 => 24, 48262 => 25, 36587 => 26, 36589 => 27, 36596 => 28, 36588 => 29, 36590 => 30, 36609 => 31, 36608 => 32, 48263 => 32, 36597 => 33, 36592 => 34, 36593 => 35, 48264 => 36, 36601 => 36, 36697 => 36,  36599 => 36, 36595 => 36, 36598 => 36,
            // men's coat
            36579 => 37, 36591 => 38, 36575 => 39, 36572 => 40, 36574 => 41, 36573 => 42, 36582 => 43, 36580 => 44, 36578 => 45, 36577 => 45, 36581 => 45, 48259 => 45,
            // men's pants
            36625 => 46, 36645 => 47, 36650 => 48, 36638 => 49, 36652 => 50, 36655 => 51, 48288 => 52, 36653 => 53, 36651 => 54, 36639 => 55, 36658 => 56, 36659 => 57, 36644 => 57, 36656 => 57,
            // men's all-in-one

            // ladies tops
            36997 => 59, 36938 => 60, 36912 => 61, 36862 => 62, 36929 => 63, 36989 => 64, 36975 => 65, 36926 => 66, 36906 => 67, 36914 => 68, 36999 => 69, 36909 => 70, 36928 => 71,
                // ladies tops children
                36864 => 62, 36865 => 62, 36866 => 62, 
                36992 => 64, 36991 => 64, 36990 => 64, 
                36977 => 65, 36978 => 65, 36976 => 65, 36979 => 65, 
                36995 => 66, 36994 => 66, 36927 => 66, 36996 => 66, 
                37001 => 69, 37005 => 69, 
                36910 => 70, 36911 => 70, 
            // ladies jakect
            37060 => 72, 37061 => 73, 37064 => 74, 37063 => 75, 37066 => 76, 48222 => 77, 48221 => 78, 37056 => 78, 48220 => 79, 48223 => 80, 48224 => 80, 37068 => 81, 37070 => 82, 37067 => 83, 37058 => 84, 37057 => 84, 37065 => 84, 37062 => 84,
            // ladies coat
            37028 => 85, 37032 => 86, 37023 => 87, 37020 => 88, 37025 => 89, 37021 => 90, 48218 => 91, 37029 => 92, 37022=> 93, 37039 => 94, 37031 => 94, 48249 => 94, 37038 => 94, 37030 => 94, 48219 => 94,
            // ladies pants
            36919 => 95, 37097 => 96, 37083 => 97, 36922 => 98, 37099 => 99, 37084 => 100, 37094 => 101, 37091 => 102, 37085 => 103, 37093 => 104, 37073 => 105, 37072 => 106, 37101 => 107, 37077 => 108, 37098 => 108,
                // ladies pants children
                37074 => 105, 37075 => 105, 37076 => 105, 
            // ladies all-in-one
            37156 => 109, 48228 => 109,
            // ladies one piece
            37013 => 110, 36893 => 111
        );

        // for文で展開
        foreach($items as $item) {

            // ブランド品番(product_number)をクエリにしこむ
            $query = $item->product_number;

            // urlの生成　＊ yahooのAPIはパラメータをエンコードしてリクエスト投げるとエラーになるので要注意
            $url = 'https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?appid='.$appid.'&results='.$results.'&query='.$query.'&seller_id='.$seller_id.'&brand_id='.$brand_id.'&genre_category_id='.$genre_category_id;

            // Clientクラスを初期化
            $client = new Client();

            // 引数（メソッド、url）でリクエストする。
            $response = $client->request('GET', $url);

            // $response->getBody()でGuzzleHttp\Psr7\Streamクラスのオブジェクトを取得し、getContents()で文字列に変換してからjson_decodeで変換 * 第二引数にtrueで連想配列を指定して変換
            $response_data = json_decode($response->getBody()->getContents(), true);

            // 商品カテゴリIDを取得
            $genre = $response_data['hits'][0]['parentGenreCategories'][1]['id']; // 性別カテゴリ
            $item1 = $response_data['hits'][0]['parentGenreCategories'][2]['id']; // 大カテゴリ
            $item2 = $response_data['hits'][0]['genreCategory']['id'];            // 小カテゴリ

            $categoryId1 = $genre == 2494 ? 2 : 1;
            $categoryId2 = null;
            $categoryId3 = null;

            foreach($category1_arr as $key => $value) {
                if($key == $item1) {
                    $categoryId2 = $value;
                }
            }

            foreach($category2_arr as $key => $value) {
                if($key == $item2) {
                    $categoryId3 = $value;
                }
            }

            // 配列に格納
            $array = array(
                $categoryId1,
                $categoryId2,
                $categoryId3
            );

            // false要素の削除
            $arr = array_filter($array);

            for($n = 0; $n < count($arr); $n++) {
                $category_item[] = [
                    'item_id' => $item->id,
                    'category_id' => $array[$n],
                ];
            }
        }

        DB::table('category_item')->insert($category_item); // データの挿入

        DB::statement('SET FOREIGN_KEY_CHECKS=1;'); // 外部キー制約を有効化
    }
}
