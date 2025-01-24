import React from "react";

import { useAuth } from "../../context/AuthContext";
import CustomerProfile from "../../components/ProfileTab";
import LoginToContinue from "../../components/loginToContinue";
import { ScrollView, StyleSheet } from "react-native";
const Profile = () => {
  const { authState } = useAuth();

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContainer}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      {authState.token!==null ? <CustomerProfile /> : <LoginToContinue />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1, // Ensures content inside ScrollView expands to fit the screen // This ensures the SafeAreaView covers the whole screen
    backgroundColor: "white",
    paddingHorizontal: 15,
  },
});

export default Profile;
