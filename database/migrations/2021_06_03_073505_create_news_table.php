<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNewsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('news', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('brand_id');
            // $table->foreign('brand_id')->references('id')->on('brands');
            $table->unsignedInteger('admin_id');
            // $table->foreign('admin_id')->references('id')->on('admins');
            $table->unsignedInteger('category_id');
            // $table->foreign('category_id')->references('id')->on('categories');
            $table->string('title', 255);
            $table->mediumText('body');
            $table->string('thumbnail', 255);
            $table->boolean('is_published'); // 0: Unpublished 1: Published
            $table->dateTime('posted_at')->nullable();
            $table->dateTime('modified_at')->nullable();
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
        Schema::dropIfExists('news');
    }
}
