import React from 'react';
import { Plus } from 'lucide-react';

const QuestionsContent = () => {
     const handleAddQuestion = () => {
         alert('Add new question action');
    };
    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">Manage Questions</h2>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                    <h3 className="text-lg font-semibold text-gray-700">Question Bank</h3>
                     <button
                         onClick={handleAddQuestion}
                         className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition duration-200 ease-in-out flex items-center space-x-2 self-end sm:self-center"
                    >
                         <Plus className="w-4 h-4" aria-hidden="true" />
                         <span>Add Question</span>
                     </button>
                </div>
                <p className="text-gray-600 mb-4">Manage assessment questions, user-submitted inquiries, and FAQs here.</p>
                {/* Add question management UI (e.g., list, forms) here */}
                <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                    {/* Example: Placeholder for a list of questions */}
                    <h4 className="font-medium text-gray-700 mb-2">Pending Questions (Example)</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li>How do I reset my password? <button className="text-emerald-600 text-xs ml-2">(Answer)</button></li>
                        <li>Question about video content <button className="text-emerald-600 text-xs ml-2">(Answer)</button></li>
                    </ul>
                     <p className="text-sm text-gray-500 mt-4">Full question management interface will be displayed here.</p>
                </div>
            </div>
        </div>
    );
};

export default QuestionsContent;