import React, { useState, useContext, Fragment } from 'react';

import AuthContext from '../../shared/context/auth-context';
import useForm from './../../shared/hooks/form-hook';

import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal/Modal';
import ErrorModal from '../../shared/components/UIElements/Modal/ErrorModal';
import ImageUpload from './../../shared/components/FormElements/ImageUpload';
import Input from './../../shared/components/FormElements/Input';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
} from './../../shared/utils/validators';

import ProfilePlaceItem from './ProfilePlaceItem';
import ProfileFriendsItem from './ProfileFriendsItem';
import useHttpRequest from '../../shared/hooks/http-hook';

import './../components/AccountSettings.css';

const AccountSettings = ({ settings, onDeleteAccount }) => {
  const { isLoggedIn, userId, token, logout } = useContext(AuthContext);
  const { isLoading, error, clearError, sendRequest } = useHttpRequest();

  const [showDelete, setShowDelete] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [confirmEdit, setConfirmEdit] = useState(false);

  const openDeleteHandler = () => setShowDelete(true);
  const closeDeleteHandler = () => setShowDelete(false);

  const UserIdOfLoggedIn = JSON.parse(localStorage.getItem('userSession'))
    .userId;
  const userIdOfCurrentPage = settings.id;

  const [formState, inputHandler] = useForm(
    {
      name: {
        value: '',
        isValid: false,
      },
      email: {
        value: '',
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  // handling delete account
  const deleteAccountHandler = async (userId) => {
    const url = `/api/users/account/${userId}`;

    const body = {};
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const request = {
      method: 'DELETE',
      body,
      headers,
    };

    try {
      await sendRequest(url, request.method, request.body, request.headers);
    } catch (err) {
      console.log('Error while deleting account!', err);
    }

    setShowDelete(false);
    setConfirmDelete(true);
  };

  // Enable edit mode
  const editSwitchHandler = () => {
    setIsEditMode((prevState) => !prevState);
  };

  // Submitb eidted settings
  const editSubmitHandler = async (e) => {
    e.preventDefault();

    const { name, email, password, image } = formState.inputs;

    const url = `/api/users/account/${userId}`;

    // Create FormData instance to send binary data
    const formData = new FormData();
    formData.append('name', name.value);
    formData.append('email', email.value);
    formData.append('password', password.value);
    formData.append('image', image.value);

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const request = {
      method: 'PATCH',
      body: formData,
      headers,
    };

    try {
      await sendRequest(url, request.method, request.body, request.headers);
    } catch (err) {
      console.log('Could not edit account!', err);
    }

    setConfirmEdit(true);
  };

  // toggle Password Handler
  const togglePasswordHandler = () => {
    const password = document.querySelector('#password');
    const type =
      password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    // toggle the eye slash icon
    const togglePassword = document.querySelector('#togglePassword');
    togglePassword.classList.toggle('fa-eye-slash');
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showDelete}
        onCancel={closeDeleteHandler}
        header={'Are you sure?'}
        footerClass='profile__modal-actions'
        footer={
          <React.Fragment>
            <Button onClick={closeDeleteHandler} inverse>
              CANCEL
            </Button>
            <Button onClick={() => deleteAccountHandler(userId)} danger>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you really want to delete this account? This action is
          IRREVERSIBLE!
        </p>
      </Modal>
      <Modal
        show={confirmDelete}
        header={'Delete account confirmation!'}
        footerClass='profile__modal-actions'
        footer={
          <React.Fragment>
            <Button onClick={() => onDeleteAccount()}>OK</Button>
          </React.Fragment>
        }
      >
        <p>Your account has been deleted successfully.</p>
      </Modal>
      <Modal
        show={confirmEdit}
        header={'Account edited!'}
        footerClass='profile__modal-actions'
        footer={
          <React.Fragment>
            <Button onClick={() => logout()} danger>
              Logout
            </Button>
          </React.Fragment>
        }
      >
        <p>You need to login again for changes to take effect</p>
      </Modal>
      {!isEditMode && (
        <Card className='profile-card'>
          {isLoading && <LoadingSpinner asOverlay />}
          <div className='profile__image'>
            <img src={settings.image} alt={settings.name} />
          </div>
          <div className='profile__info'>
            <div>
              <h2>Your Name</h2>
              <h3>{settings.name}</h3>
            </div>
            <div>
              <h2>Email</h2>

              <h3>{settings.email}</h3>
            </div>
          {UserIdOfLoggedIn === userIdOfCurrentPage && (
              <div>
                <h2>Password</h2>
                <Input
                  id='password'
                  element='input'
                  type='password'
                  initValue={localStorage.getItem('password')}
                  disabled={true}
                  onInputChange={inputHandler}
                />
                <i
                  className='far fa-eye'
                  id='togglePassword'
                  onClick={togglePasswordHandler}
                ></i>
              </div>
            )}
            <div>
              <h2>Places</h2>
              {settings.places && settings.places.length > 0 ? (
                <ul className='profile__place-list'>
                  {settings.places.map((place) => (
                    <ProfilePlaceItem
                      key={`place-${place.id || place._id}`}
                      id={place.id || place._id}
                      image={place.image}
                      title={place.title}
                      address={place.address}
                    />
                  ))}
                </ul>
              ) : (
                <Card>
                  {UserIdOfLoggedIn === userIdOfCurrentPage ? (
                    <p>
                      No places found, you can share a place, just click the
                      button...
                    </p>
                  ) : (
                    <p>This user doesn't have any places!</p>
                  )}
                  {UserIdOfLoggedIn === userIdOfCurrentPage && (
                    <Button to='/places/new'>SHARE PLACE</Button>
                  )}
                </Card>
              )}
            </div>

            <div>
              <h2>Friends</h2>
              {settings.friends && settings.friends.length > 0 ? (
                <ul className='profile__place-list'>
                  {settings.friends.map((friend) => (
                    <ProfileFriendsItem
                      key={`place-${friend.id || friend._id}`}
                      id={friend.id || friend._id}
                      image={friend.image}
                      email={friend.email}
                      name={friend.name}
                    />
                  ))}
                </ul>
              ) : (
                <Card>
                  <p>
                    No friends found, you can find a friend, just click the
                    button...
                  </p>
                  <Button to='/'>FIND FRIEND</Button>
                </Card>
              )}
            </div>
            
          </div>
          <div className='profile__actions'>
            {isLoggedIn && UserIdOfLoggedIn === userIdOfCurrentPage && (
              <Fragment>
                <Button onClick={editSwitchHandler}>EDIT</Button>
                <Button onClick={openDeleteHandler} danger>
                  DELETE
                </Button>
              </Fragment>
            )}
          </div>
        </Card>
      )}
      {isEditMode && (
        <Card className='profile-card'>
          {isLoading && <LoadingSpinner asOverlay />}
          <form onSubmit={editSubmitHandler}>
            <ImageUpload
              id='image'
              centered='true'
              onInputChange={inputHandler}
              initialImageUrl={settings.image}
            />
            <Input
              id='name'
              element='input'
              type='text'
              placeholder='Your Name'
              label='Your Name'
              errorText='Your name is required!'
              validators={[VALIDATOR_REQUIRE()]}
              onInputChange={inputHandler}
              initValue={settings.name}
              initIsValid={true}
            />
            <Input
              id='email'
              element='input'
              type='email'
              placeholder='Your Email'
              label='Email'
              errorText='Please enter a valid email!'
              validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
              onInputChange={inputHandler}
              initValue={settings.email}
              initIsValid={true}
            />
            <div>
              <Input
                id='password'
                element='input'
                type='password'
                placeholder='Your Password'
                label='Password'
                errorText='Please enter a valid password, at least 5 characters!'
                validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
                onInputChange={inputHandler}
                initValue={localStorage.getItem('password')}
                initIsValid={true}
              />
              <i
                className='far fa-eye'
                id='togglePassword'
                onClick={togglePasswordHandler}
              ></i>
            </div>

            <Button onClick={editSwitchHandler}>CANCEL</Button>
            <Button type='submit' danger>
              SAVE
            </Button>
          </form>
        </Card>
      )}
    </React.Fragment>
  );
};

export default AccountSettings;
