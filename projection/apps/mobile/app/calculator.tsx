import React from "react";
import { View, StyleSheet } from "react-native";
import { DeterministicProvider } from "../contexts/DeterministicContext";
import DeterministicTab from "../screens/DeterministicTab";

export default function CalculatorRoute() {
  return (
    <DeterministicProvider>
      <View style={styles.container}>
        <DeterministicTab />
      </View>
    </DeterministicProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
