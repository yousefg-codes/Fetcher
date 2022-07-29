import app from '@react-native-firebase/app';
import firebaseFunctions from '@react-native-firebase/functions';
import firebaseAuth from '@react-native-firebase/auth';
import firebaseAnalytics from '@react-native-firebase/analytics';
import firebaseStorage from '@react-native-firebase/storage';
import firebaseFirestore from '@react-native-firebase/firestore';
import firebaseMessaging from '@react-native-firebase/messaging';
import GlobalHandler from '../GlobalHandler/GlobalHandler';
import {EmptyAvatar} from '../Image Requires/imageImports';
import {showMessage} from 'react-native-flash-message';
import {LocalNotification} from '../PushNotifications/PushNotifications';
import {element} from 'prop-types';

export default class FirebaseFunctions {
  static currentUser = firebaseAuth().currentUser;

  // Initialize Firebase
  static firestore = firebaseFirestore();
  static drivers = this.firestore.collection('Drivers');
  static orders = this.firestore.collection('Orders');
  static usersColl = this.firestore.collection('Users');
  static productsColl = this.firestore.collection('Products');
  static businessesColl = this.firestore.collection('BusinessData');
  static businessesLocColl = this.firestore.collection('BusinessLocations');
  static firestoreBatch = this.firestore.batch();
  static carts = this.firestore.collection('Carts');
  static reports = this.firestore.collection('Reports');
  static mailCollection = this.firestore.collection('mail');
  static analytics = firebaseAnalytics();
  static storage = firebaseStorage();
  static auth = firebaseAuth();
  static functions = firebaseFunctions();
  static messaging = firebaseMessaging();
  static userListeners = [];

  //Creates an account by first creating an authentication account, then
  //using the new users' uid to create a document for it in the Firebase database under
  //the User's collection
  static async createAccount(credentialsObj, email, password, isAUser) {
    let newUser = isAUser
      ? this.auth.currentUser
      : (await this.auth.createUserWithEmailAndPassword(email, password)).user;
    const Id = newUser.uid;
    let ref = this.usersColl.doc(Id);
    this.firestoreBatch.set(ref, credentialsObj);
    this.firestoreBatch.set(ref.collection('Orders').doc('0'), {orders: []});
    this.firestoreBatch.set(this.carts.doc(Id), {
      items: [],
    }),
      await this.firestoreBatch.commit();
    this.firestoreBatch = this.firestore.batch();
    this.currentUser = firebaseAuth().currentUser;
    this.analytics.logEvent('USER_SIGN_UP');
  }
  //updates the User's document with a new Object
  static async updateUserObj(newUserObj, aFunction) {
    let TheUser = this.usersColl.doc(this.currentUser.uid);
    await TheUser.update(newUserObj);
    this.analytics.logEvent('USER_UPDATE');
    aFunction ? aFunction() : null;
  }
  //Logs in the user with the given the email and password, but it shows a warning if one of the two is incorrect
  static async logIn(email, password) {
    let user = await this.auth.signInWithEmailAndPassword(email, password);
    if ((await this.usersColl.doc(user.user.uid).get()).exists) {
      this.analytics.logEvent('USER_LOGIN');
      this.currentUser = firebaseAuth().currentUser;
      return true;
    }
    await this.auth.signOut();
    return false;
  }
  static async getProduct(Id) {
    return await this.productsColl.doc(Id).get();
  }
  static async addRating(itemId, rating, explanation) {
    let ratingsCollection = await this.productsColl
      .doc(itemId)
      .collection('Ratings')
      .get();
    let ratings = ratingsCollection.docs[
      ratingsCollection.docs.length - 1
    ].data().ratings;
    let currDateRef = new Date();
    let currDate = new Date(currDateRef - 480 * 60000);
    if (ratings.length < 19) {
      ratings.push({
        userId: this.currentUser.uid,
        rating: rating,
        date:
          currDate.getDate() +
          '-' +
          currDate.getMonth() +
          '-' +
          currDate.getFullYear(),
        explanation: explanation,
      });
      //console.log('Ratings: ')
      //console.log(ratings)
      //console.log(''+(ratingsCollection.docs.length-1))
      this.productsColl
        .doc(itemId)
        .collection('Ratings')
        .doc('' + (ratingsCollection.docs.length - 1))
        .update({ratings});
    } else {
      let ref = this.productsColl
        .doc(itemId)
        .collection('Ratings')
        .doc('' + ratingsCollection.docs.length);
      this.firestoreBatch.set(ref);
      await this.firestoreBatch.commit().then(async () => {
        await ref.update({
          ratings: [
            {
              userId: this.currentUser.uid,
              rating: rating,
              date:
                currDate.getDate() +
                '-' +
                currDate.getMonth() +
                '-' +
                currDate.getFullYear(),
              explanation: explanation,
            },
          ],
        });
      });
      await this.productsColl
        .doc(itemId)
        .update({lastRatingIndex: ratingsCollection.docs.length});
    }
    let average = 0;
    let k = 0;
    for (var i = 0; i < ratingsCollection.docs.length; i++) {
      for (
        var j = 0;
        j < ratingsCollection.docs[i].data().ratings.length;
        j++
      ) {
        average += ratingsCollection.docs[i].data().ratings[j].rating;
        k++;
      }
    }
    average = average / k;
    //console.log(k)
    this.productsColl.doc(itemId).update({rating: average, numReviews: k});
  }
  //Logs out the user using Firebase's auth
  static async logOut() {
    this.userListeners.forEach(element => element());
    this.userListeners = [];
    await this.auth.signOut();
    this.currentUser = null;
    this.analytics.logEvent('USER_SIGN_OUT');
  }
  static async getCategoryImg(name) {
    let doc = null;
    let hadError = false;
    doc = await this.storage
      .ref('Category Images/' + name + '.jpg')
      .getDownloadURL()
      .catch(async err => {
        hadError = true;
      });
    if (hadError) {
      doc = await this.storage
        .ref('Category Images/' + name + '.jpeg')
        .getDownloadURL();
    }
    return doc;
  }
  //Sends an email to the user if they forgot their password, where they can reset it
  static async forgotPassword(email) {
    await this.auth.sendPasswordResetEmail(email);
    this.analytics.logEvent('FORGOT_PASSWORD_EMAIL_SENT');
  }
  static async getProductImg(businessId, imageId) {
    return await this.storage
      .ref('Businesses/' + businessId + '/ProductImgs/' + imageId)
      .getDownloadURL();
  }
  static async getOrder(orderId) {
    return (await this.orders.doc(orderId).get()).data();
  }
  static async call(name, parameters) {
    let functionReturn = await this.functions.httpsCallable(name)(parameters);
    return functionReturn.data;
  }
  static async updateUserAddresses(array) {
    let userDoc = this.usersColl.doc(this.currentUser.uid);
    await userDoc.update({addresses: array});
  }
  static async findNearestDriversToBusiness(businessLat, businessLng) {
    let filteredDrivers = await this.drivers
      .where('currentLocation.latitude', '<=', businessLat + 5 / 69)
      .where('currentLocation.latitude', '>=', businessLat - 5 / 69)
      .get();
    let tobeReturned = {docs: []};
    for (var i = 0; i < filteredDrivers.docs.length; i++) {
      if (
        filteredDrivers.docs[i].data().currentLocation.longitude <=
          businessLng + 5 / 69 &&
        filteredDrivers.docs[i].data().currentLocation.longitude >=
          businessLng - 5 / 69 &&
        filteredDrivers.docs[i].data().isInDrivingSession &&
        filteredDrivers.docs[i].data().currentOrders < 2
      ) {
        tobeReturned.docs.push({
          docId: filteredDrivers.docs[i].id,
          driverData: filteredDrivers.docs[i].data(),
        });
      }
    }
    return tobeReturned;
  }
  static async placeOrder(orderInfo, paymentMethodId, onAccept, onTotalReject) {
    let orderId = (await this.orders.add({
      orderInfo,
      driver: null,
      foundDriver: 'none',
      status: 'NOT_DELIVERED',
    })).id;
    let drivers = (await this.findNearestDriversToBusiness(
      orderInfo.businessLocation.latitude,
      orderInfo.businessLocation.longitude,
    )).docs;
    for (let i = 0; i < drivers.length; i++) {
      let index1 = parseInt(Math.random() * drivers.length, 10);
      let index2 = parseInt(Math.random() * drivers.length, 10);
      let temp = drivers[index1];
      drivers[index1] = drivers[index2];
      drivers[index2] = temp;
    }
    //console.warn(drivers);
    await this.iterateThroughDrivers(
      orderId,
      0,
      paymentMethodId,
      driverInfo => onAccept(driverInfo),
      () => onTotalReject(),
      drivers,
    );
  }
  static async iterateThroughDrivers(
    orderId,
    iVal,
    paymentMethodId,
    onAccept,
    onTotalReject,
    drivers,
  ) {
    //for (var i = iVal; i < drivers.length; i++) {
    let i = iVal;
    console.log(drivers[i]);
    if (
      drivers[i].driverData.isInDrivingSession &&
      drivers[i].driverData.currentOrders.length < 2
    ) {
      console.log('IS IN SESSION');
      await this.firestore.runTransaction(async transaction => {
        let latestDriverRequests = (await transaction.get(
          this.drivers.doc(drivers[i].docId),
        )).data().requestedOrders;
        latestDriverRequests.push(orderId);
        transaction.update(this.drivers.doc(drivers[i].docId), {
          requestedOrders: latestDriverRequests,
        });
      });
      let response = '';
      let ignoreFirst = 0;
      let unsubscribe = this.orders.doc(orderId).onSnapshot(async query => {
        if (ignoreFirst > 0) {
          console.log('IS CHECKING STATUS ' + i);
          response = query.data().foundDriver;
          unsubscribe();
          GlobalHandler.eventEmitter.removeAllListeners('response');
          if (response === 'accepted') {
            let copyOfCurrentOrders = GlobalHandler.currentOrders;
            copyOfCurrentOrders.push({orderId, paymentMethodId});
            await this.orders.doc(orderId).update({driver: drivers[copy]});
            onAccept(drivers[copy]);
            await this.usersColl
              .doc(this.currentUser.uid)
              .update({currentOrders: copyOfCurrentOrders});
            await this.carts.doc(this.currentUser.uid).update({items: []});
            await GlobalHandler.state.screens[2].componentDidMount();
            // await this.businessesColl
            //   .doc(query.data().orderInfo.businessLocation.businessId)
            //   .update({incomingOrders: firebaseFirestore.FieldValue.arrayUnion(orderId)});
          } else {
            await this.orders.doc(orderId).update({foundDriver: 'none'});
            if (i + 1 < drivers.length) {
              await this.iterateThroughDrivers(
                orderId,
                i + 1,
                paymentMethodId,
                onAccept,
                onTotalReject,
                drivers,
              );
            } else {
              onTotalReject();
            }
          }
        }
        ignoreFirst++;
      });
      let copy = i;
      //break;
      //}
    } else if (i + 1 < drivers.length) {
      console.log('ENTERED 2.0');
      await this.iterateThroughDrivers(
        orderId,
        i + 1,
        paymentMethodId,
        onAccept,
        onTotalReject,
        drivers,
      );
    } else {
      onTotalReject();
    }
  }
  static async deleteOrderDoc(orderId) {
    await this.orders.doc(orderId).delete();
  }
  static async editCart(array) {
    let cartDoc = this.carts.doc(this.currentUser.uid);
    await cartDoc.update({items: array});
  }
  static async getAllBusinessLocsWhere(varName, condition, equalTo) {
    let data = await this.businessesLocColl
      .where('latitude', '<=', GlobalHandler.getMainAddress().latitude + 5 / 69)
      .where('latitude', '>=', GlobalHandler.getMainAddress().latitude - 5 / 69)
      .get();
    let tobeReturned = {docs: []};
    for (var i = 0; i < data.docs.length; i++) {
      if (
        data.docs[i].data().longitude <=
          GlobalHandler.getMainAddress().longitude + 5 / 69 &&
        data.docs[i].data().longitude >=
          GlobalHandler.getMainAddress().longitude - 5 / 69
      ) {
        if (
          varName
            ? data.docs[i].data().businessName === equalTo
            : // await eval(
              //   'data.docs[i].data().' +
              //     varName +
              //     ' ' +
              //     condition +
              //     ' ' +
              //     equalTo,
              //)
              true
        ) {
          tobeReturned.docs.push(data.docs[i]);
        }
      }
    }
    for (let i = 0; i < tobeReturned.docs.length; i++) {
      GlobalHandler.state.businessLocations.push(tobeReturned.docs[i].data());
    }
    return tobeReturned;
  }
  static listenOnOrderDoc(orderId, callBack) {
    let unsub = this.orders.doc(orderId).onSnapshot(query => callBack(query));
    this.userListeners.push(unsub);
    return unsub;
  }
  static async getCurrentUserPhoto() {
    try {
      const photo = await this.storage
        .ref('Users/User Images/' + this.currentUser.uid)
        .getDownloadURL();
      return {uri: photo};
    } catch {
      return EmptyAvatar;
    }
  }
  static async listenOnProduct(productId, callBack) {
    this.productsColl.doc(productId).onSnapshot(query => {
      callBack(query.data());
    });
  }
  static async getAllProductsInBusiness(businessId) {
    this.userListeners.push(
      this.productsColl
        .where('businessId', '==', businessId)
        .onSnapshot(query => {
          let currProducts = GlobalHandler.state.products;
          if (currProducts.length === 0) {
            for (var j = 0; j < query.docs.length; j++) {
              let item = query.docs[j].data();
              item.itemId = query.docs[j].id;
              GlobalHandler.state.products.push(item);
            }
          } else {
            for (var j = 0; j < query.docs.length; j++) {
              let item = query.docs[j].data();
              item.itemId = query.docs[j].id;
              for (let i = 0; i < currProducts.length; i++) {
                if (currProducts[i].itemId === query.docs[j].id) {
                  GlobalHandler.state.products[i] = item;
                  break;
                }
                if (i + 1 === currProducts.length) {
                  GlobalHandler.state.products[i].push(item);
                }
              }
              //console.warn(GlobalHandler.state.products);
            }
          }
          GlobalHandler.eventEmitter.emit('updateProducts');
          if (
            GlobalHandler.state.screens[2] !== undefined &&
            GlobalHandler.state.screens[2] !== null
          ) {
            GlobalHandler.state.screens[2].componentDidMount();
          }
        }),
    );
  }
  static async changeUserPhoto(photo) {
    await this.storage
      .ref('Users/User Images/' + this.currentUser.uid)
      .putString(photo, 'base64');
  }
  // static async confirmOrder(orderId) {
  //   await this.orders.doc(orderId).update({status: 'DELIVERED'})
  // }
  // static async refuteOrder(orderId){
  //   await this.orders.doc(orderId).update({status: 'DELIVERED_REFUTED'})
  // }
  // static async sendVerificationCode(phonenum){
  //     await this.auth.sendVerificationCode(phonenum);
  //     this.analytics.logEvent('VERIF_CODE_SENT');
  // }
  //This returns the current User's doc data on the database on Firebase
  static async getCurrentUserData(field) {
    if (field === 'commonData') {
      let simpleUserInfo = (await this.usersColl
        .doc(this.currentUser.uid)
        .get()).data();
      return simpleUserInfo;
    }
    if (field === 'orders') {
      let lastIndex = (await this.usersColl
        .doc(this.currentUser.uid)
        .get()).data().lastOrderIndex;
      let data = await this.usersColl
        .doc(this.currentUser.uid)
        .collection('Orders')
        .doc('' + lastIndex)
        .get();
      if (data.data().orders.length < 4 && lastIndex !== 0) {
        let olderDoc = await this.usersColl
          .doc(this.currentUser.uid)
          .collection('Orders')
          .doc('' + (lastIndex - 1))
          .get();
        return [
          {docId: lastIndex, orders: data.data().orders},
          {docId: lastIndex - 1, orders: olderDoc.data().orders},
        ];
      }
      return [{docId: lastIndex, orders: data.data().orders}];
    }
    if (field === 'cart') {
      let data = this.carts.doc(this.currentUser.uid);
      return (await data.get()).data();
    }
  }
  static getBusinessLocation(businessId) {
    let businessLocs = GlobalHandler.state.businessLocations;
    console.log(GlobalHandler.state.businessLocations);
    for (var i = 0; i < businessLocs.length; i++) {
      if (businessLocs[i].businessId === businessId) {
        return businessLocs[i];
      }
    }
  }
  static async getBusiness(businessId) {
    return (await this.businessesColl.doc(businessId).get()).data();
  }
  static async getBusinessLogo(businessId) {
    return {
      uri: await this.storage
        .ref('Businesses/' + businessId + '/BusinessLogo')
        .getDownloadURL(),
    };
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
  static async checkForNewPastOrderDocs(refreshFunction, addingFunction) {
    let firstCheck = true;
    let length = -1;
    this.userListeners.push(
      this.usersColl
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
      this.usersColl
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
  static async loadPastOrder(index, refreshFunction, addingFunction, isOld) {
    this.listenOnPastOrderDoc(index, refreshFunction, addingFunction, isOld);
  }
  static async listenOnCurrentOrders(refreshFunction) {
    let firstTime = true;
    this.userListeners.push(
      this.usersColl.doc(this.currentUser.uid).onSnapshot(async query => {
        GlobalHandler.currentOrders = query.data().currentOrders;
        if (!firstTime) {
          await refreshFunction(query.data());
        } else {
          firstTime = false;
        }
      }),
    );
  }
}
