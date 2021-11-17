<?php
namespace Database\Seeders;

use App\Models\Item;
use GuzzleHttp\Client;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ImagesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;'); // 一時的に外部キー制約を無効化

        DB::table('images')->truncate(); // テーブルごと削除して再構築

        // Yahoo商品検索API パラメータ
        $appid = config('services.yahoo.app_id'); // APIキー ＊config:cacheコマンドで.envが読み込まれなくなってしまうのでconfigヘルパ関数で呼び出す
        $results = 1; // 取得件数
        $genre_category_id = '37019,37052,36861,36913,36887,36903,36571,36583,36504,36624,48271'; // カテゴリを絞ってシューズ・アクセサリ・バッグ等の余計なデータが入らない様にする
        $seller_id = 'zozo'; // ストアID
        $brand_id = '2049,33911,9930'; // ブランドID * UNITED ARROWS: 2049, UNITED TOKYO: 33911, nano・universe: 9930

        // 商品を全件取得
        $items = Item::all();

        // 配列の初期化
        $images = [];

        // for文で展開
        for($i = 0; $i < count($items); $i++) {

            // ブランド品番(product_number)をクエリにしこむ
            $query = $items[$i]->product_number;

            // urlの生成 ＊ yahooのAPIはパラメータをエンコードしてリクエスト投げるとエラーになるので要注意
            $url = 'https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?appid='.$appid.'&results='.$results.'&query='.$query.'&seller_id='.$seller_id.'&brand_id='.$brand_id.'&genre_category_id='.$genre_category_id;

            // Clientクラスを初期化
            $client = new Client();

            // 引数（メソッド、url）でリクエストする。
            $response = $client->request('GET', $url);

            // $response->getBody()でGuzzleHttp\Psr7\Streamクラスのオブジェクトを取得し、getContents()で文字列に変換してからjson_decodeで変換 * 第二引数にtrueで連想配列を指定して変換
            $response_data = json_decode($response->getBody()->getContents(), true);

            // 商品画像のURLを取得
            $img_url = $response_data['hits'][0]['image']['medium'];

            // https://item-shopping.c.yimg.jp/i/g/画像ID　の形で返ってくるがこのままだとサイズが小さい　→　/g/の部分で引き出す画像の大きさを調整している様なのでURLを書き換える　a < z
            $replaced_img_url = str_replace('/g/', '/f/', $img_url);

            $images[$i] = [
                'item_id' => $items[$i]->id,
                'image' => $replaced_img_url,
                'image_category' => 1, // 0: メイン画像, 1: サムネイル画像 *Yahoo商品検索APIではサムネイル画像は取得出来ないのでメイン画像だけ登録する
                'created_at' => !is_null($items[$i]->posted_at)? $items[$i]->posted_at: '2010-04-01 00:00:00',
                'updated_at' => !is_null($items[$i]->modified_at)? $items[$i]->modified_at: '2010-04-01 00:00:00',
            ];
        }

        DB::table('images')->insert($images); // データの挿入

        DB::statement('SET FOREIGN_KEY_CHECKS=1;'); // 外部キー制約を有効化
    }
}
