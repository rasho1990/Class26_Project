import React, { useState, useEffect, useContext, Fragment } from 'react';
import useHttpRequest from './../../shared/hooks/http-hook';
import LoadingSpinner from './../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from './../../shared/components/UIElements/Modal/ErrorModal';
import NewsFeedList from '../../users/components/NewsFeedList';
import AuthContext from '../../shared/context/auth-context';
const NewsFeed = () => {
  const auth = useContext(AuthContext);
  const [newsfeed, setNewsFeed] = useState([]);
  const [user, setUser] = useState('');
  const { isLoading, error, clearError, sendRequest } = useHttpRequest();
  const removeDuplicates = (arr) => {
    let jsonObject = arr.map(JSON.stringify);
    let uniqueSet = new Set(jsonObject);
    let uniqueArray = Array.from(uniqueSet).map(JSON.parse);
    return uniqueArray;
  };

  const getNewsFeed = (users, currentUserNewsfeed) => {
    let newsHomePage = currentUserNewsfeed;
    const convertTimeAndDate = (date, time) => {
      let splittingDate = date.split('-');
      let splittingTime = time.split(':');
      let fullDate = new Date(
        splittingDate[0],
        splittingDate[1] - 1,
        splittingDate[2],
        splittingTime[0],
        splittingTime[1],
        splittingTime[2]
      );
      return fullDate;
    };
    currentUserNewsfeed.map((cn) => {
      let dateOfBeingFriends = convertTimeAndDate(cn.date, cn.time);
      if (cn.type === 'Friends') {
        let cf = users
          .filter((u) => u.id === cn.userId || u.id === cn.friendId)
          .filter((u) => u.id !== auth.userId)[0].newsfeed;
        let test = cf.filter(
          (feed) =>
            convertTimeAndDate(feed.date, feed.time) > dateOfBeingFriends
        );
        newsHomePage = newsHomePage.concat(test);
      }
    });

    newsHomePage = removeDuplicates(newsHomePage);
    return newsHomePage;
  };
  const fetchUsers = async () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/users`;
    try {
      const responseData = await sendRequest(url);
      const currentuser = responseData.filter((u) => u.id === auth.userId);
      setUser(currentuser[0].name);
      const currentUserNewsFeed = responseData.filter(
        (u) => u.id === auth.userId
      )[0].newsfeed;

      const newsHomePage = getNewsFeed(responseData, currentUserNewsFeed);
      setNewsFeed(newsHomePage);
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

      {isLoading && newsfeed ? (
        <LoadingSpinner asOverlay />
      ) : (
        <NewsFeedList newsfeed={newsfeed} name={user} />
      )}
    </Fragment>
  );
};

export default NewsFeed;
