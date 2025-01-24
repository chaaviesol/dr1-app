import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
const CartControl = ({ product,updateCount}) => {

  return (
    <View style={styles.cartControl}>
      <TouchableOpacity
        // disabled={isLoading}
        style={styles.cartButton}
        onPress={() => updateCount(product.quantity, "decrease",product.product_id||product.id)}

      >
        <Ionicons name="remove-outline" size={20} color="white" />
      </TouchableOpacity>
      <Text style={styles.cartCount}>{product?.quantity || 0}</Text>
      <TouchableOpacity
        // disabled={isLoading}
        style={styles.cartButton}
        onPress={() => updateCount(product.quantity, "increase",product.product_id||product.id)}
      >
        <Ionicons name="add" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cartControl: {
    // height: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    position: "relative",
  },
  cartButton: {
    fontSize: 24,
    width: 25,
    height: 25,
    backgroundColor: "green",
    color: "white",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    transition: "background-color 0.3s", // This transition doesn't work in React Native but you can achieve a similar effect with `Animated`
    opacity: 0.8, // Add some visual feedback for disabled state
    justifyContent: "center",
    alignItems: "center",
  },
  cartCount: {
    fontSize: 14,
    width: 20,
    fontWeight: "bold",
    textAlign: "center",
    position: "relative",
  },
});

export default CartControl;
