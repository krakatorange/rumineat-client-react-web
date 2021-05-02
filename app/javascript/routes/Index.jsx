import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SessionCreate from "../components/SessionCreate";

export default (
  <Router>
    <Switch>
      <Route path="/test" exact component={SessionCreate} />
    </Switch>
  </Router>
);
