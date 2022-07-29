/* eslint-disable promise/always-return */
const functions = require('firebase-functions');
const stripe = require('stripe')(functions.config().stripe.key);
const admin = require('firebase-admin');
const serviceAccount = require('./fetcherServiceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://fetcher-70b9e.firebaseio.com',
  storageBucket: 'fetcher-70b9e.appspot.com',
});
const firestore = admin.firestore();
const users = firestore.collection('Users');
const products = firestore.collection('Products');
const businessColl = firestore.collection('BusinessData');
const orders = firestore.collection('Orders');
const drivers = firestore.collection('Drivers');

exports.payWithCard = functions.https.onCall(async (input, context) => {
  const {amount, currency, paymentMethodId, customerId} = input;
  return await payWithCard(amount, currency, paymentMethodId, customerId);
});

const payWithCard = async (amount, currency, paymentMethodId, customerId) => {
  // Set your secret key: remember to change this to your live secret key in production
  // See your keys here: https://dashboard.stripe.com/account/apikeys
  // eslint-disable-next-line promise/catch-or-return
  return await stripe.paymentIntents
    .create({
      amount: amount * 100,
      currency: currency,
      confirm: true,
      payment_method: paymentMethodId,
      customer: customerId,
    })
    .catch(err => {
      console.error(err);
    });
};
exports.newUser = functions.https.onCall(async (input, context) => {
  const {name, email, phone} = input;
  const customer = await stripe.customers.create({
    name,
    phone,
    email,
  });
  return customer;
});
exports.removeCard = functions.https.onCall(async (input, context) => {
  const {paymentMethodId} = input;
  await stripe.paymentMethods.detach(paymentMethodId);
});

exports.getAllCards = functions.https.onCall(async (input, context) => {
  const {customerId} = input;
  let cards = await stripe.paymentMethods.list({
    customer: customerId,
    type: 'card',
  });
  return cards;
});

exports.getCard = functions.https.onCall(async (input, context) => {
  const {cardId} = input;
  return await getCard(cardId);
});

const getCard = async cardId => {
  return await stripe.paymentMethods.retrieve(cardId);
};

exports.newCard = functions.https.onCall(async (input, context) => {
  const {customerId, cardTok} = input;
  await stripe.paymentMethods
    .create({
      type: 'card',
      card: {token: cardTok.tokenId},
    })
    .then(
      async response =>
        await stripe.paymentMethods.attach(response.id, {customer: customerId}),
    );
});

exports.getCustomer = functions.https.onCall(async (input, context) => {
  let customer = await stripe.customers.retrieve(input.id);
  return customer;
});

exports.applePaymentRequest = functions.https.onCall(async (input, context) => {
  let applePayRequest = await stripe.paymentRequestWithApplePay(input.obj);
  return applePayRequest;
});

exports.paymentRequest = functions.https.onCall(async (input, context) => {
  let paymentRequest = await stripe.paymentRequestWithCardForm(input.obj);
  return paymentRequest;
});

const addPastOrder = async (
  orderDetails,
  customerFirebaseId,
  orderId,
  paymentMethodId,
  currentOrders,
  date,
) => {
  const batch = firestore.batch();
  let lastIndex = (await users.doc(customerFirebaseId).get()).data()
    .lastOrderIndex;
  let lastOrderDoc = await users
    .doc(customerFirebaseId)
    .collection('Orders')
    .doc(String(lastIndex))
    .get();
  let items = orderDetails.orderInfo.items.map(element => {
    return {
      itemId: element.itemId,
      quantity: element.quantity,
    };
  });
  const newObj = {
    driverName: orderDetails.driver.driverData.name,
    businessName: orderDetails.orderInfo.businessLocation.businessName,
    items,
    totalCost: orderDetails.orderInfo.totalCost,
    paymentMethodId,
    orderId,
    date,
  };
  if (lastOrderDoc.data().orders.length >= 7) {
    const ref = users
      .doc(customerFirebaseId)
      .collection('Orders')
      .doc(String(lastIndex + 1));
    batch.set(ref, {orders: [newObj]});
    await batch.commit();
    await users.doc(customerFirebaseId).update({lastOrderIndex: lastIndex + 1});
  } else {
    const ref = users
      .doc(customerFirebaseId)
      .collection('Orders')
      .doc(String(lastIndex));
    let orders = lastOrderDoc.data().orders;
    orders.push(newObj);
    await ref.update({orders});
  }
  for (var i = 0; i < currentOrders.length; i++) {
    if (currentOrders[i].orderId === orderId) {
      currentOrders.splice(i, 1);
      break;
    }
  }
  await users.doc(customerFirebaseId).update({currentOrders});
};
const addToBusinessPastOrder = async (
  orderDetails,
  businessId,
  orderId,
  date,
) => {
  const batch = firestore.batch();
  let business = (await businessColl.doc(businessId).get()).data();
  let lastIndex = business.lastOrderIndex;
  let lastOrderDoc = await businessColl
    .doc(businessId)
    .collection('Orders')
    .doc(String(lastIndex))
    .get();
  let items = orderDetails.orderInfo.items.map(element => {
    return {
      itemId: element.itemId,
      quantity: element.quantity,
    };
  });
  let taxTotal = 0.0;
  for (let i = 0; i < orderDetails.orderInfo.items.length; i++) {
    if (orderDetails.orderInfo.items[i].item.taxable) {
      taxTotal +=
        business.tax *
        orderDetails.orderInfo.items[i].item.cost *
        orderDetails.orderInfo.items[i].quantity;
    }
  }
  const newObj = {
    driverName: orderDetails.driver.driverData.name,
    customerName: orderDetails.orderInfo.customerName,
    items,
    businessEarning:
      Math.round(
        (orderDetails.orderInfo.totalCost / 1.029 -
          6.3 -
          Math.round(taxTotal * 100) / 100) *
          0.93 *
          100,
      ) /
        100 +
      Math.round(taxTotal * 100) / 100,
    totalCost:
      Math.round((orderDetails.orderInfo.totalCost / 1.029 - 6.3) * 100) / 100,
    orderId,
    tax: Math.round(taxTotal * 100) / 100,
    date,
  };
  if (lastOrderDoc.data().orders.length >= 7) {
    const ref = businessColl
      .doc(businessId)
      .collection('Orders')
      .doc(String(lastIndex + 1));
    batch.set(ref, {orders: [newObj]});
    await batch.commit();
    await businessColl.doc(businessId).update({lastOrderIndex: lastIndex + 1});
    await updateBusinessEarnings(
      String(lastIndex + 1),
      0,
      businessId,
      Math.round(
        (orderDetails.orderInfo.totalCost / 1.029 - 6.3 - newObj.tax) *
          0.93 *
          100,
      ) /
        100 +
        newObj.tax,
      date,
    );
  } else {
    const ref = businessColl
      .doc(businessId)
      .collection('Orders')
      .doc(String(lastIndex));
    let orders = lastOrderDoc.data().orders;
    orders.push(newObj);
    await ref.update({orders});
    await updateBusinessEarnings(
      String(lastIndex),
      orders.length - 1,
      businessId,
      Math.round(
        (orderDetails.orderInfo.totalCost / 1.029 - 6.3 - newObj.tax) *
          0.93 *
          100,
      ) /
        100 +
        newObj.tax,
      date,
    );
  }
};

const updateBusinessEarnings = async (
  docId,
  orderIndex,
  businessId,
  earning,
  date,
) => {
  const batch = firestore.batch();
  let lastIndex = (await businessColl.doc(businessId).get()).data()
    .lastEarningsIndex;
  let lastEarningDoc = await businessColl
    .doc(businessId)
    .collection('Earnings')
    .doc(String(lastIndex))
    .get();
  const newObj = {
    amount: earning,
    date,
    orders: [
      {
        docId: docId,
        orderIndecies: [orderIndex],
      },
    ],
  };
  if (lastEarningDoc.data().earnings.length === 0) {
    const ref = businessColl
      .doc(businessId)
      .collection('Earnings')
      .doc(String(lastIndex));
    let earnings = lastEarningDoc.data().earnings;
    earnings.push(newObj);
    await ref.update({earnings});
    return;
  }
  let lastEarnings = lastEarningDoc.data().earnings;
  let lastEarning = lastEarnings[lastEarnings.length - 1];
  if (lastEarning.date !== date) {
    if (lastEarningDoc.data().earnings.length >= 7) {
      const ref = businessColl
        .doc(businessId)
        .collection('Earnings')
        .doc(String(lastIndex + 1));
      batch.set(ref, {earnings: [newObj]});
      await batch.commit();
      await businessColl
        .doc(businessId)
        .update({lastEarningsIndex: lastIndex + 1});
    } else {
      const ref = businessColl
        .doc(businessId)
        .collection('Earnings')
        .doc(String(lastIndex));
      let earnings = lastEarningDoc.data().earnings;
      earnings.push(newObj);
      await ref.update({earnings});
    }
  } else {
    const ref = businessColl
      .doc(businessId)
      .collection('Earnings')
      .doc(String(lastIndex));
    lastEarning.amount = lastEarning.amount + earning;
    if (lastEarning.orders[lastEarning.orders.length - 1].docId !== docId) {
      lastEarning.orders.push({
        docId,
        orderIndecies: [orderIndex],
      });
    } else {
      lastEarning.orders[lastEarning.orders.length - 1].orderIndecies.push(
        orderIndex,
      );
    }
    lastEarnings[lastEarnings.length - 1] = lastEarning;
    await ref.update({earnings: lastEarnings});
  }
};
const updateDriverInfo = async (orderDetails, driverId, orderId, date) => {
  const batch = firestore.batch();
  let lastIndex = (await drivers.doc(driverId).get()).data().lastOrderIndex;
  let lastOrderDoc = await drivers
    .doc(driverId)
    .collection('Orders')
    .doc(String(lastIndex))
    .get();
  let items = orderDetails.orderInfo.items.map(element => {
    return {
      itemId: element.itemId,
      quantity: element.quantity,
    };
  });
  const newObj = {
    customerName: orderDetails.orderInfo.customerName,
    earning: 5,
    businessName: orderDetails.orderInfo.businessLocation.businessName,
    items,
    totalCost: orderDetails.orderInfo.totalCost,
    orderId,
    date,
  };
  if (lastOrderDoc.data().orders.length >= 7) {
    const ref = drivers
      .doc(driverId)
      .collection('Orders')
      .doc(String(lastIndex + 1));
    batch.set(ref, {orders: [newObj]});
    await batch.commit();
    await drivers.doc(driverId).update({lastOrderIndex: lastIndex + 1});
    await updateDriverEarnings(String(lastIndex + 1), 0, driverId, 5, date);
  } else {
    const ref = drivers
      .doc(driverId)
      .collection('Orders')
      .doc(String(lastIndex));
    let orders = lastOrderDoc.data().orders;
    orders.push(newObj);
    await ref.update({orders});
    await updateDriverEarnings(
      String(lastIndex),
      orders.length - 1,
      driverId,
      5,
      date,
    );
  }
};

const updateDriverEarnings = async (
  docId,
  orderIndex,
  driverId,
  earning,
  date,
) => {
  const batch = firestore.batch();
  let lastIndex = (await drivers.doc(driverId).get()).data().lastEarningsIndex;
  let lastEarningDoc = await drivers
    .doc(driverId)
    .collection('Earnings')
    .doc(String(lastIndex))
    .get();
  const newObj = {
    amount: earning,
    date,
    orders: [
      {
        docId: docId,
        orderIndecies: [orderIndex],
      },
    ],
  };
  if (lastEarningDoc.data().earnings.length === 0) {
    const ref = drivers
      .doc(driverId)
      .collection('Earnings')
      .doc(String(lastIndex));
    let earnings = lastEarningDoc.data().earnings;
    earnings.push(newObj);
    await ref.update({earnings});
    return;
  }
  let lastEarnings = lastEarningDoc.data().earnings;
  let lastEarning = lastEarnings[lastEarnings.length - 1];
  if (lastEarning.date !== date) {
    if (lastEarningDoc.data().earnings.length >= 7) {
      const ref = drivers
        .doc(driverId)
        .collection('Earnings')
        .doc(String(lastIndex + 1));
      batch.set(ref, {earnings: [newObj]});
      await batch.commit();
      await drivers.doc(driverId).update({lastEarningsIndex: lastIndex + 1});
    } else {
      const ref = drivers
        .doc(driverId)
        .collection('Earnings')
        .doc(String(lastIndex));
      let earnings = lastEarningDoc.data().earnings;
      earnings.push(newObj);
      await ref.update({earnings});
    }
  } else {
    const ref = drivers
      .doc(driverId)
      .collection('Earnings')
      .doc(String(lastIndex));
    lastEarning.amount = lastEarning.amount + earning;
    if (lastEarning.orders[lastEarning.orders.length - 1].docId !== docId) {
      lastEarning.orders.push({
        docId,
        orderIndecies: [orderIndex],
      });
    } else {
      lastEarning.orders[lastEarning.orders.length - 1].orderIndecies.push(
        orderIndex,
      );
    }
    lastEarnings[lastEarnings.length - 1] = lastEarning;
    await ref.update({earnings: lastEarnings});
  }
};
exports.orderDelivered = functions.https.onCall(async (input, context) => {
  const {orderId} = input;
  await orders.doc(orderId).update({status: 'DELIVERED'});
  const orderDetails = await orders.doc(orderId).get();
  await drivers
    .doc(orderDetails.data().driver.docId)
    .update({currentOrders: admin.firestore.FieldValue.arrayRemove(orderId)});
  //if (change.after.data().status === 'DELIVERED') {
  let numItems = 0;
  for (let i = 0; i < orderDetails.data().orderInfo.items.length; i++) {
    numItems += orderDetails.data().orderInfo.items[i].quantity;
  }
  await admin
    .messaging()
    .sendToDevice(
      orderDetails.data().orderInfo.customerDeviceId,
      {
        notification: {
          title: 'Order Delivered',
          body: 'Your order containing ' + numItems + ' item(s) has arrived!',
          sound: 'default',
          badge: '1',
        },
      },
      {
        priority: 'high',
      },
    )
    .catch(err => {
      console.log(err);
    });
  let customer = await users
    .doc(orderDetails.data().orderInfo.customerFirebaseId)
    .get();
  let customerId = customer.data().customerId;
  let paymentMethodId = '';
  for (var i = 0; i < customer.data().currentOrders.length; i++) {
    if (orderId === customer.data().currentOrders[i].orderId) {
      paymentMethodId = customer.data().currentOrders[i].paymentMethodId;
    }
  }
  await payWithCard(
    orderDetails.data().orderInfo.totalCost,
    'usd',
    paymentMethodId,
    customerId,
  );
  await addPastOrder(
    orderDetails.data(),
    orderDetails.data().orderInfo.customerFirebaseId,
    orderDetails.id,
    paymentMethodId,
    customer.data().currentOrders,
    orderDetails.data().orderInfo.date,
  );
  await addToBusinessPastOrder(
    orderDetails.data(),
    orderDetails.data().orderInfo.businessLocation.businessId,
    orderId,
    orderDetails.data().orderInfo.date,
  );
  await updateDriverInfo(
    orderDetails.data(),
    orderDetails.data().driver.docId,
    orderId,
    orderDetails.data().orderInfo.date,
  );
  //}
});
exports.checkIfUserExists = functions.https.onCall(async (input, context) => {
  const {email} = input;
  let exists = true;
  let user = await admin
    .auth()
    .getUserByEmail(email)
    .catch(err => {
      let error = err;
      exists = false;
    });
  return {exists, uid: !exists ? null : user.uid};
});
exports.addDriverBankAccount = functions.https.onCall(
  async (input, context) => {
    const {customerId, tokenId} = input;
  },
);
//Below is series of methods to be used whenever I need to do a search
//query based off of what a user types in
//it uses dice's coefficient to see how related the typed text is to
//each array item, and then quicksorts (slower version) them from the most related to least
const compare = (searchText, itemName) => {
  if (searchText.length < 2 || itemName.length < 2) {
    if (itemName.includes(searchText)) {
      return 1;
    }
    return 0;
  }
  let searchTextEveryTwo = new Map();
  for (let i = 0; i < searchText.length - 1; i++) {
    let everyTwo = searchText.substr(i, 2);
    let count = searchTextEveryTwo.has(everyTwo)
      ? searchTextEveryTwo.get(everyTwo) + 1
      : 1;
    searchTextEveryTwo.set(everyTwo, count);
  }
  let matches = 0;
  for (let i = 0; i < itemName.length - 1; i++) {
    let everyTwo = itemName.substr(i, 2);
    let count = searchTextEveryTwo.has(everyTwo)
      ? searchTextEveryTwo.get(everyTwo)
      : 0;
    if (count > 0) {
      searchTextEveryTwo.set(everyTwo, count - 1);
      matches += 2;
    }
  }
  return matches / (searchText.length + itemName.length - 2);
};
const partition = (itemsArr, comparisonArray, left, right) => {
  let pivot = Math.floor((left + right) / 2);
  let leftPointer = left;
  let rightPointer = right;
  while (leftPointer <= rightPointer) {
    while (comparisonArray[leftPointer] > comparisonArray[pivot]) {
      leftPointer++;
    }
    while (comparisonArray[rightPointer] < comparisonArray[pivot]) {
      rightPointer--;
    }
    if (leftPointer <= rightPointer) {
      swap(comparisonArray, leftPointer, rightPointer);
      swap(itemsArr, leftPointer, rightPointer);
      leftPointer++;
      rightPointer--;
    }
  }
  return leftPointer;
};
const swap = (array, index1, index2) => {
  let temp = array[index1];
  array[index1] = array[index2];
  array[index2] = temp;
};
const filter = (txt, originalArray, comparisonArray, isASearch) => {
  let allItems = [];
  let data = comparisonArray;
  let comparisonValArr = [];
  var index = 0;
  for (var i = 0; i < data.length; i++) {
    let comparisonVal = compare(txt.toLowerCase(), data[i].toLowerCase());
    if (isASearch) {
      if (comparisonVal > 0) {
        comparisonValArr.push(comparisonVal);
        allItems[index] = originalArray[i];
        index++;
      }
    } else {
      if (data[i].categories === txt) {
        allItems[index] = data[i];
        index++;
      }
    }
  }
  if (isASearch) {
    quickSort(allItems, comparisonValArr, 0, allItems.length - 1);
  }
  return allItems;
};
const quickSort = (itemsArr, comparisonArray, index1, index2) => {
  let index;
  if (itemsArr.length > 1) {
    index = partition(itemsArr, comparisonArray, index1, index2);
    console.log(index);
    if (index - 1 > index1) {
      quickSort(itemsArr, comparisonArray, index1, index - 1);
    }
    if (index < index2) {
      quickSort(itemsArr, comparisonArray, index, index2);
    }
  }
};
const searchAlg = async (txt, originalArray, comparisonArray) => {
  if (txt.trim() === '') {
    return [];
  }
  let filteredItems = filter(txt.trim(), originalArray, comparisonArray, true);
  return filteredItems;
};
exports.searchByName = functions.https.onCall(async (input, context) => {
  const {name, businessId} = input;
  let docs = (await products.where('businessId', '==', businessId).get()).docs;
  let filteredProducts = searchAlg(
    name,
    docs.map(element => {
      return {
        ...element.data(),
        id: element.id,
      };
    }),
    docs.map(element => {
      return element.data().name;
    }),
  );
  return filteredProducts;
});
exports.hashNum = functions.https.onCall((input, context) => {
  const {number} = input;
  let str = '';
  for (let i = 0; i < number.length; i++) {
    let digit = parseInt(number.substring(i, i + 1));
    let rand = parseInt(Math.random() * 2 + 1);
    if (digit === 1) {
      if (rand === 1) {
        str += '@-';
      } else {
        str += '&^';
      }
    } else if (digit === 2) {
      if (rand === 1) {
        str += '5u';
      } else {
        str += '_=';
      }
    } else if (digit === 3) {
      if (rand === 1) {
        str += "'.";
      } else {
        str += '?w';
      }
    } else if (digit === 4) {
      if (rand === 1) {
        str += '*~';
      } else {
        str += '%e';
      }
    } else if (digit === 5) {
      if (rand === 1) {
        str += '{f';
      } else {
        str += '$1';
      }
    } else if (digit === 6) {
      if (rand === 1) {
        str += '6,';
      } else {
        str += 'k<';
      }
    } else if (digit === 7) {
      if (rand === 1) {
        str += 'n\\';
      } else {
        str += '>4';
      }
    } else if (digit === 8) {
      if (rand === 1) {
        str += ';)';
      } else {
        str += '&"';
      }
    } else if (digit === 9) {
      if (rand === 1) {
        str += '2#';
      } else {
        str += '0`';
      }
    } else {
      if (rand === 1) {
        str += 'v]';
      } else {
        str += '0/';
      }
    }
  }
  return str;
});
