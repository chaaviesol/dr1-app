import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import BookTestItem from "../../../components/lab/BookTestItem";
import { useQuery } from "@tanstack/react-query";
import { fetchLabTests } from "../../../api/labApis";
import { Colors } from "../../../constants/Colors";
import { useAuth } from "../../../context/AuthContext";
import Loader from "../../../components/Loader";
import { PopularTestsSkeleton } from "../../(tabs)/labs";

const Page = () => {
  const { authState } = useAuth();
  const {
    data: labTests,
    isFetching: isTestsFetching,
    refetch: refetchTests,
  } = useQuery({
    queryKey: ["labtestsfull"],
    queryFn: () => fetchLabTests(false, authState.token),
  });
  if (isTestsFetching) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* <View style={styles.filterSection}>
          <Text>Filter section</Text>
        </View> */}
        <View
          style={[
            styles.testContainer,
            {
              width: "100%",
            },
          ]}
        >
          <PopularTestsSkeleton />
          <PopularTestsSkeleton />
          <PopularTestsSkeleton />
          <PopularTestsSkeleton />
        </View>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      {/* <View style={styles.filterSection}>
        <Text>Filter section</Text>
      </View> */}
      <View style={styles.testContainer}>
        <FlatList
          data={labTests}
          renderItem={({ item }) => (
            <BookTestItem
              key={item.id}
              name={item?.name}
              price={item?.mrp}
              test_number={item.test_number}
              incart={item?.incart || false}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          horizontal={false}
          showsHorizontalScrollIndicator={false}
        />
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
  testContainer: {
    flex: 1,
    padding: 15,
  },
});
