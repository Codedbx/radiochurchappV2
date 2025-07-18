<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    public function redirect()
    {
        return response()->json([
            'url' => Socialite::driver('google')->stateless()->redirect()->getTargetUrl()
        ]);
    }

    public function callback(Request $request)
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
            
            $user = User::where('google_id', $googleUser->id)
                ->orWhere('email', $googleUser->email)
                ->first();

            if ($user) {
                // Update google_id if user exists but doesn't have it
                if (!$user->google_id) {
                    $user->update(['google_id' => $googleUser->id]);
                }
                
                // Mark email as verified if not already
                if (!$user->email_verified_at) {
                    $user->markEmailAsVerified();
                }
            } else {
                // Create new user
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'google_id' => $googleUser->id,
                    'email_verified_at' => now(),
                ]);

                // Assign default user role
                $user->assignRole('user');
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Google authentication successful',
                'user' => $user->load('roles'),
                'token' => $token,
            ]);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Google authentication failed',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    public function handleProviderCallback(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Token is required',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Get user info from Google using the token
            $response = Http::get('https://www.googleapis.com/oauth2/v1/userinfo', [
                'access_token' => $request->token
            ]);

            if (!$response->successful()) {
                return response()->json([
                    'message' => 'Invalid Google token'
                ], 401);
            }

            $googleUser = $response->json();
            
            $user = User::where('google_id', $googleUser['id'])
                ->orWhere('email', $googleUser['email'])
                ->first();

            if ($user) {
                if (!$user->google_id) {
                    $user->update(['google_id' => $googleUser['id']]);
                }
                
                if (!$user->email_verified_at) {
                    $user->markEmailAsVerified();
                }
            } else {
                $user = User::create([
                    'name' => $googleUser['name'],
                    'email' => $googleUser['email'],
                    'google_id' => $googleUser['id'],
                    'email_verified_at' => now(),
                ]);

                $user->assignRole('user');
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Google authentication successful',
                'user' => $user->load('roles'),
                'token' => $token,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Google authentication failed',
                'error' => $e->getMessage()
            ], 400);
        }
    }
}