import React, {useState, useEffect} from 'react';
import {View, TextInput, Text, ScrollView} from 'react-native';
import styles from '../../config/Styles/AddressScreenStyle';
import BackAndForthArrows from '../../components/GlobalComponents/BackAndForthArrows';
import globalStyles from '../../config/Styles/globalStyles';
import SignUpHandler from '../../config/SignUpHandler/SignUpHandler';
import colors from '../../config/Styles/colors';
import FirebaseFunctions from '../../config/Firebase/FirebaseFunctions';

export default (AddressScreen = props => {
  const [address, setAddress] = useState(SignUpHandler.address);
  const [city, setCity] = useState(SignUpHandler.city);
  const [stateProv, setStateProv] = useState(SignUpHandler.stateProv);
  const [country, setCountry] = useState(SignUpHandler.country);
  const [notFilled, setNotFilled] = useState(true);
  const [stateProvCountries, setStateProvCountries] = useState([
    'USA',
    'US',
    'America',
    'U.S.',
    'U.S.A',
  ]);

  useEffect(() => {
    checkText();
    if (!props.route.isAddition) {
      SignUpHandler.setAddressInfo(address, city, stateProv, country);
    }
  }, [stateProv, country, city, address]);
  const checkText = () => {
    if (city !== '' && address !== '' && country !== '') {
      if (stateProvCountries.includes(country) ? stateProv !== '' : true) {
        setNotFilled(false);
        return;
      }
    }
    setNotFilled(true);
  };
  return (
    <View style={styles.container}>
      {props.route.isAddition ? null : (
        <Text style={globalStyles.signUpHeader}>And now your Address</Text>
      )}
      <View style={styles.allInfoContainer}>
        <View>
          <Text style={globalStyles.signUpText}>Country</Text>
          <TextInput
            autoCapitalize="none"
            autoFocus
            placeholderTextColor={colors.grey}
            placeholder="e.g. Germany"
            defaultValue={country}
            value={country}
            style={styles.textInputs}
            onChangeText={text => {
              setCountry(text);
            }}
          />
        </View>
        <View>
          <Text style={globalStyles.signUpText}>State/Province</Text>
          <TextInput
            autoCapitalize="none"
            placeholderTextColor={colors.grey}
            placeholder="e.g. British Columbia"
            value={stateProv}
            defaultValue={stateProv}
            editable={stateProvCountries.includes(country)}
            style={[
              styles.textInputs,
              {
                borderColor: stateProvCountries.includes(country)
                  ? colors.black
                  : colors.grey,
              },
            ]}
            onChangeText={text => {
              setStateProv(text);
            }}
          />
        </View>
        <View>
          <Text style={globalStyles.signUpText}>City</Text>
          <TextInput
            autoCapitalize="none"
            placeholderTextColor={colors.grey}
            placeholder="e.g. Cairo"
            defaultValue={city}
            value={city}
            style={styles.textInputs}
            onChangeText={text => {
              setCity(text);
            }}
          />
        </View>
        <View>
          <Text style={globalStyles.signUpText}>Address</Text>
          <TextInput
            autoCapitalize="none"
            placeholderTextColor={colors.grey}
            placeholder="e.g. 12345 SE 13th St. House 489"
            defaultValue={address}
            value={address}
            style={styles.textInputs}
            onChangeText={text => {
              setAddress(text);
            }}
          />
        </View>
      </View>
      {props.route.isAddition ? (
        <BackAndForthArrows
          notFilled={notFilled}
          onPressConditional={async setIsLoading => {
            await FirebaseFunctions.changeAddress(
              address +
                ', ' +
                (stateProv === ''
                  ? city + ', ' + country
                  : city + ', ' + stateProv + ', ' + country),
            );
            setIsLoading();
            props.navigation.push('ChangeAddressScreen');
          }}
          nextScreen="PaymentInfoScreen"
          navigation={props.navigation}
        />
      ) : (
        <BackAndForthArrows
          notFilled={notFilled}
          nextScreen="PaymentInfoScreen"
          navigation={props.navigation}
        />
      )}
    </View>
  );
});
