import React from 'react';
import { Link } from 'react-router-dom';
import './ProfileItem.css';

import Avatar from './../../shared/components/UIElements/Avatar';
import Card from './../../shared/components/UIElements/Card';

const ProfilePlaceItem = ({ id, image, title, address }) => {
  return (
    <li className='user-item'>
      <Card className='user-item__content'>
        <Link to={`/places/${id}/details`}>
          <div className='user-item__image'>
            <Avatar image={image} alt={title} />
          </div>
          <div className='user-item__info'>
            <h2>{title}</h2>
            <h4>{address}</h4>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default ProfilePlaceItem;
