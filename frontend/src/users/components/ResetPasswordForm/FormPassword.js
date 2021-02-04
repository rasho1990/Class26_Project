import React from "react";
import "./FormPassword.css";
import Input from "../../../shared/components/FormElements/Input";
import ButtonResetPassword from "./ButtonResetPassword";

import {
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
} from "../../../shared/utils/validators";

const FormPassword = ({
  formState,
  inputHandler,
  formHandler,
  isSended = false,
}) => {
  return (
    <form className="reset_password_form" onSubmit={formHandler}>
      <Input
        id="email"
        element="input"
        type="email"
        label="Email"
        // value={formState.inputs.email.value}
        errorText="Please enter a valid email!"
        validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
        onInputChange={inputHandler}
      />

      <ButtonResetPassword className="reset_password_btn" type="submit">
        SUBMIT
      </ButtonResetPassword>
      {isSended && formState.inputs.email.value && (
        <div className="email-sended">
          Email has been sended to : <span>{formState.inputs.email.value}</span>{" "}
          ...please follow the instructions
        </div>
      )}
    </form>
  );
};

export default FormPassword;
