import React, { useEffect, useState } from "react";
import LineGraph from "./FraudDataLineGraph/FraudLineGraph.js";
import "./FraudAnalytics.css";
import Axios from "axios";

const FraudAnalytics = (props) => {
  const [FraudData, setFraudData] = useState({});

  async function getFraudAnalysis() {
    try {
      var r = await Axios.get(props.url + "/analytic/all");
      var data = r["data"];
      var FraudDataDaily = {};

      Object.keys(data).forEach((key) => {
        var time = data[key][2];
        var d = new Date(time);
        var date = d.toISOString().slice(0, 10);
        console.log(data[key], d);
        if (FraudDataDaily.hasOwnProperty(date)) {
          FraudDataDaily[date] = FraudDataDaily[date] + 1;
        } else {
          FraudDataDaily[date] = 1;
        }
      });
      console.log("Data is ", FraudDataDaily);
      setFraudData(FraudDataDaily);
    } catch (e) {
      console.log("/analytic/all", Object.keys(e), e.message);
      alert("Server Error !!");
    }
  }

  useEffect(() => {
    getFraudAnalysis();
  }, []);

  return (
    <div className="Fraud_graph_div">
      <LineGraph data={FraudData} />
    </div>
  );
};

export default FraudAnalytics;
