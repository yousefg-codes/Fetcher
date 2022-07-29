import React, { useState, useEffect } from "react";
import FirebaseFunctions from "../../../config/FirebaseFunctions";
import { useHistory } from "react-router-dom";
import {
  FiHome,
  FiBell,
  FiLock,
  FiUnlock,
  FiAlignCenter,
  FiCreditCard,
  Fi,
} from "react-icons/fi";
import {
  IoNewspaperOutline,
  IoAppsOutline,
  IoPersonCircleOutline,
} from "react-icons/io5";
import GlobalStateHandler from "../../../config/GlobalStateHandler";
import Geocode from "react-geocode";
import { FaArrowRight } from "react-icons/fa";

const EditAccount = (props) => {
  const [imageURL, setImageURL] = useState(null);
  const [ownerFirstName, setOwnerFirstName] = useState(
    GlobalStateHandler.businessData.ownerName.substring(
      0,
      GlobalStateHandler.businessData.ownerName.indexOf(" ")
    )
  );
  const [ownerLastName, setOwnerLastName] = useState(
    GlobalStateHandler.businessData.ownerName.substring(
      GlobalStateHandler.businessData.ownerName.indexOf(" ") + 1
    )
  );
  const [ownerEmail, setOwnerEmail] = useState(
    GlobalStateHandler.businessData.ownerEmail
  );
  const [ownerPhoneNumber, setOwnerPhoneNumber] = useState(
    GlobalStateHandler.businessData.ownerPhoneNumber
  );
  const [businessCity, setBusinessCity] = useState("");
  const [businessState, setBusinessState] = useState("");
  const [businessStAdd, setBusinessStAdd] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [businessZipCode, setBusinessZipCode] = useState("");
  const [businessName, setBusinessName] = useState(
    GlobalStateHandler.businessData.businessName
  );
  const [businessPhoneNumber, setBusinessPhoneNumber] = useState(
    GlobalStateHandler.businessData.businessPhoneNumber
  );
  const [askForPass, setAskForPass] = useState(true);
  const [password, setPassword] = useState("");
  const [showIncorrect, setShowIncorrect] = useState(false);

  useEffect(() => {
    setImageURL(props.imageURL);
    let copy = GlobalStateHandler.businessLocation.businessLocation;
    let addressArr = copy.split(", ");
    setBusinessStAdd(addressArr[0]);
    setBusinessCity(addressArr[1]);
    setBusinessState(addressArr[2]);
    setBusinessZipCode(addressArr[3]);
  }, []);

  const changeBusinessLogo = async (image) => {
    await FirebaseFunctions.changeBusinessLogo(image);
  };
  if (askForPass) {
    return (
      <div id="editAcc" className="settingsScreens">
        <div className="editAccountPassContainer">
          Password
          <div className="editAccountPassInputContainer">
            <input
              className="editAccountPassInput"
              type="password"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
            <button
              className="editAccountPassNextBtn"
              onClick={async () => {
                await FirebaseFunctions.checkPassword(password)
                  .then(() => {
                    setAskForPass(false);
                  })
                  .catch((error) => {
                    console.log(error);
                    setShowIncorrect(true);
                  });
              }}
            >
              <FaArrowRight fontSize="150%" />
            </button>
          </div>
          {showIncorrect ? (
            <div style={{ color: "red", fontSize: "75%" }}>
              Incorrect Password
            </div>
          ) : null}
        </div>
      </div>
    );
  }
  return (
    <div id="editAcc" style={{ height: "150vh" }} className="settingsScreens">
      <div className="settingsScreensTitle">
        <IoPersonCircleOutline
          className="settingsScreensTitleIcon"
          fontSize="250%"
        />
        Edit Account
      </div>
      <input
        onChange={(event) => {
          if (event.target.files[0]) {
            var reader = new FileReader();
            reader.onload = (e) => {
              props.onImageChange(e.target.result);
              setImageURL(e.target.result);
              changeBusinessLogo(e.target.result);
            };
            reader.readAsDataURL(event.target.files[0]);
          }
        }}
        id="logoUploader"
        style={{ display: "none" }}
        type="file"
        accept="image/*"
      />
      {/* <div className="accountBackgroundContainer"/> */}
      <div className="logoContainer">
        <img
          id="businessLogo"
          onClick={() => {
            var fileUploader = document.getElementById("logoUploader");
            fileUploader.click();
          }}
          src={imageURL}
          className="businessLogoSecondaryContainer"
        />
        <p id="businessLogoText" className="changeLogoText">
          Change Business Logo
        </p>
      </div>
      <div className="editInfoContainer">
        Owner Name
        <div className="editAccountShortInputsContainer">
          <div className="halfWidthEditContainer">
            <input
              onChange={(event) => {
                setOwnerFirstName(event.target.value);
              }}
              defaultValue={ownerFirstName}
              type="text"
              className="editAccountShortInputs"
            ></input>
            First Name
          </div>
          <div
            style={{ marginRight: "12px" }}
            className="halfWidthEditContainer"
          >
            <input
              onChange={(event) => {
                setOwnerLastName(event.target.value);
              }}
              defaultValue={ownerLastName}
              type="text"
              className="editAccountShortInputs"
            ></input>
            Last Name
          </div>
        </div>
        {/* Owner's Email
                <input onChange={(event) => {
                    setOwnerEmail(event.target.value)
                }} defaultValue={ownerEmail} type="text" className="editAccountLongInputs"></input> */}
        Owner's Phone Number
        <input
          onChange={(event) => {
            setOwnerPhoneNumber(event.target.value);
          }}
          defaultValue={ownerPhoneNumber}
          type="text"
          className="editAccountLongInputs"
        ></input>
        Business Name
        <input
          onChange={(event) => {
            setBusinessName(event.target.value);
          }}
          defaultValue={businessName}
          type="text"
          className="editAccountLongInputs"
        ></input>
        Business Address
        <div className="editAccountShortInputsContainer">
          <div className="halfWidthEditContainer">
            <input
              onChange={(event) => {
                setBusinessStAdd(event.target.value);
              }}
              defaultValue={businessStAdd}
              type="text"
              className="editAccountShortInputs"
            ></input>
            Street Address
          </div>
          <div
            style={{ marginRight: "12px" }}
            className="halfWidthEditContainer"
          >
            <input
              onChange={(event) => {
                setBusinessCity(event.target.value);
              }}
              defaultValue={businessCity}
              type="text"
              className="editAccountShortInputs"
            ></input>
            City
          </div>
        </div>
        <div className="editAccountShortInputsContainer">
          <div className="halfWidthEditContainer">
            <input
              onChange={(event) => {
                setBusinessState(event.target.value);
              }}
              defaultValue={businessState}
              type="text"
              className="editAccountShortInputs"
            ></input>
            State
          </div>
          <div
            style={{ marginRight: "12px" }}
            className="halfWidthEditContainer"
          >
            <input
              onChange={(event) => {
                setBusinessZipCode(event.target.value);
              }}
              defaultValue={businessZipCode}
              type="text"
              className="editAccountShortInputs"
            ></input>
            Zip Code
          </div>
        </div>
        Business Phone Number
        <input
          onChange={(event) => {
            setBusinessPhoneNumber(event.target.value);
          }}
          defaultValue={businessPhoneNumber}
          type="text"
          className="editAccountLongInputs"
        ></input>
      </div>
      <div className="editAccountBtnsContainer">
        <button
          onClick={() => {
            props.navigateBack();
          }}
          className="editAccountCancel"
        >
          CANCEL
        </button>
        <button
          onClick={async () => {
            await FirebaseFunctions.updateBusinessInfo({
              ownerName: ownerFirstName + " " + ownerLastName,
              ownerPhoneNumber,
              // ownerEmail,
              businessPhoneNumber,
              businessName,
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
            await FirebaseFunctions.updateBusinessLocationInfo({
              businessLocation:
                businessStAdd +
                ", " +
                businessCity +
                ", " +
                businessState +
                ", " +
                businessZipCode +
                ", USA",
              latitude: location.lat,
              longitude: location.lng,
            });
            props.switchToOverview();
          }}
          className="editAccountSave"
        >
          SAVE PROFILE
        </button>
      </div>
    </div>
  );
};
export default EditAccount;
