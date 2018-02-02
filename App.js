import React from "react";
import { StyleSheet, Text, View, InteractionManager } from "react-native";
import { MapView } from "expo";
import { Ionicons } from "@expo/vector-icons";
import { setInterval } from "core-js/library/web/timers";
import Foli from "./Foli";
import MisaMaOlen from "./MisaMaOlen";

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
    setInterval(this.fetchFolit, 5000);
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
    if (vehicle.publishedlinename == "73") {
      const a = 1;
    }
    return (
      this.isInRange(region.latitude, region.latitudeDelta, vehicle.latitude) &&
      this.isInRange(region.longitude, region.longitudeDelta, vehicle.longitude)
    );
  }

  async fetchFolit() {
    const response = await fetch("https://data-new.foli.fi/siri-test/vm");
    const json = await response.json();
    const vehicles = Object.values(json.result.vehicles);
    let validVehicles = vehicles.filter(vehicle =>
      this.hasValidLocation(vehicle)
    );
    validVehicles = validVehicles.map(vehicle => {
      return {
        ...vehicle,
        isInView: this.hasLocationInRegion(vehicle, this.state.region),
      };
    });
    const vehiclesInView = validVehicles.filter(vehicle => vehicle.isInView);
    console.log("Vehicle count: " + vehiclesInView.length);
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
        <MisaMaOlen />
      </MapView>
    );
  }
}
