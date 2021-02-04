import React, { useContext, useState } from 'react';
import Button from '../../shared/components/FormElements/Button';
import useHttpClient from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { Link } from 'react-router-dom';
import ErrorModal from '../../shared/components/UIElements/Modal/ErrorModal';
import Modal from '../../shared/components/UIElements/Modal/Modal';
import AuthContext from '../../shared/context/auth-context';

const DeleteFriend = ({ userId, receivedRequestId }) => {
  const [reqsent, setReqSent] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showAdd, setShowAdd] = useState(false);
  const openAddHandler = () => setShowAdd(true);
  const closeAddHandler = () => setShowAdd(false);
  const deleteRequest = async () => {
    setReqSent(true);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/friends/delete`,
        'POST',
        JSON.stringify({
          friendId: receivedRequestId,
          userId: auth.userId,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
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
          <p>A friend deleted successfully !</p>
        </Modal>
      )}
      <Link>
        <Button friend onClick={deleteRequest} disabled={reqsent}>
          {isLoading ? <LoadingSpinner /> : 'Delete Friend'}
        </Button>{' '}
      </Link>
    </React.Fragment>
  );
};

export default DeleteFriend;
