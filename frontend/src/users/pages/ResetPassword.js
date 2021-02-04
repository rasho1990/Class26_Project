import React, { useContext, Fragment, useState } from "react";

import LoadingSpinner from "./../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "./../../shared/components/UIElements/Modal/ErrorModal";
import FormResetPassword from "../components/ResetPasswordForm/FormResetPassword";
import AuthContext from "./../../shared/context/auth-context";

import useForm from "./../../shared/hooks/form-hook";
import useHttpRequest from "../../shared/hooks/http-hook";

const ResetPassword = ({ match }) => {
  const { login } = useContext(AuthContext);
  const [same, setSame] = useState(true);
  const { isLoading, error, clearError, sendRequest } = useHttpRequest();

  const initInputs = {
    newPassword: {
      value: "",
      isValid: true,
    },
    retypePassword: {
      value: "",
      isValid: true,
    },
  };
  const [formState, inputHandler] = useForm(initInputs, false);

  const resetHandler = async (e) => {
    e.preventDefault();

    const { newPassword, retypePassword } = formState.inputs;

    if (newPassword.value !== retypePassword.value) {
      setSame(false);
      return (retypePassword.isValid = false);
    } 

    const url = `/api/users/reset-password`;

    const body = {
      resetLink: match.params.resetLink,
      newPassword: newPassword.value,
    };

    const headers = {
      "Content-Type": "application/json",
    };

    const request = {
      method: "PUT",
      body: JSON.stringify(body),
      headers,
    };

    try {
      const responseData = await sendRequest(
        url,
        request.method,
        request.body,
        request.headers
      );
      login(responseData.userId, responseData.token);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}

      <FormResetPassword
        formState={formState}
        inputHandler={inputHandler}
        formHandler={resetHandler}
        same={same}
      />
    </Fragment>
  );
};

export default ResetPassword;
