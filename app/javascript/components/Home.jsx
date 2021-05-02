import React from "react";
import { Link } from "react-router-dom";

export default function Home(){
  return (
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
)};
