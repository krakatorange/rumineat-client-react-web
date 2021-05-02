import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SessionCreate from "../components/SessionCreate";

export default (
  <Router>
    <Switch>
      <Route path="/create" exact component={SessionCreate} />
    </Switch>
  </Router>
);
