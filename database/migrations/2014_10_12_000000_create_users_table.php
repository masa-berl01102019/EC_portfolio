<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('user_last_name',25);
            $table->string('user_first_name',25);
            $table->string('user_last_name_kana',25);
            $table->string('user_first_name_kana',25);
            $table->unsignedTinyInteger('gender'); // 0~255 0:man 1:woman 2:others 3:no answer
            $table->date('birthday');
            $table->string('post_code', 10);
            $table->string('prefecture',50);
            $table->string('municipality',50);
            $table->string('street_name',50);
            $table->string('street_number',50);
            $table->string('building',50)->nullable();
            $table->string('delivery_post_code', 10)->nullable();
            $table->string('delivery_prefecture',50)->nullable();
            $table->string('delivery_municipality',50)->nullable();
            $table->string('delivery_street_name',50)->nullable();
            $table->string('delivery_street_number',50)->nullable();
            $table->string('delivery_building',50)->nullable();
            $table->string('tel', 15);
            $table->string('email',100)->unique();
            $table->string('password', 100);
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
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
        Schema::dropIfExists('users');
    }
}
