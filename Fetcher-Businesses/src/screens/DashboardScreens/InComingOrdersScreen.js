import React, { useState, useEffect } from "react";
import { FaCar, FaTicketAlt, FaTimes, FaStore } from "react-icons/fa";
import Map from "google-map-react";
import Modal from "react-modal";
import GlobalStateHandler from "../../config/GlobalStateHandler";
import FirebaseFunctions from "../../config/FirebaseFunctions";

const InComingOrderComponent = (props) => {
  return (
    <div className="inComingOrderComponentContainer">
      <div className="basicInComingOrderInfo">
        Order ID: {props.orderId}
        <div>Driver Name: {props.driverName}</div>
        <a
          onClick={() => {
            console.warn(props.items);
            props.onOrderDetailsClick({
              index: props.index,
              progress: props.progress,
              items: props.items,
              driverName: props.driverName,
              orderId: props.orderId,
              driverLocation: props.driverLocation,
              totalCost: props.totalCost,
            });
          }}
          className="inComingOrderDetailsLink"
        >
          Order Details
        </a>
        {props.progress === "READY" ? (
          <button
            onClick={() => {
              FirebaseFunctions.deleteIncomingOrder(props.orderId);
            }}
            className="inComingOrdersModalBasicInfoBtn"
          >
            Picked up by Driver
          </button>
        ) : null}
      </div>
      <Map
        bootstrapURLKeys={{ key: GlobalStateHandler.myKey }}
        className="inComingOrderMap"
        center={{
          lat: props.driverLocation.lat,
          lng: props.driverLocation.lng,
        }}
        options={() => {
          return {
            zoomControl: false,
            fullscreenControl: false,
            rotateControl: false,
            disableDoubleClickZoom: true,
            maxZoom: 13,
            mapTypeControl: false,
          };
        }}
        zoom={13}
      >
        <img
          lat={props.driverLocation.lat}
          lng={props.driverLocation.lng}
          src="../img/Fetcher_Car.png"
          style={{
            width: "20px",
            transform: "rotate(" + props.driverLocation.heading + "deg)",
          }}
        />
        <FaStore
          fontSize="400%"
          lat={GlobalStateHandler.businessLocation.latitude}
          lng={GlobalStateHandler.businessLocation.longitude}
        />
      </Map>
    </div>
  );
};
const InComingOrdersScreen = (props) => {
  const [isShowingModal, setIsShowingModal] = useState(false);
  const [selectedOrderInfo, setSelectedOrderInfo] = useState({});

  return (
    <div id="inComingOrders" className="page" style={{ overflowX: "auto" }}>
      <div className="inComingOrdersScreenTitle">
        <FaCar style={{ marginRight: "2%" }} fontSize="150%" />
        Orders
      </div>
      <div className="inComingOrdersPrimaryContainer">
        Incoming Orders:
        <div
          style={
            props.incomingOrders.length > 0
              ? {}
              : { width: "100%", height: "100%", justifyContent: "center" }
          }
          className="inComingOrdersSecondaryContainer"
        >
          {props.incomingOrders.length > 0 ? (
            props.incomingOrders.map((element, index) => {
              return (
                <InComingOrderComponent
                  index={index}
                  progress={element.progress}
                  items={element.items}
                  driverName={element.driverName}
                  orderId={element.orderId}
                  driverLocation={element.driverLocation}
                  totalCost={element.totalCost}
                  onOrderDetailsClick={(orderObject) => {
                    setSelectedOrderInfo(orderObject);
                    setIsShowingModal(true);
                  }}
                />
              );
            })
          ) : (
            <div
              style={{
                display: "flex",
                color: "#707070",
                fontSize: "70%",
              }}
            >
              You have no Incoming Orders at this time
            </div>
          )}
        </div>
      </div>
      {isShowingModal ? (
        <Modal className="inComingOrderModal" isOpen={true}>
          <div className="inComingOrdersModalTitleContainer">
            Order Details for Order: {selectedOrderInfo.orderId}
            <button
              onClick={() => {
                setIsShowingModal(false);
              }}
              className="inComingOrdersModalTitleXBtn"
            >
              <FaTimes fontSize="130%" />
            </button>
          </div>
          <div className="inComingOrdersModalBasicInfoPrimaryContainer">
            <div className="inComingOrdersModalBasicInfoSecondaryContainer">
              <text>Driver Name: {selectedOrderInfo.driverName}</text>
              <text style={{ display: "inline" }}>
                Order Progress:{" "}
                <text
                  style={{
                    color:
                      selectedOrderInfo.progress === "READY" ? "green" : "red",
                  }}
                >
                  {selectedOrderInfo.progress}
                </text>
              </text>
              <text>Total Cost: ${selectedOrderInfo.totalCost}</text>
              <text>Items Ordered:</text>
            </div>
            <div className="inComingOrdersModalBasicInfoBtnContainer">
              <button
                style={
                  selectedOrderInfo.progress === "READY"
                    ? {
                        backgroundColor: "#ff993b",
                        borderColor: "#ff993b",
                      }
                    : {
                        backgroundColor: "green",
                        borderColor: "green",
                      }
                }
                onClick={() => {
                  setSelectedOrderInfo({
                    ...selectedOrderInfo,
                    progress:
                      selectedOrderInfo.progress === "NOT READY"
                        ? "READY"
                        : "NOT READY",
                  });
                  props.changeProgress(
                    selectedOrderInfo.index,
                    selectedOrderInfo.progress === "NOT READY"
                      ? "READY"
                      : "NOT READY"
                  );
                }}
                className="inComingOrdersModalBasicInfoBtn"
              >
                {selectedOrderInfo.progress === "NOT READY"
                  ? "Ready for Driver Pickup"
                  : "Not Ready for Driver Pickup"}
              </button>
            </div>
          </div>
          <div className="inComingOrdersModalDetailedInfoContainer">
            {selectedOrderInfo.items.map((element, index) => {
              return (
                <div className="inComingOrdersModalDetailedInfo" key={index}>
                  <text>{element.name}</text>
                  <text>Quantity: {element.quantity}</text>
                  <text>Cost: ${element.cost}</text>
                </div>
              );
            })}
          </div>
          {/* <div className="inComingOrdersModalMapContainer">
            <Map
              bootstrapURLKeys={{ key: GlobalStateHandler.myKey }}
              center={{
                lat: selectedOrderInfo.driverLocation.lat,
                lng: selectedOrderInfo.driverLocation.lng,
              }}
              options={() => {
                return {
                  zoomControl: false,
                  fullscreenControl: false,
                  rotateControl: false,
                  mapTypeControl: false,
                };
              }}
              zoom={13}
            >
              <img
                lat={selectedOrderInfo.driverLocation.lat}
                lng={selectedOrderInfo.driverLocation.lng}
                src="../img/Fetcher_Car.png"
                style={{
                  width: "20px",
                  transform:
                    "rotate(" +
                    selectedOrderInfo.driverLocation.heading +
                    "deg)",
                }}
              />
              <FaStore
                fontSize="400%"
                lat={GlobalStateHandler.businessLocation.latitude}
                lng={GlobalStateHandler.businessLocation.longitude}
              />
            </Map>
          </div> */}
        </Modal>
      ) : null}
    </div>
  );
};
export default InComingOrdersScreen;
