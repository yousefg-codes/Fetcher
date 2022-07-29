import React, {useState, useEffect} from 'react';
import {View, ScrollView, TextInput, Text, Keyboard} from 'react-native';
import styles from '../../config/Styles/MainInfoScreenStyle';
import CheckBox from '@react-native-community/checkbox';
import globalStyles from '../../config/Styles/globalStyles';
import BackAndForthArrows from '../../components/GlobalComponents/BackAndForthArrows';
import SignUpHandler from '../../config/SignUpHandler/SignUpHandler';
import colors from '../../config/Styles/colors';
import PopUpInfo from '../../components/GlobalComponents/PopUpInfo';
import Strings from '../../config/Strings/Strings';

export default (MainInfoScreen = props => {
  const [driversLicenseNumber, setDriversLicenseNumber] = useState(
    SignUpHandler.driversLicenseNumber,
  );
  //const [ssn, setSSN] = useState(SignUpHandler.driversLicenseNumber)
  const [checkBoxVal, setCheckBoxVal] = useState(false);
  const [notFilled, setNotFilled] = useState(true);
  //   const [prevSSN, setPrevSSN] = useState(
  //     SignUpHandler.ssn.length === 0
  //       ? ''
  //       : SignUpHandler.ssn.substring(0, SignUpHandler.ssn.length - 1),
  //   );
  const [isShowingPopUp, setIsShowingPopUp] = useState(false);
  const [popUpBody, setPopUpBody] = useState('');
  const [popUpTitle, setPopUpTitle] = useState('');

  useEffect(() => {
    checkIfFilled();
    //ssnFormat();
    SignUpHandler.setMainInfo(/*ssn*/ '', driversLicenseNumber);
  }, [driversLicenseNumber, /*ssn*/ checkBoxVal]);
  const checkIfFilled = () => {
    if (
      //ssn.length === 11 &&
      driversLicenseNumber !== '' &&
      checkBoxVal !== false
    ) {
      setNotFilled(false);
      return;
    }
    setNotFilled(true);
  };

  const showPopUp = (title, content) => {
    Keyboard.dismiss();
    setPopUpTitle(title);
    setPopUpBody(content);
    setIsShowingPopUp(true);
  };

  const ssnFormat = () => {
    if (ssn.length === 3) {
      if (prevSSN.length <= ssn.length) {
        setSSN(ssn + '-');
      }
    } else if (ssn.length === 6) {
      if (prevSSN.length <= ssn.length) {
        setSSN(ssn + '-');
      }
    } else if (ssn.length === 12) {
      setSSN(ssn.substring(0, ssn.length - 1));
    }
    setPrevSSN(ssn);
  };
  return (
    <View
      style={[
        styles.container,
        //isShowingPopUp
        //? {backgroundColor: colors.grey}
        {backgroundColor: colors.white},
      ]}>
      {/* <Text style={styles.noticeText}>
        *The following information WILL be disclosed and will ONLY be used to
        verify your identity
      </Text> */}
      <View style={styles.ssnAndDriverNumContainer}>
        <Text style={globalStyles.signUpText}>Drivers License Number</Text>
        <TextInput
          autoCapitalize="none"
          autoFocus
          placeholderTextColor={colors.grey}
          placeholder="drivers license number"
          style={styles.textInputs}
          value={driversLicenseNumber}
          defaultValue={driversLicenseNumber}
          keyboardType="number-pad"
          onChangeText={text => {
            setDriversLicenseNumber(text);
          }}
        />
        {/* <Text style={globalStyles.signUpText}>SSN</Text>
                <TextInput
                    autoCapitalize='none'
                    placeholderTextColor={colors.grey}
                    placeholder="111-22-3333"
                    style={styles.textInputs}
                    value={ssn}
                    defaultValue={ssn}
                    keyboardType="number-pad"
                    onChangeText={(text) => {
                        setSSN(text)
                    }}
                /> */}
      </View>
      <View style={styles.checkBoxContainer}>
        <CheckBox
          value={checkBoxVal}
          onValueChange={val => {
            setCheckBoxVal(val);
          }}
        />
        <Text style={styles.policiesText}>
          By Clicking this CheckBox I am giving Fetcher permission to run a
          Background Check on me, as well as agreeing to the{' '}
          <Text
            onPress={() => {
              showPopUp('Privacy Policy', Strings.privacyPolicy);
            }}
            style={styles.policiesImportantText}>
            Privacy Policy
          </Text>
          ,{' '}
          <Text
            onPress={() => {
              showPopUp('Terms of Service', Strings.termsOfService);
            }}
            style={styles.policiesImportantText}>
            Terms & Conditions
          </Text>{' '}
          and{' '}
          <Text
            onPress={() => {
              showPopUp(
                'Background Check Policy',
                Strings.backgroundCheckPolicy,
              );
            }}
            style={styles.policiesImportantText}>
            Background Check Policy
          </Text>
        </Text>
      </View>
      <BackAndForthArrows
        notFilled={notFilled}
        nextScreen="AddressScreen"
        navigation={props.navigation}
      />
      {isShowingPopUp ? (
        <PopUpInfo
          onBackdropPress={() => {
            setIsShowingPopUp(false);
          }}
          title={popUpTitle}
          content={popUpBody}
        />
      ) : null}
    </View>
  );
});
