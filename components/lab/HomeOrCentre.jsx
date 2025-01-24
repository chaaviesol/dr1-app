import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Entypo, Fontisto } from "@expo/vector-icons";

const HomeOrCentre = ({ isHomeCollection }) => {
  return (
    <View
    
      style={[
        styles.container,
        {
          backgroundColor: isHomeCollection ? "#f293391a" : "#dcfce7",
        },
      ]}
    >
      <Text style={{ color: isHomeCollection ? "#d97706" : "#047857",fontSize:16,fontWeight:400 }}>
        {isHomeCollection ? (
          <Entypo name="home" size={18} />
        ) : (
          <Entypo name="lab-flask" size={18} />
        )}
        <View style={{ width: 5 }} />

        {isHomeCollection ? "Home" : "Centre"}
      </Text>
    </View>
  );
};

export default HomeOrCentre;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
});
