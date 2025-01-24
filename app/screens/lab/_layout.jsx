import { Stack, Link, useRouter } from "expo-router";

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
        name="allLabTests"
        options={{
          headerShown: true,
          title: "All Tests",
        }}
      />
      <Stack.Screen
        name="allPackages"
        options={{
          headerShown: true,
          title: "All Packages",
        }}
      />
         <Stack.Screen
        name="healthConcern/[id]"
        options={{
          headerShown: true,
          title: "",
        }}
      />
      <Stack.Screen
        name="test/[id]"
        options={{
          headerShown: true,
          title: "Test Details",
        }}
      />
      <Stack.Screen
        name="package/[id]"
        options={{
          headerShown: true,
          title: "Package Details",
        }}
      />
    </Stack>
  );
};

export default Layout;
