import React, { useState, useEffect, useContext } from 'react';
import { Feed, Icon, Image } from 'semantic-ui-react';
import useHttpRequest from './../../shared/hooks/http-hook';
import useAuth from '../../shared/hooks/auth-hook';
import { Link } from 'react-router-dom';
import LoadingSpinner from './../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from './../../shared/components/UIElements/Modal/ErrorModal';
import AuthContext from './../../shared/context/auth-context';

const FriendFeedUI = ({ news }) => {
  const timeAndDate = () => {
    let today = new Date();
    let splittingDate = news.date.split('-');
    let splittingTime = news.time.split(':');
    let dt2, dt1;
    const leadingZero = (value) => {
      if (value < 10) {
        return '0' + value.toString();
      }
      return value.toString();
    };
    dt2 = new Date(
      `${
        today.getFullYear() +
        '-' +
        leadingZero(today.getMonth() + 1) +
        '-' +
        leadingZero(today.getDate())
      }T${
        leadingZero(today.getHours()) +
        ':' +
        leadingZero(today.getMinutes()) +
        ':' +
        leadingZero(today.getSeconds())
      }Z`
    );
    dt1 = new Date(
      `${
        splittingDate[0] +
        '-' +
        leadingZero(splittingDate[1]) +
        '-' +
        leadingZero(splittingDate[2])
      }T${
        leadingZero(splittingTime[0]) +
        ':' +
        leadingZero(splittingTime[1]) +
        ':' +
        leadingZero(splittingTime[2])
      }Z`
    );
    let diff = (dt2 - dt1) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
  };

  const newsDate = timeAndDate();
  const { token, userId } = useContext(AuthContext);
  const [u1, setU1] = useState();
  const [u2, setU2] = useState();
  const { isLoading, error, clearError, sendRequest } = useHttpRequest();
  const fetchUsers = async () => {
    try {
      const urlUser1 = `/api/users/account/${news.userId}`;
      const urlUser2 = `/api/users/account/${news.friendId}`;
      const request = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const user1 = await sendRequest(
        urlUser1,
        request.method,
        null,
        request.headers
      );
      const user2 = await sendRequest(
        urlUser2,
        request.method,
        null,
        request.headers
      );
      setU1(user1);
      setU2(user2);
    } catch (err) {
      console.log('Error in fetching users!', err);
    }
  };

  // Fetch users before page loads, with empty [] only runs once
  useEffect(() => {
    fetchUsers();
  }, [sendRequest, userId, token]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {u1 && u2 && (
        <Feed>
          <Feed.Event>
            <Feed.Label>
              <Image src={u1.image} />
            </Feed.Label>
            <Feed.Content>
              <Feed.Summary>
                {userId === news.userId ? (
                  <>
                  {console.log(news)}
                    <Link to={`/account/${userId}`}> You </Link> and{' '}
                    <Link to={`/account/${u2.id}`}> {u2.name} </Link>
                  </>
                ) : userId === news.friendId ? (
                  <>
                    <Link to={`/account/${userId}`}> You </Link> and{' '}
                    <Link to={`/account/${u1.id}`}> {u1.name} </Link>
                  </>
                ) : (
                  <>
                    <Link to={`/account/${u1.id}`}> {u1.name} </Link> and{' '}
                    <Link to={`/account/${u2.id}`}> {u2.name} </Link>
                  </>
                )}
                are friends now
                <Feed.Date>
                  {' '}
                  {newsDate === 0
                    ? 'Few seconds Ago'
                    : newsDate < 60
                    ? newsDate + ' Minutes Ago'
                    : newsDate < 1440
                    ? parseInt(newsDate / 60) + ' Hours Ago'
                    : newsDate < 43200
                    ? parseInt((newsDate * 30) / 43200) + ' Days Ago'
                    : newsDate < 518400
                    ? parseInt((newsDate * 12) / 518400) + ' Months Ago'
                    : 'Over than a year ago'}
                </Feed.Date>
              </Feed.Summary>
            </Feed.Content>
            <Feed.Meta>
              <Feed.Like>
                <Icon name='like' color='red' />8 Likes
              </Feed.Like>
            </Feed.Meta>
          </Feed.Event>
        </Feed>
      )}
    </React.Fragment>
  );
};

export default FriendFeedUI;
