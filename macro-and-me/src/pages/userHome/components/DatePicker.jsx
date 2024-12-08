import React, { useState } from "react";
import { ICON_L_ARROW, ICON_R_ARROW } from "../../../utils/svg";

const DatePicker = ({ selectedDate, onDateChange }) => {

    // Initialize currentDate by adding 1 day to the selectedDate
    const [currentDate, setCurrentDate] = useState(() => {
        const date = new Date(selectedDate);
        date.setHours(date.getHours() + 5);
        return date;
    });

    const formatDate = (date) => {
        const options = { year: "numeric", month: "short", day: "numeric" };
        return date.toLocaleDateString("en-US", options);
    };

    const handlePrev = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() - 1); 
        setCurrentDate(newDate);
        onDateChange(newDate.toISOString().split("T")[0]); // Update parent component with new date
    };

    const handleNext = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + 1); 
        setCurrentDate(newDate);
        onDateChange(newDate.toISOString().split("T")[0]); // Update parent component with new date
    };


    return (
        <div className="px-6 pt-3">
            <div className="flex items-center justify-center px-6 pt-3 bg-slate-700 rounded-t-xl">
                <button
                    onClick={handlePrev}
                    className="text-white text-xl px-2 py-1"
                >
                    {ICON_L_ARROW}
                </button>
                <span className="mx-4 text-white font-bold text-lg">{formatDate(currentDate)}</span>
                <button
                    onClick={handleNext}
                    className="text-white text-xl px-2 py-1"
                >
                    {ICON_R_ARROW}
                </button>
            </div>
        </div>
    );
};

export default DatePicker;
