"use client";

import { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const MacroDataSection = () => {
    const [macros, setMacros] = useState({
        calories: {
            current: 400,
            max: 1700
        },
        protein: {
            current: 40,
            max: 170,
        },
        fat: {
            current: 20,
            max: 50,
        },
        carb: {
            current: 50,
            max: 100
        }
    });

    // Doughnut chart data for calories
    const doughnutData = {
        labels: ["Current Calories", "Remaining"],
        datasets: [
            {
                label: "Calories",
                data: [macros.calories.current, macros.calories.max - macros.calories.current],
                backgroundColor: ["#10B981", "#E5E7EB"], // Green for current, light gray for remaining
                hoverOffset: 4,
            },
        ],
    };
    
    const doughnutOptions = {
        cutout: "70%",
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: false,
            },
        },
    };

    return (
        <section className="px-4 py-6">
            <div className="bg-slate-700 px-8 py-6 rounded-xl shadow-md w-full flex items-center justify-between">
                
                {/* Doughnut Chart with Centered Text */}
                <div className="relative">
                    <div className="w-32 h-32">
                        <Doughnut data={doughnutData} options={doughnutOptions} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-semibold text-white">
                                {macros.calories.current} kcal
                            </span>
                        </div>
                    </div>
                </div>

                {/* Percentage Bars for Macros */}
                <div className="w-full max-w-sm">
                    {[
                        { label: "Protein", color: "bg-green-500", current: macros.protein.current, max: macros.protein.max },
                        { label: "Fat", color: "bg-yellow-500", current: macros.fat.current, max: macros.fat.max },
                        { label: "Carbs", color: "bg-blue-400", current: macros.carb.current, max: macros.carb.max },
                    ].map((macro) => (
                        <div key={macro.label} className="mb-2">
                            <div className="flex justify-between mb-1">
                                <span className="text-white text-sm">{macro.label}</span>
                                <span className="text-gray-300 text-sm">
                                    {Math.round((macro.current / macro.max) * 100)}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-500 h-3 rounded-full overflow-hidden">
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
