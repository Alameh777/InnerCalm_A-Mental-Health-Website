import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import axios from 'axios';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const createGradient = (ctx, area, color) => {
  const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
  gradient.addColorStop(1, color);
  return gradient;
};

const Dashboard = () => {
  const [moodData, setMoodData] = useState(null);
  const [tirednessData, setTirednessData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/mood-tracking/stats');
        const dates = response.data.map(entry => {
          const date = new Date(entry.created_at);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        
        // Get the canvas context for gradients
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const chartArea = { top: 0, bottom: 300 }; // Approximate chart area

        setMoodData({
          labels: dates,
          datasets: [
            {
              label: 'Mood Level',
              data: response.data.map(entry => entry.mood),
              fill: true,
              backgroundColor: createGradient(ctx, chartArea, 'rgba(16, 185, 129, 0.2)'),
              borderColor: 'rgb(16, 185, 129)',
              tension: 0.4,
              pointRadius: 0,
              pointHoverRadius: 8,
              pointHoverBackgroundColor: 'white',
              pointHoverBorderColor: 'rgb(16, 185, 129)',
              pointHoverBorderWidth: 4,
              borderWidth: 4,
            }
          ]
        });

        setTirednessData({
          labels: dates,
          datasets: [
            {
              label: 'Physical Tiredness',
              data: response.data.map(entry => entry.physical_tiredness),
              borderColor: 'rgb(99, 102, 241)',
              backgroundColor: createGradient(ctx, chartArea, 'rgba(99, 102, 241, 0.2)'),
              tension: 0.4,
              fill: true,
              pointRadius: 0,
              pointHoverRadius: 8,
              pointHoverBackgroundColor: 'white',
              pointHoverBorderColor: 'rgb(99, 102, 241)',
              pointHoverBorderWidth: 4,
              borderWidth: 4,
            },
            {
              label: 'Mental Tiredness',
              data: response.data.map(entry => entry.mental_tiredness),
              borderColor: 'rgb(244, 63, 94)',
              backgroundColor: createGradient(ctx, chartArea, 'rgba(244, 63, 94, 0.2)'),
              tension: 0.4,
              fill: true,
              pointRadius: 0,
              pointHoverRadius: 8,
              pointHoverBackgroundColor: 'white',
              pointHoverBorderColor: 'rgb(244, 63, 94)',
              pointHoverBorderWidth: 4,
              borderWidth: 4,
            }
          ]
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching mood data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 13,
            family: "'Inter', sans-serif",
            weight: '500'
          },
          color: '#6B7280'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#111827',
        bodyColor: '#374151',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        bodyFont: {
          size: 13,
          family: "'Inter', sans-serif",
        },
        titleFont: {
          size: 14,
          family: "'Inter', sans-serif",
          weight: '600'
        },
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          }
        },
        animation: {
          duration: 150
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false
        },
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          },
          color: '#9CA3AF',
          padding: 8
        }
      },
      y: {
        beginAtZero: true,
        max: 5,
        border: {
          display: false
        },
        ticks: {
          stepSize: 1,
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          },
          color: '#9CA3AF',
          padding: 12
        },
        grid: {
          color: '#F3F4F6',
          drawBorder: false,
          lineWidth: 1
        }
      }
    },
    animations: {
      tension: {
        duration: 1000,
        easing: 'linear',
        from: 0.8,
        to: 0.4,
        loop: false
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mood Trends Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-semibold text-gray-800">Mood Trends</h3>
            <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-sm font-medium">
              Last 7 Days
            </div>
          </div>
          <div className="h-[400px]">
            {moodData && <Line data={moodData} options={chartOptions} />}
          </div>
        </div>

        {/* Tiredness Levels Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-semibold text-gray-800">Tiredness Levels</h3>
            <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium">
              Last 7 Days
            </div>
          </div>
          <div className="h-[400px]">
            {tirednessData && <Line data={tirednessData} options={chartOptions} />}
          </div>
        </div>
      </div>

      {/* Weekly Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-emerald-100">Average Mood</h4>
            <div className="bg-emerald-400/30 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3.975 3.975 0 015.542 0 1 1 0 001.415-1.415 5.975 5.975 0 00-8.372 0 1 1 0 000 1.415z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className="text-4xl font-bold">
            {moodData && (moodData.datasets[0].data.reduce((a, b) => a + b, 0) / moodData.datasets[0].data.length).toFixed(1)}
          </p>
          <p className="text-emerald-100 mt-2 text-sm">out of 5</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-indigo-100">Physical Tiredness</h4>
            <div className="bg-indigo-400/30 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            </div>
          </div>
          <p className="text-4xl font-bold">
            {tirednessData && (tirednessData.datasets[0].data.reduce((a, b) => a + b, 0) / tirednessData.datasets[0].data.length).toFixed(1)}
          </p>
          <p className="text-indigo-100 mt-2 text-sm">out of 5</p>
        </div>

        <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-rose-100">Mental Tiredness</h4>
            <div className="bg-rose-400/30 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className="text-4xl font-bold">
            {tirednessData && (tirednessData.datasets[1].data.reduce((a, b) => a + b, 0) / tirednessData.datasets[1].data.length).toFixed(1)}
          </p>
          <p className="text-rose-100 mt-2 text-sm">out of 5</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 