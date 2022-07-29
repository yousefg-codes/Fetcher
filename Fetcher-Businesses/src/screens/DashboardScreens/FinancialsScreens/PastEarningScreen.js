import React, { useEffect, useState } from "react";
import FirebaseFunctions from "../../../config/FirebaseFunctions";
import PastOrderObj from "../../../components/PastOrderObj";
const PastEarningScreen = (props) => {
  const [pastOrders, setPastOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const asyncUseEffect = async () => {
    let tempPastOrders = [];
    //console.log(props.route.params.pastOrders.length);
    for (var i = 0; i < props.pastOrders.length; i++) {
      let specificPastOrders = await FirebaseFunctions.loadSpecificPastOrder(
        props.pastOrders[i].docId,
        props.pastOrders[i].orderIndecies
      );
      //console.log(specificPastOrders);
      if (i === 0) {
        tempPastOrders = specificPastOrders;
      } else {
        tempPastOrders = tempPastOrders.concat(specificPastOrders);
      }
    }
    //console.log(tempPastOrders)
    setPastOrders(tempPastOrders);
    setIsLoading(false);
  };
  useEffect(() => {
    asyncUseEffect();
  }, []);
  if (isLoading) {
    return <div></div>;
  }
  return (
    <div
      id="pastEarning"
      className="page"
      style={{ marginTop: "10%", flexWrap: "wrap" }}
    >
      {pastOrders.map((order) => {
        return (
          <PastOrderObj
            key={order.date + " " + order.totalCost + " " + order.customerName}
            identifier={
              order.date + " " + order.totalCost + " " + order.customerName
            }
            customerName={order.customerName}
            date={order.date}
            tax={order.tax}
            driverName={order.driverName}
            totalCost={order.totalCost}
            items={order.items}
          />
        );
      })}
    </div>
  );
};
export default PastEarningScreen;
