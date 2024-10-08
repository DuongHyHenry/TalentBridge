import React, { useContext } from "react";
import AuthContext from "./AuthContext";
import Header from "./Header";
import "./style.css";

function Logout() {
  const handleLogout = () => {
    window.location.href = "http://localhost:5000/googleLogout";
  };

  const { user } = useContext(AuthContext);
  return (
    <>
      <Header />
      <div className="main-body">
        <button onClick={handleLogout}>Logout</button>
      </div>
      <footer>@2024 SmartLab. All Rights Reserved.</footer>
    </>
  );
}

export default Logout;
