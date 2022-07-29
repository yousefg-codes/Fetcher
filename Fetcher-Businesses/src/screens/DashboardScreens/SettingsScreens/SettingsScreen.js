import React, { useState, useEffect } from "react";
import FirebaseFunctions from "../../../config/FirebaseFunctions";
import { useHistory, Link } from "react-router-dom";
import AccountOverview from "./AccountOverview";
import {
  FiHome,
  FiBell,
  FiLock,
  FiUnlock,
  FiAlignCenter,
  FiCreditCard,
  FiArrowLeft,
  FiClock,
} from "react-icons/fi";
import {
  IoNewspaperOutline,
  IoAppsOutline,
  IoPersonCircleOutline,
} from "react-icons/io5";
import EditAccount from "./EditAccount";
import PasswordsScreen from "./PasswordsScreen";
import BusinessHoursScreen from "./BusinessHoursScreen";
const SettingsScreen = (props) => {
  const screenBtns = [
    {
      icon: <FiHome className="settingsScreenBtnIcon" fontSize="300%" />,
      text: "Account Overview",
      screen: "accOverview",
    },
    {
      icon: (
        <IoPersonCircleOutline
          className="settingsScreenBtnIcon"
          fontSize="300%"
        />
      ),
      text: "Edit Account",
      screen: "editAcc",
    },
    {
      icon: <FiUnlock className="settingsScreenBtnIcon" fontSize="300%" />,
      text: "Passwords",
      screen: "changePass",
    },
    {
      icon: <FiClock className="settingsScreenBtnIcon" fontSize="300%" />,
      text: "Business Hours",
      screen: "businessHours",
    },
    // {
    //     icon: <FiBell className="settingsScreenBtnIcon" fontSize='300%'/>,
    //     text: 'Notifications',
    // },
    // {
    //     icon: <FiCreditCard className="settingsScreenBtnIcon" fontSize='300%'/>,
    //     text: 'Payments',
    // },
    {
      icon: <FiAlignCenter className="settingsScreenBtnIcon" fontSize="300%" />,
      text: "Terms and Policies",
      screen: "termsPolicies",
    },
  ];
  const [screenBtnsComponents, setScreenBtnsComponents] = useState([]);
  const [currScreen, setCurrScreen] = useState("settingsMain");

  const navigateToSettingsScreen = (screenName) => {
    setCurrScreen(screenName);
  };

  useEffect(() => {
    let tempBtnsComponents = [];
    for (let i = 0; i < 4; i += i === 0 ? 3 : 2) {
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
          <button
            onClick={() => {
              navigateToSettingsScreen(screenBtns[i + 1].screen);
            }}
            className="settingsScreenBtn"
          >
            {screenBtns[i + 1].icon}
            {screenBtns[i + 1].text}
          </button>
          {i === 0 ? (
            <button
              onClick={() => {
                navigateToSettingsScreen(screenBtns[i + 2].screen);
              }}
              className="settingsScreenBtn"
            >
              {screenBtns[i + 2].icon}
              {screenBtns[i + 2].text}
            </button>
          ) : null}
        </div>
      );
    }
    setScreenBtnsComponents(tempBtnsComponents);
  }, []);

  return (
    <div id="settings" className="page">
      {currScreen !== "settingsMain" ? (
        <button
          onClick={() => {
            navigateToSettingsScreen("settingsMain");
          }}
          className="settingsBackBtn"
        >
          <FiArrowLeft />
        </button>
      ) : null}
      {currScreen === "settingsMain" ? (
        <div className="settingsNavContainer">
          <div className="settingsTitle">Settings</div>
          {screenBtnsComponents}
        </div>
      ) : null}
      {currScreen === "accOverview" ? (
        <AccountOverview
          history={props.history}
          onEdit={() => {
            navigateToSettingsScreen("editAcc");
          }}
          imageURL={props.imageURL}
        />
      ) : null}
      {currScreen === "businessHours" ? <BusinessHoursScreen /> : null}
      {currScreen === "editAcc" ? (
        <EditAccount
          navigateBack={() => {
            navigateToSettingsScreen("settingsMain");
          }}
          switchToOverview={() => {
            navigateToSettingsScreen("accOverview");
          }}
          onImageChange={(imageURL) => {
            props.onImageChange(imageURL);
          }}
          imageURL={props.imageURL}
        />
      ) : null}
      {currScreen === "changePass" ? <PasswordsScreen /> : null}
      {currScreen === "termsPolicies" ? (
        <div
          id="termsPolicies"
          style={{
            width: "100%",
            height: "100%",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
          className="settingsScreens"
        >
          <Link to="termsofservice" className="termsAndPoliciesNavButtons">
            Terms of Service
          </Link>
          <Link to="/privacypolicy" className="termsAndPoliciesNavButtons">
            Privacy Policy
          </Link>
        </div>
      ) : null}
    </div>
  );
};
export default SettingsScreen;
