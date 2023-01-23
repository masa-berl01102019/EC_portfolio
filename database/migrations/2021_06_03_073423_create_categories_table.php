<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCategoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->increments('id');
            $table->string('category_name',50);
            $table->unsignedInteger('parent_id')->nullable(); // 外部キー
            $table->foreign('parent_id')->references('id')->on('categories'); // 外部キー
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
        Schema::dropIfExists('categories');
    }
}
