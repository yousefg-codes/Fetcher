import {scale, verticalScale, moderateScale} from 'config/Styles/dimensions'; import React, {Component} from 'react';
import {
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {styles} from '../../config/Styles/globalStyles';
import {Icon} from 'react-native-elements';

class Heading extends Component {
  render() {
    return (
      <View>
        <View
          style={[
            {
              backgroundColor: colors.black,
              flexDirection: 'row',
              alignItems: this.props.defaultRow ? 'center' : null,
              justifyContent: 'center',
              height: verticalScale(64),
              borderBottomWidth: 1,
              borderBottomColor: '#808080',
            },
            this.props.style,
          ]}>
          {this.props.drawerNavigator ? null : (
            <TouchableOpacity
              style={[
                styles.next,
                {
                  borderColor: colors.white,
                  paddingTop: 1,
                  marginRight: 0,
                  paddingBottom: 1,
                  marginTop: 0,
                  marginBottom: 0,
                  backgroundColor: colors.white,
                  marginLeft: 10,
                  alignContent: 'center',
                  justifyContent: 'center',
                },
              ]}
              onPress={
                this.props.onPress
                  ? () => this.props.onPress()
                  : () => this.props.navigation.goBack(null)
              }>
              <Icon size={30} name="arrow-back" color={colors.black} />
            </TouchableOpacity>
          )}
          {this.props.children}
        </View>
      </View>
    );
  }
}
export default Heading;
