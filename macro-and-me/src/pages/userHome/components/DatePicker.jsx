import React from "react";

const DatePicker = ({ selectedDate, onDateChange }) => {
    return (
        <div className="mb-4 px-6 pt-4">
            <label htmlFor="date" className="block text-sm font-medium">
                Select Date:
            </label>
            <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="mt-1 block w-full p-2 bg-neutral-800 rounded text-white"
            />
        </div>
    );
};

export default DatePicker;
