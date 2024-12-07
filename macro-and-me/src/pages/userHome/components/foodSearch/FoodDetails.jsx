import { useState, useEffect } from 'react';
import api from '../../../../utils/api';
import { useRefresh } from '../../context/RefreshContext';

export default function FoodDetails({ foodId, handleBackToSearch, user, selectedDate, closePopup }) {
    const { triggerRefresh } = useRefresh();
    const [foodDetails, setFoodDetails] = useState(null);
    const [meal, setMeal] = useState({
        name: '',
        calories: '',
        fat: '',
        carbohydrates: '',
        protein: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [mealType, setMealType] = useState('breakfast'); // Default meal type
    const [showSuccessModal, setShowSuccessModal] = useState(false); // State for success modal

    useEffect(() => {
        const fetchFoodDetails = async () => {
            try {
                const appId = process.env.REACT_APP_NUTRITIONIX_APP_ID2;
                const appKey = process.env.REACT_APP_NUTRITIONIX_APP_KEY2;

                let response;

                // Check if `foodId` is a barcode/UPC or a natural language query
                if (/^\d+$/.test(foodId)) {
                    // Barcode/UPC detected, use v2/search/item
                    response = await fetch(
                        `https://trackapi.nutritionix.com/v2/search/item?upc=${foodId}`,
                        {
                            headers: {
                                'x-app-id': appId,
                                'x-app-key': appKey,
                            },
                        }
                    );
                } else {
                    // Natural language query, use v2/natural/nutrients
                    response = await fetch(`https://trackapi.nutritionix.com/v2/natural/nutrients`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-app-id': appId,
                            'x-app-key': appKey,
                        },
                        body: JSON.stringify({
                            query: foodId, // Pass the natural language query
                        }),
                    });
                }

                if (!response.ok) {
                    throw new Error('Error fetching food details.');
                }

                const data = await response.json();
                console.log("API Response:", data);

                const food = data.foods ? data.foods[0] : data.food; // Support both responses
                if (!food) throw new Error('No food details found.');

                setFoodDetails(food);
                setMeal({
                    name: food.food_name || '',
                    calories: food.nf_calories || '',
                    fat: food.nf_total_fat || '',
                    carbohydrates: food.nf_total_carbohydrate || '',
                    protein: food.nf_protein || '',
                });
            } catch (error) {
                console.error('Error fetching food details:', error.message);
                setError('Error fetching food details.');
            } finally {
                setLoading(false);
            }
        };

        fetchFoodDetails();
    }, [foodId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMeal((prev) => ({ ...prev, [name]: value }));
    };

    const handleMealLog = async () => {
        const normalizeDate = new Date(selectedDate);
        normalizeDate.setHours(0, 0, 0, 0);

        try {
            if (user) {
                const firebaseUid = user.uid;
                const response = await api.post(
                    '/log_meal',
                    { ...meal, mealType, firebaseUid, date: normalizeDate },
                    { headers: { 'Content-Type': 'application/json' } }
                );
                if (response.status === 201) {
                    setMeal({ name: '', calories: '', fat: '', carbohydrates: '', protein: '' });

                    setShowSuccessModal(true);

                    setTimeout(() => {
                        setShowSuccessModal(false);
                    }, 3000);

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
        <div>
            {loading && <p>Loading food details...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {foodDetails && (
                <div>
                    <h2 className="text-xl font-bold text-black text-center">{foodDetails.food_name}</h2>
                    <p className="text-black pt-3 text-center">Calories: {foodDetails.nf_calories || 0} kcal</p>
                    <p className="text-black text-center">Protein: {foodDetails.nf_protein || 0} g</p>
                    <p className="text-black text-center">Fat: {foodDetails.nf_total_fat || 0} g</p>
                    <p className="text-black text-center">Carbs: {foodDetails.nf_total_carbohydrate || 0} g</p>

                    <div className="mt-4">
                        <label className="block mb-2">Meal Type:</label>
                        <select
                            value={mealType}
                            onChange={(e) => setMealType(e.target.value)}
                            className="p-2 border rounded-md w-full text-black"
                        >
                            <option value="breakfast">Breakfast</option>
                            <option value="lunch">Lunch</option>
                            <option value="dinner">Dinner</option>
                            <option value="snacks">Snacks</option>
                        </select>

                        <label className="block mt-4">Calories:</label>
                        <input
                            type="number"
                            name="calories"
                            value={meal.calories}
                            onChange={handleInputChange}
                            className="p-2 border rounded-md w-full text-black"
                        />

                        <label className="block mt-4">Protein (g):</label>
                        <input
                            type="number"
                            name="protein"
                            value={meal.protein}
                            onChange={handleInputChange}
                            className="p-2 border rounded-md w-full text-black"
                        />

                        <label className="block mt-4">Fat (g):</label>
                        <input
                            type="number"
                            name="fat"
                            value={meal.fat}
                            onChange={handleInputChange}
                            className="p-2 border rounded-md w-full text-black"
                        />

                        <label className="block mt-4">Carbohydrates (g):</label>
                        <input
                            type="number"
                            name="carbohydrates"
                            value={meal.carbohydrates}
                            onChange={handleInputChange}
                            className="p-2 border rounded-md w-full text-black"
                        />
                    </div>
                    <div className="flex justify-center">
                        <button
                            onClick={handleBackToSearch}
                            className="bg-gray-500 text-white p-2 rounded mt-4 mr-2 px-4"
                        >
                            Back to Search
                        </button>
                        <button
                            onClick={handleMealLog}
                            className="bg-blue-500 text-white p-2 rounded mt-4 ml-2 px-4"
                        >
                            Log Meal
                        </button>
                    </div>
                </div>
            )}

            {showSuccessModal && (
                <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-6 rounded-lg shadow-xl border-4 border-green-600">
                    <p className="font-semibold">Successfully added food!</p>
                </div>
            )}
        </div>
    );
}
