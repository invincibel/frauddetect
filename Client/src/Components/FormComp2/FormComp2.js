import React from "react";

const FormComp2 = (props) => {
  return (
    <div>
      <form onSubmit={props.handleNext}>
        <h2 className="fs-title">Payment Details</h2>
        <h3 className="fs-subtitle">This is step 2</h3>
        <input
          type="text"
          placeholder="Account Number of the receiver"
          required
        ></input>
        <input
          type="text"
          placeholder="Ammount to be transferred in INR"
          required
        ></input>

        <br />
        <input
          type="submit"
          name="next"
          class="next action-button"
          value="Next"
        />
      </form>
    </div>
  );
};

export default FormComp2;
