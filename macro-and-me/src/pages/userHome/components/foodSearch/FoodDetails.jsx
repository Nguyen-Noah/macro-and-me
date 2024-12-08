import { useState, useEffect } from 'react';
import api from '../../../../utils/api';
import { useRefresh } from '../../context/RefreshContext';

export default function FoodDetails({ foodId, handleBackToSearch, user, selectedDate, closePopup, onSuccess }) {
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
    const [mealType, setMealType] = useState('breakfast');


    useEffect(() => {
        const fetchFoodDetails = async () => {
            try {
                const appId = process.env.REACT_APP_NUTRITIONIX_APP_ID;
                const appKey = process.env.REACT_APP_NUTRITIONIX_APP_KEY;

                let response;

                // Check if `foodId` is a natural language query or an ID
                if (foodId.startsWith('nix_item_id_') || foodId.match(/^[a-f0-9]{24}$/)) {
                    // Branded food or specific item ID
                    response = await fetch(
                        `https://trackapi.nutritionix.com/v2/search/item?nix_item_id=${foodId}`,
                        {
                            headers: {
                                'x-app-id': appId,
                                'x-app-key': appKey,
                            },
                        }
                    );
                } else {
                    // Common food, treat `foodId` as a natural language query
                    response = await fetch(`https://trackapi.nutritionix.com/v2/natural/nutrients`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-app-id': appId,
                            'x-app-key': appKey,
                        },
                        body: JSON.stringify({
                            "query": foodId, 
                        }),
                    });
                }

                if (!response.ok) {
                    throw new Error('Error fetching food details.');
                }

                const data = await response.json();
                console.log("API Response:", data); // Debugging log

                const food = data.foods ? data.foods[0] : data.food;
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
            const response = await api.post('/log_meal', {
                ...meal,
                mealType,
                firebaseUid: user.uid,
                date: normalizeDate,
            });

            if (response.status === 201) {
                setMeal({ name: '', calories: '', fat: '', carbohydrates: '', protein: '' });
                closePopup();
                onSuccess();
                triggerRefresh();

            } else {
                const errorData = await response.json();
                alert('Error logging meal: ' + errorData.message);
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
                        <label className="block mb-2 text-black">Meal Type:</label>
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

                        <label className="block mt-4 text-black">Calories:</label>
                        <input
                            type="number"
                            name="calories"
                            value={meal.calories}
                            onChange={handleInputChange}
                            className="p-2 border rounded-md w-full text-black"
                        />

                        <label className="block mt-4 text-black">Protein (g):</label>
                        <input
                            type="number"
                            name="protein"
                            value={meal.protein}
                            onChange={handleInputChange}
                            className="p-2 border rounded-md w-full text-black"
                        />

                        <label className="block mt-4 text-black">Fat (g):</label>
                        <input
                            type="number"
                            name="fat"
                            value={meal.fat}
                            onChange={handleInputChange}
                            className="p-2 border rounded-md w-full text-black"
                        />

                        <label className="block mt-4 text-black">Carbohydrates (g):</label>
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
        </div>
    );
}
