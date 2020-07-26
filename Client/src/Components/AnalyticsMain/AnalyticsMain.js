import React, { useState, useEffect } from "react";
import SideNavBar from "../SideNavBar/SideNavBar.js";
import "./AnalyticsMain.css";
import { withRouter } from "react-router";
import createHistory from "history/createBrowserHistory";
import LineGraph from "../LineGraph/LineGraph.js";
import UserInfo from "../UserInfo/UserInfoParent/UserInfoParent.js";
import FraudAnalytics from "../FraudAnalytics/FraudAnalytics.js";

const AnalyticsMain = (props) => {
  const [type, setType] = useState(0);

  function handleChoices(type) {
    if (type == 2) {
      props.history.push("/");
    }
    setType(type);
  }

  return (
    <div className="Analytics_outer">
      <div className="Analytics_navBar">
        <SideNavBar handleChoices={handleChoices} />
      </div>
      <div className="Analytics_main">
        {type == 0 ? <UserInfo url={props.url} /> : ""}
        {type == 1 ? <FraudAnalytics url={props.url} /> : ""}
      </div>
    </div>
  );
};

export default AnalyticsMain;
