//=========================================================
// File: src/components/ProfileContent.jsx
//=========================================================
import React from 'react';

const ProfileContent = () => {

    const handleSubmit = (event) => {
        event.preventDefault();
        alert('Profile update submitted!');
        // Add actual form submission logic here (e.g., API call)
    };

    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">Update Profile</h2>
            <div className="bg-white p-6 rounded-xl shadow-md max-w-2xl mx-auto">
                 <form onSubmit={handleSubmit}>
                    <div className="space-y-6"> {/* Increased spacing */}
                        {/* Avatar Upload */}
                         <div className="flex items-center space-x-4">
                            <img
                                src="https://placehold.co/80x80/059669/FFFFFF?text=AD"
                                alt="Current Avatar"
                                className="w-20 h-20 rounded-full border-2 border-emerald-300 object-cover" // Added object-cover
                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/80x80/cccccc/ffffff?text=Error"; }}
                            />
                            <div>
                                <label htmlFor="avatar-upload" className="cursor-pointer bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200">
                                    Change Avatar
                                </label>
                                <input type="file" id="avatar-upload" className="hidden" accept="image/*" />
                                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                            </div>
                        </div>

                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                defaultValue="Admin Name" // Use defaultValue for uncontrolled component initially
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Enter your full name"
                            />
                        </div>

                         {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                defaultValue="admin.name@innercalm.com"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50" // Slightly different style for non-editable?
                                placeholder="Enter your email"
                                readOnly // Assuming email might not be directly editable
                            />
                             <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
                        </div>

                         {/* Password Fields */}
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Enter new password (optional)"
                            />
                        </div>
                         <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Confirm new password"
                            />
                        </div>

                         {/* Submit Button */}
                        <div className="text-right border-t pt-6 mt-2">
                            <button
                                type="submit"
                                className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-200 ease-in-out"
                            >
                                Update Profile
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileContent;