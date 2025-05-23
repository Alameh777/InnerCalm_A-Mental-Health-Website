import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

const VideosContent = () => {
  const [videos, setVideos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    video_url: '',
    duration_minutes: '',
    image_url: '',
    category: '',
    description: ''
  });
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`${API_URL}/selfhelp-resources`);
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
      alert('Failed to load videos');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        duration_minutes: Number(formData.duration_minutes)
      };

      if (editingId) {
        await axios.put(`${API_URL}/selfhelp-resources/${editingId}`, payload);
      } else {
        await axios.post(`${API_URL}/selfhelp-resources`, payload);
      }
      fetchVideos();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving video:', error);
      alert('Failed to save video');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await axios.delete(`${API_URL}/selfhelp-resources/${id}`);
        fetchVideos();
      } catch (error) {
        console.error('Error deleting video:', error);
        alert('Failed to delete video');
      }
    }
  };

  // Auto-generate YouTube thumbnail
  const handleVideoUrlChange = (url) => {
    if (url.includes('youtu')) {
      const videoId = url.split(/v\/|v=|youtu\.be\/|\/embed\//)[1]?.split(/[?&]/)[0];
      if (videoId) {
        setFormData(prev => ({
          ...prev,
          video_url: url,
          image_url: `https://img.youtube.com/vi/${videoId}/0.jpg`
        }));
        return;
      }
    }
    setFormData(prev => ({ ...prev, video_url: url }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Video Management</h1>
        <button 
          onClick={() => {
            setIsModalOpen(true);
            setFormData({
              title: '',
              video_url: '',
              duration_minutes: '',
              image_url: '',
              category: '',
              description: ''
            });
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          <span className="font-medium">Add Video</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map(video => (
          <div key={video.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="relative aspect-video overflow-hidden rounded-t-xl">
              <img 
                src={video.image_url} 
                alt={video.title} 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                onError={(e) => e.target.src = 'https://placehold.co/600x400/e2e8f0/94a3b8?text=Video'}
              />
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded-md">
                {video.duration_minutes} mins
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-800 truncate">{video.title}</h3>
              <div className="flex items-center justify-between mt-3">
                <span className="px-2.5 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full">
                  {video.category}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setFormData(video);
                      setEditingId(video.id);
                      setIsModalOpen(true);
                    }}
                    className="text-gray-400 hover:text-emerald-600 p-1.5 hover:bg-gray-50 rounded-lg"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="text-gray-400 hover:text-red-600 p-1.5 hover:bg-gray-50 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{video.description}</p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingId ? 'Edit Video' : 'Add New Video'}
              </h2>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingId(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="Video title"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  placeholder="Video description"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                <input
                  type="url"
                  placeholder="YouTube URL (e.g., https://youtu.be/ABC123)"
                  value={formData.video_url}
                  onChange={(e) => handleVideoUrlChange(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
                <input
                  type="url"
                  placeholder="Image URL"
                  value={formData.image_url}
                  onChange={e => setFormData({...formData, image_url: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    placeholder="Duration"
                    value={formData.duration_minutes}
                    onChange={e => setFormData({...formData, duration_minutes: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Yoga">Yoga</option>
                    <option value="Meditation">Meditation</option>
                    <option value="Mindfulness">Mindfulness</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition-colors"
                >
                  {editingId ? 'Save Changes' : 'Add Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideosContent;