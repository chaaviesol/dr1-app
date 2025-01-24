import { View, Text, StyleSheet } from "react-native";
import React from "react";
import TabBarButton from "./TabBarButton";
import * as Haptics from "expo-haptics";
import { Colors } from "../constants/Colors";
import { triggerHapticFeedback } from "../utils/utils";
const TabBar = ({ state, descriptors, navigation }) => {
  const greyColor = Colors.inActiveTabs; // Inactive color

  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        // Skip certain routes if needed
        if (["_sitemap", "+not-found"].includes(route.name)) return null;

        // Determine if the tab is focused
        const isFocused = state.index === index;

        // Function to handle tab press and navigate to the appropriate screen
        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // Navigate to the selected screen
            navigation.navigate(route.name, route.params);
          }
          triggerHapticFeedback(); //not work on web
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.name}
            style={styles.tabbarItem}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name}
            color={isFocused ? Colors.primary : greyColor}
            label={label}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 15,
    shadowColor: "black",
    shadowOffset: { width: 0, height: -10 },
    shadowRadius: 15, // Increased radius for smoother shadow
    shadowOpacity: 0.2, // Increased opacity for more visible shadow
    elevation: 5, // For Android (Shadow effect)
    borderTopColor: Colors.skeleton,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});

export default TabBar;
