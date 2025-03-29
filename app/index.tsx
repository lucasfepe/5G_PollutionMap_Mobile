import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Map from "./components";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AR Pollution Mapping</Text>
      <Text style={styles.description}>
        View real-time pollution levels on an interactive map.
      </Text>
      <View style={styles.mapContainer}>
        <Map />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  mapContainer: {
    flex: 1,
    width: "100%",
    maxWidth: 800,
  },
});