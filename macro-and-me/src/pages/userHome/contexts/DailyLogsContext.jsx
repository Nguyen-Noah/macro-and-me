import React, { createContext, useState, useContext } from "react";
import api from '../../../utils/api'

const DailyLogsContext = createContext();

export const DailyLogsProvider = ({ children }) => {
    const [logs, setLogs] = useState([]);
    const [macros, setMacros] = useState({
        calories: 0,
        fat: 0,
        protein: 0,
        carbohydrates: 0,
    });

    const fetchLogs = async (firebaseUid) => {
        try {
            const response = await api.get("/daily_logs", { firebaseUid });
            setLogs(response.data || []);
            calculateMacros(response.data || []);
        } catch (error) {
            console.error("Error fetching logs:", error);
        }
    };

    const calculateMacros = (logs) => {
        const total = logs.reduce(
            (acc, log) => {
                log.foods.forEach((food) => {
                    acc.calories += food.calories || 0;
                    acc.fat += food.fat || 0;
                    acc.protein += food.protein || 0;
                    acc.carbohydrates += food.carbohydrates || 0;
                });
                return acc;
            },
            { calories: 0, fat: 0, protein: 0, carbohydrates: 0 }
        );
        setMacros(total);
    };

    const updateLogsAndMacros = async (firebaseUid) => {
        await fetchLogs(firebaseUid);
    };

    return (
        <DailyLogsContext.Provider value={{ logs, macros, updateLogsAndMacros }}>
            {children}
        </DailyLogsContext.Provider>
    );
};

export const useDailyLogs = () => useContext(DailyLogsContext);
