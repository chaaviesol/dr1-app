import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Colors } from "../../constants/Colors";
import PrimaryButton from "../PrimaryButton";
import { useRouter } from "expo-router";
import useLabCart from "../../hooks/useLabCart";
import { MaterialIcons } from "@expo/vector-icons";
import { removeFromCart } from "../../api/labApis";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const BookTestItem = ({ id, name, price, test_number, incart }) => {
  const {
    addToCartMutation,
    handleAddToCart,
    removeFromCartMutation,
    handleRemoveFromCart,
  } = useLabCart();

  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => {
        router.push(`/screens/lab/test/${id}`);
      }}
      style={styles.container}
    >
      <View style={styles.textSection}>
        <Text style={styles.testName}>{name}</Text>
        <Text style={styles.testName}> ₹ {price}</Text>
      </View>
      <View style={styles.buttonSection}>
        {incart ? (
          <View
            style={{
              paddingHorizontal: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              disabled={removeFromCartMutation.isPending}
              onPress={() => handleRemoveFromCart(test_number)}
            >
              <MaterialIcons name="delete-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
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

export default BookTestItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 20,
    marginVertical: 8,
    borderWidth: 0.6,
    borderColor: "rgba(0, 0, 0, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 0.5,
    elevation: 0.5,
    backgroundColor: Colors.whiteBackground,
  },
  textSection: {
    gap: 6,
  },

  testName: {
    fontSize: 14,
    textTransform: "capitalize",
  },
});
