import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { Colors } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import Snackbar from "react-native-snackbar";
import { useLabContext } from "../../context/LabContext";

const PressableLabCartIcon = ({ dontNavigate }) => {
  const { fetchLabCart, labCartLength, setLabCartLength } = useLabContext();
  const { authState } = useAuth();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      if (authState.token) {
        // If the user is authenticated, fetch the cart
        fetchLabCart();
      } else {

        // If the user is not authenticated, reset the cart length to 0
        setLabCartLength(0);
      }
    }, [authState.token,setLabCartLength]) 
  );

  const handleNavigate = () => {
    if (!dontNavigate) {
      if (authState.token) {
        router.push("/screens/(authenticated)/labScreens/cart");
      } else {
        router.push("/login");
      }
    }
  };

  return (
    <TouchableOpacity onPress={handleNavigate} style={styles.container}>
      {labCartLength> 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{labCartLength}</Text>
        </View>
      )}
      <Ionicons name="cart-outline" size={24} color="black" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: "100%",
    width: "100%",
    borderRadius: "50%",
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
export default PressableLabCartIcon;
