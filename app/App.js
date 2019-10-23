import React from "react";
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, StatusBar } from "react-native";

import chroma from "chroma-js";
import dgram from "react-native-udp";
import { SketchCanvas } from "@terrylinla/react-native-sketch-canvas";

const LIGHT = 0;
const PIEZO = 1;
const FORCE = 2;

class App extends React.Component {
  state = {
    connected: false,
    sensorMins: [0, 0, 0],
    sensorMaxes: [1, 1, 1],
    sensors: [0, 0, 0]
  };

  connect = () => {
    const socket = dgram.createSocket("udp4");
    socket.bind(57455);

    socket.once("listening", () => {
      this.setState({ connected: true });
    });

    socket.on("message", (data, rinfo) => {
      const message = new TextDecoder("utf-8").decode(data);

      const { sensorMins, sensorMaxes } = this.state;

      const newSensorMins = [...sensorMins];
      const newSensorMaxes = [...sensorMaxes];
      const sensors = message.split(",").map((v, i) => {
        const val = +v;

        if (val > sensorMaxes[i]) {
          newSensorMaxes[i] = val;
        } else if (val < sensorMins[i]) {
          newSensorMins[i] = val;
        }

        return val;
      });
      this.setState({ sensors, sensorMins: newSensorMins, sensorMaxes: newSensorMaxes });
    });
  };

  scale = (num, in_min, in_max, out_min, out_max) => {
    return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  };

  calibrate = (value, index, range) => {
    const { sensorMins, sensorMaxes } = this.state;
    const min = sensorMins[index];
    const max = sensorMaxes[index];

    return this.scale(value, min, max, ...range);
  };

  getColor = val => {
    return chroma.hsl(val, 1, 0.6).hex();
  };

  // driven off of the light sensor
  getBackgroundColor = () => {
    const { sensors } = this.state;

    const val = sensors[LIGHT];
    const calibrated = this.calibrate(val, LIGHT, [0, 360]);

    return this.getColor(calibrated);
  };

  // driven off of the piezoelectric sensor
  getStrokeWidth = () => {
    const { sensors } = this.state;

    const val = sensors[PIEZO];
    const calibrated = this.calibrate(val, LIGHT, [1, 10]);

    return calibrated;
  };

  // driven off of the force resist sensor
  getStrokeColor = () => {
    const { sensors } = this.state;

    const val = sensors[FORCE];
    const calibrated = this.calibrate(val, LIGHT, [0, 360]);

    return this.getColor(calibrated);
  };

  render() {
    const { connected, sensors } = this.state;

    return (
      <>
        <StatusBar hidden={true} />
        <SafeAreaView style={[styles.container, { backgroundColor: this.getBackgroundColor() }]}>
          <SketchCanvas
            style={styles.canvas}
            strokeWidth={this.getStrokeWidth()}
            strokeColor={this.getStrokeColor()}
          />
          {!connected && (
            <TouchableOpacity style={styles.button} onPress={this.connect}>
              <Text style={styles.buttonLabel}>connect</Text>
            </TouchableOpacity>
          )}
          {__DEV__ && (
            <View style={styles.row}>
              {sensors.map((val, i) => (
                <Text style={styles.text} key={i}>
                  {val}
                </Text>
              ))}
            </View>
          )}
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  canvas: { position: "absolute", top: 0, right: 0, left: 0, bottom: 0 },
  button: { paddingVertical: 10, paddingHorizontal: 25, backgroundColor: "white" },
  buttonLabel: { color: chroma.hsl(0, 1, 0.6).hex(), fontSize: 20 },
  row: { flexDirection: "row" },
  text: { margin: 10 }
});

export default App;
