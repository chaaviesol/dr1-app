import React from "react";
import { View } from "react-native";
import { Colors } from "../../constants/Colors";

const Skeleton = ({ height, width, borderRadius, theme }) => {
  return (
    //theme is used to change color based on dark mode,
    <View
      style={{
        height: height || "100%",
        width: width || "100%",
        borderRadius: borderRadius,
        backgroundColor: Colors.skeleton,
      }}
    />
  );
};

export default Skeleton;
