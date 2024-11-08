import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
import { FaUserCog, FaBell, FaPiggyBank, FaHome, FaTh} from 'react-icons/fa';

const Sidebar = () => {
  const [openSystem, setOpenSystem] = useState(false);
  const [openHerd, setOpenHerd] = useState(false);

  return (
    <div className="sidebar p-3 shadow-sm" style={{ width: '300px', backgroundColor: '#f8f9fa' }}>
      <ul className="list-unstyled">
        {/* Quản lý hệ thống */}
        <li className="mb-3">
          <button
            className="btn btn-link text-start w-100 d-flex align-items-center justify-content-between text-decoration-none"
            style={{ color: '#5a5a5a', fontSize: '16px' }}
            onClick={() => setOpenSystem(!openSystem)}
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
                  to="/staff"
                  className={({ isActive }) =>
                    isActive ? 'active-link' : 'inactive-link'
                  }
                  style={{ textDecoration: 'none' }}
                >
                  <FaUserCog className="me-2" /> Quản lý nhân viên
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/news"
                  className={({ isActive }) =>
                    isActive ? 'active-link' : 'inactive-link'
                  }
                  style={{ textDecoration: 'none' }}
                >
                  <FaBell className="me-2" /> Đăng thông báo
                </NavLink>
              </li>
            </ul>
          </Collapse>
        </li>

        {/* Quản lý đàn */}
        <li>
          <button
            className="btn btn-link text-start w-100 d-flex align-items-center justify-content-between text-decoration-none"
            style={{ color: '#5a5a5a', fontSize: '16px' }}
            onClick={() => setOpenHerd(!openHerd)}
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

      {/* Styles for active and inactive links */}
      <style jsx>{`
        .text-orange {
          color: #ff8c00;
        }

        .active-link {
          color: #ff8c00;
          font-weight: bold;
          background-color: #ffe5cc;
          padding: 8px 12px;
          border-radius: 5px;
          display: block;
        }

        .inactive-link {
          color: #5a5a5a;
          padding: 8px 12px;
          display: block;
        }

        .active-link:hover, .inactive-link:hover {
          background-color: #fff5e6;
          color: #ff8c00;
          transition: background-color 0.2s;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
