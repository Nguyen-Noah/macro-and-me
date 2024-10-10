"use client";

import { useState } from "react";

const MacroDataSection = () => {

    const [macros, setMacros] = useState({
        protein: 50,
        fat: 20,
        carbs: 50,
        calories: 100
    });

    return (
        <div className="bg-slate-700 p-4 rounded-xl shadow-md w-full">
            {/* Circular Progress Bar */}
            <div className="flex justify-between items-center">
                <div className="relative">

                    {/* Circle for calories */}
                    <div className="w-24 h-24 rounded-full border-8 border-gray-200 flex items-center justify-center">
                        <span className="text-md">{macros.calories} kcal</span>
                    </div>

                </div>

                {/* Macro Bars */}
                <div className="flex flex-col gap-2 w-2/3">

                    <div className="flex items-center justify-between">
                        <span>Protein</span>
                        <div className="w-2/3 bg-gray-500 h-3 rounded-full overflow-hidden">
                            <div className="bg-green-500 h-full" style={{ width: `${macros.protein}%` }} />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <span>Fat</span>
                        <div className="w-2/3 bg-gray-500 h-3 rounded-full overflow-hidden">
                            <div className="bg-yellow-500 h-full" style={{ width: `${macros.fat}%` }} />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <span>Carbs</span>
                        <div className="w-2/3 bg-gray-500 h-3 rounded-full overflow-hidden">
                            <div className="bg-blue-400 h-full" style={{ width: `${macros.carbs}%` }} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MacroDataSection;