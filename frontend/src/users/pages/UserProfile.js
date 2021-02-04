import React, { Fragment, useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

// Context
import AuthContext from "./../../shared/context/auth-context";

import ErrorModal from "./../../shared/components/UIElements/Modal/ErrorModal";
import LoadingSpinner from "./../../shared/components/UIElements/LoadingSpinner";

// Custom hooks
import useHttpRequest from "./../../shared/hooks/http-hook";

import AccountSettings from "../components/AccountSettings";

const UserProfile = () => {
  const { userId } = useParams();
  const { token, logout } = useContext(AuthContext);
  const [userSettings, setUserSettings] = useState({});

  const { isLoading, error, clearError, sendRequest } = useHttpRequest();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const url = `/api/users/account/${userId}`;

        const request = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await sendRequest(
          url,
          request.method,
          null,
          request.headers
        );

        setUserSettings(response);
      } catch (err) {
        console.log("Could not get user settings!", err);
      }
    };
    fetchSettings();
  }, [sendRequest, token, userId]);

  const onDeleteAccount = () => {
    // After deleted user logout and remove token
    logout();
  };

  return (
    <Fragment>
      {error && <ErrorModal error={error} onClear={clearError} />}
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && !error && (
        <AccountSettings
          settings={userSettings}
          onDeleteAccount={onDeleteAccount}
        />
      )}
    </Fragment>
  );
};

export default UserProfile;
