import {
  scale,
  verticalScale,
  moderateScale,
} from './app/config/Styles/dimensions';
import React, {Component} from 'react';
import {View, Platform, Image, StatusBar, SafeAreaView} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import HomeScreen from './app/screens/First Open Screen/StartupScreen';
import ForgotPasswordScreen from './app/screens/Login Screens/ForgotPasswordScreen';
import FirstLast from './app/screens/Sign Up Screens/FirstLastScreen';
import EmailScreen from './app/screens/Sign Up Screens/EmailScreen';
import PaymentCreds from './app/screens/Sign Up Screens/PaymentCredentialsScreen';
import Phone_Number from './app/screens/Sign Up Screens/PhoneNumberScreen';
import Verification from './app/screens/Sign Up Screens/PhoneNumberVerificationScreen';
import Location from './app/screens/Sign Up Screens/MainAddressScreen';
import Login from './app/screens/Login Screens/Login';
import {
  ProductInfo,
  RateProductScreen,
} from './app/components/Global Components/ProductItem';
import Maps from './app/components/Map/Maps';
import Home from './app/screens/Tab Navigator Screens/Home';
import Search from './app/screens/Tab Navigator Screens/Search';
import Cart from './app/screens/Tab Navigator Screens/Cart';
import PasswordScreen from './app/screens/Sign Up Screens/PasswordScreen';
import MainAccountScreen from './app/screens/Tab Navigator Screens/Account Screens/MainScreen';
import PaymentOptionsScreen from './app/screens/Tab Navigator Screens/Account Screens/PaymentMethodsScreen';
import AddAddressScreen from './app/screens/Tab Navigator Screens/Account Screens/AddressesScreen';
import {
  PastOrders,
  OrderDetails,
} from './app/screens/Tab Navigator Screens/PastOrders';
import ChooseOptionsScreen from './app/screens/CheckoutScreens/ChooseOptionsScreen';
import TrackOrderScreen from './app/screens/CheckoutScreens/TrackOrderScreen';
import FlashMessage from 'react-native-flash-message';
import FirebaseFunctions from './app/config/Firebase/FirebaseFunctions';
import Ionicon from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import BusinessProducts from './app/screens/GroupedProductsScreens/BusinessProducts';
import CategoryProductsScreen from './app/screens/GroupedProductsScreens/CategoryProductsScreen';
import ReportScreen from './app/screens/ReportScreen';
import NoInternetScreen from './app/screens/NoInternetScreen/NoInternetScreen';
import {decode, encode} from 'base-64';
import {ConfirmItemsReceived} from './app/components/CheckoutComponents/ConfirmItemsReceived';
import GlobalHandler from './app/config/GlobalHandler/GlobalHandler';
//import PushNotification from 'react-native-push-notification';
import colors from './app/config/Styles/colors';
import {CustomPicker} from './app/components/Global Components/CustomPicker';
import codePush from 'react-native-code-push';
import {FetcherLogo} from './app/config/Image Requires/imageImports';
import {LocalNotification} from './app/config/PushNotifications/PushNotifications';

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}
const bottomTab = createBottomTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarLabel: '',
        tabBarIcon: ({tintColor}) => (
          <Feather name="home" size={scale(24)} style={{color: tintColor}} /> //SCCCALLELED
        ),
      },
    },
    Search: {
      screen: Search,
      navigationOptions: {
        tabBarLabel: '',
        tabBarIcon: ({tintColor}) => (
          <Ionicon
            name="md-search"
            size={scale(24)}
            style={{color: tintColor}}
          /> //SCCCALLELED
        ),
      },
    },
    Cart: {
      screen: Cart,
      navigationOptions: {
        tabBarLabel: '',
        tabBarIcon: ({tintColor}) => (
          <FontAwesome5
            name="shopping-cart"
            size={scale(24)} //SCCCALLELED
            style={{color: tintColor}}
          />
        ),
      },
    },
    PastOrders: {
      screen: PastOrders,
      navigationOptions: {
        tabBarLabel: '',
        tabBarIcon: ({tintColor}) => (
          <FontAwesome5
            name="list-alt"
            size={scale(24)}
            style={{color: tintColor}}
          /> //SCCCALLELED
        ),
      },
    },
    Account: {
      screen: MainAccountScreen,
      navigationOptions: {
        tabBarLabel: '',
        tabBarIcon: ({tintColor}) => (
          <Ionicon
            name="md-person"
            size={scale(24)}
            style={{color: tintColor}}
          /> //SCCCALLELED
        ),
      },
    },
  },
  {
    tabBarOptions: {
      showLabel: false,
      activeTintColor: colors.white,
      labelStyle: {
        fontFamily: 'Arial-BoldMT',
        fontSize: moderateScale(12),
      },
      style: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        backgroundColor: colors.black,
      },
      tabStyle: {
        height: '100%',
        paddingBottom: 0,
        backgroundColor: colors.black,
        marginBottom: 0,
      },
    },
    headerMode: 'none',
  },
);

const mainStackNavigator = createStackNavigator(
  {
    FirstScreen:
      FirebaseFunctions.currentUser === null ? HomeScreen : bottomTab,
    bottomTab,
    HomeScreen,
    EmailScreen,
    TrackOrderScreen,
    ChooseOptionsScreen,
    ForgotPasswordScreen,
    Login,
    CategoryProductsScreen,
    PaymentCreds,
    PaymentOptionsScreen,
    AddAddressScreen,
    FirstLast,
    Phone_Number,
    RateProductScreen,
    Report: ReportScreen,
    PasswordScreen,
    Verification,
    Location,
    ProductInfo,
    Maps,
    BusinessProducts,
    OrderDetails,
  },
  {headerMode: 'none'},
);

const AppContainer = createAppContainer(mainStackNavigator);

class App extends Component {
  state = {
    appUI: null,
    codePushChecking: true,
    isConnected: true,
  };

  async componentDidMount() {
    //console.log(await FirebaseFunctions.messaging.getToken()+"YOOO");
    //LocalNotification({notification: {title: 'Test', body: 'Testing Testing 123'}});
    FirebaseFunctions.messaging.onMessage(payload => {
      if (payload.notification.title === 'Order Delivered') {
        LocalNotification(payload);
      }
      console.log('MESSAGE RECEIVED IN FOREGROUND');
    });
    FirebaseFunctions.messaging.setBackgroundMessageHandler(() => {
      console.log('MESSAGE RECEIVED');
    });
    if (!FirebaseFunctions.messaging.isDeviceRegisteredForRemoteMessages) {
      await FirebaseFunctions.messaging
        .registerDeviceForRemoteMessages()
        .catch(err => console.error(err));
    }
    setTimeout(() => {
      this.setState({codePushChecking: false});
    }, 2000);
    NetInfo.addEventListener(isConnected => {
      this.setState({isConnected});
      if (isConnected.isConnected) {
        console.log('connection: ' + isConnected.isConnected);
        this.setState({
          appUI: (
            <SafeAreaView style={{flex: 1, backgroundColor: colors.black}}>
              <StatusBar barStyle="light-content" />
              <AppContainer />
              {/* <ConfirmItemsReceived ref={() => GlobalHandler.confirmOrderComponent = ref}/> */}
              <FlashMessage />
              <CustomPicker
                ref={ref => (GlobalHandler.customPickerRef = ref)}
              />
            </SafeAreaView>
          ),
        });
      } else {
        this.setState({
          appUI: <NoInternetScreen />,
        });
      }
    });
  }
  render() {
    return this.state.isConnected && this.state.codePushChecking ? (
      <View
        style={{
          backgroundColor: colors.white,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image style={{width: 270, height: 200}} source={FetcherLogo} />
      </View>
    ) : (
      this.state.appUI
    );
  }
}
let codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESUME,
};
App = codePush(codePushOptions)(App);
export default App;
