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
  ScrollView,
} from 'react-native';
import FirebaseFunctions from '../../../config/Firebase/FirebaseFunctions';
import SplashScreen from '../../../components/Global Components/SplashScreen';
import {Icon} from 'react-native-elements';
import Heading from '../../../components/Global Components/Heading';
import PhotoUpload from 'react-native-photo-upload';
import Ionicon from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import PopUpInfo from '../../../components/Account Components/PopUpInfo';
import colors from '../../../config/Styles/colors';
import LoadingDots from '../../../components/Global Components/LoadingDots';
import Strings from '../../../config/Strings/Strings';
import GlobalHandler from '../../../config/GlobalHandler/GlobalHandler';
export default class Account extends Component {
  state = {
    name: '',
    phonenum: '',
    isLoading: true,
    userImage: {},
    userImageLoaded: false,
    showingPopUp: false,
    popUpTitle: '',
    popUpBody: '',
  };
  //When the component mounts we load the User's name and Profile picture
  async componentDidMount() {
    //let info = await FirebaseFunctions.getCurrentUserData('commonData');
    let name =
      GlobalHandler.state.simpleUserInfo.firstname +
      ' ' +
      GlobalHandler.state.simpleUserInfo.lastname;
    let userImage = await FirebaseFunctions.getCurrentUserPhoto();
    this.setState({name: name, userImage, isLoading: false});
  }

  showPopUpWith(title, body) {
    this.setState({showingPopUp: true, popUpBody: body, popUpTitle: title});
  }
  render() {
    if (this.state.isLoading) {
      return <SplashScreen />;
    }
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: this.state.showingPopUp ? colors.grey : colors.white,
        }}>
        <Heading navigation={this.props.navigation} defaultRow drawerNavigator>
          <Text
            style={{
              paddingTop: verticalScale(12.16),
              color: colors.white,
              paddingBottom: verticalScale(12.16),
              paddingLeft: scale(5.28),
              paddingRight: scale(5.28),
              alignSelf: 'center',
              fontFamily: 'Arial-BoldMT',
              fontSize: moderateScale(25),
            }}>
            Account
          </Text>
        </Heading>
        <ScrollView>
          <View
            style={{
              width: scale(414),
              height: verticalScale(192),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignContent: 'center',
                justifyContent: 'space-evenly',
                width: scale(414),
                height: verticalScale(192),
              }}>
              <PhotoUpload
                containerStyle={localStyles.changePictureBtn}
                onPhotoSelect={photo =>
                  FirebaseFunctions.changeUserPhoto(photo)
                }>
                <Image
                  onLoadEnd={() => {
                    this.setState({userImageLoaded: true});
                  }}
                  style={localStyles.userImage}
                  source={this.state.userImage}
                />
                {this.state.userImageLoaded ? null : (
                  <View
                    style={[
                      localStyles.userImage,
                      {
                        position: 'absolute',
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                    ]}>
                    <LoadingDots size={10} />
                  </View>
                )}
              </PhotoUpload>
              <Text style={localStyles.userName}>{this.state.name}</Text>
            </View>
          </View>
          <View
            style={{
              width: scale(414),
            }}>
            <TouchableOpacity
              style={[localStyles.accountSettings]}
              onPress={() => {
                this.props.navigation.navigate('AddAddressScreen');
              }}>
              <Text style={localStyles.accountSettingsText}>Addresses</Text>
              <Icon
                color="#fff"
                size={moderateScale(26)}
                name="navigate-next"
              />
            </TouchableOpacity>
            {/* <TouchableOpacity style={[localStyles.accountSettings]} onPress={() => {(this.state.Phonenum == "" ? this.props.navigation.navigate('Phone_Number') : this.props.navigation.navigate('AddCreatePhoneNumberScreen'))}}>{(this.state.Phonenum == "" ? <Text style={localStyles.accountSettingsText}>Set Up a Phone</Text> : <Text style={localStyles.accountSettingsText}>Change Phone</Text>)}<Icon size={fontScale*26} color="#fff" name="navigate-next"/></TouchableOpacity> */}
            <TouchableOpacity
              style={[localStyles.accountSettings]}
              onPress={() => {
                this.props.navigation.navigate('PaymentOptionsScreen');
              }}>
              <Text style={localStyles.accountSettingsText}>
                Payment Options
              </Text>
              <Icon
                color="#fff"
                size={moderateScale(26)}
                name="navigate-next"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                localStyles.accountSettings,
                {marginTop: verticalScale(24.35)},
              ]}
              onPress={() => {
                this.showPopUpWith(
                  'Terms & Conditions',
                  Strings.termsAndConditions,
                );
              }}>
              <Text style={[localStyles.accountSettingsText]}>
                Terms of Service
              </Text>
              <Ionicon
                name="ios-book"
                style={{marginRight: scale(5.28)}}
                color="#fff"
                size={moderateScale(26)}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[localStyles.accountSettings]}
              onPress={() => {
                this.showPopUpWith('Privacy Policy', Strings.privacyPolicy);
              }}>
              <Text style={[localStyles.accountSettingsText]}>
                Privacy Policy
              </Text>
              <FontAwesome5
                name="clipboard-list"
                style={{marginRight: scale(5.28)}}
                color="#fff"
                size={moderateScale(26)}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[localStyles.accountSettings]}
              onPress={() => {
                this.showPopUpWith('Help', Strings.helpText);
              }}>
              <Text style={[localStyles.accountSettingsText]}>Help</Text>
              <FontAwesome5
                name="book-medical"
                color="#fff"
                style={{marginRight: scale(5.28)}}
                size={moderateScale(26)}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[localStyles.accountSettings]}
              onPress={() => {
                this.showPopUpWith('About', Strings.aboutText);
              }}>
              <Text style={[localStyles.accountSettingsText]}>About</Text>
              <AntDesign
                name="idcard"
                style={{marginRight: scale(5.28)}}
                color="#fff"
                size={moderateScale(26)}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                localStyles.accountSettings,
                {marginTop: verticalScale(24.35)},
              ]}
              onPress={async () => {
                this.props.navigation.push('Report', {isOrder: false});
              }}>
              <Text style={[localStyles.accountSettingsText, {color: 'red'}]}>
                Report
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[localStyles.accountSettings]}
              onPress={async () => {
                await FirebaseFunctions.logOut().then(() =>
                  this.props.navigation.navigate('HomeScreen'),
                );
              }}>
              <Text style={[localStyles.accountSettingsText, {color: 'red'}]}>
                Log Out
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {this.state.showingPopUp ? (
          <PopUpInfo
            onBackdropPress={() => this.setState({showingPopUp: false})}
            content={this.state.popUpBody}
            title={this.state.popUpTitle}
          />
        ) : null}
      </View>
    );
  }
}
const localStyles = StyleSheet.create({
  changePictureBtn: {
    width: scale(100), //SCCCALLELED
    alignItems: 'center',
    justifyContent: 'center',
    height: scale(100), //SCCCALLELED
    borderWidth: 2,
    alignSelf: 'center',
    borderColor: colors.transparent,
    borderRadius: scale(50), //SCCCALLELED
    shadowOffset: {width: 3, height: 3},
    backgroundColor: colors.transparent,
    shadowColor: colors.black,
    shadowOpacity: 2,
    elevation: 5,
    flex: null,
  },
  userImage: {
    width: scale(100),
    transform: [{translateX: -1}, {translateY: 1}],
    height: scale(100),
    alignSelf: 'center',
    borderRadius: scale(50),
    borderWidth: 2,
    borderColor: colors.transparent,
  },
  userName: {
    color: colors.black,
    alignSelf: 'center',
    fontFamily: 'Arial-BoldMT',
    fontSize: moderateScale(20),
    marginLeft: scale(31.85),
  },
  accountSettings: {
    width: scale(403.65),
    borderWidth: 1,
    height: verticalScale(58.24),
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: colors.black,
    alignSelf: 'center',
    backgroundColor: colors.black,
    marginBottom: 5,
  },
  accountSettingsText: {
    color: colors.white,
    marginLeft: 10,
    fontFamily: 'Arial-BoldMT',
    fontSize: moderateScale(20),
  },
  starView: {
    width: scale(51.75),
    height: scale(51.75),
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressComponentView: {
    flexDirection: 'row',
    alignContent: 'center',
    maxHeight: verticalScale(99.56),
  },
});
