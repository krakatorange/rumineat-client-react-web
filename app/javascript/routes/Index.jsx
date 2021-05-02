import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SessionCreate from "../components/SessionCreate";
import Home from "../components/Home";

export default (
  <Router>
    <Switch>
      <Route path="/test" exact component={SessionCreate} />
      <Route path="/splash" exact component={Home} />
    </Switch>
  </Router>
);
