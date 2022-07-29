import React, { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import ImageUploader from "react-images-upload";
import FirebaseFunctions from "../config/FirebaseFunctions";
import GlobalStateHandler from "../config/GlobalStateHandler";

const ProductItem = (props) => {
  const allCategories = [
    "Art & School Supplies",
    "Baked Goods",
    "Beverages",
    "Canned & Packaged Foods",
    "Clothing & Wearable Accessories",
    "Electronics & Electronic Accessories",
    "Fruits & Vegetables",
    "Outdoors & Garden",
    "Personal Hygiene",
    "Tools & Home",
  ];
  const [productId, setProductId] = useState(
    props.productId ? props.productId : ""
  );
  const [categories, setCategories] = useState(
    props.categories ? props.categories : []
  );
  const [isEditing, setIsEditing] = useState(
    props.isEditing ? props.isEditing : "none"
  );
  const [imageURL, setImageURL] = useState(
    props.imageURL ? props.imageURL : null
  );
  const [description, setDescription] = useState(
    props.description ? props.description : ""
  );
  const [cost, setCost] = useState(props.cost ? props.cost : -1);
  const [name, setName] = useState(props.name ? props.name : "");
  const [appliedTaxes, setAppliedTaxes] = useState(
    props.appliedTaxes ? props.appliedTaxes : []
  );
  const [firstTime, setFirstTime] = useState(true);
  const [secondFirst, setSecondFirst] = useState(true);
  const [inStock, setInStock] = useState(
    props.inStock !== undefined ? props.inStock : true
  );
  const [everythingFilled, setEverythingFilled] = useState(
    props.isEditing === "all" ? false : true
  );
  const [exists, setExists] = useState(true);
  const [firebaseUpdate, setFirebaseUpdate] = useState(false);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    console.log(name + " " + props.identifier);
    if (isEditing === "all") {
      setIsNew(true);
    }
    if (Object.prototype.toString.call(imageURL) === "[object Promise]") {
      imageURL.then((val) => {
        setImageURL(val);
      });
    }
    if (!props.isInPastOrder) {
      GlobalStateHandler.eventEmitter.addListener(
        "deleted" + name + cost,
        () => {
          props.onDelete(() => {}, {
            name,
            cost,
            description,
          });
        }
      );
      GlobalStateHandler.eventEmitter.addListener("editEveryProduct", () => {
        setIsEditing("everything");
      });
      GlobalStateHandler.eventEmitter.addListener(
        "doneEditingEveryProduct",
        () => {
          setIsEditing("none");
        }
      );
    }
  }, []);

  useEffect(() => {
    if (isEditing !== "all") {
      FirebaseFunctions.listenOnProduct(productId, (query) => {
        if (query.exists) {
          let data = query.data();
          setFirebaseUpdate(true);
          setCategories(data.categories);
          setDescription(data.description);
          setCost(data.cost);
          setName(data.name);
          setFirebaseUpdate(false);
        } else if (!props.isInPastOrder) {
          props.onDelete(() => {}, {
            name,
            cost,
            description,
          });
        } else {
          setExists(false);
        }
      });
      if (isNew) {
        props.onEditEnd({
          categories,
          name,
          description,
          imageURL,
          inStock,
          appliedTaxes,
          productId,
          cost: parseFloat(cost),
        });
      }
    }
  }, [productId]);

  useEffect(() => {
    console.warn(categories);
    if (!firebaseUpdate) {
      if (isEditing !== "all") {
        if (firstTime) {
          setFirstTime(false);
        } else {
          if (checkAllInfo()) {
            updateCurrentProductObj();
          }
        }
      } else {
        if (firstTime) {
          setFirstTime(false);
        } else {
          if (checkAllInfo()) {
            setEverythingFilled(true);
          } else {
            setEverythingFilled(false);
          }
        }
      }
    }
  }, [name, cost, description, categories, inStock, appliedTaxes]);

  useEffect(() => {
    if (isEditing === "all") {
      if (secondFirst) {
        setSecondFirst(false);
      } else {
        if (checkAllInfo()) {
          setEverythingFilled(true);
        } else {
          setEverythingFilled(false);
        }
      }
    }
  }, [imageURL]);

  const addNewProduct = async () => {
    const obj = {
      businessId: FirebaseFunctions.currentUser.uid,
      categories,
      name,
      description,
      cost: parseFloat(cost),
      lastRatingsIndex: 0,
      numReviews: 0,
      inStock,
      appliedTaxes,
      rating: 0,
      businessName: GlobalStateHandler.businessData.businessName,
    };
    let productId = await FirebaseFunctions.createNewProduct(obj, imageURL);
    setProductId(productId);
  };

  const updateCurrentProductImage = async (image) => {
    await FirebaseFunctions.updateSpecificProductImage(productId, image);
  };

  const updateCurrentProductObj = async () => {
    const obj = {
      categories,
      name,
      inStock,
      description,
      appliedTaxes,
      cost: parseFloat(cost),
    };
    await FirebaseFunctions.updateSpecificProductObj(productId, obj);
  };

  const checkAllInfo = () => {
    if (
      categories.length > 0 &&
      imageURL !== null &&
      description !== "" &&
      name !== "" &&
      cost !== -1 &&
      cost !== "" &&
      cost != "0"
    ) {
      try {
        parseFloat(cost);
      } catch (err) {
        return false;
      }
      return true;
    }
    return false;
  };
  if (!exists) {
    return (
      <div
        style={
          props.isInPastOrder
            ? {
                width: "200px",
                height: "150px",

                fontSize: "1vw",
                color: "red",
                fontWeight: "600",
                textAlign: "center",
              }
            : {}
        }
        className="productContainer"
      >
        This product no longer exists.
      </div>
    );
  }
  if (props.isLoading) {
    return (
      <div
        style={{ boxShadow: "none", backgroundColor: "grey" }}
        className="productContainer"
      ></div>
    );
  }
  return (
    <div
      style={
        props.isInPastOrder
          ? {
              width: "530px",
              height: "130px",
            }
          : {}
      }
      className="productContainer"
    >
      <input
        onChange={(event) => {
          if (event.target.files[0]) {
            var reader = new FileReader();
            reader.onload = (e) => {
              console.warn(e.target.result);
              setImageURL(e.target.result);
              if (isEditing !== "all") {
                updateCurrentProductImage(e.target.result);
              }
            };
            reader.readAsDataURL(event.target.files[0]);
          }
        }}
        id={"fileUploader" + props.identifier}
        style={{ display: "none" }}
        type="file"
        accept="image/*"
      />
      {imageURL !== null ? (
        <div
          onClick={() => {
            if (!props.isInPastOrder) {
              var fileUploader = document.getElementById(
                "fileUploader" + props.identifier
              );
              fileUploader.click();
            }
          }}
          style={{
            backgroundImage: "url(" + imageURL + ")",
            borderTopLeftRadius: props.isInPastOrder ? "5px" : "10px",
            borderBottomLeftRadius: props.isInPastOrder ? "5px" : "10px",
            flex: props.isInPastOrder ? 2 : 1.5,
          }}
          className="productImageContainer"
        />
      ) : (
        <div className="imageContainerWithAdd">
          <i
            onClick={() => {
              var fileUploader = document.getElementById(
                "fileUploader" + props.identifier
              );
              fileUploader.click();
            }}
            className="fa fa-plus fa-2x tabBtns addImage"
          >
            <h1 className="btnTxt">Add Product Image</h1>
          </i>
        </div>
      )}
      <div className="infoContainers" style={{ flex: 1.5 }}>
        <h1 className="headers">Name</h1>
        {isEditing === "name" ? (
          <div className="itemDetailsAnEditContainer">
            <input
              id={"nameInput" + props.identifier}
              defaultValue={name}
              style={{ width: "50%" }}
              className="inputs"
            ></input>
            <button
              style={{
                alignSelf: "center",
                backgroundColor: everythingFilled ? "green" : "red",
              }}
              onClick={() => {
                setName(
                  document.getElementById("nameInput" + props.identifier).value
                );
                setIsEditing("none");
              }}
              className="editPen"
            >
              {everythingFilled ? (
                <i style={{ color: "black" }} className="fa fa-check" />
              ) : (
                <i style={{ color: "black" }} className="fa fa-times" />
              )}
            </button>
          </div>
        ) : isEditing === "all" ? (
          <input
            onChange={(event) => {
              setName(event.target.value);
            }}
            defaultValue={name}
            style={{ width: "90%" }}
            className="inputs"
          ></input>
        ) : props.isInPastOrder ? (
          <div className="itemDetailsAnEditContainer">
            <div className="details" style={{ width: "50%" }}>
              {name}
            </div>
          </div>
        ) : (
          <div className="itemDetailsAnEditContainer">
            <div className="details" style={{ width: "50%" }}>
              {name}
            </div>
            <button
              onClick={() => {
                setIsEditing("name");
              }}
              className="editPen"
            >
              <i className="fa fa-pencil" />
            </button>
          </div>
        )}
      </div>
      {props.isInPastOrder ? null : (
        <div
          className="infoContainers"
          style={{ justifyContent: "center", flex: 1.2 }}
        >
          <Dropdown>
            <Dropdown.Toggle className="dropDown">
              Categories
              <i className="fa fa-caret-down" />
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropDownMenu">
              {allCategories.map((value, index) => (
                <Dropdown.Item
                  key={index}
                  className="dropDownItem"
                  onClick={(event) => {
                    event.nativeEvent.stopImmediatePropagation();
                    event.preventDefault();
                    event.stopPropagation();
                    event.nativeEvent.stopPropagation();
                  }}
                  onSelect={(event) => {
                    if (!props.isInPastOrder) {
                      let categoriesCopy = categories.slice();
                      if (categoriesCopy.includes(value)) {
                        categoriesCopy.splice(categoriesCopy.indexOf(value), 1);
                      } else {
                        categoriesCopy.push(value);
                      }
                      setCategories(categoriesCopy);
                    }
                  }}
                >
                  {value}
                  {categories.includes(value) ? (
                    <i className="fa fa-check" style={{ marginLeft: "2vw" }} />
                  ) : null}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      )}
      <div className="infoContainers">
        <h1 className="headers">Short Description</h1>
        {isEditing === "description" ? (
          <div className="itemDetailsAnEditContainer">
            <input
              id={"descriptionInput" + props.identifier}
              defaultValue={description}
              className="inputs"
              type="text"
              aria-rowcount={1}
            ></input>
            <button
              style={{
                alignSelf: "center",
                backgroundColor: everythingFilled ? "green" : "red",
              }}
              onClick={() => {
                setDescription(
                  document.getElementById("descriptionInput" + props.identifier)
                    .value
                );
                setIsEditing("none");
              }}
              className="editPen"
            >
              {everythingFilled ? (
                <i style={{ color: "black" }} className="fa fa-check" />
              ) : (
                <i style={{ color: "black" }} className="fa fa-times" />
              )}
            </button>
          </div>
        ) : isEditing === "all" ? (
          <input
            onChange={(event) => {
              setDescription(event.target.value);
            }}
            defaultValue={description}
            className="inputs"
            type="text"
            aria-rowcount={1}
          ></input>
        ) : props.isInPastOrder ? (
          <div className="itemDetailsAnEditContainer">
            <p className="details" style={{ width: "70%" }}>
              {description}
            </p>
          </div>
        ) : (
          <div className="itemDetailsAnEditContainer">
            <p className="details" style={{ width: "70%" }}>
              {description}
            </p>
            <button
              onClick={() => {
                setIsEditing("description");
              }}
              className="editPen"
            >
              <i className="fa fa-pencil" />
            </button>
          </div>
        )}
      </div>
      <div className="infoContainers" style={{ flex: 1 }}>
        <h1 className="headers">Cost</h1>
        <div className="costContainer">
          <h1 className="headers" style={{ marginTop: 0, marginBottom: 0 }}>
            $
          </h1>
          {isEditing === "cost" ? (
            <div className="itemDetailsAnEditContainer">
              <input
                id={"costInput" + props.identifier}
                defaultValue={cost}
                className="costInput inputs"
                type="text"
                aria-rowcount={1}
              ></input>
              <button
                style={{
                  alignSelf: "center",
                  backgroundColor: everythingFilled ? "green" : "red",
                }}
                onClick={() => {
                  setCost(
                    document.getElementById("costInput" + props.identifier)
                      .value
                  );
                  setIsEditing("none");
                }}
                className="editPen"
              >
                {everythingFilled ? (
                  <i style={{ color: "black" }} className="fa fa-check" />
                ) : (
                  <i style={{ color: "black" }} className="fa fa-times" />
                )}
              </button>
            </div>
          ) : isEditing === "all" ? (
            <input
              onChange={(event) => {
                setCost(event.target.value);
              }}
              defaultValue={cost}
              className="costInput inputs"
              type="number"
              aria-rowcount={1}
            ></input>
          ) : props.isInPastOrder ? (
            <div className="itemDetailsAnEditContainer">
              <div className="details">{cost}</div>
            </div>
          ) : (
            <div className="itemDetailsAnEditContainer">
              <div className="details">{cost}</div>
              <button
                onClick={() => {
                  setIsEditing("cost");
                }}
                className="editPen"
              >
                <i className="fa fa-pencil" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div
        className="infoContainers"
        style={{ justifyContent: "center", flex: 1.2 }}
      >
        {props.isInPastOrder ? null : (
          <button
            onClick={() => {
              setInStock(!inStock);
            }}
            style={
              inStock
                ? {
                    backgroundColor: "green",
                    border: "1px solid green",
                  }
                : {
                    backgroundColor: "red",
                    border: "1px solid red",
                  }
            }
            className="inStockBtn"
          >
            {inStock ? "In Stock" : "Out of Stock"}
          </button>
        )}
      </div>
      <div
        className="infoContainers"
        style={{ justifyContent: "center", flex: 1.2 }}
      >
        {props.isInPastOrder ? null : (
          <div
            className="infoContainers"
            style={{ justifyContent: "center", flex: 1.2 }}
          >
            <Dropdown>
              <Dropdown.Toggle className="dropDown" style={{ width: "9vw" }}>
                Applied Taxes
                <i className="fa fa-caret-down" />
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropDownMenu taxesDropDownMenu">
                <div style={{ backgroundColor: "#fff6ef", paddingTop: "1vh" }}>
                  Local Taxes
                </div>
                {GlobalStateHandler.businessData.taxes.localTaxes.map(
                  (value, index) => (
                    <Dropdown.Item
                      key={index + "taxes"}
                      className="dropDownItem dropDownTax"
                      onClick={(event) => {
                        event.nativeEvent.stopImmediatePropagation();
                        event.preventDefault();
                        event.stopPropagation();
                        event.nativeEvent.stopPropagation();
                      }}
                      onSelect={(event) => {
                        if (!props.isInPastOrder) {
                          let copy = appliedTaxes.slice();
                          if (copy.includes(value)) {
                            copy.splice(copy.indexOf(value.id), 1);
                          } else {
                            copy.push(value.id);
                          }
                          setAppliedTaxes(copy);
                        }
                      }}
                    >
                      {value.name}
                      {appliedTaxes.includes(value.id) ? (
                        <i
                          className="fa fa-check"
                          style={{ marginLeft: "2vw" }}
                        />
                      ) : null}
                    </Dropdown.Item>
                  )
                )}
                <div style={{ backgroundColor: "#fff6ef", paddingTop: "1vh" }}>
                  State Taxes
                </div>
                {GlobalStateHandler.businessData.taxes.stateTaxes.map(
                  (value, index) => (
                    <Dropdown.Item
                      key={index + "taxes2"}
                      className="dropDownItem dropDownTax"
                      onClick={(event) => {
                        event.nativeEvent.stopImmediatePropagation();
                        event.preventDefault();
                        event.stopPropagation();
                        event.nativeEvent.stopPropagation();
                      }}
                      onSelect={(event) => {
                        if (!props.isInPastOrder) {
                          let copy = appliedTaxes.slice();
                          if (copy.includes(value)) {
                            copy.splice(copy.indexOf(value.id), 1);
                          } else {
                            copy.push(value.id);
                          }
                          setAppliedTaxes(copy);
                        }
                      }}
                    >
                      {value.name}
                      {appliedTaxes.includes(value.id) ? (
                        <i
                          className="fa fa-check"
                          style={{ marginLeft: "2vw" }}
                        />
                      ) : null}
                    </Dropdown.Item>
                  )
                )}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        )}
      </div>
      {isEditing === "all" ? (
        <button
          style={{
            alignSelf: "center",
            backgroundColor: everythingFilled ? "green" : "red",
          }}
          onClick={async () => {
            if (everythingFilled) {
              setIsEditing("none");
              addNewProduct();
            } else {
              props.onDelete(() => {}, {
                name,
                cost,
                description,
              });
            }
          }}
          className="editPen"
        >
          {everythingFilled ? (
            <i style={{ color: "black" }} className="fa fa-check" />
          ) : (
            <i style={{ color: "black" }} className="fa fa-times" />
          )}
        </button>
      ) : null}
      {isEditing === "everything" ? (
        <button
          className="deleteButton"
          onClick={() => {
            //console.warn(props.onDelete)
            props.onDelete(
              async () => {
                await FirebaseFunctions.removeProduct(productId)
                  .then(() => {
                    GlobalStateHandler.eventEmitter.emit(
                      "deleted" + name + cost
                    );
                  })
                  .catch((err) => {
                    console.error(err);
                  });
              },
              {
                name,
                cost,
                description,
              }
            );
          }}
        >
          <i className="fa fa-trash fa-2x" style={{ color: "red" }} />
        </button>
      ) : null}
    </div>
  );
};
export default ProductItem;
