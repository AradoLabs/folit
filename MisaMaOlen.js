import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { MapView, Location, Permissions } from "expo";

export default class MisaMaOlen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coordinate: new MapView.AnimatedRegion({
        latitude: 0,
        longitude: 0,
      }),
    };
  }

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({
      coordinate: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }
    });
  };

  render() {
    const { id, name, latitude, longitude } = this.props;
    return (
      <MapView.Marker.Animated
        ref={marker => {
          this.marker = marker;
        }}
        coordinate={this.state.coordinate}
      >
        <View
          renderToHardwareTextureAndroid
          style={{
            backgroundColor: "blue",
            width: 10,
            height: 10,
            borderRadius: 100 / 2,
          }}
        >
        </View>
      </MapView.Marker.Animated>
    );
  }
}
