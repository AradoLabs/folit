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
      region: {
        latitude: 60.4503888,
        longitude: 22.2617936,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      },
    };

    this.fetchFolit = this.fetchFolit.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);
    this.hasValidLocation = this.hasValidLocation.bind(this);
    this.isInRange = this.isInRange.bind(this);
  }

  async componentDidMount() {
    await this.fetchFolit();
    //setInterval(this.fetchFolit, 5000);
  }

  hasValidLocation(vehicle) {
    return (
      vehicle.latitude &&
      vehicle.latitude > 0 &&
      vehicle.longitude &&
      vehicle.longitude > 0
    );
  }

  isInRange(latOrLong, delta, valueToCheck) {
    return (
      latOrLong - 0.5 * delta <= valueToCheck &&
      valueToCheck <= latOrLong + 0.5 * delta
    );
  }

  hasLocationInRegion(vehicle, region) {
    return (
      this.hasValidLocation(vehicle) &&
      this.isInRange(
        region.latitude,
        region.longitudeDelta,
        vehicle.latitude
      ) &&
      this.isInRange(region.longitude, region.longitudeDelta, vehicle.longitude)
    );
  }

  async fetchFolit() {
    const response = await fetch("https://data-new.foli.fi/siri-test/vm");
    const json = await response.json();
    const vehicles = Object.values(json.result.vehicles);
    const validVehicles = vehicles.filter(
      vehicle => this.hasValidLocation(vehicle)
    );
    validVehicles.map(vehicle => {
      ...vehicle,
      isInView: this.hasLocationInRegion(vehicle, this.state.region)
    });
    const vehicleCount = validVehicles.length;
    console.log("Vehicle count: " + vehicleCount);
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        folit: validVehicles,
      });
    });
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  render() {
    return (
      <MapView
        style={{ flex: 1 }}
        initialRegion={this.state.region}
        onRegionChange={this.onRegionChange}
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
