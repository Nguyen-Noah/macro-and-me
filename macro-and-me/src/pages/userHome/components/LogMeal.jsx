import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import api from '../../../utils/api';

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
