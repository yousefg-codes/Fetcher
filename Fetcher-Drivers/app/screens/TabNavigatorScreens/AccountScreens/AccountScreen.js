import React, {useEffect, useState} from 'react';
import {View, Text, Switch, TouchableOpacity, Image} from 'react-native';
import styles from '../../../config/Styles/AccountScreenStyle';
import AccountTouchable from '../../../components/AccountComponents/AccountTouchable';
import FirebaseFunctions from '../../../config/Firebase/FirebaseFunctions';
import GlobalStateHandler from '../../../config/GlobalHandler/GlobalStateHandler';
import colors from '../../../config/Styles/colors';
import {
  displayAwaitingOrder,
  hideAwaitingOrder,
} from '../../../components/GlobalComponents/AwaitingOrderComponent';
import {showMessage} from 'react-native-flash-message';
import DrawerOpener from '../../../components/GlobalComponents/DrawerOpener';
import PhotoUpload from 'react-native-photo-upload';
import Images from '../../../config/Images/Images';
import {
  scale,
  moderateScale,
  verticalScale,
} from '../../../config/Styles/dimensions';
forceUpdate = () => {
  const [value, setValue] = useState(0);
  return () => setValue(value => ++value);
};
export default (Account = props => {
  const forceUpdateFunction = forceUpdate();
  const logOut = () => {
    hideAwaitingOrder();
    GlobalStateHandler.eventEmitter.emit('signOut');
    FirebaseFunctions.logOut();
    props.navigation.navigate('WelcomeScreen');
  };
  const toggleDrivingState = () => {
    FirebaseFunctions.toggleDrivingSession(!isInDrivingSession);
    if (!isInDrivingSession) {
      displayAwaitingOrder();
    } else {
      hideAwaitingOrder();
    }
    GlobalStateHandler.currentUserData.isInDrivingSession = !isInDrivingSession;
    setIsInDrivingSession(!isInDrivingSession);
  };
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserName, setCurrentUserName] = useState('');
  const [currentUserPhoto, setCurrentUserPhoto] = useState(Images.emptyAvatar);
  const [hasOrders, setHasOrders] = useState(
    GlobalStateHandler.currentUserData.currentOrders.length > 0,
  );
  const [isInDrivingSession, setIsInDrivingSession] = useState(
    GlobalStateHandler.currentUserData.isInDrivingSession,
  );

  const asyncUseEffect = async () => {
    //console.error('LISTENERS ADDED AGAIN');
    if (!GlobalStateHandler.currentUserData.verified) {
      GlobalStateHandler.eventEmitter.addListener('verified', () => {
        forceUpdateFunction();
      });
    }
    GlobalStateHandler.eventEmitter.addListener('photoChanged', async () => {
      setCurrentUserPhoto(await FirebaseFunctions.getCurrentUserPhoto());
    });
    GlobalStateHandler.eventEmitter.addListener('inDriving', async () => {
      setIsInDrivingSession(true);
    });
    GlobalStateHandler.eventEmitter.addListener('notInDriving', async () => {
      setIsInDrivingSession(false);
    });
    GlobalStateHandler.eventEmitter.addListener('moreOrders', async () => {
      setHasOrders(true);
    });
    GlobalStateHandler.eventEmitter.addListener('doneCarryingOut', async () => {
      setHasOrders(false);
    });
    setCurrentUserPhoto(await FirebaseFunctions.getCurrentUserPhoto());
    setCurrentUserName(GlobalStateHandler.currentUserData.name);
    setIsLoading(false);
  };

  useEffect(() => {
    asyncUseEffect();
  }, []);
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.imageNameContainer}>
          <View
            style={[
              styles.image,
              {borderColor: colors.darkGrey, backgroundColor: colors.darkGrey},
            ]}
          />
          <Text style={[styles.nameStyle, {color: colors.white}]}>
            Chubby Berta
          </Text>
        </View>
        <TouchableOpacity
          disabled={true}
          style={[
            styles.drivingSessionBtn,
            {backgroundColor: colors.darkGrey, borderColor: colors.darkGrey},
          ]}>
          <Text
            style={[styles.drivingSessionBtnText, {color: colors.darkGrey}]}>
            {isInDrivingSession
              ? 'End Driving Session'
              : 'Begin Driving Session'}
          </Text>
        </TouchableOpacity>
        <AccountTouchable isLoading />
        <AccountTouchable isLoading />
        <View style={{height: verticalScale(44.8)}} />
        <AccountTouchable isLoading />
        <AccountTouchable isLoading />
        <DrawerOpener isLoading />
      </View>
    );
  }
  return (
    <View style={styles.container}>
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
      <TouchableOpacity
        disabled={hasOrders || !GlobalStateHandler.currentUserData.verified}
        onPress={() => {
          if (!GlobalStateHandler.currentUserData.isInDrivingSession) {
            showMessage({
              message: 'Notice',
              description:
                "Don't forget to end the driving session when you're done, closing the app does not end it",
              type: 'warning',
              duration: 3000,
              position: 'top',
            });
            setTimeout(() => {
              toggleDrivingState();
            }, 3700);
            return;
          }
          toggleDrivingState();
        }}
        style={[
          styles.drivingSessionBtn,
          isInDrivingSession
            ? hasOrders
              ? {
                  borderColor: colors.grey,
                  backgroundColor: colors.grey,
                }
              : {
                  borderColor: colors.red,
                  backgroundColor: colors.red,
                }
            : !GlobalStateHandler.currentUserData.verified
            ? {
                borderColor: colors.grey,
                backgroundColor: colors.grey,
              }
            : {
                borderColor: colors.green,
                backgroundColor: colors.green,
              },
        ]}>
        <Text style={styles.drivingSessionBtnText}>
          {isInDrivingSession ? 'End Driving Session' : 'Begin Driving Session'}
        </Text>
      </TouchableOpacity>
      {!GlobalStateHandler.currentUserData.verified ? (
        <Text style={styles.cantLogoutText}>
          You cannot begin a driving session, until you have been verified.
        </Text>
      ) : null}
      <AccountTouchable
        disabled={isInDrivingSession}
        override={false}
        title="Change Address"
        onPress={() => {
          props.navigation.push('PasswordOnlyScreen', {
            onVerified: () => {
              props.navigation.navigate('ChangeAddressScreen');
            },
          });
        }}
      />
      <AccountTouchable
        disabled={isInDrivingSession}
        title="Earnings"
        onPress={() => {
          props.navigation.navigate('EarningsScreen');
        }}
      />
      {/* <AccountTouchable title="Change Account/Routing Number" onPress={() => {props.navigation.push('PasswordOnlyScreen', {onVerified: () => {
        props.navigation.navigate('ChangeBankNumbersScreen')
      }})}} /> */}
      <View style={{height: verticalScale(44.8)}} />
      <AccountTouchable
        override
        disabled={isInDrivingSession}
        onPress={() => {
          props.navigation.push('ReportScreen');
        }}
        style={{justifyContent: 'center'}}>
        <Text style={styles.logOutText}>Report</Text>
      </AccountTouchable>
      <AccountTouchable
        override
        disabled={isInDrivingSession}
        onPress={() => logOut()}
        style={{justifyContent: 'center'}}>
        <Text style={styles.logOutText}>Logout</Text>
      </AccountTouchable>
      {isInDrivingSession ? (
        <Text style={styles.cantLogoutText}>
          You will be unable to access any of the greyed out buttons or change
          your profile picture, until you end the driving session.
        </Text>
      ) : null}
      <DrawerOpener />
    </View>
  );
});
