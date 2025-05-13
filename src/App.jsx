 // src/App.jsx
  import React from 'react';
  import { Routes, Route, NavLink } from 'react-router-dom';
  import Dashboard from './components/Dashboard';
  import ManageBid from './components/ManageBid';
  import EmployeeBid from './components/EmployeeBid';
  
  export default function App() {
    return (
      <div className="flex h-screen">
        <nav className="w-64 bg-gray-100 p-4">
          <h2 className="text-xl font-bold mb-6">TeleStaff Clone</h2>
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `block p-2 rounded hover:bg-gray-200 ${isActive ? 'bg-gray-200' : ''}`
                }
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/manage"
                className={({ isActive }) =>
                  `block p-2 rounded hover:bg-gray-200 ${isActive ? 'bg-gray-200' : ''}`
                }
              >
                Manage Bid
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/employee"
                className={({ isActive }) =>
                  `block p-2 rounded hover:bg-gray-200 ${isActive ? 'bg-gray-200' : ''}`
                }
              >
                Employee View
              </NavLink>
            </li>
          </ul>
        </nav>
        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/manage" element={<ManageBid />} />
            <Route path="/employee" element={<EmployeeBid />} />
          </Routes>
        </main>
      </div>
    );
  }