import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const username = localStorage.getItem('username');

    if (!username) {
        return <Navigate to="/home" />;
    }

    return children;
};

export default ProtectedRoute;
