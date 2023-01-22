<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string
     */

    protected function redirectTo($request)
    {
        if (!$request->expectsJson()) {
            // $request->expectsJson() is checking if request is JSON or HTML and return true or false
            return route('login');
        }

        // redirectTo method redirect an user which hasn't authenticated yet 
        // This time, It doesn't use because laravel is using as API
    }
}
