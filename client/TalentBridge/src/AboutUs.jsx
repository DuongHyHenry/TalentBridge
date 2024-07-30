import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "./AuthContext";
import Header from "./Header";
import "./style.css";

function AboutUs() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Header />
      <div className="main-body">SmartLab</div>
      <footer>@2024 SmartLab. All Rights Reserved.</footer>
    </>
  );
}

export default AboutUs;
