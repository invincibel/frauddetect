import React, { Component } from "react";
import Webcam from "react-webcam";
import CircularProgress from "@material-ui/core/CircularProgress";
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
      total_pic: 3,
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
    setTimeout(() => {
      this.interval = setInterval(() => {
        if (this.state.image_queue.length >= this.state.total_pics) {
          clearInterval(this.interval);
        }
        // console.log(this.state.image_queue.length);
        this.capture();
      }, 2000);
    }, 2000);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidUpdate() {
    // console.log("Len is", this.state.image_queue.length, this.state.total_pic);
    if (this.state.image_queue.length == this.state.total_pic) {
      // console.log("array of is reached of size", this.state.total_pic);
      this.props.handleWebCamImages(this.state.image_queue);
      var temp = this.state.image_queue;
      temp.push("null");
      this.setState({
        image_queue: temp,
      });
    }
  }

  capture = async () => {
    if (
      !!this.webcam.current &&
      this.state.image_queue.length < this.state.total_pic
    ) {
      var idx_front = this.state.queue_front;

      var img = this.webcam.current.getScreenshot();
      if (img != null) {
        var image_array = this.state.image_queue;

        image_array.push(img);
        this.setState({
          image_queue: image_array,
        });

        var data = {
          base64image: this.state.image_queue[idx_front],
          name: this.props.name + this.state.queue_front,
        };

        var data2 = {
          name: data.name + ".jpeg",
        };

        console.log("Pushing in the data ", idx_front);
        this.setState({
          queue_front: idx_front + 1,
          imgPath: data.base64image,
        });
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
    if (!!detections && this.state.image_queue.length < this.state.total_pic) {
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

    if (this.state.image_queue.length < this.state.total_pic) {
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
          <span>
            {" "}
            Please look into the camera and ensure enough lights around you !!
          </span>
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
          <span>
            Clicked {this.state.queue_front + 1}/{this.state.total_pic}
          </span>
          <br />
          <CircularProgress />
        </div>
      );
    }
    return (
      <div className="Finished">
        <h2 className="fs-title">
          Congratulations !! Your card has been setup
        </h2>
        <button class="next action-button" onClick={this.props.handleNext}>
          Next
        </button>
      </div>
    );
  }
}

export default VideoInput;
