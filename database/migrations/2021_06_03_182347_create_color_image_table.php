<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateColorImageTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('color_image', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('color_id');
            $table ->foreign('color_id')->references('id')->on('colors'); // 外部キー
            $table->unsignedInteger('image_id');
            $table ->foreign('image_id')->references('id')->on('images'); // 外部キー
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('color_image');
    }
}
