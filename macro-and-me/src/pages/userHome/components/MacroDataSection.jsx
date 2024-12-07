import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import api from "../../../utils/api";
import { useAuth } from "../../../AuthContext";
import { useRefresh } from "../context/RefreshContext";

ChartJS.register(ArcElement, Tooltip, Legend);

const MacroDataSection = ({ selectedDate }) => {
    const user = useAuth().user;
    const firebaseUid = user.uid;

    const { refreshKey } = useRefresh(); // Access refreshKey from the RefreshContext

    const [macros, setMacros] = useState({
        calories: { label: "Kcal", current: 0, max: 2000 },
        protein: { label: "Proteins", current: 0, max: 150, scale: "g" },
        fat: { label: "Fats", current: 0, max: 70, scale: "g" },
        carbohydrates: { label: "Carbs", current: 0, max: 80, scale: "g" },
    });


    useEffect(() => {
        const fetchLogsAndCalculateMacros = async (date) => {
            try {
    
                const requestedDate = new Date(date);
                requestedDate.setHours(0, 0, 0, 0); 
    
                console.log("Requested Date:", requestedDate.toISOString()); 
    
                const response = await api.get("/daily_logs", { firebaseUid });
    
                if (response.status === 200 && response.data) {
                    console.log("API Response:", response.data);
    
                    let log = {}; 
    
                    response.data.forEach((logData) => {
                        const logDate = new Date(logData.date); 
                        logDate.setHours(0, 0, 0, 0); 
    
                        console.log("Log Date:", logDate.toISOString()); 
    
                        if (logDate.getTime() === requestedDate.getTime()) {
                            log = logData; 
                        }
                    });
    
                    if (Object.keys(log).length === 0) {
                        console.log("CHART - No logs found for the selected date.");
                    } else {
                        console.log("CHART - Log found for the selected date.");
                    }
    
                    const totalNutrition = log.dailyTotal || {
                        calories: 0,
                        fat: 0,
                        protein: 0,
                        carbohydrates: 0,
                    };
    
                    setMacros({
                        calories: { label: "Kcal", current: totalNutrition.calories || 0, max: 2000 },
                        protein: { label: "Proteins", current: totalNutrition.protein || 0, max: 150, scale: "g" },
                        fat: { label: "Fats", current: totalNutrition.fat || 0, max: 70, scale: "g" },
                        carbohydrates: { label: "Carbs", current: totalNutrition.carbohydrates || 0, max: 80, scale: "g" },
                    });
                }
            } catch (error) {
                console.error("Error fetching logs:", error);
            }
        };

        fetchLogsAndCalculateMacros(selectedDate)
    }, [refreshKey, selectedDate, firebaseUid]); 

    const doughnutData = {
        labels: ["Current Calories", "Remaining"],
        datasets: [
            {
                label: "Calories",
                data: [macros.calories.current, macros.calories.max - macros.calories.current],
                backgroundColor: ["#10B981", "#E5E7EB"],
                hoverOffset: 4,
            },
        ],
    };

    const doughnutOptions = {
        cutout: "75%",
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
        },
    };

    return (
        <section className="px-6 pb-4">
            
            <div className="bg-slate-700 rounded-b-2xl px-3 pb-6 pt-2 shadow-md w-full flex items-center justify-between md:px-28">
                {/* Doughnut Chart */}
                <div className="md:pl-10">
                    <div className="relative">
                        <div className="w-36 h-36 md:w-52 md:h-52">
                            <Doughnut data={doughnutData} options={doughnutOptions} />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-sm font-semibold text-white">
                                    {macros.calories.current} kcal
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Macro Progress Bars */}
                <div className="w-full max-w-sm pl-4 pr-2">
                    {[
                        {
                            label: "Protein",
                            color: "bg-green-500",
                            current: macros.protein.current,
                            max: macros.protein.max,
                            scale: macros.protein.scale,
                        },
                        {
                            label: "Fat",
                            color: "bg-yellow-500",
                            current: macros.fat.current,
                            max: macros.fat.max,
                            scale: macros.fat.scale,
                        },
                        {
                            label: "Carbs",
                            color: "bg-blue-500",
                            current: macros.carbohydrates.current,
                            max: macros.carbohydrates.max,
                            scale: macros.carbohydrates.scale,
                        },
                    ].map((macro) => (
                        <div key={macro.label} className="mb-1">
                            <div className="flex justify-between mb-1">
                                <span className="text-white text-sm">{macro.label}</span>
                                <span className="text-gray-300 text-sm">
                                    {macro.current}
                                    {macro.scale} / {macro.max}
                                    {macro.scale}
                                </span>
                            </div>
                            <div className="w-full bg-gray-500 h-3 rounded-sm overflow-hidden">
                                <div
                                    className={`${macro.color} h-full`}
                                    style={{ width: `${(macro.current / macro.max) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MacroDataSection;
