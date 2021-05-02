import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SessionCreate from "../components/SessionCreate";
import Splash from "../components/Splash";

document.addEventListener("DOMContentLoaded", () => {
  render(
    <Router>
      <Switch>
        <Route path="/splash" exact component={Splash} />
        <Route path="/create" exact component={SessionCreate} />
      </Switch>
    </Router>,
    document.body.appendChild(document.createElement("div"))
  );
});
