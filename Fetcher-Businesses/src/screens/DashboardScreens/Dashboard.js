import React, { useEffect, useState, useCallback } from "react";
import FirebaseFunctions from "../../config/FirebaseFunctions";
import { Redirect } from "react-router-dom";
import HomeScreen from "./HomeScreen";
import OrdersScreen from "./OrdersScreen";
import FinancialsScreen from "./FinancialsScreens/FinancialsScreen";
import ProductsScreen from "./ProductsScreen";
import calculateEarnings from "../../config/calculateEarnings";
import SettingsScreen from "./SettingsScreens/SettingsScreen";
import InComingOrdersScreen from "./InComingOrdersScreen";
import GlobalStateHandler from "../../config/GlobalStateHandler";
import ProductItem from "../../components/ProductItem";
import { showShouldDeleteModal } from "../../components/ShouldDeleteModal";
import {
  FaCarSide,
  FaFacebook,
  FaHome,
  FaInstagram,
  FaCar,
  FaLinkedinIn,
  FaLock,
  FaMobile,
  FaMoneyBill,
  FaStore,
  FaTwitter,
  FaYoutube,
  FaShoppingBasket,
  FaList,
  FaDollarSign,
  FaCog,
  FaTag,
  FaTags,
  FaBoxes,
} from "react-icons/fa";
import { propTypes } from "react-bootstrap/esm/Image";
import App from "../../App";
import Modal from "react-modal";

//This is the parent container of the dashboard
//screens and handles all their state changes, as well as
//their interactions with Firebase
const Dashboard = (props) => {
  const [shownProducts, setShownProducts] = useState([]);
  const [currScreen, setCurrScreen] = useState("home");
  const [pastOrders, setPastOrders] = useState([]);
  const [oldestDocId, setOldestDocId] = useState(-1);
  const [imageURL, setImageURL] = useState(null);
  const [addingNewProduct, setAddingNewProduct] = useState(false);
  const [currentFilter, setCurrentFilter] = useState("none");
  const [isLoading, setIsLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [didUseEffect, setDidUseEffect] = useState(false);
  const [displayedEarnings, setDisplayedEarnings] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [productData, setProductData] = useState([]);
  const [products, setProducts] = useState([]);
  const [incomingOrders, setIncomingOrders] = useState([]);
  const [showUnVerModal, setShowUnVerModal] = useState(
    GlobalStateHandler.businessData.verified
  );

  const changePageTo = (page) => {
    setCurrScreen(page);
  };

  //The Below methods take care of all the operations
  //for the orders screen
  const pastOrdersRefresh = (docData, docId) => {
    setPastOrders((pastOrders) => {
      setRecentOrders([
        ...recentOrders,
        docData.orders[docData.orders.length - 1],
      ]);
      let copy = pastOrders.slice();
      console.warn(docData.orders);
      console.warn(pastOrders);
      for (var i = 0; i < pastOrders.length; i++) {
        if (docId === pastOrders[i].docId) {
          copy[i] = { docId, pastOrders: docData.orders };
          return copy;
        }
      }
    });
  };

  const addToPastOrders = (docData, docId, isOldDoc) => {
    setPastOrders((pastOrders) => {
      if (pastOrders.length === 0) {
        if (docData.orders.length === 1) {
          setRecentOrders([docData.orders[docData.orders.length - 1]]);
        } else if (docData.orders.length >= 2) {
          setRecentOrders([
            docData.orders[docData.orders.length - 2],
            docData.orders[docData.orders.length - 1],
          ]);
        }
      }
      let copy = pastOrders.slice();
      setOldestDocId((oldestDocId) => {
        if (docId < oldestDocId) {
          return parseInt(docId);
        }
        return oldestDocId;
      });
      if (isOldDoc) {
        copy.unshift({ docId, pastOrders: docData.orders });
        return copy;
      }
      copy.push({ docId, pastOrders: docData.orders });
      return copy;
    });
    setIsLoading(false);
  };

  const loadOldOrders = async () => {
    if (oldestDocId - 1 < 0) {
      return;
    }
    await FirebaseFunctions.loadPastOrder(
      oldestDocId - 1,
      (docData, docId) => pastOrdersRefresh(docData, docId),
      (docData, docId, isOldDoc) => addToPastOrders(docData, docId, isOldDoc),
      true
    );
  };

  const asyncUseEffectOrders = async () => {
    let lastOrderIndex = GlobalStateHandler.businessData.lastOrderIndex;
    await FirebaseFunctions.loadPastOrder(
      lastOrderIndex,
      pastOrdersRefresh,
      addToPastOrders,
      false
    );
    if (lastOrderIndex > 0) {
      await FirebaseFunctions.loadPastOrder(
        lastOrderIndex - 1,
        pastOrdersRefresh,
        addToPastOrders,
        true
      );
    }
    FirebaseFunctions.checkForNewPastOrderDocs(
      pastOrdersRefresh,
      addToPastOrders
    );
    setOldestDocId(lastOrderIndex);
  };
  //The methods below take care of all the operations of the
  //(to be) earnings screen and graph on the home screen
  const earningsRefresh = (docData, docId) => {
    setEarnings((earnings) => {
      let copy = earnings.slice();
      for (var i = 0; i < earnings.length; i++) {
        if (docId === earnings[i].docId) {
          copy[i] = { docId, earnings: docData.earnings };
          return copy;
        }
      }
      return copy;
    });
  };
  const addToEarnings = (docData, docId, isOldDoc) => {
    if (!isOldDoc) {
      setEarnings((earnings) => {
        let copy = earnings.slice();
        copy.push({ docId, earnings: docData.earnings });
        return copy;
      });
    } else {
      setEarnings((earnings) => {
        let copy = earnings.slice();
        copy.unshift({ docId, earnings: docData.earnings });
        return copy;
      });
    }
  };
  const getDayString = (number) => {
    if (number == 1) {
      return "Monday";
    } else if (number == 2) {
      return "Tuesday";
    } else if (number == 3) {
      return "Wednesday";
    } else if (number == 4) {
      return "Thursday";
    } else if (number == 5) {
      return "Friday";
    } else if (number == 6) {
      return "Saturday";
    } else if (number == 0) {
      return "Sunday";
    }
  };
  const asyncUseEffectEarnings = async () => {
    let lastEarningsIndex = GlobalStateHandler.businessData.lastEarningsIndex;
    await FirebaseFunctions.loadEarnings(
      lastEarningsIndex,
      (docData, docId) => earningsRefresh(docData, docId),
      (docData, docId, isOldDoc) => addToEarnings(docData, docId, isOldDoc),
      false
    );
    if (lastEarningsIndex - 1 >= 0) {
      await FirebaseFunctions.loadEarnings(
        lastEarningsIndex - 1,
        (docData, docId) => earningsRefresh(docData, docId),
        (docData, docId, isOldDoc) => addToEarnings(docData, docId, isOldDoc),
        true
      );
    }
    FirebaseFunctions.checkForNewEarningsDocs(
      (docData, docId) => earningsRefresh(docData, docId),
      (docData, docId, isOldDoc) => addToEarnings(docData, docId, isOldDoc)
    );
  };

  //The following methods all handle the products screen's operations
  const asyncUseEffectProducts = async () => {
    let newProducts = (await FirebaseFunctions.getProducts(20)).docs;
    let newProductData = [];
    for (var i = 0; i < newProducts.length; i++) {
      let imageURL = await FirebaseFunctions.getProductImage(newProducts[i].id);
      let data = newProducts[i].data();
      newProductData[i] = { ...data, imageURL };
      const component = (
        <ProductItem
          identifier={i}
          onDelete={(callBack) => {
            showShouldDeleteModal(async () => {
              await callBack();
              let index;
              setProducts((products) => {
                let productsCopy2 = products.slice();
                index = productsCopy2.findIndex((element) => {
                  return element === component;
                });
                //console.warn(index)
                productsCopy2.splice(index, 1);
                setShownProducts(productsCopy2.slice().reverse());
                return productsCopy2;
              });
              setProductData((productData) => {
                let productsCopy3 = productData.slice();
                productsCopy3.splice(index, 1);
                return productsCopy3;
              });
            });
          }}
          key={i + data.name + data.description}
          inStock={data.inStock}
          productId={newProducts[i].id}
          imageURL={imageURL}
          cost={data.cost}
          appliedTaxes={data.appliedTaxes}
          categories={data.categories}
          name={data.name}
          description={data.description}
        />
      );
      newProducts[i] = component;
    }
    setProductData(newProductData);
    setProducts(newProducts);
    setShownProducts(newProducts.slice().reverse());
    setIsLoading(false);
  };
  const onPressShowMore = async () => {
    let newProducts = (
      await FirebaseFunctions.getProducts(products.length + 20)
    ).docs;
    let newArr = [];
    let newProductsData = [];
    for (var i = products.length; i < newProducts.length; i++) {
      let imageURL = await FirebaseFunctions.getProductImage(newProducts[i].id);
      let data = newProducts[i].data();
      let copy = i;
      newProductsData[i] = { ...data, imageURL };
      newArr.push(
        <ProductItem
          identifier={i}
          onDelete={(callBack) => {
            showShouldDeleteModal(async () => {
              await callBack();
              setProducts((products) => {
                let productsCopy = products.slice();
                productsCopy.splice(copy, 1);
                setShownProducts(productsCopy.slice().reverse());
                return productsCopy;
              });
              setProductData((productData) => {
                let productsCopy3 = productData.slice();
                productsCopy3.splice(copy, 1);
                return productsCopy3;
              });
            });
          }}
          key={i + data.name + data.description}
          inStock={data.inStock}
          productId={products[i].id}
          imageURL={imageURL}
          appliedTaxes={data.appliedTaxes}
          cost={data.cost}
          categories={data.categories}
          name={data.name}
          description={data.description}
        />
      );
    }
    let copy = products.slice();
    copy.concat(newArr);
    setProductData(newProductsData);
    setProducts(newProducts);
    setShownProducts(newProducts.slice().reverse());
  };
  useEffect(() => {
    console.warn("PRODUCTS");
    console.warn(products);
  }, [products]);
  const addNewProduct = () => {
    setAddingNewProduct(true);
    let productsCopy = products.slice();
    let component = (
      <ProductItem
        onEditEnd={(data) => {
          let index;
          setProducts((products) => {
            let productsCopy2 = products.slice();
            index = productsCopy2.findIndex((element) => {
              return element === component;
            });
            let finishedComponent = (
              <ProductItem
                identifier={index + data.name + data.description}
                onDelete={(callBack) => {
                  showShouldDeleteModal(async () => {
                    await callBack();
                    let index;
                    setProducts((products) => {
                      let productsCopy3 = products.slice();
                      index = productsCopy3.findIndex((element) => {
                        return element === finishedComponent;
                      });
                      //console.warn(index)
                      productsCopy3.splice(index, 1);
                      setShownProducts(productsCopy3.slice().reverse());
                      return productsCopy3;
                    });
                    setProductData((productData) => {
                      let productsCopy4 = productData.slice();
                      productsCopy4.splice(index, 1);
                      return productsCopy4;
                    });
                  });
                }}
                key={index + data.name + data.description}
                inStock={data.inStock}
                productId={data.productId}
                imageURL={data.imageURL}
                appliedTaxes={data.appliedTaxes}
                cost={data.cost}
                categories={data.categories}
                name={data.name}
                description={data.description}
              />
            );
            productsCopy2[index] = finishedComponent;
            return productsCopy2;
          });
          setProductData((productData1) => {
            let productData2 = productData1.slice();
            productData2[index] = data;
            return productData2;
          });
          setAddingNewProduct(false);
        }}
        identifier={productsCopy.length}
        onDelete={(callBack) => {
          showShouldDeleteModal(async () => {
            await callBack();
            let index;
            setProducts((products) => {
              let productsCopy2 = products.slice();
              index = productsCopy2.findIndex((element) => {
                return element === component;
              });
              console.warn(index);
              productsCopy2.splice(index, 1);
              console.warn(productsCopy2);
              setShownProducts(productsCopy2.slice().reverse());
              return productsCopy2;
            });
            setProductData((productData) => {
              let productsCopy3 = productData.slice();
              productsCopy3.splice(index, 1);
              return productsCopy3;
            });
            setAddingNewProduct(false);
          });
        }}
        key={productsCopy.length + 1}
        isEditing={"all"}
      />
    );
    productsCopy.push(component);
    console.warn(productsCopy);
    setProducts(productsCopy);
    setShownProducts(productsCopy.slice().reverse());
  };
  const filterCurrentProductsByCategory = (categories) => {
    let filtered = [];
  };

  const showSearchedFilteredProducts = async (products) => {
    for (var i = 0; i < products.length; i++) {
      console.error(products[i]);
      let imageURL = await FirebaseFunctions.getProductImage(products[i].id);
      let data = products[i];
      let component = (
        <ProductItem
          key={i + data.name + data.description}
          onDelete={(callBack, data) => {
            showShouldDeleteModal(async () => {
              setShownProducts((shownProducts) => {
                let productsCopy = shownProducts.slice();
                let index = productsCopy.findIndex((element) => {
                  return element === component;
                });
                productsCopy.splice(index, 1);
                return productsCopy;
              });
              await callBack();
              let index;
              setProductData((productData) => {
                index = productData.findIndex((element) => {
                  return (
                    element.name === data.name && element.cost === data.cost
                  );
                });
                productData.splice(index, 1);
                return productData;
              });
              setProducts((products) => {
                products.splice(index, 1);
                return products;
              });
            });
          }}
          inStock={data.inStock}
          productId={products[i].id}
          imageURL={imageURL}
          cost={data.cost}
          categories={data.categories}
          name={data.name}
          description={data.description}
          appliedTaxes={data.appliedTaxes}
        />
      );
      products[i] = component;
    }
    // Promise.all(products).then(values => {
    //     products = values;
    // })
    setShownProducts(products);
  };

  //The following methods take care of all the operations for
  //the incomingOrders screen
  const initializeIncomingOrders = async () => {
    let temp = incomingOrders.slice();
    for (
      let i = 0;
      i < GlobalStateHandler.businessData.incomingOrders.length;
      i++
    ) {
      let copy = i;
      let queryData = await FirebaseFunctions.getOrder(
        GlobalStateHandler.businessData.incomingOrders[i]
      );
      let unsub = FirebaseFunctions.listenOnDriverDoc(
        queryData.driver.docId,
        (driverQueryData) => {
          let temp2 = temp;
          temp2[copy] = {
            ...temp2[copy],
            driverLocation: {
              lat: driverQueryData.currentLocation.latitude,
              lng: driverQueryData.currentLocation.longitude,
              heading: driverQueryData.currentLocation.heading,
            },
          };
          setIncomingOrders(temp2);
        }
      );
      let tempItems = [];
      for (let j = 0; j < queryData.orderInfo.items.length; j++) {
        tempItems.push({
          ...queryData.orderInfo.items[j].item,
          imagePath: queryData.orderInfo.items[j].imagePath,
          quantity: queryData.orderInfo.items[j].quantity,
        });
      }
      temp[copy] = {
        unsubFromDriverListener: unsub,
        progress: "NOT READY",
        driverName: queryData.driver.driverData.name,
        orderId: GlobalStateHandler.businessData.incomingOrders[copy],
        totalCost: queryData.orderInfo.totalCost,
        items: tempItems,
      };
      Notification.requestPermission((permitted) => {
        if (permitted === "granted") {
          var options = {
            body:
              "orderId: " +
              GlobalStateHandler.businessData.incomingOrders[copy],
            icon: "../img/Fetcher_Logo.png",
            dir: "ltr",
          };
          new Notification("NEW ORDER", options);
          playNotificationSound();
        } else {
          App.addNotification(
            "NEW ORDER",
            "orderId: " + GlobalStateHandler.businessData.incomingOrders[copy]
          );
        }
      });
    }
    setIncomingOrders(temp);
  };
  const playNotificationSound = () => {
    const sound = new Audio("../sounds/that-was-quick.mp3");
    sound.play();
  };
  useEffect(() => {
    if (FirebaseFunctions.currentUser !== null) {
      GlobalStateHandler.eventEmitter.removeAllListeners("businessDataChanged");
      GlobalStateHandler.eventEmitter.addListener(
        "businessDataChanged",
        async () => {
          let temp = incomingOrders.slice();
          console.warn(GlobalStateHandler.businessData.incomingOrders.length);
          console.warn(incomingOrders.length);
          if (
            GlobalStateHandler.businessData.incomingOrders.length >
            incomingOrders.length
          ) {
            let queryData = await FirebaseFunctions.getOrder(
              GlobalStateHandler.businessData.incomingOrders[
                incomingOrders.length
              ]
            );
            let index = temp.length;
            let unsub = FirebaseFunctions.listenOnDriverDoc(
              queryData.driver.docId,
              (driverQueryData) => {
                let temp2 = temp;
                temp2[index] = {
                  ...temp2[index],
                  driverLocation: {
                    lat: driverQueryData.currentLocation.latitude,
                    lng: driverQueryData.currentLocation.longitude,
                    heading: driverQueryData.currentLocation.heading,
                  },
                };
                setIncomingOrders(temp2);
              }
            );
            let tempItems = [];
            for (let j = 0; j < queryData.orderInfo.items.length; j++) {
              tempItems.push({
                ...queryData.orderInfo.items[j].item,
                imagePath: queryData.orderInfo.items[j].imagePath,
                quantity: queryData.orderInfo.items[j].quantity,
              });
            }
            temp[temp.length] = {
              unsubFromDriverListener: unsub,
              progress: "NOT READY",
              driverId: queryData.driver.docId,
              driverName: queryData.driver.driverData.name,
              orderId: GlobalStateHandler.businessData.incomingOrders[index],
              totalCost: queryData.orderInfo.totalCost,
              items: tempItems,
            };
            Notification.requestPermission((permitted) => {
              if (permitted === "granted") {
                var options = {
                  body:
                    "orderId: " +
                    GlobalStateHandler.businessData.incomingOrders[index],
                  icon: "../img/Fetcher_Logo.png",
                  dir: "ltr",
                };
                new Notification("NEW ORDER", options);
                playNotificationSound();
              } else {
                App.addNotification(
                  "NEW ORDER",
                  "orderId: " +
                    GlobalStateHandler.businessData.incomingOrders[index]
                );
              }
            });
          } else if (
            GlobalStateHandler.businessData.incomingOrders.length <
            incomingOrders.length
          ) {
            let orderIdSet = new Set();
            for (
              let i = 0;
              i < GlobalStateHandler.businessData.incomingOrders.length;
              i++
            ) {
              orderIdSet.add(GlobalStateHandler.businessData.incomingOrders[i]);
            }
            for (let i = 0; i < temp.length; i++) {
              if (!orderIdSet.has(temp[i].orderId)) {
                console.warn(temp[i]);
                temp[i].unsubFromDriverListener();
                temp.splice(i, 1);
                for (let j = i; j < temp.length; j++) {
                  let copy = j;
                  temp[j].unsubFromDriverListener();
                  let unsub = FirebaseFunctions.listenOnDriverDoc(
                    temp[j].driverId,
                    (driverQueryData) => {
                      let temp2 = temp;
                      temp2[copy].driverLocation = {
                        lat: driverQueryData.currentLocation.latitude,
                        lng: driverQueryData.currentLocation.longitude,
                        heading: driverQueryData.currentLocation.heading,
                      };
                      temp2[copy].unsubFromDriverListener = unsub;
                      setIncomingOrders(temp2);
                    }
                  );
                }
                setIncomingOrders(temp);
                break;
              }
            }
          }
        }
      );
    }
  }, [incomingOrders]);
  const asyncUseEffectSettings = async () => {
    setImageURL(await FirebaseFunctions.getBusinessLogo());
  };
  //We call all the screens' useEffects below
  useEffect(() => {
    if (FirebaseFunctions.currentUser !== null) {
      initializeIncomingOrders();
      asyncUseEffectProducts();
      asyncUseEffectOrders();
      asyncUseEffectSettings();
    }
  }, []);
  useEffect(() => {
    if (FirebaseFunctions.currentUser !== null) {
      if (!didUseEffect) {
        asyncUseEffectEarnings();
        setDidUseEffect(true);
      } else {
        console.log(earnings);
        setDisplayedEarnings(
          calculateEarnings(earnings).map((element, index) => {
            return {
              name: getDayString(index),
              earning: element,
            };
          })
        );
      }
    }
  }, [earnings]);

  //console.error(FirebaseFunctions.fetcherAuth.currentUser)
  if (FirebaseFunctions.currentUser === null) {
    return <Redirect to="/login" />;
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        height: "100vh",
        overflowY: "hidden",
      }}
    >
      <div className="displayScreen">
        {currScreen === "financials" ? (
          <FinancialsScreen displayedEarnings={displayedEarnings} />
        ) : null}
        {currScreen === "home" ? (
          <HomeScreen
            recentOrders={recentOrders}
            displayedEarnings={displayedEarnings}
          />
        ) : null}
        {currScreen === "orders" ? (
          <OrdersScreen
            oldestDocId={oldestDocId}
            pastOrders={pastOrders}
            loadOldOrders={loadOldOrders}
          />
        ) : null}
        {currScreen === "inComingOrders" ? (
          <InComingOrdersScreen
            incomingOrders={incomingOrders}
            changeProgress={(index, value) => {
              let temp = incomingOrders.slice();
              temp[index].progress = value;
              setIncomingOrders(temp);
            }}
          />
        ) : null}
        {/* <AccountScreen/> */}
        {currScreen === "settings" ? (
          <SettingsScreen
            imageURL={imageURL}
            onImageChange={(newImage) => {
              setImageURL(newImage);
            }}
            history={props.history}
          />
        ) : null}
        {currScreen === "products" ? (
          <ProductsScreen
            showSearchedFilteredProducts={showSearchedFilteredProducts.bind(
              this
            )}
            setShownProducts={setShownProducts.bind(this)}
            products={products}
            addingNewProduct={addingNewProduct}
            addNewProduct={addNewProduct.bind(this)}
            shownProducts={shownProducts}
            onPressShowMore={onPressShowMore.bind(this)}
          />
        ) : null}
      </div>
      <div className="sideTabNavigator">
        <i
          style={currScreen === "home" ? { opacity: 0.7 } : {}}
          onClick={() => changePageTo("home")}
          className="tabBtns"
        >
          <FaHome fontSize="3.5vh" />
          <div className="btnTxt">Home</div>
        </i>
        <div className="dashboardNavSeparators" />
        <i
          style={currScreen === "inComingOrders" ? { opacity: 0.7 } : {}}
          onClick={() => changePageTo("inComingOrders")}
          className="tabBtns"
        >
          <FaCar fontSize="3.5vh" />
          <div className="btnTxt">Incoming Orders</div>
        </i>
        <div className="dashboardNavSeparators" />
        <i
          style={currScreen === "products" ? { opacity: 0.7 } : {}}
          onClick={() => changePageTo("products")}
          className="tabBtns"
        >
          <FaBoxes fontSize="3.5vh" />
          <div className="btnTxt">Products</div>
        </i>
        <div className="dashboardNavSeparators" />
        <i
          style={currScreen === "orders" ? { opacity: 0.7 } : {}}
          onClick={() => changePageTo("orders")}
          className="tabBtns"
        >
          <FaList fontSize="3.5vh" />
          <div className="btnTxt">Past Orders</div>
        </i>
        <div className="dashboardNavSeparators" />
        <i
          style={currScreen === "financials" ? { opacity: 0.7 } : {}}
          onClick={() => changePageTo("financials")}
          className="tabBtns"
        >
          <FaDollarSign fontSize="3.5vh" />
          <div className="btnTxt">Financials</div>
        </i>
        <div className="dashboardNavSeparators" />
        <i
          style={currScreen === "settings" ? { opacity: 0.7 } : {}}
          onClick={() => changePageTo("settings")}
          className="tabBtns"
        >
          <FaCog fontSize="3.5vh" />
          <div className="btnTxt">Settings</div>
        </i>
        <div style={{ height: "40%", width: "100%" }} />
        {/* <i style={{opacity: currScreen === 'settings' ? 0.7 : 1.0 }} onClick={() => changePageTo('settings')} className="fa fa-gear fa-2x tabBtns"><h1 className="btnTxt">Settings</h1></i> */}
      </div>
      {showUnVerModal ? null : (
        <Modal isOpen={true} className="unVerifiedModal">
          You are currently Unverified
          <div className="unVerifiedModalTxt">
            Once you have been verified, you can start adding products and set
            your status to Open.
          </div>
          <button
            onClick={() => {
              setShowUnVerModal(true);
            }}
            className="unVerifiedModalOkBtn"
          >
            Ok
          </button>
        </Modal>
      )}
    </div>
  );
};
export default Dashboard;
