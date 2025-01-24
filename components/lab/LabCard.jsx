import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import StarRating from "../ui/StarRating";
import { Colors } from "../../constants/Colors";

const LabCard = ({ name, image, location, services }) => {
  return (
    <View style={styles.bestLabCard}>
      <Image
        source={require("../../assets/images/lab.jpg")}
        style={styles.labImage}
      />
      <View style={styles.bestLabCardRight}>
        <Text style={styles.name}>{name || "Ashwathy laboratory"}</Text>
        <View style={styles.ratingContainer}>
          <StarRating rating={4} />
        </View>
        <Text style={styles.location}>{location || "Kozhikode"}</Text>
        <Text style={styles.services}>{services || "Blood Sugar Test"}</Text>
      </View>
    </View>
  );
};

export default LabCard;

const styles = StyleSheet.create({
  bestLabCard: {
    height:120,
    width: "100%",
    backgroundColor: Colors.whiteBackground,
    borderWidth: 0.6,
    borderColor: "rgba(0, 0, 0, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 0.5,
    elevation: 0.5,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    gap:8
  
  },
  labImage: {
    height: "100%", // fixed height (adjust as necessary)
    width: 90, // fixed height (adjust as necessary)
    borderRadius: 12,
    objectFit: "cover",
  },
  bestLabCardRight: {
    flexDirection: "column",
    justifyContent: "center",
    width: "60%",
    paddingLeft: 10,
  },
  name: {
    fontWeight: "700",
    fontSize: 16,
    flexShrink: 1, // Prevent overflow
  },
  ratingContainer: {
    flexDirection: "row",
    marginTop: 6,
  },
  location: {
    marginTop: 6,
    color: "#3a65fd",
    flexShrink: 1, // Prevent overflow
  },
  services: {
    color: "#0d9554",
    fontSize: 14,
    flexShrink: 1, // Prevent overflow
  },
});
