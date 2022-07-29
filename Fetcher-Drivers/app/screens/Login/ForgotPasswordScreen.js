import {scale, moderateScale, verticalScale} from '../../config/Styles/dimensions'; 
import React, {Component, useState, useEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import styles from '../../config/Styles/LoginStyle';
import FirebaseFunctions from '../../config/Firebase/FirebaseFunctions';
import Heading from '../../components/GlobalComponents/Heading';
import colors from '../../config/Styles/colors';
import {showMessage} from 'react-native-flash-message';

const ForgotPasswordScreen = (props) => {
  const [email, setEmail] = useState('')
  const [notfilled, setNotfilled] = useState(true);

  // useEffect(() => {
  //   const {username} = props.navigation.params;
  //   setEmail(username);
  // }, [])

  useEffect(() => {
    CheckText();
  }, [email]);

  const CheckText = () => {
    if (email != '') {
      setNotfilled(false);
    } else {
      setNotfilled(true);
    }
  }
  
  const BtnColor = (bool) => {
    if (!bool) {
      return colors.black;
    }
    return '#d3d3d3';
  }
  
  const sendEmail = async () => {
    await FirebaseFunctions.sendForgotPass(email);
    props.navigation.navigate('Login');
  }
  return (
    <View style={styles.containerStyle}>
      <View
        style={{flex: 1, alignItems: 'center', backgroundColor: colors.white}}>
        <Heading navigation={props.navigation} onlyArrow={true} />
        <Text style={[styles.loginText, {fontSize: moderateScale(22)}]}>
          Please type in your email in order to reset your password
        </Text>
        <TextInput placeholderTextColor={colors.lightGrey}
          style={styles.textInputs}
          label="Email"
          mode="outlined"
          placeholder="Email"
          onChangeText={username => {
            setEmail(username);
          }}
          value={email.value}
        />
        <TouchableOpacity
          style={[styles.signInButton, {backgroundColor: BtnColor(), borderColor: BtnColor()}]}
          disabled={notfilled}
          onPress={async () => {
            await sendEmail().then(() => {
              showMessage({
                message: 'Email Sent',
                description:
                  "We have sent you an email to reset your password, check your junk or spam folders if you can't find it",
                duration: 5000,
                position: 'top',
                type: 'success',
              });
            }).catch(err => {
              showMessage({
                message: 'Wrong Email', 
                description: 'There was an error sending the email, did you type in the correct email?', 
                type: 'danger',
                duration: 6000
              })
            })
            props.navigation.goBack(null);
          }}>
          <Text style={styles.signInText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
export default ForgotPasswordScreen;

