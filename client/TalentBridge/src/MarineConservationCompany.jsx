import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from './AuthContext';
import Header from "./Header";
import "./style.css";

function MarineConservationCompany() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Header />
      <footer>@2024 SmartLab. All Rights Reserved.</footer>

    </>
  );
}

export default MarineConservationCompany;
