import React, {useEffect, useState} from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  useIsDrawerOpen,
} from '@react-navigation/drawer';
import styles from '../../config/Styles/CustomDrawerStyle';
import {View, TouchableOpacity, Image, Text} from 'react-native';
import {Icon} from 'react-native-elements';
import colors from '../../config/Styles/colors';
import Images from '../../config/Images/Images';
import PhotoUpload from 'react-native-photo-upload';
import {displayAwaitingOrder} from './AwaitingOrderComponent';
import GlobalStateHandler from '../../config/GlobalHandler/GlobalStateHandler';
import FirebaseFunctions from '../../config/Firebase/FirebaseFunctions';
import {
  scale,
  moderateScale,
  verticalScale,
} from '../../config/Styles/dimensions';

export default (CustomDrawer = props => {
  const [stars, setStars] = useState([]);
  const [isInDrivingSession, setIsInDrivingSession] = useState(false);
  const [currentUserName, setCurrentUserName] = useState('');
  const [currentUserPhoto, setCurrentUserPhoto] = useState(Images.emptyAvatar);
  const [usedEffect, setUsedEffect] = useState(false);
  const [currScreen, setCurrScreen] = useState('HomeScreen');
  const wasDrawerOpen = useIsDrawerOpen();

  const setPhoto = async () => {
    setCurrentUserPhoto(await FirebaseFunctions.getCurrentUserPhoto());
  };
  useEffect(() => {
    if (!usedEffect) {
      //GlobalStateHandler.eventEmitter
      let listener = GlobalStateHandler.eventEmitter.addListener(
        'photoChanged',
        async () => {
          setCurrentUserPhoto(await FirebaseFunctions.getCurrentUserPhoto());
        },
      );
      GlobalStateHandler.eventEmitter.addListener('signIn', async () => {
        setCurrentUserPhoto(await FirebaseFunctions.getCurrentUserPhoto());
        setCurrentUserName(GlobalStateHandler.currentUserData.name);
      });
      // GlobalStateHandler.eventEmitter.addListener('signOut', async () => {
      //     setCurrentUserPhoto(Images.emptyAvatar);
      //     setCurrentUserName('');
      // })
      GlobalStateHandler.eventEmitter.addListener('inDriving', async () => {
        setIsInDrivingSession(true);
      });
      //console.error('LISTENERS ADDED AGAIN');
      GlobalStateHandler.eventEmitter.addListener('notInDriving', async () => {
        setIsInDrivingSession(false);
      });
      setUsedEffect(true);
    }
    return () => {
      if (
        wasDrawerOpen &&
        GlobalStateHandler.currentUserData.currentOrders.length === 0 &&
        GlobalStateHandler.currentUserData.isInDrivingSession
      ) {
        displayAwaitingOrder();
      }
    };
  }, [wasDrawerOpen]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('AccountScreen');
          setCurrScreen('AccountScreen');
        }}
        style={[
          styles.accountScreen,
          currScreen === 'AccountScreen' ? {backgroundColor: colors.grey} : {},
        ]}>
        <View style={styles.imageNameContainer}>
          {isInDrivingSession ? (
            <Image source={currentUserPhoto} style={styles.image} />
          ) : (
            <PhotoUpload
              containerStyle={{flex: 0}}
              onPhotoSelect={async photo => {
                await FirebaseFunctions.changeUserPhoto(photo);
                GlobalStateHandler.eventEmitter.emit('photoChanged');
              }}>
              <Image source={currentUserPhoto} style={styles.image} />
            </PhotoUpload>
          )}
          <Text style={styles.nameStyle}>{currentUserName}</Text>
        </View>
        <View>
          <View>{stars}</View>
          <Text />
        </View>
      </TouchableOpacity>
      <DrawerContentScrollView {...props}>
        <DrawerItem
          label="Home"
          activeTintColor={colors.white}
          inactiveTintColor={colors.black}
          inactiveBackgroundColor={colors.white}
          activeBackgroundColor={colors.black}
          focused={currScreen === 'HomeScreen'}
          icon={({color, size}) => (
            <Icon name="home" type="feather" size={size} color={color} />
          )}
          onPress={() => {
            props.navigation.navigate('HomeScreen');
            setCurrScreen('HomeScreen');
          }}
        />
        <DrawerItem
          label="Past Orders"
          activeTintColor={colors.white}
          inactiveTintColor={colors.black}
          inactiveBackgroundColor={colors.white}
          activeBackgroundColor={colors.black}
          focused={currScreen === 'PastOrders'}
          icon={({color, size}) => (
            <Icon
              name="md-list"
              type="ionicon"
              size={size * 1.2}
              color={color}
            />
          )}
          onPress={() => {
            props.navigation.navigate('PastOrders');
            setCurrScreen('PastOrders');
          }}
        />
        <View style={{height: verticalScale(448)}} />
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('PrivacyPolicy');
            setCurrScreen('PrivacyPolicy');
          }}>
          <Text
            style={[
              styles.policyScreensText,
              currScreen === 'PrivacyPolicy' ? {color: colors.grey} : {},
            ]}>
            Privacy Policy
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('TermsOfService');
            setCurrScreen('TermsOfService');
          }}>
          <Text
            style={[
              styles.policyScreensText,
              {marginTop: verticalScale(8.96)},
              currScreen === 'TermsOfService' ? {color: colors.grey} : {},
            ]}>
            Terms of Service
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity>
                    <Text></Text>
                </TouchableOpacity>       */}
      </DrawerContentScrollView>
    </View>
  );
});
