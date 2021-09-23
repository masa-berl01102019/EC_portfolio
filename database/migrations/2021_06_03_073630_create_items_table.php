<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('items', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('brand_id'); // 外部キー
            $table->foreign('brand_id')->references('id')->on('brands'); // 外部キー
            $table->unsignedInteger('admin_id'); // 外部キー
            $table->foreign('admin_id')->references('id')->on('admins'); // 外部キー
            $table->string('item_name',100);
            $table->string('product_number',50);
            $table->unsignedInteger('price');
            $table->unsignedInteger('cost');
            $table->text('description');
            $table->string('mixture_ratio',255);
            $table->string('made_in',80);
            $table->boolean('is_published'); // 0: 未公開　1: 公開
            $table->dateTime('posted_at')->nullable();
            $table->dateTime('modified_at')->nullable();
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
        Schema::dropIfExists('items');
    }
}
