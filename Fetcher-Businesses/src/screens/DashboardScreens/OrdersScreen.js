import React, { useEffect, useState, useCallback } from "react";
import FirebaseFunctions from "../../config/FirebaseFunctions";
import PastOrderObj from "../../components/PastOrderObj";
import GlobalStateHandler from "../../config/GlobalStateHandler";
import { FaList, FaListAlt } from "react-icons/fa";

const OrdersScreen = (props) => {
  return (
    <div id="orders" className="page">
      <div className="inComingOrdersScreenTitle" style={{ width: "40%" }}>
        <FaListAlt style={{ marginRight: "2%" }} fontSize="130%" />
        Past Orders
      </div>
      <div
        style={
          props.pastOrders[0].pastOrders.length > 0
            ? {}
            : { width: "100%", justifyContent: "center", height: "20%" }
        }
        className="pastOrdersContainer"
      >
        {props.pastOrders[0].pastOrders.length > 0 ? (
          props.pastOrders
            .slice()
            .reverse()
            .map((element) =>
              element.pastOrders
                .slice()
                .reverse()
                .map((order) => (
                  <PastOrderObj
                    key={
                      order.date +
                      " " +
                      order.totalCost +
                      " " +
                      order.customerName
                    }
                    identifier={
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
            )
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
      {props.oldestDocId === 0 ? null : (
        <div className="showMoreProductsContainer">
          <h1
            onClick={() => {
              props.loadOldOrders();
            }}
            className="showMoreProducts"
          >
            Show More
          </h1>
        </div>
      )}
    </div>
  );
};
export default OrdersScreen;
