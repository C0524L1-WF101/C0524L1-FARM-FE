import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Layout from './component/Layout';
import NewsManagement from './component/NewsManagement';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/home"
                    element={
                        <Home />
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <Layout>
                            <Profile />
                        </Layout>
                    }
                />
                <Route
                    path="/news"
                    element={
                        <Layout>
                            <NewsManagement />
                        </Layout>
                    }
                />
                <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
        </Router>
    );
};

export default App;
