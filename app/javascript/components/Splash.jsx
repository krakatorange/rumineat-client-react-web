import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import {BrowserView, MobileView} from 'react-device-detect';

export default function Splash(){
  const [toHome, setToHome] = useState(false);
  const [toHomeBrowser, setToHomeBrowser] = useState(false);

  useEffect(() => {
    return () => {
      setToHome({});
    };
  }, []);

  useEffect(() => {
    return () => {
      setToHomeBrowser({});
    };
  }, []);

  setTimeout(() => setToHome(true), 2000)
  setTimeout(() => setToHomeBrowser(true))

  return (
    <>
            <BrowserView>
            {toHomeBrowser ? <Redirect to="/create" /> : <></>}
            </BrowserView>
            <MobileView>
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
            </MobileView>
    </>
)};
