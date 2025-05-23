import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';

const categories = ['All', 'Yoga', 'Meditation', 'Mindfulness'];

const SelfHelpResources = () => {
  const [videos, setVideos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  const handleSearch = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`${API_URL}/selfhelp-resources`);
        setVideos(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchVideos();
  }, [API_URL]);

  const filteredVideos = videos.filter(video => {
    const matchCategory = selectedCategory === 'All' || video.category === selectedCategory;
    const matchSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (loading) return <div className="p-4 text-gray-600">Loading resources...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-emerald-50 font-sans">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center md:text-left mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-2">Video Library</h1>
          <p className="text-lg text-gray-600">Explore our collection of videos to relax and focus.</p>
        </div>

        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <form onSubmit={handleSearch} className="flex-grow md:max-w-sm">
            <label htmlFor="video-search" className="sr-only">Search videos by title</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                type="search"
                id="video-search"
                placeholder="Search videos by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              />
            </div>
          </form>

          <div className="flex items-center justify-center md:justify-start space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  selectedCategory === category
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 px-4">
          {filteredVideos.map((video) => (
            <div 
              key={video.id}
              className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-20px)] max-w-sm bg-white rounded-lg shadow-md hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 cursor-pointer flex-shrink-0"
              onClick={() => setSelectedVideo(video)}
            >
              <div className="relative aspect-video bg-gray-200">
                <img
                  src={video.image_url}
                  alt={video.title}
                  className="w-full h-full object-cover rounded-t-lg transition-all duration-300 hover:brightness-110"
                  onError={(e) => e.target.src = 'https://placehold.co/600x400/e2e8f0/94a3b8?text=Video'}
                />
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded-md">
                  {video.duration_minutes} Min
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 truncate mb-2">{video.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="inline-block px-2.5 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full">
                    {video.category}
                  </span>
                  <p className="text-sm text-gray-500">{video.duration_minutes} Min</p>
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{video.description}</p>
              </div>
            </div>
          ))}
        </div>

        {selectedVideo && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
            <div className="bg-white rounded-lg overflow-hidden w-full max-w-3xl">
              <div className="aspect-video bg-black">
                <iframe
                  src={getYouTubeEmbedUrl(selectedVideo.video_url)}
                  title={selectedVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-xl text-gray-800">{selectedVideo.title}</h3>
                <p className="text-sm text-gray-600">{selectedVideo.category}</p>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// YouTube URL conversion helper
function getYouTubeEmbedUrl(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  const videoId = (match && match[2].length === 11) ? match[2] : null;
  
  if (url.includes('embed')) return url;
  
  return videoId 
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1`
    : url;
}

export default SelfHelpResources;