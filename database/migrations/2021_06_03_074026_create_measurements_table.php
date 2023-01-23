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
            $table->unsignedInteger('size_id');
            $table->foreign('size_id')->references('id')->on('sizes');
            $table->unsignedInteger('width')->nullable();
            $table->unsignedInteger('shoulder_width')->nullable();
            $table->unsignedInteger('raglan_sleeve_length')->nullable();
            $table->unsignedInteger('sleeve_length')->nullable();
            $table->unsignedInteger('length')->nullable();
            $table->unsignedInteger('waist')->nullable();
            $table->unsignedInteger('hip')->nullable();
            $table->unsignedInteger('rise')->nullable();
            $table->unsignedInteger('inseam')->nullable();
            $table->unsignedInteger('thigh_width')->nullable();
            $table->unsignedInteger('outseam')->nullable();
            $table->unsignedInteger('sk_length')->nullable();
            $table->unsignedInteger('hem_width')->nullable();
            $table->unsignedInteger('weight')->nullable();
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
        Schema::dropIfExists('measurements');
    }
}
