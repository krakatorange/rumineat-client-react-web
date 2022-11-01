import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import FacebookLogin from "react-facebook-login";
import { toast } from "react-toastify";
import { useHistory } from "react-router";

import "../components/styles/login.css";

const REACT_APP_FACEBOOK_APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID;

function LoginScreen(props) {
  let history = useHistory();

  const responseFacebook = (response) => {
    if (!response.status) {
      history.push({
        pathname: "/getstarted",
      });
      localStorage.setItem("user", JSON.stringify(response));
      toast.success("Login Successfully", {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      toast.error("Error", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };
  const handleGuest = (data) => {
    history.push({
      pathname: "/getstarted",
    });
  };
  const handleClick = (data) => {};
  return (
    <div className={"login-container"}>
      <FacebookLogin
        appId={REACT_APP_FACEBOOK_APP_ID}
        fields="name,email,picture"
        onClick={handleClick}
        callback={responseFacebook}
      />
      <div className={"facebook-button"} role="button" onClick={handleGuest}>
        Login As Guest
      </div>
    </div>
  );
}

export default withRouter(LoginScreen);
