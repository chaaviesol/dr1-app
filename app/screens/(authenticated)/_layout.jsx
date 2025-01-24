import { Stack } from "expo-router";
import { Colors } from "../../../constants/Colors";

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,

        contentStyle: { backgroundColor: "white" },
      }}
    >
      <Stack.Screen
        name="editProfile"
        options={{
          headerShown: true,
          // headerStyle: {
          //   backgroundColor: Colors.lightGreyBg,
          // },
          // headerTintColor: "black", // Change header text color
          // headerShown: true,
          // cardStyle: { backgroundColor: Colors.lightGreyBg },
          // statusBarStyle: "dark", // Change background color of screen,
          // statusBarBackgroundColor: Colors.lightGreyBg,
          title: "Edit profile",
        }}
      />
       <Stack.Screen
        name="forgotPassword"
        options={{
          headerShown: true,
          title: "Update Password",
        }}
      />
      <Stack.Screen
        name="pharmacyscreens/cart/index"
        options={{
          headerShown: true, // Show header for cart screen
          title: "Cart",
        }}
      />
      <Stack.Screen
        name="pharmacyscreens/cart/checkout"
        options={{
          headerShown: true, // Show header for cart screen
          title: "Checkout",
        }}
      />
      <Stack.Screen
        name="pharmacyscreens/prescription/upload"
        options={{
          headerShown: true, // Show header for cart screen
          title: "Upload prescription",
        }}
      />
      <Stack.Screen
        name="pharmacyscreens/orders/myorders"
        options={{
          headerShown: true, // Show header for cart screen
          title: "My orders",
        }}
      />
      <Stack.Screen
        name="pharmacyscreens/orders/[id]"
        options={{
          headerShown: true, // Show header for cart screen
          title: "Track order",
        }}
      />
      <Stack.Screen
        name="labScreens/cart"
        options={{
          headerShown: true, // Show header for cart screen
          title: "My Cart",
        }}
      />
    </Stack>
  );
};

export default Layout;
