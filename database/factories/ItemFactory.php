<?php

namespace Database\Factories;

use App\Models\Item;
use App\Models\Admin;
use App\Models\Brand;
use GuzzleHttp\Client;
use Illuminate\Database\Eloquent\Factories\Factory;

class ItemFactory extends Factory
{
    protected $model = Item::class;

    public function definition()
    {
        // 配列の初期化
        $response_data = [];

        // 一度に取得出来る商品リストは100件までかつ1分間に30リクエストまで
        for ($i = 0; $i < 5; $i++) {
            // Yahoo商品検索API パラメータ https://developer.yahoo.co.jp/webapi/shopping/shopping/v3/itemsearch.html
            $appid = config('services.yahoo.app_id'); // APIキー ＊config:cacheコマンドで.envが読み込まれなくなってしまうのでconfigヘルパ関数で呼び出す
            $results = 100; // 取得件数
            $start = ($results * $i) + 1; // 取得開始位置 1 101 201 
            $genre_category_id = '37019,37052,36861,36913,36887,36903,36571,36583,36504,36624,48271'; // カテゴリを絞ってシューズ・アクセサリ・バッグ等の余計なデータが入らない様にする
            $seller_id = 'zozo'; // ストアID
            $brand_id = '2049,33911,9930'; // ブランドID * UNITED ARROWS: 2049, UNITED TOKYO: 33911, nano・universe: 9930

            // urlの生成 ＊ yahooのAPIはパラメータをエンコードしてリクエスト投げるとエラーになるので要注意
            $url = 'https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?appid=' . $appid . '&results=' . $results . '&seller_id=' . $seller_id . '&brand_id=' . $brand_id . '&genre_category_id=' . $genre_category_id . '&start=' . $start;

            // Clientクラスを初期化  
            $client = new Client();

            // 引数（メソッド、url）でリクエストする。
            $response = $client->request('GET', $url);

            // $response->getBody()でGuzzleHttp\Psr7\Streamクラスのオブジェクトを取得し、getContents()で文字列に変換してからjson_decodeで変換 * 第二引数にtrueで連想配列を指定して変換
            $response_data = array_merge($response_data, json_decode($response->getBody()->getContents(), true)['hits']);
        }

        // 配列の初期化
        $color_masters = [];
        $size_masters = [];
        $items = [];
        $item_image = [];
        $item_measurements = [];
        $item_colors = [];
        $category_item = [];

        for ($i = 0; $i < count($response_data); $i++) {

            // yahoo APIでは商品に関する詳細情報がbrタグを挟んで文字列で帰ってくるのでexplode()で配列にする
            $item_detail = explode('<br>', $response_data[$i]['description']);

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

            // 上記同様にカラーも取得
            $color_array = preg_grep("/^カラー:/", $item_detail);
            $color = mb_substr(array_shift($color_array), 4);

            // 上記同様にサイズも取得
            $size_array = preg_grep("/^サイズ:/", $item_detail);
            $size = mb_substr(array_shift($size_array), 4);


            // mb_convert_kana() で全角を半角に変換し、str_replace()でスペースを削除
            $color = str_replace([' ', '　'], '', mb_convert_kana($color, 'a', 'UTF-8'));

            // 画像のカラー用に先頭のカラーを変数に格納しておく
            $img_color = explode(',', $color)[0];

            // 品番ごとに紐づくサイズを配列で変数に格納
            $item_color = explode(',', $color);

            // 複数のカラーの文字列をカンマ区切りでexplode()で配列化して$colorsにマージする
            $color_masters = array_merge($color_masters, explode(',', $color));


            // 商品品番に紐づくカラーを配列に格納
            $item_colors[(string)$product_number] = array_values(array_unique($item_color));


            // 商品画像のURLを取得
            $img_url = $response_data[$i]['image']['medium'];
            // https://item-shopping.c.yimg.jp/i/g/画像IDの形で返ってくるがこのままだとサイズが小さい→/g/の部分で引き出す画像の大きさを調整している様なのでURLを書き換えるa < z
            $replaced_img_url = str_replace('/g/', '/f/', $img_url);

            // 商品品番に紐づく画像を配列に格納
            $item_image[(string)$product_number] = [
                'color_name' => $img_color, // カラー名
                'image' => $replaced_img_url,
                // Yahoo商品検索APIではサムネイル画像は取得出来ないのでメイン画像だけ登録する
            ];


            // mb_convert_kana() で全角を半角に変換し、str_replace()でスペースを削除
            $size = str_replace([' ', '　'], '', mb_convert_kana($size, 'a', 'UTF-8'));

            // 品番ごとに紐づくサイズを配列で変数に格納
            $item_size = explode(',', $size);

            // 複数のカラーの文字列をカンマ区切りでexplode()で配列化して$colorsにマージする
            $size_masters = array_merge($size_masters, explode(',', $size));


            // 商品品番に紐づく寸法を配列に格納
            $item_measurements[(string)$product_number] = array_values(array_unique($item_size));


            // ランダムに管理者インスタンスを取得
            $admin = Admin::inRandomOrder()->first();

            // ブランドID取得
            $brand_id = Brand::where('brand_name', $response_data[$i]['brand']['name'])->first()->id;

            // 公開状況 80%の確率で公開
            $is_published = $this->faker->optional($weight = 0.2, $default = 1)->numberBetween($min = 0, $max = 1); // 0: 未公開 1: 公開 
            $is_published = $this->faker->optional($weight = 0.2, $default = 1)->numberBetween($min = 0, $max = 1); // 0: 未公開 1: 公開 
            $is_published = $this->faker->optional($weight = 0.2, $default = 1)->numberBetween($min = 0, $max = 1); // 0: 未公開 1: 公開 

            // 公開日
            $posted_at = $this->faker->dateTimeBetween($startDate = '-10 years', $endDate = 'now', $timezone = null);

            // 更新日
            $modified_at = $this->faker->dateTimeBetween($startDate = $posted_at, $endDate = 'now', $timezone = null);

            // デモデータに必要な項目を配列に格納
            $items[] = [
                'brand_id' => $brand_id,
                'admin_id' => $admin->id,
                'item_name' => $response_data[$i]['name'],
                'product_number' => $product_number,
                'price' => $response_data[$i]['price'],
                'cost' => intval($response_data[$i]['price'] * (rand(28, 50) / 100)), // 下代の掛け率28 ~ 50%で設定
                'description' => $this->faker->text($maxNbChars = 200),
                'mixture_ratio' => $mixture_ratio,
                'made_in' => $made_in,
                'is_published' => $is_published,
                'posted_at' => $is_published === 1 ? $posted_at : null,
                'modified_at' => $is_published === 1 ? $modified_at : null,
            ];

            // カテゴリの連想配列
            $category1_arr = config('define.main_category');
            $category2_arr = config('define.sub_category');

            // 商品カテゴリIDを取得
            $genre = $response_data[$i]['parentGenreCategories'][1]['id']; // 性別カテゴリ
            $item1 = !empty($response_data[$i]['parentGenreCategories'][2]) ? $response_data[$i]['parentGenreCategories'][2]['id'] : null; // 大カテゴリ
            $item2 = !empty($response_data[$i]['parentGenreCategories'][2]) ? $response_data[$i]['genreCategory']['id'] : null;            // 小カテゴリ

            $categoryId1 = $genre == 2494 ? 2 : 1;
            $categoryId2 = null;
            $categoryId3 = null;

            foreach ($category1_arr as $key => $value) {
                if ($key == $item1) {
                    $categoryId2 = $value;
                }
            }

            foreach ($category2_arr as $key => $value) {
                if ($key == $item2) {
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

            // 商品品番に紐づく寸法を配列に格納
            $category_item[(string)$product_number] = $arr;
        }

        // 配列内の重複を削除
        $color_masters = array_values(array_unique($color_masters));

        // 配列内の重複を削除
        $size_masters = array_values(array_unique($size_masters));

        return [
            'color_masters' => $color_masters,
            'size_masters' => $size_masters,
            'items' => $items,
            'item_image' => $item_image,
            'item_measurements' => $item_measurements,
            'item_colors' => $item_colors,
            'category_item' => $category_item
        ];
    }
}
