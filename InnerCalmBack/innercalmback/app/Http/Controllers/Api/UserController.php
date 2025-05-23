<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    // Register normal user
    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'name'     => ['required','string','max:255'],
            'email'    => ['required','email','max:255','unique:users'],
            'password' => ['required', Password::defaults()],
            'age'      => ['required','integer'],
            'gender'   => ['required','in:male,female'],
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'age'      => $request->age,
            'gender'   => $request->gender,
        ]);

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful.',
            'user'    => $user->only(['id','name','email','gender','age','is_admin']),
            'token'   => $token,
        ], 201);
    }

    // Login returns token + is_admin
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email'    => ['required','email'],
            'password' => ['required'],
        ]);

        if (! Auth::attempt($request->only('email','password'))) {
            return response()->json([
                'status'  => false,
                'message' => 'Invalid credentials.',
            ], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json([
            'status'   => true,
            'message'  => 'Authenticated successfully.',
            'token'    => $token,
            'user'     => $user->only(['id','name','email','is_admin']),
        ]);
    }

    // Logout
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message'=>'Logged out.']);
    }

    // Forgot password
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email'=>['required','email']]);
        $user = User::where('email',$request->email)->first();

        if (! $user) {
            return response()->json([
                'status'  => false,
                'message' => 'No user with this email.',
            ], 404);
        }

        $newPassword = Str::random(8);
        $user->password = Hash::make($newPassword);
        $user->save();

        Mail::raw("Your new password is: $newPassword", function($msg) use($user){
            $msg->to($user->email)->subject('Your New Password');
        });

        return response()->json([
            'status'  => true,
            'message' => 'New password sent.',
        ]);
    }

    public function getUsers()
    {
        
        $users = User::all(['id', 'name', 'email']);  // Adjust fields as necessary
        return response()->json($users);
    }

    // Delete a user
    public function destroy($id)
    {
        // Prevent deletion of user with ID 1 (system user for emergency submissions)
        if ($id == 1) {
            return response()->json([
                'message' => 'Cannot delete system user.',
                'status' => 'error'
            ], 403);
        }

        $user = User::find($id);

        if ($user) {
            $user->delete();
            return response()->json(['message' => 'User deleted successfully.'], 200);
        }

        return response()->json(['message' => 'User not found.'], 404);
    }

    // Update password
    public function updatePassword(Request $request): JsonResponse
    {
        $request->validate([
            'current_password' => ['required'],
            'new_password' => ['required', Password::defaults()],
            'password_confirmation' => ['required', 'same:new_password'],
        ]);

        $user = Auth::user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect.',
            ], 422);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'message' => 'Password updated successfully.',
        ]);
    }

    // Update profile
    public function updateProfile(Request $request): JsonResponse
    {
        $user = Auth::user();

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id],
        ]);

        $user->name = $request->name;
        $user->email = $request->email;
        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user->only(['id', 'name', 'email', 'avatar'])
        ]);
    }

    // Update avatar
    public function updateAvatar(Request $request): JsonResponse
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        $user = Auth::user();

        // Delete old avatar if exists
        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        // Store the new avatar
        $path = $request->file('avatar')->store('avatars', 'public');
        
        // Update user record with the path relative to storage/app/public
        $user->avatar = $path;
        $user->save();

        return response()->json([
            'message' => 'Avatar updated successfully',
            'avatar' => $path,
            'user' => $user->only(['id', 'name', 'email', 'avatar'])
        ]);
    }
   
}
