<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNotificationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('admin_id');
            // $table->foreign('admin_id')->references('id')->on('admins');
            $table->string('title', 255);
            $table->text('body');
            $table->boolean('is_published'); // 0: Unpublished 1: Published
            $table->dateTime('expired_at')->nullable();
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
        Schema::dropIfExists('notifications');
    }
}
