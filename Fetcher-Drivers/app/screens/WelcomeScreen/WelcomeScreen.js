import React, { useState } from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import styles from '../../config/Styles/WelcomeScreenStyle';
import Images from '../../config/Images/Images';

export default (WelcomeScreen = props => {
  const [isLoading, setIsLoading] = useState(true)
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={Images.fetcherLogo}
          style={styles.logo}
          onLoadEnd={() => {
            setIsLoading(false)
          }}
        />
        {isLoading 
          ? <View style={[styles.logo, styles.logoLoader]}>

            </View>
          : null
        }
        <Text style={styles.fetcherText}>Fetcher</Text>
        <Text style={styles.driversText}>Drivers</Text>
      </View>
      <View style={styles.btnsContainer}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => props.navigation.push('Login')}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        <Text style={styles.welcomeText}>or</Text>
        <TouchableOpacity 
          style={styles.signUpButton}
          onPress={() => props.navigation.push('BasicInfoScreen')}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});
