import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import PlaceItem from './PlaceItem';
import Button from './../../shared/components/FormElements/Button';

import './PlaceList.css';

const PlaceList = ({ items, onDeletePlace }) => {
  if (!items || items.length === 0) {
    return (
      <div className='place-list center'>
        <Card>
          <h2>No places found. Maybe create one?</h2>
          <Button to='/places/new'>Share New Place</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className='place-list'>
      {items.map((place) => (
        <PlaceItem
          key={place.id}
          placeId={place.id}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator.id}
          coordinates={place.location}
          onDeletePlace={onDeletePlace}
          creatorName={place.creator}
          isAddedToBucketList={place.isAddedToBucketList || false}
          rate={place.rate}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
