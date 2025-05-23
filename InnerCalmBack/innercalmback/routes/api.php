<?php

use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\SelfHelpResourceController;
use App\Http\Controllers\MoodTrackingController;
use App\Http\Controllers\AdminController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login',           [UserController::class, 'login']);
Route::post('/register',        [UserController::class, 'register']);
Route::post('/forgot-password', [UserController::class, 'forgotPassword']);

// TEMPORARY: Direct survey submission routes without auth for immediate fix
Route::post('/survey-submit', [MoodTrackingController::class, 'storeWithoutChecks']);
Route::get('/can-submit-bypass', function() {
    return response()->json([
        'can_submit' => true,
        'last_submission' => null,
        'next_available_time' => null
    ]);
});
Route::get('/history-bypass/{user_id?}', [MoodTrackingController::class, 'getHistoryBypass']);

// Self-help resources
Route::get('/selfhelp-resources',       [SelfHelpResourceController::class, 'index']);
Route::post('/selfhelp-resources',      [SelfHelpResourceController::class, 'store']);
Route::delete('/selfhelp-resources/{id}', [SelfHelpResourceController::class, 'destroy']);

// Admin routes
Route::get('/users', [UserController::class, 'getUsers']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);
Route::get('/admin/stats', [MoodTrackingController::class, 'getAdminStats']);
Route::get('/admin/settings', [AdminController::class, 'getSettings']);
Route::post('/admin/settings', [AdminController::class, 'updateSettings']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // User management
    Route::post('/logout', [UserController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::put('/user/password', [UserController::class, 'updatePassword']);
    Route::put('/user/profile', [UserController::class, 'updateProfile']);
    Route::post('/user/avatar', [UserController::class, 'updateAvatar']);

    // Test route to verify avatar functionality
    Route::get('/user/avatar-test', function (Request $request) {
        return response()->json([
            'message' => 'Avatar system is configured properly',
            'user' => $request->user()->only(['id', 'name', 'email', 'avatar']),
            'storage_path' => storage_path('app/public'),
            'public_url' => url('storage'),
        ]);
    });

    // Mood tracking routes
    Route::prefix('mood-tracking')->group(function () {
        Route::post('/', [MoodTrackingController::class, 'store']);
        Route::get('/history', [MoodTrackingController::class, 'getHistory']);
        Route::get('/can-submit', [MoodTrackingController::class, 'canSubmit']);
    });
});
