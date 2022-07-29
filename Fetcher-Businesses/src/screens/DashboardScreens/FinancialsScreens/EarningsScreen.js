import React, { useEffect, useState } from "react";
import GlobalStateHandler from "../../../config/GlobalStateHandler";
import FirebaseFunctions from "../../../config/FirebaseFunctions";
import calculateEarnings from "../../../config/calculateEarnings";
import { Dot } from "react-animated-dots";
import {
  LineChart,
  Tooltip,
  Line,
  YAxis,
  XAxis,
  CartesianGrid,
} from "recharts";

const EarningsScreen = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [didUseEffect, setDidUseEffect] = useState(false);
  const [displayedEarnings, setDisplayedEarnings] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [oldestDocId, setOldestDocId] = useState(-1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const earningsRefresh = (docData, docId) => {
    let copy = earnings.slice();
    for (var i = 0; i < earnings.length; i++) {
      if (docId === earnings[i].docId) {
        copy[i] = { docId, earnings: docData.earnings };
        setEarnings(copy);
        return;
      }
    }
  };
  const addToEarnings = (docData, docId, isOldDoc) => {
    let copy = earnings.slice();
    if (docId < oldestDocId) {
      setOldestDocId(docId);
    }
    if (isOldDoc) {
      //console.log('OH HEY')
      copy.unshift({ docId, earnings: docData.earnings });
      setEarnings(copy);
      return;
    }
    //console.log(docData)
    copy.push({ docId, earnings: docData.earnings });
    setEarnings(copy);
    setIsLoading(false);
  };

  const asyncUseEffect = async () => {
    let lastEarningsIndex = GlobalStateHandler.businessData.lastEarningsIndex;
    await FirebaseFunctions.loadEarnings(
      lastEarningsIndex,
      (docData, docId) => earningsRefresh(docData, docId),
      (docData, docId, isOldDoc) => addToEarnings(docData, docId, isOldDoc),
      false
    );
    setOldestDocId(lastEarningsIndex);
    FirebaseFunctions.checkForNewEarningsDocs(
      (docData, docId) => earningsRefresh(docData, docId),
      (docData, docId, isOldDoc) => addToEarnings(docData, docId, isOldDoc)
    );
  };
  const loadOldEarnings = async () => {
    setIsRefreshing(true);
    if (oldestDocId - 1 < 0) {
      setIsRefreshing(false);
      return;
    }
    await FirebaseFunctions.loadEarnings(
      oldestDocId - 1,
      (docData, docId) => earningsRefresh(docData, docId),
      (docData, docId, isOldDoc) => addToEarnings(docData, docId, isOldDoc),
      true
    );
    setIsRefreshing(false);
  };
  useEffect(() => {
    if (!didUseEffect) {
      asyncUseEffect();
      setDidUseEffect(true);
    }
  }, []);
  return (
    <div
      id="earnings"
      className="settingsScreens"
      style={{
        alignItems: "center",
        justifyContent: "space-evenly",
        overflowY: "scroll",
      }}
    >
      <div
        style={{
          alignSelf: "flex-start",
          marginLeft: "8vw",
          fontSize: "3vw",
        }}
      >
        Earnings
      </div>
      <div className="infographicDisplay">
        <div className="directGraphContainer">
          {props.displayedEarnings.length < 1 ? (
            <div
              className=""
              style={{
                color: "white",
                fontSize: "160px",
                marginBottom: "70px",
              }}
            >
              <Dot>.</Dot>
              <Dot>.</Dot>
              <Dot>.</Dot>
            </div>
          ) : (
            <LineChart
              className="graph"
              width={880}
              height={390}
              data={props.displayedEarnings}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <YAxis
                tickFormatter={(value) => {
                  return "$" + value;
                }}
                stroke={"#fff"}
              />
              <XAxis dataKey="name" stroke={"#fff"} />
              <Tooltip
                formatter={(value) => {
                  return "$" + value;
                }}
              />
              <Line
                type="linear"
                dataKey="earning"
                activeDot={{ r: 8 }}
                dot
                stroke={"#FFA500"}
                strokeWidth={3}
              />
            </LineChart>
          )}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          width: "100%",
          height: "fit-content",
        }}
      >
        {earnings.length < 1 ? (
          <div
            style={{
              display: "flex",
              color: "#707070",
              fontSize: "130%",
              alignSelf: "center",
              fontWeight: "600",
            }}
          >
            Your daily earnings per week will show up here once you start
            earning
          </div>
        ) : (
          earnings.map((item, index) => {
            let listIndex = index;
            return item.earnings.map((item, index, separators) => (
              <div
                className="pastEarningContainer"
                key={index}
                onClick={() => {
                  props.navigateToPastEarning({
                    pastOrders: item.orders,
                  });
                }}
              >
                <div className="pastEarningText">{item.date}</div>
                <div className="pastEarningText" style={{ color: "limegreen" }}>
                  ${item.amount}
                </div>
                <div className="pastEarningText">
                  Number of orders: {item.orders.length}
                </div>
              </div>
            ));
          })
        )}
      </div>
    </div>
  );
};
export default EarningsScreen;
