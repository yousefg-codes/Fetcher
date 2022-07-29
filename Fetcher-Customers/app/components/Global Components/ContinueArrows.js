import {scale, verticalScale, moderateScale} from 'config/Styles/dimensions';
import React, {Component} from 'react';
import {
  View,
  TextInput,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {styles} from '../../config/Styles/globalStyles';
import {Icon} from 'react-native-elements';
import colors from '../../config/Styles/colors';
import PropTypes from 'prop-types';
import {withNavigation} from 'react-navigation';
import {ActivityIndicator} from 'react-native';

class ContinueArrows extends Component {
  state = {
    isLoading: false,
  };
  btnColor(bool) {
    if (!bool) {
      return colors.black;
    }
    return '#d3d3d3';
  }
  async buttonPressForward() {
    if (this.props.onPressConditional) {
      this.setState({isLoading: true});
      await this.props.onPressConditional();
      this.setState({isLoading: false});
    } else {
      this.props.onPress();
    }
  }
  buttonPressBack() {
    this.props.onPressBack();
    this.props.navigation.goBack(null);
  }
  render() {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <TouchableOpacity
          style={[
            styles.next,
            {
              borderColor: colors.black,
              backgroundColor: colors.black,
              marginLeft: 10,
            },
          ]}
          onPress={() => this.buttonPressBack()}>
          <Icon size={30} name="arrow-back" color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.next2,
            {
              marginRight: 10,
              borderColor: this.btnColor(this.props.notFilled),
              backgroundColor: this.btnColor(this.props.notFilled),
            },
          ]}
          disabled={this.props.notFilled}
          onPress={() => this.buttonPressForward()}>
          {this.state.isLoading ? (
            <ActivityIndicator animating={true} color={colors.white} />
          ) : (
            <Icon size={30} name="arrow-forward" color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    );
  }
}
ContinueArrows.propTypes = {
  //onPress: PropTypes.func.isRequired,
  notFilled: PropTypes.bool.isRequired,
};
export default withNavigation(ContinueArrows);
