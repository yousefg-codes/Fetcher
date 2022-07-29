import React, {useEffect, useState, useRef} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import NetInfo from '@react-native-community/netinfo';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  View,
  TouchableOpacity,
  Text,
  YellowBox,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import codePush from 'react-native-code-push';
import Login from './app/screens/Login/Login';
import WelcomeScreen from './app/screens/WelcomeScreen/WelcomeScreen';
import FirebaseFunctions from './app/config/Firebase/FirebaseFunctions';
import HomeScreen from './app/screens/TabNavigatorScreens/HomeScreen';
import OrderInfoScreen from './app/screens/InfoScreens/OrderInfoScreen';
import colors from './app/config/Styles/colors';
import {
  scale,
  moderateScale,
  verticalScale,
} from './app/config/Styles/dimensions';
import {Icon} from 'react-native-elements';
import {createDrawerNavigator, useIsDrawerOpen} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import AccountScreen from './app/screens/TabNavigatorScreens/AccountScreens/AccountScreen';
import {
  NewOrderComponent,
  displayNewOrder,
} from './app/components/GlobalComponents/NewOrderComponent';
import GlobalStateHandler from './app/config/GlobalHandler/GlobalStateHandler';
import {
  displayAwaitingOrder,
  AwaitingOrderComponent,
} from './app/components/GlobalComponents/AwaitingOrderComponent';
import componentWillMountHook from './app/config/CustomHooks/ComponentWillMountHook';
import {ViewOrderInfoComponent} from './app/components/GlobalComponents/ViewOrderInfoComponent';
import {CustomPicker} from './app/components/GlobalComponents/CustomPicker';
import BasicInfoScreen from './app/screens/SignUpScreens/BasicInfoScreen';
import MainInfoScreen from './app/screens/SignUpScreens/MainInfoScreen';
import PaymentInfoScreen from './app/screens/SignUpScreens/PaymentInfoScreen';
import AddressScreen from './app/screens/SignUpScreens/AddressScreen';
import EmailScreen from './app/screens/SignUpScreens/EmailScreen';
import PasswordScreen from './app/screens/SignUpScreens/PasswordScreen';
import CustomDrawer from './app/components/GlobalComponents/CustomDrawer';
import {UntilVerifiedPopUp} from './app/components/GlobalComponents/UntilVerifiedPopUp';
import {
  PastOrders,
  OrderDetails,
} from './app/screens/TabNavigatorScreens/PastOrders';
import {EarningsScreen} from './app/screens/InfoScreens/EarningsScreen';
import EarningOrdersScreen from './app/screens/InfoScreens/EarningOrdersScreen';
import ChangeAddressScreen from './app/screens/TabNavigatorScreens/AccountScreens/ChangeAddressScreen';
import PasswordOnlyScreen from './app/screens/TabNavigatorScreens/AccountScreens/PasswordOnlyScreen';
import ChangeBankNumbersScreen from './app/screens/TabNavigatorScreens/AccountScreens/ChangeBankNumbersScreen';
import ReportScreen from './app/screens/TabNavigatorScreens/AccountScreens/ReportScreen';
import fontStyles from './app/config/Styles/fontStyles';
import Images from './app/config/Images/Images';
import PrivacyPolicyScreen from './app/screens/TabNavigatorScreens/PrivacyPolicyScreen';
import TermsOfServiceScreen from './app/screens/TabNavigatorScreens/TermsOfServiceScreen';
import ForgotPasswordScreen from './app/screens/Login/ForgotPasswordScreen';
import {Dimensions} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
const MainDrawerNavigator = createDrawerNavigator();

navigator.geolocation = Geolocation;

const MainStackNavigator = createStackNavigator();

const drawerNavigatorComponent = () => {
  return (
    <MainDrawerNavigator.Navigator
      drawerStyle={{width: scale(270)}}
      screenOptions={{swipeEnabled: false}}
      drawerContent={props => <CustomDrawer {...props} />}>
      <MainDrawerNavigator.Screen name="HomeScreen" component={HomeScreen} />
      <MainDrawerNavigator.Screen
        name="AccountScreen"
        component={AccountScreen}
      />
      <MainDrawerNavigator.Screen name="PastOrders" component={PastOrders} />
      <MainDrawerNavigator.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
      />
      <MainDrawerNavigator.Screen
        name="TermsOfService"
        component={TermsOfServiceScreen}
      />
    </MainDrawerNavigator.Navigator>
  );
};

const startupScreen = () => {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
      }}>
      <Image
        source={Images.fetcherLogo}
        style={{
          resizeMode: 'contain',
          width: scale(205.6),
          height: verticalScale(147.2),
        }}
      />
    </View>
  );
};

const App = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [firstScreen, setFirstScreen] = useState(
    <MainStackNavigator.Screen
      name="FirstScreen"
      component={
        startupScreen
        // FirebaseFunctions.currentUser === null
        //   ? WelcomeScreen
        //   : drawerNavigatorComponent
      }
    />,
  );
  const [isConnected, setIsConnected] = useState(true);
  useEffect(() => {
    NetInfo.addEventListener(isConnected => {
      setIsConnected(isConnected.isConnected);
      if (isConnected.isConnected) {
        setTimeout(() => {
          FirebaseFunctions.currentUser === null
            ? GlobalStateHandler.navigation.navigate('WelcomeScreen')
            : GlobalStateHandler.navigation.navigate('mainDrawerNavigator');
        }, 3000);
      }
    });
  }, []);
  useEffect(() => {
    //console.warn(isConnected)
  }, [isConnected]);
  if (!isConnected) {
    return (
      <View style={{flex: 1, backgroundColor: colors.white}}>
        <SafeAreaView style={{flex: 1, backgroundColor: colors.black}}>
          <View
            style={{
              flex: 1,
              backgroundColor: colors.white,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: colors.black,
                textAlign: 'center',
                ...fontStyles.normalFont,
                fontSize: moderateScale(20),
              }}>
              Uh Oh, it appears you have lost your internet connection.
            </Text>
            <Image
              source={Images.frownEmoji}
              resizeMode="contain"
              style={{width: scale(165.6), height: scale(207)}}
            />
            <Text
              style={{
                color: colors.black,
                textAlign: 'center',
                ...fontStyles.normalFont,
                fontSize: moderateScale(20),
              }}>
              Once a connection has been established the app will automatically
              reload.
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }
  return (
    <View style={{backgroundColor: colors.white, flex: 1}}>
      <SafeAreaView style={{flex: 1, backgroundColor: colors.black}}>
        <StatusBar barStyle="light-content" />
        <View style={{flex: 1}}>
          <NavigationContainer
            ref={ref => {
              GlobalStateHandler.navigation = ref;
            }}>
            <MainStackNavigator.Navigator headerMode="none">
              {firstScreen}
              <MainStackNavigator.Screen
                options={{gestureEnabled: false}}
                name="mainDrawerNavigator"
                component={drawerNavigatorComponent}
              />
              <MainStackNavigator.Screen
                options={{gestureEnabled: false}}
                name="WelcomeScreen"
                component={WelcomeScreen}
              />
              <MainStackNavigator.Screen
                options={{gestureEnabled: false}}
                name="Login"
                component={Login}
              />
              <MainStackNavigator.Screen
                options={{gestureEnabled: false}}
                name="OrderInfoScreen"
                component={OrderInfoScreen}
              />
              <MainStackNavigator.Screen
                options={{gestureEnabled: false}}
                name="BasicInfoScreen"
                component={BasicInfoScreen}
              />
              <MainStackNavigator.Screen
                options={{gestureEnabled: false}}
                name="MainInfoScreen"
                component={MainInfoScreen}
              />
              <MainStackNavigator.Screen
                options={{gestureEnabled: false}}
                name="PaymentInfoScreen"
                component={PaymentInfoScreen}
              />
              <MainStackNavigator.Screen
                options={{gestureEnabled: false}}
                name="AddressScreen"
                component={AddressScreen}
              />
              <MainStackNavigator.Screen
                options={{gestureEnabled: false}}
                name="EmailScreen"
                component={EmailScreen}
              />
              <MainStackNavigator.Screen
                options={{gestureEnabled: false}}
                name="PasswordScreen"
                component={PasswordScreen}
              />
              <MainStackNavigator.Screen
                options={{gestureEnabled: false}}
                name="EarningsScreen"
                component={EarningsScreen}
              />
              <MainStackNavigator.Screen
                options={{gestureEnabled: false}}
                name="EarningOrdersScreen"
                component={EarningOrdersScreen}
              />
              <MainStackNavigator.Screen
                options={{gestureEnabled: false}}
                name="ChangeAddressScreen"
                component={ChangeAddressScreen}
              />
              <MainStackNavigator.Screen
                options={{gestureEnabled: false}}
                name="PasswordOnlyScreen"
                component={PasswordOnlyScreen}
              />
              <MainStackNavigator.Screen
                options={{gestureEnabled: false}}
                name="ChangeBankNumbersScreen"
                component={ChangeBankNumbersScreen}
              />
              <MainStackNavigator.Screen
                options={{gestureEnabled: false}}
                name="ReportScreen"
                component={ReportScreen}
              />
              <MainStackNavigator.Screen
                options={{gestureEnabled: false}}
                name="OrderDetails"
                component={OrderDetails}
              />
              <MainStackNavigator.Screen
                options={{gestureEnabled: false}}
                name="ForgotPassword"
                component={ForgotPasswordScreen}
              />
            </MainStackNavigator.Navigator>
          </NavigationContainer>
          <ViewOrderInfoComponent
            ref={ref => (GlobalStateHandler.viewOrderInfoRef = ref)}
          />
          <AwaitingOrderComponent
            ref={ref => (GlobalStateHandler.newAwaitingOrderComponentRef = ref)}
          />
          <NewOrderComponent
            ref={ref => (GlobalStateHandler.newOrderComponentRef = ref)}
          />
          <UntilVerifiedPopUp
            ref={ref => (GlobalStateHandler.untilVerifiedRef = ref)}
          />
          <CustomPicker
            ref={ref => (GlobalStateHandler.customPickerRef = ref)}
          />
        </View>
      </SafeAreaView>
      <FlashMessage />
    </View>
  );
};
let codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESUME,
};
export default codePush(codePushOptions)(App);
