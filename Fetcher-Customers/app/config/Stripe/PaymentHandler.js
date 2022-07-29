import FirebaseFunctions from '../Firebase/FirebaseFunctions';

export default class CardPayments {
  static stripe;
  static async getFrontEndStripe() {
    await fetch('https://js.stripe.com/v3/')
      .then(res => res.text())
      .then(txt => {
        this.stripe = eval(txt);
      });
  }
  static async makeThePayment(obj, onError) {
    return await FirebaseFuctions.call('payWithStripe', {obj, onError});
  }
  static async newStripeUser(obj) {
    return await FirebaseFunctions.call('newUser', {...obj});
  }
  static async removeCard(paymentMethodId) {
    await FirebaseFunctions.call('removeCard', {paymentMethodId});
  }
  static async getCard(cardId) {
    return await FirebaseFunctions.call('getCard', {cardId});
  }
  static async getAllCards(customerId) {
    return await FirebaseFunctions.call('getAllCards', {customerId});
  }
  static async addNewCard(customerId, cardTok) {
    return await FirebaseFunctions.call('newCard', {cardTok, customerId});
  }
  static async getCustomer(id) {
    return await FirebaseFunctions.call('getCustomer', {id});
  }
  //TODO: finish this method!!
  static async applePaymentRequest(obj) {
    return await FirebaseFunctions.call('applePaymentRequest', {obj});
  }
  static async paymentRequest(obj) {
    return await FirebaseFunctions.call('paymentRequest', {obj});
  }
  // +  functions[payWithStripe]: http function initialized (http://localhost:5000/fetcher-70b9e/us-central1/payWithStripe).
  // +  functions[newUser]: http function initialized (http://localhost:5000/fetcher-70b9e/us-central1/newUser).
  // +  functions[newCard]: http function initialized (http://localhost:5000/fetcher-70b9e/us-central1/newCard).
  // +  functions[getCustomer]: http function initialized (http://localhost:5000/fetcher-70b9e/us-central1/getCustomer).
  // +  functions[applePaymentRequest]: http function initialized (http://localhost:5000/fetcher-70b9e/us-central1/applePaymentRequest).
  // +  functions[paymentRequest]: http function initialized (http://localhost:5000/fetcher-70b9e/us-central1/paymentRequest)
}
