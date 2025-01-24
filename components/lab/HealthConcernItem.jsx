import React from "react";
import { Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "../../constants/Colors";
import { router } from "expo-router";

const HealthConcernItem = ({ category, imageSource }) => {
  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        router.push(`/screens/lab/healthConcern/1`);
      }}
    >
      <Text style={styles.categoryText}>{category}</Text>
      <Image source={imageSource} style={styles.categoryImage} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: Colors.backgroundTwo,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,

    borderRadius: 10,
    marginBottom: 15, // Space between items
    width: "48%", // Ensures two items per row (you can adjust based on your layout needs)
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "normal",
  },
  categoryImage: {
    width: 40,
    height: 40,
  },
});

export default HealthConcernItem;
