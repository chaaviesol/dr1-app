import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
const { width } = Dimensions.get("window");

const home = () => {
  return (
    <SafeAreaView
      style={{
        backgroundColor: "white",
        flex: 1,
        padding: 5,
        justifyContent: "center",
      }}
    >
      {/* <ScrollView
        horizontal={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 12 }}
      >
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={{
              width: "100%",
              height: 210,
              backgroundColor: "rgba(120,120,128,0.12)",
              marginVertical: 4,
              borderRadius: 8,
            }}
          />
        ))}
      </ScrollView> */}
      <Text style={{textAlign:"center",fontSize:20}}>Coming Soon</Text>
    </SafeAreaView>
  );
};

export default home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
