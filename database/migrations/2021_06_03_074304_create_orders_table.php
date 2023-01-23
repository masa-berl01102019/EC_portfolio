<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('user_id'); // 外部キー
            $table->foreign('user_id')->references('id')->on('users'); // 外部キー
            $table->unsignedInteger('sub_total');
            $table->unsignedInteger('tax_amount');
            $table->unsignedInteger('total_amount');
            $table->unsignedInteger('commission_fee');
            $table->unsignedTinyInteger('payment_method'); // 0~255 0: クレジットカード 1: 代引き
            $table->unsignedTinyInteger('payment_status'); // 0~255 0: 未決済 1: 決済済
            $table->date('delivery_date'); // 配送希望日
            $table->string('delivery_time',30); // 配達希望時間帯
            $table->boolean('is_paid'); // 0: 入金無し 1: 入金有り
            $table->boolean('is_shipped'); // 0: 未配送 1: 配送済
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
        Schema::dropIfExists('orders');
    }
}
