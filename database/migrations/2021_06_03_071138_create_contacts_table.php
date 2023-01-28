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
            $table->unsignedInteger('admin_id')->nullable();
            // $table->foreign('admin_id')->references('id')->on('admins');
            $table->unsignedInteger('user_id')->nullable();
            // $table->foreign('user_id')->references('id')->on('users');
            $table->string('last_name', 25);
            $table->string('first_name', 25);
            $table->string('last_name_kana', 25)->nullable();
            $table->string('first_name_kana', 25)->nullable();
            $table->string('tel', 15);
            $table->string('email', 100);
            $table->string('subject', 255);
            $table->text('message');
            $table->unsignedTinyInteger('response_status')->default(0); // 0~255 0: Yet 1: During 2: Done
            $table->text('memo')->nullable();
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
        Schema::dropIfExists('contacts');
    }
}
