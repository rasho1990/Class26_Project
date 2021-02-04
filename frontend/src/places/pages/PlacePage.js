import React, { useEffect, useState } from 'react';

import './placePage.css';

import { useParams } from 'react-router-dom';
import ErrorModal from '../../shared/components/UIElements/Modal/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import PlaceItem from '../components/PlaceItem';
import useHttpRequest from '../../shared/hooks/http-hook';

const PlacePage = () => {
  const [place, setPlace] = useState({});
  const { placeId } = useParams();
  const { isLoading, error, clearError, sendRequest } = useHttpRequest();

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
        );
        setPlace(responseData);
      } catch (err) {}
    };
    fetchPlace();
  }, [sendRequest]);

  return (
    <div className='place-page'>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && Object.keys(place).length > 0 && (
        <PlaceItem
          key={place.id}
          placeId={place.id}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator.id}
          coordinates={place.location}
          creatorName={place.creator}
          isAddedToBucketList={place.isAddedToBucketList || false}
          rate={place.rate}
        />
      )}
    </div>
  );
};

export default PlacePage;
