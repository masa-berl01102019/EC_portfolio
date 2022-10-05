<?php

namespace App\Exceptions;

use Throwable;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\ErrorResource;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     * ログ出力しない例外の設定
     * @var array
     */
    protected $dontReport = [
        // \Illuminate\Auth\AuthenticationException::class, // 認証
        // \Illuminate\Auth\Access\AuthorizationException::class, // 認可
        // \Illuminate\Validation\ValidationException::class, // バリデーション
        // \Symfony\Component\HttpKernel\Exception\HttpException::class, // HTTPステータス
        // \Illuminate\Database\Eloquent\ModelNotFoundException::class, // モデル関係
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    /**
     * Report or log an exception.
     *
     * @param  \Throwable  $exception
     * @throws \Throwable
     * @return void
     */
    public function report(Throwable $exception)
    {
        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $exception
     * @throws \Throwable
     * @return \Symfony\Component\HttpFoundation\Response
     *
     */
    public function render($request, Throwable $exception)
    {
        if (!$request->is('api/*')) {
            // API以外は何もしない
            return parent::render($request, $exception);
        } else if ($exception instanceof AuthenticationException) {
            // 認証エラー
            return response()->json(['errCode' => 'Unauthorized', 'message' => $exception->getMessage()], 401);
        } else if ($exception instanceof ValidationException) {
            // バリデーションエラー
            return response()->json(new ErrorResource($exception), 422);
        } else if ($exception instanceof HttpException) {
            // HTTPステータスエラー
            $err_code = $exception->getStatusCode();
            switch ($err_code) {
                case 403 || 404:
                    return response()->json(['errCode' => 'Not Found', 'message' => 'リソースが存在しません'], 404);
                    break;
                case 405:
                    return response()->json(['errCode' => 'Method Not Allowed', 'message' => '未許可のメソッドが実行されております'], 405);
                    break;
                case 408:
                    return response()->json(['errCode' => 'Request Timeout', 'message' => 'リクエストが時間内に完了出来ませんでした'], 408);
                    break;
                case 414:
                    return response()->json(['errCode' => 'URI Too Long', 'message' => 'URIの長さがサーバーの上限を超えてます'], 414);
                    break;
                case 415:
                    return response()->json(['errCode' => 'Unsupported Media Type', 'message' => 'メディア形式が正しくありません'], 414);
                    break;
                case 429:
                    return response()->json(['errCode' => 'Too Many Requests', 'message' => 'APIの利用上限を超過しています'], 429);
                    break;
                case $err_code >= 400 && $err_code < 500:
                    return response()->json(['errCode' => 'Bad Request', 'message' => '無効なリクエストです'], 400);
                    break;
                case 503:
                    return response()->json(['errCode' => 'Service Unavailable', 'message' => '一時的にAPIアクセスが出来ません'], 503);
                    break;
                case $err_code >= 500 && $err_code < 600:
                    return response()->json(['errCode' => 'Internal Server Error', 'message' => 'サーバーで何らかの異常が発生しました'], 500);
                    break;
            }
        } else {
            return parent::render($request, $exception);
        }
    }
}
