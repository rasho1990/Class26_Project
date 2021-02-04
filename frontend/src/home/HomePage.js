import React, { Fragment } from "react";
import { Link } from 'react-router-dom';

import "./HomePage.css";

import logo from "../images/Logo.png";

import MainHeader from "../shared/components/Navigation/MainHeader";
import Banner from "./components/Banner";
import Features from "./components/Features";
import Gallery from "./components/Gallery";
import AuthPage from "../users/pages/AuthPage";


const HomePage = () => {
  return (
    <Fragment>
      <MainHeader>
        <h1 className="main-navigation__title">
        <img className="main-navigation__logo" src={logo} alt="Logo" />
          <Link to="/">Hack Your Places</Link>
        </h1>
      </MainHeader>
      <Banner />
      <div className="home-auth-card ">
      <AuthPage/>
      </div>
      <Features />
      <Gallery/>
    </Fragment>
  );
};

export default HomePage;
