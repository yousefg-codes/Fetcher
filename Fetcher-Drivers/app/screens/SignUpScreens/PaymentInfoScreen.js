import React, {useState, useEffect} from 'react';
import {View, TextInput, ScrollView, Text} from 'react-native';
import styles from '../../config/Styles/PaymentInfoScreenStyle';
import {CustomPickerIcon} from '../../components/GlobalComponents/CustomPicker';
import BackAndForthArrows from '../../components/GlobalComponents/BackAndForthArrows';
import globalStyles from '../../config/Styles/globalStyles';
import SignUpHandler from '../../config/SignUpHandler/SignUpHandler';
import colors from '../../config/Styles/colors';

export default (PaymentInfoScreen = props => {
  const [routingNumber, setRoutingNumber] = useState(
    SignUpHandler.routingNumber,
  );
  const [accountNumber, setAccountNumber] = useState(
    SignUpHandler.accountNumber,
  );
  const [notFilled, setNotFilled] = useState(true);

  useEffect(() => {
    checkText();
    SignUpHandler.paymentInfo(routingNumber, accountNumber);
  }, [routingNumber, accountNumber]);

  const checkText = () => {
    if (routingNumber !== '' && accountNumber !== '') {
      setNotFilled(false);
      return;
    }
    setNotFilled(true);
  };
  return (
    <View style={styles.container}>
      <Text style={globalStyles.signUpHeader}>
        We need your routing/account numbers for payouts
      </Text>
      <View style={styles.verticalContainer}>
        <View>
          <Text style={globalStyles.signUpText}>Routing Number</Text>
          <TextInput
            autoCapitalize="none"
            autoFocus
            placeholder="111000000"
            value={routingNumber}
            keyboardType="number-pad"
            placeholderTextColor={colors.grey}
            defaultValue={routingNumber}
            style={styles.textInputs}
            onChangeText={text => {
              setRoutingNumber(text);
            }}
          />
        </View>
        <View>
          <Text style={globalStyles.signUpText}>Account Number</Text>
          <TextInput
            autoCapitalize="none"
            placeholderTextColor={colors.grey}
            placeholder="account number"
            keyboardType="number-pad"
            value={accountNumber}
            defaultValue={accountNumber}
            style={styles.textInputs}
            onChangeText={text => {
              setAccountNumber(text);
            }}
          />
        </View>
      </View>
      <BackAndForthArrows
        notFilled={notFilled}
        nextScreen="EmailScreen"
        navigation={props.navigation}
      />
    </View>
  );
});
