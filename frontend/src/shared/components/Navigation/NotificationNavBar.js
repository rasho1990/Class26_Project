import React, { useEffect, useState, useContext } from 'react';
import ErrorModal from '../UIElements/Modal/ErrorModal';
import NotificationBadge from 'react-notification-badge';
import useHttpClient from '../../hooks/http-hook';
import AuthContext from '../../context/auth-context';
import NotificationList from '../Navigation/NotificationList';

const NotificationNavBar = () => {
  const auth = useContext(AuthContext);
  const { error, sendRequest, clearError } = useHttpClient();
  const [num, setNum] = useState(0);
  const [loadedUsers, setLoadedUsers] = useState();
  const [reqList, setReqList] = useState([]);
  const [renderBell, setRenderBell] = useState(Math.random());
  function handleChange(newValue) {
    setRenderBell(newValue);
  }
  const fetchUsers = async () => {
    try {
      const responseData = await sendRequest('/api/users');
      setLoadedUsers(responseData);
      const user = responseData.filter((u) => u.id === auth.userId)[0]
        .requestslist;
      setReqList(user);
      setNum(user.length);
    } catch (err) {
      console.log('Error in fetching users!', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [sendRequest, renderBell]);

  return (
    <React.Fragment>
      <div>
        <ErrorModal error={error} onClear={clearError} />
        <NotificationBadge count={num} />
        {loadedUsers && (
          <NotificationList bell={handleChange} items={reqList} count={num} />
        )}
      </div>
    </React.Fragment>
  );
};

export default NotificationNavBar;
