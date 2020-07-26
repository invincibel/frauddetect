import React from "react";
import "./CardSetupForm.css";
const CardSetupForm = (props) => {
  return (
    <div>
      <form onSubmit={props.handleNext}>
        <h3 className="CardSetupForm_fs_title">
          Let's set your card Up for the demo
        </h3>
        <input
          type="text"
          name="card_no"
          placeholder="Enter your card number"
          required
        />
        <h4 className="CardSetupForm_fs_subtitle">
          This is just a demo , so enter any random card number.
        </h4>
        <br />
        <input
          type="text"
          name="email_add"
          placeholder="Enter your email address"
          required
        />
        <h4 className="CardSetupForm_fs_subtitle">
          In case of fraud,this email address gets notification.
        </h4>
        <br />

        <input
          type="submit"
          name="next"
          class="next action-button"
          value="Next"
        />
        <button onClick={props.skipRegister} class="next action-button">
          Skip
        </button>
      </form>
    </div>
  );
};

export default CardSetupForm;
