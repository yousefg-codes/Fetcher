import React, { useState, useEffect } from "react";
import GlobalStateHandler from "../../../config/GlobalStateHandler";
import FirebaseFunctions from "../../../config/FirebaseFunctions";
import BusinessHoursComponent from "../../../components/BusinessHoursComponent";
const BusinessHoursScreen = () => {
  const [areOpen, setAreOpen] = useState(
    GlobalStateHandler.businessData.isOpen
  );
  const setChosenTimes = (newHours) => {
    FirebaseFunctions.updateBusinessInfo({ businessHours: newHours });
  };
  const setClosedDays = (newDays) => {
    FirebaseFunctions.updateBusinessInfo({ closedDays: newDays });
  };
  useEffect(() => {
    setAreOpen(GlobalStateHandler.businessData.isOpen);
  }, []);
  return (
    <div
      className="settingsScreens"
      style={{
        alignItems: "center",
        justifyContent: "space-evenly",
        paddingTop: "10vh",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-evenly",
          height: "15vh",
        }}
      >
        Click this button to close your business even during its open hours
        until you wish to re-open. To re-open your business to normal hours
        click it again
        <button
          onClick={() => {
            FirebaseFunctions.toggleIsOpen(!areOpen);
            setAreOpen(!areOpen);
          }}
          style={
            areOpen
              ? {
                  backgroundColor: "red",
                  borderColor: "red",
                }
              : {
                  backgroundColor: "green",
                  borderColor: "green",
                }
          }
          className="isOpenToggleBtn"
        >
          {areOpen ? "Close" : "Re-Open"}
        </button>
      </div>

      <BusinessHoursComponent
        className="tabPageBlob"
        style={{
          WebkitTransformOrigin: "center",
          TransformOrigin: "center",
          OTransformOrigin: "center",
          MozTransformOrigin: "center",
          alignSelf: "center",
          paddingLeft: "1.5vw",
          paddingTop: "2vh",
          paddingRight: "1vw",
        }}
        initialTimes={GlobalStateHandler.businessData.businessHours}
        initialClosures={GlobalStateHandler.businessData.closedDays}
        setChosenTimes={setChosenTimes.bind(this)}
        setClosedDays={setClosedDays.bind(this)}
      />
    </div>
  );
};
export default BusinessHoursScreen;
