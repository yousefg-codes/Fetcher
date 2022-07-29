import React, { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import ProductItem from "../../components/ProductItem";
import FirebaseFunctions from "../../config/FirebaseFunctions";
import GlobalStateHandler from "../../config/GlobalStateHandler";
import { showShouldDeleteModal } from "../../components/ShouldDeleteModal";
import { Dot } from "react-animated-dots";

const ProductsScreen = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isEditingAll, setIsEditingAll] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [tax, setTax] = useState(100 * GlobalStateHandler.businessData.tax);
  const [usedEffect, setUsedEffect] = useState(false);
  const [isEditingTax, setIsEditingTax] = useState(false);
  // if(isLoading){
  //     return (
  //         <div id="products" className="page">
  //             <i style={{color: 'gray'}} className="fa fa-plus fa-2x tabBtns addProductBtn">
  //             </i>
  //             <div style={{alignSelf: 'center', marginTop: '10%'}}>
  //                 {/* <ProductItem isLoading/>
  //                 <ProductItem isLoading/>
  //                 <ProductItem isLoading/>
  //                 <ProductItem isLoading/>
  //                 <ProductItem isLoading/> */}
  //             </div>
  //         </div>
  //     )
  // }
  useEffect(() => {
    if (usedEffect) {
      let taxNum = parseFloat(tax) / 100;
      FirebaseFunctions.updateBusinessInfo({ tax: taxNum });
    } else {
      setUsedEffect(true);
    }
  }, [tax]);
  const renderShowMore = () => {
    console.log(props.products.length);
    console.log(GlobalStateHandler.businessData.numProducts);
    if (props.products.length >= GlobalStateHandler.businessData.numProducts) {
      return null;
    }
    return (
      <div className="showMoreProductsContainer">
        <h1
          onClick={() => {
            props.onPressShowMore();
          }}
          className="showMoreProducts"
        >
          Show More
        </h1>
      </div>
    );
  };
  return (
    <div id="products" className="page">
      <div className="topSearchBar">
        <div className="searchIconInputContainer">
          <div
            className="searchIconContainer"
            onClick={async () => {
              let searchVal = document.getElementById("searchInput").value;
              if (searchVal !== "") {
                setHasSearched(true);
                let products = await FirebaseFunctions.callFunction(
                  "searchByName",
                  {
                    name: searchVal,
                    businessId: FirebaseFunctions.currentUser.uid,
                  }
                );
                props.showSearchedFilteredProducts(products);
                setHasSearched(false);
              }
            }}
          >
            <i style={{ color: "white" }} className="fa fa-search" />
          </div>
          <input
            onChange={(event) => {
              if (event.target.value === "") {
                props.setShownProducts(props.products);
                setIsSearching(false);
                setIsEditingAll(false);
              } else {
                setIsSearching(true);
              }
            }}
            placeholder="Search by Name"
            onKeyPress={async (event) => {
              if (!event) {
                event = window.event;
              }
              let keyCode = event.keyCode || event.which;
              if (keyCode == "13") {
                let searchVal = document.getElementById("searchInput").value;
                if (searchVal !== "") {
                  setHasSearched(true);
                  Promise.all([
                    FirebaseFunctions.callFunction("searchByName", {
                      name: searchVal,
                      businessId: FirebaseFunctions.currentUser.uid,
                    }),
                  ]).then((values) => {
                    let products = values[0];
                    props.showSearchedFilteredProducts(products);
                    setHasSearched(false);
                  });
                }
              }
            }}
            id="searchInput"
            className="searchInput"
            type="text"
          />
        </div>
        {/* <div className="filterTotalContainer"> */}
        {/* <Dropdown className="filterTotalContainer">
                        <Dropdown.Toggle className="filterContainer">
                            <h1 className="filterText">filter</h1>
                            <i style={{color: 'black'}} className="fa fa-filter"/>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="filterOptionsContainer">
                            <Dropdown.Item onSelect={() => {
                                if(currentFilter !== 'categories'){
                                    setCurrentFilter('categories')
                                    document.getElementById('costSearch').style.display = 'none';
                                    document.getElementById('categoriesSearch').style.display = 'flex';
                                }else{
                                    setCurrentFilter('none')
                                    document.getElementById('categoriesSearch').style.display = 'none'
                                }                            
                            }} style={currentFilter === 'categories' ? {
                                filter: 'brightness(50%)'
                            } : {

                            }} className="filterOption">
                                Categories
                            </Dropdown.Item>
                            <Dropdown.Item onSelect={() => {
                                if(currentFilter !== 'cost'){
                                    setCurrentFilter('cost')
                                    document.getElementById('categoriesSearch').style.display = 'none';
                                    document.getElementById('costSearch').style.display = 'flex';
                                }else{
                                    setCurrentFilter('none')
                                    document.getElementById('costSearch').style.display = 'none'
                                }
                            }} style={currentFilter === 'cost' ? {
                                filter: 'brightness(50%)'
                            } : {

                            }} className="filterOption">
                                Cost
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown> */}
        <Dropdown id="categoriesSearch" className="categoriesSearch">
          <Dropdown.Toggle
            style={{
              width: "110px",
              height: "40px",
            }}
            className="dropDown"
          >
            Categories
            <i className="fa fa-caret-down" />
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropDownMenu">
            <Dropdown.Item
              className="dropDownItem"
              onSelect={(event) => {
                let categoriesCopy = categories.slice();
                if (categoriesCopy.includes("Clothing")) {
                  categoriesCopy.splice(categoriesCopy.indexOf("Clothing"), 1);
                } else {
                  categoriesCopy.push("Clothing");
                }
                setCategories(categoriesCopy);
              }}
            >
              {categories.includes("Clothing") ? (
                <i className="fa fa-check" />
              ) : null}
              Clothing
            </Dropdown.Item>
            <Dropdown.Item
              className="dropDownItem"
              onSelect={() => {
                if (!props.isInPastOrder) {
                  let categoriesCopy = categories.slice();
                  if (categoriesCopy.includes("Desserts")) {
                    categoriesCopy.splice(
                      categoriesCopy.indexOf("Desserts"),
                      1
                    );
                  } else {
                    categoriesCopy.push("Desserts");
                  }
                  setCategories(categoriesCopy);
                }
              }}
            >
              {categories.includes("Desserts") ? (
                <i className="fa fa-check" />
              ) : null}
              Desserts
            </Dropdown.Item>
            <Dropdown.Item
              className="dropDownItem"
              onSelect={() => {
                if (!props.isInPastOrder) {
                  let categoriesCopy = categories.slice();
                  if (categoriesCopy.includes("Decorations")) {
                    categoriesCopy.splice(
                      categoriesCopy.indexOf("Decorations"),
                      1
                    );
                  } else {
                    categoriesCopy.push("Decorations");
                  }
                  setCategories(categoriesCopy);
                }
              }}
            >
              {categories.includes("Decorations") ? (
                <i className="fa fa-check" />
              ) : null}
              Decoration
            </Dropdown.Item>
            <Dropdown.Item
              className="dropDownItem"
              onSelect={() => {
                if (!props.isInPastOrder) {
                  let categoriesCopy = categories.slice();
                  if (categoriesCopy.includes("Fruits/Vegetables")) {
                    categoriesCopy.splice(
                      categoriesCopy.indexOf("Fruits/Vegetables"),
                      1
                    );
                  } else {
                    categoriesCopy.push("Fruits/Vegetables");
                  }
                  setCategories(categoriesCopy);
                }
              }}
            >
              {categories.includes("Fruits/Vegetables") ? (
                <i className="fa fa-check" />
              ) : null}
              Fruits/Vegetables
            </Dropdown.Item>
            <Dropdown.Item
              className="dropDownItem"
              onSelect={() => {
                let categoriesCopy = categories.slice();
                if (categoriesCopy.includes("Food Products")) {
                  categoriesCopy.splice(
                    categoriesCopy.indexOf("Food Products"),
                    1
                  );
                } else {
                  categoriesCopy.push("Food Products");
                }
                setCategories(categoriesCopy);
              }}
            >
              {categories.includes("Food Products") ? (
                <i className="fa fa-check" />
              ) : null}
              Food Product
            </Dropdown.Item>
            <Dropdown.Item
              className="dropDownItem"
              onSelect={() => {
                if (!props.isInPastOrder) {
                  let categoriesCopy = categories.slice();
                  if (categoriesCopy.includes("Tools/Home")) {
                    categoriesCopy.splice(
                      categoriesCopy.indexOf("Tools/Home"),
                      1
                    );
                  } else {
                    categoriesCopy.push("Tools/Home");
                  }
                  setCategories(categoriesCopy);
                }
              }}
            >
              {categories.includes("Tools/Home") ? (
                <i className="fa fa-check" />
              ) : null}
              Tools/Home
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <div id="costSearch" className="costSearch">
          <div className="searchIconContainer" onClick={async () => {}}>
            <i style={{ color: "white" }} className="fa fa-search" />
          </div>
          <div className="secondaryCostSearch">
            <h1 className="headers" style={{ marginTop: 0, marginBottom: 0 }}>
              $
            </h1>
            <input
              style={{
                width: "60px",
                marginLeft: "5px",
              }}
              id="costInput"
              className="costInput inputs"
              type="number"
              aria-rowcount={1}
            />
          </div>
        </div>
        {/* <div style={{height: ''}}>
                        <div onClick={(event) => {
                            let filterOptions = document.getElementById('filterOptions');
                            console.warn(filterOptions.style.display)
                            if(filterOptions.style.display === 'none'){
                                filterOptions.style.display = 'flex';
                            }else{
                                filterOptions.style.display = 'none';
                            }
                        }} className="filterContainer">
                            <h1 className="filterText">filter</h1>
                            <i style={{color: 'black'}} className="fa fa-filter"/>
                        </div>
                    </div>
                    <div id="filterOptions" className="filterOptionsContainer">
                        <button className="filterOption">Category</button>
                        <button className="filterOption">Cost</button>
                    </div> */}
        {/* </div> */}
      </div>
      <div className="editAllAndAddContainer">
        {props.addingNewProduct ? (
          <div></div>
        ) : (
          <button
            id="editAll"
            className="editAllButton"
            style={
              isEditingAll
                ? { backgroundColor: "red", borderColor: "red" }
                : { backgroundColor: "black", borderColor: "black" }
            }
            onClick={() => {
              if (isEditingAll) {
                GlobalStateHandler.eventEmitter.emit("doneEditingEveryProduct");
              } else {
                GlobalStateHandler.eventEmitter.emit("editEveryProduct");
              }
              setIsEditingAll(!isEditingAll);
            }}
          >
            Edit all
          </button>
        )}
        {isSearching || isEditingAll ? (
          <div className="tabBtns addProductBtn"></div>
        ) : GlobalStateHandler.businessData.verified ? (
          <i
            onClick={() => {
              props.addNewProduct();
            }}
            className="fa fa-plus fa-2x tabBtns addProductBtn"
          >
            <h1 className="btnTxt">Add</h1>
          </i>
        ) : (
          <i
            style={{ color: "#707070", opacity: "1.0", cursor: "auto" }}
            className="fa fa-plus fa-2x tabBtns addProductBtn"
          >
            <h1 className="btnTxt">Add</h1>
          </i>
        )}
      </div>
      <div style={{ alignSelf: "center" }}>
        {props.products.length === 0 ? (
          <h1 className="noProductsText" style={{ width: "70vw", textAlign: 'center' }}>
            You currently have no products. We HIGHLY RECOMMEND you add all your
            sales taxes first in the Financials screen and then add products
            using the add button above.
          </h1>
        ) : props.shownProducts.length === 0 ? (
          <h1 className="noProductsText">
            It appears we couldn't find any products.
          </h1>
        ) : hasSearched ? (
          <div
            className="noselect"
            style={{ fontSize: "140px", pointerEvents: "none" }}
          >
            <Dot>.</Dot>
            <Dot>.</Dot>
            <Dot>.</Dot>
          </div>
        ) : (
          props.shownProducts
        )}
      </div>
      {renderShowMore()}
    </div>
  );
};
export default ProductsScreen;
