import {scale, verticalScale, moderateScale} from 'config/Styles/dimensions';
import React, {Component} from 'react';
import {
  TextInput,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {styles} from '../config/Styles/globalStyles';
import colors from '../config/Styles/colors';
import Heading from '../components/Global Components/Heading';
import FirebaseFunctions from '../config/Firebase/FirebaseFunctions';
import FlashMessage, {showMessage} from 'react-native-flash-message';

export default class ReportScreen extends Component {
  state = {
    reportText: '',
    addKeys: false,
  };
  componentDidMount() {
    if (this.props.navigation.state.params.isOrder) {
      //console.warn('YOOOO');
      this.setState({addKeys: true});
    }
  }
  render() {
    return (
      <View style={{flex: 1, backgroundColor: colors.white}}>
        <Heading
          navigation={this.props.navigation}
          style={{justifyContent: 'space-between'}}
        />
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{alignItems: 'center'}}>
          <Text style={localStyles.describeIssueTxt}>
            Please describe your issue below:{' '}
          </Text>
          <TextInput
            placeholderTextColor={colors.lightGrey}
            value={this.state.reportText}
            onChangeText={reportText => this.setState({reportText})}
            multiline
            style={localStyles.reportInput}
          />
          <TouchableOpacity
            onPress={async () => {
              const {
                firstname,
                lastname,
              } = await FirebaseFunctions.getCurrentUserData('commonData');
              FirebaseFunctions.addReport(
                firstname + ' ' + lastname,
                FirebaseFunctions.currentUser.email,
                this.state.reportText +
                  (this.state.addKeys
                    ? '\n' +
                      this.props.navigation.state.params.docId +
                      ', ' +
                      this.props.navigation.state.params.orderKey
                    : ''),
              );
              this.props.navigation.goBack(null);
              setTimeout(
                () =>
                  showMessage({
                    message: 'Thank you!',
                    duration: 5000,
                    position: 'top',
                    description:
                      'thank you for reporting this issue, we will email you with a response once we look into it',
                    type: 'success',
                  }),
                1000,
              );
            }}
            style={[
              styles.next,
              {marginRight: 0, backgroundColor: colors.black},
            ]}>
            <Text
              style={{
                color: colors.white,
                fontFamily: 'Arial-BoldMT',
                fontSize: moderateScale(14),
              }}>
              Submit
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}
const localStyles = StyleSheet.create({
  reportInput: {
    height: verticalScale(298.67),
    width: scale(276),
    borderWidth: 4,
    borderRadius: 5,
    textAlignVertical: 'top',
    borderColor: colors.black,
  },
  describeIssueTxt: {
    color: colors.black,
    fontFamily: 'Arial-BoldMT',
    fontSize: moderateScale(16),
  },
});
