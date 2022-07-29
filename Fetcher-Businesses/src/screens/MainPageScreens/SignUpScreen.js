import React, { useEffect, useState } from "react";
import FirebaseFunctions from "../../config/FirebaseFunctions";
import { Redirect, Link } from "react-router-dom";
import Geocode from "react-geocode";
import GlobalStateHandler from "../../config/GlobalStateHandler";
import { Dot } from "react-animated-dots";
import PrivacyPolicyHtml from "../../config/PrivacyPolicyHtml";
import TermsOfServiceHtml from "../../config/TermsOfServiceHtml";
import { Alert } from "bootstrap";
import BusinessHoursComponent from "../../components/BusinessHoursComponent";

//Sign Up Input Boxes are the text inputs
//the user interacts with as well as the text
//beneath them explaining what to input
const SignUpInputBox = (props) => {
  const numbers = "1234567890";
  const capitalLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const specialCharacters = [
    '"',
    "!",
    "#",
    "$",
    "%",
    "&",
    "'",
    "(",
    ")",
    "*",
    "+",
    ",",
    "-",
    ".",
    "/",
    ":",
    ";",
    "<",
    "=",
    ">",
    "?",
    "@",
    "[",
    "\\",
    "]",
    "^",
    "_",
    "`",
    "{",
    "|",
    "}",
    "~",
  ];
  const [password, setPassword] = useState("");
  useEffect(() => {
    if (props.isPassInput) {
      setPassword(props.defaultValue);
    }
  }, []);
  useEffect(() => {
    if (!props.signInPass) {
      if (
        props.isPassInput &&
        password.length >= 8 &&
        containsNumber() &&
        containsCapitalLetter() &&
        containsSpecialChar()
      ) {
        props.onPassReady(true);
      } else if (props.isPassInput) {
        props.onPassReady(false);
      }
    } else {
      console.warn("FEWIFJOIFWEJOI");
      if (password.length > 0) {
        console.warn("HUGHGHGUGHGUHHUFHHGUHHG");
        props.onPassReady(true);
      } else {
        console.warn("KLKLKLKKLKLLK");
        props.onPassReady(false);
      }
    }
    console.log(props.signInPass);
  }, [password]);
  const containsNumber = () => {
    for (let i = 0; i < numbers.length; i++) {
      if (password.includes(numbers.substring(i, i + 1))) {
        return true;
      }
    }
    return false;
  };
  const containsCapitalLetter = () => {
    for (let i = 0; i < capitalLetters.length; i++) {
      if (password.includes(capitalLetters.substring(i, i + 1))) {
        return true;
      }
    }
    return false;
  };
  const containsSpecialChar = () => {
    for (let i = 0; i < specialCharacters.length; i++) {
      if (password.includes(specialCharacters[i])) {
        return true;
      }
    }
    return false;
  };
  return (
    <div
      style={props.isPassInput ? { height: "135px", width: "300px" } : {}}
      className="signUpInputBoxContainer"
    >
      <input
        autoComplete="new-password"
        defaultValue={props.defaultValue ? props.defaultValue : ""}
        onChange={(event) => {
          props.onChange(event);
          if (props.isPassInput) {
            setPassword(event.target.value);
          }
        }}
        placeholder={props.placeholder ? props.placeholder : ""}
        type={props.isPassInput ? "password" : "text"}
        className="signUpScreenInputs"
      />
      {props.withoutUnderText ? null : (
        <div className="signUpUnderText">{props.underText}</div>
      )}
      {props.signInPass && props.incorrectPassword ? (
        <div>
          <div
            style={{ color: "red", fontSize: "60%" }}
            className="signUpUnderText"
          >
            Incorrect Password
          </div>
        </div>
      ) : null}
      {props.isPassInput && !props.signInPass ? (
        <div>
          {password.length < 8 ? (
            <div
              style={{ color: "red", fontSize: "60%" }}
              className="signUpUnderText"
            >
              Password Length must be at least 8 characters
            </div>
          ) : null}
          {containsNumber() ? null : (
            <div
              style={{ color: "red", fontSize: "60%" }}
              className="signUpUnderText"
            >
              Password must contain at least one number
            </div>
          )}
          {containsSpecialChar() ? null : (
            <div
              style={{ color: "red", fontSize: "60%" }}
              className="signUpUnderText"
            >
              Password must contain at least one special character
            </div>
          )}
          {containsCapitalLetter() ? null : (
            <div
              style={{ color: "red", fontSize: "60%" }}
              className="signUpUnderText"
            >
              Password must contain at least one capital letter
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

const SignUpScreen = (props) => {
  const [allIsFilled, setAllIsFilled] = useState(false);
  const [currScreen, setCurrScreen] = useState("signUpSectionOne");
  const [ownerFirstName, setOwnerFirstName] = useState("");
  const [ownerLastName, setOwnerLastName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPhoneNumber, setOwnerPhoneNumber] = useState("");
  const [businessCity, setBusinessCity] = useState("");
  const [businessState, setBusinessState] = useState("");
  const [businessStAdd, setBusinessStAdd] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [businessZipCode, setBusinessZipCode] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessPhoneNumber, setBusinessPhoneNumber] = useState("");
  const [computerWithNet, setComputerWithNet] = useState(false);
  const [computerWithBrowser, setComputerWithBrowser] = useState(false);
  const [numEmployees, setNumEmployees] = useState(0);
  const [routingNum, setRoutingNum] = useState("");
  const [accountNum, setAccountNum] = useState("");
  const [understands, setUnderstands] = useState(false);
  const [agrees, setAgrees] = useState(false);
  const [password, setPassword] = useState("");
  const [isAUser, setIsAUser] = useState(false);
  const [passIsReady, setPassIsReady] = useState(false);
  const [understandsPassUsage, setUnderstandsPassUsage] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [imageURL, setImageURL] = useState(null);
  const [incorrectPassword, setIncorrectPassword] = useState(false);
  const [closedDays, setClosedDays] = useState([]);
  const [chosenTimes, setChosenTimes] = useState([]);

  useEffect(() => {
    if (currScreen === "signUpSectionOne") {
      setAllIsFilled(
        ownerFirstName !== "" &&
          ownerLastName !== "" &&
          ownerPhoneNumber !== "" &&
          businessPhoneNumber !== "" &&
          computerWithNet &&
          computerWithBrowser &&
          businessCity !== "" &&
          businessStAdd !== "" &&
          businessState !== "" &&
          businessZipCode !== "" &&
          ownerEmail !== "" &&
          businessType !== "" &&
          businessName !== ""
      );
    } else {
      setAllIsFilled(
        numEmployees > 0 &&
          routingNum !== "" &&
          accountNum !== "" &&
          understands &&
          agrees &&
          imageURL !== null &&
          (passIsReady || understandsPassUsage)
      );
    }
  }, [
    currScreen,
    agrees,
    understands,
    numEmployees,
    computerWithBrowser,
    computerWithNet,
    businessCity,
    ownerEmail,
    businessName,
    routingNum,
    accountNum,
    businessStAdd,
    businessState,
    businessType,
    businessZipCode,
    businessPhoneNumber,
    ownerFirstName,
    ownerLastName,
    ownerPhoneNumber,
    password,
    understandsPassUsage,
    passIsReady,
    imageURL,
  ]);

  const navigate = (screen) => {
    setCurrScreen(screen);
  };

  const submitSignUp = async () => {
    let hashedAccountNum = "";
    let hashedRoutingNum = "";
    hashedAccountNum = await FirebaseFunctions.callFunction("hashNum", {
      number: accountNum,
    });
    hashedRoutingNum = await FirebaseFunctions.callFunction("hashNum", {
      number: routingNum,
    });
    Geocode.setApiKey(GlobalStateHandler.myKey);
    Geocode.setLanguage("en");
    let location = null;
    await Geocode.fromAddress(
      businessStAdd +
        ", " +
        businessCity +
        ", " +
        businessState +
        ", " +
        businessZipCode +
        ", USA"
    ).then((response) => {
      location = response.results[0].geometry.location;
    });
    const businessObj = {
      ownerName: ownerFirstName + " " + ownerLastName,
      ownerPhoneNumber,
      ownerEmail,
      businessPhoneNumber,
      businessName,
      closedDays,
      businessHours: chosenTimes,
      isOpen: true,
      lastEarningsIndex: 0,
      lastOrderIndex: 0,
      numProducts: 0,
      verified: false,
      businessType,
      routingNum: hashedRoutingNum,
      accountNum: hashedAccountNum,
      incomingOrders: [],
      taxes: { localTaxes: [], stateTaxes: [] },
    };
    const businessLocationObj = {
      businessLocation:
        businessStAdd +
        ", " +
        businessCity +
        ", " +
        businessState +
        ", " +
        businessZipCode +
        ", USA",
      businessName,
      latitude: location.lat,
      longitude: location.lng,
    };
    await FirebaseFunctions.signUpBusiness(
      businessObj,
      businessLocationObj,
      numEmployees,
      imageURL,
      password,
      () => {
        props.history.push("/dashboard");
      },
      isAUser
    ).catch((error) => {
      setIsSigningUp(false);
      if (isAUser) {
        alert("Incorrect Password or there was an error signing you up.");
        setIncorrectPassword(true);
      } else {
        alert(
          "There was an error signing you up, double check you information."
        );
      }
    });
  };
  useEffect(() => {
    const { state } = props.location;
    if (state) {
      setOwnerFirstName(state.firstName);
      setOwnerLastName(state.lastName);
      setOwnerEmail(state.email);
      setOwnerPhoneNumber(state.phoneNumber);
      setBusinessName(state.businessName);
      setBusinessStAdd(state.businessStreetAddress);
      setBusinessZipCode(state.businessZipCode);
      setBusinessState(state.businessState);
      setBusinessCity(state.businessCity);
    }
  }, []);

  //The Sign up screen contains two forms
  //one displays first, and the other after the initial one
  //is filled, and the user continues
  if (FirebaseFunctions.currentUser !== null) {
    return <Redirect to="/" />;
  }
  return (
    <div className="signUpScreenContainer">
      <div
        style={{
          display: "flex",
          flex: "1",
          paddingBottom: "5vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="signUpForm tabPageBlob"
          style={currScreen === "signUpSectionTwo" ? { height: "307vh" } : {}}
        >
          {currScreen === "signUpSectionTwo" ? (
            <button
              onClick={() => {
                setCurrScreen("signUpSectionOne");
              }}
              style={{
                width: "4vw",
                height: "4vw",
                alignSelf: "flex-start",
                borderRadius: "25px",
                marginBottom: "8px",
              }}
              className="signUpBtns"
            >
              <i className="fa fa-arrow-left" style={{ fontSize: "1.5vw" }} />
            </button>
          ) : null}
          Sign Up
          <div className="signUpImportantNoticeText">
            *All the information below is required*
          </div>
          {currScreen === "signUpSectionOne" ? (
            <div id="signUpSectionOne" className="signUpSection">
              <div className="signUpInfoDiv">
                Business Owner Name
                <div className="signUpHorizontalInputs">
                  <SignUpInputBox
                    defaultValue={ownerFirstName}
                    onChange={(event) => {
                      setOwnerFirstName(event.target.value);
                    }}
                    underText="Firstname"
                  />
                  <SignUpInputBox
                    defaultValue={ownerLastName}
                    onChange={(event) => {
                      setOwnerLastName(event.target.value);
                    }}
                    underText="Lastname"
                  />
                </div>
              </div>
              <div className="signUpInfoDiv">
                Business Owner's Email
                <SignUpInputBox
                  defaultValue={ownerEmail}
                  onChange={(event) => {
                    setOwnerEmail(event.target.value);
                  }}
                  placeholder="example@domain.com"
                />
              </div>
              <div className="signUpInfoDiv">
                Business Owner's Phone Number
                <SignUpInputBox
                  defaultValue={ownerPhoneNumber}
                  onChange={(event) => {
                    setOwnerPhoneNumber(event.target.value);
                  }}
                  placeholder="(000) 000-0000"
                />
              </div>
              <div className="signUpInfoDiv">
                Business Name
                <SignUpInputBox
                  defaultValue={businessName}
                  onChange={(event) => {
                    setBusinessName(event.target.value);
                  }}
                  withoutUnderText
                />
              </div>
              <div className="signUpInfoDiv">
                Business Address
                <div className="signUpImportantNoticeText">
                  *We currently only support one business address*
                </div>
                <div className="signUpImportantNoticeText">
                  *We currently only support businesses in the USA*
                </div>
                <div>
                  <div className="signUpHorizontalInputs">
                    <SignUpInputBox
                      defaultValue={businessStAdd}
                      onChange={(event) => {
                        setBusinessStAdd(event.target.value);
                      }}
                      underText="Street Address"
                    />
                    <SignUpInputBox
                      defaultValue={businessCity}
                      onChange={(event) => {
                        setBusinessCity(event.target.value);
                      }}
                      underText="City"
                    />
                  </div>
                  <div className="signUpHorizontalInputs">
                    <SignUpInputBox
                      defaultValue={businessState}
                      onChange={(event) => {
                        setBusinessState(event.target.value);
                      }}
                      underText="State"
                    />
                    <SignUpInputBox
                      defaultValue={businessZipCode}
                      onChange={(event) => {
                        setBusinessZipCode(event.target.value);
                      }}
                      underText="Zip Code"
                    />
                  </div>
                  <SignUpInputBox
                    defaultValue={businessPhoneNumber}
                    onChange={(event) => {
                      setBusinessPhoneNumber(event.target.value);
                    }}
                    underText="Location's Phone Number"
                    placeholder="(000) 000-0000"
                  />
                </div>
              </div>
              <div className="signUpInfoDiv">
                Business Type
                <SignUpInputBox
                  defaultValue={businessType}
                  onChange={(event) => {
                    setBusinessType(event.target.value);
                  }}
                  underText="Ex. Restaurant, Retail Store, etc."
                />
              </div>
              <div className="signUpInfoDiv">
                Does your location have a Personal Computer/Laptop with access
                to the internet?
                <div className="signUpImportantNoticeText">
                  *This location MUST have a PC/Laptop with access to the
                  internet otherwise you cannot sign up*
                </div>
                <div className="signUpYesNoContainer">
                  <div className="signUpCheckBoxContainer">
                    <input
                      defaultChecked={computerWithNet}
                      onChange={(event) => {
                        setComputerWithNet(event.target.checked);
                      }}
                      className="signUpCheckBox"
                      type="checkbox"
                    />
                    Yes
                  </div>
                  {/* <div className="signUpCheckBoxContainer">
                                    <input onChange={(event) => {setComputerWithNet(event.target.value )}} className="signUpCheckBox" type="checkbox"/>
                                    No
                                </div> */}
                </div>
              </div>
              <div className="signUpInfoDiv">
                Does your Personal Computer/Laptop have access to an internet
                browser?
                <div className="signUpUnderText">
                  Internet Browser Examples: Google Chrome, Safari, FireFox,
                  etc.
                </div>
                <div className="signUpImportantNoticeText">
                  *This location's PC/Laptop MUST have access to an internet
                  browser otherwise you cannot sign up*
                </div>
                <div className="signUpYesNoContainer">
                  <div className="signUpCheckBoxContainer">
                    <input
                      defaultChecked={computerWithBrowser}
                      onChange={(event) => {
                        setComputerWithBrowser(event.target.checked);
                      }}
                      className="signUpCheckBox"
                      type="checkbox"
                    />
                    Yes
                  </div>
                  {/* <div className="signUpCheckBoxContainer">
                                    <input onChange={(event) => {setComputerWithBrowser(event.target.value)}} className="signUpCheckBox" type="checkbox"/>
                                    No
                                </div> */}
                </div>
              </div>
              <button
                disabled={!allIsFilled}
                onClick={async () => {
                  setIsSigningUp(true);
                  if (allIsFilled) {
                    let response = await FirebaseFunctions.callFunction(
                      "checkIfUserExists",
                      { email: ownerEmail }
                    );
                    if (response.exists) {
                      console.warn("WHAAATTTT");
                      console.warn(response);
                      setIsAUser(true);
                      alert(
                        "It appears you are already a user on other Fetcher Application(s), so you will be using the same password"
                      );
                    }
                    navigate("signUpSectionTwo");
                  }
                  setIsSigningUp(false);
                }}
                className="signUpBtns"
              >
                {isSigningUp ? (
                  <div
                    style={{
                      color: "white",

                      fontSize: "34px",
                      marginBottom: "10px",
                    }}
                  >
                    <Dot>.</Dot>
                    <Dot>.</Dot>
                    <Dot>.</Dot>
                  </div>
                ) : (
                  <div
                    style={{
                      flexDirection: "row",
                      display: "flex",
                      width: "100%",
                      height: "100%",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                    }}
                  >
                    Continue
                    <i className="fa fa-arrow-right fa-x" />
                  </div>
                )}
              </button>
            </div>
          ) : null}
          {currScreen === "signUpSectionTwo" ? (
            <div id="signUpSectionTwo" className="signUpSection">
              <div className="signUpInfoDiv">
                Number of employees
                <div className="signUpUnderText">
                  Type in the approximate number of employees that work at this
                  location on a business day
                </div>
                <div>
                  <SignUpInputBox
                    defaultValue={numEmployees}
                    onChange={(event) => {
                      setNumEmployees(event.target.value);
                    }}
                    withoutUnderText
                  />
                </div>
              </div>
              <div className="signUpInfoDiv">
                Upload Business Logo
                <input
                  style={{
                    width: "20%",
                    marginBottom: "25px",
                    marginTop: "5px",
                  }}
                  onChange={(event) => {
                    if (event.target.files[0]) {
                      var reader = new FileReader();
                      reader.onload = (e) => {
                        setImageURL(e.target.result);
                      };
                      reader.readAsDataURL(event.target.files[0]);
                    }
                  }}
                  type="file"
                  accept="image/*"
                />
              </div>
              <div className="signUpInfoDiv">
                Business Bank Account
                <div className="signUpHorizontalInputs">
                  <SignUpInputBox
                    defaultValue={routingNum}
                    onChange={(event) => {
                      setRoutingNum(event.target.value);
                    }}
                    underText="Routing Number"
                  />
                  <SignUpInputBox
                    defaultValue={accountNum}
                    onChange={(event) => {
                      setAccountNum(event.target.value);
                    }}
                    underText="Account Number"
                  />
                </div>
              </div>
              <div
                className="signUpInfoDiv"
                style={{ height: "60vh", overflowY: "scroll" }}
              >
                <BusinessHoursComponent
                  setChosenTimes={setChosenTimes.bind(this)}
                  setClosedDays={setClosedDays.bind(this)}
                />
              </div>
              {isAUser ? (
                <div className="signUpInfoDiv">
                  Type in your other Fetcher Application's password
                  <div className="signUpImportantNoticeText">
                    *NONE of your employees can know your password*
                  </div>
                  <SignUpInputBox
                    signInPass
                    incorrectPassword={incorrectPassword}
                    defaultValue={password}
                    onPassReady={(state) => {
                      setPassIsReady(state);
                    }}
                    isPassInput
                    onChange={(event) => {
                      setPassword(event.target.value);
                    }}
                    withoutUnderText
                  />
                </div>
              ) : (
                <div className="signUpInfoDiv">
                  Password
                  <div className="signUpImportantNoticeText">
                    *NONE of your employees can know your password*
                  </div>
                  <SignUpInputBox
                    defaultValue={password}
                    onPassReady={(state) => {
                      setPassIsReady(state);
                    }}
                    isPassInput
                    onChange={(event) => {
                      setPassword(event.target.value);
                    }}
                    withoutUnderText
                  />
                </div>
              )}
              <div className="signUpInfoDiv">
                By becoming a Fetcher business, your employees are required to
                gather the requested products and bag/prepare/package them for
                the driver when they arrive. In order to know what the next
                order is you must keep the Fetcher website open on a Personal
                Computer/Laptop that has access to the internet at your business
                location and be signed in on the website. Make sure your
                device’s volume is maximized, so your employees know when there
                is a new order, and make sure you are on the Incoming Orders
                Screen.
                <div className="signUpYesNoContainer">
                  <div className="signUpCheckBoxContainer">
                    <input
                      defaultChecked={understands}
                      onChange={(event) => {
                        setUnderstands(event.target.checked);
                      }}
                      className="signUpCheckBox"
                      type="checkbox"
                    />
                    I Understand & Agree
                  </div>
                </div>
              </div>
              <div className="signUpInfoDiv">
                By becoming a Fetcher business you are also agreeing to the
                <strong>Privacy Policy</strong>
                <PrivacyPolicyHtml
                  style={{
                    marginTop: "1vh",
                    width: "90%",
                    height: "50vh",
                    overflowY: "scroll",
                  }}
                />
                as well as the
                <strong>Terms of Service</strong>
                <TermsOfServiceHtml
                  style={{
                    marginTop: "1vh",
                    width: "90%",
                    height: "50vh",
                    overflowY: "scroll",
                  }}
                />
                <div className="signUpYesNoContainer">
                  <div className="signUpCheckBoxContainer">
                    <input
                      defaultChecked={agrees}
                      onChange={(event) => {
                        setAgrees(event.target.checked);
                      }}
                      className="signUpCheckBox"
                      type="checkbox"
                    />
                    I Understand & Agree to both the Privacy Policy and Terms of
                    Service
                  </div>
                </div>
              </div>
              <button
                onClick={async () => {
                  setIsSigningUp(true);
                  await submitSignUp();
                }}
                disabled={!allIsFilled}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
                className="signUpBtns"
              >
                {isSigningUp ? (
                  <div
                    style={{
                      color: "white",
                      fontSize: "34px",
                      marginBottom: "10px",
                    }}
                  >
                    <Dot>.</Dot>
                    <Dot>.</Dot>
                    <Dot>.</Dot>
                  </div>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
export default SignUpScreen;
