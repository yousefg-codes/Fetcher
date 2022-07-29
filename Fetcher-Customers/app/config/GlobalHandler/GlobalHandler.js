import {EventEmitter} from 'events';
import FirebaseFunctions from '../Firebase/FirebaseFunctions';
import {displayConfirm} from '../../components/CheckoutComponents/ConfirmItemsReceived';
import {LocalNotification} from '../PushNotifications/PushNotifications';

export default class GlobalHandler {
  static state = {
    screens: [],
    mainAddress: {},
    products: [],
    simpleUserInfo: {},
    businessLocations: [],
  };
  static globalMapInstance = null;
  static eventEmitter = new EventEmitter();
  static currentOrders = [];
  static drivers = [];
  static confirmOrderComponent = null;
  static currentOrdersListeners = [];
  static customPickerRef = null;
  static businessImages = [];

  static setMainAddress(address) {
    this.state.mainAddress = address;
  }
  static getMainAddress() {
    return this.state.mainAddress;
  }
  static addBusinessProducts(products) {
    this.state.products = products;
  }
  static getProducts() {
    return this.state.products;
  }
  static unsubscribeFromOrderListener(index) {
    this.currentOrdersListeners[index]();
    this.currentOrdersListeners.slice(index, 1);
  }
  static addSimpleUserInfo(simpleUserInfo) {
    this.state.simpleUserInfo = simpleUserInfo;
    //console.log('length'+simpleUserInfo.currentOrders.length)
    // simpleUserInfo.currentOrders.forEach((element, index) => {
    //   this.currentOrdersListeners.push(FirebaseFunctions.listenOnOrderDoc(element.orderId, (query) => {
    //     let orderDetails = query.data();
    //     if(orderDetails.status === 'DELIVERED'){
    //       // displayConfirm(element, index);
    //       LocalNotification();
    //       console.log('YAY')
    //     }
    //     console.log('WASSSUP')
    //   }))
    // })
  }
}
