import React, {useState, useEffect} from 'react';
import {View, TextInput, Text, Alert, TouchableOpacity} from 'react-native';
import styles from '../../config/Styles/PasswordScreenStyle';
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
import {Icon} from 'react-native-elements';
import {showMessage} from 'react-native-flash-message';

export default (PasswordScreen = props => {
  const [password, setPassword] = useState(SignUpHandler.password);
  const [notFilled, setNotFilled] = useState(true);
  let prevPassword = SignUpHandler.password;
  const numbers = '1234567890';
  const capitalLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const specialCharacters = [
    '"',
    '!',
    '#',
    '$',
    '%',
    '&',
    "'",
    '(',
    ')',
    '*',
    '+',
    ',',
    '-',
    '.',
    '/',
    ':',
    ';',
    '<',
    '=',
    '>',
    '?',
    '@',
    '[',
    '\\',
    ']',
    '^',
    '_',
    '`',
    '{',
    '|',
    '}',
    '~',
  ];
  const [containsSpecialCharacter, setContainsSpecialCharacter] = useState(0);
  const [containsUpperCaseLetter, setContainsUpperCaseLetter] = useState(0);
  const [containsNumber, setContainsNumber] = useState(0);
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    if (password.length > 0 || prevPassword.length > 0) {
      let numSpecialCharacters = containsSpecialCharacter;
      let upperCaseLetters = containsUpperCaseLetter;
      let numNumbers = containsNumber;
      let characterRemoved = prevPassword.length > password.length;
      let strToBeChecked = password;
      if (characterRemoved) {
        strToBeChecked = prevPassword;
      }
      let lastChar = strToBeChecked.substr(strToBeChecked.length - 1, 1);
      if (numbers.includes(lastChar)) {
        if (characterRemoved) {
          numNumbers--;
          setContainsNumber(containsNumber - 1);
        } else {
          numNumbers++;
          setContainsNumber(containsNumber + 1);
        }
      }
      if (capitalLetters.includes(lastChar)) {
        if (characterRemoved) {
          upperCaseLetters--;
          setContainsUpperCaseLetter(containsUpperCaseLetter - 1);
        } else {
          upperCaseLetters++;
          setContainsUpperCaseLetter(containsUpperCaseLetter + 1);
        }
      }
      if (specialCharacters.includes(lastChar)) {
        if (characterRemoved) {
          numSpecialCharacters--;
          setContainsSpecialCharacter(containsSpecialCharacter - 1);
        } else {
          numSpecialCharacters++;
          setContainsSpecialCharacter(containsSpecialCharacter + 1);
        }
      }
      checkText(numNumbers, numSpecialCharacters, upperCaseLetters);
    } else {
      checkText(
        containsNumber,
        containsSpecialCharacter,
        containsUpperCaseLetter,
      );
    }
    prevPassword = password;
    SignUpHandler.password = password;
  }, [password]);
  const checkText = (numbers, specialCharacters, capitalLetters) => {
    if (
      password !== '' &&
      numbers > 0 &&
      password.length >= 8 &&
      specialCharacters > 0 &&
      capitalLetters > 0
    ) {
      setNotFilled(false);
      return;
    }
    setNotFilled(true);
  };
  return (
    <View style={styles.container}>
      <Text style={globalStyles.signUpHeader}>And finally a good Password</Text>
      <View style={styles.passwordContainer}>
        <Text style={globalStyles.signUpText}>Password</Text>
        <View style={styles.textInputContainer}>
          <TextInput
            autoCapitalize="none"
            autoFocus
            placeholder="********"
            placeholderTextColor={colors.grey}
            defaultValue={password}
            value={password}
            secureTextEntry={!passwordVisible}
            style={styles.actualTextInput}
            onChangeText={text => {
              setPassword(text);
            }}
          />
          <TouchableOpacity
            disabled={password.length === 0}
            onPress={() => setPasswordVisible(!passwordVisible)}>
            <Icon
              type="entypo"
              color={password.length === 0 ? colors.grey : colors.black}
              style={{
                paddingRight: scale(8.28),
              }}
              name={passwordVisible ? 'eye' : 'eye-with-line'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.atLeastContainer}>
          {password.length >= 8 ? null : (
            <Text style={styles.atLeastText}>
              Must contain at least 8 characters
            </Text>
          )}
          {containsSpecialCharacter > 0 ? null : (
            <Text style={styles.atLeastText}>
              Must contain at least one Special Character
            </Text>
          )}
          {containsNumber > 0 ? null : (
            <Text style={styles.atLeastText}>
              Must contain at least one Number
            </Text>
          )}
          {containsUpperCaseLetter > 0 ? null : (
            <Text style={styles.atLeastText}>
              Must contain at least one Capital Letter
            </Text>
          )}
        </View>
      </View>
      <BackAndForthArrows
        onPressConditional={async () => {
          await SignUpHandler.signUpUser()
            .then(() => {
              props.navigation.push('mainDrawerNavigator');
            })
            .catch(err => {
              showMessage({
                message: 'Uh Oh',
                description:
                  'It appears there was an error signing you up, go back and review your information.',
                duration: 7000,
                type: 'danger',
                position: 'top',
              });
            });
        }}
        notFilled={notFilled}
        navigation={props.navigation}
      />
    </View>
  );
});
