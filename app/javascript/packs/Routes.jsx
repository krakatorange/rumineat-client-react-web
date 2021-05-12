import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SessionCreate from "../components/SessionCreate";
import Splash from "../components/Splash";
import {SessionJoin} from "../components/SessionJoin";
import {WaitingRoom} from "../components/WaitingRoom";

document.addEventListener("DOMContentLoaded", () => {
  render(
    <Router>
      <Switch>
        <Route path="/splash" exact component={Splash} />
        <Route path="/create" exact component={SessionCreate} />
        <Route path="/join" exact component={SessionJoin} />
        <Route path="/room" exact component={WaitingRoom} />
      </Switch>
    </Router>,
    document.body.appendChild(document.createElement("div"))
  );
});
