import React, { useState } from 'react';
import Button from '../../shared/components/FormElements/Button';
import useHttpClient from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/Modal/ErrorModal';
import { Link } from 'react-router-dom';
import Modal from '../../shared/components/UIElements/Modal/Modal';
import './friendItem.css';

const AcceptFriendReq = ({ receivedRequestId, userId, token, bell }) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showAccept, setShowAccept] = useState(false);
  const openAcceptHandler = () => setShowAccept(true);
  const closeAcceptHandler = () => {
    setShowAccept(false);
    bell(Math.random());
    //window.location.reload(true)
  };

  const acceptRequest = async () => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/friends/requests/accept`,
        'PATCH',
        JSON.stringify({
          friendId: receivedRequestId,
          userId: userId,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        }
      );
      openAcceptHandler();
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!error && (
        <Modal
          show={showAccept}
          onCancel={closeAcceptHandler}
          header={'Friend Request'}
          footer={
            <React.Fragment>
              <Button onClick={closeAcceptHandler} inverse>
                OKAY
              </Button>
            </React.Fragment>
          }
        >
          <p>Friend request has been Accepted successfully !</p>
        </Modal>
      )}
      <Link to='#'>
        <div className='friend_btn'>
          <Button friend onClick={acceptRequest}>
            {isLoading ? <LoadingSpinner /> : 'Accept'}
          </Button>
        </div>
      </Link>
    </React.Fragment>
  );
};
export default AcceptFriendReq;
