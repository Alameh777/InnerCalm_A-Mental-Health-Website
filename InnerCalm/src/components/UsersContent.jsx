import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import axios from 'axios';

const UsersContent = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const handleDeleteUser = async (userId) => {
        if (window.confirm(`Are you sure you want to delete user with ID: ${userId}?`)) {
            try {
                const response = await axios.delete(`http://127.0.0.1:8000/api/users/${userId}`);
                if (response.status === 200) {
                    setUsers(users.filter(user => user.id !== userId));
                }
            } catch (error) {
                if (error.response?.status === 403) {
                    alert('Cannot delete system user. This user is required for emergency submissions.');
                } else {
                    alert('Error deleting user. Please try again later.');
                }
                console.error('Error deleting user:', error);
            }
        }
    };

    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">Manage Users</h2>
            <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                    <h3 className="text-lg font-semibold text-gray-700">User List</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                            <tr>
                                <th className="px-6 py-3 rounded-l-lg">Name</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3 rounded-r-lg text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{user.name}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="text-red-600 hover:text-red-800 transition p-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                    <span>Showing 1 - {users.length} of {users.length} users</span>
                </div>
            </div>
        </div>
    );
};

export default UsersContent;
    