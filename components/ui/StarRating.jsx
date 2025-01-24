import React from "react";
import { View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const StarRating = ({ rating }) => {
  const maxRating = 5;
  const stars = [];

  for (let i = 1; i <= maxRating; i++) {
    stars.push(
      <Icon
        key={i}
        name={i <= rating ? "star" : "star-o"} // 'star' for filled, 'star-o' for empty
        size={16}
        color={i <= rating ? "#f59e0b" : "gray"}
        style={styles.star}
      />
    );
  }

  return <View style={styles.starContainer}>{stars}</View>;
};

const styles = StyleSheet.create({
  starContainer: {
    flexDirection: "row", // To arrange the stars horizontally
  },
  star: {
    marginRight: 8, // Spacing between the stars
  },
});

export default StarRating;
