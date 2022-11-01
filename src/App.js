import React, { useEffect, useState } from "react";
import { Box, Heading, Grommet, ResponsiveContext } from "grommet";
import { toast } from "react-toastify";

import "./App.css";
import Splash from "./components/Splash";
import GetStarted from "./components/GetStarted";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import JoinSession from "./components/JoinSession";
import Staging from "./components/Staging";
import SwipeActivity from "./components/SwipeActivity";
import Results from "./components/Results";
import Statistics from "./components/Statistics";
import LoginScreen from "./components/LoginScreen";


import "./components/styles/card.css";
import "./components/styles/base.css";
import "react-toastify/dist/ReactToastify.css";
import dotenv from 'dotenv'
dotenv.config()

const theme = {
  rangeInput: {
    thumb: {
      height: "10px",
      color: "#FF1654",
    },
    track: {
      color: "#EFEFEF",
      height: "10px",
      extend: {
        align: "center",
        borderRadius: "10px",
      },
    },
  },
};

const AppBar = (props) => (
  <Link to="/">
    <Box
      tag="header"
      direction="row"
      align="center"
      justify="between"
      pad={{ vertical: "small", horizontal: "medium" }}
      elevation="medium"
      {...props}
    />
  </Link>
);
toast.configure();

const App = () => {
  const [spalshTimeout, setSplashTimeout] = useState(false);
  setTimeout(() => {
    setSplashTimeout(true);
  }, 2000);

      // getting token
  const token=localStorage.getItem('user');
  // removing on refresh page and close tab
  window.addEventListener("beforeunload", () =>
    localStorage.removeItem("user")
  );

  return (
    <Router>
      <Grommet theme={theme} pad={"medium"}>
        <ResponsiveContext.Consumer>
          {(size) => (
            <div>
              {!spalshTimeout && <Splash />}
              <AppBar className={"appbar"}>
                <Heading margin="none" className={"app-title"}>
                  Rumineat
                </Heading>
                <Box></Box>
              </AppBar>
              <Box direction="column" className={"base-container"}>
                <Switch>
                  {token ? (
                    <Route path="/" exact component={GetStarted} />
                  ) : (
                    <Route path="/" exact component={LoginScreen} />
                  )}
                   <Route path="/getstarted" exact component={GetStarted} />
                  <Route path="/join" component={JoinSession} />
                  <Route path="/session" component={Staging} />
                  <Route path="/swipe" component={SwipeActivity} />
                  <Route path="/results" component={Results} />
                  <Route path="/stats" component={Statistics} />
                </Switch>
              </Box>
            </div>
          )}
        </ResponsiveContext.Consumer>
      </Grommet>
    </Router>
  );
};

export default App;
