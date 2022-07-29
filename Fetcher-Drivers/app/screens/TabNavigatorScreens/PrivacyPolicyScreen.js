import React from 'react';
import {ScrollView, View, Text} from 'react-native';
import styles from '../../config/Styles/PrivacyPolicyScreenStyle';
import Strings from '../../config/Strings/Strings';
import DrawerOpener from '../../components/GlobalComponents/DrawerOpener';
import {verticalScale} from '../../config/Styles/dimensions';

export default (PrivacyPolicyScreenStyle = props => {
  return (
    <View style={styles.container}>
      <ScrollView style={{flex: 1, paddingBottom: verticalScale(20)}}>
        <Text style={styles.header}>Privacy Policy</Text>
        <Text style={styles.mainText}>{Strings.privacyPolicy}</Text>
      </ScrollView>
      <DrawerOpener />
    </View>
  );
});
