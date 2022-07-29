import {scale, verticalScale, moderateScale} from 'config/Styles/dimensions';
import React, {Component} from 'react';
import {
  View,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  BackHandler,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, Polyline} from 'react-native-maps';
import BusinessMarker from './BusinessMarker';
import {Dimensions} from 'react-native';
import GlobalHandler from '../../config/GlobalHandler/GlobalHandler';
import CarMarker from './CarMarker';
import PolylineConverter from '@mapbox/polyline';
import colors from '../../config/Styles/colors';
import FirebaseFunctions from '../../config/Firebase/FirebaseFunctions';
import {EventEmitter} from 'events';
import {GOOGLE_MAPS_KEY} from '../../../keys.js';

class Maps extends Component {
  state = {
    mainLocation: null,
    isLoading: true,
    gotTouchedAgain: false,
    myKey: GOOGLE_MAPS_KEY,
    size: new Animated.Value(verticalScale(298.67)),
    startloc: {
      latitude: this.props.zoomOnBusinessGiven
        ? this.props.businessLocations.docs[0].data().latitude
        : this.props.focusOnDriver
        ? this.props.drivers[0].driverData.currentLocation.latitude
        : GlobalHandler.getMainAddress().latitude,
      longitude: this.props.zoomOnBusinessGiven
        ? this.props.businessLocations.docs[0].data().longitude
        : this.props.focusOnDriver
        ? this.props.drivers[0].driverData.currentLocation.longitude
        : GlobalHandler.getMainAddress().longitude,
      latitudeDelta: this.props.zoomOnBusinessGiven
        ? 0.01
        : this.props.focusOnDriver
        ? 5 / 69
        : 2 / 69,
      longitudeDelta: this.props.zoomOnBusinessGiven
        ? 0.01
        : this.props.focusOnDriver
        ? 5 / 69
        : 2 / 69,
    },
    timeOuts: [],
    polylineCoordinates: [],
    isLoading: true,
    allLocations: [],
  };
  async componentDidMount() {
    //console.log(GlobalHandler.getMainAddress())
    this.setState({
      startloc: {
        latitude: this.props.zoomOnBusinessGiven
          ? this.props.businessLocations.docs[0].data().latitude
          : this.props.focusOnDriver
          ? this.props.drivers[0].driverData.currentLocation.latitude
          : GlobalHandler.getMainAddress().latitude,
        longitude: this.props.zoomOnBusinessGiven
          ? this.props.businessLocations.docs[0].data().longitude
          : this.props.focusOnDriver
          ? this.props.drivers[0].driverData.currentLocation.longitude
          : GlobalHandler.getMainAddress().longitude,
        latitudeDelta: this.props.zoomOnBusinessGiven
          ? 0.01
          : this.props.focusOnDriver
          ? 5 / 69
          : 2 / 69,
        longitudeDelta: this.props.zoomOnBusinessGiven
          ? 0.01
          : this.props.focusOnDriver
          ? 5 / 69
          : 2 / 69,
      },
    });
    //console.log(this.state.startloc);
    GlobalHandler.state.screens[1] = this;
    await this.displayImportantPlaces();
    if (this.props.focusOnDriver) {
      let toBusiness = await this.getDirectionsFromTo(
        this.props.drivers[0].driverData.currentLocation.latitude +
          ',' +
          this.props.drivers[0].driverData.currentLocation.longitude,
        this.props.businessLocation.latitude +
          ',' +
          this.props.businessLocation.longitude,
      );
      let toAddress = await this.getDirectionsFromTo(
        this.props.businessLocation.latitude +
          ',' +
          this.props.businessLocation.longitude,
        GlobalHandler.getMainAddress().latitude +
          ',' +
          GlobalHandler.getMainAddress().longitude,
      );
      toBusiness.concat(toAddress);
      this.setState({polylineCoordinates: toBusiness});
    }
    this.setState({isLoading: false});
  }
  async getDirectionsFromTo(origin, destination) {
    let fetched = await fetch(
      'https://maps.googleapis.com/maps/api/directions/json?origin=' +
        origin +
        '&destination=' +
        destination +
        '&key=' +
        this.state.myKey,
    );
    let respJson = await fetched.json();
    let lines = PolylineConverter.decode(
      respJson.routes[0].overview_polyline.points,
    );
    let coordinates = lines.map((element, index) => {
      return {
        latitude: element[0],
        longitude: element[1],
      };
    });
    return coordinates;
  }
  async displayImportantPlaces() {
    const {startloc} = this.state;
    var locations = [];
    if (this.props.zoomOnBusinessGiven || this.props.focusOnDriver) {
      //console.log(GlobalHandler.getMainAddress().latitude+' '+GlobalHandler.getMainAddress().longitude)
      locations[0] = (
        <Marker
          coordinate={{
            latitude: GlobalHandler.getMainAddress().latitude,
            longitude: GlobalHandler.getMainAddress().longitude,
            latitudeDelta: 20 / 69,
            longitudeDelta: 20 / 69,
          }}
          key={0}
        />
      );
    } else {
      locations[0] = (
        <Marker
          coordinate={{
            latitude: startloc.latitude,
            longitude: startloc.longitude,
            latitudeDelta: 20 / 69,
            longitudeDelta: 20 / 69,
          }}
          key={0}
        />
      );
    }
    if (!this.props.focusOnDriver) {
      let data = this.props.businessLocations;
      for (var i = 0; i < data.docs.length; i++) {
        let currDocData = data.docs[i].data();
        let logo = await FirebaseFunctions.getBusinessLogo(
          currDocData.businessId,
        );
        locations[i + 1] = (
          <BusinessMarker
            navigation={this.props.navigation}
            businessId={currDocData.businessId}
            content={currDocData.businessName}
            key={i + 1}
            businessLogo={logo}
            coordinate={{
              longitudeDelta: this.state.startloc.longitudeDelta,
              latitudeDelta: this.state.startloc.latitudeDelta,
              latitude: currDocData.latitude,
              longitude: currDocData.longitude,
            }}
          />
        );
      }
      this.setState({allLocations: locations});
    } else {
      let data = this.props.businessLocation;
      let logo = await FirebaseFunctions.getBusinessLogo(data.businessId);
      locations[1] = (
        <BusinessMarker
          navigation={this.props.navigation}
          businessId={data.businessId}
          content={data.businessName}
          businessLogo={logo}
          key={1}
          coordinate={{
            longitudeDelta: this.state.startloc.longitudeDelta,
            latitudeDelta: this.state.startloc.latitudeDelta,
            latitude: data.latitude,
            longitude: data.longitude,
          }}
        />
      );
      this.setState({allLocations: locations});
    }
  }
  BtnColor(bool) {
    if (this.state.removeAmarker && !this.isAllNull()) {
      return '#ff0000';
    }
    if (!bool) {
      return colors.black;
    }
    return '#d3d3d3';
  }
  __ChangeRegion = region => {
    this.state.startloc = region;
    if (this.state.createMarker) {
      this.state.permanentLocs[this.state.numMarkers] = region;
      if (this.state.placeMarker) {
        this.setState({numMarkers: this.state.numMarkers + 1});
      }
    }
  };
  updateSizeLarger() {
    Animated.timing(this.state.size, {
      toValue: verticalScale(448),
      duration: 300,
      useNativeDriver: false,
    }).start(() => {});
  }
  updateSizeSmaller() {
    Animated.timing(this.state.size, {
      toValue: verticalScale(224),
      duration: 700,
      useNativeDriver: false,
    }).start(() => {
      this.setState({
        startloc: {
          latitude: this.props.zoomOnBusinessGiven
            ? this.props.businessLocations.docs[0].data().latitude
            : GlobalHandler.getMainAddress().latitude,
          longitude: this.props.zoomOnBusinessGiven
            ? this.props.businessLocations.docs[0].data().longitude
            : GlobalHandler.getMainAddress().longitude,
          latitudeDelta: this.props.zoomOnBusinessGiven ? 0.01 : 1 / 69,
          longitudeDelta: this.props.zoomOnBusinessGiven ? 0.01 : 1 / 69,
        },
      });
    });
  }
  render() {
    if (this.state.isLoading) {
      return <View style={{backgroundColor: '#cca483'}} />;
    }
    return (
      <Animated.View
        style={[
          {justifyContent: 'space-between', overflow: 'hidden'},
          this.props.disableSizeUpdate ? {flex: 1} : {height: this.state.size},
          this.props.style,
        ]}>
        <TouchableWithoutFeedback
        // onPressOut={() => {
        //   this.setState({gotTouchedAgain: false})
        //   if(!this.props.disableSizeUpdate){
        //     console.log('Heoeo');
        //     this.state.timeOuts.push(setTimeout(() => {
        //       if(!this.state.gotTouchedAgain){
        //         this.updateSizeSmaller();
        //       }
        //     }, 5000))
        //   }
        // }}
        // onPressIn={() => {
        //   if(!this.props.disableSizeUpdate){
        //     console.log('Ugg')
        //     for(var i = 0; i < this.state.timeOuts; i++){
        //       clearTimeout(this.state.timeOuts);
        //       this.state.timeOuts.splice(i, 1)
        //     }
        //     this.setState({gotTouchedAgain: true});
        //     this.updateSizeLarger()
        //   }
        // }}
        >
          <MapView
            PROVIDER_GOOGLE={true}
            provider={PROVIDER_GOOGLE}
            customMapStyle={mapStyle}
            region={this.state.startloc}
            toolbarEnabled={false}
            setApiKey={this.state.myKey}
            onRegionChange={this.__ChangeRegion}
            style={[
              {
                position: 'absolute',
                left: 0,
                bottom: 0,
                right: 0,
                top: 0,
              },
              this.props.disableSizeUpdate
                ? {flex: 1}
                : {height: verticalScale(448)},
            ]}
            initialRegion={this.state.startloc}>
            {this.state.allLocations}
            {this.props.drivers.map((item, index) => {
              if (item.driverData.isInDrivingSession) {
                return (
                  <CarMarker
                    key={index}
                    latitude={item.driverData.currentLocation.latitude}
                    heading={item.driverData.currentLocation.heading}
                    longitude={item.driverData.currentLocation.longitude}
                  />
                );
              } else {
                return null;
              }
            })}
            <Polyline
              coordinates={this.state.polylineCoordinates}
              strokeColor={colors.skyBlue}
              strokeWidth={6}
            />
          </MapView>
          {/*this.props.disableChooseLocation ? null : <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                          <View>
                              <TouchableOpacity style={[styles.next, {borderColor: colors.black, paddingBottom: 5, paddingTop: 5, backgroundColor: colors.black, marginLeft: 10, marginRight: 10}]} onPress={() => {this.setState({createMarker: true});}}><View><Icon color=colors.white name='add-location'/></View></TouchableOpacity>
                              <TouchableOpacity style={[styles.next, {borderColor: this.BtnColor((this.isAllNull())), marginRight: 10, paddingBottom: 5, paddingTop: 5, backgroundColor: this.BtnColor((this.isAllNull())), marginLeft: 10}]} disabled={this.isAllNull()} onPress={() => {this.setState({removeAmarker: !this.state.removeAmarker})}}><View><Icon color=colors.white name='cancel'/></View></TouchableOpacity>
                          </View>
                      </View>*/}
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}
export default Maps;

const mapStyle = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#212121',
      },
    ],
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#212121',
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'administrative.country',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#bdbdbd',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#181818',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#1b1b1b',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#2c2c2c',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#8a8a8a',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [
      {
        color: '#373737',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#ffffff',
      },
      {
        lightness: -40,
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#3c3c3c',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#ffeb3b',
      },
      {
        lightness: -40,
      },
    ],
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry',
    stylers: [
      {
        color: '#4e4e4e',
      },
    ],
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#ffeb3b',
      },
      {
        lightness: -40,
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#ffffff',
      },
      {
        lightness: -40,
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: colors.black,
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#017aa2',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#3d3d3d',
      },
    ],
  },
];
