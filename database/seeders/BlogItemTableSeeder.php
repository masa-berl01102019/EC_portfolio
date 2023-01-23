<?php
namespace Database\Seeders;

use App\Models\Blog;
use App\Models\Item;
use App\Models\Brand;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BlogItemTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;'); // 一時的に外部キー制約を無効化

        DB::table('blog_item')->truncate(); // テーブルごと削除して再構築

        // ブログを全件取得
        $blogs = Blog::all();

        // 配列の初期化
        $blog_item = [];

        // for文で展開
        foreach($blogs as $blog) {

            $items_id = Item::where('brand_id', $blog->brand_id)->whereHas('categories', function ($query) use ($blog) {
                $query->where('categories.id', '=',  $blog->category_id);
            })->pluck('id')->toArray();

            if(!empty($items_id) && is_array($items_id)) {
                shuffle($items_id);
                for($n = 0; $n < count($items_id); $n++) {
                    if($n > 3) break;
                    $blog_item[] = [
                        'blog_id' => $blog->id,
                        'item_id' => $items_id[$n],
                    ];
                }
            }
        }

        DB::table('blog_item')->insert($blog_item); // データの挿入

        DB::statement('SET FOREIGN_KEY_CHECKS=1;'); // 外部キー制約を有効化
    }
}
