import React from 'react';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';

import { Link } from 'react-router-dom';

import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
} from './../../shared/utils/validators';

import Input from './../../shared/components/FormElements/Input';
import Button from './../../shared/components/FormElements/Button';
import ImageUpload from './../../shared/components/FormElements/ImageUpload';

import './AuthForm.css';

const AuthForm = ({
  isLoginMode,
  formState,
  inputHandler,
  authSubmitHandler,
  responseGoogle,
  responseFacebook,
}) => {
  return (
    <form onSubmit={authSubmitHandler}>
      {!isLoginMode && (
        <Input
          element='input'
          id='name'
          type='text'
          placeholder='Your Name'
          label='Your Name'
          errorText='Your name is required!'
          validators={[VALIDATOR_REQUIRE()]}
          onInputChange={inputHandler}
        />
      )}
      <Input
        id='email'
        element='input'
        type='email'
        placeholder='Your Email'
        label='Email'
        errorText='Please enter a valid email!'
        validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
        onInputChange={inputHandler}
      />
      <Input
        id='password'
        element='input'
        type='password'
        placeholder='Your Password'
        label='Password'
        errorText='Please enter a valid password, at least 5 characters!'
        validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
        onInputChange={inputHandler}
      />
      <div style={{ marginBottom: '20px' }}>
        {isLoginMode && <Link to='/forgot-password'>forget password?</Link>}
      </div>
      {!isLoginMode && (
        <ImageUpload id='image' centered='true' onInputChange={inputHandler} />
      )}
      <Button type='submit' disabled={!formState.isValid}>
        {isLoginMode ? 'Log in' : 'Sign up'}
      </Button>

      {isLoginMode ? (
        <div>
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            buttonText='LOGIN WITH GOOGLE'
            className='social-media-button-class google'
            onSuccess={responseGoogle}
            cookiePolicy={'single_host_origin'}
          />
          <FacebookLogin
            appId={process.env.REACT_APP_FACEBOOK_ID}
            autoload={false}
            fields='name,email,picture'
            callback={responseFacebook}
            cssClass='social-media-button-class facebook'
            icon='fa-facebook'
            textButton='LOGIN WITH FACEBOOK'
          />
        </div>
      ) : null}
    </form>
  );
};

export default AuthForm;
