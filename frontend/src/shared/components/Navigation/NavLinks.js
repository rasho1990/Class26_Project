import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from './../../context/auth-context';
import { AiFillHome } from 'react-icons/ai';
import { BiLocationPlus } from 'react-icons/bi';
import { GiFullWoodBucketHandle } from 'react-icons/gi';
import { BsFillPeopleFill, BsNewspaper } from 'react-icons/bs';
import {
  FaUserCog,
  FaMapMarkedAlt,
  FaStreetView,
  FaSignInAlt,
  FaSignOutAlt,
} from 'react-icons/fa';
import { Tooltip, Zoom, withStyles } from '@material-ui/core';
import './NavLinks.css';

const NavLinks = () => {
  const { isLoggedIn, logout, userId } = useContext(AuthContext);

  const LightTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: 16,
    },
  }))(Tooltip);

  return (
    <ul className='nav-links'>
      {isLoggedIn && (
        <li>
          <LightTooltip TransitionComponent={Zoom} title='News Feed'>
            <NavLink to={`/${userId}/newsfeed`}>
              <BsNewspaper size={27} />
            </NavLink>
          </LightTooltip>
        </li>
      )}
      <li>
        <LightTooltip TransitionComponent={Zoom} title='All Users'>
          <NavLink to='/' exact>
            <AiFillHome size={27} />
          </NavLink>
        </LightTooltip>
      </li>
      <li>
        <LightTooltip TransitionComponent={Zoom} title='All Places'>
          <NavLink to='/place/all' exact>
            <FaStreetView size={27} />
          </NavLink>
        </LightTooltip>
      </li>
      {isLoggedIn && (
        <li>
          <LightTooltip TransitionComponent={Zoom} title='My Places'>
            <NavLink to={`/${userId}/places`}>
              <FaMapMarkedAlt size={27} />
            </NavLink>
          </LightTooltip>
        </li>
      )}
      {isLoggedIn && (
        <li>
          <LightTooltip TransitionComponent={Zoom} title='Friends'>
            <NavLink to={`/${userId}/friends`}>
              <BsFillPeopleFill size={27} />
            </NavLink>
          </LightTooltip>
        </li>
      )}
      {isLoggedIn && (
        <li>
          <LightTooltip TransitionComponent={Zoom} title='Add Place'>
            <NavLink to='/places/new'>
              <BiLocationPlus size={27} />
            </NavLink>
          </LightTooltip>
        </li>
      )}
      {isLoggedIn && (
        <li>
          <LightTooltip TransitionComponent={Zoom} title='Bucket List'>
            <NavLink to={`/${userId}/bucketlist`}>
              <GiFullWoodBucketHandle size={27} />
            </NavLink>
          </LightTooltip>
        </li>
      )}
      {isLoggedIn && (
        <li>
          <LightTooltip TransitionComponent={Zoom} title='My Account'>
            <NavLink to={`/account/${userId}`}>
              <FaUserCog size={27} />
            </NavLink>
          </LightTooltip>
        </li>
      )}
      {!isLoggedIn && (
        <li>
          <LightTooltip TransitionComponent={Zoom} title='Sign In'>
            <NavLink to='/auth'>
              <FaSignInAlt size={27} />
            </NavLink>
          </LightTooltip>
        </li>
      )}

      {isLoggedIn && (
        <li>
          <LightTooltip TransitionComponent={Zoom} title='Sign Out'>
            <button onClick={logout}>
              <FaSignOutAlt size={27} />
            </button>
          </LightTooltip>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
