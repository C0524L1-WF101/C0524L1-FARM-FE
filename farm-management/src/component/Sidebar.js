import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="bg-light p-3 vh-100">
            <ul className="nav flex-column">
                <li className="nav-item">
                    <Link to="/page1" className="nav-link">Page 1</Link>
                </li>
                <li className="nav-item">
                    <Link to="/page2" className="nav-link">Page 2</Link>
                </li>
                <li className="nav-item">
                    <Link to="/page3" className="nav-link">Page 3</Link>
                </li>
                {/* Thêm các link khác vào đây */}
            </ul>
        </div>
    );
};

export default Sidebar;
