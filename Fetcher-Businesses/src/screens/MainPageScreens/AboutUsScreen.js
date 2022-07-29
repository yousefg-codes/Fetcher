import React, { useEffect, useState } from "react";
import navigate from "../../config/tabNavigation";
import FirebaseFunctions from "../../config/FirebaseFunctions";
import { Link } from "react-router-dom";
import App from "../../App";

const AboutUsScreen = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [canEmail, setCanEmail] = useState("");

  useEffect(() => {
    if (name !== "" && email !== "" && body !== "") {
      setCanEmail(true);
    } else {
      setCanEmail(false);
    }
  }, [name, email, body]);

  return (
    <div id="About" style={{ height: "250%" }} className="tabPage">
      <div className="aboutUsSectionOne">
        <div className="aboutUsSectionOneBackground" />
        <div style={{ marginTop: "5%" }}>
          {/* Our Mission
                    <div className="missionStatement">
                        our mission is isfifiifififififififif
                    </div> */}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            alignContent: "center",
          }}
        >
          Our Values
          <div className="valuesParentDiv" style={{ marginRight: "11vh" }}>
            <div className="valuesDivs">
              1. Fast
              <img className="valuesImgs" src="../img/Fast_Cart_Img.png" />
            </div>
            <div className="valuesDivs">
              2. Reliable
              <img
                style={{ marginTop: "30%" }}
                className="valuesImgs"
                src="../img/Reliable_Handshake.png"
              />
            </div>
            <div className="valuesDivs">
              3. Easy
              <img
                style={{ marginTop: "30%" }}
                className="valuesImgs"
                src="../img/Easy_Img.png"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="aboutUsSectionTwo">
        What we do
        <div className="whatWeDoText">
          We make sure small businesses are not left out when it comes to
          delivering their items, by creating a platform on which customers can
          order Small Businesses' products and drivers can deliver them
        </div>
        <img className="whatWeDoImg" src="../img/What_We_Do_Img.jpg" />
      </div>
      <div className="aboutUsSectionThree">
        <div className="aboutUsSectionThreeBackground" />
        <div className="multiInfoDivsParent">
          <div className="multiInfoDivs">
            <img
              style={{ backgroundColor: "rgb(290, 186, 60)" }}
              className="multiInfoImgs"
              src="../img/Apps_Img.png"
            />
            <div className="appDownloadParentDiv">
              <div
                style={{
                  backgroundColor: "rgb(290, 186, 60)",
                  borderBottomLeftRadius: "17px",
                  borderRight: "1px solid black",
                }}
                className="appDownloadDiv aboutUsAppDownload"
              >
                For Drivers
                <div className="aboutUsAppExplanation">
                  Are you over the age of 18 and looking to earn some more
                  money? Check out the Fetcher Drivers app!
                </div>
                <img
                  className="mainLogoImg2"
                  style={{
                    height: "100px",
                  }}
                  src="img/Car_App_Img.png"
                />
                <a className="clickableLink">
                  <img
                    className="androidStoreImgs"
                    src="img/Android_Store.png"
                  />
                </a>
                <a className="clickableLink">
                  <img className="appStoreImgs" src="img/IOS_AppStore.png" />
                </a>
              </div>
              <div
                style={{
                  backgroundColor: "rgb(290, 186, 60)",
                  borderBottomRightRadius: "17px",
                  borderLeft: "1px solid black",
                }}
                className="appDownloadDiv aboutUsAppDownload"
              >
                For Customers
                <div className="aboutUsAppExplanation">
                  Do you need products delivered to your door from your favorite
                  local business ASAP! Download the Fetcher app!
                </div>
                <img className="mainLogoImg2" src="img/Cart_App_Img.png" />
                <a className="clickableLink">
                  <img
                    className="androidStoreImgs"
                    src="img/Android_Store.png"
                  />
                </a>
                <a className="clickableLink">
                  <img className="appStoreImgs" src="img/IOS_AppStore.png" />
                </a>
              </div>
            </div>
          </div>
          <div className="multiInfoDivs" style={{ backgroundColor: "black" }}>
            <img
              style={{ backgroundColor: "black" }}
              className="multiInfoImgs"
              src="../img/Social_Media_Img.png"
            />
            <div className="socialMediaParent">
              Check us out!
              <div className="socialMediaLinksParent">
                <a
                  href="https://www.facebook.com/fetchertechnologies"
                  className="socialMediaLink"
                >
                  <img className="socialMediaImgs" src="../img/Facebook.png" />
                  Facebook
                </a>
                <a
                  href="https://www.instagram.com/fetcher_technologies/"
                  className="socialMediaLink"
                >
                  <img className="socialMediaImgs" src="../img/Instagram.png" />
                  Instagram
                </a>
                <a
                  href="https://twitter.com/FetcherT"
                  className="socialMediaLink"
                >
                  <img className="socialMediaImgs" src="../img/Twitter.png" />
                  Twitter
                </a>
                <a
                  href="https://www.linkedin.com/company/fetcher-technologies"
                  className="socialMediaLink"
                >
                  <img className="socialMediaImgs" src="../img/LinkedIn.png" />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
          <div className="multiInfoDivs" style={{ backgroundColor: "white" }}>
            <img
              style={{ backgroundColor: "white" }}
              className="multiInfoImgs"
              src="../img/Contact_Us.png"
            />
            <div className="contactUsParent">
              <div className="contactUsBasicInputsParent">
                <input
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                  placeholder="Firstname Lastname"
                  type="text"
                  className="contactUsBasicInputs"
                ></input>
                <input
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                  placeholder="Email"
                  type="text"
                  className="contactUsBasicInputs"
                ></input>
              </div>
              <textarea
                onChange={(event) => {
                  setBody(event.target.value);
                }}
                placeholder="Email Body"
                rows="10"
                cols="60"
                multiple
                className="contactUsBodyInput"
              ></textarea>
              <div className="emailInfoDiv">
                <button
                  onClick={() => {
                    FirebaseFunctions.sendSupportMessage(name, email, body);
                  }}
                  disabled={!canEmail}
                  className="sendEmailBtn"
                >
                  <img
                    className="sendEmailBtnImg"
                    src="../img/Email_Icon.png"
                  />
                </button>
                <div className="emailInfoText">
                  You can email us at support@fetchertech.com
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AboutUsScreen;
