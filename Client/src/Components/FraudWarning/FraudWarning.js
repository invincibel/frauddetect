import React, { useState } from "react";
// import failIcon from "../../images/Deletion_icon.svg.png";
import "./FraudWarning.css";

import { withRouter } from "react-router";

const FraudWarning = (props) => {
  return (
    <div className="conf-modal_warning center success">
      <div className="title-text failure">
        <h1>Suspicious Activity Detected!</h1>
      </div>
      <p>
        We have detected your transaction to be Suspicious and fraudlent !!
        Please verify your face via clicking on Proceed
      </p>
      <p>Click on Cancel to Cancel the transaction</p>
      <br />
      <button
        onClick={() => props.handleCancel()}
        class="next action-button_warning_cancel"
      >
        Cancel
      </button>
      <button
        onClick={() => props.handleNext()}
        class="next action-button_warning_proceed"
      >
        Proceed
      </button>
    </div>
  );
};

export default withRouter(FraudWarning);
