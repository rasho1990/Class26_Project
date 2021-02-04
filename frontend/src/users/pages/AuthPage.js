import React, { useState, useContext, Fragment } from 'react';
import useForm from './../../shared/hooks/form-hook';
import useHttpRequest from './../../shared/hooks/http-hook';
import axios from 'axios';
import AuthContext from './../../shared/context/auth-context';

import Card from './../../shared/components/UIElements/Card';
import AuthForm from './../components/AuthForm';
import Button from './../../shared/components/FormElements/Button';
import LoadingSpinner from './../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from './../../shared/components/UIElements/Modal/ErrorModal';

const AuthPage = () => {
  const { login } = useContext(AuthContext);

  const INITIAL_INPUTS = {
    email: {
      value: '',
      isValid: false,
    },
    password: {
      value: '',
      isValid: false,
    },
  };

  const [formState, inputHandler, setFormData] = useForm(INITIAL_INPUTS, false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, clearError, sendRequest } = useHttpRequest();

  const authSubmitHandler = async (e) => {
    e.preventDefault();
    //we need all data from AuthForm page
    const { name, email, password, image } = formState.inputs;
    //  we don't need this anymore because it will be managed in our customs hook (useHttpClient)
    // here we will get to this page in signup & login modes
    // so we need to check if it is login mode otherwise we need to fetch for signup
    if (isLoginMode) {
      const url = '/api/users/login';
      //sent request

      const body = {
        email: email.value,
        password: password.value,
      };
      localStorage.setItem("password", password.value);
      const request = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      };

      try {
        const responseData = await sendRequest(
          url,
          request.method,
          request.body,
          request.headers
        );

        window.location.reload(false);

        // signup: we send http request when we click the button then we trigger the function
        // login : we send http request when we render the Users page(Users component)

        login(responseData.userId, responseData.token);
      } catch (err) {
        console.log('Error at login!', err);
        // we handled error in custom hook (useHttpClient)
        // so can stay empty
      }
    } else {
      const url = '/api/users/signup';

      // Create FormData instance to send binary data

      // to send images we need to send form data (binary data not text)
      // we can use FormData() to append both (text & image)
      const formData = new FormData();

      formData.append('name', name.value);
      formData.append('email', email.value);
      formData.append('password', password.value);
      formData.append('image', image.value);

      const request = {
        method: 'POST',
        headers: {},
        body: formData,
      };

      try {
        const responseData = await sendRequest(
          url,
          request.method,
          request.body,
          request.headers
        );

        login(responseData.userId, responseData.token);
      } catch (err) {
        console.log('Error at signup!', err);
      }
    }
  };

  // google handler
  const responseGoogle = (response) => {
    if (isLoginMode || !isLoginMode) {
      axios({
        method: 'POST',
        url: `${process.env.REACT_APP_BACKEND_URL}/authSocialMedia/googlelogin`,
        data: {
          tokenId: response.tokenId,
        },
      }).then((response) => {
        login(response.data.userId, response.data.token);
        window.location.reload(false);
      });
    }
  };

  //facebook handler
  const responseFacebook = (response) => {
    if (isLoginMode || !isLoginMode) {
      axios({
        method: 'POST',
        url: `${process.env.REACT_APP_BACKEND_URL}/authSocialMedia/facebooklogin`,
        data: {
          accessToken: response.accessToken,
          id: response.id,
        },
      }).then((response) => {
        console.log(response.data)
        login(response.data.userId, response.data.token);
        window.location.reload(false);
      });
    }
  };

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          // Make copy of prev formState
          ...formState.inputs,
          // Set name field to undefined, so the form validator can continue
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevState) => !prevState);
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className='authentication'>
        {isLoading && <LoadingSpinner asOverlay />}
        <h2 className='authentication__header'>Hack Your Places</h2>
        <hr />
        <AuthForm
          formState={formState}
          inputHandler={inputHandler}
          authSubmitHandler={authSubmitHandler}
          isLoginMode={isLoginMode}
          responseGoogle={responseGoogle}
          responseFacebook={responseFacebook}
        />
        <hr />
        <h3 className='authentication__header'>
          {isLoginMode ? "Don't have an account ?" : 'Have an account ?'}
        </h3>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
        </Button>
      </Card>
    </Fragment>
  );
};

export default AuthPage;
