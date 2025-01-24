import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { Colors } from "../../../../../constants/Colors";

const Page = () => {
  const { id } = useLocalSearchParams();
  return (
    <View style={styles.container}>
      <Text>Page</Text>
    </View>
  );
};

export default Page;
const styles = StyleSheet.create({
  container: {
    flex:1,
    padding: 15,
    backgroundColor:Colors.lightGreyBg
  },
});
