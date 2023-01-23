<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdminsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('admins', function (Blueprint $table) {
            $table->increments('id');
            $table->string('last_name',25);
            $table->string('first_name',25);
            $table->string('last_name_kana',25);
            $table->string('first_name_kana',25);
            $table->string('post_code', 10);
            $table->string('prefecture',50);
            $table->string('municipality',50);
            $table->string('street_name',50);
            $table->string('street_number',50);
            $table->string('building',50)->nullable();
            $table->string('tel', 15);
            $table->string('email',100)->unique();
            $table->string('password', 100);
            $table->timestamp('email_verified_at')->nullable(); // メール送信機能 (デフォルトはnull。利用時は別途設定が必要)
            $table->rememberToken(); // トークン(パスワードリセット用)
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
        Schema::dropIfExists('admins');
    }
}
