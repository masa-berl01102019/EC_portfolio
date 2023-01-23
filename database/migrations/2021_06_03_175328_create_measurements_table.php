<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMeasurementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('measurements', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('item_id');
            $table->foreign('item_id')->references('id')->on('items');
            $table->unsignedInteger('size_id'); // 外部キー
            $table->foreign('size_id')->references('id')->on('sizes'); // 外部キー
            $table->unsignedInteger('width')->nullable(); // 身幅
            $table->unsignedInteger('shoulder_width')->nullable(); // 肩幅
            $table->unsignedInteger('raglan_sleeve_length')->nullable(); // 裄丈
            $table->unsignedInteger('sleeve_length')->nullable(); // 袖丈
            $table->unsignedInteger('length')->nullable(); // 着丈
            $table->unsignedInteger('waist')->nullable(); // ウエスト
            $table->unsignedInteger('hip')->nullable(); // ヒップ
            $table->unsignedInteger('rise')->nullable(); // 股上
            $table->unsignedInteger('inseam')->nullable(); // 股下
            $table->unsignedInteger('thigh_width')->nullable(); // わたり(もも幅)
            $table->unsignedInteger('outseam')->nullable(); // パンツ総丈
            $table->unsignedInteger('sk_length')->nullable(); // スカート丈
            $table->unsignedInteger('hem_width')->nullable(); // 裾幅
            $table->unsignedInteger('weight')->nullable(); // 重量
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
        Schema::dropIfExists('measurements');
    }
}
