import { useReducer, useCallback } from "react";

const formReducer = (state, action) => {
  switch (action.type) {
    case "SET_FORM_DATA":
      return {
        ...state,
        inputs: {
          ...action.inputs
        },
        isValid: action.isValid
      };
    case "INPUT_CHANGE":
      let formIsValid = true;
      // Loop through input fields by id
      for (const inputId in state.inputs) {
        if (!state.inputs[inputId]) {
          // If the field is undefined, continue with next object key
          continue;
        }
        if (inputId === action.inputId) {
          // If a field is updated, only make form valid if that input field is valid as well
          formIsValid = formIsValid && action.isValid;
        } else {
          // Else reset the key to the already stored state value
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: {
            value: action.value,
            isValid: action.isValid
          }
        },
        isValid: formIsValid
      };
    default:
      return state;
  }
};

const useForm = (initInputs, initFormValidity) => {
  const INITIAL_FORM_STATE = {
    inputs: initInputs,
    isValid: initFormValidity
  };

  const [formState, dispatch] = useReducer(formReducer, INITIAL_FORM_STATE);

  // Brings state up from child component
  const inputHandler = useCallback((inputId, value, isValid) => {
    dispatch({ type: "INPUT_CHANGE", inputId, value, isValid });
  }, []);

  const setFormData = useCallback((formData, formIsValid) => {
    dispatch({
      type: "SET_FORM_DATA",
      inputs: formData,
      isValid: formIsValid
    });
  }, []);

  return [formState, inputHandler, setFormData];
};

export default useForm;
