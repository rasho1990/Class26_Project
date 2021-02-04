import React, { useState, useEffect, Fragment } from "react";
import useHttpRequest from "./../../shared/hooks/http-hook";
import UsersList from "./../components/UsersList";
import LoadingSpinner from "./../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "./../../shared/components/UIElements/Modal/ErrorModal";
import SearchBar from "../../shared/components/FormElements/SearchBar";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const { isLoading, error, clearError, sendRequest } = useHttpRequest();
  const [searchValue, setSearchValue] = useState("");
  const [searchedUsers, setSearchedUsers] = useState();

  const fetchUsers = async () => {
    const url = "/api/users";
    try {
      const responseData = await sendRequest(url);
      setUsers(responseData);
    } catch (err) {
      console.log("Error in fetching users!", err);
    }
  };

  // Fetch users before page loads, with empty [] only runs once
  useEffect(() => {
    fetchUsers();
  }, [sendRequest]);

  const searchUsers = async (searchValue) => {
    try {
      const data = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/?search=${searchValue}`
      );
      setSearchedUsers(data.users);
    } catch (error) { }
  };
  const onSubmitSearchHandler = (e) => {
    e.preventDefault();
    searchUsers(searchValue);
  };
  const inputSearchHandler = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <Fragment>
    
      <ErrorModal error={error} onClear={clearError} />
      
        <SearchBar
          inputSearchHandler={inputSearchHandler}
          onSubmitSearchHandler={onSubmitSearchHandler}
          searchValue={searchValue}
          placeholder="Search users with name or email"
        />
        {isLoading && <LoadingSpinner asOverlay />}

        {!isLoading && <UsersList users={searchedUsers || users} />}
     
    </Fragment>
  );
};

export default UsersPage;
