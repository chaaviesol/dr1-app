import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "../../constants/Colors";
import PrimaryButton from "../PrimaryButton";

const CartFooter = ({ cartItems, totalPrice, onPress, diabled }) => {
  return (
    <View style={styles.cartFooter}>
      <View style={styles.footerContent}>
        <View style={styles.footerItemCount}>
          <Text style={styles.footerItemCountText}>
            {cartItems && (cartItems.length || 0)} Items in the cart
          </Text>
          <Text style={styles.footerTotalPrice}>₹ {totalPrice()}</Text>
        </View>
        <PrimaryButton
          title="Checkout"
          rounded="lg"
          height={30}
          onPress={onPress}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartFooter: {
    position: "absolute", // Fixed position at the bottom
    bottom: 0,
    height: 66,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 44,
    borderWidth: 0.5,
    borderColor: "rgba(0, 0, 0, 0.12)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    boxShadow: "0 -2px 5px rgba(0, 0, 0, 0.1)",
    marginBottom: 20,
    alignSelf: "center", // Center horizontally
    justifyContent: "center",
  },
  footerContent: {
    flexDirection: "row", // Align items horizontally
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerItemCount: {
    margin: 0,
  },
  footerItemCountText: {
    fontSize: 10,
    fontWeight: "500",
    lineHeight: 13,
    letterSpacing: -0.41,
    color: "rgba(25, 23, 23, 1)",
  },
  footerTotalPrice: {
    margin: 0,
    fontWeight: "500",
    fontSize: 16,
    // lineHeight: 13,
    letterSpacing: -0.41,
    color: "rgba(25, 23, 23, 1)",
  },
  checkoutButton: {
    backgroundColor: Colors.primary,
    width: 93,
    height: 39,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 31,
    cursor: "pointer", // React Native doesn't have cursor styles, so it won't work
  },
  checkoutButtonPressed: {
    backgroundColor: "rgb(118, 145, 243)", // Button color change when pressed
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default CartFooter;
