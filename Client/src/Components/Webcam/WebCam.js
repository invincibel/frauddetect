import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Webcam from "react-webcam";
import "./WebCam.css";
// import { loadModels, getFullFaceDescription, createMatcher } from "../api/face";
import axios from "axios";
import { throws } from "assert";
const fs = require("fs");

const WIDTH = 420;
const HEIGHT = 420;
const inputSize = 160;

const useStyles = (theme) => ({
  root: {
    display: "flex",
    "& > * + *": {
      marginLeft: "400px",
    },
  },
});

class VideoInput extends Component {
  constructor(props) {
    super(props);
    this.webcam = React.createRef();
    this.state = {
      fullDesc: null,
      detections: null,
      descriptors: null,
      faceMatcher: null,
      match: null,
      facingMode: null,
      imgPath: "",
      image_queue: [],
      queue_front: 0,
      identifiedFaceArray: [],
    };
  }

  componentWillMount = async () => {
    this.setInputDevice();
  };

  setInputDevice = () => {
    navigator.mediaDevices.enumerateDevices().then(async (devices) => {
      let inputDevice = await devices.filter(
        (device) => device.kind === "videoinput"
      );
      if (inputDevice.length < 2) {
        await this.setState({
          facingMode: "user",
        });
      } else {
        await this.setState({
          facingMode: { exact: "environment" },
        });
      }
      this.startCapture();
    });
  };

  startCapture = () => {
    this.interval = setInterval(() => {
      if (this.state.image_queue.length >= 4) {
        clearInterval(this.interval);
      }
      // console.log("Hello");
      this.capture();
    }, 3000);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidUpdate() {
    if (this.state.identifiedFaceArray.length == 4) {
      // console.log("array of 4 is reached");
      this.props.udpateImageRecognition(this.state.identifiedFaceArray);
      return;
    }
  }

  capture = async () => {
    if (!!this.webcam.current && this.state.image_queue.length < 4) {
      var idx_front = this.state.queue_front;

      var img = this.webcam.current.getScreenshot();
      var image_array = this.state.image_queue;

      image_array.push(img);
      this.setState({
        image_queue: image_array,
      });

      var data = {
        base64image: this.state.image_queue[idx_front],
        name: this.props.name + "_" + this.state.queue_front,
      };

      var data2 = {
        name: data.name + ".jpeg",
      };

      //##Testing
      // console.log("Pushing in the data ", idx_front);
      this.setState({
        queue_front: idx_front + 1,
        imgPath: data.base64image,
      });

      try {
        axios.post(this.props.url + "/upload/image", data).then((info) => {
          try {
            axios
              .get(this.props.url + "/name?name=" + data2.name)
              .then((data) => {
                //#TEsting
                // console.log("Res is ", data);
                var temp_arr = this.state.identifiedFaceArray;
                if (data["data"]) {
                  temp_arr.push(data["data"]);
                } else {
                  temp_arr.push("");
                }
                this.setState({
                  identifiedFaceArray: temp_arr,
                });
                // console.log(this.state.identifiedFaceArray);
              });
          } catch (e) {
            console.log("/name ", Object.keys(e), e.message);
          }
        });
      } catch (e) {
        console.log("/upload/image ", Object.keys(e), e.message);
      }
    }
  };

  render() {
    const { detections, match, facingMode } = this.state;
    let videoConstraints = null;
    let camera = "";
    if (!!facingMode) {
      videoConstraints = {
        width: WIDTH,
        height: HEIGHT,
        facingMode: facingMode,
      };
      if (facingMode === "user") {
        camera = "Front";
      } else {
        camera = "Back";
      }
    }

    let drawBox = null;
    if (!!detections && this.state.image_queue.length < 4) {
      drawBox = detections.map((detection, i) => {
        let _H = detection.box.height;
        let _W = detection.box.width;
        let _X = detection.box._x;
        let _Y = detection.box._y;
        return (
          <div key={i}>
            <div
              style={{
                position: "absolute",
                border: "solid",
                borderColor: "blue",
                height: _H,
                width: _W,
                transform: `translate(${_X}px,${_Y}px)`,
              }}
            >
              {!!match && !!match[i] ? (
                <p
                  style={{
                    backgroundColor: "blue",
                    border: "solid",
                    borderColor: "blue",
                    width: _W,
                    marginTop: 0,
                    color: "#fff",
                    transform: `translate(-3px,${_H}px)`,
                  }}
                >
                  {match[i]._label}
                </p>
              ) : null}
            </div>
          </div>
        );
      });
    }

    if (this.state.image_queue.length < 4) {
      return (
        <div
          className="Camera"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p>Camera: {camera}</p>
          <div
            style={{
              width: WIDTH,
              height: HEIGHT,
            }}
          >
            <div style={{ position: "relative", width: WIDTH }}>
              {!!videoConstraints ? (
                <div style={{ position: "absolute" }}>
                  <Webcam
                    audio={false}
                    width={WIDTH}
                    height={HEIGHT}
                    ref={this.webcam}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                  />
                </div>
              ) : null}
              {!!drawBox ? drawBox : null}
            </div>
          </div>
          <span className="webcam_instructions">
            Please Look into the camera !! Make sure your face fits in the
            square and ensure proper lightings !!
          </span>
          <span className="images_tracker">{this.state.queue_front + 1}/4</span>
          <CircularProgress />
        </div>
      );
    }
    return (
      <div className="Loading_circular_div">
        <CircularProgress />
      </div>
    );
  }
}

export default VideoInput;
