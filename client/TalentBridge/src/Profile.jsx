import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from './AuthContext';
import Header from "./Header";
import "./style.css";

function Profile() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Header />
    </>
  );
}

export default Profile;
