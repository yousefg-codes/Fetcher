import {scale, verticalScale, moderateScale} from 'config/Styles/dimensions';
import React, {Component} from 'react';
import {View} from 'react-native';
import Maps from '../../components/Map/Maps';
import Heading from '../../components/Global Components/Heading';

export default class TrackOrderScreen extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <Heading
          navigation={this.props.navigation}
          style={{justifyContent: 'space-between'}}
        />
        <Maps
          businessLocation={this.props.navigation.state.params.businessLocation}
          drivers={[this.props.navigation.state.params.driver]}
          focusOnDriver
          disableSizeUpdate
          navigation={this.props.navigation}
        />
      </View>
    );
  }
}
