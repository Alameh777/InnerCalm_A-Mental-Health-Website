<?php
// bootstrap/app.php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful; // Import if using SPA auth alongside tokens

ini_set('max_execution_time', 300);

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php', // Make sure api routes are loaded
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Example: If you wanted stateful SPA auth for web alongside token auth for API/mobile
        // $middleware->statefulApi(); // This is a shortcut for EnsureFrontendRequestsAreStateful

        // You might alias the Sanctum middleware if needed, but usually not required
        // $middleware->alias([
        //     'auth.sanctum' => \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        // ]);

        // Add other global middleware if needed
        // $middleware->append(MyGlobalMiddleware::class);

        // Add middleware groups if needed (less common in L11/12)
        // $middleware->group('web', [ ... ]);
        // $middleware->group('api', [ ... ]); // API group defined via withRouting usually sufficient

    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Configure exception handling
    })->create();
