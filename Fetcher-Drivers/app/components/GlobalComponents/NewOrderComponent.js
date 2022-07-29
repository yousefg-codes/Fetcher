import React, {useState, Component} from 'react';
import {View, Animated, Text, TouchableOpacity} from 'react-native';
import GlobalStateHandler from '../../config/GlobalHandler/GlobalStateHandler';
import styles from '../../config/Styles/NewOrderComponentStyle';
import {
  scale,
  moderateScale,
  verticalScale,
} from '../../config/Styles/dimensions';
import FirebaseFunctions from '../../config/Firebase/FirebaseFunctions';
import {displayAwaitingOrder} from './AwaitingOrderComponent';
import {displayClickHereToViewOrder} from './ViewOrderInfoComponent';
import Modal from 'react-native-modal';

class NewOrderComponent extends Component {
  state = {
    args: null,
    isVisible: false,
  };

  animateOut = () => {
    this.setState({isVisible: true});
  };

  showOrder = args => {
    //console.log(args);
    this.setState({args}, () => this.animateOut());
  };

  animateIn = () => {
    this.setState({isVisible: false});
  };
  render() {
    return (
      <Modal
        isVisible={this.state.isVisible}
        style={[styles.animatedContainer]}>
        <View style={styles.infoContainer}>
          {this.state.args === null ? null : (
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={styles.infoSubContainers}>
                <Text style={styles.infoText}>
                  Customer:{' '}
                  {this.state.args.orderDetails.orderInfo.customerName}
                </Text>
                <Text style={styles.infoText}>
                  Business Location:{' '}
                  {
                    this.state.args.orderDetails.orderInfo.businessLocation
                      .businessLocation
                  }
                </Text>
              </View>
              <View style={styles.infoSubContainers}>
                <Text style={styles.infoText}>
                  Total Cost: $
                  {this.state.args.orderDetails.orderInfo.totalCost}
                </Text>
                <Text style={styles.infoText}>
                  Number of Items:{' '}
                  {this.state.args.orderDetails.orderInfo.items.length}
                </Text>
              </View>
            </View>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.rejectBtn}
            onPress={async () => {
              await FirebaseFunctions.rejectRequest(this.state.args.orderID);
              this.animateIn();
              if (
                GlobalStateHandler.currentUserData.currentOrders.length === 0
              ) {
                displayAwaitingOrder();
              }
              //FirebaseFunctions.listenForNewOrders();
            }}>
            <Text style={styles.acceptAndRejectText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.acceptBtn}
            onPress={async () => {
              const {orderDetails} = this.state.args;
              // if (
              //   GlobalStateHandler.currentUserData.currentOrders.length === 0
              // ) {
              //   await GlobalStateHandler.mapRef.getDirectionsToAddresses([
              //     '$'+orderDetails.orderInfo.businessLocation.businessLocation,
              //     orderDetails.orderInfo.customerLocation.latitude+','+orderDetails.orderInfo.customerLocation.longitude
              //   ]);
              // }
              await FirebaseFunctions.acceptRequest(this.state.args.orderID);
              //console.log('CURRENT ORDERS LENGTH');
              //console.log(
              // s
              if (
                GlobalStateHandler.currentUserData.currentOrders.length === 1
              ) {
                GlobalStateHandler.navigation.navigate('mainDrawerNavigator');
                GlobalStateHandler.eventEmitter.emit('moreOrders');
              }
              this.animateIn();
              if (
                GlobalStateHandler.currentUserData.currentOrders.length === 1
              ) {
                setTimeout(
                  () => displayClickHereToViewOrder(this.state.args),
                  700,
                );
              }
            }}>
            <Text style={styles.acceptAndRejectText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

const displayNewOrder = args => {
  GlobalStateHandler.newOrderComponentRef.showOrder(args);
};

export {NewOrderComponent, displayNewOrder};
