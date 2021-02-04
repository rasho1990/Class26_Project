import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import './BucketList.css';
import AuthContext from './../../shared/context/auth-context';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import BucketListItem from './BucketListItem';
import useHttpClient from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/Modal/ErrorModal';

const BucketList = () => {
  const [places, setPlaces] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { token } = useContext(AuthContext);

  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/bucketlist/${userId}`,
          'GET',
          null,
          {
            Authorization: 'Bearer ' + token,
          }
        );
        setPlaces(responseData.bucketListUser);
      } catch (err) {
        console.log('Could not get all user places!', err);
      }
    };
    fetchPlaces();
  }, [sendRequest, userId, token]);
console.log(places)
  const deleteBucketItem = (deletedPlaceId) => {
    setPlaces((prevPlace) =>
      prevPlace.filter((place) => place.id.id !== deletedPlaceId)
    );
  };

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner asOverlay />}
      {error && <ErrorModal error={error} onClear={clearError} />}
      {(!places || places.length === 0) && !isLoading && (
        <div className='place-list center'>
          <Card>
            <h2>
              Your bucket list is empty. Would you like to add places to your
              bucket list?
            </h2>
            <Button to='/'>Go Home Page</Button>
          </Card>
        </div>
      )}

      <ul className='bucket-list'>
        {!isLoading &&
          places &&
          places.map((place) => (
            <BucketListItem
              key={place.id.id}
              placeId={place.id}
              image={place.id.image}
              title={place.id.title}
              description={place.id.description}
              address={place.id.address}
              deleteOnClick={deleteBucketItem}
              creator={place.createdUser}
            />
          ))}
      </ul>
    </React.Fragment>
  );
};

export default BucketList;
