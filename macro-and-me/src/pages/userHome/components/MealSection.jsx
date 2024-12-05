import api from "../../../utils/api";
import { useAuth } from "../../../AuthContext";
import { useState, useEffect } from "react";
import FoodModal from "./FoodModal"; // Import the FoodModal component

const MealSection = () => {
    const [showError, setShowError] = useState(false);
    const [logs, setLogs] = useState([]);
    const [editedLogs, setEditedLogs] = useState({});
    const [error, setError] = useState(null);
    const [selectedFood, setSelectedFood] = useState(null); // State for selected food
    const [showModal, setShowModal] = useState(false); // State for modal visibility
    const user = useAuth().user;
    const firebaseUid = user.uid;

    const fetchLogs = async () => {
        try {
            if (user) {
                const response = await api.get("daily_logs", { firebaseUid });
                console.log("Fetched logs data:", response.data);
                setLogs(response.data || []);
                setEditedLogs(
                    response.data.length > 0 ? { ...response.data[0] } : {}
                );
            }
        } catch (error) {
            setError("Failed to fetch logs");
            console.error("Error fetching logs:", error);
        }
    };

    const handleFoodClick = (mealKey, foodIndex) => {
        const food = editedLogs[mealKey]?.foods[foodIndex];
        setSelectedFood({ ...food, mealKey, foodIndex });
        setShowModal(true);
    };

    const handleMacroChange = (macro, value) => {
        setSelectedFood((prev) => ({
            ...prev,
            [macro]: value,
        }));
    };

    const saveFoodChanges = async () => {
        try {
            if (user) {
                const updatedFood = {
                    calories: parseInt(selectedFood.calories),
                    fat: parseInt(selectedFood.fat),
                    protein: parseInt(selectedFood.protein),
                    carbohydrates: parseInt(selectedFood.carbohydrates),
                };

                const foodId = selectedFood._id;
                const response = await api.put("/food", { foodId, updatedFood });

                console.log("Food changes saved successfully:", response.data);
                // Close modal after saving
                setShowModal(false);
            }
        } catch (error) {
            console.error("Error saving food changes:", error);
            setShowError(true); // Show error message if save fails
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <section className="px-6 py-2">
            <div className="w-full mt-8 space-y-4">
                {["Breakfast", "Lunch", "Dinner", "Snacks"].map((meal, index) => {
                    const mealKey = meal.toLowerCase();
                    const mealData = editedLogs[mealKey];

                    return (
                        <div
                            key={index}
                            className="bg-neutral-900 p-4 rounded-lg h-auto flex flex-col"
                        >
                            <h3 className="text-lg font-bold mb-2">{meal}</h3>
                            {mealData && mealData.foods.length > 0 ? (
                                mealData.foods.map((food, foodIndex) => (
                                    <div
                                        key={foodIndex}
                                        className="flex items-center justify-between mb-2 cursor-pointer"
                                        onClick={() => handleFoodClick(mealKey, foodIndex)}
                                    >
                                        <span>{food.name}</span>
                                    </div>
                                ))
                            ) : (
                                <div>No data</div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Food Modal */}
            {showModal && selectedFood && (
                <FoodModal
                    food={selectedFood}
                    onMacroChange={handleMacroChange}
                    onSave={saveFoodChanges}
                    errorMessage={showError}
                    onCancel={() => {
                        setShowModal(false);
                        setShowError(false);
                    }}
                />
            )}
        </section>
    );
};

export default MealSection;
