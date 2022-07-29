import React from "react";
import PrivacyPolicyHtml from "../../config/PrivacyPolicyHtml";
const PrivacyPolicyScreen = () => {
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
        PRIVACY POLICY
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
        <PrivacyPolicyHtml />
      </div>
    </div>
  );
};
export default PrivacyPolicyScreen;
