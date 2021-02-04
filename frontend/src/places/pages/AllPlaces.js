import React, { useEffect, useState } from 'react';

import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/components/UIElements/Modal/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import useHttpRequest from '../../shared/hooks/http-hook';
import SearchBar from '../../shared/components/FormElements/SearchBar';

const AllPlaces = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpRequest();
  const [loadedPlaces, setLoadedPlaces] = useState();
  const [searchValue, setSearchValue] = useState('');
  const [searchedPlaces, setSearchedPlaces] = useState();

  // fetch all places in database
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/place/all`
        );
        setLoadedPlaces(responseData.places);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

  // fetch only searched places in database
  const searchPlaces = async (searchValue) => {
    try {
      const data = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/place/all/?search=${searchValue}`
      );
      setSearchedPlaces(data.places);
    } catch (error) {}
  };
  const onSubmitSearchHandler = (e) => {
    e.preventDefault();
    searchPlaces(searchValue);
  };
  const inputSearchHandler = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      <SearchBar
        inputSearchHandler={inputSearchHandler}
        onSubmitSearchHandler={onSubmitSearchHandler}
        searchValue={searchValue}
        placeholder='Search places with title or address'
      />
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && searchedPlaces ? (
        <PlaceList items={searchedPlaces} />
      ) : loadedPlaces ? (
        <PlaceList items={loadedPlaces} />
      ) : (
        ''
      )}
    </React.Fragment>
  );
};

export default AllPlaces;
