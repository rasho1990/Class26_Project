import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './UserItem.css';
import AuthContext from '../../shared/context/auth-context';
import Avatar from './../../shared/components/UIElements/Avatar';
import Card from './../../shared/components/UIElements/Card';
import AddFriend from '../../friends/components/AddFriend';
import DeleteFriend from '../../friends/components/DeleteFriend';
import Button from '../../shared/components/FormElements/Button';
const UserItem = ({ user }) => {
  const auth = useContext(AuthContext);

  const [isFriend, setIsFriend] = useState(false);
  const currentPath = window.location.pathname;

  const { id, image, name, places, friends } = user;

  useEffect(() => {
    if (currentPath === '/' && friends.find((u) => u.id === auth.userId)) {
      setIsFriend(true);
    }
  }, [setIsFriend]);

  return (
    <li className='user-item'>
      <Card className='user-item__content'>
        <Link to={`/${id}/places`}>
          <div className='user-item__image'>
            <Avatar image={image} alt={name} />
          </div>
          <div className='user-item__info'>
            <h2>
              {name}:{isFriend}
            </h2>
            <h3>
              {places.length} {places.length === 1 ? 'Place' : 'Places'}
            </h3>
          </div>
        </Link>
        {auth.isLoggedIn && (
          <>
            {currentPath === '/' && !isFriend ? (
              <AddFriend
                receivedRequestId={user.id}
                userId={auth.userId}
                token={auth.token}
              />
            ) : (
              currentPath === '/' && (
                <Link to={`account/${id}`}>
                  {' '}
                  <Button friend>{name} Profile</Button>
                </Link>
              )
            )}
            {currentPath === `/${auth.userId}/friends` && (
              <DeleteFriend receivedRequestId={user.id} userId={auth.userId} />
            )}
          </>
        )}
      </Card>
    </li>
  );
};

export default UserItem;
