import React from "react";
import { Modal, View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Colors } from "../constants/Colors";

const Loader = ({ visible }) => {
  return (
   
      <View style={styles.modalContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
      </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Loader;
