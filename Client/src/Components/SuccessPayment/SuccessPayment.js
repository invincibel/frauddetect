import React, { useState } from "react";
import "./SuccessPayment.css";
const SuccessPayment = (props) => {
  return (
    <div className="conf-modal_success center success">
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
        class="next action-button_success"
        onClick={() => {
          window.location.reload();
        }}
      >
        Back
      </button>
    </div>
  );
};

export default SuccessPayment;
