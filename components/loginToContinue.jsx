import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";
import { router } from "expo-router";
import PrimaryButton from "./PrimaryButton";

const LoginToContinue = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/nolog.jpg")}
        style={styles.image}
      />
      {/* <Text style={styles.profileText}>Profile</Text> */}
      <Text style={styles.title}>Login for full potential</Text>
      <Text style={styles.subtitle}>
        Your health journey starts here, Log in for quick access to your
        healthcare services and records.
      </Text>
      <View style={styles.loginButton}>
        <PrimaryButton
          onPress={() => router.push("/login")}
          title="Login"
          rounded="sm"
          width="95%"
          height={45}
        />
      </View>
      <View style={[styles.loginButton, { marginTop: 15 }]}>
        <PrimaryButton
          onPress={() => router.push("/login/createAccount")}
          title="Create new account"
          rounded="sm"
          width="94.5%" //because this color makes button looking wider
          height={45}
          backgroundColor={Colors.backgroundTwo}
          textColor={Colors.primary}
        />
      </View>

      <Text style={styles.footer}>
        Explore without account?
        <Text onPress={() => router.push("/home")} style={styles.linkText}>
          {" "}
          {" "}
          Back to Home
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    textAlign: "center",
  },
  image: {
    width: 250,
    height: 250,
  },
  title: {
    fontWeight: "700",
    fontSize: 22,
    marginTop: 20,
    textAlign: "center",
  },
  subtitle: {
    color: "#777777",
    width: 300,
    textAlign: "center",
    marginTop: 8,
  },
  loginButton: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  footer: {
    marginTop: 40,
    textAlign: "center",
  },
  linkText: {
    color: "#3A65FD",
    marginLeft: 10,
  },
});

export default LoginToContinue;
