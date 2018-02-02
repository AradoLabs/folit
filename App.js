import React from "react";
import { StyleSheet, Text, View, InteractionManager } from "react-native";
import { MapView } from "expo";
import { Ionicons } from "@expo/vector-icons";
import { setInterval } from "core-js/library/web/timers";
import Foli from "./Foli";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      folit: [],
    };

    this.fetchFolit = this.fetchFolit.bind(this);
  }

  async componentDidMount() {
    await this.fetchFolit();
    //setInterval(this.fetchFolit, 5000);
  }

  async fetchFolit() {
    const response = await fetch("https://data-new.foli.fi/siri-test/vm");
    const json = await response.json();
    const vehicles = Object.values(json.result.vehicles);
    const validVehicles = vehicles.filter(
      vehicle =>
        vehicle.latitude &&
        vehicle.latitude > 0 &&
        vehicle.longitude &&
        vehicle.longitude > 0,
    );
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        folit: validVehicles,
      });
    });
  }

  render() {
    return (
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 60.4503888,
          longitude: 22.2617936,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {this.state.folit.map(foli => {
          return (
            <Foli
              key={foli.vehicleref}
              name={foli.publishedlinename}
              latitude={foli.latitude}
              longitude={foli.longitude}
            />
          );
        })}
      </MapView>
    );
  }
}
