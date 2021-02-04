import React, { useState, useRef, useEffect } from "react";

import Button from "./Button";

import "./ImageUpload.css";

const ImageUpload = ({ id, centered, onInputChange, initialImageUrl }) => {
  const imageUploaderRef = useRef();
  const [file, setFile] = useState();
  const [previewImageUrl, setPreviewImageUrl] = useState(initialImageUrl);
  const [isValid, setIsValid] = useState(false);

  const uploadedHandler = (event) => {
    let uploadedFile;
    let fileIsValid = isValid;
    // First check if there are files uploaded
    if (event.target.files && event.target.files.length === 1) {
      uploadedFile = event.target.files[0];
      setFile(uploadedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      // If there's no valid image uploaded
      setIsValid(false);
      fileIsValid = false;
    }
    onInputChange(id, uploadedFile, fileIsValid);
  };

  const uploadImageHandler = () => {
    // Allows for image to be uploaded, taken from input DOM element
    imageUploaderRef.current.click();
  };

  useEffect(() => {
    // First check if file is undefined
    if (!file) {
      return;
    }
    const fileReader = new FileReader(); // Browser defined API that helps read files

    // Whenever fileReader loads a new file, it executes the specified anon function
    fileReader.onload = () => {
      // Set image URL to state
      setPreviewImageUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  return (
    <div className="form-control">
      {/* Hide input field for better user experience, connect Button to input functionality */}
      <input
        id={id}
        ref={imageUploaderRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={uploadedHandler}
      />
      <div className={`image-upload ${centered && "center"}`}>
        <div className="image-upload__preview">
          {previewImageUrl ? (
            <img src={previewImageUrl} alt="Preview" />
          ) : (
            "Please upload an image!"
          )}
        </div>
        <Button type="button" onClick={uploadImageHandler}>
          Upload Image
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
