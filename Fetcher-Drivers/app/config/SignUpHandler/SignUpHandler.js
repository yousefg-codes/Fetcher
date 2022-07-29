import FirebaseFunctions from '../Firebase/FirebaseFunctions';

export default class SignUpHandler {
  static firstName = '';
  static lastName = '';
  static driversLicenseNumber = '';
  static ssn = '';
  static birthDate = '';
  static age = 18;
  static birthDay = 31;
  static birthMonth = 12;
  static birthYear = -1;
  static routingNumber = '';
  static accountNumber = '';
  static address = '';
  static email = '';
  static password = '';
  static city = '';
  static stateProv = '';
  static country = '';
  static fullAddress = '';

  static paymentInfo(routingNumber, accountNumber) {
    this.routingNumber = routingNumber;
    this.accountNumber = accountNumber;
  }

  static setBasicInfo(
    firstName,
    lastName,
    birthDate,
    age,
    birthDay,
    birthMonth,
    birthYear,
  ) {
    this.birthDay = birthDay;
    this.birthMonth = birthMonth;
    this.birthYear = birthYear;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthDate = birthDate;
    this.age = age;
  }
  static setMainInfo(ssn, driversLicenseNumber) {
    this.ssn = ssn;
    this.driversLicenseNumber = driversLicenseNumber;
  }
  static setAddressInfo(address, city, stateProv, country) {
    this.address = address;
    this.fullAddress =
      address +
      ', ' +
      (stateProv === ''
        ? city + ', ' + country
        : stateProv + ', ' + city + ', ' + country);
    this.city = city;
    this.stateProv = stateProv;
    this.country = country;
  }
  static clearAll() {
    this.firstName = '';
    this.lastName = '';
    this.driversLicenseNumber = '';
    this.ssn = '';
    this.birthDate = '';
    this.age = 18;
    this.birthDay = 31;
    this.birthMonth = 12;
    this.birthYear = -1;
    this.routingNumber = '';
    this.accountNumber = '';
    this.address = '';
    this.email = '';
    this.password = '';
    this.city = '';
    this.stateProv = '';
    this.country = '';
    this.fullAddress = '';
  }
  static async hash(number) {
    'use-strict';
    return await FirebaseFunctions.call('hashNum', {number});
  }
  static async signUpUser() {
    let newObj = {
      currentLocation: {
        heading: -1,
        latitude: -1,
        longitude: -1,
      },
      currentOrders: [],
      requestedOrders: [],
      isInDrivingSession: false,
      verified: false,
      lastEarningsIndex: 0,
      lastOrderIndex: 0,
      routingNum: await this.hash(this.routingNumber),
      accountNum: await this.hash(this.accountNumber),
      address: this.fullAddress,
      name: this.firstName + ' ' + this.lastName,
      //securityString: await this.hash(this.ssn),
      driverString: await this.hash(this.driversLicenseNumber),
      age: this.age,
      birthDate: this.birthDate,
    };
    await FirebaseFunctions.signUpDriver(this.email, this.password, newObj);
    this.clearAll();
  }
  static async addDriverDoc(uid) {
    let newObj = {
      currentLocation: {
        heading: -1,
        latitude: -1,
        longitude: -1,
      },
      currentOrders: [],
      isInDrivingSession: false,
      verified: false,
      lastOrderIndex: 0,
      lastEarningsIndex: 0,
      address: this.fullAddress,
      requestedOrders: [],
      routingNum: await this.hash(this.routingNumber),
      accountNum: await this.hash(this.accountNumber),
      name: this.firstName + ' ' + this.lastName,
      //securityString: await this.hash(this.ssn),
      driverString: await this.hash(this.driversLicenseNumber),
      age: this.age,
      birthDate: this.birthDate,
    };
    await FirebaseFunctions.createDriverDoc(newObj, uid);
    this.clearAll();
  }
}
