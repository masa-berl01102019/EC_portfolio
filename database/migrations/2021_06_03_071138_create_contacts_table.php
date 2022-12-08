<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContactsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contacts', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('admin_id')->nullable(); // 外部キー
            $table->foreign('admin_id')->references('id')->on('admins'); // 外部キー
            $table->unsignedInteger('user_id')->nullable(); // 外部キー
            $table->foreign('user_id')->references('id')->on('users'); // 外部キー
            $table->string('last_name', 25);
            $table->string('first_name', 25);
            $table->string('last_name_kana', 25)->nullable();
            $table->string('first_name_kana', 25)->nullable();
            $table->string('tel', 15);
            $table->string('email', 100);
            $table->string('title', 255);
            $table->text('body');
            $table->unsignedTinyInteger('response_status')->default(0); // 0~255 0: 未対応 1: 対応中 2: 対応済
            $table->text('memo')->nullable();
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
        Schema::dropIfExists('contacts');
    }
}
