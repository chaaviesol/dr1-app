import React, { useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../constants/Colors";
import { useFocusEffect, useRouter } from "expo-router";
import { usePharmacyContext } from "../context/PharmacyContext";
import { useAuth } from "../context/AuthContext";

function PressableCartIcon({ dontNavigate }) {
  const { cartLength, fetchCart, setCartLength } = usePharmacyContext(); // Extract cart length and fetchCart
  const { authState } = useAuth(); // Extract auth state
  const router = useRouter(); // For routing

  // Navigate to the cart screen when clicked
  const handleNavigate = () => {
    if (!dontNavigate) {
      {
        authState.token ?  router.push("/screens/(authenticated)/pharmacyscreens/cart") : router.push("/login")
      }
     
    }
  };

  // Fetch cart items when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (authState.token) {
        // If the user is authenticated, fetch the cart
        fetchCart();
      } else {
        // If the user is not authenticated, reset the cart length to 0
        setCartLength(0);
      }
    }, [authState.token, setCartLength]) // Add authState.token to the dependency array to trigger on token change
  );

  return (
    <TouchableOpacity onPress={handleNavigate} style={styles.container}>
      {cartLength > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{cartLength}</Text>
        </View>
      )}
      <Ionicons name="cart-outline" size={24} color="black" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: "100%",
    width: "100%",
    borderRadius:"50%",
    backgroundColor: Colors.backgroundTwo,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -7,
    backgroundColor: "green",
    borderRadius: 50,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default PressableCartIcon;
