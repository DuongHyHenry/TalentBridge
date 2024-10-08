import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Logo from "./assets/logo.png";
import AuthContext from "./AuthContext";
import "./style.css";

function Header() {
  const { user } = useContext(AuthContext);
  console.log("Header component rendered");
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
              <a href="https://smartlab.co.tz/about-us" target="_blank" rel="noopener noreferrer">About Us</a>
            </li>
            <li>
              {user ? (
                <span>
                  Welcome, <Link to="/Profile">{user.username}</Link>
                </span>
              ) : (
                <Link to="/Login">Login/Register</Link>
              )}
            </li>
            <li>{user ? <Link to="/Logout">Logout</Link> : null}</li>
          </ul>
        </div>
      </header>
    </>
  );
  
}

export default Header;
