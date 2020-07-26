import React, { Component } from "react";
import { Route, Router } from "react-router-dom";
import createHistory from "history/createBrowserHistory";
import logo from "./logo.svg";
import "./App.css";
import AnalyticsMain from "./Components/AnalyticsMain/AnalyticsMain.js";
import DemoMain from "./Components/DemoMain/DemoMain.js";
import Verification from "./Components/Verification /Verification.js";

const history = createHistory({ basename: process.env.PUBLIC_URL });
const Url = "http://localhost:8000";
const App = () => {
  return (
    <div>
      <Router history={history}>
        <div className="route">
          <Route
            exact
            path="/"
            component={() => <DemoMain history={history} url={Url} />}
          />
          <Route
            path="/analytics"
            component={() => <AnalyticsMain url={Url} history={history} />}
          />
          <Route path="/validate/:id/:ammount" component={Verification} />
        </div>
      </Router>
    </div>
  );
};

export default App;
