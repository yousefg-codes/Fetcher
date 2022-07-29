import React, {useState, useEffect, Component, useRef, createRef} from 'react';
import Maps, {
  PROVIDER_GOOGLE,
  Marker,
  Polyline,
  MarkerAnimated,
} from 'react-native-maps';
import {View, PermissionsAndroid, Image, Platform} from 'react-native';
import styles from '../../config/Styles/MapStyle';
import GlobalStateHandler from '../../config/GlobalHandler/GlobalStateHandler';
import Images from '../../config/Images/Images';
import FirebaseFunctions from '../../config/Firebase/FirebaseFunctions';
import colors from '../../config/Styles/colors';
import PolylineConverter from '@mapbox/polyline';
import {any} from 'prop-types';
import {displayClickHereToViewOrder} from '../GlobalComponents/ViewOrderInfoComponent';
import {
  scale,
  moderateScale,
  verticalScale,
} from '../../config/Styles/dimensions';
import {GOOGLE_MAPS_KEY} from '../../../keys';
import {Icon} from 'react-native-elements';
import Geolocation from 'react-native-geolocation-service';

export default (MapView = props => {
  const [myKey, setMyKey] = useState(GOOGLE_MAPS_KEY);
  const [userLocation, setUserLocation] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [userDirection, setUserDirection] = useState(0);
  const [deltas, setDeltas] = useState({});
  const [pathCoordinates, setPathCoordinates] = useState([]);
  const [mapsRef, setMapsRef] = useState(null);
  const [customerLocation, setCustomerLocation] = useState(null);
  const [businessLocation, setBusinessLocation] = useState(null);
  const [firstLocationAccess, setFirstLocationAccess] = useState(false);
  const [endMapDirectionsInterval, setEndMapDirectionsInterval] = useState(
    null,
  );

  clearPath = () => {
    setPathCoordinates([]);
    if (mapsRef !== null && userLocation !== null) {
      mapsRef.animateCamera(
        {
          center: {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          },
          pitch: 0,
          heading: 0,
          altitude: 100,
          zoom: 18,
        },
        {duration: 700},
      );
    }
    //console.warn(pathCoordinates)
  };

  getDirectionsToAddresses = async (destinations, destinationsCoords) => {
    let tempArr;
    // console.log(
    //   'https://maps.googleapis.com/maps/api/directions/json?origin=' +
    //     userLocation.latitude +
    //     ',' +
    //     userLocation.longitude +
    //     '&destination=' +
    //     destinations[0] +
    //     '&key=' +
    //     myKey,
    // );
    // console.log(destinations[0]);
    setBusinessLocation(destinationsCoords[0]);
    setCustomerLocation(destinationsCoords[1]);
    for (let i = 0; i < destinations.length; i++) {
      let fetched;
      //console.log('HEY!');
      //console.log(destinations[0]);
      //console.log('SUP');
      //console.log(destinations[1]);
      //console.log('UGGG');
      if (i === 0) {
        fetched = await fetch(
          'https://maps.googleapis.com/maps/api/directions/json?origin=' +
            userLocation.latitude +
            ',' +
            userLocation.longitude +
            '&destination=' +
            destinations[i] +
            '&key=' +
            myKey,
        ).catch(err => console.error(err));
        //sconsole.warn('AGGGGG');
      } else {
        // console.warn(
        //   'https://maps.googleapis.com/maps/api/directions/json?origin=' +
        //     destinations[i - 1] +
        //     '&destination=' +
        //     destinations[i] +
        //     '&key=' +
        //     myKey,
        // );
        fetched = await fetch(
          'https://maps.googleapis.com/maps/api/directions/json?origin=' +
            destinations[i - 1] +
            '&destination=' +
            destinations[i] +
            '&key=' +
            myKey,
        );
      }
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
      if (i === 0) {
        tempArr = coordinates;
      } else {
        tempArr = [...tempArr, ...coordinates];
      }
    }
    if (mapsRef !== null && userLocation !== null) {
      mapsRef.animateCamera(
        {
          center: {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          },
          pitch: 6,
          heading: userDirection,
          altitude: 100,
          zoom: 18,
        },
        {duration: 3000},
      );
    }
    setTimeout(() => setPathCoordinates(tempArr), 3000);
  };

  trackUserLocation = (numTimes, showAnyways) => {
    //console.warn('IN2');
    //setInterval(() => {
    let tempCurrLocation = {};
    setInterval(() => {
      if (FirebaseFunctions.currentUser !== null && props.isInDrivingSession) {
        FirebaseFunctions.updateUserLocation(
          tempCurrLocation.latitude,
          tempCurrLocation.longitude,
          tempCurrLocation.heading,
        );
      }
    }, 5000);
    if (Platform.OS === 'android') {
      setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          position => {
            //console.warn(position.coords.latitude);
            //console.warn(position.coords.heading);
            //console.log(position);
            //console.warn('IN3');
            if (showAnyways || position.coords.speed >= 0.4) {
              setUserDirection(
                position.coords.heading === -1
                  ? userDirection
                  : position.coords.heading,
              );
              setUserLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            }
            setDeltas({
              longitudeDelta: 0.1 / 69,
              latitudeDelta: 0.1 / 69,
            });
            setIsLoading(false);
            //console.log(props.isInDrivingSession);
            tempCurrLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              heading:
                position.coords.heading === -1
                  ? userDirection
                  : position.coords.heading,
            };
            setMapsRef(mapsRef => {
              if (mapsRef !== null) {
                mapsRef.animateCamera(
                  {
                    center: {
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude,
                    },
                    pitch: 6,
                    heading:
                      showAnyways || position.coords.speed >= 0.4
                        ? position.coords.heading
                        : userDirection,
                    altitude: 100,
                    zoom: 18,
                  },
                  {duration: 700},
                );
              }
            });
            // if(!firstLocationAccess){
            //   navigator.geolocation = ;
            // }
            // setTimeout(() => trackUserLocation((numTimes + 1) % 10, false), 3000);
          },
          err => {},
          {enableHighAccuracy: true, maximumAge: 1000},
        );
        navigator.geolocation = Geolocation;
      }, 600);
    } else {
      Geolocation.getCurrentPosition(
        position => {
          setUserDirection(
            position.coords.heading === -1
              ? userDirection
              : position.coords.heading,
          );
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          tempCurrLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            heading:
              position.coords.heading === -1
                ? userDirection
                : position.coords.heading,
          };
          setDeltas({
            longitudeDelta: 0.1 / 69,
            latitudeDelta: 0.1 / 69,
          });
          setIsLoading(false);
        },
        err => {},
        {enableHighAccuracy: true},
      );
      //console.warn('IN BETWEEN');
      Geolocation.watchPosition(
        position => {
          //console.warn(position.coords.speed);
          //if (showAnyways || position.coords.speed >= 0.4) {
          setUserDirection(
            position.coords.heading === -1
              ? userDirection
              : position.coords.heading,
          );
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          //}
          setDeltas({
            longitudeDelta: 0.1 / 69,
            latitudeDelta: 0.1 / 69,
          });
          tempCurrLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            heading:
              position.coords.heading === -1
                ? userDirection
                : position.coords.heading,
          };
          setMapsRef(mapsRef => {
            if (mapsRef !== null) {
              mapsRef.animateCamera(
                {
                  center: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                  },
                  pitch: 6,
                  heading:
                    showAnyways || position.coords.speed >= 0.4
                      ? position.coords.heading
                      : userDirection,
                  altitude: 100,
                  zoom: 18,
                },
                {duration: 700},
              );
            }
            return mapsRef;
          });
        },
        err => {
          console.error(err);
        },
        {
          enableHighAccuracy: true,
          // interval: 5000,
          // fastestInterval: 2500,
          // forceRequestLocation: true,
        },
      );
    }
  };
  useEffect(() => {
    //console.warn(pathCoordinates)
  }, [pathCoordinates]);
  const asyncUseEffect = async () => {
    //console.error('LISTENERS ADDED AGAIN');
    GlobalStateHandler.eventEmitter.addListener('noMore', () => {
      clearPath();
      setCustomerLocation(null);
      setBusinessLocation(null);
      GlobalStateHandler.eventEmitter.emit('reload');
    });
    GlobalStateHandler.eventEmitter.addListener('moreOrders', async () => {
      const orderDetails = await FirebaseFunctions.getOrder(
        GlobalStateHandler.currentUserData.currentOrders[0],
      );
      setInterval(async () => {
        await getDirectionsToAddresses(
          [
            orderDetails.data().orderInfo.businessLocation.latitude +
              ',' +
              orderDetails.data().orderInfo.businessLocation.longitude,
            orderDetails.data().orderInfo.customerLocation.latitude +
              ',' +
              orderDetails.data().orderInfo.customerLocation.longitude,
          ],
          [
            {
              latitude: orderDetails.data().orderInfo.businessLocation.latitude,
              longitude: orderDetails.data().orderInfo.businessLocation
                .longitude,
            },
            {
              ...orderDetails.data().orderInfo.customerLocation,
            },
          ],
        );
      }, 5000);
      GlobalStateHandler.eventEmitter.emit('reload');
    });
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(async granted => {
        if (granted) {
          trackUserLocation(0, true);
        }
      });
    } else {
      //console.warn('IN');
      trackUserLocation(0, true);
    }
  };

  useEffect(() => {
    asyncUseEffect();
  }, []);

  if (isLoading) {
    return <View style={{color: colors.darkishYellow}} />;
  }
  return (
    <View style={styles.styles.container}>
      <Maps
        rotateEnabled={false}
        //{...mapProps}
        followsUserLocation
        //showsUserLocation
        onUserLocationChange={position => {
          //console.log('HAAAAAHAHAHAHAHAHA');
          // if (position.nativeEvent.coordinate.speed > 0.04) {
          //   setUserDirection(
          //     position.nativeEvent.coordinate.heading === -1
          //       ? userDirection
          //       : position.nativeEvent.coordinate.heading,
          //   );
          //   setUserLocation({
          //     latitude: position.nativeEvent.coordinate.latitude,
          //     longitude: position.nativeEvent.coordinate.longitude,
          //   });
          // }
        }}
        onMapReady={async () => {
          if (GlobalStateHandler.continueFirstOrder) {
            GlobalStateHandler.continueFirstOrder = false;
            let orderDetails = (await FirebaseFunctions.getOrder(
              GlobalStateHandler.currentUserData.currentOrders[0],
            )).data();
            setInterval(async () => {
              await getDirectionsToAddresses(
                [
                  orderDetails.orderInfo.businessLocation.latitude +
                    ',' +
                    orderDetails.orderInfo.businessLocation.longitude,
                  orderDetails.orderInfo.customerLocation.latitude +
                    ',' +
                    orderDetails.orderInfo.customerLocation.longitude,
                ],
                [
                  {
                    latitude: orderDetails.orderInfo.businessLocation.latitude,
                    longitude:
                      orderDetails.orderInfo.businessLocation.longitude,
                  },
                  {
                    ...orderDetails.orderInfo.customerLocation,
                  },
                ],
              );
            }, 5000);
            displayClickHereToViewOrder({
              orderDetails,
              orderID: GlobalStateHandler.currentUserData.currentOrders[0],
            });
          }
        }}
        ref={ref => setMapsRef(ref)}
        customMapStyle={styles.mapStyle}
        initialRegion={{...userLocation, ...deltas}}
        // onRegionChange={(region) => {
        //   setState({
        //     deltas: {
        //       latitudeDelta: region.latitudeDelta,
        //       longitudeDelta: region.longitudeDelta,
        //     }
        //   })
        // }}
        provider={PROVIDER_GOOGLE}
        key={myKey}
        style={styles.styles.mapView}>
        {businessLocation !== null ? (
          <Marker
            coordinate={{
              latitude: businessLocation.latitude,
              longitude: businessLocation.longitude,
              ...deltas,
            }}>
            <Icon
              type="ionicon"
              name="md-business"
              size={moderateScale(48)}
              color={'#fff'}
            />
          </Marker>
        ) : null}
        {customerLocation !== null ? (
          <Marker
            coordinate={{
              latitude: customerLocation.latitude,
              longitude: customerLocation.longitude,
              ...deltas,
            }}>
            <Icon
              type="ionicon"
              name="md-home"
              size={moderateScale(48)}
              color={'#fff'}
            />
          </Marker>
        ) : null}
        <MarkerAnimated
          coordinate={{
            latitude: userLocation.latitude - 0.000045,
            longitude: userLocation.longitude,
            ...deltas,
          }}
          style={styles.styles.carMarkerStyle}>
          <Image
            style={[
              styles.styles.carImage,
              pathCoordinates.length > 0
                ? {
                    width: scale(82.8),
                    height: verticalScale(71.68),
                  }
                : {},
            ]}
            source={Images.yourFetcherCar}
          />
        </MarkerAnimated>
        {pathCoordinates.length > 0 ? (
          <Polyline
            coordinates={pathCoordinates}
            strokeWidth={6}
            strokeColor={colors.skyBlue}
          />
        ) : null}
      </Maps>
    </View>
  );
});
