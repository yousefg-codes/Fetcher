import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import MainPage from "./screens/MainPageScreens/MainPage";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import SignIn from "./screens/SignIn";
import Dashboard from "./screens/DashboardScreens/Dashboard";
import history from "./config/history";
import FirebaseFunctions from "./config/FirebaseFunctions";
import InBrowserNotification from "./components/InBrowserNotification";
import { ShouldDeleteModal } from "./components/ShouldDeleteModal";
import GlobalStateHandler from "./config/GlobalStateHandler";
import SignUpScreen from "./screens/MainPageScreens/SignUpScreen";
import PrivacyPolicyScreen from "./screens/Policies/PrivacyPolicyScreen";
import TermsOfServiceScreen from "./screens/Policies/TermsOfServiceScreen";
import NotFoundPage from "./screens/404NotFound";

const App = (props) => {
  const [isLoading, setisLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  App.notifications = notifications;
  App.setNotifications = setNotifications;

  useEffect(() => {
    document.title = "Fetcher Technologies";
    FirebaseFunctions.useAuthState(() => {
      // if (FirebaseFunctions.currentUser === null) {
      //   App.addNotification(
      //     "Welcome!",
      //     "Are you a business? If you are, we need you! Please sign up -->"
      //   );
      // }
      setisLoading(false);
    });
  }, []);
  if (isLoading) {
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
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
          }}
          className="tabPage"
        >
          <div
            id="loader"
            className="loaderContainer"
            style={{ display: "flex" }}
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
  }
  return (
    <div>
      <title>Fetcher Technologies</title>
      <link rel="icon" href="img/Fetcher_Logo.png" />
      <BrowserRouter history={history}>
        <Switch>
          <Route exact path="/" component={MainPage} />
          <Route exact path="/signin" component={SignIn} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/signup" component={SignUpScreen} />
          <Route path="/privacypolicy" component={PrivacyPolicyScreen} />
          <Route path="/termsofservice" component={TermsOfServiceScreen} />
          <Route component={NotFoundPage} />
        </Switch>
      </BrowserRouter>
      <div
        style={{
          position: "fixed",
          width: "22%",
          top: "10%",
          left: "2%",
          zIndex: 10,
        }}
      >
        {notifications}
      </div>
      <ShouldDeleteModal
        ref={(ref) => {
          GlobalStateHandler.shouldDeleteModalRef = ref;
        }}
      />
    </div>
  );
};
App.addNotification = (title, message) => {
  let temp = App.notifications.slice();
  temp.push(
    <InBrowserNotification
      key={temp.length}
      onExit={() => {
        let temp2 = App.notifications.slice();
        temp2.splice(temp.length - 1, 1);
        App.setNotifications(temp2);
      }}
      title={title}
      message={message}
    />
  );
  App.setNotifications(temp);
};

export default App;
