import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1 d-flex flex-column">
                <Header />
                <main className="flex-grow-1 p-4">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default Layout;
