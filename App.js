import React from "react";
import { SafeAreaView, StyleSheet, ScrollView, View, Text, Button, StatusBar } from "react-native";
import dgram from "react-native-udp";

class App extends React.Component {
  state = {
    sensors: [0, 0, 0]
  };

  connect = () => {
    const socket = dgram.createSocket("udp4");
    socket.bind(57455);
    console.log(socket);
    socket.on("message", (data, rinfo) => {
      const message = new TextDecoder("utf-8").decode(data);

      const sensors = message.split(",");
      this.setState({ sensors });
    });
  };

  render() {
    const { sensors } = this.state;
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <Button onPress={this.connect} title="connect" />
          <View style={styles.row}>
            {sensors.map((val, i) => (
              <Text style={styles.text} key={i}>
                {val}
              </Text>
            ))}
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  row: { flexDirection: "row" },
  text: { margin: 10 }
});

export default App;
