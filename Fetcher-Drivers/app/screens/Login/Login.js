import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import styles from '../../config/Styles/LoginStyle';
import globalStyles from '../../config/Styles/globalStyles';
import Heading from '../../components/GlobalComponents/Heading';
import FirebaseFunctions from '../../config/Firebase/FirebaseFunctions';
import GlobalStateHandler from '../../config/GlobalHandler/GlobalStateHandler';
import {displayAwaitingOrder} from '../../components/GlobalComponents/AwaitingOrderComponent';
import colors from '../../config/Styles/colors';
import {showMessage} from 'react-native-flash-message';

export default (Login = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const checkInfo = async () => {
    setIsLoading(true);
    await FirebaseFunctions.signInUser(email, password, true)
      .then(isDriver => {
        if (!isDriver) {
          showMessage({
            position: 'top',
            type: 'danger',
            message: 'Hmmm',
            duration: 6000,
            description:
              'It appears you are a Fetcher/Fetcher Businesses User, but you have not signed up to become a driver',
          });
        } else {
          props.navigation.push('mainDrawerNavigator');
        }
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
      });
    setIsLoading(false);
  };

  return (
    <View style={styles.containerStyle}>
      <Heading navigation={props.navigation} onlyArrow={true} />
      <Text style={styles.loginText}>Login</Text>
      <TextInput
        autoCapitalize="none"
        style={styles.textInputs}
        placeholder="example@domain.com"
        placeholderTextColor={colors.grey}
        keyboardType="email-address"
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <TextInput
        autoCapitalize="none"
        style={styles.textInputs}
        placeholder="********"
        placeholderTextColor={colors.grey}
        value={password}
        secureTextEntry
        onChangeText={text => setPassword(text)}
      />
      <TouchableOpacity
        style={styles.signInButton}
        onPress={async () => await checkInfo()}>
        {isLoading ? (
          <ActivityIndicator animating={true} color={colors.white} />
        ) : (
          <Text style={styles.signInText}>Sign In</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('ForgotPassword');
        }}>
        <Text style={styles.forgotPasswordText}>Forgot Password</Text>
      </TouchableOpacity>
    </View>
  );
});
