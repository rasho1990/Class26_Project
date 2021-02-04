import React, { useState, useEffect, useContext, Fragment } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import AuthContext from './../../shared/context/auth-context';

import Card from './../../shared/components/UIElements/Card';
import LoadingSpinner from './../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from './../../shared/components/UIElements/Modal/ErrorModal';
import PlaceForm from './../components/PlaceForm';

import useForm from './../../shared/hooks/form-hook';
import useHttpRequest from '../../shared/hooks/http-hook';

const EditPlace = () => {
  const { userId, token } = useContext(AuthContext);
  const { placeId } = useParams();
  const { push } = useHistory();

  const { isLoading, error, clearError, sendRequest } = useHttpRequest();
  const [loadedPlace, setLoadedPlace] = useState({});

  const initInputs = {
    title: {
      value: '',
      isValid: true,
    },
    description: {
      value: '',
      isValid: true,
    },
  };
  const [formState, inputHandler, setFormData] = useForm(initInputs, false);

  useEffect(() => {
    const getPlace = async () => {
      const url = `/api/places/${placeId}`;

      const request = {
        url,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const identifiedPlace = await sendRequest(
          request.url,
          request.method,
          null,
          request.headers
        );

        setLoadedPlace(identifiedPlace);
        setFormData(
          {
            title: {
              value: identifiedPlace.title,
              isValid: true,
            },
            description: {
              value: identifiedPlace.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {
        console.log('Could fetch place!', err);
      }
    };
    getPlace();
  }, [sendRequest, placeId, setFormData, token]);

  const editPlaceSubmitHandler = async (e) => {
    e.preventDefault();

    const {
      inputs: { title, description },
    } = formState;

    const url = `/api/places/${placeId}`;

    const body = {
      title: title.value,
      description: description.value,
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const request = {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers,
    };

    try {
      await sendRequest(
        url,
        request.method,
        request.body,
        request.headers
      );

      push(`/${userId}/places`);
    } catch (err) {
      console.log('Could not edit place!', err);
    }
  };

  if (isLoading) {
    return <div className="center">Loading...</div>;
  }

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlace && (
        <PlaceForm
          formState={formState}
          inputHandler={inputHandler}
          formHandler={editPlaceSubmitHandler}
          isAdd={false}
        />
      )}
    </Fragment>
  );
};

export default EditPlace;
