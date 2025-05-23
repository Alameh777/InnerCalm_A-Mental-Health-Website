import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './SideBar';

const AdminLayout = () => {
    return (
        <div className="flex h-screen bg-emerald-50/50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header Bar */}
                <header className="bg-white border-b border-emerald-100 h-16 flex items-center justify-between px-8 shadow-sm">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
                            Admin Dashboard
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="bg-emerald-50 px-4 py-2 rounded-lg">
                            <span className="text-sm text-emerald-700 font-medium">Admin Mode</span>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto bg-gradient-to-br from-emerald-50/30 to-white p-8">
                    <div className="container mx-auto max-w-7xl">
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm p-8 min-h-[calc(100vh-10rem)] border border-emerald-100/50">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;