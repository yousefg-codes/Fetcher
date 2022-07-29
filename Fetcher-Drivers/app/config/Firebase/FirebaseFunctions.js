import firebase from '@react-native-firebase/app';
import firebaseAuth from '@react-native-firebase/auth';
import firebaseFirestore from '@react-native-firebase/firestore';
import {showMessage} from 'react-native-flash-message';
import {hideAwaitingOrder} from '../../components/GlobalComponents/AwaitingOrderComponent';
import {displayNewOrder} from '../../components/GlobalComponents/NewOrderComponent';
import GlobalStateHandler from '../GlobalHandler/GlobalStateHandler';
import firebaseStorage from '@react-native-firebase/storage';
import firebaseFunctions from '@react-native-firebase/functions';
import Images from '../Images/Images';
import {showUntilVerified} from '../../components/GlobalComponents/UntilVerifiedPopUp';

export default class FirebaseFunctions {
  static auth = firebaseAuth();
  static firestore = firebaseFirestore();
  static batch = this.firestore.batch();
  static storage = firebaseStorage();
  static reports = this.firestore.collection('Reports');
  static products = this.firestore.collection('Products');
  static drivers = this.firestore.collection('Drivers');
  static orders = this.firestore.collection('Orders');
  static businessColl = this.firestore.collection('BusinessData');
  static currentUser = this.auth.currentUser;
  static functions = firebaseFunctions();
  static userListeners = [];

  static async finishCurrentOrder(orderId, orderDetails) {
    GlobalStateHandler.currentUserData.currentOrders.splice(0, 1);
    await this.call('orderDelivered', {orderId});
    // await this.firestore.runTransaction(async transaction => {
    //   let currUserData = await transaction.get(
    //     this.drivers.doc(this.currentUser.uid),
    //   );
    //   let currentOrders = currUserData.data().currentOrders;
    //   currentOrders.shift();
    //   transaction.update(this.drivers.doc(this.currentUser.uid), {
    //     currentOrders,
    //   });
    // });
  }
  static async signInUser(email, password, isLogin) {
    await this.auth.signInWithEmailAndPassword(email, password).then(() => {
      this.currentUser = this.auth.currentUser;
    });
    if (isLogin && this.currentUser !== null) {
      let driver = await this.drivers.doc(this.currentUser.uid).get();
      if (!driver.exists) {
        await this.auth.signOut();
        return false;
      }
    }
    return true;
  }
  static async call(name, parameters) {
    let functionReturn = await this.functions.httpsCallable(name)(parameters);
    return functionReturn.data;
  }
  static async signUpDriver(email, password, obj) {
    let newUser = await this.auth.createUserWithEmailAndPassword(
      email,
      password,
    );
    await this.submitSignUpForm(email);
    this.currentUser = this.auth.currentUser;
    await this.createDriverDoc(obj, newUser.user.uid);
  }
  static async addReport(userName, userEmail, details) {
    this.reports.add({
      to: 'smartbee474@gmail.com',
      message: {
        subject: 'USER REPORT',
        text:
          'USER EMAIL: ' +
          userEmail +
          '\n' +
          'USER NAME: ' +
          userName +
          '\n' +
          'REPORT: ' +
          details,
      },
    });
  }
  static async submitSignUpForm(driverEmail) {
    await this.reports
      .add({
        to: 'support@fetchertech.com',
        message: {
          subject: 'NEW DRIVER APPLICATION',
          text: 'NEW DRIVER HAS APPLIED\n' + driverEmail,
        },
      })
      .catch(err => {});
  }
  static async getProductImg(businessId, imageId) {
    return await this.storage
      .ref('Businesses/' + businessId + '/ProductImgs/' + imageId)
      .getDownloadURL();
  }
  static async createDriverDoc(obj, uid) {
    let ref = this.drivers.doc(uid);
    let ordersRef = this.drivers
      .doc(uid)
      .collection('Orders')
      .doc('0');
    let earningsRef = this.drivers
      .doc(uid)
      .collection('Earnings')
      .doc('0');
    //try {
    this.batch.set(ref, obj);
    this.batch.set(ordersRef, {orders: []});
    this.batch.set(earningsRef, {
      earnings: [],
    });
    //} catch (err) {
    //  console.error(err);
    //}
    await this.batch.commit().catch(err => {
      console.error(err);
    });
    this.batch = this.firestore.batch();
  }
  static async changeAddress(address) {
    await this.drivers.doc(this.currentUser.uid).update({address});
  }
  static async fetchUserData() {
    return (await this.drivers.doc(this.currentUser.uid).get()).data();
  }
  static async updateUserLocation(latitude, longitude, heading) {
    await this.drivers.doc(this.currentUser.uid).update({
      currentLocation: {
        latitude,
        longitude,
        heading,
      },
    });
  }
  static async logOut() {
    await this.auth.signOut();
    this.currentUser = null;
    this.userListeners.forEach(element => element());
    this.userListeners = [];
    GlobalStateHandler.orders = [];
    GlobalStateHandler.currentUserData = null;
    //this.endUserListener();
    //this.endUserListener = null;
  }
  static async toggleDrivingSession(bool) {
    await this.drivers
      .doc(this.currentUser.uid)
      .update({isInDrivingSession: bool});
  }
  static async sendForgotPass(email) {
    await this.auth.sendPasswordResetEmail(email);
  }

  static async getProduct(Id) {
    return (await this.products.doc(Id).get()).data();
  }
  static async updateUserData() {
    this.userListeners.push(
      this.drivers.doc(this.currentUser.uid).onSnapshot(async query => {
        if (
          query.data().isInDrivingSession &&
          query.data().requestedOrders.length > 0
        ) {
          let newOrderID = query.data().requestedOrders[0];
          hideAwaitingOrder();
          let orderDetails = await this.orders.doc(newOrderID).get();
          //console.log(orderDetails.data());
          displayNewOrder({
            orderDetails: orderDetails.data(),
            orderID: newOrderID,
          });
        }
        if (query.data().isInDrivingSession) {
          GlobalStateHandler.eventEmitter.emit('inDriving');
        } else {
          GlobalStateHandler.eventEmitter.emit('notInDriving');
        }
        if (query.data().currentOrders.length > 0) {
          GlobalStateHandler.eventEmitter.emit('carryingOutOrder');
        } else {
          GlobalStateHandler.eventEmitter.emit('doneCarryingOut');
        }
        let wasNotVerified = !GlobalStateHandler.currentUserData.verified;
        GlobalStateHandler.currentUserData = query.data();
        if (wasNotVerified && query.data().verified) {
          showUntilVerified(
            'Congratulations! Your identity has just been Verified, you can now drive and make money!',
          );
          GlobalStateHandler.eventEmitter.emit('verified');
        }
      }),
    );
  }
  static async updateCurrentOrderDistance(newDistance) {
    await this.drivers
      .doc(this.currentUser.uid)
      .update({currentOrderDistance: newDistance});
  }
  static async rejectRequest(orderID) {
    let copy = GlobalStateHandler.currentUserData.requestedOrders;
    copy.shift();
    await this.drivers
      .doc(this.currentUser.uid)
      .update({requestedOrders: copy});
    await this.orders.doc(orderID).update({foundDriver: 'rejected'});
  }
  static async getOrder(orderID) {
    return await this.orders.doc(orderID).get();
  }
  static async acceptRequest(orderID) {
    let currOrdersCopy = GlobalStateHandler.currentUserData.currentOrders.slice();
    currOrdersCopy.push(orderID);
    let copy = GlobalStateHandler.currentUserData.requestedOrders;
    copy.shift();
    await this.drivers
      .doc(this.currentUser.uid)
      .update({currentOrders: currOrdersCopy, requestedOrders: copy});
    await this.orders.doc(orderID).update({foundDriver: 'accepted'});
    let businessId = (await this.getOrder(orderID)).data().orderInfo
      .businessLocation.businessId;
    await this.businessColl.doc(businessId).update({
      incomingOrders: firebase.firestore.FieldValue.arrayUnion(orderID),
    });
  }
  static async updateOrderDocStatus(orderID, status) {
    await this.orders.doc(orderID).update({status});
  }
  static listenOnOrderDoc(orderID, callBack) {
    this.userListeners.push(
      this.orders.doc(orderID).onSnapshot(query => {
        callBack(query);
      }),
    );
  }
  static async checkForNewPastOrderDocs(refreshFunction, addingFunction) {
    let firstCheck = true;
    let length = -1;
    this.userListeners.push(
      this.drivers
        .doc(this.currentUser.uid)
        .collection('Orders')
        .onSnapshot(query => {
          //console.warn('HUG')
          if (!firstCheck) {
            if (query.docs.length > length) {
              this.listenOnPastOrderDoc(
                query.docs.length - 1,
                refreshFunction,
                addingFunction,
                false,
              );
              length = query.docs.length;
            }
          } else {
            length = query.docs.length;
            firstCheck = false;
          }
        }),
    );
  }
  static async listenOnPastOrderDoc(
    index,
    refreshFunction,
    addingFunction,
    isOld,
  ) {
    let isFirst = true;
    this.userListeners.push(
      this.drivers
        .doc(this.currentUser.uid)
        .collection('Orders')
        .doc(index + '')
        .onSnapshot(query => {
          if (!isFirst) {
            //console.warn('EROOIRE')
            refreshFunction(query.data(), index);
          } else {
            //console.warn('HEHEHEHFE')
            addingFunction(query.data(), index, isOld);
            isFirst = false;
          }
        }),
    );
  }
  static async getSpecificPastOrdersFromDoc(docId, indecies) {
    let doc = await this.drivers
      .doc(this.currentUser.uid)
      .collection('Orders')
      .doc(docId)
      .get();
    let specificPastOrders = [];
    let orders = doc.data().orders;
    for (var i = 0; i < indecies.length; i++) {
      specificPastOrders.push(orders[indecies[i]]);
    }
    return specificPastOrders;
  }
  static async loadPastOrder(index, refreshFunction, addingFunction, isOld) {
    this.listenOnPastOrderDoc(index, refreshFunction, addingFunction, isOld);
  }
  static async checkForNewEarningsDocs(refreshFunction, addingFunction) {
    let firstCheck = true;
    let length = -1;
    this.userListeners.push(
      this.drivers
        .doc(this.currentUser.uid)
        .collection('Earnings')
        .onSnapshot(query => {
          if (!firstCheck) {
            if (query.docs.length > length) {
              this.listenOnEarningsDoc(
                query.docs.length - 1,
                refreshFunction,
                addingFunction,
                false,
              );
              length = query.docs.length;
            }
          } else {
            length = query.docs.length;
            firstCheck = false;
          }
        }),
    );
  }
  static async listenOnEarningsDoc(
    index,
    refreshFunction,
    addingFunction,
    isOld,
  ) {
    let isFirst = true;
    this.userListeners.push(
      this.drivers
        .doc(this.currentUser.uid)
        .collection('Earnings')
        .doc(index + '')
        .onSnapshot(query => {
          if (!isFirst) {
            refreshFunction(query.data(), index);
          } else {
            //console.log(query.id)
            addingFunction(query.data(), index, isOld);
            isFirst = false;
          }
        }),
    );
  }
  static async loadEarnings(index, refreshFunction, addingFunction, isOld) {
    this.listenOnEarningsDoc(index, refreshFunction, addingFunction, isOld);
  }
  static async getCurrentUserPhoto() {
    try {
      const photo = await this.storage
        .ref('Drivers/Driver Images/' + this.currentUser.uid)
        .getDownloadURL();
      return {uri: photo};
    } catch {
      return Images.emptyAvatar;
    }
  }
  static async changeUserPhoto(photo) {
    await this.storage
      .ref('Drivers/Driver Images/' + this.currentUser.uid)
      .putString(photo, 'base64');
  }
}
