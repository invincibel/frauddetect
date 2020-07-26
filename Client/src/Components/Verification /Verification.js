import React, { useState, useEffect } from "react";
import WebCam from "../Webcam/WebCam.js";
import "./Verification.css";
import failIcon from "../../images/Deletion_icon.svg.png";
import Axios from "axios";
const URL = "http://localhost:8000";
const Verification = (props) => {
  const [step, setStep] = useState(0);
  const [imageRecognisedArr, setImageArr] = useState([]);
  const [VerifiedPerson, setVerifiedPerson] = useState("");
  const id_verify = props.match.params.id;
  const ammount = props.match.params.ammount;
  console.log("Ammount is ", ammount);

  // console.log("Name is ", id_verify);

  // console.log(
  //   "Image recognition array is ",
  //   step,
  //   imageRecognisedArr,
  //   VerifiedPerson
  // );

  function udpateImageRecognition(imageRecognised) {
    if (imageRecognisedArr.length == 0 && imageRecognised.length == 4) {
      setStep(1);
      console.log(
        "The array of recognised image is being updated",
        imageRecognised
      );
      setImageArr(imageRecognised);
    }
  }

  function extractNumber(element) {
    var numberPattern = /\d+/g;
    var answer = element.match(numberPattern);
    return answer != null && answer.length ? answer[0] : null;
  }

  function element_matcher(elem, sender) {
    var ok = false;
    try {
      var useful_id = extractNumber(elem.split("_")[0]);
      if (useful_id == sender) {
        // console.log("found for ", useful_id, elem);
        ok = true;
        return ok;
      }
    } catch (e) {
      console.log("Errorr in verification.js", e);
      return ok;
    }
    return ok;
  }

  function element_matcher_init(sender) {
    var res = false;
    imageRecognisedArr.forEach((child_image_array) => {
      console.log(
        "checking for child array",
        child_image_array,
        imageRecognisedArr
      );
      var elements = child_image_array.split(",");
      elements.forEach((elem) => {
        var child_res = element_matcher(elem, sender);
        if (child_res) {
          res = true;
        }
      });
    });
    return res;
  }

  function getTime() {
    var d = new Date();
    var ans = d.toISOString().slice(0, 19).replace("T", " ");
    return ans;
  }

  function handleFailure() {
    setStep(2);
    var arr = id_verify.split("_");
    if (arr.length == 2) {
      var sender = arr[0];
      var recev = arr[1];
      try {
        Axios.get(URL + "/getemail?name=" + sender).then((response) => {
          if (response["data"]) {
            var temp_resp = response["data"].split("'").join('"');
            // console.log("Response is ", temp_resp);
            var response_data = JSON.parse(temp_resp);

            if (response_data["status"] == "failed") {
              console.log(
                "some error occured .... the email address coudl not be found for ",
                sender
              );
              return;
            }
            var Email = response_data["email"];
            console.log("sending email to ", Email);
            var url = URL + "/send";
            var data = {
              email: Email.toString(),
              img1: id_verify + "_" + 0 + ".jpeg",
              img2: id_verify + "_" + 1 + ".jpeg",
              img3: id_verify + "_" + 2 + ".jpeg",
              img4: id_verify + "_" + 3 + ".jpeg",
            };
            try {
              Axios.post(url, data);
            } catch (e) {
              console.log("/send ", Object.keys(e), e.message);
            }
            var time = getTime();
            try {
              Axios.post(
                URL +
                  "/write?name=" +
                  sender +
                  "&ammount=" +
                  ammount +
                  "&time=" +
                  time
              );
            } catch (e) {
              console.log("/write", Object.keys(e), e.message);
            }
          }
        });
      } catch (error) {
        console.log(Object.keys(error), error.message);
      }
    }
  }

  useEffect(() => {
    if (
      id_verify &&
      VerifiedPerson == "" &&
      step != 2 &&
      imageRecognisedArr.length == 4
    ) {
      var sender = id_verify.split("_")[0];
      var res = element_matcher_init(sender);
      if (res) {
        setVerifiedPerson(sender);
        var data = {
          img1: id_verify + "_" + 0 + ".jpeg",
          img2: id_verify + "_" + 1 + ".jpeg",
          img3: id_verify + "_" + 2 + ".jpeg",
          img4: id_verify + "_" + 3 + ".jpeg",
        };
        try {
          Axios.post(URL + "/deleteImages", data);
        } catch (e) {
          console.log("/delete", Object.keys(e), e);
        }
      } else {
        handleFailure();
      }
    }
  }, [imageRecognisedArr]);

  return (
    <div>
      {step == 0 && VerifiedPerson == "" ? (
        <WebCam
          name={id_verify}
          url={URL}
          udpateImageRecognition={udpateImageRecognition}
        />
      ) : (
        ""
      )}

      {VerifiedPerson != "" && step == 1 ? (
        <div className="conf-modal_verification center success">
          <div className="title-icon">
            <img src="http://jimy.co/res/icon-success.jpg" />
          </div>
          <div className="title-text">
            <h1>Success!</h1>
          </div>
          <p>
            You can now proceed to the payment gateway !! Thank you for the
            verification.
          </p>
          <p>The Demo Ends here , Thank you for using it!!</p>
          <br />
          <button
            class="next action-button_verification"
            onClick={() => {
              props.history.push("/");
            }}
          >
            Back
          </button>
        </div>
      ) : (
        ""
      )}

      {VerifiedPerson == "" && step == 2 ? (
        <div className="conf-modal_verification center success">
          <div className="title-icon">
            <img className="failurIcon" src={failIcon} />
          </div>
          <div className="title-text failure">
            <h1>Failure!</h1>
          </div>
          <p>
            Sorry!! Your face could not be matched !! Please contact the bank
            regarding this transaction
          </p>
          <p>The Demo Ends here , Thank you for using it!!</p>
          <br />
          <button
            onClick={() => {
              props.history.push("/");
            }}
            class="next action-button_verification"
          >
            Back
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Verification;
