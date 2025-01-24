import { View, Text, Pressable, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { icons } from '../assets/icons';  // Ensure this import points to your correct icons file
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const TabBarButton = (props) => {
  const { isFocused, label, routeName, color } = props;

  const scale = useSharedValue(0);
  const opacity = useSharedValue(1); // Add a shared value for opacity

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0, { duration: 350 });
    opacity.value = withSpring(isFocused ? 1 : 0.5, { duration: 350 }); // Make opacity responsive to focus
  }, [isFocused, scale, opacity]);

  // Animated icon style
  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1]);
    return {
      transform: [{ scale: scaleValue }],
    };
  });

  // Animated text style with opacity
  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value, // Use opacity animation
    };
  });

  // Check if the icon exists for the routeName, otherwise render a fallback icon
  const Icon = icons[routeName] || (() => <Text>No Icon</Text>);

  return (
    <Pressable {...props} style={styles.container}>
      <Animated.View style={[animatedIconStyle]}>
        <Icon color={color} />
      </Animated.View>

      <Animated.Text style={[{ color, fontSize: 11,textTransform:"capitalize"}, animatedTextStyle]}>
        {label}
      </Animated.Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    
  },
});

export default TabBarButton;
