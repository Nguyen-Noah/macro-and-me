import { useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../AuthContext';

export default function FoodSearch({ closePopup }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchCompleted, setSearchCompleted] = useState(false);
    const [addedFoods, setAddedFoods] = useState([]);
    const [mealType, setMealType] = useState('breakfast');
    const user = useAuth().user;
    const firebaseUid = user.uid;

    const nutrientMap = {
        1008: 'calories',
        1003: 'protein',
        1004: 'fat',
        1005: 'carbs',
    };

    const handleMealTypeChange = (e) => {
        setMealType(e.target.value);
    };

    const getMacronutrients = (foodNutrients) => {
        const macros = {
            calories: null,
            protein: null,
            fat: null,
            carbs: null,
        };

        foodNutrients.forEach((nutrient) => {
            const key = nutrientMap[nutrient.nutrientId];
            if (key) {
                macros[key] = Math.round(nutrient.value);
            }
        });
        return macros;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedQuery = query.trim();
        if (!trimmedQuery) {
            setError('Please enter a food item to search.');
            return;
        }

        setLoading(true);
        setError('');
        setResults([]);
        setSearchCompleted(false);

        try {
            const apiKey = process.env.REACT_APP_USDA_API_KEY;
            const fetchData = async (dataType) => {
                const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${trimmedQuery}&api_key=${apiKey}&dataType=${dataType}&pageSize=50`;
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error('Error fetching data.');
                }

                const data = await response.json();
                return data.foods || [];
            }

            const foundationFoods = await fetchData('Foundation');
            const brandedFoods = foundationFoods.length ? [] : await fetchData('Branded');

            const allFoods = [...foundationFoods, ...brandedFoods];

            if (allFoods.length === 0) {
                throw new Error('No matching foods found.');
            }

            setResults(allFoods);
        } catch (error) {
            setError(error.message || 'Error fetching data');
        } finally {
            setLoading(false);
            setSearchCompleted(true);
        }
    };

    const handleAddFood = (food) => {
        if (!addedFoods.some((addedFood) => addedFood.fdcId === food.fdcId)) {
            setAddedFoods((prev) => [...prev, food]);
        }

        const relevantNutrients = food.foodNutrients
            .filter((nutrient) => [1008, 1003, 1004, 1005].includes(nutrient.nutrientId))
            .reduce((acc, nutrient) => {
                const key = nutrientMap[nutrient.nutrientId];
                acc[key] = `${nutrient.value} ${nutrient.unitName.toLowerCase()}`;
                return acc;
            }, {});

        const logData = {
            name: food.description,
            calories: Math.round(parseFloat(relevantNutrients.calories)) || 0,
            fat: Math.round(parseFloat(relevantNutrients.fat)) || 0,
            protein: Math.round(parseFloat(relevantNutrients.protein)) || 0,
            carbohydrates: Math.round(parseFloat(relevantNutrients.carbs)) || 0,
        };

        submitFood(logData);
    };

    const submitFood = async (logData) => {
        try {
            if (user) {
                const response = await api.post('/log_meal',
                    { ...logData, mealType, firebaseUid },
                    { headers: { 'Content-Type': 'application/json' }}
                );
                if (response.status === 201) {
                    alert('Meal logged successfully!');
                } else {
                    const errorData = await response.json();
                    setError('Error adding food:' + errorData.message);
                }
            }
        } catch (error) {
            alert('User not logged in.');
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-slate-400 w-full max-w-lg p-6 rounded-md shadow-lg relative">
                <button
                    onClick={closePopup}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    ✖
                </button>
                <h1 className="text-3xl font-bold mb-6 text-center">Food Search</h1>
                <form onSubmit={handleSubmit} className="w-full flex">
                    <select value={mealType} onChange={handleMealTypeChange}>
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="snacks">Snacks</option>
                    </select>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter food name..."
                        className="border p-2 flex-grow text-black rounded-l-md bg-white"
                    />
                    <button
                        type="submit"
                        className="bg-gray-600 text-white p-2 rounded-r-md"
                    >
                        Search
                    </button>
                </form>
                {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
                <div className="mt-6">
                    {loading && <p>Loading...</p>}
                    {!loading && searchCompleted && results.length > 0 && (
                        <div className="overflow-y-auto max-h-64 border border-gray-300 rounded-md p-4 bg-gray-500">
                            <ul className="space-y-4">
                                {results.map((food) => {
                                    const macros = getMacronutrients(food.foodNutrients);
                                    return (
                                        <li key={food.fdcId} className="flex items-center justify-between">
                                            <div className="flex-grow">
                                                <p className="font-semibold">{food.description}</p>
                                                <p>Calories: {macros.calories || 0} calories</p>
                                                <p>Protein: {macros.protein || 0}g</p>
                                                <p>Fat: {macros.fat || 0}g</p>
                                                <p>Carbs: {macros.carbs || 0} g</p>
                                            </div>
                                            <button
                                                onClick={() => handleAddFood(food)}
                                                className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl ml-4 flex-shrink-0"
                                                title="Add to Homepage"
                                            >
                                                +
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
