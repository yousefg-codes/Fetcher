import {scale, verticalScale, moderateScale} from 'config/Styles/dimensions';
import React, {Component} from 'react';
import {View, TextInput, Text} from 'react-native';
import {styles} from '../../config/Styles/globalStyles';
import ContinueArrows from '../../components/Global Components/ContinueArrows';
import CodeInput from 'react-native-code-input';
import FirebaseFunctions from '../../config/Firebase/FirebaseFunctions';

//Screen appears only if you want to add a Phone number
export default class Verification extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    code: '',
    arrtxt: ['', '', '', '', '', ''],
    notFilled: true,
    focus: new Array(6),
    navigateTo: 'Location',
  };
  componentDidMount() {
    this.props.navigation.state.params == {}
      ? null
      : this.setState({navigateTo: 'AddCreatePhoneNumberScreen'});
  }
  checkCode() {
    this.props.navigation.navigate(this.state.navigateTo);
  }
  CheckText() {
    if (this.state.code != '') {
      this.setState({notFilled: false});
      return;
    }
    this.setState({notFilled: true});
  }
  render() {
    return (
      <View style={[styles.view, {flex: 3}]}>
        <Text style={styles.labelsbig}>Type in code sent.</Text>
        <CodeInput
          keyboardType="numeric"
          codeLength={5}
          borderType="border-circle"
          autoFocus={true}
          onFulfill={code => this._onFinishCheckingCode2(code)}
        />
        <ContinueArrows
          onPress={() => this.CheckIfFull()}
          notFilled={this.state.notFilled}
        />
      </View>
    );
  }
}
