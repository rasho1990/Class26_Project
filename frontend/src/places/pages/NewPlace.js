import React, { useContext, Fragment } from 'react';
import { useHistory } from 'react-router-dom';

import AuthContext from './../../shared/context/auth-context';

import PlaceForm from './../components/PlaceForm';
import ErrorModal from './../../shared/components/UIElements/Modal/ErrorModal';
import LoadingSpinner from './../../shared/components/UIElements/LoadingSpinner';

// Custom hook
import useForm from './../../shared/hooks/form-hook';
import useHttpRequest from './../../shared/hooks/http-hook';

const NewPlace = () => {
  const initInputs = {
    title: {
      value: '',
      isValid: false,
    },
    description: {
      value: '',
      isValid: false,
    },
    address: {
      value: '',
      isValid: false,
    },
    image: {
      value: null,
      isValid: false,
    },
  };
  const [formState, inputHandler] = useForm(initInputs, false);
  const { isLoading, error, clearError, sendRequest } = useHttpRequest();
  const { token } = useContext(AuthContext);
  const { push } = useHistory();

  const addPlaceHandler = async (event) => {
    event.preventDefault();

    // Create FormData instance to send binary data
    const formData = new FormData();

    const { inputs } = formState;

    const url = '/api/places';

    formData.append('title', inputs.title.value);
    formData.append('description', inputs.description.value);
    formData.append('address', inputs.address.value);
    formData.append('image', inputs.image.value);

    const request = {
      method: 'POST',
      body: formData,
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      const responseData = await sendRequest(
        url,
        request.method,
        request.body,
        request.headers
      );
      // Redirect to place which just added
      const placeId = responseData.id;
      push(`/places/${placeId}/details`);
    } catch (err) {
      console.log('Error at creating place!', err);
    }
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <PlaceForm
        formState={formState}
        inputHandler={inputHandler}
        formHandler={addPlaceHandler}
        isAdd={true}
      />
    </Fragment>
  );
};

export default NewPlace;
