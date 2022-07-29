import PaymentHandler from '../Stripe/PaymentHandler';
import FirebaseFunctions from '../Firebase/FirebaseFunctions';
import stripe from 'tipsi-stripe';

export default class SignUpHandler {
  static state = {
    email: '',
    password: '',
    address: '',
    city: '',
    stateProv: '',
    country: '',
    cardnum: '',
    expiration: 'MM/YYYY',
    location: '',
    countryCode: '1',
    countryAbbreviation: 'US',
    phonenum: '',
    firstname: '',
    lastname: '',
  };
  //Stores the User's name temporarily
  static nameHandler(firstname, lastname) {
    this.state.firstname = firstname;
    this.state.lastname = lastname;
  }
  static clearState() {
    this.state = {
      email: '',
      password: '',
      address: '',
      city: '',
      stateProv: '',
      country: '',
      cardnum: '',
      expiration: 'MM/YYYY',
      location: '',
      countryCode: '1',
      countryAbbreviation: 'US',
      phonenum: '',
      firstname: '',
      lastname: '',
      isAUser: false,
    };
  }
  //Stores the User's Phone number temporarily
  static phoneNumberHandler(phonenum, countryAbbreviation, countryCode) {
    this.state.phonenum = phonenum;
    this.state.countryCode = countryCode;
    this.state.countryAbbreviation = countryAbbreviation;
  }
  //Stores the User's Email temporarily
  static emailHandler(email) {
    this.state.email = email;
  }
  //Stores the User's ******** temporarily
  static passHandler(password) {
    this.state.password = password;
  }
  static tempLocationHandler(address, city, stateProv, country) {
    this.state.address = address;
    this.state.city = city;
    this.state.stateProv = stateProv;
    this.state.country = country;
  }
  //Stores the User's Location temporarily
  static locationHandler(location, latitude, longitude) {
    this.state.location = location;
    this.state.latitude = latitude;
    this.state.longitude = longitude;
  }
  //Store's sthe User's ************ temporarily
  static paymentCredsHandler(cardnum, expiration) {
    this.state.cardnum = cardnum;
    this.state.expiration = expiration;
  }
  static async addAddress(array) {
    array[array.length] = {
      location: this.state.location,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      isMainAddress: false,
    };
    await FirebaseFunctions.updateUserAddresses(array);
  }
  //Method that takes care of signing up the user and creating a document
  //for them in the database on Firebase.
  static async SignUpUser(onError) {
    //DEBUG: need to find a fix for this!! It's crucial to store the latitude and longitude of the
    //new address for the Map UI.
    const {
      firstname,
      lastname,
      phonenum,
      location,
      email,
      password,
      expiration,
      cardnum,
      latitude,
      longitude,
    } = this.state;
    //Creates a user object and creates the new user
    let errorHasOccurred = false;
    const customerObj = await PaymentHandler.newStripeUser({
      email: email,
      name: firstname + ' ' + lastname,
      phone: phonenum === '' ? null : phonenum,
    }).catch(err => {
      console.error(err);
      errorHasOccurred = true;
      onError();
    });
    //console.warn(errorHasOccurred);
    if (!errorHasOccurred) {
      //console.warn(customerObj);
      let userObj = {
        firstname: firstname,
        lastOrderIndex: 0,
        lastname: lastname,
        currentOrders: [],
        customerId: customerObj.id,
        addresses: [{location, latitude, longitude, isMainAddress: true}],
      };
      console.log(this.state.isAUser);
      //console.warn('HEHEHEHEH');
      await FirebaseFunctions.createAccount(
        userObj,
        email,
        password,
        this.state.isAUser,
      ).catch(err => {
        console.error(err);
        onError();
        errorHasOccurred = true;
      });
      //console.warn(errorHasOccurred);
      if (!errorHasOccurred) {
        let tok = await stripe
          .createTokenWithCard({
            number: cardnum,
            expMonth: parseInt(
              expiration.substring(0, expiration.indexOf('/')),
            ),
            expYear: parseInt(
              expiration.substring(expiration.indexOf('/') + 1),
            ),
          })
          .catch(err => {
            onError();
            console.error(err);
            errorHasOccurred = true;
          });
        if (!errorHasOccurred) {
          await PaymentHandler.addNewCard(customerObj.id, tok).catch(err => {
            onError();
            console.error(err);
            errorHasOccurred = true;
          });
        }
      }
      this.clearState();
    }
  }
}
