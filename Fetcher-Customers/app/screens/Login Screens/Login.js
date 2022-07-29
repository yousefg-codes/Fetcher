import {scale, verticalScale, moderateScale} from 'config/Styles/dimensions';
import React, {Component} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {styles} from '../../config/Styles/globalStyles';
import FirebaseFunctions from '../../config/Firebase/FirebaseFunctions';
import SplashScreen from '../../components/Global Components/SplashScreen';
import Heading from '../../components/Global Components/Heading';
import colors from '../../config/Styles/colors';
import {showMessage} from 'react-native-flash-message';
import {Icon} from 'react-native-elements';
class Login extends Component {
  state = {
    email: '',
    password: '',
    notFilled: true,
    isLoading: false,
    errorLogin: false,
    errorCode: 'incorrect email/password',
  };
  async componentDidMount() {
    //console.log((await FirebaseFunctions.getCurrentUserData('Addresses')).collection('index').doc('0'))
  }
  async checkData() {
    this.setState({isLoading: true, errorLogin: false, notFilled: true});
    const {email, password} = this.state;
    let isUser = await FirebaseFunctions.logIn(email.trim(), password).catch(
      err => {
        //console.error(err);
        this.setState({errorLogin: true, isLoading: false}, () => {
          showMessage({
            message: 'Uh Oh',
            description: this.state.errorCode,
            type: 'danger',
            position: 'top',
            duration: 5000,
          });
        });
      },
    );
    if (!isUser) {
      this.setState({errorLogin: true, isLoading: false}, () => {
        showMessage({
          message: 'Uh Oh',
          description: this.state.errorCode,
          type: 'danger',
          position: 'top',
          duration: 5000,
        });
      });
    }
    if (!this.state.errorLogin && isUser) {
      this.setState({isLoading: false}, () =>
        this.props.navigation.navigate('bottomTab'),
      );
    }
  }
  sendEmail() {
    const {email} = this.state;
    if (email !== '') {
      FirebaseFunctions.forgotPassword(email);
    }
    this.props.navigation.push('ForgotPasswordScreen', {email});
  }
  CheckText() {
    if (this.state.email != '' && this.state.password != '') {
      this.setState({notFilled: false});
      return;
    }
    this.setState({notFilled: true});
  }
  BtnColor(bool) {
    if (!bool) {
      return colors.black;
    }
    return '#d3d3d3';
  }
  render() {
    if (this.state.isLoading) {
      return <SplashScreen />;
    }
    return (
      <View
        style={[
          styles.view,
          {alignItems: 'center', backgroundColor: colors.white},
        ]}>
        <Heading
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            width: scale(414),
          }}
          navigation={this.props.navigation}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'Arial-BoldMT',
              fontSize: moderateScale(25),
              color: colors.white,
            }}>
            Login
          </Text>
          <View style={{width: scale(82.8)}} />
        </Heading>
        <View style={{marginTop: 10, width: 10}} />
        <Text
          style={{
            alignSelf: 'flex-start',
            fontWeight: 'bold',
            fontSize: moderateScale(16),
            marginLeft: scale(77.85),
            marginTop: 10,
          }}>
          Email
        </Text>
        <TextInput
          placeholderTextColor={colors.lightGrey}
          style={[styles.txtinput, {marginTop: 0}]}
          label="email"
          mode="outlined"
          placeholder="example@domain.com"
          onChangeText={email => {
            this.setState({email}, () => this.CheckText());
          }}
          value={this.state.email.value}
          defaultValue={this.state.email}
        />
        <Text
          style={{
            alignSelf: 'flex-start',
            fontWeight: 'bold',
            fontSize: moderateScale(16),
            marginLeft: scale(77.85),
            marginTop: 10,
          }}>
          Password
        </Text>
        <View
          style={[
            styles.txtinput,
            {
              paddingTop: 0,
              paddingBottom: 0,
              alignItems: 'center',
              paddingRight: 5,
              marginTop: 0,
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
            placeholder="********"
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
        <TouchableOpacity onPress={() => {}}>
          <Text
            style={{
              color: '#0000ff',
              fontFamily: 'Arial-BoldMT',
              fontSize: 15,
              marginTop: 20,
            }}
            onPress={() => this.sendEmail()}>
            Forgot Password
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.next2,
            {
              marginLeft: 0,
              fontSize: moderateScale(16),
              width: scale(100),
              borderColor: this.BtnColor(this.state.notFilled),
              backgroundColor: this.BtnColor(this.state.notFilled),
            },
          ]}
          disabled={this.state.notFilled}
          onPress={() => this.checkData()}>
          <Text style={styles.nextxt}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
export default Login;
