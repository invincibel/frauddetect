import React, { useState, useEffect } from "react";
import UserInfoTable from "../../UserInfoTable/UserInfoTable.js";
import "./UserInfoParent.css";
import Axios from "axios";

const UserInfoParent = (props) => {
  const [cardNumber, setCardNumber] = useState("");
  const [card_data, setCardData] = useState([]);
  console.log(card_data);

  function handleUserInforForm(e) {
    e.preventDefault();

    var card = e.target[0].value;
    card = card.trim().replace(/\s/g, "");
    setCardNumber(card);
  }

  async function fetchUserInfo() {
    try {
      var r = await Axios.get(props.url + "/analytic/user?name=" + cardNumber);
      console.log(r);
      var data = r["data"];
      var data_array = [];
      Object.keys(data).forEach((key) => {
        var src = data[key][0];
        var ammount = data[key][1];
        var time = data[key][2];
        data_array.push({ src, ammount, time });
      });
      if (data_array.length == 0) {
        var src = "No Data";
        var ammount = "No Data";
        var time = "No Data";
        data_array.push({ src, ammount, time });
      }
      setCardData(data_array);
    } catch (e) {
      console.log("/analytic/user ", Object.keys(e), e.message);
    }
  }

  useEffect(() => {
    if (cardNumber != "" && card_data.length == 0) {
      fetchUserInfo();
    }
  }, [cardNumber]);
  return (
    <div className="userInfoParent_outer">
      <span className="information_div">
        Suspected Fraud attempts by card number {cardNumber}
      </span>
      <br />
      {!cardNumber ? (
        <div className="userInfoForm_div">
          <form onSubmit={handleUserInforForm}>
            <input
              type="text"
              class="userInforForm_text"
              placeholder="Enter user card number"
            />
            <br />
            <input type="submit" class="userInfoForm_submit" />
          </form>
        </div>
      ) : (
        <div className="userInfoTable_outer">
          <UserInfoTable cardData={card_data} />
        </div>
      )}
    </div>
  );
};

export default UserInfoParent;
