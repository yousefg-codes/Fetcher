import React, { useEffect, useState, useRef } from "react";
import navigate from "../config/tabNavigation";
import FirebaseFunctions from "../config/FirebaseFunctions";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

const NotFoundPage = (props) => {
  const [currScreen, setCurrScreen] = useState("home");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [canEmail, setCanEmail] = useState("");
  const [slideIndex, setSlideIndex] = useState(0);
  const timeoutID = useRef(null);

  useEffect(() => {
    if (timeoutID.current) {
      clearTimeout(timeoutID.current);
    }
    timeoutID.current = setTimeout(() => {
      setSlideIndex((prevIndex) => {
        console.warn(prevIndex);
        return prevIndex === 2 ? 0 : prevIndex + 1;
      });
    }, 8000);
    // console.log(slideIndex);
  }, [slideIndex]);
  return (
    <div style={{ overflowY: "scroll", height: "100vh", position: "relative" }}>
      <meta charSet="UTF-8" />
      {/* include only the Firebase features as you need */}
      {/* initialize the SDK after all desired features are loaded */}
      <div id="topBar" className="tabNavigator">
        <div
          className="imageContainer tabPageBlob"
          style={{ boxShadow: "none" }}
          onClick={(event) => setCurrScreen("home")}
        >
          <div className="img">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 293.25 222.85">
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
        <div className="menuContainer">
          <div className="menuButtonsContainer">
            {/* <button onClick={(event) => navigate(event, 'Resources')} className="tabButtons">Resources</button> */}
            {/* <button onClick={(event) => navigate(event, 'More')} className="tabButtons">More</button> */}
            <button
              onClick={(event) => setCurrScreen("home")}
              className="tabButtons"
            >
              Customers
            </button>
            <button
              onClick={(event) => setCurrScreen("aboutUs")}
              className="tabButtons"
            >
              Drivers
            </button>
            {FirebaseFunctions.currentUser !== null ? (
              <Link style={{ textDecoration: "none" }} to="/dashboard">
                <button className="logInBtn toDashboard">
                  Dashboard
                  <i className="fa fa-arrow-right toDashboardChildren"></i>
                </button>
              </Link>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Link to="/signin">
                  <button style={{ height: "100%" }} className="logInBtn">
                    Business Sign In
                  </button>
                </Link>
                <Link style={{ textDecoration: "none" }} to="/signup">
                  <button style={{ height: "100%" }} className="logInBtn">
                    Business Sign Up
                  </button>
                </Link>
              </div>
            )}
            {/* <button onClick={(event) => navigate(event, 'Sign Up')} className="logInBtn">Sign Up</button> */}
          </div>
        </div>
      </div>
      <div id="Sign Up" className="tabPage">
        <div
          className="homePageSectionOne"
          style={{
            backgroundImage: "linear-gradient(180deg, #ff993b 100%, #fff 0%)",
          }}
        >
          <div
            style={{
              color: "#fff",
              width: "120vh",
              fontSize: "6vh",
              marginTop: "15vh",
              marginLeft: "10vh",
              fontFamily: "CooperBT",
            }}
          >
            Uh Oh! <br />
            <div
              style={{
                color: "#fff",
                fontFamily: "Dosis",
                fontSize: "4vh",
              }}
            >
              It doesn't look like this link exists{" "}
            </div>
          </div>
        </div>
        <div className="homePageSectionTwo"></div>
        <div id="bigCanvas" className="homePageSectionThree">
          <div className="socialMediaParent">
            <div className="socialMediaLinksParent">
              <a
                href="https://www.facebook.com/fetchertechnologies"
                className="socialMediaLink"
              >
                <FaFacebook className="socialMediaImgs" />
              </a>
              <a
                href="https://www.instagram.com/fetcher_technologies/"
                className="socialMediaLink"
              >
                <FaInstagram className="socialMediaImgs" />
              </a>
              <a
                href="https://www.youtube.com/channel/UCkBWaRME0CjooAwaIfHeGcg"
                className="socialMediaLink"
              >
                <FaYoutube className="socialMediaImgs" />
              </a>
              <a
                href="https://twitter.com/FetcherT"
                className="socialMediaLink"
              >
                <FaTwitter className="socialMediaImgs" />
              </a>
              <a
                href="https://www.linkedin.com/company/fetcher-technologies"
                className="socialMediaLink"
              >
                <FaLinkedinIn className="socialMediaImgs" />
              </a>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              position: "relative",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <div className="appDownloadDiv aboutUsAppDownload">
              Customers
              <a className="clickableLink">
                <img className="androidStoreImgs" src="img/Android_Store.png" />
              </a>
              <a className="clickableLink">
                <img className="appStoreImgs" src="img/IOS_AppStore.png" />
              </a>
            </div>
            <div className="appDownloadDiv aboutUsAppDownload">
              Drivers
              <a className="clickableLink">
                <img className="androidStoreImgs" src="img/Android_Store.png" />
              </a>
              <a className="clickableLink">
                <img className="appStoreImgs" src="img/IOS_AppStore.png" />
              </a>
            </div>
            <div
              style={{
                color: "white",
                alignSelf: "flex-end",
                position: "absolute",
                bottom: "0",
                right: "14vh",
              }}
            >
              Contact Us: support@fetchertech.com
            </div>
          </div>
          <div
            style={{
              color: "white",
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-around",
            }}
          >
            © 2021 Fetcher Technologies llc
            <div />
            <div />
            <div />
            <div
              style={{
                width: "10%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <a href="/termsofservice" className="mainPageTermsPolicies">
                Terms
              </a>
              <a href="privacypolicy" className="mainPageTermsPolicies">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NotFoundPage;
