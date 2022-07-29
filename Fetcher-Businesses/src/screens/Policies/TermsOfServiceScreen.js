import React from "react";
import TermsOfServiceHtml from "../../config/TermsOfServiceHtml";

const TermsOfServiceScreen = () => {
  return (
    <div className="policyContainer">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          width: "100vw",
          paddingTop: "5vh",
          paddingBottom: "1vh",
          height: "10vh",
          fontSize: "3vw",
        }}
      >
        TERMS OF SERVICE
      </div>
      <div
        style={{
          display: "flex",
          flex: "1",
          paddingBottom: "5vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TermsOfServiceHtml />
      </div>
    </div>
  );
};
export default TermsOfServiceScreen;
