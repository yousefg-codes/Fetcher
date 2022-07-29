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
import Heading from '../../components/Global Components/Heading';
import colors from '../../config/Styles/colors';
import {showMessage} from 'react-native-flash-message';

class ForgotPasswordScreen extends Component {
  state = {
    email: '',
    notfilled: true,
  };
  componentDidMount() {
    const {email} = this.props.navigation.state.params;
    if (email !== '') {
      this.setState({notfilled: false});
    }
    this.setState({
      email,
    });
  }
  CheckText() {
    if (this.state.email !== '') {
      this.setState({notfilled: false});
    } else {
      this.setState({notfilled: true});
    }
  }
  BtnColor(bool) {
    if (!bool) {
      return colors.black;
    }
    return '#d3d3d3';
  }
  async sendEmail() {
    let errorOccurred = false;
    //console.warn('UMM');
    await FirebaseFunctions.forgotPassword(this.state.email).catch(err => {
      //console.warn('HEEEY');
      errorOccurred = true;
      showMessage({
        message: 'Uh Oh',
        description: 'There is no user with this email',
        type: 'danger',
        position: 'top',
        duration: 5000,
      });
    });
    return errorOccurred;
  }
  showEmailTextInput() {
    return (
      <View
        style={{flex: 1, alignItems: 'center', backgroundColor: colors.white}}>
        <Heading
          style={{justifyContent: 'space-between', width: scale(414)}}
          navigation={this.props.navigation}
        />
        <Text
          style={{
            marginTop: 10,
            fontFamily: 'Arial-BoldMT',
            fontSize: moderateScale(14),
          }}>
          Please type in your email in order to reset your password
        </Text>
        <TextInput
          placeholderTextColor={colors.lightGrey}
          style={[
            styles.txtinput,
            {
              marginTop: 10,
            },
          ]}
          label="Email"
          mode="outlined"
          placeholder="Email"
          onChangeText={username => {
            this.setState({email: username}, () => this.CheckText());
          }}
          defaultValue={this.state.email}
          value={this.state.email.value}
        />
        <TouchableOpacity
          style={[
            styles.next2,
            {
              marginLeft: 0,
              borderColor: this.BtnColor(this.state.notfilled),
              backgroundColor: this.BtnColor(this.state.notfilled),
            },
          ]}
          disabled={this.state.notfilled}
          onPress={async () => {
            let failed = await this.sendEmail();
            if (!failed) {
              showMessage({
                message: 'Email Sent',
                description:
                  "We have sent you an email to reset your password, check your junk or spam folders if you can't find it",
                duration: 5000,
                position: 'top',
                type: 'success',
              });
              this.props.navigation.goBack(null);
            }
          }}>
          <Text style={styles.nextxt}>Send</Text>
        </TouchableOpacity>
      </View>
    );
  }
  render() {
    return (
      <View style={[styles.view, {alignItems: 'center'}]}>
        {this.showEmailTextInput()}
      </View>
    );
  }
}
export default ForgotPasswordScreen;
const loginstyle = StyleSheet.create({
  next2: {
    marginTop: 20,
    marginBottom: 20,
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 20,
    borderWidth: 1,
    paddingLeft: 25,
    paddingRight: 25,
    alignSelf: 'center',
  },
});
