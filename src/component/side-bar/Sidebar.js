import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
import { FaUserCog, FaBell, FaPiggyBank, FaHome, FaTh } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const [openSystem, setOpenSystem] = useState(() => {
    return JSON.parse(localStorage.getItem('openSystem')) || false;
  });
  const [openHerd, setOpenHerd] = useState(() => {
    return JSON.parse(localStorage.getItem('openHerd')) || false;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const username = localStorage.getItem('username');
    const userRole = localStorage.getItem('role'); 
    setRole(userRole);
    setIsLoggedIn(!!username); 
  }, []);

  const handleToggleSystem = () => {
    setOpenSystem((prev) => {
      const newState = !prev;
      localStorage.setItem('openSystem', JSON.stringify(newState));
      return newState;
    });
  };

  const handleToggleHerd = () => {
    setOpenHerd((prev) => {
      const newState = !prev;
      localStorage.setItem('openHerd', JSON.stringify(newState));
      return newState;
    });
  };

  if (!isLoggedIn) {
    return null; 
  }

  return (
    <div className="sidebar p-3 shadow" style={{ width: '300px', backgroundColor: '#f8f9fa' }}>
      <ul className="list-unstyled">
        <li className="mb-3">
          <button
            className="btn btn-link text-start w-100 d-flex align-items-center justify-content-between text-decoration-none"
            style={{ color: '#5a5a5a', fontSize: '16px' }}
            onClick={handleToggleSystem}
            aria-controls="system-management"
            aria-expanded={openSystem}
          >
            <span><FaHome className="me-2 text-orange" /> Quản lý hệ thống</span>
            <span className="text-orange fs-4 fw-bold">{openSystem ? '-' : '+'}</span>
          </button>
          <Collapse in={openSystem}>
            <ul id="system-management" className="list-unstyled ps-3 mt-2">
              <li className="mb-2">
                <NavLink
                  to="/news"
                  className={({ isActive }) =>
                    isActive ? 'active-link' : 'inactive-link'
                  }
                  style={{ textDecoration: 'none' }}
                >
                  <FaBell className="me-2" /> Quản lý thông báo
                </NavLink>
              </li>
              {role === 'admin' && (
                <li>
                  <NavLink
                    to="/staff"
                    className={({ isActive }) =>
                      isActive ? 'active-link' : 'inactive-link'
                    }
                    style={{ textDecoration: 'none' }}
                  >
                    <FaUserCog className="me-2" /> Quản lý nhân viên
                  </NavLink>
                </li>
              )}
            </ul>
          </Collapse>
        </li>

        <li>
          <button
            className="btn btn-link text-start w-100 d-flex align-items-center justify-content-between text-decoration-none"
            style={{ color: '#5a5a5a', fontSize: '16px' }}
            onClick={handleToggleHerd}
            aria-controls="herd-management"
            aria-expanded={openHerd}
          >
            <span><FaPiggyBank className="me-2 text-orange" /> Quản lý đàn</span>
            <span className="text-orange fs-4 fw-bold">{openHerd ? '-' : '+'}</span>
          </button>
          <Collapse in={openHerd}>
            <ul id="herd-management" className="list-unstyled ps-3 mt-2">
              <li className="mb-2">
                <NavLink
                  to="/individual"
                  className={({ isActive }) =>
                    isActive ? 'active-link' : 'inactive-link'
                  }
                  style={{ textDecoration: 'none' }}
                >
                  <FaTh className="me-2" /> Quản lý cá thể
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/barn"
                  className={({ isActive }) =>
                    isActive ? 'active-link' : 'inactive-link'
                  }
                  style={{ textDecoration: 'none' }}
                >
                  <FaHome className="me-2" /> Quản lý chuồng nuôi
                </NavLink>
              </li>
            </ul>
          </Collapse>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
