import React, { useEffect, useState } from "react";
import { Dot } from "react-animated-dots";
import {
  LineChart,
  Tooltip,
  Line,
  YAxis,
  XAxis,
  CartesianGrid,
} from "recharts";
import PastOrderObj from "../../components/PastOrderObj";
import calculateEarnings from "../../config/calculateEarnings";
import FirebaseFunctions from "../../config/FirebaseFunctions";
import GlobalStateHandler from "../../config/GlobalStateHandler";

const HomeScreen = (props) => {
  return (
    <div id="home" className="page">
      <div className="graphContainer">
        <p className="earningsThisWeekText">Earnings this week</p>
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
      </div>
      <p className="earningsThisWeekText" style={{ alignSelf: "center" }}>
        Recent Orders
      </p>
      <div
        style={
          props.recentOrders.length > 0 ? {} : { justifyContent: "center" }
        }
        className="recentOrdersContainer"
      >
        {props.recentOrders.length > 0 ? (
          props.recentOrders
            .slice()
            .reverse()
            .map((order) => (
              <PastOrderObj
                key={
                  "HomeScreen" +
                  order.date +
                  " " +
                  order.totalCost +
                  " " +
                  order.customerName
                }
                identifier={
                  "HomeScreen" +
                  order.date +
                  " " +
                  order.totalCost +
                  " " +
                  order.customerName
                }
                customerName={order.customerName}
                date={order.date}
                tax={order.tax}
                driverName={order.driverName}
                totalCost={order.totalCost}
                items={order.items}
              />
            ))
        ) : (
          <div
            style={{
              display: "flex",
              color: "#707070",
              fontSize: "130%",
              alignSelf: "center",
              fontWeight: "600",
            }}
          >
            Once your first order has been completed it will appear here
          </div>
        )}
      </div>
    </div>
  );
};
export default HomeScreen;
