import React, { useEffect, useState } from "react";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
const DropDownTimesComponent = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [potentialHours, setPotentialHours] = useState([]);
  useEffect(() => {
    let potentialHours = [];
    for (var j = 0; j < 24; j++) {
      const i = j;
      potentialHours.push(
        <button
          key={(i % 12 === 0 ? 12 : i % 12) + ":00 " + (i < 12 ? "AM" : "PM")}
          disabled={
            props.chosenTime ===
            (i % 12 === 0 ? 12 : i % 12) + ":00 " + (i < 12 ? "AM" : "PM")
          }
          onClick={() => {
            props.setChosenTime(
              (i % 12 === 0 ? 12 : i % 12) + ":00 " + (i < 12 ? "AM" : "PM")
            );
            setIsOpen(false);
          }}
          className="chooseTimeBtn"
        >
          {(i % 12 === 0 ? 12 : i % 12) + ":00 " + (i < 12 ? "AM" : "PM")}
        </button>
      );
      potentialHours.push(
        <button
          key={(i % 12 === 0 ? 12 : i % 12) + ":15 " + (i < 12 ? "AM" : "PM")}
          disabled={
            props.chosenTime ===
            (i % 12 === 0 ? 12 : i % 12) + ":15 " + (i < 12 ? "AM" : "PM")
          }
          onClick={() => {
            props.setChosenTime(
              (i % 12 === 0 ? 12 : i % 12) + ":15 " + (i < 12 ? "AM" : "PM")
            );
            setIsOpen(false);
          }}
          className="chooseTimeBtn"
        >
          {(i % 12 === 0 ? 12 : i % 12) + ":15 " + (i < 12 ? "AM" : "PM")}
        </button>
      );
      potentialHours.push(
        <button
          key={(i % 12 === 0 ? 12 : i % 12) + ":30 " + (i < 12 ? "AM" : "PM")}
          disabled={
            props.chosenTime ===
            (i % 12 === 0 ? 12 : i % 12) + ":30 " + (i < 12 ? "AM" : "PM")
          }
          onClick={() => {
            props.setChosenTime(
              (i % 12 === 0 ? 12 : i % 12) + ":30 " + (i < 12 ? "AM" : "PM")
            );
            setIsOpen(false);
          }}
          className="chooseTimeBtn"
        >
          {(i % 12 === 0 ? 12 : i % 12) + ":30 " + (i < 12 ? "AM" : "PM")}
        </button>
      );
      potentialHours.push(
        <button
          key={(i % 12 === 0 ? 12 : i % 12) + ":45 " + (i < 12 ? "AM" : "PM")}
          disabled={
            props.chosenTime ===
            (i % 12 === 0 ? 12 : i % 12) + ":45 " + (i < 12 ? "AM" : "PM")
          }
          onClick={() => {
            props.setChosenTime(
              (i % 12 === 0 ? 12 : i % 12) + ":45 " + (i < 12 ? "AM" : "PM")
            );
            setIsOpen(false);
          }}
          className="chooseTimeBtn"
        >
          {(i % 12 === 0 ? 12 : i % 12) + ":45 " + (i < 12 ? "AM" : "PM")}
        </button>
      );
    }
    setPotentialHours(potentialHours);
  }, [props.chosenTime]);

  return (
    <div className="chooseTimeContainer">
      <button
        disabled={props.disabled}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="chosenTimeBtn"
      >
        {props.chosenTime}
      </button>
      <div
        style={{
          display: isOpen ? "flex" : "none",
        }}
        className="chooseTimeDropdown"
      >
        <div style={{ marginTop: "454vh" }}>{potentialHours}</div>
      </div>
    </div>
  );
};

const BusinessHoursComponent = (props) => {
  const [chosenTimes, setChosenTimes] = useState(
    props.initialTimes
      ? props.initialTimes
      : [
          { times: [{ start: "7:00 AM", end: "7:00 PM" }] },
          { times: [{ start: "7:00 AM", end: "7:00 PM" }] },
          { times: [{ start: "7:00 AM", end: "7:00 PM" }] },
          { times: [{ start: "7:00 AM", end: "7:00 PM" }] },
          { times: [{ start: "7:00 AM", end: "7:00 PM" }] },
          { times: [{ start: "7:00 AM", end: "7:00 PM" }] },
          { times: [{ start: "7:00 AM", end: "7:00 PM" }] },
        ]
  );
  const [closedDays, setClosedDays] = useState(
    props.initialClosures ? props.initialClosures : []
  );
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  useEffect(() => {
    props.setClosedDays(closedDays);
  }, [closedDays]);
  useEffect(() => {
    props.setChosenTimes(chosenTimes);
  }, [chosenTimes]);
  return (
    <div
      className={"businessHoursContainer " + props.className}
      style={props.style ? props.style : {}}
    >
      <div style={{ fontSize: "1.8vw" }}>Business Hours</div>
      <div style={{ fontSize: "1.2vw", color: "#ff993b", marginBottom: "1vh" }}>
        *NOTE: these are the hours in which your business can accept orders, we
        recommend having these timed to at least 15 minutes before your business
        closes*
      </div>
      <div
        style={{
          fontSize: "3vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {days.map((value, index) => (
          <div className="businessHoursPerDayContainer">
            <div style={{ width: "10vw" }}>{value}</div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {chosenTimes[index].times.map((value2, index2) => (
                <div>
                  <div
                    style={{
                      width: "27vw",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <DropDownTimesComponent
                      disabled={closedDays.includes(value)}
                      setChosenTime={(time) => {
                        let chosenTimesCopy = chosenTimes.slice();
                        chosenTimesCopy[index].times[index2].start = time;
                        setChosenTimes(chosenTimesCopy);
                      }}
                      chosenTime={value2.start}
                    />
                    -
                    <DropDownTimesComponent
                      disabled={closedDays.includes(value)}
                      setChosenTime={(time) => {
                        let chosenTimesCopy = chosenTimes.slice();
                        chosenTimesCopy[index].times[index2].end = time;
                        setChosenTimes(chosenTimesCopy);
                      }}
                      chosenTime={value2.end}
                    />
                    <button
                      disabled={closedDays.includes(value)}
                      onClick={() => {
                        let chosenTimesCopy = chosenTimes.slice();
                        chosenTimesCopy[index].times.splice(index2, 1);
                        setChosenTimes(chosenTimesCopy);
                      }}
                      style={{
                        color: "red",
                        display:
                          chosenTimes[index].times.length > 1
                            ? "block"
                            : "none",
                      }}
                      className="addTimeIntervalBtn"
                    >
                      <FaMinusCircle />
                    </button>
                  </div>
                  <div style={{ height: "1vh" }} />
                </div>
              ))}
            </div>
            <button
              disabled={closedDays.includes(value)}
              onClick={() => {
                let chosenTimesCopy = chosenTimes.slice();
                chosenTimesCopy[index].times.push({
                  start: "7:00 AM",
                  end: "7:00 PM",
                });
                setChosenTimes(chosenTimesCopy);
              }}
              className="addTimeIntervalBtn"
            >
              <FaPlusCircle />
            </button>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "13vw",
              }}
            >
              <input
                defaultChecked={closedDays.includes(value)}
                onChange={(event) => {
                  let closedDaysCopy = closedDays.slice();
                  if (event.target.checked) {
                    console.log("HERE");
                    closedDaysCopy.push(value);
                  } else {
                    closedDaysCopy.splice(closedDays.indexOf(value), 1);
                  }
                  setClosedDays(closedDaysCopy);
                }}
                type="checkbox"
                className="closedAllDayCheckBox"
              />{" "}
              Closed All Day
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default BusinessHoursComponent;
