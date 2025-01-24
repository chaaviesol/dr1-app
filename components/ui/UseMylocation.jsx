import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { BASE_URL } from "../../config";
import axios from "axios";
import PrimaryButton from "../PrimaryButton";
import { Colors } from "../../constants/Colors";

const UseMyLocation = ({ onLocationFetched }) => {
  const [gettingLocationLoading, setGettingLocationLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Function to get the current location
  const getLocation = async () => {
    setGettingLocationLoading(true);
    setErrorMsg(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        setGettingLocationLoading(false);
        return;
      }
      // Get current location coordinates
      const location = await Location.getCurrentPositionAsync({});
      fetchLocation(location.coords.latitude, location.coords.longitude);
    } catch (err) {
      setErrorMsg("Failed to get location");
      setGettingLocationLoading(false);
      console.error("Error getting location:", err);
    }
  };

  // Fetch location details from your API
  const fetchLocation = async (lat, lng) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/googlemap/getcurrentlocation`,
        {
          lat,
          lng,
        }
      );
      onLocationFetched(response.data);
    } catch (err) {
      setErrorMsg("Error fetching location data");
      console.error("Error fetching location:", err);
    } finally {
      setGettingLocationLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <PrimaryButton
        onPress={getLocation}
        disabled={gettingLocationLoading}
        title={
          gettingLocationLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <View
              style={{
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Text>
                <Ionicons
                  name="location"
                  size={20}
                  color="white"
                  style={styles.icon}
                />
              </Text>
              <Text style={{ marginLeft: 5, color: Colors.whiteText }}>
                Use my location
              </Text>
            </View>
          )
        }
        rounded="lg"
        width="100%"
        height={45}
        backgroundColor="#7e83ff"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 0,
  },
});

export default UseMyLocation;
