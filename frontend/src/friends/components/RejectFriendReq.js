import React, { useState } from 'react';
import Button from '../../shared/components/FormElements/Button';
import useHttpClient from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/Modal/ErrorModal';
import Modal from '../../shared/components/UIElements/Modal/Modal';
import { Link } from 'react-router-dom';
import './friendItem.css';
const RejectFriendReq = ({ receivedRequestId, userId, token, bell }) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showAccept, setShowAccept] = useState(false);
  const openAcceptHandler = () => setShowAccept(true);
  const closeAcceptHandler = () => {
    setShowAccept(false);
    bell(Math.random());
  };
  const acceptRequest = async () => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/friends/requests/reject`,
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
          <p>Friend request has been rejected successfully !</p>
        </Modal>
      )}
      <Link to='#'>
        <div className='friend_btn'>
          <Button classname='btn_friend' onClick={acceptRequest}>
            {isLoading ? <LoadingSpinner /> : 'Reject'}
          </Button>
        </div>
      </Link>
    </React.Fragment>
  );
};
export default RejectFriendReq;
