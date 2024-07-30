import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "./AuthContext";
import { Space, Tag, Card } from "antd";
import Google from "./assets/google.png";
import Facebook from "./assets/facebook.png";
import Header from "./Header";
import "./style.css";

function Login() {
  const handleGoogleAuth = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };
  const handleFacebookAuth = () => {
    window.location.href = "http://localhost:5000/auth/facebook";
  };

  const { user } = useContext(AuthContext);

  return (
    <>
      <Header />
      <div className="main-body">
        <div className="login-container">
          <Link to={"http://localhost:5000/auth/google"} className="card-link">
            <Card className="login-card">
              <img src={Google} alt="User" className="card-image" />
            </Card>
          </Link>
          <h2>OR</h2>
          <Link
            to={"http://localhost:5000/auth/facebook"}
            className="card-link"
          >
            <Card className="login-card">
              <img src={Facebook} alt="User" className="card-image" />
            </Card>
          </Link>
        </div>
      </div>
      <footer>@2024 SmartLab. All Rights Reserved.</footer>
    </>
  );
}

export default Login;
