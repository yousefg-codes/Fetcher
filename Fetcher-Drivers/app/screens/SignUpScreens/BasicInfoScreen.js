import React, {useState, useEffect} from 'react';
import {View, TextInput, Text, ScrollView} from 'react-native';
import styles from '../../config/Styles/BasicInfoScreenStyle';
import {CustomPickerIcon} from '../../components/GlobalComponents/CustomPicker';
import BackAndForthArrows from '../../components/GlobalComponents/BackAndForthArrows';
import globalStyles from '../../config/Styles/globalStyles';
import {
  scale,
  moderateScale,
  verticalScale,
} from '../../config/Styles/dimensions';
import SignUpHandler from '../../config/SignUpHandler/SignUpHandler';
import SplashScreen from '../../components/GlobalComponents/SplashScreen';
import colors from '../../config/Styles/colors';

export default (BasicInfoScreen = props => {
  const [firstName, setFirstName] = useState(SignUpHandler.firstName);
  const [lastName, setLastName] = useState(SignUpHandler.lastName);
  const [age, setAge] = useState(SignUpHandler.age);
  const [birthDay, setBirthDay] = useState(SignUpHandler.birthDay);
  const [birthMonth, setBirthMonth] = useState(SignUpHandler.birthMonth);
  const [birthYear, setBirthYear] = useState(SignUpHandler.birthYear);
  const [ageList, setAgeList] = useState([
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
  ]);
  const [daysList, setDaysList] = useState([
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
  ]);
  const [monthsList, setMonthsList] = useState([
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
  ]);
  const [yearsList, setYearsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFilled, setNotFilled] = useState(true);
  const [alreadySetYear, setAlreadySetYear] = useState(false);

  useEffect(() => {
    if (!alreadySetYear) {
      let today = new Date();
      let years = [];
      let j = 0;
      for (var i = 60; i >= 0; i--) {
        years[j] = today.getFullYear() - i;
        j++;
      }
      setYearsList(years);
      setIsLoading(false);
      setAlreadySetYear(true);
      checkIfFilled();
    } else {
      checkIfFilled();
    }
  }, [firstName, lastName, age, birthMonth, birthYear, birthDay]);
  const checkIfFilled = () => {
    //console.log(firstName+' '+lastName+' '+age+' '+birthYear+' '+birthDay+' '+birthMonth)
    if (
      firstName !== '' &&
      lastName !== '' &&
      birthDay !== -1 &&
      birthMonth !== -1 &&
      birthYear !== -1 &&
      age !== -1
    ) {
      setNotFilled(false);
      //console.log('OI')
      return;
    }
    //console.log('EH')
    setNotFilled(true);
  };
  if (isLoading) {
    return <SplashScreen />;
  }
  return (
    <View style={[styles.container]}>
      <Text style={[globalStyles.signUpHeader]}>
        Fill in the information below
      </Text>
      <View
        style={[
          globalStyles.signUpHorizontalContainer,
          {marginBottom: verticalScale(15)},
        ]}>
        <View style={globalStyles.signUpVerticalContainer}>
          <View>
            <View>
              <Text style={globalStyles.signUpText}>First Name</Text>
              <TextInput
                autoFocus
                placeholderTextColor={colors.grey}
                placeholder="e.g. Kareem"
                value={firstName}
                defaultValue={firstName}
                style={globalStyles.commonTextInputs}
                onChangeText={text => {
                  setFirstName(text);
                }}
              />
            </View>
            <View style={{paddingTop: verticalScale(8.96)}}>
              <Text style={globalStyles.signUpText}>Age</Text>
              <View style={styles.pickerContainer}>
                <CustomPickerIcon
                  defaultIndex={0}
                  list={ageList}
                  onChangeSelection={item => {
                    setAge(item);
                  }}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={globalStyles.signUpVerticalContainer}>
          <View>
            <View>
              <Text style={globalStyles.signUpText}>Last Name</Text>
              <TextInput
                placeholderTextColor={colors.grey}
                placeholder="e.g. Rostov"
                value={lastName}
                defaultValue={lastName}
                style={globalStyles.commonTextInputs}
                onChangeText={text => {
                  setLastName(text);
                }}
              />
            </View>
            <View style={{paddingTop: verticalScale(8.96)}}>
              <Text style={globalStyles.signUpText}>Birth Date</Text>
              <View style={styles.pickerContainer}>
                <CustomPickerIcon
                  defaultIndex={
                    SignUpHandler.birthDay === -1
                      ? daysList.length - 1
                      : daysList.indexOf(SignUpHandler.birthDay)
                  }
                  list={daysList}
                  onChangeSelection={item => {
                    setBirthDay(item);
                  }}
                />
                <CustomPickerIcon
                  defaultIndex={
                    SignUpHandler.birthMonth === -1
                      ? monthsList.length - 1
                      : monthsList.indexOf(SignUpHandler.birthMonth)
                  }
                  list={monthsList}
                  onChangeSelection={item => {
                    setBirthMonth(item);
                  }}
                />
                <CustomPickerIcon
                  defaultIndex={
                    SignUpHandler.birthYear === -1
                      ? yearsList.length - 1
                      : yearsList.indexOf(SignUpHandler.birthYear)
                  }
                  list={yearsList}
                  onChangeSelection={item => {
                    setBirthYear(item);
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
      <BackAndForthArrows
        onPress={() => {
          SignUpHandler.setBasicInfo(
            firstName,
            lastName,
            birthMonth + '/' + birthDay + '/' + birthYear,
            age,
            birthDay,
            birthMonth,
            birthYear,
          );
        }}
        onPressBack={() => {
          SignUpHandler.clearAll();
        }}
        notFilled={notFilled}
        nextScreen="MainInfoScreen"
        navigation={props.navigation}
      />
    </View>
  );
});
