import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MapView } from "expo";
import { Ionicons } from "@expo/vector-icons";

export default class Foli extends React.Component {
  constructor(props) {
    super(props);
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
      <MapView.Marker
        ref={id}
        coordinate={{
          latitude,
          longitude,
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 14, color: "#555" }}>{name}</Text>
          <Ionicons name="md-bus" size={32} color="green" />
        </View>
      </MapView.Marker>
    );
  }
}
