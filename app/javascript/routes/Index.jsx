import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SessionCreate from "../components/SessionCreate";
import Home from "../components/Home";

export default (
  <Router>
    <Switch>
<<<<<<< HEAD
      <Route path="/test" exact component={SessionCreate} />
      <Route path="/splash" exact component={Home} />
=======
      <Route path="/create" exact component={SessionCreate} />
>>>>>>> 74d61484a6b68e2dbb70bd3bb8d598490eb6f38c
    </Switch>
  </Router>
);
