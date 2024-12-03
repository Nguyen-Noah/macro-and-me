import { useState } from 'react';

export default function FoodSearch({ closePopup }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchCompleted, setSearchCompleted] = useState(false);
    const [addedFoods, setAddedFoods] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (query.trim() === '') {
            setError('Please enter a food item to search.');
            return;
        }

        setLoading(true);
        setError('');
        setResults([]);
        setSearchCompleted(false);

        try {
            const apiKey = process.env.REACT_APP_USDA_API_KEY;

            const foundationUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?query="${query}"&api_key=${apiKey}&dataType=Foundation&pageSize=50`;
            let response = await fetch(foundationUrl);
            let data = await response.json();

            if (response.ok && data.foods && data.foods.length > 0) {
                const filteredResults = data.foods.filter((food) =>
                    food.description.toLowerCase().includes(query.toLowerCase())
                );
                if (filteredResults.length > 0) {
                    setResults(filteredResults);
                } else {
                    throw new Error('No exact matches found in Foundation');
                }
            } else {
                const brandedUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?query="${query}"&api_key=${apiKey}&dataType=Branded&pageSize=50`;
                response = await fetch(brandedUrl);
                data = await response.json();

                if (response.ok && data.foods && data.foods.length > 0) {
                    const filteredResults = data.foods.filter((food) =>
                        food.description.toLowerCase().includes(query.toLowerCase())
                    );
                    const uniqueResults = filteredResults.filter(
                        (food, index, self) =>
                            index === self.findIndex((f) => f.description.toLowerCase() === food.description.toLowerCase())
                    );
                    if (uniqueResults.length > 0) {
                        setResults(uniqueResults);
                    } else {
                        setError('No exact matches found');
                    }
                } else {
                    setError('No food found');
                }
            }
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
    };

    const nutrientMap = {
        1008: 'calories',
        1003: 'protein',
        1004: 'fat',
        1005: 'carbs',
    };

    const getMacronutrients = (foodNutrients) => {
        const macros = {
            calories: null,
            protein: null,
            fat: null,
            carbs: null,
        };

        foodNutrients.forEach((nutrient) => {
            const nutrientKey = nutrientMap[nutrient.nutrientId];
            if (nutrientKey) {
                macros[nutrientKey] = nutrient.value;
            }
        });

        return macros;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-slate-700 w-full max-w-lg p-6 rounded-md shadow-lg relative">
                <button
                    onClick={closePopup}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    ✖
                </button>
                <h1 className="text-3xl font-bold mb-6 text-center">Food Search</h1>
                <form onSubmit={handleSubmit} className="w-full flex">
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
                                                <p>Calories: {macros.calories || 'N/A'} kcal</p>
                                                <p>Protein: {macros.protein || 'N/A'} g</p>
                                                <p>Fat: {macros.fat || 'N/A'} g</p>
                                                <p>Carbs: {macros.carbs || 'N/A'} g</p>
                                            </div>
                                            <button
                                                onClick={() => handleAddFood(food)}
                                                className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl ml-4 flex-shrink-0"
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
