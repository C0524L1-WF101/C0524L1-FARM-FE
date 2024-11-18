import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login/Login';
import Home from './pages/home/Home';
import Profile from './pages/profile/Profile';
import Layout from './component/Layout';
import News from './pages/News';
import Barn from './pages/barn/Barn';
import Staff from './pages/Staff';
import Individual from './pages/Individual';
import NewsDetail from './pages/home/NewsDetail';
import NewsHome from './pages/noti-home/NewsHome'

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/news"
                    element={
                        <Layout>
                            <News />
                        </Layout>
                    }
                />
                <Route
                    path="/profile/:userId"
                    element={
                        <Layout>
                            <Profile />
                        </Layout>
                    }
                />
                <Route
                    path="//news/:id"
                    element={
                        <Layout>
                            <NewsDetail />
                        </Layout>
                    }
                />
                <Route
                    path="/news"
                    element={
                        <Layout>
                            <News />
                        </Layout>
                    }
                />
                <Route
                    path="/barn"
                    element={
                        <Layout>
                            <Barn />
                        </Layout>
                    }
                />
                <Route
                    path="/staff"
                    element={
                        <Layout>
                            <Staff />
                        </Layout>
                    }
                />
                 <Route
                    path="/newshome"
                    element={
                        <Layout>
                            <NewsHome />
                        </Layout>
                    }
                />
                <Route
                    path="/individual"
                    element={
                        
                        <Layout>
                            <Individual />
                        </Layout>
                    }
                />
                <Route
                    path="/home"
                    element={
                        <Layout>
                            <Home />
                        </Layout>
                    }
                />
                <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
        </Router>
    );
};

export default App;
