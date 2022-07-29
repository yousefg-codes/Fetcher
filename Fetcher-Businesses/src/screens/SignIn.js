import React, { useEffect, useState } from "react";
import FirebaseFunctions from "../config/FirebaseFunctions";
import { Redirect } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const SignIn = (props) => {
  const [renderForgotPassword, setRenderForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [canSendForgotPassEmail, setCanSendForgotPassEmail] = useState("");

  useEffect(() => {
    if (forgotPasswordEmail === "") {
      setCanSendForgotPassEmail(false);
    } else {
      setCanSendForgotPassEmail(true);
    }
  }, [forgotPasswordEmail]);

  if (FirebaseFunctions.currentUser !== null) {
    return <Redirect to="/dashboard" />;
  }
  return (
    <div>
      <meta charSet="UTF-8" />
      {/* include only the Firebase features as you need */}
      {/* initialize the SDK after all desired features are loaded */}
      <div
        id="Sign In"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          filter: "brightness(50%)",
          backgroundImage: 'url("../img/Small_Business_Clothing.jpg")',
          display: "flex",
          alignContent: "center",
          justifyContent: "center",
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
        }}
        className="tabPage"
      ></div>
      <div
        id="Sign In div"
        style={{
          backgroundColor: "white",
          width: "23%",
          border: "5px solid #ff993b",
          borderRadius: "10px",
          padding: "8vh",
          height: "50%",
          position: "absolute",
          top: "17.5%",
          left: "33.5%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <img
          id="loginFormLogo"
          style={{ alignSelf: "center", width: "60%" }}
          src="img/Fetcher_Logo.png"
        />
        {!renderForgotPassword ? (
          <div
            id="loginForm"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <h1
              style={{
                alignSelf: "center",
                fontSize: "180%",
              }}
            >
              Businesses Login
            </h1>
            <form
              style={{ display: "flex", flexDirection: "column" }}
              id="SignInForm"
            >
              <h2
                className="commonText"
                style={{
                  color: "black",
                  fontSize: "90%",
                  marginLeft: "0px",
                }}
              >
                Email Address
              </h2>
              <input
                autoComplete="on"
                id="emailInput"
                type="text"
                rows={1}
                style={{
                  borderColor: "black",
                  fontSize: "90%",
                  marginLeft: "0px",
                  width: "calc(100% - 5px)",
                  paddingLeft: "3%",
                  paddingTop: "3%",
                  paddingBottom: "3%",
                }}
                className="textInputs"
              />
              <h2
                className="commonText"
                style={{
                  fontSize: "90%",
                  color: "black",
                  marginLeft: "0px",
                }}
              >
                Password
              </h2>
              <input
                id="passInput"
                autoComplete="on"
                type="password"
                style={{
                  borderColor: "black",
                  marginLeft: "0px",
                  fontSize: "90%",
                  paddingTop: "3%",
                  width: "calc(100% - 5px)",
                  paddingLeft: "3%",
                  paddingBottom: "3%",
                }}
                rows={1}
                className="textInputs"
              />
              <input
                type="submit"
                style={{ width: "40%", height: "18%" }}
                value="Sign In"
                id="SignInBtn"
                onClick={(event) => {
                  event.preventDefault();
                  FirebaseFunctions.signIn(
                    props.history,
                    document.getElementById("emailInput").value,
                    document.getElementById("passInput").value
                  );
                }}
                className="signIn"
              />
            </form>
            <h3
              onClick={() => {
                setRenderForgotPassword(true);
              }}
              className="forgotPassword"
            >
              <b>Forgot Password</b>
            </h3>
            <h4
              style={{
                display: "none",
                alignSelf: "center",
                marginTop: "0.5vh",
                color: "red",
              }}
              id="FailedSignIn"
            >
              Uh Oh, Wrong Username/Password
            </h4>
          </div>
        ) : (
          <div
            id="loginForm"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                alignItems: "center",
              }}
            >
              <button
                onClick={() => {
                  setRenderForgotPassword(false);
                  setCanSendForgotPassEmail(false);
                  setForgotPasswordEmail("");
                }}
                className="backArrowForgotPassword"
              >
                <FaArrowLeft fontSize="200%" />
              </button>
              <h1
                style={{
                  marginLeft: "30px",
                  justifySelf: "center",
                  fontSize: "180%",
                }}
              >
                Forgot Password
              </h1>
            </div>
            <h2
              className="commonText"
              style={{ color: "black", fontSize: "90%", marginLeft: "0px" }}
            >
              Email Address
            </h2>
            <input
              onChange={(event) => {
                setForgotPasswordEmail(event.target.value);
              }}
              autoComplete="on"
              id="forgotPasswordEmailInput"
              type="text"
              rows={1}
              style={{
                borderColor: "black",
                fontSize: "90%",
                marginLeft: "0px",
                width: "calc(100% - 5px)",
                paddingLeft: "3%",
                paddingTop: "3%",
                paddingBottom: "3%",
              }}
              className="textInputs"
            />
            <button
              onClick={() => {
                if (canSendForgotPassEmail) {
                  FirebaseFunctions.sendResetEmail(forgotPasswordEmail).then(
                    () => {
                      setRenderForgotPassword(false);
                      setCanSendForgotPassEmail(false);
                      setForgotPasswordEmail("");
                    }
                  );
                }
              }}
              disabled={!canSendForgotPassEmail}
              style={{ width: "40%", height: "18%" }}
              className="signIn"
            >
              Send
            </button>
            <text
              style={{
                textAlign: "center",
                alignSelf: "center",
                marginTop: "10px",
              }}
            >
              We will send an email for you to change your password
            </text>
          </div>
        )}
        <div
          style={{ justifySelf: "center", alignSelf: "center" }}
          id="loaderLogin"
          className="loaderContainer"
        >
          <svg
            className="loader"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 293.25 222.85"
          >
            <defs>
              <style
                dangerouslySetInnerHTML={{
                  __html: ".cls-1{fill:#f7931e;}.cls-2{fill:none;}",
                }}
              />
            </defs>
            <g id="Layer_2" data-name="Layer 2">
              <g id="Layer_1-2" data-name="Layer 1">
                <path
                  className="cls-1"
                  d="M80.66,24.59H76.35a2.53,2.53,0,0,0-2.53,2.53V78a2.53,2.53,0,0,0,2.53,2.53H91.42A2.53,2.53,0,0,0,94,78V47.25a2.54,2.54,0,0,1,2.53-2.54h22.16a2.54,2.54,0,0,1,2.53,2.54V200.19a2.53,2.53,0,0,1-2.53,2.53H96.48A2.53,2.53,0,0,1,94,200.19V151.43a2.54,2.54,0,0,0-2.53-2.54H31.63a2.54,2.54,0,0,0-2.54,2.54v68.89a2.54,2.54,0,0,0,2.54,2.53H138.77a2.53,2.53,0,0,0,2.53-2.53V27.12a2.53,2.53,0,0,0-2.53-2.53ZM71.29,202.72H51.76a2.54,2.54,0,0,1-2.54-2.53V171.56A2.54,2.54,0,0,1,51.76,169H71.29a2.54,2.54,0,0,1,2.53,2.54v28.63A2.53,2.53,0,0,1,71.29,202.72Z"
                />
                <rect y="175.8" width="20.14" height="20.14" rx="2.53" />
                <rect
                  className="cls-1"
                  x="273.12"
                  y="175.8"
                  width="20.14"
                  height="20.14"
                  rx="2.53"
                />
                <path d="M212.59,24.59h4.31a2.53,2.53,0,0,1,2.53,2.53V78a2.53,2.53,0,0,1-2.53,2.53H201.84A2.54,2.54,0,0,1,199.3,78V47.25a2.54,2.54,0,0,0-2.53-2.54H174.62a2.54,2.54,0,0,0-2.54,2.54V200.19a2.54,2.54,0,0,0,2.54,2.53h22.15a2.53,2.53,0,0,0,2.53-2.53V151.43a2.54,2.54,0,0,1,2.54-2.54h59.79a2.54,2.54,0,0,1,2.53,2.54v68.89a2.53,2.53,0,0,1-2.53,2.53H154.49a2.53,2.53,0,0,1-2.53-2.53V27.12a2.53,2.53,0,0,1,2.53-2.53ZM222,202.72H241.5a2.53,2.53,0,0,0,2.53-2.53V171.56A2.54,2.54,0,0,0,241.5,169H222a2.54,2.54,0,0,0-2.54,2.54v28.63A2.54,2.54,0,0,0,222,202.72Z" />
                <rect x="121.16" width="20.14" height="20.14" rx="2.53" />
                <rect
                  className="cls-1"
                  x="151.96"
                  width="20.14"
                  height="20.14"
                  rx="2.53"
                />
                <line
                  className="cls-2"
                  x1="141.3"
                  y1="24.59"
                  x2="151.96"
                  y2="24.59"
                />
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};
export default SignIn;
