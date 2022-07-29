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
import colors from '../../config/Styles/colors';
import {Icon} from 'react-native-elements';
import FirebaseFunctions from '../../config/Firebase/FirebaseFunctions';
import {showMessage} from 'react-native-flash-message';

export default class PasswordScreen extends Component {
  state = {
    password: SignUpHandler.state.password,
    notFilled: SignUpHandler.state.password == '',
    isPasswordVisible: false,
  };
  //Sends the password to the Sign Up class to store and navigates to hte Phone Number Screen
  async CheckIfFull() {
    const {password} = this.state;
    SignUpHandler.passHandler(password);
    if (this.props.navigation.state.params.isAUser) {
      await FirebaseFunctions.auth
        .signInWithEmailAndPassword(SignUpHandler.state.email, password)
        .then(() => {
          this.props.navigation.push('PaymentCreds', {
            isAddition: false,
          });
        })
        .catch(err => {
          showMessage({
            message: 'Uh Oh',
            description: 'Incorrect password try again',
            type: 'danger',
            position: 'top',
            duration: 5000,
          });
        });
      SignUpHandler.state.isAUser = true;
    } else {
      this.props.navigation.push('PaymentCreds', {
        isAddition: false,
      });
    }
  }
  //Checks if all the TextInput fields are full in order to enable
  //the next-arrow button
  CheckText() {
    if (
      this.state.password.length >=
      (this.props.navigation.state.params.isAUser ? 1 : 8)
    ) {
      this.setState({notFilled: false});
      return;
    }
    this.setState({notFilled: true});
  }
  render() {
    return (
      <View style={styles.view}>
        <Text style={styles.labelsbig}>
          {this.props.navigation.state.params.isAUser
            ? 'Type in your Fetcher Application(s) password'
            : 'And now a good password'}
        </Text>
        <View
          style={[
            styles.txtinput,
            {
              paddingTop: 0,
              paddingBottom: 0,
              alignItems: 'center',
              paddingRight: 5,
              marginLeft: 10,
              flexDirection: 'row',
            },
          ]}>
          <TextInput
            placeholderTextColor={colors.lightGrey}
            defaultValue={this.state.password}
            style={[
              {flex: 1, ...styles.txtinput},
              {
                borderWidth: 0,
                marginTop: 0,
              },
            ]}
            label="password"
            mode="outlined"
            secureTextEntry={!this.state.isPasswordVisible}
            placeholderTextColor="#4d4e4f"
            placeholder="password"
            onChangeText={text => {
              this.setState({password: text}, () => this.CheckText());
            }}
            value={this.state.password.value}
          />
          <TouchableOpacity
            disabled={this.state.password.length === 0}
            onPress={() =>
              this.setState({
                isPasswordVisible: !this.state.isPasswordVisible,
              })
            }>
            <Icon
              type="entypo"
              color={
                this.state.password.length === 0 ? colors.grey : colors.black
              }
              name={this.state.isPasswordVisible ? 'eye' : 'eye-with-line'}
            />
          </TouchableOpacity>
        </View>
        {this.state.password.length < 8 &&
        !this.props.navigation.state.params.isAUser ? (
          <Text
            style={{
              color: colors.orange,
              marginLeft: 10,
              fontFamily: 'Arial-BoldMT',
              fontSize: moderateScale(14),
            }}>
            *Password must be at least 8 characters
          </Text>
        ) : null}
        <ContinueArrows
          onPressBack={() => SignUpHandler.passHandler(this.state.password)}
          onPressConditional={async () => await this.CheckIfFull()}
          notFilled={this.state.notFilled}
        />
      </View>
    );
  }
}
