import React, { useState, useEffect } from 'react';
import { Feed, Icon, Image } from 'semantic-ui-react';
import useHttpRequest from './../../shared/hooks/http-hook';
import LoadingSpinner from './../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from './../../shared/components/UIElements/Modal/ErrorModal';
import useAuth from '../../shared/hooks/auth-hook';
import '../../places/components/PlaceItem.css';
import { Link } from 'react-router-dom';

const PlacesFeedUI = ({ news }) => {
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

  const { userId } = useAuth();
  const [p, setP] = useState();
  const { isLoading, error, clearError, sendRequest } = useHttpRequest();
  const fetchUsers = async () => {
    try {
      const place = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${news.place}`
      );

      setP(place);
    } catch (err) {
      console.log('Error in fetching users!', err);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [sendRequest]);
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && p && (
        <Feed>
          <Feed.Event>
            <Feed.Label>
              <Link to={`/${p.creator.id}/places`}>
                <Image src={p.creator.image} />
              </Link>
            </Feed.Label>
            <Feed.Content>
              <Feed.Summary>
                <Link to={`/account/${p.creator.id}`}>
                  {p.creator.id === userId ? 'You' : p.creator.name}
                </Link>{' '}
                added a new place{' '}
                <Link to={`/${p.creator.id}/places`}> {p.title}</Link>
                <Feed.Date>
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
              <Feed.Extra images>
                <div>
                  <Image
                    src={p.image}
                    as='a'
                    size='massive'
                    href={`/${p.creator.id}/places`}
                    target='HELLO'
                  />
                </div>
              </Feed.Extra>
            </Feed.Content>
          </Feed.Event>
          <Feed.Meta>
            <Feed.Like>
              <Icon name='like' color='red' />1 Likes
            </Feed.Like>
          </Feed.Meta>
        </Feed>
      )}
    </React.Fragment>
  );
};

export default PlacesFeedUI;
