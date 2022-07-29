import React, { useEffect, useState } from "react";
import GlobalStateHandler from "../../../config/GlobalStateHandler";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import FirebaseFunctions from "../../../config/FirebaseFunctions";
const TaxesScreen = (props) => {
  const [localTaxes, setLocalTaxes] = useState(
    GlobalStateHandler.businessData.taxes.localTaxes
  );
  const [stateTaxes, setStateTaxes] = useState(
    GlobalStateHandler.businessData.taxes.stateTaxes
  );
  const [editingLocalTaxes, setEditingLocalTaxes] = useState(false);
  const [editingStateTaxes, setEditingStateTaxes] = useState(false);
  const [newLocalTaxes, setNewLocalTaxes] = useState([]);
  const [newStateTaxes, setNewStateTaxes] = useState([]);
  const [majorLocalTaxEdited, setMajorLocalTaxEdited] = useState(false);
  const [majorStateTaxEdited, setMajorStateTaxEdited] = useState(false);

  useEffect(() => {
    if (majorLocalTaxEdited || majorStateTaxEdited) {
      FirebaseFunctions.updateBusinessInfo({
        taxes: {
          localTaxes,
          stateTaxes,
        },
      });
      setMajorLocalTaxEdited(false);
    }
  }, [localTaxes, stateTaxes]);
  const generateRandomTaxId = () => {
    let id = "";
    for (let i = 0; i < 5; i++) {
      id += String.fromCharCode(Math.floor(94 * Math.random()) + 33);
    }
    return id;
  };

  return (
    <div
      id="taxes"
      className="page"
      style={{ justifyContent: "center", overflowY: "hidden" }}
    >
      <div
        style={{
          width: "70vw",
          alignSelf: "center",
          fontSize: "3.2vw",
          marginBottom: "2vh",
        }}
      >
        Taxes
      </div>
      <div className="taxCenterPageContainer">
        <div className="taxCategoryContainer">
          <div className="taxTitle">Local Taxes</div>
          <div
            className="taxContainer"
            style={{ backgroundColor: "#fff6ef", fontWeight: "bold" }}
          >
            <div className="taxInfoContainer">Name</div>
            <div className="taxInfoContainer">Description</div>
            <div className="taxInfoContainer">Tax %</div>
            {editingLocalTaxes ? <div style={{ flex: "1" }} /> : null}
          </div>
          {localTaxes.map((value, index) => (
            <div className="taxContainer">
              {editingLocalTaxes ? (
                <input
                  onChange={(event) => {
                    let copy = localTaxes.slice();
                    copy[index].name = event.target.value;
                    setLocalTaxes(copy);
                  }}
                  className="taxInputs"
                  defaultValue={value.name}
                />
              ) : (
                <div className="taxInfoContainer">{value.name}</div>
              )}
              {editingLocalTaxes ? (
                <input
                  onChange={(event) => {
                    let copy = localTaxes.slice();
                    copy[index].description = event.target.value;
                    setLocalTaxes(copy);
                  }}
                  className="taxInputs"
                  defaultValue={value.description}
                />
              ) : (
                <div className="taxInfoContainer">{value.description}</div>
              )}
              {editingLocalTaxes ? (
                <div className="">
                  <input
                    onChange={(event) => {
                      let copy = localTaxes.slice();
                      copy[index].tax = parseFloat(event.target.value / 100);
                      setLocalTaxes(copy);
                    }}
                    className="taxInputs"
                    defaultValue={value.tax * 100}
                  />
                  %
                </div>
              ) : (
                <div className="taxInfoContainer">{value.tax * 100}%</div>
              )}
              {editingLocalTaxes ? (
                <button
                  onClick={() => {
                    setMajorLocalTaxEdited(true);
                    let copy = localTaxes.slice();
                    copy.splice(index, 1);
                    setLocalTaxes(copy);
                  }}
                  className="removeTaxBtn"
                >
                  <FaMinusCircle />
                </button>
              ) : null}
            </div>
          ))}
          {newLocalTaxes.map((value, index) => (
            <div className="taxContainer">
              <input
                className="taxInputs"
                onChange={(event) => {
                  let copy = newLocalTaxes.slice();
                  copy[index].name = event.target.value;
                  setNewLocalTaxes(copy);
                }}
              />
              <input
                className="taxInputs"
                onChange={(event) => {
                  let copy = newLocalTaxes.slice();
                  copy[index].description = event.target.value;
                  setNewLocalTaxes(copy);
                }}
              />
              <div>
                <input
                  className="taxInputs"
                  type="number"
                  onChange={(event) => {
                    let copy = newLocalTaxes.slice();
                    copy[index].tax = parseFloat(event.target.value / 100);
                    setNewLocalTaxes(copy);
                  }}
                />
                %
              </div>
              <button
                onClick={() => {
                  let copy = newLocalTaxes.slice();
                  copy.splice(index, 1);
                  setNewLocalTaxes(copy);
                }}
                className="removeTaxBtn"
              >
                <FaMinusCircle />
              </button>
            </div>
          ))}
          {editingLocalTaxes ? (
            <button
              onClick={() => {
                let copy = newLocalTaxes.slice();
                copy.push({
                  name: "",
                  description: "",
                  tax: -1,
                  id: generateRandomTaxId(),
                });
                setNewLocalTaxes(copy);
              }}
              className="addTaxBtn"
            >
              <FaPlusCircle />
            </button>
          ) : null}
          <button
            onClick={() => {
              if (editingLocalTaxes) {
                setMajorLocalTaxEdited(true);
                let copy = localTaxes.slice();
                if (newLocalTaxes.length > 0) {
                  copy = copy.concat(newLocalTaxes);
                  setLocalTaxes(copy);
                  setNewLocalTaxes([]);
                } else {
                  setLocalTaxes(copy);
                }
              }
              setEditingLocalTaxes(!editingLocalTaxes);
            }}
            style={
              editingLocalTaxes
                ? {
                    backgroundColor: "white",
                    fontWeight: "bold",
                    color: "#ff993b",
                    width: "8vw",
                  }
                : {}
            }
            className="addEditTaxBtn"
          >
            {editingLocalTaxes ? "Stop Editing" : "Add/Edit"}
          </button>
        </div>
        <div className="taxCategoryContainer">
          <div className="taxTitle">State Taxes</div>
          <div
            className="taxContainer"
            style={{ backgroundColor: "#fff6ef", fontWeight: "bold" }}
          >
            <div className="taxInfoContainer">Name</div>
            <div className="taxInfoContainer">Description</div>
            <div className="taxInfoContainer">Tax %</div>
            {editingStateTaxes ? <div style={{ flex: "1" }} /> : null}
          </div>
          {stateTaxes.map((value, index) => (
            <div className="taxContainer">
              {editingStateTaxes ? (
                <input
                  onChange={(event) => {
                    let copy = stateTaxes.slice();
                    copy[index].name = event.target.value;
                    setStateTaxes(copy);
                  }}
                  className="taxInputs"
                  defaultValue={value.name}
                />
              ) : (
                <div className="taxInfoContainer">{value.name}</div>
              )}
              {editingStateTaxes ? (
                <input
                  onChange={(event) => {
                    let copy = stateTaxes.slice();
                    copy[index].description = event.target.value;
                    setStateTaxes(copy);
                  }}
                  className="taxInputs"
                  defaultValue={value.description}
                />
              ) : (
                <div className="taxInfoContainer">{value.description}</div>
              )}
              {editingStateTaxes ? (
                <div>
                  <input
                    onChange={(event) => {
                      let copy = stateTaxes.slice();
                      copy[index].tax = parseFloat(event.target.value / 100);
                      setStateTaxes(copy);
                    }}
                    className="taxInputs"
                    defaultValue={value.tax * 100}
                  />
                  %
                </div>
              ) : (
                <div className="taxInfoContainer">{value.tax * 100}%</div>
              )}
              {editingStateTaxes ? (
                <button
                  onClick={() => {
                    setMajorStateTaxEdited(true);
                    let copy = stateTaxes.slice();
                    copy.splice(index, 1);
                    setStateTaxes(copy);
                  }}
                  className="removeTaxBtn"
                >
                  <FaMinusCircle />
                </button>
              ) : null}
            </div>
          ))}
          {newStateTaxes.map((value, index) => (
            <div className="taxContainer">
              <input
                className="taxInputs"
                onChange={(event) => {
                  let copy = newStateTaxes.slice();
                  copy[index].name = event.target.value;
                  setNewStateTaxes(copy);
                }}
              />
              <input
                className="taxInputs"
                onChange={(event) => {
                  let copy = newStateTaxes.slice();
                  copy[index].description = event.target.value;
                  setNewStateTaxes(copy);
                }}
              />
              <div>
                <input
                  className="taxInputs"
                  type="number"
                  onChange={(event) => {
                    let copy = newStateTaxes.slice();
                    copy[index].tax = parseFloat(event.target.value / 100);
                    setNewStateTaxes(copy);
                  }}
                />
                %
              </div>
              <button
                onClick={() => {
                  let copy = newStateTaxes.slice();
                  copy.splice(index, 1);
                  setNewStateTaxes(copy);
                }}
                className="removeTaxBtn"
              >
                <FaMinusCircle />
              </button>
            </div>
          ))}
          {editingStateTaxes ? (
            <button
              onClick={() => {
                let copy = newStateTaxes.slice();
                copy.push({
                  name: "",
                  description: "",
                  tax: -1,
                  id: generateRandomTaxId(),
                });
                setNewStateTaxes(copy);
              }}
              className="addTaxBtn"
            >
              <FaPlusCircle />
            </button>
          ) : null}
          <button
            onClick={() => {
              if (editingStateTaxes) {
                setMajorStateTaxEdited(true);
                let copy = stateTaxes.slice();
                if (newStateTaxes.length > 0) {
                  copy = copy.concat(newStateTaxes);
                  setStateTaxes(copy);
                  setNewStateTaxes([]);
                } else {
                  setStateTaxes(copy);
                }
              }
              setEditingStateTaxes(!editingStateTaxes);
            }}
            style={
              editingStateTaxes
                ? {
                    backgroundColor: "white",
                    fontWeight: "bold",
                    color: "#ff993b",
                    width: "8vw",
                  }
                : {}
            }
            className="addEditTaxBtn"
          >
            {editingStateTaxes ? "Stop Editing" : "Add/Edit"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default TaxesScreen;
