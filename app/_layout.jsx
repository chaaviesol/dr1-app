import { Stack } from "expo-router";

import { AuthProvider } from "../context/AuthContext";
import { PharmacyProvider } from "../context/PharmacyContext";
import { LabProvider } from "../context/LabContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
const InitialLayout = () => {
  // useFonts({
  //   'Gallant':require('../assets/fonts/Gallant Rounded Bold.otf')
  // })
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        statusBarStyle: "dark",
        contentStyle: {
          backgroundColor: "white",
        },
      }}
    >
      <Stack.Screen
        options={{ headerShown: false }}
        name="(tabs)"
      ></Stack.Screen>
      <Stack.Screen
        name="(modal)/create"
        options={{
          presentation: "modal",
          headerShown: true,
          title: "",
          headerShadowVisible: false,
        }}
      ></Stack.Screen>
    </Stack>
  );
};

const RootLayout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <AuthProvider>
            <LabProvider>
              <PharmacyProvider>
                <InitialLayout />
              </PharmacyProvider>
            </LabProvider>
          </AuthProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default RootLayout;
