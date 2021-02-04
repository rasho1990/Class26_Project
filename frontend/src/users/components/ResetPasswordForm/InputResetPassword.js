import React from "react";

const InputResetPassword = ({
  placeholder,
  onchange,
  autoFocus,
  type,
  name,
  className,
}) => {
  return (
    <input
      name={name}
      type={type}
      className={className}
      autoFocus={autoFocus}
      placeholder={placeholder}
      onChange={onchange}
    />
  );
};

export default InputResetPassword;
