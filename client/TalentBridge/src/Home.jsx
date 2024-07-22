import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Timeline } from "antd";
import AuthContext from './AuthContext';
import { Tooltip } from 'antd';
import { Table } from "antd";
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
        <Timeline
          items={[
            {
              children: 'Create a services site 2015-09-01',
            },
            {
              children: 'Solve initial network problems 2015-09-01',
            },
            {
              children: 'Technical testing 2015-09-01',
            },
            {
              children: 'Network problems being solved 2015-09-01',
            },
          ]}
        />
        <Tooltip title="prompt text">
          <span>Tooltip will show on mouse enter.</span>
        </Tooltip>
      </main>
      <footer>
        @2024 SmartLab. All Rights Reserved.
      </footer>
    </>
  );
};

export default Home;