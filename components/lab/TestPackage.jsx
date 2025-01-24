import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import PrimaryButton from "../PrimaryButton";
import { Colors } from "../../constants/Colors";
import { useRouter } from "expo-router";
import HomeOrCentre from "./HomeOrCentre";
import useLabCart from "../../hooks/useLabCart";
import { MaterialIcons } from "@expo/vector-icons";

const TestPackage = ({
  id,
  title,
  description,
  labTests,
  price,
  test_number,
  isHomeCollection,
  incart,
}) => {
  const {
    addToCartMutation,
    handleAddToCart,
    removeFromCartMutation,
    handleRemoveFromCart,
  } = useLabCart();
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        router.push(`/screens/lab/package/${id}`);
      }}
    >
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {description}
      </Text>

      <Text style={styles.labTests}>{labTests} Tests</Text>

      <View style={styles.iconContainer}>
        <HomeOrCentre isHomeCollection={isHomeCollection} />
      </View>
      <View style={styles.priceSection}>
        <Text style={styles.price}>₹ {price}</Text>
        {incart ? (
          <TouchableOpacity
            disabled={removeFromCartMutation.isPending}
            onPress={() => handleRemoveFromCart(test_number)}
          >
            <MaterialIcons name="delete-outline" size={24} color="black" />
          </TouchableOpacity>
        ) : (
          <PrimaryButton
            title="Add"
            rounded="lg"
            disabled={addToCartMutation.isPending}
            onPress={() => {
              handleAddToCart(test_number);
            }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    Width: "100%",
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
    // height: 210,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 10,
    color: "black",
    textTransform: "capitalize",
  },
  description: {
    fontSize: 14,
    color: "#4b4b4b",
    textTransform: "capitalize",
  },
  labTests: {
    fontSize: 14,
    marginVertical: 15,
    color: "#15803d",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
  },
  iconText: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    marginRight: 5,
  },
  priceSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
  },
  button: {
    backgroundColor: "#047857",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default TestPackage;
