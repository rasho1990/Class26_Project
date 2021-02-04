import React, { useState } from 'react';

import Button from '../../shared/components/FormElements/Button';
import useHttpClient from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/Modal/ErrorModal';
import { Link } from 'react-router-dom';
import Modal from '../../shared/components/UIElements/Modal/Modal';
const AddFriend = ({ receivedRequestId, userId, token }) => {
  const [reqsent, setReqSent] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showAdd, setShowAdd] = useState(false);
  const openAddHandler = () => setShowAdd(true);
  const closeAddHandler = () => setShowAdd(false);
  const newRequest = async () => {
    setReqSent(true);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/friends/add`,
        'POST',
        JSON.stringify({
          friendId: receivedRequestId,
          userId: userId,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        }
      );
      openAddHandler();
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!error && (
        <Modal
          show={showAdd}
          onCancel={closeAddHandler}
          header={'Friend Request'}
          footer={
            <React.Fragment>
              <Button onClick={closeAddHandler} inverse>
                OKAY
              </Button>
            </React.Fragment>
          }
        >
          <p>Your request has been send successfully !</p>
        </Modal>
      )}
      {userId !== receivedRequestId ? (
        <Link to='#'>
          <Button friend onClick={newRequest} disabled={reqsent}>
            {isLoading ? <LoadingSpinner /> : 'Add Friend'}
          </Button>{' '}
        </Link>
      ) : (
        <Link to={`./account/${userId}`}>
          <Button friend>MY Profile</Button>
        </Link>
      )}
    </React.Fragment>
  );
};
export default AddFriend;
