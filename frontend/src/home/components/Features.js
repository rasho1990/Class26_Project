import React, { Fragment } from "react";

import "./Features.css";
import feature1 from "../../images/feature1.png";
import feature2 from "../../images/feature2.png";
import feature3 from "../../images/feature3.png";


const Features = () => {
  return (
    <Fragment>
        <div className="features-container">
      <div className="feature">
        <img
          className="picture"
          src={feature1}
          alt="feature 1"
        />
        <h4 className="caption">discover new interesting places</h4>
      </div>
      <div className="feature">
        <img
          className="picture"
          src={feature2}
          alt="feature 2"
        />
        <h4 className="caption">add and connect with friends <br/> from all over the world</h4>
      </div>

      <div className="feature">
        <img
          className="picture"
          src={feature3}
          alt="feature 3"
        />
        <h4 className="caption">Share your favorite places</h4>
      </div>
      </div>
    </Fragment>
  );
};

export default Features;
