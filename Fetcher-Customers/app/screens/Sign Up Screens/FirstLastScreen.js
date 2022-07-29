import {scale, verticalScale, moderateScale} from 'config/Styles/dimensions';
import React, {Component} from 'react';
import {View, TextInput, KeyboardAvoidingView, Text} from 'react-native';
import {styles} from '../../config/Styles/globalStyles';
import ContinueArrows from '../../components/Global Components/ContinueArrows';
import SignUpHandler from '../../config/SignUpHandler/SignUpHandler';

export default class FirstLast extends Component {
  state = {
    firstname: '',
    lastname: '',
    notFilled: true,
  };
  //Sends the full name of the User to the Sign Up class's static
  //fields
  CheckIfFull() {
    const {firstname, lastname} = this.state;
    SignUpHandler.nameHandler(firstname, lastname);
    this.props.navigation.push('EmailScreen');
  }
  //Checks if the TextInput fields are all full in order to enable the next-arrow button
  CheckText() {
    if (this.state.firstname !== '' && this.state.lastname !== '') {
      this.setState({notFilled: false});
    } else {
      this.setState({notFilled: true});
    }
  }
  render() {
    return (
      <View style={styles.view}>
        <Text style={styles.labelsbig}>
          Let's make sure others know who you are
        </Text>
        <View style={{flexDirection: 'row'}}>
          <TextInput
            placeholderTextColor={colors.lightGrey}
            style={[
              styles.txtinput,
              {
                marginLeft: 10,
                width: scale(170),
              },
            ]}
            label="First Name"
            mode="outlined"
            placeholderTextColor="#4d4e4f"
            placeholder="First Name"
            onChangeText={text => {
              this.setState({firstname: text}, () => this.CheckText());
            }}
            value={this.state.firstname.value}
          />
          <TextInput
            placeholderTextColor={colors.lightGrey}
            style={[
              styles.txtinput,
              {
                marginLeft: 20,
                width: 170,
              },
            ]}
            label="Last Name"
            mode="outlined"
            placeholderTextColor="#4d4e4f"
            placeholder="Last Name"
            onChangeText={input => {
              this.setState({lastname: input}, () => this.CheckText());
            }}
            value={this.state.lastname.value}
          />
        </View>
        <ContinueArrows
          onPressBack={() => {
            SignUpHandler.clearState();
          }}
          navigation={this.props.navigation}
          onPress={() => this.CheckIfFull()}
          notFilled={this.state.notFilled}
        />
      </View>
    );
  }
}
