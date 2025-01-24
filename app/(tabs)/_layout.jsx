import { router, Tabs } from "expo-router";
import TabBar from "../../components/TabBar";
import { StyleSheet, TouchableHighlight, TouchableOpacity, View } from "react-native";
import PressToSearch from "../../components/PressToSearch";
import PressableLabCartIcon from "../../components/lab/PressableLabCartIcon";
import PressableCartIcon from "../../components/PressableCartIcon";

export default () => {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="labs"
        options={{
          headerShown: true,
          headerShadowVisible: false,
          headerTitle: "",

          headerLeftContainerStyle: {
            paddingHorizontal: 15,
          },
          headerRightContainerStyle: {
            paddingHorizontal: 15,
          },

          headerLeft: () => (
            <View style={styles.searchContainer}>
              <PressToSearch />
            </View>
          ),
          headerRight: () => (
            <View style={{ width: 45, height: 45 }}>
              <PressableLabCartIcon />
            </View>
          ),
        }}
        // listeners={{
        //   tabPress: (e) => {
        //     e.preventDefault();
        //     router.push("/(modal)/create");
        //   },
        // }}
      />
      <Tabs.Screen
        name="pharmacy"
        options={{
          headerShown: true,
          headerShadowVisible: false,
          headerTitle: "",

          headerLeftContainerStyle: {
            paddingHorizontal: 15,
          },
          headerRightContainerStyle: {
            paddingHorizontal: 15,
          },

          headerLeft: () => (
            <View style={styles.searchContainer}>
              <TouchableOpacity
                style={{ width: "100%" }}
                onPress={() => {
                  router.push({
                    pathname: "/screens/pharmacy/product",
                    params: { id: 1 },
                  });
                }}
              >
                <PressToSearch />
              </TouchableOpacity>
            </View>
          ),
          headerRight: () => (
            <View style={{ width: 45, height: 45 }}>
              <PressableCartIcon />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "Profile",
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "90%", // Adjust width to fit your search bar
    height: 45,
  },
});
