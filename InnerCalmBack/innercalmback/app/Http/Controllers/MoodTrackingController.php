<?php

namespace App\Http\Controllers;

use App\Models\DailyMoodLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class MoodTrackingController extends Controller
{
    public function canSubmit()
    {
        $user_id = Auth::id();
        \Log::debug("canSubmit check for user_id: {$user_id}");
        
        $lastSubmission = DailyMoodLog::where('user_id', $user_id)
            ->latest()
            ->first();
        
        \Log::debug("Last submission found: " . ($lastSubmission ? 'yes' : 'no'));

        // If user has no submissions, they can always submit
        if (!$lastSubmission) {
            \Log::debug("No previous submissions, allowing survey");
            return response()->json([
                'can_submit' => true,
                'last_submission' => null,
                'next_available_time' => null
            ]);
        }

        $submissionTime = Carbon::parse($lastSubmission->created_at);
        $nextAvailable = $submissionTime->copy()->addHours(12);
        $canSubmit = Carbon::now()->gte($nextAvailable);
        $nextAvailableTime = $canSubmit ? null : $nextAvailable->toISOString();
        
        \Log::debug("Submission time: {$submissionTime}, Next available: {$nextAvailable}, Can submit: " . ($canSubmit ? 'yes' : 'no'));

        return response()->json([
            'can_submit' => $canSubmit,
            'last_submission' => $lastSubmission->created_at,
            'next_available_time' => $nextAvailableTime
        ]);
    }

    public function store(Request $request)
    {
        $user_id = Auth::id();
        \Log::debug("Survey submission attempt from user_id: {$user_id}");
        
        // Validate request
        $validated = $request->validate([
            'sleep_hours' => 'required|numeric|min:0|max:24',
            'trained' => 'required|boolean',
            'mood' => 'required|integer|min:1|max:5',
            'stress_level' => 'required|integer|min:1|max:5',
            'water_liters' => 'required|numeric|min:0|max:10',
            'caffeine_cups' => 'required|integer|min:0|max:10',
            'social_interaction' => 'required|boolean',
            'screen_hours' => 'required|numeric|min:0|max:24',
            'ate_healthy' => 'required|boolean',
            'spent_time_outside' => 'required|boolean',
            'meditated' => 'required|boolean',
            'work_study_hours' => 'required|numeric|min:0|max:16',
            'enough_sleep_week' => 'required|boolean',
            'physical_tiredness' => 'required|integer|min:1|max:5',
            'mental_tiredness' => 'required|integer|min:1|max:5',
            'motivation_level' => 'required|integer|min:1|max:5',
            'suicidal_thoughts' => 'required|boolean',
        ]);

        \Log::debug("Validation passed, checking submission eligibility");
        
        // Check if user can submit
        $lastSubmission = DailyMoodLog::where('user_id', $user_id)
            ->latest()
            ->first();

        if ($lastSubmission) {
            $submissionTime = Carbon::parse($lastSubmission->created_at);
            $nextAvailable = $submissionTime->copy()->addHours(12);
            
            \Log::debug("Found previous submission, checking time constraints: Last: {$submissionTime}, Next allowed: {$nextAvailable}, Now: " . Carbon::now());
            
            if (Carbon::now()->lt($nextAvailable)) {
                \Log::debug("Too soon for new submission, rejecting");
                return response()->json([
                    'message' => 'You can submit a new survey after 12 hours from your last submission',
                    'next_available_time' => $nextAvailable->toISOString(),
                    'status' => 'error'
                ], 400);
            }
        } else {
            \Log::debug("No previous submissions found, allowing new submission");
        }

        // Get previous submission for comparison
        $previousSubmission = DailyMoodLog::where('user_id', $user_id)
            ->whereDate('created_at', '<', Carbon::today())
            ->latest()
            ->first();

        // Prepare data for ML API
        $mlData = $validated;
        if ($previousSubmission) {
            $mlData['previous_data'] = $previousSubmission->toArray();
        }

        // Call ML API
        try {
            \Log::debug("Attempting to call ML API");
            $mlResponse = Http::post('http://localhost:5000/predict', $mlData);
            $mlResult = $mlResponse->json();
            \Log::debug("ML API response: " . json_encode($mlResult));

            // Create mood log
            $moodLog = new DailyMoodLog($validated);
            $moodLog->user_id = $user_id;
            $moodLog->critical = $mlResult['mood_level'] <= 2; // Mark as critical if mood is 1 or 2
            $moodLog->save();

            $nextAvailableTime = Carbon::now()->addHours(12);
            \Log::debug("Survey saved successfully, next available at: {$nextAvailableTime}");

            return response()->json([
                'message' => 'Mood tracking saved successfully',
                'mood_analysis' => $mlResult,
                'submission_time' => $moodLog->created_at->toISOString(),
                'next_available_time' => $nextAvailableTime->toISOString(),
                'status' => 'success'
            ]);

        } catch (\Exception $e) {
            \Log::error("Error in mood tracking: " . $e->getMessage());
            
            // Even if ML API fails, we should still save the mood log
            try {
                \Log::debug("ML API failed, saving mood log without ML analysis");
                $moodLog = new DailyMoodLog($validated);
                $moodLog->user_id = $user_id;
                $moodLog->critical = $validated['mood'] <= 2; // Simple fallback logic for critical flag
                $moodLog->save();
                
                $nextAvailableTime = Carbon::now()->addHours(12);
                \Log::debug("Survey saved despite ML API failure, next available at: {$nextAvailableTime}");
                
                return response()->json([
                    'message' => 'Mood tracking saved successfully, but analysis is not available',
                    'submission_time' => $moodLog->created_at->toISOString(),
                    'next_available_time' => $nextAvailableTime->toISOString(),
                    'status' => 'success'
                ]);
            } catch (\Exception $innerException) {
                \Log::error("Critical error saving mood log: " . $innerException->getMessage());
                return response()->json([
                    'message' => 'Error processing mood tracking',
                    'error' => $innerException->getMessage(),
                    'status' => 'error'
                ], 500);
            }
        }
    }

    public function getHistory()
    {
        $user_id = Auth::id();
        \Log::debug("Fetching survey history for user_id: {$user_id}");
        
        // Support both logged-in users and emergency mode submissions
        if (!$user_id) {
            \Log::debug("No authenticated user, returning error");
            return response()->json([
                'message' => 'User not authenticated',
                'status' => 'error'
            ], 401);
        }
        
        $moodLogs = DailyMoodLog::where('user_id', $user_id)
            ->orderBy('created_at', 'desc')
            ->take(30) // Get last 30 days
            ->get();
            
        \Log::debug("Found " . count($moodLogs) . " mood logs for user");

        return response()->json([
            'mood_logs' => $moodLogs,
            'status' => 'success'
        ]);
    }

    public function getAdminStats()
    {
        // Get total number of users from Users table
        $totalUsers = \App\Models\User::count();

        // Get average mood and stress levels for the past 30 days
        $thirtyDaysAgo = Carbon::now()->subDays(30);
        $dailyAverages = DailyMoodLog::where('created_at', '>=', $thirtyDaysAgo)
            ->selectRaw('DATE(created_at) as date, 
                        AVG(mood) as avg_mood, 
                        AVG(stress_level) as avg_stress,
                        AVG(physical_tiredness) as avg_physical_tiredness,
                        AVG(mental_tiredness) as avg_mental_tiredness,
                        AVG(motivation_level) as avg_motivation,
                        COUNT(*) as total_entries')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Calculate survey completion rate
        // Get total number of surveys completed in last 30 days
        $totalSurveysCompleted = DailyMoodLog::where('created_at', '>=', $thirtyDaysAgo)->count();
        // Calculate maximum possible surveys (users × 30 days)
        $maxPossibleSurveys = $totalUsers * 30;
        // Calculate completion rate percentage
        $surveyCompletionRate = $maxPossibleSurveys > 0 
            ? round(($totalSurveysCompleted / $maxPossibleSurveys) * 100, 1)
            : 0;

        // Get activity statistics for the past 30 days
        $activityStats = DailyMoodLog::where('created_at', '>=', $thirtyDaysAgo)
            ->selectRaw('
                SUM(trained) as total_exercise,
                SUM(meditated) as total_meditation,
                SUM(ate_healthy) as total_healthy_eating,
                SUM(social_interaction) as total_social,
                COUNT(*) as total_entries
            ')
            ->first();

        // Calculate percentages for activities
        $totalEntries = $activityStats->total_entries ?? 0;
        $activityPercentages = [];
        
        if ($totalEntries > 0) {
            $activityPercentages = [
                'exercise' => ($activityStats->total_exercise / $totalEntries) * 100,
                'meditation' => ($activityStats->total_meditation / $totalEntries) * 100,
                'healthy_eating' => ($activityStats->total_healthy_eating / $totalEntries) * 100,
                'social_interaction' => ($activityStats->total_social / $totalEntries) * 100,
            ];
        }

        // Get critical cases count (where mood <= 2)
        $criticalCases = DailyMoodLog::where('created_at', '>=', $thirtyDaysAgo)
            ->where('mood', '<=', 2)
            ->count();

        // Calculate mood distribution
        $moodDistribution = DailyMoodLog::where('created_at', '>=', $thirtyDaysAgo)
            ->selectRaw('
                SUM(CASE WHEN mood >= 4 THEN 1 ELSE 0 END) as positive,
                SUM(CASE WHEN mood = 3 THEN 1 ELSE 0 END) as neutral,
                SUM(CASE WHEN mood <= 2 THEN 1 ELSE 0 END) as negative,
                COUNT(*) as total_entries
            ')
            ->first();

        // Calculate percentages for mood distribution
        $totalMoodEntries = $moodDistribution->total_entries ?? 0;
        $moodDistributionPercentages = [];
        
        if ($totalMoodEntries > 0) {
            $moodDistributionPercentages = [
                'positive' => ($moodDistribution->positive / $totalMoodEntries) * 100,
                'neutral' => ($moodDistribution->neutral / $totalMoodEntries) * 100,
                'negative' => ($moodDistribution->negative / $totalMoodEntries) * 100,
            ];
        }

        return response()->json([
            'total_users' => $totalUsers,
            'daily_averages' => $dailyAverages,
            'activity_percentages' => $activityPercentages,
            'critical_cases' => $criticalCases,
            'mood_distribution' => $moodDistributionPercentages,
            'survey_completion_rate' => $surveyCompletionRate,
            'status' => 'success'
        ]);
    }

    public function storeWithoutChecks(Request $request)
    {
        \Log::debug("Emergency survey submission without checks");
        
        try {
            // Validate request
            $validated = $request->validate([
                'sleep_hours' => 'required|numeric|min:0|max:24',
                'trained' => 'required|boolean',
                'mood' => 'required|integer|min:1|max:5',
                'stress_level' => 'required|integer|min:1|max:5',
                'water_liters' => 'required|numeric|min:0|max:10',
                'caffeine_cups' => 'required|integer|min:0|max:10',
                'social_interaction' => 'required|boolean',
                'screen_hours' => 'required|numeric|min:0|max:24',
                'ate_healthy' => 'required|boolean',
                'spent_time_outside' => 'required|boolean',
                'meditated' => 'required|boolean',
                'work_study_hours' => 'required|numeric|min:0|max:16',
                'enough_sleep_week' => 'required|boolean',
                'physical_tiredness' => 'required|integer|min:1|max:5',
                'mental_tiredness' => 'required|integer|min:1|max:5',
                'motivation_level' => 'required|integer|min:1|max:5',
                'suicidal_thoughts' => 'required|boolean',
            ]);

            // Get user ID if available, or use a default for guests
            $user_id = Auth::check() ? Auth::id() : 1; // Use ID 1 as fallback
            \Log::debug("Using user ID: {$user_id} for emergency submission");

            // Create mood log immediately without checks
            $moodLog = new DailyMoodLog($validated);
            $moodLog->user_id = $user_id;
            $moodLog->critical = $validated['mood'] <= 2;
            $moodLog->save();

            return response()->json([
                'message' => 'Mood tracking saved successfully (emergency mode)',
                'submission_time' => $moodLog->created_at->toISOString(),
                'next_available_time' => null, // Always allow future submissions
                'status' => 'success'
            ]);
        } catch (\Exception $e) {
            \Log::error("Critical error in emergency submission: " . $e->getMessage());
            return response()->json([
                'message' => 'Error saving your survey: ' . $e->getMessage(),
                'status' => 'error'
            ], 500);
        }
    }

    public function getHistoryBypass($user_id = null)
    {
        \Log::debug("Emergency history bypass called with user_id: {$user_id}");
        
        // If no user ID is provided, try to get it from the auth system
        if (!$user_id) {
            $user_id = Auth::check() ? Auth::id() : null;
            \Log::debug("No user ID provided, using authenticated user ID: {$user_id}");
        }
        
        // If we still don't have a user ID, return an error
        if (!$user_id) {
            \Log::debug("No user ID available, returning error");
            return response()->json([
                'message' => 'User ID is required',
                'status' => 'error'
            ], 400);
        }
        
        // Get the mood logs for the specified user
        $moodLogs = DailyMoodLog::where('user_id', $user_id)
            ->orderBy('created_at', 'desc')
            ->take(30) // Get last 30 days
            ->get();
            
        \Log::debug("Found " . count($moodLogs) . " mood logs for user {$user_id}");

        return response()->json([
            'mood_logs' => $moodLogs,
            'status' => 'success'
        ]);
    }
} 