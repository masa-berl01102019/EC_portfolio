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
        $response_data = [];

        // Api has limit which is up to 100 items at once and up to 30 requests per minute
        for ($i = 0; $i < 5; $i++) {
            // Yahoo SearchItem API parameter info: https://developer.yahoo.co.jp/webapi/shopping/shopping/v3/itemsearch.html
            $appid = config('services.yahoo.app_id'); // API key
            $results = 100; // the number of acquired data
            $start = ($results * $i) + 1; // start position to get data ex) 1 101 201 
            $genre_category_id = '37019,37052,36861,36913,36887,36903,36571,36583,36504,36624,48271'; // Filtering the category to avoid unnecessary data such as shoes, accessories, bags, etc.
            $seller_id = 'zozo'; // shop ID
            $brand_id = '2049,33911,9930'; // brand ID * UNITED ARROWS: 2049, UNITED TOKYO: 33911, nano・universe: 9930
            // Create request url ＊ Not to throw request with encoded parameter
            $url = 'https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?appid=' . $appid . '&results=' . $results . '&seller_id=' . $seller_id . '&brand_id=' . $brand_id . '&genre_category_id=' . $genre_category_id . '&start=' . $start;
            // Initilize Client class  
            $client = new Client();
            // Get data from external API
            $response = $client->request('GET', $url);
            // $response->getBody() return  GuzzleHttp\Psr7\Stream class object
            // getContents() convert GuzzleHttp\Psr7\Stream class object into strings 
            // json_decode() * Return Associative array if second argument is true 
            $response_data = array_merge($response_data, json_decode($response->getBody()->getContents(), true)['hits']);
        }

        $color_masters = [];
        $size_masters = [];
        $items = [];
        $item_image = [];
        $item_measurements = [];
        $item_colors = [];
        $category_item = [];

        for ($i = 0; $i < count($response_data); $i++) {
            // Item detail info will be return string separated by '<br>' in the yahoo API, so make it array by using explode function.
            $item_detail = explode('<br>', $response_data[$i]['description']);
            // Partial match search for strings in arrays and extract it by using preg_grep function 
            // Extract the beginning of the array as strings by using array_shift function,  Extract words after '原産国:' by using mb_substr function
            $made_in_array = preg_grep("/^原産国:/", $item_detail);
            $made_in = mb_substr(array_shift($made_in_array), 4);
            // Extract mixture ratio from $item_detail
            $mixture_ratio_array = preg_grep("/^素材:/", $item_detail);
            $mixture_ratio = mb_substr(array_shift($mixture_ratio_array), 3);
            // Extract product number from $item_detail
            $product_number_array = preg_grep("/^ブランド品番:/", $item_detail);
            $product_number = mb_substr(array_shift($product_number_array), 7);
            // Extract color name from $item_detail
            $color_array = preg_grep("/^カラー:/", $item_detail);
            $color = mb_substr(array_shift($color_array), 4);
            // Extract size name from $item_detail
            $size_array = preg_grep("/^サイズ:/", $item_detail);
            $size = mb_substr(array_shift($size_array), 4);

            // Convert full-width to half-width by using mb_convert_kana function and delete space by using str_replace function
            $color = str_replace([' ', '　'], '', mb_convert_kana($color, 'a', 'UTF-8'));
            // Extract one color name (for image table)
            $img_color = explode(',', $color)[0];
            // Store size related with each product number in array
            $item_color = explode(',', $color);
            // Store multiple colors in an array and merge it into $color_masters
            $color_masters = array_merge($color_masters, explode(',', $color));
            // Store color related with product number in array
            $item_colors[(string)$product_number] = array_values(array_unique($item_color));

            // Get URL of item image
            $img_url = $response_data[$i]['image']['medium'];
            // It will return url of Item picture which is 'https://item-shopping.c.yimg.jp/i/g/image ID' When I throw request to Yahoo API
            // /g/ means size of picture you can choose dynamically, so it can adjust by using change the URL of image * a < z
            $replaced_img_url = str_replace('/g/', '/f/', $img_url);
            // Store images related with product number in array
            $item_image[(string)$product_number] = [
                'color_name' => $img_color,
                'image' => $replaced_img_url, // * ItemSearch API (Yahoo) can get only one item picture
            ];

            // Convert full-width to half-width by using mb_convert_kana function and delete space by using str_replace function
            $size = str_replace([' ', '　'], '', mb_convert_kana($size, 'a', 'UTF-8'));
            // Store size related with each product number in array
            $item_size = explode(',', $size);
            // Store multiple sizes in an array and merge it into $sizes
            $size_masters = array_merge($size_masters, explode(',', $size));
            // Store measurements related with product number in array
            $item_measurements[(string)$product_number] = array_values(array_unique($item_size));

            // Get the instance of admin randomly
            $admin = Admin::inRandomOrder()->first();
            // Get brand ID
            $brand_id = Brand::where('brand_name', $response_data[$i]['brand']['name'])->first()->id;
            // Publish at 80%  * 0: Unsettled 1: Settled
            $is_published = $this->faker->optional($weight = 0.2, $default = 1)->numberBetween($min = 0, $max = 1);
            // Set date
            $posted_at = $this->faker->dateTimeBetween($startDate = '-10 years', $endDate = 'now', $timezone = null);
            $modified_at = $this->faker->dateTimeBetween($startDate = $posted_at, $endDate = 'now', $timezone = null);

            $items[] = [
                'brand_id' => $brand_id,
                'admin_id' => $admin->id,
                'item_name' => $response_data[$i]['name'],
                'product_number' => $product_number,
                'price' => $response_data[$i]['price'],
                // Set cost so that it can be item price of 28 to 50 %
                'cost' => intval($response_data[$i]['price'] * (rand(28, 50) / 100)),
                'description' => $this->faker->text($maxNbChars = 200),
                'mixture_ratio' => $mixture_ratio,
                'made_in' => $made_in,
                'is_published' => $is_published,
                'posted_at' => $is_published === 1 ? $posted_at : null,
                'modified_at' => $is_published === 1 ? $modified_at : null,
            ];

            $category1_arr = config('define.main_category');
            $category2_arr = config('define.sub_category');

            // Gender category
            $genre = $response_data[$i]['parentGenreCategories'][1]['id'];
            // Main category
            $item1 = !empty($response_data[$i]['parentGenreCategories'][2]) ? $response_data[$i]['parentGenreCategories'][2]['id'] : null;
            // Sub category
            $item2 = !empty($response_data[$i]['parentGenreCategories'][2]) ? $response_data[$i]['genreCategory']['id'] : null;

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

            $array = array(
                $categoryId1,
                $categoryId2,
                $categoryId3
            );
            // Delete value evaluated false
            $arr = array_filter($array);
            // Store categories related with product number in array
            $category_item[(string)$product_number] = $arr;
        }
        // Delete duplicate value in an array
        $color_masters = array_values(array_unique($color_masters));
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
