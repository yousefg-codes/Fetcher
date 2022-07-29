import React, { useState, useEffect } from "react";
import FirebaseFunctions from "../../../config/FirebaseFunctions";
import { useHistory, Link } from "react-router-dom";
import AccountOverview from "../SettingsScreens/AccountOverview";
import {
  FiHome,
  FiBell,
  FiLock,
  FiUnlock,
  FiAlignCenter,
  FiCreditCard,
  FiArrowLeft,
} from "react-icons/fi";
import {
  IoNewspaperOutline,
  IoAppsOutline,
  IoPersonCircleOutline,
} from "react-icons/io5";
import EditAccount from "../SettingsScreens/EditAccount";
import PasswordsScreen from "../SettingsScreens/PasswordsScreen";
import {
  FaHandHoldingUsd,
  FaPercent,
  FaPercentage,
  FaScroll,
} from "react-icons/fa";
import EarningsScreen from "./EarningsScreen";
import TaxesScreen from "./TaxesScreen";
import DiscountsScreen from "./DiscountsScreen";
import PastEarningScreen from "./PastEarningScreen";
const FinancialsScreen = (props) => {
  const [pastEarningProps, setPastEarningProps] = useState({});
  const screenBtns = [
    {
      icon: (
        <FaHandHoldingUsd className="settingsScreenBtnIcon" fontSize="9vh" />
      ),
      text: "Earnings",
      screen: "earnings",
    },
    {
      icon: (
        <div style={{ position: "relative", marginRight: "5%" }}>
          <div
            style={{
              width: "2.5vh",
              position: "absolute",
              height: "2.5vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "3px solid black",
              borderRadius: "1.5vh",
              top: "0",
              right: "0",
              backgroundColor: "white",
            }}
          >
            <FaPercentage size="2.2vh" />
          </div>
          <FaScroll className="settingsScreenBtnIcon" size="9vh" />
        </div>
      ),
      text: "Taxes",
      screen: "taxes",
    },
    // {
    //   icon: <FaPercentage className="settingsScreenBtnIcon" fontSize="6vh" />,
    //   text: "Discounts",
    //   screen: "discounts",
    // },
  ];
  const [screenBtnsComponents, setScreenBtnsComponents] = useState([]);
  const [currScreen, setCurrScreen] = useState("financialsMain");

  const navigateToSettingsScreen = (screenName) => {
    setCurrScreen(screenName);
  };

  useEffect(() => {
    let tempBtnsComponents = [];
    for (let i = 0; i < 2; i += 2) {
      tempBtnsComponents.push(
        <div className="settingsScreenBtnsContainer">
          <button
            onClick={() => {
              navigateToSettingsScreen(screenBtns[i].screen);
            }}
            className="settingsScreenBtn"
          >
            {screenBtns[i].icon}
            {screenBtns[i].text}
          </button>
          {i + 1 < 3 ? (
            <button
              onClick={() => {
                navigateToSettingsScreen(screenBtns[i + 1].screen);
              }}
              className="settingsScreenBtn"
            >
              {screenBtns[i + 1].icon}
              {screenBtns[i + 1].text}
            </button>
          ) : null}
          {/* <button onClick={() => {
                        navigateToSettingsScreen(screenBtns[i+2].screen);
                    }} className="settingsScreenBtn">
                        {screenBtns[i+2].icon}
                        {screenBtns[i+2].text}
                    </button> */}
        </div>
      );
    }
    setScreenBtnsComponents(tempBtnsComponents);
  }, []);

  return (
    <div id="financials" className="page">
      {currScreen !== "financialsMain" ? (
        <button
          onClick={() => {
            if (currScreen === "pastEarning") {
              navigateToSettingsScreen("earnings");
            } else {
              navigateToSettingsScreen("financialsMain");
            }
          }}
          className="settingsBackBtn"
        >
          <FiArrowLeft />
        </button>
      ) : null}
      {currScreen === "pastEarning" ? (
        <PastEarningScreen {...pastEarningProps} />
      ) : null}
      {currScreen === "financialsMain" ? (
        <div className="settingsNavContainer">
          <div className="settingsTitle">Financials</div>
          {screenBtnsComponents}
        </div>
      ) : null}
      {currScreen === "earnings" ? (
        <EarningsScreen
          navigateToPastEarning={(props) => {
            setPastEarningProps(props);
            navigateToSettingsScreen("pastEarning");
          }}
          history={props.history}
          displayedEarnings={props.displayedEarnings}
        />
      ) : null}
      {currScreen === "taxes" ? <TaxesScreen /> : null}
      {currScreen === "discounts" ? <DiscountsScreen /> : null}
    </div>
  );
};
export default FinancialsScreen;
