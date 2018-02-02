import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { MapView } from "expo";
import { Ionicons } from "@expo/vector-icons";

export default class Foli extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coordinate: new MapView.AnimatedRegion({
        latitude: 0,
        longitude: 0,
      }),
    };
  }

  componentWillReceiveProps(nextProps) {
    const duration = 1500;
    const nextCoordinate = {
      latitude: nextProps.latitude,
      longitude: nextProps.longitude,
    };

    const propsMatch =
      this.props.latitude === nextProps.latitude &&
      this.props.longitude === nextProps.longitude;

    if (!propsMatch) {
      if (Platform.OS === "android") {
        if (this.marker) {
          this.marker._component.animateMarkerToCoordinate(
            nextCoordinate,
            duration,
          );
        }
      } else {
        this.state.coordinate
          .timing({
            ...nextCoordinate,
            duration,
            useNativeDriver: true,
          })
          .start();
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.latitude === nextProps.latitude &&
      this.props.longitude === nextProps.longitude
    ) {
      return false;
    }
    return true;
  }

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
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
            paddingVertical: 2,
            paddingHorizontal: 6,
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 14, color: "#555" }}>{name}</Text>
          <Ionicons name="md-bus" size={32} color="green" />
        </View>
      </MapView.Marker.Animated>
    );
  }
}
