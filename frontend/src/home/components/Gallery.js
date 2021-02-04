import React, { useEffect, useState } from "react";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

import "./Gallery.css";

import useHttpRequest from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/Modal/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const Gallery = () => {
  const [galleryData, setGalleryData] = useState([]);
  const { isLoading, error, clearError, sendRequest } = useHttpRequest();

  const fetchPlaces = async () => {
    setGalleryData([]);
    const url = "/api/places/place/all";
    try {
      const responseData = await sendRequest(url);
      setGalleryData(responseData.places);
    } catch (err) {
      console.log("Error in fetching places!", err);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, [sendRequest]);

  return (
    <div className="gallery">
      <h1 className="gallery-title">Gallery</h1>

      <ErrorModal error={error} onClear={clearError} />

      {isLoading && <LoadingSpinner asOverlay />}

      <Carousel
        showArrows={true}
        infiniteLoop={true}
        showStatus={false}
        showThumbs={false}
        showIndicators={false}
        autoPlay={true}
        dynamicHeight={true}
        className="carousel"
      >
        {!isLoading &&
          galleryData.length > 0 &&
          galleryData.map((place, i) => (
            <div key={i}>
              <img src={place.image} alt={place.title}/>
              <p className="legend">{place.title}</p>
            </div>
          ))}
      </Carousel>
    </div>
  );
};

export default Gallery;
