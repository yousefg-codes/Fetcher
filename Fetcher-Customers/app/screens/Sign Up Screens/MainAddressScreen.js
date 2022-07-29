import {scale, verticalScale, moderateScale} from 'config/Styles/dimensions';
import React, {Component} from 'react';
import {
  View,
  TextInput,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
} from 'react-native';
import {styles} from '../../config/Styles/globalStyles';
import ContinueArrows from '../../components/Global Components/ContinueArrows';
import Geocoder from 'react-native-geocoding';
import Heading from '../../components/Global Components/Heading';
import SplashScreen from '../../components/Global Components/SplashScreen';
import SignUpHandler from '../../config/SignUpHandler/SignUpHandler';
import {showMessage} from 'react-native-flash-message';

//saves the normal delivery location for the user
export default class Location extends Component {
  state = {
    address: SignUpHandler.state.address,
    city: SignUpHandler.state.city,
    stateprov: SignUpHandler.state.stateProv,
    country: SignUpHandler.state.country,
    location: null,
    hasState: false,
    notFilled:
      SignUpHandler.state.address == '' ||
      SignUpHandler.state.cardnum == '' ||
      SignUpHandler.state.stateProv == '' ||
      SignUpHandler.state.country == '',
    isLoading: false,
    items: [
      'USA',
      'America',
      'United States',
      'United States of America',
      'US',
      'U.S.',
      'Britain',
      'France',
      'Germany',
    ],
  };
  async CheckIfFull() {
    await this.Store();
  }
  async Store() {
    this.setState({isLoading: true});
    const {address, country, stateprov, city} = this.state;
    var Location =
      address +
      ', ' +
      city +
      (stateprov == '' ? '' : ', ' + stateprov) +
      ', ' +
      country;
    Geocoder.init('MY_GEO_KEY');
    let errorHasOccurred = false;
    Geocoder.from(Location)
      .then(async response => {
        let location = response.results[0].geometry.location;
        //console.log(response.results[0].geometry.location);
        this.setState({location}, async () => {
          const {lat, lng} = this.state.location;
          SignUpHandler.locationHandler(Location, lat, lng);
          if (this.props.navigation.state.params.addingAddress) {
            await SignUpHandler.addAddress(
              this.props.navigation.state.params.allAddresses,
            );
            this.setState({isLoading: false});
            this.props.navigation.push('AddAddressScreen');
          } else {
            await SignUpHandler.SignUpUser(() => {
              this.setState({isLoading: false}, () => {
                showMessage({
                  message: 'Uh Oh',
                  description:
                    'Something went wrong signing you up, please go back and review your information',
                  type: 'danger',
                  duration: 6000,
                });
                errorHasOccurred = true;
              });
            }).catch(err => {
              this.setState({isLoading: false}, () => {
                showMessage({
                  message: 'Uh Oh',
                  description:
                    'Something went wrong signing you up, please go back and review your information',
                  type: 'danger',
                  duration: 6000,
                });
              });
              errorHasOccurred = true;
            });
            if (!errorHasOccurred) {
              this.props.navigation.navigate('bottomTab');
            }
          }
        });
      })
      .catch(error => {
        this.setState({isLoading: false}, () => {
          showMessage({
            message: 'Invalid Address',
            description: 'Hmm... what kind of magical land is this I wonder...',
            type: 'danger',
            duration: 6000,
          });
        });
      });
  }
  checkColor() {
    if (this.state.hasState) {
      return colors.black;
    }
    return '#d3d3d3';
  }
  CheckCountry(country) {
    if (this.state.items.includes(country)) {
      this.setState({hasState: true});
      return;
    }
    this.setState({hasState: false});
  }
  BtnColor(bool) {
    if (!bool) {
      return colors.black;
    }
    return '#d3d3d3';
  }
  CheckText() {
    if (this.state.hasState) {
      const {address, city, stateprov, country} = this.state;
      var arr = [address, city, stateprov, country];
    } else {
      const {address, city, country} = this.state;
      var arr = [address, city, country];
    }
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === '') {
        this.setState({notFilled: true});
        return;
      }
    }
    this.setState({notFilled: false});
  }
  componentDidMount() {
    //console.log(this.props.navigation.state.params.allAddresses);
  }
  render() {
    if (this.state.isLoading) {
      return <SplashScreen />;
    }
    return (
      <View style={styles.view}>
        {this.props.navigation.state.params.addingAddress ? (
          <Heading
            defaultRow
            onPress={() => this.props.navigation.goBack(null)}
            navigation={this.props.navigation}
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              alignContent: 'center',
            }}
          />
        ) : null}
        <Text style={styles.labelsbig}>
          {this.props.navigation.state.params.addingAddress
            ? 'Fill in the information below'
            : "Where's the main place you want your items delivered to?"}
        </Text>
        <TextInput
          placeholderTextColor={colors.lightGrey}
          defaultValue={this.state.address}
          style={[
            styles.txtinput,
            {
              marginLeft: 10,
            },
          ]}
          label="Address"
          mode="outlined"
          secureTextEntry={false}
          placeholder="Address"
          placeholderTextColor="#4d4e4f"
          onChangeText={address => {
            this.setState({address}, () => this.CheckText());
          }}
          value={this.state.address.value}
        />
        <TextInput
          placeholderTextColor={colors.lightGrey}
          defaultValue={this.state.country}
          style={[
            styles.txtinput,
            {
              marginLeft: 10,
            },
          ]}
          label="Country"
          secureTextEntry={false}
          mode="outlined"
          placeholder="Country"
          placeholderTextColor="#4d4e4f"
          onChangeText={country => {
            this.setState({country}, () => {
              this.CheckCountry(country);
              this.CheckText();
            });
          }}
          value={this.state.country.value}
        />
        <TextInput
          placeholderTextColor={colors.lightGrey}
          defaultValue={this.state.stateprov}
          style={[
            styles.txtinput,
            {
              marginLeft: 10,
              borderColor: this.checkColor(),
            },
          ]}
          borderColor={this.checkColor()}
          label=" State/Province"
          editable={this.state.hasState}
          placeholderTextColor="#4d4e4f"
          secureTextEntry={false}
          mode="outlined"
          placeholder="State/Province"
          onChangeText={state => {
            this.setState({stateprov: state}, () => this.CheckText());
          }}
          value={this.state.stateprov.value}
        />
        <TextInput
          placeholderTextColor={colors.lightGrey}
          defaultValue={this.state.city}
          style={[
            styles.txtinput,
            {
              marginLeft: 10,
            },
          ]}
          label="City"
          secureTextEntry={false}
          mode="outlined"
          placeholder="City"
          placeholderTextColor="#4d4e4f"
          onChangeText={city => {
            this.setState({city}, () => this.CheckText());
          }}
          value={this.state.city.value}
        />
        {this.props.navigation.state.params.addingAddress ? (
          <TouchableOpacity
            style={[
              styles.next2,
              {
                borderColor: this.BtnColor(this.state.notFilled),
                marginLeft: 0,
                alignSelf: 'center',
                backgroundColor: this.BtnColor(this.state.notFilled),
              },
            ]}
            disabled={this.state.notFilled}
            onPress={() => this.CheckIfFull()}>
            <Text style={{color: colors.white}}>Add</Text>
          </TouchableOpacity>
        ) : (
          <ContinueArrows
            onPressBack={() =>
              SignUpHandler.tempLocationHandler(
                this.state.address,
                this.state.city,
                this.state.stateprov,
                this.state.country,
              )
            }
            onPress={async () => await this.CheckIfFull()}
            notFilled={this.state.notFilled}
          />
        )}
      </View>
    );
  }
}
