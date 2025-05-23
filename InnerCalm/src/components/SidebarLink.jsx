import React from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink

const SidebarLink = ({ icon: Icon, text, target }) => {
    return (
        <NavLink
            to={`/${target}`} 
            className={({ isActive }) =>
                `flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition duration-200 ease-in-out ${
                    isActive ? 'bg-emerald-600 text-white font-semibold shadow-md' : '' // Active state styling
                }`
            }
            aria-current={({ isActive }) => (isActive ? 'page' : undefined)} // Accessibility
        >
            {/* Render icon dynamically based on active state */}
            {({ isActive }) => (
                <>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} aria-hidden="true" />
                    <span className="text-sm font-medium">{text}</span>
                </>
            )}
        </NavLink>
    );
};

export default SidebarLink;