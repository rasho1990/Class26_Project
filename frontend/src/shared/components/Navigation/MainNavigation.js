import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";

import AuthContext from "./../../context/auth-context";

import "./MainNavigation.css";
import logo from "../../../images/Logo.png";
import MainHeader from "./MainHeader";
import SideDrawer from "./SideDrawer";
import BackDrop from "./../UIElements/Backdrop";
import NavLinks from "./NavLinks";
import NotificationNavBar from "./NotificationNavBar";
import "./NavLinks.css";

const MainNavigation = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const openDrawer = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawer = () => {
    setDrawerIsOpen(false);
  };

  return (
    <>
      {drawerIsOpen && <BackDrop clickHandler={closeDrawer} />}
      <SideDrawer show={drawerIsOpen} clickHandler={closeDrawer}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>
      <MainHeader>
        <button className="main-navigation__menu-btn" onClick={openDrawer}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h1 className="main-navigation__title">
          <img className="main-navigation__logo" src={logo} alt="Logo" />
          <Link to="/">Hack Your Places</Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
        {isLoggedIn && <NotificationNavBar />}
      </MainHeader>
    </>
  );
};

export default MainNavigation;
