import React, { useState } from "react";
import CardSetupForm from "../CardSetupForm/CardSetupForm.js";
import FormComp2 from "../FormComp2/FormComp2.js";
import PaymentBox from "../PaymentBox/PaymentBox.js";
import CardSetupWebcam from "../CardSetupWebcam/CardSetupWebcam.js";
import SuccesPayment from "../SuccessPayment/SuccessPayment.js";
import FailurePayment from "../FailurePayment/FailurePayment.js";
import FraudWarning from "../FraudWarning/FraudWarning.js";
import "./DemoMain.css";
import Axios from "axios";

const DemoMain = (props) => {
  //0 -> DemoPage1 .....1->ImageDetails......2->PaymentDetails.......3->PaymentForm
  const [active_tab, setActiveTab] = useState(0);
  const [cardDetails, setCardDetails] = useState({
    card_no: "",
    email: "",
  });
  const [paymentDetails, setPaymentDetails] = useState({
    DestAcc: "",
    Amount: 0,
  });
  const [infoVerified, setInfoVerified] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(0);
  const [senderDestId, setSenderDestId] = useState("");
  //##TESTING##
  // console.log("Active tab is", active_tab);

  function handleForm2(e) {
    e.preventDefault();
    var destAcc = e.target[0].value.trim().replace(/\s/g, "");
    var amt = e.target[1].value;
    if (amt <= 0) {
      alert("Please enter a possitive value ammount");
      return;
    }
    setPaymentDetails({
      DestAcc: destAcc,
      Amount: amt,
    });
    // console.log(paymentDetails);
    setActiveTab(3);
  }

  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  async function ExistsSenderAlready(card_no) {
    try {
      var response = await Axios.get(props.url + "/isexists?name=" + card_no);
      if (response["data"]) {
        var temp_resp = response["data"].split("'").join('"');
        // console.log("Response is ", temp_resp);
        var response_data = JSON.parse(temp_resp);
        if (response_data["email"] != "none") {
          return true;
        } else {
          return false;
        }
      } else {
        alert("Server error !!");
      }
    } catch (e) {
      console.log("/isexists", Object.keys(e), e.message);
      alert("Server error !!");
    }
  }

  async function handleCardSetupForm(e) {
    e.preventDefault();
    var card_no = e.target[0].value.trim().replace(/\s/g, "");
    var email = e.target[1].value;
    try {
      var a = await ExistsSenderAlready(card_no);
      if (a == true) {
        alert(
          "Sorry !!  This Card Number already exists , please choose another one for demo !!"
        );
        return;
      } else if (a == false) {
        if (validateEmail(email)) {
          setCardDetails({
            card_no: card_no,
            email: email,
          });
          // console.log(card_no, email);
          setActiveTab(1);
        } else {
          alert("Enter Valid Email Address");
          return;
        }
      }
    } catch (e) {
      console.log(Object.keys(e), e.message);
    }
  }

  function handleWebcamData() {
    setActiveTab(2);
  }

  async function handleWebCamImages(image_arr) {
    try {
      if (image_arr.length == 3) {
        var data = {
          base64image: image_arr[0],
          base64image1: image_arr[1],
          base64image2: image_arr[2],
          card: cardDetails.card_no,
          email: cardDetails.email,
        };
        // console.log("Posting in ", props.url + "/upload/setup");
        var r = await Axios.post(props.url + "/upload/setup", data);
        if (r && r.hasOwnProperty("status")) {
          if (r["status"] == "failed") {
            alert("OOPS!! Some Error Occurred !");
            setActiveTab(0);
            return;
          } else if (r["status"] == "failed_already_exists") {
            alert("This card number already exists , please select another !!");
            setActiveTab(0);
            return;
          }
        }
        //##TEsting Important
        // console.log("The resp webcam", r, data);
      }
    } catch (e) {
      console.log("/upload/setup ", Object.keys(e), e.message);
    }
  }

  function skipRegister() {
    setActiveTab(2);
  }

  function handleFraudWarningNext() {
    if (senderDestId) {
      props.history.push(`/validate/${senderDestId}/${paymentDetails.Amount}`);
    }
  }

  function handleFraudWarningCancel() {
    setPaymentSuccess(2);
  }

  function isExpirationDateOk(expiration_date) {
    var splited_date = expiration_date.split("/");
    var ok = false;
    if (splited_date.length != 2) {
      alert("Please Enter Expiration Date in MM / YY format !");
      return false;
    }
    var month = parseInt(splited_date[0]);
    var year = 2000 + parseInt(splited_date[1]);
    if (month < 1 || month > 12) {
      alert("Please check your Expiration month !");
      return false;
    }
    var date_future = new Date(year, month, 1);
    var date_now = new Date();
    if (date_now > date_future) {
      alert("Your card has expired !!");
      return false;
    }

    return true;
  }
  async function onPaymentSubmission(e) {
    e.preventDefault();
    var expiration_date = e.target[1].value;
    var sender_account = e.target[0].value.trim().replace(/\s/g, "");
    var cvv = e.target[2].value;
    try {
      ExistsSenderAlready(sender_account).then((result) => {
        if (!result) {
          alert(
            "OOPS !! NO such card number exists in our database , Please set yourself up for the demo First !!"
          );
          return;
        }

        var check_expiration_date = isExpirationDateOk(expiration_date);
        if (!check_expiration_date) return;

        var id = sender_account + "_" + paymentDetails.DestAcc;

        var url =
          props.url +
          "/getFraud?src=" +
          sender_account +
          "&des=" +
          paymentDetails.DestAcc +
          "&ammount=" +
          paymentDetails.Amount;
        // console.log(url);
        try {
          Axios.get(url).then((res) => {
            // console.log("result is ", res);
            if (res) {
              setSenderDestId(id);
            } else {
              setPaymentSuccess(1);
            }
          });
        } catch (e) {
          console.log("/getFraud", Object.keys(e), e.message);
          alert("Server Error !!");
        }
      });
    } catch (e) {
      console.log("/getFraud or /exists", Object.keys(e), e.message);
    }
  }

  return (
    <div className="DemoMain_outer">
      {active_tab <= 2 ? (
        <div className="info_extract_box">
          <form id="msform">
            <ul id="progressbar">
              <li className={active_tab == 0 ? "active" : "inactive"}>
                Demo Setup
              </li>
              <li className={active_tab == 1 ? "active" : "inactive"}>
                Image Setup
              </li>
              <li className={active_tab == 2 ? "active" : "inactive"}>
                Payment Details
              </li>
            </ul>
            {active_tab == 0 ? (
              <fieldset>
                <CardSetupForm
                  skipRegister={skipRegister}
                  handleNext={handleCardSetupForm}
                />
              </fieldset>
            ) : (
              ""
            )}
            {active_tab == 1 && !infoVerified ? (
              <fieldset className="_unverified">
                <CardSetupWebcam
                  handleWebCamImages={handleWebCamImages}
                  handleNext={handleWebcamData}
                />
              </fieldset>
            ) : (
              ""
            )}

            {active_tab == 2 ? (
              <fieldset>
                <FormComp2 handleNext={handleForm2} />
              </fieldset>
            ) : (
              ""
            )}
          </form>
        </div>
      ) : (
        <div className="payment_form">
          {paymentSuccess == 0 && senderDestId == "" ? (
            <PaymentBox
              onPaymentSubmission={onPaymentSubmission}
              paymentDetails={paymentDetails}
            />
          ) : (
            <SuccesPayment />
          )}
          {paymentSuccess == 1 && senderDestId == "" ? <SuccesPayment /> : ""}

          {senderDestId != "" && paymentSuccess == 0 ? (
            <fieldset>
              <FraudWarning
                handleNext={handleFraudWarningNext}
                handleCancel={handleFraudWarningCancel}
              ></FraudWarning>
            </fieldset>
          ) : (
            ""
          )}

          {paymentSuccess == 2 ? (
            <FailurePayment history={props.history} />
          ) : (
            ""
          )}
        </div>
      )}

      {active_tab == 0 ? (
        <button
          onClick={() => {
            props.history.push("/analytics");
          }}
          class="next action-button_analytics"
        >
          Visit Analytics Portal
        </button>
      ) : (
        ""
      )}
    </div>
  );
};

export default DemoMain;
