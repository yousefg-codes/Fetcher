import {scale, verticalScale, moderateScale} from 'config/Styles/dimensions';
import React, {Component} from 'react';
import {
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import FirebaseFunctions from '../../../config/Firebase/FirebaseFunctions';
import {styles} from '../../../config/Styles/globalStyles.js';
import colors from '../../../config/Styles/colors';
import SplashScreen from '../../../components/Global Components/SplashScreen';
import GlobalHandler from '../../../config/GlobalHandler/GlobalHandler';
import {Icon} from 'react-native-elements';
import Geocoder from 'react-native-geocoding';
import Heading from '../../../components/Global Components/Heading';
import AnAddressComponent from '../../../components/Account Components/AddressComponent';
import {showMessage} from 'react-native-flash-message';

export default class AddAddressScreen extends Component {
  state = {
    isLoading: true,
    allAddresses: [],
    isEditing: false,
    Components: [],
    newLocation: {},
    mainAddress: -1,
    originalMain: -1,
  };
  async componentDidMount() {
    let addresses = (await FirebaseFunctions.getCurrentUserData('commonData'))
      .addresses;
    this.setState({allAddresses: addresses, isLoading: false});
    this.createAllAddresses(false);
  }
  async deleteAddress(j) {
    const {allAddresses} = this.state;
    if (j != this.state.mainAddress && allAddresses.length > 1) {
      let arr = [];
      let factor = 0;
      for (var i = 0; i < allAddresses.length; i++) {
        if (i != j) {
          arr[i + factor] = allAddresses[i];
        } else {
          factor = -1;
        }
      }
      //console.log(j);
      //console.log(arr);
      this.setState({allAddresses: arr}, async () => {
        await FirebaseFunctions.updateUserAddresses(arr);
        this.componentDidMount();
      });
    } else {
      showMessage({
        message: 'Uh Oh',
        position: 'top',
        type: 'danger',
        duration: 5000,
        description:
          'You need to switch to another main address, before deleting this one',
      });
    }
  }

  async setAddressMain(i) {
    const {allAddresses, mainAddress} = this.state;
    let addresses = allAddresses;
    addresses[i] = {
      location: addresses[i].location,
      latitude: addresses[i].latitude,
      longitude: addresses[i].longitude,
      isMainAddress: true,
    };
    mainAddress > -1 && mainAddress != i
      ? (addresses[mainAddress] = {
          location: addresses[mainAddress].location,
          latitude: addresses[mainAddress].latitude,
          longitude: addresses[mainAddress].longitude,
          isMainAddress: false,
        })
      : null;
    await FirebaseFunctions.updateUserAddresses(addresses);
    GlobalHandler.setMainAddress(addresses[i]);
    //console.log(GlobalHandler.state.screens[0])
    await GlobalHandler.state.screens[0].componentDidMount();
    if (GlobalHandler.state.screens[1] !== undefined) {
      await GlobalHandler.state.screens[1].componentDidMount();
    }
    if (GlobalHandler.state.screens[3] !== undefined) {
      await GlobalHandler.state.screens[3].componentDidMount();
    }
    if (GlobalHandler.state.screens[2] !== undefined) {
      await GlobalHandler.state.screens[2].componentDidMount();
    }
    this.createAllAddresses(true);
  }

  createAllAddresses(secondTime) {
    let components = [];
    const {allAddresses} = this.state;
    for (var i = 0; i < allAddresses.length; i++) {
      let myCode = i;
      allAddresses[i].isMainAddress
        ? this.setState({
            mainAddress: i,
            originalMain: secondTime ? this.state.originalMain : i,
          })
        : null;
      components[i] = (
        <AnAddressComponent
          mainAddress={allAddresses[i].isMainAddress}
          onPressSetMain={() => this.setAddressMain(myCode)}
          onSubmit={() => {}}
          onPressDelete={() => this.deleteAddress(myCode)}
          isNewAddress={false}
          isEditing={this.state.isEditing}
          key={i}
          number={i}
          Address={allAddresses[i].location}
        />
      );
    }
    this.setState({Components: components}, () => {
      //console.log(this.state.Components);
    });
  }
  createNewAddress() {
    this.props.navigation.push('Location', {
      allAddresses: this.state.allAddresses,
      addingAddress: true,
      numAddresses: this.state.allAddresses.length,
    });
  }
  async changeEdit() {
    this.setState({isEditing: !this.state.isEditing}, () => {
      if (this.state.isEditing) {
        showMessage({
          message: 'Hint',
          type: 'success',
          description:
            'to change your main address, click on an address other than the current main address',
          duration: 3000,
          position: 'top',
        });
      }
      this.createAllAddresses(true);
    });
  }
  checkBeforeLeaving = () => {
    if (this.state.allAddresses.length === 0) {
      showMessage({
        message: 'Uh Oh',
        position: 'top',
        type: 'danger',
        duration: 5000,
        description: 'sorry, but you have to live somewhere',
      });
    } else {
      this.props.navigation.navigate('Account');
    }
  };
  render() {
    if (this.state.isLoading) {
      return <SplashScreen />;
    }
    return (
      <View
        style={{
          width: scale(414),
          height: verticalScale(896),
          backgroundColor: colors.white,
        }}>
        <View style={{height: verticalScale(89.6)}}>
          <Heading
            defaultRow
            onPress={() => this.checkBeforeLeaving()}
            navigation={this.props.navigation}
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              alignContent: 'center',
            }}>
            <TouchableOpacity
              style={[
                styles.next,
                {
                  paddingLeft: scale(31.85),
                  paddingTop: 0,
                  paddingBottom: 0,
                  paddingRight: scale(31.85),
                  height: verticalScale(35.84),
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: this.state.isEditing
                    ? '#ff0000'
                    : colors.white,
                  borderColor: this.state.isEditing ? '#ff0000' : colors.white,
                  marginRight: scale(10.56),
                },
              ]}
              onPress={() => this.changeEdit()}>
              <Text
                style={{
                  color: colors.black,
                  fontFamily: 'Arial-BoldMT',
                  fontSize: moderateScale(18),
                }}>
                Edit
              </Text>
            </TouchableOpacity>
          </Heading>
        </View>
        <View style={{height: verticalScale(59.73)}} />
        <View
          style={{
            height: verticalScale((this.state.Components.length * 896) / 8),
          }}>
          {this.state.Components}
        </View>
        <View
          style={{
            height: verticalScale(224),
            paddingTop: verticalScale(9.73),
          }}>
          {this.state.isEditing ? (
            <TouchableOpacity
              onPress={() => {
                this.createNewAddress();
              }}>
              <Icon name="add-circle" style={{color: '#0000ff'}} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }
}
