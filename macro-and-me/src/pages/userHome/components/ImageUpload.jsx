import React, { useState } from 'react';
import api from '../../../utils/api';
import { useAuth } from '../../../AuthContext';
import { useRefresh } from '../context/RefreshContext';

const ImageUpload = ({ selectedDate, closePopup, onSuccess }) => {
    const { triggerRefresh } = useRefresh();
    const [file, setFile] = useState(null);
    const [textInput, setTextInput] = useState('');
    const [mealType, setMealType] = useState('dinner'); // Default meal type
    const [nutritionInfo, setNutritionInfo] = useState(null); // Changed to store parsed JSON
    const [image, setImage] = useState(null);
    const user = useAuth().user;

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);

        if (e.target.files && e.target.files[0]) {
            setImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleTextChange = (e) => {
        setTextInput(e.target.value);
    };

    const handleMealTypeChange = (e) => {
        setMealType(e.target.value);
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file) {
            alert('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('text', textInput);

        try {
            const response = await api.post('/upload', formData);
            setNutritionInfo(JSON.parse(response.data.nutritionInfo)); // Parse response
        } catch (error) {
            console.error('Error submitting text:', error);
            alert('Failed to process the image. Please try again.');
        }
    };

    const handleMealLog = async () => {
        const normalizeDate = new Date(selectedDate);
        normalizeDate.setHours(0, 0, 0, 0);

        try {
            if (user) {
                console.log(user);
                const firebaseUid = user.uid;
                const response = await api.post(
                    '/log_meal',
                    {
                        name: nutritionInfo.name || 'Uploaded Meal',
                        calories: nutritionInfo.calories,
                        fat: nutritionInfo.fat,
                        carbohydrates: nutritionInfo.carbohydrates,
                        protein: nutritionInfo.protein,
                        mealType,
                        firebaseUid,
                        date: normalizeDate,
                    },
                    { headers: { 'Content-Type': 'application/json' } }
                );

                if (response.status === 201) {
                    onSuccess();
                    closePopup();
                    triggerRefresh();

                } else {
                    const errorData = await response.json();
                    alert('Error logging meal: ' + errorData.message);
                }
            } else {
                alert('User not logged in');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error logging meal. Please try again.');
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow-md">
            <form onSubmit={handleUpload} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-bold mb-2">
                        Select an Image:
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full text-gray-700 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-bold mb-2">
                        Optional Text Input:
                    </label>
                    <input
                        type="text"
                        placeholder="Add reference labels here"
                        value={textInput}
                        onChange={handleTextChange}
                        className="w-full text-gray-700 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-bold mb-2">
                        Select Meal Type:
                    </label>
                    <select
                        value={mealType}
                        onChange={handleMealTypeChange}
                        className="w-full text-gray-700 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    >
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="snacks">Snacks</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
                >
                    Send to OpenAI
                </button>
            </form>

            {image && (
                <div className="mt-6">
                    <h3 className="text-lg font-bold mb-2 text-gray-700">Image Preview:</h3>
                    <img
                        src={image}
                        alt="Selected Preview"
                        className="w-full max-h-64 object-cover border border-gray-300 rounded"
                    />
                </div>
            )}

            {nutritionInfo && (
                <div className="mt-6 p-4 border border-gray-300 rounded shadow-md">
                    <h2 className="text-xl font-bold text-gray-700 mb-4">Nutritional Information</h2>
                    <p className="text-black underline font-bold">{nutritionInfo.name}</p>
                    <p className="text-black">
                        <strong>Calories:</strong> {nutritionInfo.calories} kcal
                    </p>
                    <p className="text-black">
                        <strong>Fat:</strong> {nutritionInfo.fat} g
                    </p>
                    <p className="text-black">
                        <strong>Carbohydrates:</strong> {nutritionInfo.carbohydrates} g
                    </p>
                    <p className="text-black">
                        <strong>Protein:</strong> {nutritionInfo.protein} g
                    </p>
                    <button
                        onClick={handleMealLog}
                        className="mt-4 w-full bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600"
                    >
                        Log Meal
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
