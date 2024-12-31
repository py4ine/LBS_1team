import React from "react";
import logo from "../assets/images/logo/intro_logo.png";
import Header from "../components/Layout/Header";

function Main() {
  return (
    <>
      <Header />
      <div className="main_container">
        <h1>
          <img src={logo} />
        </h1>
      </div>
    </>
  );
}

export default Main;
