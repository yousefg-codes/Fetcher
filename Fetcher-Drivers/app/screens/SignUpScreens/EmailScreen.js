import React, {useState, useEffect} from 'react';
import {View, TextInput, Text, Alert} from 'react-native';
import styles from '../../config/Styles/EmailScreenStyle';
import {CustomPickerIcon} from '../../components/GlobalComponents/CustomPicker';
import BackAndForthArrows from '../../components/GlobalComponents/BackAndForthArrows';
import globalStyles from '../../config/Styles/globalStyles';
import SignUpHandler from '../../config/SignUpHandler/SignUpHandler';
import {
  scale,
  moderateScale,
  verticalScale,
} from '../../config/Styles/dimensions';
import FirebaseFunctions from '../../config/Firebase/FirebaseFunctions';
import colors from '../../config/Styles/colors';
import {showMessage} from 'react-native-flash-message';

export default (EmailScreen = props => {
  const [email, setEmail] = useState(SignUpHandler.email);
  const [notFilled, setNotFilled] = useState(true);
  useEffect(() => {
    checkText();
    SignUpHandler.email = email;
  }, [email]);
  const checkText = () => {
    if (email !== '') {
      setNotFilled(false);
      return;
    }
    setNotFilled(true);
  };
  return (
    <View style={styles.container}>
      <Text style={globalStyles.signUpHeader}>And now your Email</Text>
      <View style={styles.emailContainer}>
        <Text style={globalStyles.signUpText}>Email</Text>
        <TextInput
          autoCapitalize="none"
          autoFocus
          placeholder="example@domain.com"
          placeholderTextColor={colors.grey}
          defaultValue={email}
          value={email}
          style={styles.textInput}
          onChangeText={text => {
            setEmail(text);
          }}
        />
      </View>
      <BackAndForthArrows
        onPressConditional={async setIsLoading => {
          let response = await FirebaseFunctions.call('checkIfUserExists', {
            email: email,
          });
          if (response.exists) {
            Alert.alert(
              'You are already a user',
              'It appears you are already a user on another Fetcher Application, so you will be using the same password to sign in.',
              [
                {
                  text: 'Ok',
                  onPress: async () => {
                    props.navigation.push('PasswordOnlyScreen', {
                      isSignUp: true,
                      email,
                    });
                  },
                },
              ],
            );
          } else {
            setIsLoading();
            props.navigation.navigate('PasswordScreen');
          }
        }}
        notFilled={notFilled}
        nextScreen="MainInfoScreen"
        navigation={props.navigation}
      />
    </View>
  );
});
