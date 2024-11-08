import React, { useState } from 'react';
import api from '../../../utils/api';
import { useAuth } from '../../../AuthContext';

const LogMeal = () => {
    const user = useAuth();
    const [meal, setMeal] = useState({
        name: '',
        calories: '',
        fat: '',
        carbohydrates: '',
        protein: '',
    });
    const [mealType, setMealType] = useState('breakfast');
    const [firebaseUid, setFirebaseUid] = useState(null);

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
            if (user) {
                setFirebaseUid(user.uid);

                const response = await api.post('/log_meal',
                    { ...meal, mealType, firebaseUid },
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
