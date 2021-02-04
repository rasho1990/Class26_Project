import React, { useState, useEffect, useContext, Fragment } from 'react';
import useHttpRequest from '../../shared/hooks/http-hook';
import UsersList from '../../users/components/UsersList';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/Modal/ErrorModal';
import AuthContext from '../../shared/context/auth-context';

const UserFriends = () => {
  const auth = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const { isLoading, error, clearError, sendRequest } = useHttpRequest();
  const fetchUsers = async () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/friends`;
    try {
      const responseData = await sendRequest(
        url,
        'POST',
        JSON.stringify({
          userId: auth.userId,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        }
      );

      setUsers(responseData);
    } catch (err) {
      console.log('Error in fetching users!', err);
    }
  };

  // Fetch users before page loads, with empty [] only runs once
  useEffect(() => {
    fetchUsers();
  }, [sendRequest]);

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />

      {isLoading && <LoadingSpinner asOverlay />}
      <UsersList users={users} />
    </Fragment>
  );
};

export default UserFriends;
