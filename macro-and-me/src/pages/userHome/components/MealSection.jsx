import { useAuth } from "../../../AuthContext";
import { useState, useEffect } from "react";
import FoodModal from "./FoodModal";
import { useRefresh } from "../context/RefreshContext";
import api from "../../../utils/api";
import { ICON_D_ARROW, ICON_U_ARROW, ICON_TRASH } from "../../../utils/svg";

const MealSection = ({ selectedDate }) => {
    const { triggerRefresh, refreshKey } = useRefresh();

    const [showError, setShowError] = useState(false);
    const [logs, setLogs] = useState([]);
    const [editedLogs, setEditedLogs] = useState({});
    const [selectedFood, setSelectedFood] = useState(null); // State for selected food
    const [showModal, setShowModal] = useState(false); // State for modal visibility
    const [visibleMeals, setVisibleMeals] = useState({
        breakfast: false,
        lunch: false,
        dinner: false,
        snacks: false,
    });

    const user = useAuth().user;
    const firebaseUid = user.uid;

    const fetchLogs = async (date) => {
        try {
            const response = await api.get("daily_logs", { firebaseUid });
            const logs = response.data;
            setLogs(logs || []);

            if (logs.length !== 0) {
                const requestedDate = new Date(date);
                requestedDate.setHours(0, 0, 0, 0);

                let foundLog = null;

                logs.forEach((logData) => {
                    const logDate = new Date(logData.date);
                    logDate.setHours(0, 0, 0, 0);

                    if (logDate.getTime() === requestedDate.getTime()) {
                        foundLog = logData;
                    }
                });

                if (foundLog) {
                    setEditedLogs(foundLog);
                } else {
                    setEditedLogs({});
                }
            } else {
                setEditedLogs({});
            }
        } catch (error) {
            setShowError(true);
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
                setShowModal(false);
                triggerRefresh();
            }
        } catch (error) {
            setShowError(true);
            console.error("Error saving food changes:", error);
        }
    };

    const toggleMealVisibility = (mealType) => {
        setVisibleMeals((prevState) => ({
            ...prevState,
            [mealType]: !prevState[mealType],
        }));
    };

    // Handle delete food
    const handleDeleteFood = async (mealKey, foodIndex) => {
        const foodId = editedLogs[mealKey]?.foods[foodIndex]._id;
    
        console.log("firebaseUid:", firebaseUid);
        console.log("mealType:", mealKey);
        console.log("foodId:", foodId);
        console.log("selectedDate:", selectedDate); // Pass the selectedDate to the backend
    
        try {
            const response = await api.delete('/remove_food', {
                data: {
                    firebaseUid,
                    mealType: mealKey,
                    foodId,
                    date: selectedDate, // Include selectedDate to ensure the correct log is targeted
                },
            });
    
            console.log("Food deleted successfully:", response.data);
            triggerRefresh(); // Refresh the data after deletion
        } catch (error) {
            setShowError(true); // Set error on delete failure
            console.error("Error deleting food:", error);
        }
    };
    

    useEffect(() => {
        fetchLogs(selectedDate);
    }, [refreshKey, selectedDate]);

    return (
        <section className="px-6 py-2">
            <div className="w-full space-y-4">
                {["breakfast", "lunch", "dinner", "snacks"].map((meal, index) => {
                    const mealData = editedLogs[meal];

                    return (
                        <div key={index} className="bg-neutral-900 px-4 pt-2 pb-4 rounded-lg">
                            <button
                                onClick={() => toggleMealVisibility(meal)}
                                className="flex justify-between items-center w-full p-2 text-white bg-transparent rounded-lg"
                            >
                                <h3 className="text-lg font-bold mb-2">
                                    {meal.charAt(0).toUpperCase() + meal.slice(1)}
                                </h3>
                                <span className="text-xl">
                                    {visibleMeals[meal] ? ICON_U_ARROW : ICON_D_ARROW}
                                </span>
                            </button>

                            {/* Conditionally render the meal foods */}
                            {visibleMeals[meal] && mealData && mealData.foods.length > 0 ? (
                                mealData.foods.map((food, foodIndex) => (
                                    <div
                                        key={foodIndex}
                                        className="flex items-center justify-between pl-5 cursor-pointer bg-neutral-800 rounded-lg px-2 py-2 mt-0 my-3"
                                        onClick={() => handleFoodClick(meal, foodIndex)}
                                    >
                                        <span>{food.name}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent triggering the food click
                                                handleDeleteFood(meal, foodIndex);
                                            }}
                                            className="text-red-500"
                                        >
                                            {ICON_TRASH}
                                        </button>
                                    </div>
                                ))
                            ) : visibleMeals[meal] ? (
                                <div className="flex items-center justify-between pl-5 cursor-pointer bg-neutral-800 rounded-lg px-2 py-2 mt-0 my-3">
                                    No data
                                </div>
                            ) : null}
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


