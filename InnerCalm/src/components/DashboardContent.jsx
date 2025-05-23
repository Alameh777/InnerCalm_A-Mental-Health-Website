//=========================================================
// File: src/components/DashboardContent.jsx
//=========================================================
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    UsersRound, TriangleAlert, TrendingUp, Brain, Heart, Activity,
    UserCheck, Clock, Calendar, Smile, Frown, Meh
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart, RadialBarChart, RadialBar
} from 'recharts';

const COLORS = {
    mood: '#10B981',
    stress: '#EF4444',
    motivation: '#F59E0B',
    physical: '#3B82F6',
    mental: '#8B5CF6',
    exercise: '#059669',
    meditation: '#6366F1',
    diet: '#F59E0B',
    social: '#EC4899',
    positive: '#34D399',
    neutral: '#9CA3AF',
    negative: '#F87171'
};

const DashboardContent = () => {
    const [stats, setStats] = useState({
        total_users: 0,
        active_users: 0,
        daily_averages: [],
        activity_percentages: {},
        critical_cases: 0,
        mood_distribution: {
            positive: 0,
            neutral: 0,
            negative: 0
        },
        weekly_engagement: 0,
        survey_completion_rate: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState('30d');

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8000/api/admin/stats?timeRange=${timeRange}`);
                // Merge the response data with default values to ensure all properties exist
                setStats(prevStats => ({
                    ...prevStats,
                    ...response.data,
                    mood_distribution: {
                        ...prevStats.mood_distribution,
                        ...(response.data.mood_distribution || {})
                    }
                }));
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchStats();
    }, [timeRange]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-600">Error: {error}</div>;
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    {payload.map((entry, index) => {
                        const value = typeof entry.value === 'number' 
                            ? entry.value.toFixed(2)
                            : entry.value;
                            
                        return (
                            <p key={index} className="text-sm" style={{ color: entry.color }}>
                                {entry.name}: {value}
                            </p>
                        );
                    })}
                </div>
            );
        }
        return null;
    };

    // Transform activity percentages for pie chart
    const activityData = Object.entries(stats.activity_percentages || {}).map(([name, value]) => ({
        name: name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        value: Math.round(value)
    }));

    const moodDistributionData = [
        { 
            name: 'Positive', 
            value: stats.mood_distribution?.positive || 0,
            icon: <Smile className="w-5 h-5" /> 
        },
        { 
            name: 'Neutral', 
            value: stats.mood_distribution?.neutral || 0,
            icon: <Meh className="w-5 h-5" /> 
        },
        { 
            name: 'Negative', 
            value: stats.mood_distribution?.negative || 0,
            icon: <Frown className="w-5 h-5" /> 
        }
    ];

    return (
        <div className="space-y-8">
            {/* Header with Time Range Selector */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">Dashboard Overview</h2>
                <div className="flex gap-2 bg-white rounded-lg p-1 shadow-sm">
                    {['7d', '30d', '90d'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                timeRange === range
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>
            
            {/* Statistics Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between text-white">
                        <div>
                            <p className="text-emerald-100">Total Users</p>
                            <h3 className="text-3xl font-bold mt-2">{stats.total_users}</h3>
                            <p className="text-sm text-emerald-100 mt-1">
                                <TrendingUp className="inline w-4 h-4 mr-1" />
                                +12% this month
                            </p>
                        </div>
                        <div className="bg-emerald-400/30 p-3 rounded-xl">
                            <UsersRound size={24} className="text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between text-white">
                        <div>
                            <p className="text-blue-100">Active Users</p>
                            <h3 className="text-3xl font-bold mt-2">{stats.active_users}</h3>
                            <p className="text-sm text-blue-100 mt-1">
                                <Activity className="inline w-4 h-4 mr-1" />
                                Last 24 hours
                            </p>
                        </div>
                        <div className="bg-blue-400/30 p-3 rounded-xl">
                            <UserCheck size={24} className="text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between text-white">
                        <div>
                            <p className="text-purple-100">Survey Completion</p>
                            <h3 className="text-3xl font-bold mt-2">{stats.survey_completion_rate}%</h3>
                            <p className="text-sm text-purple-100 mt-1">
                                <Clock className="inline w-4 h-4 mr-1" />
                                Average rate
                            </p>
                        </div>
                        <div className="bg-purple-400/30 p-3 rounded-xl">
                            <Calendar size={24} className="text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between text-white">
                        <div>
                            <p className="text-red-100">Critical Cases</p>
                            <h3 className="text-3xl font-bold mt-2">{stats.critical_cases}</h3>
                            <p className="text-sm text-red-100 mt-1">
                                <Activity className="inline w-4 h-4 mr-1" />
                                Needs attention
                            </p>
                        </div>
                        <div className="bg-red-400/30 p-3 rounded-xl">
                            <TriangleAlert size={24} className="text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Mood and Motivation Trends */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800">Emotional Wellness</h3>
                            <p className="text-sm text-gray-500 mt-1">Daily mood and motivation trends</p>
                        </div>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.daily_averages}>
                                <defs>
                                    <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={COLORS.mood} stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor={COLORS.mood} stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorMotivation" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={COLORS.motivation} stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor={COLORS.motivation} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis 
                                    dataKey="date" 
                                    stroke="#6B7280"
                                    fontSize={12}
                                    tickLine={false}
                                />
                                <YAxis 
                                    domain={[1, 5]} 
                                    stroke="#6B7280"
                                    fontSize={12}
                                    tickLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Area 
                                    type="monotone" 
                                    dataKey="avg_mood" 
                                    stroke={COLORS.mood} 
                                    fill="url(#colorMood)"
                                    strokeWidth={2}
                                    name="Mood"
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="avg_motivation" 
                                    stroke={COLORS.motivation} 
                                    fill="url(#colorMotivation)"
                                    strokeWidth={2}
                                    name="Motivation"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Mood Distribution */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800">Mood Distribution</h3>
                            <p className="text-sm text-gray-500 mt-1">Overall user sentiment analysis</p>
                        </div>
                    </div>
                    <div className="h-[300px] flex items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart 
                                cx="50%" 
                                cy="50%" 
                                innerRadius="30%" 
                                outerRadius="100%" 
                                data={moodDistributionData} 
                                startAngle={180} 
                                endAngle={0}
                            >
                                <RadialBar
                                    minAngle={15}
                                    background
                                    clockWise={true}
                                    dataKey="value"
                                    cornerRadius={10}
                                >
                                    {moodDistributionData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={index === 0 ? COLORS.positive : index === 1 ? COLORS.neutral : COLORS.negative}
                                        />
                                    ))}
                                </RadialBar>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    iconSize={10}
                                    layout="vertical"
                                    verticalAlign="middle"
                                    align="right"
                                    content={(props) => {
                                        const { payload } = props;
                                        return (
                                            <div className="flex flex-col gap-4">
                                                {payload.map((entry, index) => (
                                                    <div key={`item-${index}`} className="flex items-center gap-2">
                                                        <div className="flex items-center justify-center w-8 h-8 rounded-full"
                                                             style={{ backgroundColor: entry.color }}>
                                                            {entry.payload.icon}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">{entry.value}%</p>
                                                            <p className="text-xs text-gray-500">{entry.payload.name}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    }}
                                />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Activity Distribution */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800">Activity Distribution</h3>
                            <p className="text-sm text-gray-500 mt-1">Most popular wellness activities</p>
                        </div>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={activityData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {activityData.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={Object.values(COLORS)[index % Object.values(COLORS).length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend 
                                    layout="vertical"
                                    align="right"
                                    verticalAlign="middle"
                                    content={({ payload }) => (
                                        <div className="flex flex-col gap-2">
                                            {payload.map((entry, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                                                    <span className="text-sm text-gray-600">{entry.value}%</span>
                                                    <span className="text-sm text-gray-500">{entry.payload.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Tiredness Analysis */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800">Tiredness Analysis</h3>
                            <p className="text-sm text-gray-500 mt-1">Physical vs Mental fatigue trends</p>
                        </div>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.daily_averages}>
                                <defs>
                                    <linearGradient id="colorPhysical" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={COLORS.physical} stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor={COLORS.physical} stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorMental" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={COLORS.mental} stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor={COLORS.mental} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis 
                                    dataKey="date" 
                                    stroke="#6B7280"
                                    fontSize={12}
                                    tickLine={false}
                                />
                                <YAxis 
                                    domain={[1, 5]} 
                                    stroke="#6B7280"
                                    fontSize={12}
                                    tickLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Area 
                                    type="monotone" 
                                    dataKey="avg_physical_tiredness" 
                                    stroke={COLORS.physical} 
                                    fill="url(#colorPhysical)"
                                    strokeWidth={2}
                                    name="Physical Tiredness"
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="avg_mental_tiredness" 
                                    stroke={COLORS.mental} 
                                    fill="url(#colorMental)"
                                    strokeWidth={2}
                                    name="Mental Tiredness"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardContent;