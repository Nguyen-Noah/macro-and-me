// src/AppRoutes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/userHome/Home';
import FoodSearch from '../pages/FoodSearch';
import Login from '../pages/loginPage/Login';
import Landing from '../pages/landingPage/Landing';
import PrivateRoute from '../app/PrivateRoute';
export default function AppRoutes({ user }) {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/landing" />} />
            <Route path="/landing" element={<Landing />} />

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
        </Routes>
    );
}
