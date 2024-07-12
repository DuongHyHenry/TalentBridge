import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from './AuthContext';
import Orca from './assets/orca.jpg';
import Logo from './assets/logo2.png';
import "./style.css";

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <header>
        <div className="header">
          <img src={Logo} alt="Logo" />
          <ul className="headerLinks">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              {user ? (
                <span>Welcome, {user.username}</span>
              ) : (
                <Link to="/Login">Login/Register</Link>
              )}
            </li>
            <li>
              {user ? (
                <Link to="/Logout">Logout</Link>
              ) : null}
            </li>
          </ul>
        </div>
      </header>
      <main>
        <img src={Orca} alt="My Photo" />
      </main>
      <footer>
        @2024 SmartLab. All Rights Reserved.
      </footer>
    </>
  );
};

export default Home;
