import React, { useState } from "react";
import failIcon from "../../images/Deletion_icon.svg.png";
import "./FailurePayment.css";

const FailurePayment = (props) => {
  return (
    <div className="conf-modal_failure center success">
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
          window.location.reload();
        }}
        class="next action-button_failure"
      >
        Back
      </button>
    </div>
  );
};

export default FailurePayment;
