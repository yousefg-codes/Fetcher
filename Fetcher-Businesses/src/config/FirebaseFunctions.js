import firebase from "firebase/app";
import firestore from "firebase/firestore";
import auth from "firebase/auth";
import storage from "firebase/storage";
import functions from "firebase/functions";
import GlobalStateHandler from "./GlobalStateHandler";

// Your web app's Firebase configuration
const fetcherConfig = {
  apiKey: "MY_KEY",
  authDomain: "MY_AUTH_DOMAIN",
  databaseURL: "DATABASE_URL",
  projectId: "PROJECT_ID",
  storageBucket: "STORAGE_BUCKET",
  messagingSenderId: "MESSAGING_SENDER_ID",
  appId: "APP_ID",
  measurementId: "MEASUREMENT_ID",
};

class FirebaseFunctions {
  // Initialize Firebase
  static fetcher = this.initializeFetcher();
  static fetcherFirestore = this.initializeFirestore();
  static businessesCollection =
    this.fetcherFirestore.collection("BusinessData");
  static businessLocationsColl =
    this.fetcherFirestore.collection("BusinessLocations");
  static fetcherAuth = firebase.auth();
  static fetcherStorage = firebase.storage();
  static fetcherFunctions = firebase.functions();
  static fetcherBusinessApplications =
    this.fetcherFirestore.collection("Reports");
  static drivers = this.fetcherFirestore.collection("Drivers");
  static currentUser = null; //this.fetcherAuth.currentUser;
  static products = this.fetcherFirestore.collection("Products");
  static batch = this.fetcherFirestore.batch();
  static endUserDocListener = null;
  static orders = this.fetcherFirestore.collection("Orders");
  static signingUpBusinessInfo = {};
  static testingDocExists = false;

  static initializeFetcher() {
    var fetcher = firebase.initializeApp(fetcherConfig);
    return fetcher;
  }
  static async removeProduct(productId) {
    //console.warn(productId)
    await this.products
      .doc(productId)
      .collection("Ratings")
      .get()
      .then((snapshot) => {
        snapshot.forEach((document) => {
          this.products
            .doc(productId)
            .collection("Ratings")
            .doc(document.id)
            .delete();
        });
      });
    await this.products.doc(productId).delete();
    await this.businessesCollection
      .doc(this.currentUser.uid)
      .update({ numProducts: GlobalStateHandler.businessData.numProducts - 1 });
    await this.fetcherStorage
      .ref("Businesses/" + this.currentUser.uid + "/ProductImgs/" + productId)
      .delete();
  }
  static initializeFirestore() {
    console.log(this.fetcher.firestore());
    return this.fetcher.firestore();
  }
  static async logOut() {
    await this.fetcherAuth.signOut();
    GlobalStateHandler.businessData = null;
  }
  static async authStateChangeExec(user, first, callBack, setFirst) {
    if (user !== null && this.currentUser !== null) {
      let businessDoc = await this.getBusinessDoc();
      if (businessDoc.exists) {
        GlobalStateHandler.businessData = businessDoc.data();
        let businessLocDoc = await this.getBusinessLocDoc();
        GlobalStateHandler.businessLocation = {
          ...businessLocDoc.data(),
          id: businessLocDoc.id,
        };
        if (this.endUserDocListener !== null) {
          this.endUserDocListener();
        }
        this.endUserDocListener = this.businessesCollection
          .doc(user.uid)
          .onSnapshot((query) => {
            GlobalStateHandler.businessData = query.data();
            GlobalStateHandler.eventEmitter.emit("businessDataChanged");
          });
      } else {
        this.continueSignUp().then(async () => {
          GlobalStateHandler.businessData = businessDoc.data();
          let businessLocDoc = await this.getBusinessLocDoc();
          GlobalStateHandler.businessLocation = {
            ...businessLocDoc.data(),
            id: businessLocDoc.id,
          };
          if (this.endUserDocListener !== null) {
            this.endUserDocListener();
          }
          let firstTime = false;
          this.endUserDocListener = this.businessesCollection
            .doc(user.uid)
            .onSnapshot((query) => {
              GlobalStateHandler.businessData = query.data();
              GlobalStateHandler.eventEmitter.emit("businessDataChanged");
              if (!firstTime) {
                this.signingUpBusinessInfo.afterSignUp();
                firstTime = false;
              }
            });
        });
      }
    } else if (this.endUserDocListener !== null) {
      this.endUserDocListener();
    }
    if (first) {
      callBack();
      setFirst();
    }
  }
  static useAuthState(callBack) {
    let first = true;
    this.fetcherAuth.onAuthStateChanged(async (user) => {
      if (!this.testingDocExists) {
        this.currentUser = user;
        console.log(first);
        await this.authStateChangeExec(user, first, callBack, () => {
          first = false;
        });
      }
    });
  }
  static async callFunction(name, parameters) {
    let functionReturn = await this.fetcherFunctions.httpsCallable(name)(
      parameters
    );
    return functionReturn.data;
  }
  static async updateSpecificProductImage(productId, image) {
    await this.fetcherStorage
      .ref("Businesses/" + this.currentUser.uid + "/ProductImgs/" + productId)
      .putString(image, "data_url");
  }
  static async updateSpecificProductObj(productId, updatedObj) {
    await this.products.doc(productId).update(updatedObj);
  }
  static async createNewProduct(newObj, image) {
    let newProduct = await this.products.add(newObj);
    await this.fetcherStorage
      .ref(
        "Businesses/" + this.currentUser.uid + "/ProductImgs/" + newProduct.id
      )
      .putString(image, "data_url");
    let ref = this.products.doc(newProduct.id).collection("Ratings").doc("0");
    this.batch.set(ref, { ratings: [] });
    await this.batch.commit();
    this.batch = this.fetcherFirestore.batch();
    await this.businessesCollection
      .doc(this.currentUser.uid)
      .update({ numProducts: GlobalStateHandler.businessData.numProducts + 1 });
    return newProduct.id;
  }
  static async listenOnOrderDoc(orderId, onSnap) {
    return this.businessesCollection.doc(orderId).onSnapshot((query) => {
      onSnap(query.data());
    });
  }

  static listenOnDriverDoc(driverId, onSnap) {
    return this.drivers.doc(driverId).onSnapshot((query) => {
      onSnap(query.data());
    });
  }
  static async getOrder(orderId) {
    return (await this.orders.doc(orderId).get()).data();
  }
  // static async getIncomingOrderItems(items) {
  //   let tempItemsObj = [];
  //   for(let i = 0; i < items.length; i++){
  //     tempItemsObj.push((await this.products.doc(items[i]).get()).data());
  //   }
  //   return tempItemsObj;
  // }
  static async getProductsForOrder(productIdsAndQuantities) {
    let products = [];
    productIdsAndQuantities.forEach((element) => {
      products.push({
        productId: element.itemId,
        fetchedData: this.products.doc(element.itemId).get(),
        imageURL: this.getProductImage(element.itemId),
        quantity: element.quantity,
      });
    });
    Promise.all(products).then((values) => {
      values.forEach(async (element, index) => {
        let imageURL;
        element.imageURL.then((image) => {
          imageURL = image;
        });
        console.warn(element.fetchedData);
        products[index] = {
          ...element.fetchedData,
          quantity: element.quantity,
          imageURL,
        };
      });
    });
    console.warn(products);
    return products;
  }
  static async getProductImage(productId) {
    let image = await this.fetcherStorage
      .ref("Businesses/" + this.currentUser.uid + "/ProductImgs/" + productId)
      .getDownloadURL();
    return image;
  }
  static async getProducts(limit) {
    let products = this.products
      .where("businessId", "==", this.currentUser.uid)
      .limit(limit)
      .get();
    return products;
  }
  static listenOnProduct(productId, onChange) {
    this.products.doc(productId).onSnapshot((query) => {
      onChange(query);
    });
  }
  static async toggleIsOpen(isOpen) {
    await this.businessesCollection
      .doc(this.currentUser.uid)
      .update({ isOpen });
  }
  static async getBusinessLogo() {
    return await this.fetcherStorage
      .ref("Businesses/" + this.currentUser.uid + "/BusinessLogo")
      .getDownloadURL();
  }
  static async changeBusinessLogo(image) {
    await this.fetcherStorage
      .ref("Businesses/" + this.currentUser.uid + "/BusinessLogo")
      .putString(image, "data_url");
  }
  static async getBusinessDoc() {
    return await this.businessesCollection.doc(this.currentUser.uid).get();
  }
  static async getBusinessLocDoc() {
    return (
      await this.businessLocationsColl
        .where("businessId", "==", this.currentUser.uid)
        .get()
    ).docs[0];
  }
  static async signUpBusiness(
    businessInfo,
    businessLocationObj,
    numEmployees,
    imageURL,
    password,
    afterSignUp,
    isAUser
  ) {
    let id;
    console.warn(isAUser);
    if (!isAUser) {
      id = (
        await this.fetcherAuth.createUserWithEmailAndPassword(
          businessInfo.ownerEmail,
          password
        )
      ).user.uid;
      businessLocationObj.businessId = id;
      this.signingUpBusinessInfo = {
        businessLocationObj,
        id,
        imageURL,
        numEmployees,
        businessInfo,
        afterSignUp,
      };
    } else {
      //this.testingDocExists = true;
      console.warn("IN");
      id = (
        await this.fetcherAuth.signInWithEmailAndPassword(
          businessInfo.ownerEmail,
          password
        )
      ).user.uid;
      console.warn(id);
      businessLocationObj.businessId = id;
      this.signingUpBusinessInfo = {
        businessLocationObj,
        id,
        imageURL,
        numEmployees,
        businessInfo,
        afterSignUp,
      };
    }
    // await this.continueSignUp().then(() => {
    //   this.signingUpBusinessInfo.afterSignUp();
    // });
  }
  static async continueSignUp() {
    const { id, businessInfo, businessLocationObj, numEmployees, imageURL } =
      this.signingUpBusinessInfo;
    let ref = this.businessesCollection.doc(id);
    let ref2 = ref.collection("Earnings").doc("0");
    let ref3 = ref.collection("Orders").doc("0");
    this.batch.set(ref, businessInfo);
    this.batch.set(ref2, { earnings: [] });
    this.batch.set(ref3, { orders: [] });
    await this.batch.commit();
    this.batch = this.fetcherFirestore.batch();
    await this.fetcherStorage
      .ref("Businesses/" + id + "/BusinessLogo")
      .putString(imageURL, "data_url");
    await this.businessLocationsColl.add(businessLocationObj);
    await this.submitSignUpForm(businessInfo, numEmployees);
  }
  static async deleteIncomingOrder(orderId) {
    await this.businessesCollection.doc(this.currentUser.uid).update({
      incomingOrders: firebase.firestore.FieldValue.arrayRemove(orderId),
    });
  }
  static async sendSupportMessage(name, email, body) {
    await this.fetcherBusinessApplications
      .add({
        to: "support@fetchertech.com",
        message: {
          subject: "SUPPORT MESSAGE",
          text: "NAME: " + name + "\nEMAIL: " + email + "\n" + body,
        },
      })
      .catch((err) => {});
  }
  static async sendResetEmail(email) {
    await this.fetcherAuth.sendPasswordResetEmail(email);
  }
  static async checkPassword(password) {
    await this.fetcherAuth.signInWithEmailAndPassword(
      GlobalStateHandler.businessData.ownerEmail,
      password
    );
  }
  static async signIn(history, email, password) {
    let signInError = false;
    document.getElementById("loaderLogin").style.display = "flex";
    document.getElementById("loaderLogin").className += " active";
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("loginFormLogo").style.display = "none";
    this.fetcherAuth
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(async () => {
        this.testingDocExists = true;
        let user = await this.fetcherAuth.signInWithEmailAndPassword(
          email,
          password
        );
        this.currentUser = user.user;
        let businessData;
        if (this.currentUser !== null) {
          //console.log(this.currentUser);
          businessData = await this.getBusinessDoc();
          if (businessData.exists) {
            GlobalStateHandler.businessData = businessData.data();
            this.testingDocExists = false;
            this.authStateChangeExec(this.currentUser, false, () => {});
          } else {
            this.testingDocExists = false;
            await this.fetcherAuth.signOut();
            signInError = true;
          }
        }
        return user;
      })
      .then(async () => {
        //window.location.href = 'HomeScreen.html'
        if (!signInError) {
          document.getElementById("loaderLogin").style.display = "none";
          document.getElementById("loginForm").style.display = "flex";
          document.getElementById("loginFormLogo").style.display = "block";
          history.push("/dashboard");
        } else {
          console.warn("YEAAAH");
          document.getElementById("loaderLogin").style.display = "none";
          document.getElementById("loaderLogin").className += " active";
          document.getElementById("loginForm").style.display = "flex";
          document.getElementById("loginFormLogo").style.display = "block";
          document.getElementById("FailedSignIn").value =
            "It appears you are a Fetcher/Fetcher Drivers User but you have not signed up as a business";
          document.getElementById("FailedSignIn").style.display = "flex";
        }
      })
      .catch((error) => {
        // var errorCode = error.code;
        // var errorMessage = error.message;
        console.error(error);
        document.getElementById("loaderLogin").style.display = "none";
        document.getElementById("loaderLogin").className += " active";
        document.getElementById("loginForm").style.display = "flex";
        document.getElementById("loginFormLogo").style.display = "block";
        document.getElementById("FailedSignIn").value = error.code;
        document.getElementById("FailedSignIn").style.display = "flex";
      });
  }
  static async submitSignUpForm(businessInfo, numEmployees) {
    await this.fetcherBusinessApplications
      .add({
        to: "support@fetchertech.com",
        message: {
          subject: "NEW BUSINESS APPLICATION",
          text:
            "NEW BUSINESS HAS APPLIED\n" +
            JSON.stringify(businessInfo) +
            "\nnumEmployees: " +
            numEmployees,
        },
      })
      .catch((err) => {});
  }
  static async firebaseConfig() {
    this.fetcher.analytics();
  }
  static async checkForNewPastOrderDocs(refreshFunction, addingFunction) {
    let firstCheck = true;
    let length = -1;
    this.businessesCollection
      .doc(this.currentUser.uid)
      .collection("Orders")
      .onSnapshot((query) => {
        if (!firstCheck) {
          if (query.docs.length > length) {
            this.listenOnPastOrderDoc(
              query.docs.length - 1,
              refreshFunction,
              addingFunction,
              false
            );
            length = query.docs.length;
          }
        } else {
          length = query.docs.length;
          firstCheck = false;
        }
      });
  }
  static async listenOnPastOrderDoc(
    index,
    refreshFunction,
    addingFunction,
    isOld
  ) {
    let isFirst = true;
    this.businessesCollection
      .doc(this.currentUser.uid)
      .collection("Orders")
      .doc(index + "")
      .onSnapshot((query) => {
        if (!isFirst) {
          refreshFunction(query.data(), index);
        } else {
          addingFunction(query.data(), index, isOld);
          isFirst = false;
        }
      });
  }
  static async updateBusinessLocationInfo(obj) {
    await this.businessLocationsColl
      .doc(GlobalStateHandler.businessLocation.id)
      .update(obj);
    GlobalStateHandler.businessLocation.latitude = obj.latitude;
    GlobalStateHandler.businessLocation.longitude = obj.longitude;
    GlobalStateHandler.businessLocation.location = obj.location;
  }
  static async updateBusinessInfo(obj) {
    await this.businessesCollection.doc(this.currentUser.uid).update(obj);
  }
  static async loadPastOrder(index, refreshFunction, addingFunction, isOld) {
    this.listenOnPastOrderDoc(index, refreshFunction, addingFunction, isOld);
  }
  static async checkForNewEarningsDocs(refreshFunction, addingFunction) {
    let firstCheck = true;
    let length = -1;
    this.businessesCollection
      .doc(this.currentUser.uid)
      .collection("Earnings")
      .onSnapshot((query) => {
        if (!firstCheck) {
          if (query.docs.length > length) {
            this.listenOnEarningsDoc(
              query.docs.length - 1,
              refreshFunction,
              addingFunction,
              false
            );
            length = query.docs.length;
          }
        } else {
          length = query.docs.length;
          firstCheck = false;
        }
      });
  }
  static async listenOnEarningsDoc(
    index,
    refreshFunction,
    addingFunction,
    isOld
  ) {
    let isFirst = true;
    this.businessesCollection
      .doc(this.currentUser.uid)
      .collection("Earnings")
      .doc(index + "")
      .onSnapshot((query) => {
        if (!isFirst) {
          refreshFunction(query.data(), index);
        } else {
          console.log(query.id);
          addingFunction(query.data(), index, isOld);
          isFirst = false;
        }
      });
  }
  static async loadEarnings(index, refreshFunction, addingFunction, isOld) {
    this.listenOnEarningsDoc(index, refreshFunction, addingFunction, isOld);
  }
  static async loadSpecificPastOrder(docId, indecies) {
    let doc = await this.businessesCollection
      .doc(this.currentUser.uid)
      .collection("Orders")
      .doc(docId)
      .get();
    let specificPastOrders = [];
    let orders = doc.data().orders;
    for (var i = 0; i < indecies.length; i++) {
      specificPastOrders.push(orders[indecies[i]]);
    }
    return specificPastOrders;
  }
}
export default FirebaseFunctions;
