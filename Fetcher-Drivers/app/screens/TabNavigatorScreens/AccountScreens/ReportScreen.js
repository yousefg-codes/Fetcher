import React, {useState} from 'react'
import {
  TextInput,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {scale, moderateScale, verticalScale} from '../../../config/Styles/dimensions'
import styles from '../../../config/Styles/ReportScreenStyle'
import globalStyles from '../../../config/Styles/globalStyles';
import colors from '../../../config/Styles/colors';
import Heading from '../../../components/GlobalComponents/Heading';
import FirebaseFunctions from '../../../config/Firebase/FirebaseFunctions';
import {showMessage} from 'react-native-flash-message';
import GlobalStateHandler from '../../../config/GlobalHandler/GlobalStateHandler';

export default  ReportScreen = (props) => {
  const [reportText, setReportText] = useState('')
    return (
      <View style={{flex: 1, backgroundColor: colors.white}}>
        <Heading navigation={props.navigation} onlyArrow={true} />
        <ScrollView style={{flex: 1}} contentContainerStyle={{ alignItems: 'center'}}>
          <Text style={styles.describeIssueTxt}>
            Please describe your issue below:{' '}
          </Text>
          <TextInput placeholderTextColor={colors.lightGrey}
            value={reportText}
            onChangeText={reportText => setReportText(reportText)}
            multiline
            style={styles.reportInput}
          />
          <TouchableOpacity
            onPress={async () => {
              const name = GlobalStateHandler.currentUserData.name;
              FirebaseFunctions.addReport(
                name,
                FirebaseFunctions.currentUser.email,
                reportText,
              );
              props.navigation.goBack(null);
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
              globalStyles.commonButtons,
              {marginRight: 0, 
              backgroundColor: colors.black,
              borderColor: colors.black, marginTop: verticalScale(17.92)},
            ]}>
            <Text style={{color: colors.white, fontFamily: 'Arial-BoldMT', fontSize: moderateScale(14)}}>
              Submit
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
}

