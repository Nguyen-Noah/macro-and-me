import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; 
import Home from '../pages/Home.jsx';
import FoodSearch from '../pages/FoodSearch.jsx';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/search" element={<FoodSearch />} />
        </Routes>
    );
}
