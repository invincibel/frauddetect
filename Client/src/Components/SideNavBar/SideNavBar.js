import React from "react";
import "./SideNavBar.css";

const SideNavBar = (props) => {
  return (
    <div id="viewport">
      <div id="sidebar">
        <header>
          <a href="#">Analytics</a>
        </header>
        <ul className="nav">
          <li>
            <div className="Analytics_bullet">
              <span onClick={() => props.handleChoices(0)}>
                <i className="zmdi zmdi-view-dashboard"></i> User Information
              </span>
            </div>
          </li>
          <li>
            <div className="Analytics_bullet">
              <span onClick={() => props.handleChoices(1)}>
                <i className="zmdi zmdi-link"></i> Fraud Statistics
              </span>
            </div>
          </li>
          <li>
            <div className="Analytics_bullet">
              <span onClick={() => props.handleChoices(2)}>
                <i className="zmdi zmdi-widgets"></i> Back To Demo
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideNavBar;
