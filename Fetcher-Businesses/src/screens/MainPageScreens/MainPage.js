import React, { useEffect, useState, useRef } from "react";
import navigate from "../../config/tabNavigation";
import FirebaseFunctions from "../../config/FirebaseFunctions";
import { Link } from "react-router-dom";
import App from "../../App";
import AboutUsScreen from "./AboutUsScreen";
import {
  FaCarSide,
  FaFacebook,
  FaHome,
  FaInstagram,
  FaLinkedinIn,
  FaLock,
  FaMobile,
  FaMoneyBill,
  FaStore,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import GlobalStateHandler from "../../config/GlobalStateHandler";
import calculateEarnings from "../../config/calculateEarnings";

const MainPage = (props) => {
  const [currScreen, setCurrScreen] = useState("home");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [canEmail, setCanEmail] = useState("");
  const [slideIndex, setSlideIndex] = useState(0);
  const [earnings, setEarnings] = useState([]);
  const [didUseEffect, setDidUseEffect] = useState(false);
  const [displayedEarnings, setDisplayedEarnings] = useState([]);
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
  const earningsRefresh = (docData, docId) => {
    setEarnings((earnings) => {
      let copy = earnings.slice();
      for (var i = 0; i < earnings.length; i++) {
        if (docId === earnings[i].docId) {
          copy[i] = { docId, earnings: docData.earnings };
          return copy;
        }
      }
      return copy;
    });
  };
  const addToEarnings = (docData, docId, isOldDoc) => {
    if (!isOldDoc) {
      setEarnings((earnings) => {
        let copy = earnings.slice();
        copy.push({ docId, earnings: docData.earnings });
        return copy;
      });
    } else {
      setEarnings((earnings) => {
        let copy = earnings.slice();
        copy.unshift({ docId, earnings: docData.earnings });
        return copy;
      });
    }
  };

  const asyncUseEffectEarnings = async () => {
    let lastEarningsIndex = GlobalStateHandler.businessData.lastEarningsIndex;
    await FirebaseFunctions.loadEarnings(
      lastEarningsIndex,
      (docData, docId) => earningsRefresh(docData, docId),
      (docData, docId, isOldDoc) => addToEarnings(docData, docId, isOldDoc),
      false
    );
    if (lastEarningsIndex - 1 >= 0) {
      await FirebaseFunctions.loadEarnings(
        lastEarningsIndex - 1,
        (docData, docId) => earningsRefresh(docData, docId),
        (docData, docId, isOldDoc) => addToEarnings(docData, docId, isOldDoc),
        true
      );
    }
    FirebaseFunctions.checkForNewEarningsDocs(
      (docData, docId) => earningsRefresh(docData, docId),
      (docData, docId, isOldDoc) => addToEarnings(docData, docId, isOldDoc)
    );
  };

  useEffect(() => {
    if (FirebaseFunctions.currentUser !== null) {
      if (!didUseEffect) {
        asyncUseEffectEarnings();
        setDidUseEffect(true);
      } else {
        setDisplayedEarnings(calculateEarnings(earnings));
      }
    }
  }, [earnings]);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        overflowY: "scroll",
      }}
    >
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
              style={
                currScreen === "customers"
                  ? { textDecoration: "underline" }
                  : {}
              }
              disabled={currScreen === "customers"}
              onClick={(event) => setCurrScreen("customers")}
              className="tabButtons"
            >
              Customers
            </button>
            <button
              style={
                currScreen === "drivers" ? { textDecoration: "underline" } : {}
              }
              onClick={(event) => setCurrScreen("drivers")}
              disabled={currScreen === "drivers"}
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
            backgroundImage:
              currScreen === "customers" || currScreen === "drivers"
                ? "linear-gradient(180deg, #ff993b 100%, #fff 0%)"
                : "linear-gradient(180deg, #ff993b 65%, #fff 35%)",
          }}
        >
          {currScreen === "customers" ? (
            <div className="driversCustomersSoon">
              <div className="welcomeText">
                Coming Soon! <br />
                <div className="welcomeSubText">
                  Website support for customers is coming soon! But for now make
                  sure you download the Fetcher App on your mobile phone.{" "}
                </div>
              </div>
              <div className="appDownloadDiv aboutUsAppDownload comingSoonDownload">
                <a className="clickableLink">
                  <img
                    className="androidStoreImgs comingSoonDownlaodLinks"
                    src="img/Android_Store.png"
                  />
                </a>
                <a className="clickableLink">
                  <img
                    className="appStoreImgs comingSoonDownlaodLinks"
                    src="img/IOS_AppStore.png"
                  />
                </a>
              </div>
            </div>
          ) : null}
          {currScreen === "drivers" ? (
            <div className="driversCustomersSoon">
              <div className="welcomeText">
                Coming Soon! <br />
                <div className="welcomeSubText">
                  Website support for drivers is coming soon! But for now make
                  sure you download the Fetcher Drivers App on your mobile
                  phone, and sign up to become a driver today!{" "}
                </div>
              </div>
              <div className="appDownloadDiv aboutUsAppDownload comingSoonDownload">
                <a className="clickableLink">
                  <img
                    className="androidStoreImgs comingSoonDownlaodLinks"
                    src="img/Android_Store.png"
                  />
                </a>
                <a className="clickableLink">
                  <img
                    className="appStoreImgs comingSoonDownlaodLinks"
                    src="img/IOS_AppStore.png"
                  />
                </a>
              </div>
            </div>
          ) : null}
          {currScreen === "home" ? (
            <div className="welcomeText">
              {FirebaseFunctions.currentUser === null
                ? "Hi There"
                : "Hi " + GlobalStateHandler.businessData.businessName + "!"}
              <br />
              <div className="welcomeSubText">
                {FirebaseFunctions.currentUser === null
                  ? "Are you a business? Sign up today!"
                  : "Are you ready to make some money?"}
              </div>
            </div>
          ) : null}
          {currScreen === "home" ? (
            <div className="topPageSignUpAndSlideContainer">
              <div className="mainPageInfoText tabPageBlob">
                <div
                  className="slideShowSlider"
                  style={{
                    transform: `translate3d(${-slideIndex * 100}%, 0, 0)`,
                  }}
                >
                  <div className="slide">
                    <div className="secondarySlideContainer">
                      <div className="topMainPageBlobText">
                        Order from your favorite small businesses
                      </div>
                      <div className="mainPageInfoSubText">
                        {" "}
                        Wish you could order your favorite items from your
                        favorite local small businesses and shops, and have them
                        delivered to your door? Then Fetcher is the app to look
                        for! Download the Fetcher App today on the Google Play
                        Store and App Store
                      </div>
                      <div
                        className="slideBackground"
                        style={{
                          backgroundImage: 'url("img/Guy_Holding_Phone.jpg")',
                        }}
                      />
                    </div>
                  </div>
                  <div className="slide">
                    <div className="secondarySlideContainer">
                      <div className="topMainPageBlobText">
                        Get paid to deliver
                      </div>
                      <div className="mainPageInfoSubText">
                        Want to make some extra cash? Become a Fetcher Driver
                        and earn $1.2 per mile! Download the Fetcher Drivers App
                        from the App Store or Google Play store and sign up
                        today!
                      </div>
                      <div
                        className="slideBackground"
                        style={{
                          backgroundImage: 'url("img/Guy_Driving_Car.jpg")',
                        }}
                      />
                    </div>
                  </div>
                  <div className="slide">
                    <div className="secondarySlideContainer">
                      <div className="topMainPageBlobText">
                        Grow your small business
                      </div>
                      <div className="mainPageInfoSubText">
                        Do you own a small shop, or retail-based business? Then
                        Fetcher is the perfect place for you to grow your
                        customer base, at only a 7% fee per order, you can get
                        access to a 5 mile radius of customers and drivers!
                      </div>
                      <div
                        className="slideBackground"
                        style={{
                          backgroundImage: 'url("img/groceryShopping.jpg")',
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    position: "absolute",
                    bottom: "2vh",
                    width: "10%",
                    left: "45%",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: slideIndex === 0 ? "#ff993b" : "white",
                      borderColor: slideIndex === 0 ? "#ff993b" : "white",
                    }}
                    onClick={() => {
                      setSlideIndex(0);
                    }}
                    className="slideShowBtns"
                  />
                  <div
                    style={{
                      backgroundColor: slideIndex === 1 ? "#ff993b" : "white",
                      borderColor: slideIndex === 1 ? "#ff993b" : "white",
                    }}
                    onClick={() => {
                      setSlideIndex(1);
                    }}
                    className="slideShowBtns"
                  />
                  <div
                    onClick={() => {
                      setSlideIndex(2);
                    }}
                    style={{
                      backgroundColor: slideIndex === 2 ? "#ff993b" : "white",
                      borderColor: slideIndex === 2 ? "#ff993b" : "white",
                    }}
                    className="slideShowBtns"
                  />
                </div>
              </div>
              {/* <div className="imgOpacity"> */}
              {FirebaseFunctions.currentUser === null ? (
                <form className="signUpDiv tabPageBlob">
                  <div className="innerSignUpDiv">
                    <div className="businessSignUpInfo">
                      <h2 className="businessSignUpInfoText">
                        Are you a Business?
                      </h2>
                      <h3 className="businessSignUpInfoText">Sign Up Here!</h3>
                    </div>
                    <div className="signUpInputs">
                      <div className="doubleTextInputContainer">
                        <div className="titleAndTextInputContainer">
                          <h4 className="commonText">First Name</h4>
                          <input
                            type="text"
                            rows={1}
                            className="textInputs"
                            id="First Name"
                            placeholder="John"
                          />
                        </div>
                        <div className="titleAndTextInputContainer">
                          <h4 className="commonText">Last Name</h4>
                          <input
                            type="text"
                            rows={1}
                            className="textInputs"
                            id="Last Name"
                            placeholder="Doe"
                          />
                        </div>
                      </div>
                      <div className="doubleTextInputContainer">
                        <div className="titleAndTextInputContainer">
                          <h4 className="commonText">Email</h4>
                          <input
                            type="text"
                            rows={1}
                            className="textInputs"
                            id="Email"
                            placeholder="email@domain.com"
                          />
                        </div>
                        <div className="titleAndTextInputContainer">
                          <h4 className="commonText">Phone Number</h4>
                          <input
                            type="text"
                            rows={1}
                            className="textInputs"
                            id="Phone"
                            placeholder="1234567890"
                          />
                        </div>
                      </div>
                      <h4 className="commonText">Business Name</h4>
                      <input
                        type="text"
                        rows={1}
                        className="textInputs"
                        id="Business Name"
                        placeholder="Coffee Incorporated"
                      />
                      <h4 className="commonText">Business Address</h4>
                      <div className="doubleTextInputContainer">
                        <div className="titleAndTextInputContainer">
                          <div style={{ height: "1.7vh" }} />
                          <input
                            type="text"
                            rows={1}
                            className="textInputs"
                            id="Street Address"
                            placeholder="Street Address"
                          />
                        </div>
                        <div className="titleAndTextInputContainer">
                          <div style={{ height: "1.7vh" }} />
                          <input
                            type="text"
                            rows={1}
                            className="textInputs"
                            id="City"
                            placeholder="City"
                          />
                        </div>
                      </div>
                      <div className="doubleTextInputContainer">
                        <div className="titleAndTextInputContainer">
                          <div style={{ height: "1.7vh" }} />
                          <input
                            type="text"
                            rows={1}
                            className="textInputs"
                            id="State"
                            placeholder="State"
                          />
                        </div>
                        <div className="titleAndTextInputContainer">
                          <div style={{ height: "1.7vh" }} />
                          <input
                            type="text"
                            rows={1}
                            className="textInputs"
                            id="Zip Code"
                            placeholder="Zip Code"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <input
                    type="submit"
                    value="Sign Up"
                    onClick={(event) => {
                      event.preventDefault();
                      props.history.push({
                        pathname: "/signup",
                        state: {
                          firstName:
                            document.getElementById("First Name").value,
                          lastName: document.getElementById("Last Name").value,
                          email: document.getElementById("Email").value,
                          phoneNumber: document.getElementById("Phone").value,
                          businessCity: document.getElementById("City").value,
                          businessState: document.getElementById("State").value,
                          businessStreetAddress:
                            document.getElementById("Street Address").value,
                          businessZipCode:
                            document.getElementById("Zip Code").value,
                          businessName:
                            document.getElementById("Business Name").value,
                        },
                      });
                    }}
                    className="SignUpBtn"
                  />
                </form>
              ) : (
                <div
                  style={{ justifyContent: "space-evenly" }}
                  className="signUpDiv tabPageBlob"
                >
                  <div
                    className="businessSignUpInfo"
                    style={{
                      textAlign: "center",
                      width: "90%",
                      height: "8vh",
                    }}
                  >
                    <h2 className="businessSignUpInfoText">
                      Let's get this business running!{" "}
                    </h2>
                  </div>
                  <div className="topRightBlobText">
                    Total Earnings This Week: $
                    {displayedEarnings.length > 0
                      ? displayedEarnings.reduce(
                          (accumulator, currentValue, currentIndex, array) => {
                            return accumulator + currentValue;
                          }
                        )
                      : ""}
                  </div>
                  <div className="topRightBlobText">
                    Incoming Orders:{" "}
                    {GlobalStateHandler.businessData.incomingOrders.length}
                  </div>
                  <button className="SignUpBtn">Go to Dashboard</button>
                </div>
              )}
              {/* </div> */}
            </div>
          ) : null}
        </div>
        <div className="homePageSectionTwo">
          {currScreen === "home" ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div className="centerPageInfoText tabPageBlob">
                <div
                  className="topMainPageBlobText"
                  style={{
                    marginTop: "0px",
                    marginLeft: "0px",
                    width: "auto",
                    height: "auto",
                    alignSelf: "center",
                    color: "black",
                  }}
                >
                  What is Fetcher?
                </div>
                <div className="whatIsFetcherExplanationTxt">
                  Fetcher is a delivery service for small retail-based
                  businesses, that connects customers of small businesses to
                  their favorite local businesses, and allows them to order
                  products from these businesses while drivers carry out their
                  orders.
                </div>
              </div>
              <div className="multiInfoDivsParent">
                <div className="multiInfoDivs tabPageBlob">
                  <FaMobile size="10vh" />
                  Adapted
                  <div
                    style={{
                      textAlign: "center",
                      width: "80%",
                      fontSize: "2vh",
                    }}
                  >
                    All Fetcher applications' UIs are tailored toward their
                    target audience for efficiency, ease and practicality
                  </div>
                </div>
                <div className="multiInfoDivs tabPageBlob">
                  <FaLock size="10vh" />
                  Secured
                  <div
                    style={{
                      textAlign: "center",
                      width: "80%",
                      fontSize: "2vh",
                    }}
                  >
                    By using multiple third-party services Fetcher is able to
                    achieve a high level of data security for its customers
                  </div>
                </div>
                <div className="multiInfoDivs tabPageBlob">
                  <FaMoneyBill size="10vh" />
                  Affordable & Well Paying
                  <div
                    style={{
                      textAlign: "center",
                      width: "80%",
                      fontSize: "2vh",
                    }}
                  >
                    At only a 7% fee per order for businesses, low delivery fees
                    for customers, and $1.2/mile wages for drivers, Fetcher
                    reduces profits to ensure its customers and associates are
                    making the most out of their time and money.
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
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
            <div className="contactText">
              Contact Us: support@fetchertech.com
            </div>
          </div>
          <div className="endOfPageTxt">
            <div>© 2021 Fetcher Technologies llc</div>
            <div style={{ width: "20%" }} />
            <div style={{ width: "20%" }} />
            <div className="termsPoliciesContainer">
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
export default MainPage;
