<?php
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//Route::middleware('auth:api')->get('/user', function (Request $request) {
//    return $request->user();
//});

Route::namespace('Admin')->prefix('admin')->name('admin.')->group(function() {

    // ログイン認証関連の設定
    Auth::routes([
        'register' => true,
        'reset' => false,
        'verify' => false
    ]);

    // ログイン認証後
    Route::middleware('auth:admin')->group(function() {

        // 会員情報のCRUD
        Route::get('/users', 'UserController@index')->name('users.index');
        Route::get('/users/create', 'UserController@create')->name('users.create');
        Route::post('/users', 'UserController@store')->name('users.store');
        Route::get('/users/{user}/edit', 'UserController@edit')->name('users.edit');
        Route::put('/users/{user}', 'UserController@update')->name('users.update');
        Route::delete('/users/delete', 'UserController@destroy')->name('users.destroy'); // 一括削除
        Route::post('/users/csv', 'UserController@csvExport')->name('users.csvExport'); // 一括CSV出力

    });

});
