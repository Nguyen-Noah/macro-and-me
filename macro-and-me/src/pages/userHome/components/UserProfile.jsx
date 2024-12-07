import React, { useState, useEffect } from "react";
import api from "../../../utils/api";
import { useAuth } from "../../../AuthContext";
import { useRefresh } from "../context/RefreshContext";

const activityLevels = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extra_active: 1.9,
};

const UserProfile = ({ onClose }) => {
    const user = useAuth().user;
    const firebaseUid = user.uid;
    const [editable, setEditable] = useState(false);
    const [useMetric, setUseMetric] = useState(false);
    const [loading, setLoading] = useState(true);
    const { triggerRefresh } = useRefresh();

    const [profileData, setProfileData] = useState({
        displayName: "",
        email: "",
        height: "",
        weight: "",
        age: "",
        activityLevel: "moderately_active",
        goal: "maintain", // Default to maintain
    });

    // Fetch user profile data from the backend
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await api.get(`/getUserProfile?firebaseUid=${firebaseUid}`);
                const userData = response.data;

                if (userData) {
                    setProfileData({
                        displayName: userData.displayName || "",
                        email: userData.email || "",
                        height: userData.height || "",
                        weight: userData.weight || "",
                        age: userData.age || "",
                        activityLevel: userData.activityLevel || "moderately_active",
                        goal: userData.goal || "maintain", // Set goal if available
                    });
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [firebaseUid]);

    // Unit conversion helpers
    const toImperialHeight = (cm) => (cm / 2.54).toFixed(1);
    const toImperialWeight = (kg) => (kg * 2.20462).toFixed(1);
    const toMetricHeight = (inches) => (inches * 2.54).toFixed(1);
    const toMetricWeight = (pounds) => (pounds / 2.20462).toFixed(1);

    useEffect(() => {
        if (!editable) return;

        setProfileData((prev) => ({
            ...prev,
            height: useMetric
                ? toMetricHeight(prev.height)
                : toImperialHeight(prev.height),
            weight: useMetric
                ? toMetricWeight(prev.weight)
                : toImperialWeight(prev.weight),
        }));
    }, [useMetric]);

    // Calculate TDEE
    const calculateTDEE = () => {
        const { weight, height, age, activityLevel } = profileData;
        const weightInKg = useMetric ? weight : toMetricWeight(weight);
        const heightInCm = useMetric ? height : toMetricHeight(height);

        const bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age;
        const activityMultiplier = activityLevels[activityLevel] || 1.55; // Default to moderate activity
        return Math.round(bmr * activityMultiplier);
    };

    const tdee = calculateTDEE();
    const maintainCalories = tdee;
    const cutCalories = Math.round(tdee - tdee * 0.2); // 20% deficit
    const bulkCalories = Math.round(tdee + tdee * 0.2); // 20% surplus

    const macroGoals = (calories) => ({
        protein: Math.round((calories * 0.3) / 4), // 30% of calories
        carbs: Math.round((calories * 0.4) / 4), // 40% of calories
        fat: Math.round((calories * 0.3) / 9), // 30% of calories
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({ ...prev, [name]: value }));
    };

    const toggleEdit = () => setEditable((prev) => !prev);

    const handleSave = async () => {
        try {
            const payload = {
                firebaseUid,
                userData: { ...profileData },
            };

            console.log("Payload:", payload);

            await api.put("/updateUserProfile", payload);
            triggerRefresh();
            toggleEdit();
            onClose();
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    if (loading) return <p>Loading user profile...</p>;

    return (
        <div className="py-4">
            <h2 className="text-2xl font-bold mb-4 text-black">User Profile</h2>
            <div className="flex justify-between items-center mb-4">
                <label className="text-black font-medium">Use Metric Units:</label>
                <input
                    type="checkbox"
                    checked={useMetric}
                    onChange={(e) => setUseMetric(e.target.checked)}
                    className="form-checkbox h-5 w-5 text-blue-500"
                />
            </div>
            <div className="space-y-4">
                {/* Display Name */}
                <div>
                    <label className="block text-sm font-medium text-black">Display Name</label>
                    <input
                        type="text"
                        name="displayName"
                        value={profileData.displayName}
                        onChange={handleInputChange}
                        disabled={!editable}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-black"
                    />
                </div>
                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-black">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        disabled
                        className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-black"
                    />
                </div>
                {/* Height */}
                <div>
                    <label className="block text-sm font-medium text-black">Height ({useMetric ? "cm" : "in"})</label>
                    <input
                        type="number"
                        name="height"
                        value={profileData.height}
                        onChange={handleInputChange}
                        disabled={!editable}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-black"
                    />
                </div>
                {/* Weight */}
                <div>
                    <label className="block text-sm font-medium text-black">Weight ({useMetric ? "kg" : "lbs"})</label>
                    <input
                        type="number"
                        name="weight"
                        value={profileData.weight}
                        onChange={handleInputChange}
                        disabled={!editable}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-black"
                    />
                </div>
                {/* Age */}
                <div>
                    <label className="block text-sm font-medium text-black">Age</label>
                    <input
                        type="number"
                        name="age"
                        value={profileData.age}
                        onChange={handleInputChange}
                        disabled={!editable}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-black"
                    />
                </div>
                {/* Activity Level */}
                <div>
                    <label className="block text-sm font-medium text-black">Activity Level</label>
                    <select
                        name="activityLevel"
                        value={profileData.activityLevel}
                        onChange={handleInputChange}
                        disabled={!editable}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-black"
                    >
                        <option value="sedentary">Sedentary</option>
                        <option value="lightly_active">Lightly Active</option>
                        <option value="moderately_active">Moderately Active</option>
                        <option value="very_active">Very Active</option>
                        <option value="extra_active">Extra Active</option>
                    </select>
                </div>
                {/* Goal */}
                <div>
                    <label className="block text-sm font-medium text-black">Goal</label>
                    <select
                        name="goal"
                        value={profileData.goal}
                        onChange={(e) => handleInputChange(e)}
                        disabled={!editable}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-black"
                    >
                        <option value="maintain">Maintain</option>
                        <option value="cut">Cut</option>
                        <option value="bulk">Bulk</option>
                    </select>
                </div>
            </div>
            {/* TDEE and Goals */}
            <div className="mt-6">
                <div className="grid grid-cols-2">
                    <p className="text-black font-bold text-sm">TDEE: {tdee} kcal/day</p>
                    <p className="text-black font-bold text-sm">Cut: {cutCalories} kcal/day</p>
                    <p className="text-black font-bold text-sm">Maintain: {maintainCalories} kcal/day</p>
                    <p className="text-black font-bold text-sm">Bulk: {bulkCalories} kcal/day</p>
                </div>
                <div className="mt-4 grid grid-cols-1">
                    <h4 className="text-sm font-bold text-black">Macro Goals</h4>
                    <p className="text-black text-xs">
                        <strong>Maintain:</strong> {JSON.stringify(macroGoals(maintainCalories))}
                    </p>
                    <p className="text-black text-xs">
                        <strong>Cut:</strong> {JSON.stringify(macroGoals(cutCalories))}
                    </p>
                    <p className="text-black text-xs">
                        <strong>Bulk:</strong> {JSON.stringify(macroGoals(bulkCalories))}
                    </p>
                </div>
            </div>
            {/* Buttons */}
            <div className="flex justify-end mt-4 space-x-2">
                {!editable && (
                    <button
                        onClick={toggleEdit}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Edit
                    </button>
                )}
                {editable && (
                    <>
                        <button
                            onClick={handleSave}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Save
                        </button>
                        <button
                            onClick={toggleEdit}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </>
                )}
                <button
                    onClick={onClose}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default UserProfile;
