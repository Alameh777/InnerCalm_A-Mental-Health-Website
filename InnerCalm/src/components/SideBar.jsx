import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Video,
  LogOut,
  Settings
} from 'lucide-react';

const SideBar = () => {
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      path: '/admin/dashboard',
      description: 'Overview and statistics'
    },
    {
      title: 'Users',
      icon: <Users size={20} />,
      path: '/admin/users',
      description: 'Manage user accounts'
    },
    {
      title: 'Videos',
      icon: <Video size={20} />,
      path: '/admin/videos',
      description: 'Manage video content'
    },
    {
      title: 'Settings',
      icon: <Settings size={20} />,
      path: '/admin/settings',
      description: 'Configure application settings'
    }
  ];

  const handleLogout = () => {
    // Add logout logic here
    localStorage.removeItem('token');
    window.location.href = '/auth';
  };

  return (
    <div className="w-72 bg-white border-r border-emerald-100 h-screen flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-emerald-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">IC</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">InnerCalm</h2>
            <p className="text-sm text-emerald-600 font-medium">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path === '/admin/dashboard' && location.pathname === '/admin');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-600 hover:bg-emerald-50/50 hover:text-emerald-600'
                }`}
              >
                <div className={`mr-3 transition-colors ${
                  isActive ? 'text-emerald-600' : 'text-gray-400 group-hover:text-emerald-500'
                }`}>
                  {item.icon}
                </div>
                <div>
                  <div className={`font-medium ${
                    isActive ? 'text-emerald-700' : 'text-gray-700'
                  }`}>
                    {item.title}
                  </div>
                  <div className={`text-xs mt-0.5 ${
                    isActive ? 'text-emerald-600' : 'text-gray-400'
                  }`}>
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-emerald-100">
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-3 w-full rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
        >
          <LogOut size={20} className="mr-3" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SideBar;