<?php
namespace Database\Seeders;

use App\Models\Item;
use App\Models\Color;
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

            // yahoo APIでは商品に関する詳細情報がbrタグを挟んで文字列で帰ってくるのでexplode()で配列にする
            $item_detail = explode('<br>', $response_data['hits'][0]['description']);

            // preg_grep()で配列内の文字列を部分一致検索してマッチした配列を抽出
            $color_array = preg_grep("/^カラー:/", $item_detail);

            // preg_grep()で取り出された配列は元の配列のインデックスが保持された状態で帰ってくるので,array_shift()で配列の最初の要素を文字列として取り出し、substr()で「カラー:」以降を切り出す
            $color = mb_substr(array_shift($color_array), 4);

            // mb_convert_kana() で全角を半角に変換し、str_replace()でスペースを削除してカンマ区切りで配列に変換
            $color = explode(',', str_replace([' ','　'], '', mb_convert_kana($color, 'a', 'UTF-8')));

            // colorモデルに登録されているものと一致するものをインスタンスで取得
            $color_instance = Color::select('id')->where('color_name', $color[0])->first();

            // 商品画像のURLを取得
            $img_url = $response_data['hits'][0]['image']['medium'];

            // https://item-shopping.c.yimg.jp/i/g/画像IDの形で返ってくるがこのままだとサイズが小さい→/g/の部分で引き出す画像の大きさを調整している様なのでURLを書き換えるa < z
            $replaced_img_url = str_replace('/g/', '/f/', $img_url);

            $images[$i] = [
                'item_id' => $items[$i]->id,
                'color_id' => $color_instance->id,
                'image' => $replaced_img_url,
                'image_category' => 0, // 0: メイン画像, 1: サムネイル画像 *Yahoo商品検索APIではサムネイル画像は取得出来ないのでメイン画像だけ登録する
                'created_at' => !is_null($items[$i]->posted_at)? $items[$i]->posted_at: '2010-04-01 00:00:00',
                'updated_at' => !is_null($items[$i]->modified_at)? $items[$i]->modified_at: '2010-04-01 00:00:00',
            ];
        }

        DB::table('images')->insert($images); // データの挿入

        DB::statement('SET FOREIGN_KEY_CHECKS=1;'); // 外部キー制約を有効化
    }
}
