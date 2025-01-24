import { Stack, Link, useRouter } from "expo-router";
import { Button, TouchableOpacity } from "react-native";
import PressableCartIcon from "../../../../components/PressableCartIcon";
import { Colors } from "../../../../constants/Colors";

const Layout = () => {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: true,
          headerShadowVisible: false,

          contentStyle: { backgroundColor: "white" },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            title: null,
          }}
        />
        <Stack.Screen
          name="productdetailed"
          options={{
            title: null,
            headerStyle: {
              backgroundColor: Colors.lightGreyBg,
            },
            headerTintColor: "black", // Change header text color
            headerShown: true,
            cardStyle: { backgroundColor: Colors.lightGreyBg },
            statusBarStyle: "dark", // Change background color of screen,
            statusBarBackgroundColor: Colors.lightGreyBg,
          }}
        />
      </Stack>
    </>
  );
};

export default Layout;
