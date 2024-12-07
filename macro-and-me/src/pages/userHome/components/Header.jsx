import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";


ChartJS.register(ArcElement, Tooltip, Legend);

const MacroDataSection = () => {
    const macros = {
        calories: {
            label: 'Kcal',
            current: 400,
            max: 1700
        },
        protein: {
            label: 'Proteins',
            current: 40,
            max: 170,
            scale: 'g'
        },
        fat: {
            label: 'Fats',
            current: 20,
            max: 50,
            scale: 'g'
        },
        carb: {
            label: 'Carbs',
            current: 50,
            max: 100,
            scale: 'g'
        },
        water: {
            label: "Water",
            current: 20,
            max: 100,
            scale: ' fl oz'
        }
    };


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
        cutout: "75%",
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
        <section className="px-6 py-4">
            <div className="bg-slate-700 px-3 py-6 rounded-xl shadow-md w-full flex items-center justify-between">

                {/* Doughnut Chart with Centered Text */}
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

                {/* Percentage Bars for Macros */}
                <div className="w-full max-w-sm pl-4 pr-2">
                    {[
                        { label: "Protein", color: "bg-green-500", current: macros.protein.current, max: macros.protein.max, scale: macros.protein.scale },
                        { label: "Fat", color: "bg-yellow-500", current: macros.fat.current, max: macros.fat.max, scale: macros.fat.scale },
                        { label: "Carbs", color: "bg-blue-500", current: macros.carb.current, max: macros.carb.max, scale: macros.carb.scale },
                        { label: "Water", color: "bg-blue-300", current: macros.water.current, max: macros.water.max, scale: macros.water.scale }
                    ].map((macro) => (
                        <div key={macro.label} className="mb-1">
                            <div className="flex justify-between mb-1">
                                <span className="text-white text-sm">{macro.label}</span>
                                <span className="text-gray-300 text-sm">
                                    {macro.current}{macro.scale} / {macro.max}{macro.scale}
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
