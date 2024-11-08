import React from 'react';
import Header from './header/Header';
import Footer from './footer/Footer';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <div className="d-flex flex-grow-1">
                <Sidebar/>
                <main className="flex-grow-1 p-4">
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default Layout;
