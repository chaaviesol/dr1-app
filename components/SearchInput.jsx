import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Colors } from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

export default function SearchInput({ placeholder, value, onChangeText }) {
  return (
    <View style={styles.container}>
      <View style={styles.icons}>
        <AntDesign name="search1" size={24} color={Colors.greyIcon} />
      </View>
      <View style={styles.search}>
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder || "Search..."}
          value={value}
          onChangeText={onChangeText}
          maxLength={20}
        />
      </View>
      <View
        style={[
          styles.icons,
          {
            paddingRight: 5,
          },
        ]}
      >
        <Ionicons
          name="close-circle"
          size={20}
          color={Colors.greyIcon}
          onPress={() => {
            onChangeText("");//clear query  state of the parent
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 0,
    position: "relative",
    padding: 5,
    display: "flex",
    flexDirection: "row",
    height: "100%",
    width: "100%",
    backgroundColor: Colors.backgroundTwo,
    borderRadius: 50,
    alignItems: "center",
  },
  icons: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 20,
  },
  icon: {
    fontSize: 20,
    color: "#999999",
  },
  search: {
    justifyContent: "space-between",
    display: "flex",
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
  },
  searchInput: {
    padding: 5,
  },
  searchIcon: {
    color: "#999999",
  },
});
