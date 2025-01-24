import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { fetchPackages } from "../../../api/labApis";
import { useQuery } from "@tanstack/react-query";
import TestPackage from "../../../components/lab/TestPackage";
import { Colors } from "../../../constants/Colors";
import { useAuth } from "../../../context/AuthContext";
import Loader from "../../../components/Loader";
import { PopularPackageSkeleton } from "../../(tabs)/labs";

const Page = () => {
  const { authState } = useAuth();
  const { token } = authState;
  const {
    data: packages,
    isFetching: packagesFetching,
    refetch: refetchPackages,
  } = useQuery({
    queryKey: ["allPackages"],
    queryFn: () => fetchPackages(false, token),
  });

  // if (packagesFetching) {
  //   return (
  //     <View
  //       style={{
  //         flex:1,
  //         justifyContent: "center",
  //         alignItems: "center",
  //       }}
  //     >
  //       <Loader />
  //     </View>
  //   );
  // }
  const Separator = () => <View style={styles.separator} />;
  return (
    <SafeAreaView style={styles.container}>
      {/* <View style={styles.filterSection}>
        <Text>Filter section</Text>
      </View> */}
      <View style={styles.packageContainer}>
        {packagesFetching ? (
          <View style={{ width: "100%" }}>
            <PopularPackageSkeleton />
            <View style={styles.separator} />
            <PopularPackageSkeleton />
            <View style={styles.separator} />
            <PopularPackageSkeleton />
          </View>
        ) : (
          <FlatList
            data={packages}
            renderItem={({ item }) => (
              <TestPackage
                title={item.package_name}
                description={item.about}
                labTests={item.testslength}
                price={item.price}
                test_number={item.test_number}
                incart={item?.incart || false}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            horizontal={false}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={Separator}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterSection: {
    height: 60,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 10,
  },
  separator: {
    height: 20, // gap between items
    backgroundColor: "transparent",
  },
  packageContainer: {
    flex: 1,
    padding: 15,
  },
});
