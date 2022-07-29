import {scale, verticalScale, moderateScale} from 'config/Styles/dimensions';
import React, {Component} from 'react';
import {
  View,
  TextInput,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  Alert,
  Picker,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import {styles} from '../../config/Styles/globalStyles';
import ContinueArrows from '../../components/Global Components/ContinueArrows';
import SignUpHandler from '../../config/SignUpHandler/SignUpHandler';
import FirebaseFunctions from '../../config/Firebase/FirebaseFunctions';

// Email (aka Username) Screeen
export default class EmailScreen extends Component {
  state = {
    email: SignUpHandler.state.email,
    notFilled: SignUpHandler.state.email == '',
  };
  //Sends the User's email to the Sign Up class and navigates to the PasswordScreen
  async CheckIfFull() {
    const {email} = this.state;
    SignUpHandler.emailHandler(email);
    let isAUser = await FirebaseFunctions.call('checkIfUserExists', {email});
    if (isAUser.exists) {
      Alert.alert(
        'You are already a user',
        'It appears you are already a user on other Fetcher Applications, so you will be using the same password to sign in.',
        [
          {
            text: 'Ok',
            onPress: () => {
              this.props.navigation.push('PasswordScreen', {
                isAUser: true,
              });
            },
          },
        ],
      );
    } else {
      this.props.navigation.push('PasswordScreen', {isAUser: false});
    }
  }
  //Checks if all the TextInput fields are full in order to enable
  //the next-arrow button
  CheckText() {
    if (this.state.email !== '') {
      this.setState({notFilled: false});
    } else {
      this.setState({notFilled: true});
    }
  }
  render() {
    return (
      <View style={styles.view}>
        <Text style={styles.labelsbig}>
          Now enter your email (you'll use it to sign in)
        </Text>
        <TextInput
          placeholderTextColor={colors.lightGrey}
          defaultValue={this.state.email}
          style={[
            styles.txtinput,
            {
              marginLeft: 10,
            },
          ]}
          textContentType="emailAddress"
          label="email"
          mode="outlined"
          placeholderTextColor="#4d4e4f"
          secureTextEntry={false}
          placeholder="email"
          onChangeText={text => {
            this.setState({email: text}, () => this.CheckText());
          }}
          value={this.state.email.value}
        />
        <ContinueArrows
          onPressBack={() => SignUpHandler.emailHandler(this.state.email)}
          onPressConditional={async () => await this.CheckIfFull()}
          notFilled={this.state.notFilled}
        />
      </View>
    );
  }
}
