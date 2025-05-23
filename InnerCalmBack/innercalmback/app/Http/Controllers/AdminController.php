<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    /**
     * Get the application settings
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSettings()
    {
        $settings = Cache::get('app_settings', [
            'therapist_number' => '1234567890' // Default number
        ]);

        return response()->json($settings);
    }

    /**
     * Update the application settings
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateSettings(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'therapist_number' => 'required|string|min:10|max:15'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $settings = [
            'therapist_number' => $request->therapist_number
        ];

        // Store settings in cache
        Cache::forever('app_settings', $settings);

        return response()->json([
            'message' => 'Settings updated successfully',
            'settings' => $settings
        ]);
    }
} 