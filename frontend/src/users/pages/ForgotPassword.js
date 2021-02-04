import React, { useState, Fragment } from 'react';

import LoadingSpinner from './../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from './../../shared/components/UIElements/Modal/ErrorModal';
import FormPassword from '../components/ResetPasswordForm/FormPassword';

import useForm from './../../shared/hooks/form-hook';
import useHttpRequest from '../../shared/hooks/http-hook';

const ForgotPassword = () => {
  const [isSended, setIsSended] = useState(false);

  const { isLoading, error, clearError, sendRequest } = useHttpRequest();

  const initInputs = {
    email: {
      value: '',
      isValid: true,
    },
  };
  const [formState, inputHandler] = useForm(initInputs, false);

  const emailSubmitHandler = async (e) => {
    e.preventDefault();

    const { email } = formState.inputs;
    const url = '/api/users/forgot-password';

    const body = {
      email: email.value,
    };

    const headers = {
      'Content-Type': 'application/json',
    };

    const request = {
      method: 'PUT',
      body: JSON.stringify(body),
      headers,
    };

    try {
      await sendRequest(url, request.method, request.body, request.headers);
      setIsSended(true);
    } catch (err) {
      console.log('Could not find E-mail!', err);
    }
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}

      <FormPassword
        formState={formState}
        inputHandler={inputHandler}
        formHandler={emailSubmitHandler}
        isSended={isSended}
      />
    </Fragment>
  );
};

export default ForgotPassword;
