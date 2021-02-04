import React from 'react';
import { Link } from 'react-router-dom';
import './ProfileItem.css';

import Avatar from '../../shared/components/UIElements/Avatar';
import Card from '../../shared/components/UIElements/Card';

const ProfilePlaceItem = ({ id, image, name, email }) => {
  return (
    <li className='user-item'>
      <Card className='user-item__content'>
        <Link to={`/account/${id}`}>
          <div className='user-item__image'>
            <Avatar image={image} alt={name} />
          </div>
          <div className='user-item__info'>
            <h2>{name}</h2>
            <h4>{email}</h4>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default ProfilePlaceItem;
