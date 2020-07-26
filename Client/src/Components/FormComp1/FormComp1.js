import React from "react";

const FormComp1 = (props) => {
  return (
    <div>
      <form onSubmit={props.handleNext}>
        <h2 className="fs-title">Type Of Payment</h2>
        <h3 className="fs-subtitle">This is step 1</h3>
        <select>
          <option>Payment</option>
          <option>Cash In</option>
          <option>Cash Out</option>
        </select>
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

export default FormComp1;
