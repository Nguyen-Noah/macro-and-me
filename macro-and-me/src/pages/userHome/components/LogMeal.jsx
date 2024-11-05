import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import api from '../../../utils/api';

// Image upload component
const ImageUpload = () => {
  const [inputText, setInputText] = useState('');
  const [nutritionInfo, setNutritionInfo] = useState('');

  const handleChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/upload', { text: inputText });
      setNutritionInfo(response.data.nutritionInfo);
    } catch (error) {
      console.error('Error submitting text:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputText}
          onChange={handleChange}
          placeholder="Enter text here"
        />
        <button type="submit">Send to OpenAI</button>
      </form>

      {nutritionInfo && (
        <div>
          <h2>OpenAI response:</h2>
          <p>{nutritionInfo}</p>
        </div>
      )}
    </div>
  );
};
// Food Search Component
const FoodSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleSubmit = async (e) => {

    e.preventDefault();
    if (query === '') return;

    setLoading(true);
    setError('');


    try {
      const apiKey = process.env.REACT_APP_USDA_API_KEY; 
      const apiUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&api_key=${apiKey}&dataType=Foundation`;
      const response = await fetch(apiUrl);
      const data = await response.json();

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


  const nutrientMap = {
    1008: 'calories', 
    1003: 'protein',  
    1004: 'fat',     
    1005: 'carbohydrates' 
  };

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


      <div className="mt-8 w-full max-w-md">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {results.length > 0 && (
          <ul className="list-disc pl-5">
            {results.map((food) => {
              const macros = getMacronutrients(food.foodNutrients);
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
//Log Meal Component
const LogMeal = () => {
    const [meal, setMeal] = useState({
        name: '',
        calories: '',
        fat: '',
        carbohydrates: '',
        protein: '',
    });
    const [mealType, setMealType] = useState('breakfast');
    const [mealId, setMealId] = useState(null); // <- this is generates/retrieved from Mongo
    const [firebaseUid, setFirebaseUid] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setFirebaseUid(user.uid);  // Set the firebaseUid when user is logged in
            } else {
                setFirebaseUid(null);  // Set to null if no user is logged in
            }
        });

        return () => unsubscribe();  // Cleanup subscription on unmount
      }, []);

    useEffect(() => {
        const fetchExistingMeal = async () => {
            if (!firebaseUid) return;

            try {
                const response = api.post('/get_meal',
                    { firebaseUid, mealType },
                    { headers: { 'Content-Type': 'application/json' }}
                );

                if (response.status === 200) {
                    setMealId((await response).data.mealId);
                }
            } catch (error) {
                console.error('Error fetching meal:', error);
            }
        };

        fetchExistingMeal();
    }, [firebaseUid, mealType]);

    const handleChange = (e) => {
        setMeal({
        ...meal,
        [e.target.name]: e.target.value,
        });
    };

    const handleMealTypeChange = (e) => {
        setMealType(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                setFirebaseUid(user.uid);

                // Include the meal type and UID in the request
                const response = await api.post('/log_meal',
                    { ...meal, mealType, firebaseUid, mealId } ,
                    { headers: { 'Content-Type': 'application/json' }}
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
        <form onSubmit={handleSubmit}>
            <h2>Log Meal</h2>
            <input
                type="text"
                name="name"
                value={meal.name}
                onChange={handleChange}
                placeholder="Meal Name"
                required
            />
            <input
                type="number"
                name="calories"
                value={meal.calories}
                onChange={handleChange}
                placeholder="Calories"
                required
            />
            <input
                type="number"
                name="fat"
                value={meal.fat}
                onChange={handleChange}
                placeholder="Fat"
                required
            />
            <input
                type="number"
                name="carbohydrates"
                value={meal.carbohydrates}
                onChange={handleChange}
                placeholder="Carbohydrates"
                required
            />
            <input
                type="number"
                name="protein"
                value={meal.protein}
                onChange={handleChange}
                placeholder="Protein"
                required
            />
            <select value={mealType} onChange={handleMealTypeChange}>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snacks">Snacks</option>
            </select>
            <button type="submit">Log Meal</button>
        </form>
    );
};

export default LogMeal;
