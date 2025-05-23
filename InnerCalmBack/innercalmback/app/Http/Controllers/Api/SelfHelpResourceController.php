<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\SelfHelpResource;
use Illuminate\Http\Request;



class SelfHelpResourceController extends Controller
{
    // Get all videos
    public function index()
    {
        return response()->json(SelfHelpResource::all());
    }

    // Store a new video
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'video_url' => 'required|string',
            'category' => 'required|string',
            'description' => 'nullable|string',
            'duration_minutes' => 'nullable|integer',
            'image_url' => 'required|string',
        ]);

        $resource = SelfHelpResource::create($validated);
        return response()->json($resource, 201);
    }

    //show single vid
    public function show($id)
{
    $resource = SelfHelpResource::findOrFail($id);
    return response()->json($resource);
}


    // Delete a video
    public function destroy($id)
    {
        $resource = SelfHelpResource::findOrFail($id);
        $resource->delete();

        return response()->json(['message' => 'Video deleted successfully']);
    }
}
