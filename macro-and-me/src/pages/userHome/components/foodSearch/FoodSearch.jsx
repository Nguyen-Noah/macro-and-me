import { useState } from 'react';
import { useAuth } from '../../../../AuthContext';
import FoodDetails from './FoodDetails';

export default function FoodSearch({ closePopup }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedFood, setSelectedFood] = useState(null); 
    const user = useAuth().user;

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

        try {
            const appId = process.env.REACT_APP_NUTRITIONIX_APP_ID;
            const appKey = process.env.REACT_APP_NUTRITIONIX_APP_KEY;

            const response = await fetch(
                `https://trackapi.nutritionix.com/v2/search/instant?query=${trimmedQuery}`,
                {
                    headers: {
                        'x-app-id': appId,
                        'x-app-key': appKey,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Error fetching data from Nutritionix API.');
            }

            const data = await response.json();
            setResults([...data.common, ...data.branded]);
        } catch (error) {
            setError(error.message || 'Error fetching data');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectFood = (food) => {
        const idOrName = food.nix_item_id || food.food_name;
        console.log("Selected Food ID or Name:", idOrName); 
        setSelectedFood(idOrName);
    };


    const handleBackToSearch = () => {
        setSelectedFood(null);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-slate-400 w-full max-w-lg p-6 rounded-md shadow-lg relative">
                <button
                    onClick={closePopup}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    ✖
                </button>
                {!selectedFood ? (
                    <>
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
                            {!loading && results.length > 0 && (
                                <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-md p-4 bg-gray-500">
                                    <ul className="space-y-4">
                                        {results.map((food) => (
                                            <li
                                                key={food.food_name}
                                                className="flex items-center justify-between cursor-pointer"
                                                onClick={() => handleSelectFood(food)}
                                            >
                                                <p className="font-semibold">{food.food_name}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <FoodDetails
                        foodId={selectedFood}
                        handleBackToSearch={handleBackToSearch}
                        user={user}
                    />
                )}
            </div>
        </div>
    );
}
