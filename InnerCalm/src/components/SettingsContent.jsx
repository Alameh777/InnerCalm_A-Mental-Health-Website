import React, { useState, useEffect } from 'react';
import { Phone, Save } from 'lucide-react';
import axios from 'axios';

const SettingsContent = () => {
    const [therapistNumber, setTherapistNumber] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [validationError, setValidationError] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/admin/settings');
            setTherapistNumber(response.data.therapist_number || '');
            setLoading(false);
        } catch (err) {
            setError('Failed to load settings');
            setLoading(false);
        }
    };

    const validateNumber = (number) => {
        // Remove any non-digit characters
        const cleanNumber = number.replace(/\D/g, '');
        
        if (cleanNumber.length < 10) {
            return 'Phone number must be at least 10 digits long';
        }
        if (cleanNumber.length > 15) {
            return 'Phone number cannot be longer than 15 digits';
        }
        return '';
    };

    const handleNumberChange = (e) => {
        const value = e.target.value;
        setTherapistNumber(value);
        setValidationError(validateNumber(value));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setValidationError('');

        // Clean the number (remove any non-digit characters)
        const cleanNumber = therapistNumber.replace(/\D/g, '');
        
        // Validate before submission
        const validationMessage = validateNumber(cleanNumber);
        if (validationMessage) {
            setValidationError(validationMessage);
            return;
        }

        try {
            await axios.post('http://127.0.0.1:8000/api/admin/settings', {
                therapist_number: cleanNumber
            });
            setSuccessMessage('Settings saved successfully!');

            // Update the number in localStorage for immediate use in the chatbot
            localStorage.setItem('therapistNumber', cleanNumber);

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (err) {
            if (err.response?.data?.errors?.therapist_number) {
                setValidationError(err.response.data.errors.therapist_number[0]);
            } else {
                setError('Failed to save settings');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">Settings</h2>
            <div className="bg-white p-6 rounded-xl shadow-md max-w-2xl mx-auto">
                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <div className="border-b pb-6">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Crisis Support Settings</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="therapistNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                        Therapist Contact Number
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        </div>
                                        <input
                                            type="text"
                                            name="therapistNumber"
                                            id="therapistNumber"
                                            value={therapistNumber}
                                            onChange={handleNumberChange}
                                            className={`focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md ${
                                                validationError ? 'border-red-300' : ''
                                            }`}
                                            placeholder="Enter WhatsApp number (e.g., 1234567890)"
                                        />
                                    </div>
                                    {validationError && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {validationError}
                                        </p>
                                    )}
                                    <p className="mt-2 text-sm text-gray-500">
                                        Enter only numbers (10-15 digits). This number will be displayed to users in crisis situations.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={!!validationError}
                                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                    validationError 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
                                }`}
                            >
                                <Save className="h-4 w-4 mr-2" />
                                Save Settings
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsContent;