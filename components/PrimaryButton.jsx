import { Pressable, StyleSheet, Text } from "react-native";
import React, { useMemo } from "react";
import { Colors } from "../constants/Colors";

const darkenColor = (backgroundColor, factor = 0.2) => {
  const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  if (!colorRegex.test(backgroundColor)) {
    return backgroundColor; // Return the original backgroundColor if it's not in hex format
  }

  let colorHex = backgroundColor.slice(1); // Remove the "#" symbol
  if (colorHex.length === 3) {
    colorHex = colorHex
      .split("")
      .map((c) => c + c)
      .join("");
  }

  const r = parseInt(colorHex.substring(0, 2), 16);
  const g = parseInt(colorHex.substring(2, 4), 16);
  const b = parseInt(colorHex.substring(4, 6), 16);

  const newR = Math.max(0, Math.min(255, r - r * factor));
  const newG = Math.max(0, Math.min(255, g - g * factor));
  const newB = Math.max(0, Math.min(255, b - b * factor));

  return `#${Math.round(newR).toString(16).padStart(2, "0")}${Math.round(newG)
    .toString(16)
    .padStart(2, "0")}${Math.round(newB).toString(16).padStart(2, "0")}`;
};

const PrimaryButton = ({
  onPress,
  disabled,
  title,
  rounded = "md",
  backgroundColor = Colors.primary,
  height,
  width,
  textColor = Colors.whiteText,
  borderColor,
}) => {
  // Memoize the pressed backgroundColor calculation to optimize performance
  const pressedColor = useMemo(
    () => darkenColor(backgroundColor, 0.2),
    [backgroundColor]
  );

  const borderRadius = getBorderRadius(rounded);

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: pressed || disabled ? pressedColor : backgroundColor,
          borderRadius: borderRadius,
          borderWidth: borderColor && StyleSheet.hairlineWidth,
          borderColor: borderColor && borderColor,
          height: height ? height : 25,
          width: width && width,
          elevation: 2, // Elevation on Android
          shadowColor: "#000", // Shadow color for iOS
          shadowOffset: { width: 0, height: 2 }, // Vertical shadow displacement
          shadowOpacity: 0.25, // Shadow opacity for iOS
          shadowRadius: 3.5, // Shadow blur for iOS
        },
      ]}
    >
      <Text
        style={[
          styles.title,
          {
            color: textColor,
          },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

const getBorderRadius = (rounded) => {
  switch (rounded) {
    case "lg":
      return 26;
    case "md":
      return 10;
    case "sm":
      return 5;
    default:
      return 0;
  }
};

export default PrimaryButton;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
  },
});
