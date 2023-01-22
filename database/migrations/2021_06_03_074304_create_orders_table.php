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
            $table->unsignedInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users');
            $table->unsignedInteger('sub_total');
            $table->unsignedInteger('tax_amount');
            $table->unsignedInteger('total_amount');
            $table->unsignedInteger('commission_fee');
            $table->unsignedTinyInteger('payment_method'); // 0~255 0: Credit card 1: Cache
            $table->unsignedTinyInteger('payment_status'); // 0~255 0: Unsettled 1: Settled
            $table->string('payment_token', 255)->nullable(); // stripe ID
            $table->date('delivery_date');
            $table->string('delivery_time', 30);
            $table->boolean('is_paid'); // 0: Not paid 1: Paid
            $table->boolean('is_shipped'); // 0: Not delivered 1: Delivered
            $table->timestamps();
            $table->softDeletes();
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
