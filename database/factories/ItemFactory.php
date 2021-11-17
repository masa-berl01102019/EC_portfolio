<?php
namespace Database\Factories;

use App\Models\Admin;
use App\Models\Item;
use GuzzleHttp\Client;
use Illuminate\Database\Eloquent\Factories\Factory;

class ItemFactory extends Factory
{
    protected $model = Item::class;

    public function definition()
    {
        // Yahoo商品検索API パラメータ
        $appid = config('services.yahoo.app_id'); // APIキー　＊config:cacheコマンドで.envが読み込まれなくなってしまうのでconfigヘルパ関数で呼び出す
        $results = 1; // 取得件数
        $start = rand(0, 998); // 取得開始位置
        $genre_category_id = '37019,37052,36861,36913,36887,36903,36571,36583,36504,36624,48271'; // カテゴリを絞ってシューズ・アクセサリ・バッグ等の余計なデータが入らない様にする
        $query = '';
        $seller_id = 'zozo'; // ストアID
        $brand_id = '2049,33911,9930'; // ブランドID * UNITED ARROWS: 2049, UNITED TOKYO: 33911, nano・universe: 9930

        // urlの生成　＊ yahooのAPIはパラメータをエンコードしてリクエスト投げるとエラーになるので要注意
        $url = 'https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?appid='.$appid.'&results='.$results.'&query='.$query.'&seller_id='.$seller_id.'&brand_id='.$brand_id.'&genre_category_id='.$genre_category_id.'&start='.$start;

        // Clientクラスを初期化
        $client = new Client();

        // 引数（メソッド、url）でリクエストする。
        $response = $client->request('GET', $url);

        // $response->getBody()でGuzzleHttp\Psr7\Streamクラスのオブジェクトを取得し、getContents()で文字列に変換してからjson_decodeで変換 * 第二引数にtrueで連想配列を指定して変換
        $response_data = json_decode($response->getBody()->getContents(), true);

        // 配列の初期化
        $items = [];

        for($i = 0; $i < $results; $i++) {

            // yahoo APIでは商品に関する詳細情報がbrタグを挟んで文字列で帰ってくるのでexplode()で配列にする
            $item_detail = explode('<br>', $response_data['hits'][$i]['description']);

            // preg_grep()で配列内の文字列を部分一致検索してマッチした配列を抽出
            $made_in_array = preg_grep("/^原産国:/", $item_detail);
            // preg_grep()で取り出された配列は元の配列のインデックスが保持された状態で帰ってくるので,array_shift()で配列の最初の要素を文字列として取り出し、substr()で「原産国:」以降を切り出す
            $made_in = mb_substr(array_shift($made_in_array), 4);

            // 上記同様に混用率も取得
            $mixture_ratio_array = preg_grep("/^素材:/", $item_detail);
            $mixture_ratio = mb_substr(array_shift($mixture_ratio_array), 3);

            // 上記同様にブランド品番も取得
            $product_number_array = preg_grep("/^ブランド品番:/", $item_detail);
            $product_number = mb_substr(array_shift($product_number_array), 7);

            // デモデータに必要な項目を配列に格納
            $items[] = [
                'brand_id' => $response_data['hits'][$i]['brand']['id'],
                'brand_name' => $response_data['hits'][$i]['brand']['name'],
                'item_name' => $response_data['hits'][$i]['name'],
                'product_number' => $product_number,
                'price' => $response_data['hits'][$i]['price'],
                'mixture_ratio' => $mixture_ratio,
                'made_in' => $made_in,
            ];
        }

        // 管理者IDをすべて配列で取得
        $admins_id = Admin::pluck('id')->all();

        // ランダムで管理者IDを一つ取り出し
        $admin_id = $this->faker->randomElement($admins_id);

        // APIのデータに合わせてブランドIDを格納
        if($items[0]['brand_name'] === 'UNITED ARROWS') {
            $brand_id = 1;
        } elseif ($items[0]['brand_name'] === 'UNITED TOKYO') {
            $brand_id = 2;
        } else {
            $brand_id = 3;
        }

        // 公開状況
        $is_published = $this->faker->numberBetween($min = 0, $max = 1); // 0: 未公開　1: 公開

        // 公開日
        $posted_at = $this->faker->dateTimeBetween($startDate = '-10 years', $endDate = 'now', $timezone = null);

        // 更新日
        $modified_at = $this->faker->dateTimeBetween($startDate = $posted_at, $endDate = 'now', $timezone = null);

        return [
            'brand_id' => $brand_id,
            'admin_id' => $admin_id,
            'item_name' => $items[0]['item_name'],
            'product_number' => $items[0]['product_number'],
            'price' => $items[0]['price'],
            'cost' => $items[0]['price'] * (rand(28, 50) / 100), // 下代の掛け率28 ~ 50%で設定
            'description' => $this->faker->realText(),
            'mixture_ratio' => $items[0]['mixture_ratio'],
            'made_in' => $items[0]['made_in'],
            'is_published' => $is_published,
            'posted_at' => $is_published === 1? $posted_at: null,
            'modified_at' => $is_published === 1? $modified_at: null,
        ];
    }
}

// yahoo カテゴリー階層 2021.10.18 時点
// https://shopping.yahooapis.jp/ShoppingWebService/V1/categorySearch?appid=<あなたのアプリケーションID>&category_id=1　
//  2494 レディースファッション
//    37019 コート、アウター
//      37020 ステンカラーコート *
//      37021 チェスターコート *
//      37022 ノーカラーコート
//      37025 トレンチコート *
//      37032 モッズ、ミリタリーコート *
//      37023 Pコート *
//      37028 ダッフルコート *
//      37031 キルティングコート *
//      48218 中綿コート *
//      37029 ダウンコート *
//      48219 ムートンコート *
//      37030 毛皮コート *
//      37038 ケープ、ポンチョ、マント *
//      48249 レインコート、レインウエア *
//      37039 その他コート、アウター *
//    37052 ジャケット
//      37060 テーラード、ブレザー *
//      37061 ノーカラージャケット *
//      37062 ブルゾン、ジャンバー *
//      37063 ライダースジャケット *
//      37064 Gジャン、デニム *
//      48221 MAー1 *
//      48222 カバーオール *
//      37065 フリースジャケット *
//      37066 革ジャン、レザージャケット *
//      37068 マウンテンパーカー *
//      37070 スタジャン *
//      37067 スカジャン *
//      48223 ダウンベスト *
//      48224 ダウンジャケット *
//      37056 モッズ、ミリタリージャケット *
//      37057 ケープ、ポンチョ、マント *
//      37058 キルティングジャケット *
//      48220 中綿ジャケット *
//    36861 トップス
//      36975 シャツ、ブラウス *
//      36989 ポロシャツ *
//      36862 Tシャツ、カットソー *
//      36999 カーディガン、ボレロ *
//      36997 アンサンブル *
//      36926 ニット、セーター *
//      36909 ベスト、ジレ *
//      36906 パーカー *
//      36914 トレーナー *
//      36929 タンクトップ *
//      36938 キャミソール *
//      36912 チューブトップ、ベアトップ *
//      36928 その他トップス *
//    36913 ボトムス、パンツ
//      37073 スカート *
//      37072 キュロット *
//      36919 ジーンズ、デニム *
//      37083 チノパンツ *
//      36922 スラックス *
//      37099 テーパードパンツ *
//      37091 クロップドパンツ、サブリナ *
//      37084 スキニー、レギパン *
//      37101 ガウチョパンツ *
//      37097 カーゴパンツ *
//      37094 ワイド、バギーパンツ *
//      37085 ショート、ハーフパンツ *
//      37093 サルエルパンツ *
//      37098 サロペット、オーバーオール *
//      37077 その他ボトムス、パンツ *
//    36887 ワンピース、チュニック
//      37013 チュニック *
//      36893 ワンピース *
//    36903 オールインワン、セットアップ
//      37156 セットアップ *
//      48228 オールインワン *

//  2495 メンズファッション
//    36571 コート、アウター
//      36580 ダウンコート *
//      36582 中綿コート *
//      48259 キルティングコート *
//      36579 ダッフルコート *
//      36575 Pコート *
//      36572 ステンカラーコート *
//      36573 チェスターコート *
//      36574 トレンチコート *
//      36591 モッズ、ミリタリーコート *
//      36577 ムートンコート *
//      36581 毛皮コート *
//      36578 その他コート、アウター *
//    36583 ジャケット
//      36584 テーラード、ブレザー *
//      48262 コーチジャケット *
//      36587 Gジャン、デニム *
//      36588 カバーオール *
//      36589 ライダースジャケット *
//      36590 モッズ、ミリタリージャケット *
//      36592 スタジャン *
//      36593 スカジャン *
//      36595 フリースジャケット *
//      36598 スイングトップ *
//      36597 マウンテンパーカー *
//      36596 革ジャン、レザージャケット *
//      36601 ムートンジャケット *
//      36608 ダウンジャケット *
//      36609 中綿ジャケット *
//      48263 ダウンベスト *
//      48264 キルティングジャケット *
//      36697 カジュアルスーツ *
//      36599 その他ジャケット *
//    36504 トップス
//      36541 ニット、セーター *
//      36535 シャツ、カジュアルシャツ *
//      36540 カーディガン *
//      36554 パーカー *
//      36559 トレーナー *
//      36505 Tシャツ、カットソー　*
//      48269 タンクトップ *
//      36532 ポロシャツ *
//      36531 ラガーシャツ *
//      36550 ベスト、ジレ *
//      36530 その他トップス *
//    36624 ボトムス、パンツ
//      36625 ジーンズ、デニム *
//      36638 スラックス *
//      36650 チノパンツ *
//      36644 ワーク、ペインターパンツ *
//      36645 カーゴパンツ *
//      36652 テーパードパンツ *
//      36653 ワイド、バギーパンツ *
//      48288 ジョガーパンツ *
//      36658 サルエルパンツ *
//      36655 スキニー、スリムパンツ *
//      36651 クロップドパンツ *
//      36639 ショート、ハーフパンツ *
//      36656 オーバーオール *
//      36659 その他ボトムス、パンツ *
//    48271 つなぎ、オールインワン
