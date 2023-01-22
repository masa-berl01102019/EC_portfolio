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
     * @var array
     */
    protected $dontReport = [
        // \Illuminate\Auth\AuthenticationException::class,
        // \Illuminate\Auth\Access\AuthorizationException::class,
        // \Illuminate\Validation\ValidationException::class,
        // \Symfony\Component\HttpKernel\Exception\HttpException::class,
        // \Illuminate\Database\Eloquent\ModelNotFoundException::class, 
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
            // Don't do anything except API request
            return parent::render($request, $exception);
        } else if ($exception instanceof AuthenticationException) {
            return response()->json(['message' => trans('api.error.401')], 401);
        } else if ($exception instanceof ValidationException) {
            return response()->json(new ErrorResource($exception), 422);
        } else if ($exception instanceof HttpException) {
            $err_code = $exception->getStatusCode();
            switch ($err_code) {
                case 403 || 404:
                    return response()->json(['message' => trans('api.error.404')], 404);
                    break;
                case 405:
                    return response()->json(['message' => trans('api.error.405')], 405);
                    break;
                case 408:
                    return response()->json(['message' => trans('api.error.408')], 408);
                    break;
                case 414:
                    return response()->json(['message' => trans('api.error.414')], 414);
                    break;
                case 415:
                    return response()->json(['message' => trans('api.error.415')], 415);
                    break;
                case 429:
                    return response()->json(['message' => trans('api.error.429')], 429);
                    break;
                case $err_code >= 400 && $err_code < 500:
                    return response()->json(['message' => trans('api.error.400')], 400);
                    break;
                case 503:
                    return response()->json(['message' => trans('api.error.503')], 503);
                    break;
                case $err_code >= 500 && $err_code < 600:
                    return response()->json(['message' => trans('api.error.500')], 500);
                    break;
            }
        } else {
            return parent::render($request, $exception);
        }
    }
}
