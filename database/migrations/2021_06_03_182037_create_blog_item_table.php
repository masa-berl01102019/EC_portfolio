<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBlogItemTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('blog_item', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('blog_id');
            $table ->foreign('blog_id')->references('id')->on('blogs'); // 外部キー
            $table->unsignedInteger('item_id');
            $table ->foreign('item_id')->references('id')->on('items'); // 外部キー
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('blog_item');
    }
}
