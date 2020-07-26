import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

const FraudLineGraph = (props) => {
  const [state, setState] = useState({});

  useEffect(() => {
    var label = [];
    var data1 = [];
    Object.keys(props.data).forEach((key) => {
      data1.push({
        t: new Date(key),
        y: props.data[key],
      });
      label.push(new Date(key).toISOString().slice(0, 10));
    });
    setState({
      labels: label,
      datasets: [
        {
          label: "Number of Suspected Fraud Transactions",
          fill: false,
          lineTension: 0.5,
          backgroundColor: "rgba(75,192,192,1)",
          borderColor: "rgba(0,0,0,1)",
          borderWidth: 2,
          data: data1,
        },
      ],
    });
  }, [props]);
  console.log(state);
  return (
    <div>
      <Line
        data={state}
        options={{
          title: {
            display: true,
            text: "Suspected Fraud Transactions Daily Analytics",
            fontSize: 20,
          },
          legend: {
            display: true,
            position: "bottom",
          },
          scales: {
            xAxes: [
              {
                type: "time",
                time: {
                  unit: "day",
                  unitStepSize: 1,
                  displayFormats: {
                    day: "MMM DD",
                  },
                },
              },
            ],
          },
          layout: {
            padding: {
              left: 0,
              right: 10,
              top: 0,
              bottom: 0,
            },
          },
        }}
      />
    </div>
  );
};

export default FraudLineGraph;
