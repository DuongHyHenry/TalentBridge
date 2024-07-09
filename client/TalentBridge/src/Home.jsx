// src/Home.jsx
import React from 'react';
import { Link, Route, Routes } from 'react-router-dom'; // Import Route and Routes
import Orca from './assets/orca.jpg';
import Logo from './assets/logo2.png'
import Login from './Login'; // Import Login component
import "./style.css";

function Home() {
  return (
    <>
      <header>
        <div className="header">
        <img src={Logo} alt="Logo" />
          <ul className="headerLinks">
            <li>
              <Link to="/">Home</Link> {/* Use Link for internal navigation */}
            </li>
            <li>
              <a href="http://localhost:5000/auth/google">Login/Register</a>            
            </li>
          </ul>
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
        <img src={Orca} alt="My Photo" />
      </main>
      <footer>
        @2024 SmartLab. All Rights Reserved.
      </footer>
    </>
  );
}

export default Home;
