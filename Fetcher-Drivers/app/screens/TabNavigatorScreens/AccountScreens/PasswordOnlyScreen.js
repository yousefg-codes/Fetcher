import React, {useState, useEffect} from 'react';
import {View, TextInput, TouchableOpacity, Text} from 'react-native';
import styles from '../../../config/Styles/LoginStyle';
import globalStyles from '../../../config/Styles/globalStyles';
import Heading from '../../../components/GlobalComponents/Heading';
import FirebaseFunctions from '../../../config/Firebase/FirebaseFunctions';
import GlobalStateHandler from '../../../config/GlobalHandler/GlobalStateHandler';
import colors from '../../../config/Styles/colors';
import {showMessage} from 'react-native-flash-message';
import BackAndForthArrows from '../../../components/GlobalComponents/BackAndForthArrows';
import {hideAwaitingOrder} from '../../../components/GlobalComponents/AwaitingOrderComponent';
import SignUpHandler from '../../../config/SignUpHandler/SignUpHandler';
import {moderateScale} from '../../../config/Styles/dimensions';

export default (PasswordOnlyScreen = props => {
  const [password, setPassword] = useState('');
  const [notFilled, setNotFilled] = useState(true);

  const checkInfo = async setIsLoading => {
    if (!props.route.params.isSignUp) {
      await FirebaseFunctions.signInUser(
        FirebaseFunctions.currentUser.email,
        password,
        false,
      )
        .then(() => {
          hideAwaitingOrder();
          props.route.params.onVerified();
          setIsLoading();
        })
        .catch(err => {
          let error = err.code
            .substring(err.code.indexOf('/') + 1, err.code.length)
            .split('-');
          let str = '';
          for (var i = 0; i < error.length; i++) {
            str += error[i] + ' ';
          }
          showMessage({
            position: 'top',
            type: 'danger',
            message: 'Uh Oh',
            duration: 6000,
            description: str + ', try again.',
          });
          setIsLoading();
        });
    } else {
      //console.log(props.route.params.email);
      await FirebaseFunctions.signInUser(
        props.route.params.email,
        password,
        false,
      ).catch(() => {
        showMessage({
          message: 'Uh Oh',
          description:
            'There was an error signing you in, double check your password',
          duration: 7000,
          type: 'danger',
          position: 'top',
        });
      });
      await SignUpHandler.addDriverDoc(FirebaseFunctions.currentUser.uid)
        .then(() => {
          props.navigation.navigate('mainDrawerNavigator');
        })
        .catch(() => {
          showMessage({
            message: 'Uh Oh',
            description:
              'It appears there was an error signing you up, go back and review your information.',
            duration: 7000,
            type: 'danger',
            position: 'top',
          });
        });
    }
  };
  const checkText = () => {
    if (password === '') {
      setNotFilled(true);
      return;
    }
    setNotFilled(false);
  };
  useEffect(() => {
    checkText();
  }, [password]);
  return (
    <View style={styles.containerStyle}>
      <Heading navigation={props.navigation} onlyArrow={true} />
      <Text
        style={[
          styles.loginText,
          {fontSize: moderateScale(18), textAlign: 'center'},
        ]}>
        {props.route.params.isSignUp
          ? 'Enter Your Password to complete Sign Up'
          : 'Enter your Password'}
      </Text>
      <TextInput
        autoCapitalize="none"
        style={styles.textInputs}
        placeholder="********"
        placeholderTextColor={colors.grey}
        value={password}
        secureTextEntry
        onChangeText={text => setPassword(text)}
      />
      <BackAndForthArrows
        onPressConditional={setIsLoading => checkInfo(setIsLoading)}
        notFilled={notFilled}
        navigation={props.navigation}
      />
    </View>
  );
});
