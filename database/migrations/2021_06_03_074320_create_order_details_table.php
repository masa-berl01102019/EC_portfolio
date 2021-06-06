<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrderDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('order_details', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('order_id'); // 外部キー
            $table->foreign('order_id')->references('id')->on('orders'); // 外部キー
            $table->unsignedInteger('sku_id'); // 外部キー
            $table->foreign('sku_id')->references('id')->on('skus'); // 外部キー
            $table->string('item_name',100);
            $table->string('product_number',30);
            $table->unsignedInteger('order_price');
            $table->string('order_color',30);
            $table->string('order_size',30);
            $table->unsignedInteger('order_quantity');
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
        Schema::dropIfExists('order_details');
    }
}
