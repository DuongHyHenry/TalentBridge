import React, { useContext } from "react";
import AuthContext from './AuthContext';
import Header from "./Header";
import "./style.css";

function SmartLab() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Header />
      <div className="main-body">
        Smart Lab
      </div>
      <footer>@2024 SmartLab. All Rights Reserved.</footer>

    </>
  );
}

export default SmartLab;
