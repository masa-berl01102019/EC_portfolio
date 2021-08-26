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

        // 管理者情報のCRUD
        Route::get('/admins', 'AdminController@index')->name('admins.index');
        Route::get('/admins/create', 'AdminController@create')->name('admins.create');
        Route::post('/admins', 'AdminController@store')->name('admins.store');
        Route::get('/admins/{admin}/edit', 'AdminController@edit')->name('admins.edit');
        Route::put('/admins/{admin}', 'AdminController@update')->name('admins.update');
        Route::delete('/admins/delete', 'AdminController@destroy')->name('admins.destroy'); // 一括削除
        Route::post('/admins/csv', 'AdminController@csvExport')->name('admins.csvExport'); // 一括CSV出力

        // お知らせ情報のCRUD
        Route::get('/notifications', 'NotificationController@index')->name('notifications.index');
        Route::get('/notifications/create', 'NotificationController@create')->name('notifications.create');
        Route::post('/notifications', 'NotificationController@store')->name('notifications.store');
        Route::get('/notifications/{notification}/edit', 'NotificationController@edit')->name('notifications.edit');
        Route::put('/notifications/{notification}', 'NotificationController@update')->name('notifications.update');
        Route::delete('/notifications/delete', 'NotificationController@destroy')->name('notifications.destroy'); // 一括削除
        Route::post('/notifications/csv', 'NotificationController@csvExport')->name('notifications.csvExport'); // 一括CSV出力

    });

});
