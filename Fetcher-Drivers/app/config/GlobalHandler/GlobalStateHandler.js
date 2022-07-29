import FirebaseFunctions from '../Firebase/FirebaseFunctions';
import {EventEmitter} from 'events';
import {useRef, createRef} from 'react';

export default class GlobalStateHandler {
  static eventEmitter = new EventEmitter();
  static currentUserData = null;
  static newOrderComponentRef = null;
  static newAwaitingOrderComponentRef = null;
  static mapRef = null;
  static isInDrivingSession = false;
  static continueFirstOrder = false;
  static viewOrderInfoRef = null;
  static navigation = null;
  static customPickerRef = null;
  static untilVerifiedRef = null;
  static userName = '';
  static homeScreenRef = null;
  static orders = [];
  static oldestDocId = -1;

  static async getCurrentUserData() {
    // if (FirebaseFunctions.currentUser === null) {
    //   this.listenForUserSignIn();
    //   return;
    // } else {
    return await FirebaseFunctions.fetchUserData();
    //}
  }
  static pastOrdersRefresh = (docData, docId) => {
    let copy = this.orders.slice();
    for (var i = 0; i < this.orders.length; i++) {
      if (docId === this.orders[i].docId) {
        copy[i] = {docId, orders: docData.orders};
        this.orders = copy;
        this.eventEmitter.emit('pastOrdersUpdate');
        return;
      }
    }
  };
  static addToPastOrders = (docData, docId, isOldDoc) => {
    let copy = this.orders.slice();
    if (docId < this.oldestDocId) {
      this.oldestDocId = docId;
    }
    if (isOldDoc) {
      copy.unshift({docId, orders: docData.orders});
      this.orders = copy;
      this.eventEmitter.emit('pastOrdersUpdate');
      return;
    }
    copy.push({docId, orders: docData.orders});
    this.orders = copy;
    this.eventEmitter.emit('pastOrdersUpdate');
  };

  static initPastOrders = async () => {
    let lastOrderIndex = GlobalStateHandler.currentUserData.lastOrderIndex;
    await FirebaseFunctions.loadPastOrder(
      lastOrderIndex,
      (docData, docId) => this.pastOrdersRefresh(docData, docId),
      (docData, docId, isOldDoc) =>
        this.addToPastOrders(docData, docId, isOldDoc),
      false,
    );
    this.oldestDocId = lastOrderIndex;
    FirebaseFunctions.checkForNewPastOrderDocs(
      (docData, docId) => this.pastOrdersRefresh(docData, docId),
      (docData, docId, isOldDoc) =>
        this.addToPastOrders(docData, docId, isOldDoc),
    );
  };

  static loadOldOrders = async () => {
    if (this.oldestDocId - 1 < 0) {
      return;
    }
    await FirebaseFunctions.loadPastOrder(
      this.oldestDocId - 1,
      (docData, docId) => this.pastOrdersRefresh(docData, docId),
      (docData, docId, isOldDoc) =>
        this.addToPastOrders(docData, docId, isOldDoc),
      true,
    );
  };
  // static listenForUserSignIn() {
  //   this.eventEmitter.addListener('signIn', async () => {
  //     this.currentUserData = await FirebaseFunctions.fetchUserData();
  //   });
  //   return null;
  // }
}
