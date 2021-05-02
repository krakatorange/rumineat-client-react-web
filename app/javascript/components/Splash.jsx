import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";

export default function Splash(){
  const [toHome, setToHome] = useState(false);

  useEffect(() => {
    return () => {
      setToHome({});
    };
  }, []);

  setTimeout(() => setToHome(true), 2000)

  return (
    <>
      {toHome ? <Redirect to="/create" /> : <></>}
      <div className="vw-100 vh-100 primary-color d-flex align-items-center justify-content-center">
        <div className="jumbotron jumbotron-fluid bg-transparent">
          <div className="container secondary-color">
            <h1 className="display-4">Rumineat</h1>
            <p className="lead">
              AI Powered Sentiment Analysis For Your Group's Next Meal.
            </p>
          </div>
        </div>
      </div>
    </>
)};
