import React, { useState, useContext, useEffect } from 'react';
import ReactStars from 'react-rating-stars-component';

import LoadingSpinner from '../UIElements/LoadingSpinner';
import useHttpRequest from '../../hooks/http-hook';
import AuthContext from '../../context/auth-context';
import ErrorModal from '../UIElements/Modal/ErrorModal';

import './StarRating.css';

function StarRating(props) {
  const auth = useContext(AuthContext);
  const { isLoggedIn } = auth;
  const { isLoading, error, sendRequest, clearError } = useHttpRequest();
  const [ratingAverage, setRatingAverage] = useState(props.averageRating);
  const [creatorRating, setCreatorRating] = useState(props.creatorRate);
  const [starsKey, setStarsKey] = useState(Math.random());
  const [raterNumb, setRaterNumb] = useState(props.raterRates.length);
  const [canEdit, setCanEdit] = useState(isLoggedIn);

  const rateHandler = (ratingValue) => {
    if (auth.token) {
      setCreatorRating(ratingValue);
      patchRates(ratingValue);
    }
  };

  //to re-render the star-rating component after logout
  useEffect(() => {
    setStarsKey(Math.random());
    setCanEdit(isLoggedIn);
  }, [isLoggedIn]);

  const patchRates = async (ratingValue) => {
    try {
      let response;
      //send request to update both, average and creator rate
      if (
        auth.userId === props.creatorId ||
        auth.userId === props.creatorId.id
      ) {
        response = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/rate/${props.placeId}`,
          'PATCH',
          JSON.stringify({
            raterId: auth.userId,
            raterRating: ratingValue,
            creatorRate: ratingValue,
          }),
          {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          }
        );
      } else {
        //send request to update only the average rate
        response = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/rate/${props.placeId}`,
          'PATCH',
          JSON.stringify({
            raterId: auth.userId,
            raterRating: ratingValue,
            creatorRate: props.creatorRate,
          }),
          {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          }
        );
      }
      setRatingAverage(response.rate.averageRating);
      setRaterNumb(response.rate.raterRates.length);
      setCreatorRating(response.rate.creatorRate);
    } catch (err) {}
    setStarsKey(Math.random()); //this will generate a random number, which will cause the ReactStars component to be re rendered
  };

  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} onClear={clearError} />
      <div className='StarRating'>
        <ReactStars
          edit={canEdit}
          key={starsKey}
          className='star'
          value={ratingAverage}
          count={5}
          onChange={rateHandler}
          size={20}
          isHalf={true}
          emptyIcon={<i className='far fa-star'></i>}
          halfIcon={<i className='fa fa-star-half-alt'></i>}
          fullIcon={<i className='fa fa-star'></i>}
          color1={'#e4e5e9'}
          color2={'#ffc107'}
        />
        <p className='ratings'>
          Community Rate{' '}
          {raterNumb > 1 ? `(${raterNumb} ratings)` : `(${raterNumb} rating)`}
        </p>
      </div>

      <div className='StarRating '>
        <ReactStars
          className='star'
          key={starsKey}
          value={creatorRating}
          count={5}
          char='♥'
          edit={false}
          size={30}
          isHalf={true}
          emptyIcon={<i className='far fa-heart' />}
          halfIcon={<i className='fa fa-heart-half-alt' />}
          fullIcon={<i className='fas fa-heart' />}
          activeColor='red'
          color1={'#e4e5e9'}
          color2={'#ffc107'}
        />
        <p className='ratings'>Creator Rate</p>
      </div>
    </>
  );
}

export default StarRating;
