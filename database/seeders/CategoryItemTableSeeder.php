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
        $appid = config('services.yahoo.app_id'); // APIキー　＊config:cacheコマンドで.envが読み込まれなくなってしまうのでconfigヘルパ関数で呼び出す
        $results = 1; // 取得件数
        $genre_category_id = '37019,37052,36861,36913,36887,36903,36571,36583,36504,36624,48271'; // カテゴリを絞ってシューズ・アクセサリ・バッグ等の余計なデータが入らない様にする
        $seller_id = 'zozo'; // ストアID
        $brand_id = '2049,33911,9930'; // ブランドID * UNITED ARROWS: 2049, UNITED TOKYO: 33911, nano・universe: 9930

        // 商品を全件取得
        $items = Item::all();

        // 配列の初期化
        $category_item = [];

        // カテゴリの連想配列
        $category1_arr = array( 36504 => 3 , 36583 => 4 , 36571 => 4 , 36624 => 5 , 48271 => 6 , 36861 => 7 , 37019 => 8 , 37052 => 8 , 36913 => 9 , 36903 => 10 , 36887 => 11 );
        $category2_arr = array(
            36505 => 12, 48269 => 13, 36532 => 14, 36554 => 15, 36559 => 16, 36540 => 17, 36550 => 18, 36535 => 19, 36541 => 20, 36531 => 21, 36530 => 21,
            36584 => 22, 36587 => 23, 36596 => 24, 48262 => 25, 36588 => 26, 36590 => 27, 48263 => 28, 36580 => 29, 36608 => 29, 36582 => 30, 36609 => 30,
            36579 => 31, 36591 => 32, 36575 => 33, 36572 => 34, 36574 => 35, 36573 => 36, 36597 => 37, 36592 => 38, 36593 => 39, 36601 => 40, 36581 => 40,
            36577 => 40, 48259 => 40, 36578 => 40, 48264 => 40, 36595 => 40, 36697 => 40, 36599 => 40, 36589 => 40, 36598 => 40, 36625 => 41, 36638 => 42,
            36650 => 43, 36645 => 44, 36652 => 45, 36653 => 46, 48288 => 47, 36658 => 48, 36655 => 49, 36651 => 50, 36639 => 51, 36644 => 52, 36656 => 52,
            36659 => 52, 36997 => 55, 36938 => 56, 36912 => 57, 36862 => 58, 36929 => 59, 36989 => 60, 36975 => 61, 36926 => 62, 36906 => 63, 36914 => 64,
            36999 => 65, 36909 => 66, 36928 => 67, 37060 => 68, 37061 => 69, 37064 => 70, 37066 => 71, 37062 => 72, 48222 => 73, 37056 => 74, 48221 => 74,
            48223 => 75, 48224 => 76, 37029 => 76, 48220 => 77, 48218 => 77, 37028 => 78, 37032 => 79, 37023 => 80, 37020 => 81, 37025 => 82, 37021 => 83,
            37068 => 84, 37070 => 85, 37067 => 86, 37065 => 87, 37057 => 87, 37058 => 87, 37031 => 87, 37030 => 87, 48219 => 87, 48249 => 87, 37039 => 87,
            37038 => 87, 37063 => 87, 37073 => 88, 37072 => 89, 36919 => 90, 37083 => 91, 36922 => 92, 37099 => 93, 37091 => 94, 37084 => 95, 37101 => 96,
            37094 => 97, 37093 => 98, 37097 => 99, 37085 => 100, 37098 => 101, 37077 => 102, 37156 => 103, 48228 => 104, 36893 => 105, 37013 => 106
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
