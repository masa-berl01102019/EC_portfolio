<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCategoryItemTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('category_item', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('category_id');
            $table ->foreign('category_id')->references('id')->on('categories'); // 外部キー
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
        Schema::dropIfExists('category_item');
    }
}
