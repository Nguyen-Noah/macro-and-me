import { useState } from 'react';

export default function FoodSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleSubmit = async (e) => {
    //Event handlder to check if search is blank.
    e.preventDefault();
    if (query === '') return;

    setLoading(true);
    setError('');


    //USDA API Key from env
    try {
      const apiKey = process.env.REACT_APP_USDA_API_KEY; 
      const apiUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&api_key=${apiKey}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      //Check response to retrieve food data
      if (response.ok) {
        setResults(data.foods);
      } else {
        setError(data.message || 'Error fetching data');
      }
    } catch (error) {
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  //Nutrient ID mapping to macronutrients
  const nutrientMap = {
    1008: 'calories', //Energy
    1003: 'protein',  //Protein
    1004: 'fat',      //Total lipid (fat)
    1005: 'carbohydrates' //Carbohydrates
  };

  //Helper function to extract macronutrients
  const getMacronutrients = (foodNutrients) => {
    const macros = {
      calories: null,
      protein: null,
      fat: null,
      carbohydrates: null,
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
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Search for Food</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter food name..."
          className="border p-2 w-full text-black"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 mt-2 w-full">
          Search
        </button>
      </form>

      {/* Display Results */}
      <div className="mt-8 w-full max-w-md">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {results.length > 0 && (
          <ul className="list-disc pl-5">
            {results.map((food) => {
              const macros = getMacronutrients(food.foodNutrients); // Extract macronutrients
              return (
                <li key={food.fdcId} className="mb-4">
                  <p><strong>{food.description}</strong></p>
                  <p>Calories: {macros.calories || 'N/A'} kcal</p>
                  <p>Protein: {macros.protein || 'N/A'} g</p>
                  <p>Fat: {macros.fat || 'N/A'} g</p>
                  <p>Carbohydrates: {macros.carbohydrates || 'N/A'} g</p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}