import {scale, verticalScale, moderateScale} from 'config/Styles/dimensions';
import React, {Component} from 'react';
import {View, Button, Text, StyleSheet, TouchableOpacity} from 'react-native';
import colors from 'config/Styles/colors';
import PaymentHandler from '../../config/Stripe/PaymentHandler';

class HomeScreen extends Component {
  render() {
    return (
      <View
        style={{width: '100%', height: '100%', backgroundColor: colors.white}}>
        <View style={styles.view}>
          <Text style={styles.title1}>
            Welcome to the <Text style={styles.title}>Fetcher</Text>
            {'\n'} App
          </Text>
          <TouchableOpacity
            style={styles.bt_ns}
            onPress={() => this.props.navigation.navigate('Login')}>
            <Text
              style={{
                color: colors.white,
                textAlign: 'center',
                paddingLeft: 15,
                paddingRight: 15,
                fontFamily: 'Arial-BoldMT',
                fontSize: 20,
              }}>
              Login
            </Text>
          </TouchableOpacity>
          <Text style={{fontFamily: 'Arial-BoldMT', fontSize: 20}}>or</Text>
          <TouchableOpacity
            style={styles.bt_ns}
            onPress={() => this.props.navigation.navigate('FirstLast')}>
            <Text
              style={{
                color: colors.white,
                textAlign: 'center',
                paddingLeft: 15,
                paddingRight: 15,
                fontFamily: 'Arial-BoldMT',
                fontSize: 20,
              }}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
export default HomeScreen;
const styles = StyleSheet.create({
  view: {
    alignItems: 'center',
    marginTop: 100,
  },
  term_service: {},
  bt_ns: {
    marginTop: 20,
    marginBottom: 20,
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 15,
    borderWidth: 1,
    paddingLeft: 50,
    paddingRight: 50,
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  title1: {
    fontFamily: 'Arial-BoldMT',
    fontSize: 40,
    textAlign: 'center',
    marginTop: 20,
  },
  title: {
    fontFamily: 'Arial-BoldMT',
    fontSize: 60,
    fontWeight: 'bold',
  },
});
