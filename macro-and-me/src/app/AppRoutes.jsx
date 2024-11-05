// src/AppRoutes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/userHome/Home';
import Login from '../pages/loginPage/Login';
import About from '../pages/aboutPage/About';
import PrivateRoute from '../app/PrivateRoute';
import LogMeal from '../pages/userHome/components/LogMeal';
export default function AppRoutes({ user }) {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/about" />} />
            <Route path="/about" element={<About />} />

            <Route path="/login" element={user ? <Navigate to="/home" /> : <Login />} />

            {/* PrivateRoutes for logged in user*/}
            <Route
                path="/home"
                element={<PrivateRoute user={user}><Home /></PrivateRoute>}
            />
            <Route
                path="/search"
                element={<PrivateRoute user={user}><FoodSearch /></PrivateRoute>}
            />
            <Route
                path="/imageUpload"
                element={<PrivateRoute user={user}><ImageUpload /></PrivateRoute>}
            />
            <Route
                path="/logMeal"
                element={<PrivateRoute user={user}><LogMeal /></PrivateRoute>}
            />
        </Routes>
    );
}
