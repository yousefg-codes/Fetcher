import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { Dot } from "react-animated-dots";
import FirebaseFunctions from "../config/FirebaseFunctions";
import ProductItem from "./ProductItem";

const PastOrderObj = (props) => {
  const [loadingItems, setLoadingItems] = useState(false);
  const [shownItems, setShownItems] = useState([]);
  const [isFirstEffect, setIsFirstEffect] = useState(true);
  const [firstViewItemsClick, setFirstViewItemsClick] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    console.warn(props.identifier);
    console.warn(shownItems);
  }, [shownItems]);

  useEffect(() => {
    if (!loadingItems && !isFirstEffect) {
      // document.getElementById("pastOrders" + props.identifier).style.display =
      //   "flex";
    } else {
      setIsFirstEffect(false);
    }
  }, [loadingItems]);

  const showItems = async () => {
    setLoadingItems(true);
    if (shownItems.length > 0) {
      //console.warn("HAGHAGHAHGAHGAHGHAGHAHG");
      setLoadingItems(false);
      // document.getElementById("pastOrders" + props.identifier).style.display =
      //   "flex";
    } else {
      //console.warn("HOGOGOGOGOGOG");
      let products = await FirebaseFunctions.getProductsForOrder(props.items);
      setShownItems(products);
      setLoadingItems(false);
    }
  };

  return (
    <div className="pastOrderContainer">
      <div className="subContainer">
        <div style={{ display: "flex", flex: 0.5 }}>
          <h1 className="pastOrderInfo">{props.date}</h1>
        </div>
        <div className="wideInfoContainers">
          <h1 className="pastOrderInfo">Customer Name: {props.customerName}</h1>
          <h1 className="pastOrderInfo">Total Cost: ${props.totalCost}</h1>
        </div>
        <div className="wideInfoContainers">
          <h1 className="pastOrderInfo">Sales Tax: ${props.tax}</h1>
        </div>
        <div className="wideInfoContainers">
          <div className="itemsInfoContainer">
            <h1 className="pastOrderInfo">
              Number of Items: {props.items.length}
            </h1>
            <div className="customDropDown" key={props.key + " dropbox"}>
              <button
                onClick={async (event) => {
                  if (
                    !firstViewItemsClick ||
                    document.getElementById("pastOrders" + props.identifier)
                      .style.display === "none"
                  ) {
                    setDrawerOpen(true);
                    await showItems();
                    if (!firstViewItemsClick) {
                      setFirstViewItemsClick(true);
                    }
                  } else {
                    setDrawerOpen(false);
                    // document.getElementById(
                    //   "pastOrders" + props.identifier
                    // ).style.display = "none";
                  }
                }}
                className="viewItemsButton"
              >
                View Items
                <i
                  className={"fa fa-arrow-" + (!drawerOpen ? "right" : "down")}
                />
              </button>
              {drawerOpen ? (
                <div
                  id={"pastOrders" + props.identifier}
                  className="itemsDropDown"
                >
                  {loadingItems ? (
                    <div
                      className="noselect"
                      style={{
                        fontSize: "140px",
                        pointerEvents: "none",
                        color: "white",
                      }}
                    >
                      <Dot>.</Dot>
                      <Dot>.</Dot>
                      <Dot>.</Dot>
                    </div>
                  ) : (
                    shownItems.map((element, index) => {
                      console.warn(element.imageURL);
                      return (
                        <ProductItem
                          isInPastOrder
                          key={index + props.identifier}
                          inStock={element.inStock}
                          productId={element.productId}
                          imageURL={element.imageURL}
                          cost={element.cost}
                          categories={element.categories}
                          name={element.name}
                          description={element.description}
                        />
                      );
                    })
                  )}
                </div>
              ) : null}
            </div>
          </div>
          <h1 className="pastOrderInfo">Driver Name: {props.driverName}</h1>
        </div>
      </div>
    </div>
  );
};
export default PastOrderObj;
