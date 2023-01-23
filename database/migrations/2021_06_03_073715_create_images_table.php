<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateImagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('images', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('item_id'); // 外部キー
            $table->foreign('item_id')->references('id')->on('items'); // 外部キー
            $table->string('image',255);
            $table->unsignedTinyInteger('image_category'); // 0~255 0: メイン画像 1: サムネイル画像
            $table->timestamps(); // dateTime型の作成日時と更新日時を生成
            $table->softDeletes(); // 論理削除
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('images');
    }
}
