
import { useState } from "react";

export default function Home() {
    const [macros, setMacros] = useState({
        protein: 50,  // grams
        fat: 20,      // grams
        carbs: 100,   // grams
        calories: 340 // kcal
    });

    return (
        <div className="flex flex-col items-center min-h-screen p-8 font-sans bg-gray-100">
            {/* Header */}
            <header className="flex justify-between items-center w-full max-w-md">
                <button className="text-xl">{'<'}</button>
                <h1 className="text-xl font-semibold">Today</h1>
            </header>

            {/* Progress Bar and Macros */}
            <main className="flex flex-col items-center w-full max-w-md mt-8">
                <div className="bg-slate-400 p-4 rounded-xl shadow-md w-full">
                    {/* Circular Progress Bar */}
                    <div className="flex justify-between items-center">
                        <div className="relative">
                            {/* Circle for calories */}
                            <div className="w-24 h-24 rounded-full border-8 border-gray-200 flex items-center justify-center">
                                <span className="text-xl">{macros.calories} kcal</span>
                            </div>
                        </div>

                        {/* Macro Bars */}
                        <div className="flex flex-col gap-2 w-2/3">
                            <div className="flex items-center justify-between">
                                <span>Protein</span>
                                <div className="w-2/3 bg-gray-200 h-3 rounded-full overflow-hidden">
                                    <div className="bg-red h-full" style={{ width: `${macros.protein}%` }} />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Fat</span>
                                <div className="w-2/3 bg-gray-200 h-3 rounded-full overflow-hidden">
                                    <div className="bg-red h-full" style={{ width: `${macros.fat}%` }} />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Carbs</span>
                                <div className="w-2/3 bg-gray-200 h-3 rounded-full overflow-hidden">
                                    <div className="bg-blue h-full" style={{ width: `${macros.carbs}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Meal Sections */}
                <div className="w-full max-w-md mt-8 space-y-4">
                    {['Water', 'Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((meal, index) => (
                        <div key={index} className="bg-neutral-800 p-4 rounded-lg h-16 flex items-center">
                            {meal}
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer Navigation */}
            <footer className="flex justify-around items-center w-full max-w-md mt-8 p-4 bg-neutral-200 shadow-md rounded-xl text-black">
                <button>
                    HOME
                </button>
                <button className="bg-black p-4 rounded-full text-white">
                    ADD
                </button>
                <button>
                    PROFILE
                </button>
            </footer>
        </div>
    );
}