import { useState, useEffect } from 'react';
import api from '../../../../utils/api'

export default function FoodDetails({ foodId, handleBackToSearch, user }) {
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

    useEffect(() => {
        const fetchFoodDetails = async () => {
            try {
                const appId = process.env.REACT_APP_NUTRITIONIX_APP_ID;
                const appKey = process.env.REACT_APP_NUTRITIONIX_APP_KEY;

                let response;
                if (foodId.startsWith('nix_item_id_')) {
                    // Branded food with `nix_item_id`
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
                    // Common food, use `natural/nutrients` endpoint
                    response = await fetch(`https://trackapi.nutritionix.com/v2/natural/nutrients`, {
                        method: 'POST',
                        headers: {
                            'x-app-id': appId,
                            'x-app-key': appKey,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ query: foodId }),
                    });
                }

                if (!response.ok) {
                    throw new Error('Error fetching food details.');
                }

                const data = await response.json();
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
        try {
            if (user) {
                const firebaseUid = user.uid;
                const response = await api.post(
                    '/log_meal',
                    { ...meal, mealType, firebaseUid },
                    { headers: { 'Content-Type': 'application/json' } }
                );
                if (response.status === 201) {
                    alert('Meal logged successfully!');
                    setMeal({ name: '', calories: '', fat: '', carbohydrates: '', protein: '' });
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
                    <h2 className="text-xl font-bold">{foodDetails.food_name}</h2>
                    <p>Calories: {foodDetails.nf_calories || 0} kcal</p>
                    <p>Protein: {foodDetails.nf_protein || 0} g</p>
                    <p>Fat: {foodDetails.nf_total_fat || 0} g</p>
                    <p>Carbs: {foodDetails.nf_total_carbohydrate || 0} g</p>

                    {/* Editable Inputs */}
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

                    <button
                        onClick={handleMealLog}
                        className="bg-green-500 text-white p-2 rounded mt-4"
                    >
                        Log Meal
                    </button>
                    <button
                        onClick={handleBackToSearch}
                        className="bg-gray-500 text-white p-2 rounded ml-2"
                    >
                        Back to Search
                    </button>
                </div>
            )}
        </div>
    );
}
