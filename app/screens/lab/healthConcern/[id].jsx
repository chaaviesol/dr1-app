import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { fetchSinglePackage } from "../../../../api/labApis";
import { useQuery } from "@tanstack/react-query";
import PrimaryButton from "../../../../components/PrimaryButton";
import Loader from "../../../../components/Loader";
import { Colors } from "../../../../constants/Colors";
import HomeOrCentre from "../../../../components/lab/HomeOrCentre";
import useLabCart from "../../../../hooks/useLabCart";
import { useAuth } from "../../../../context/AuthContext";

const Page = () => {
  const {
    addToCartMutation,
    handleAddToCart,
    handleRemoveFromCart,
    removeFromCartMutation,
  } = useLabCart();
  const { authState } = useAuth();
  const { token } = authState;
  const { id } = useLocalSearchParams();
  const { data: packageDetailed, isFetching: isPackageFetching } = useQuery({
    queryKey: ["singleLabPackage"],
    queryFn: () => fetchSinglePackage(id, token),
  });
  if (isPackageFetching) {
    return <Loader />;
  }
  return (
    <View style={styles.container}>
      <View style={styles.details}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              textTransform: "capitalize",
              fontWeight: 700,
            }}
          >
            {"Cancer Tests" || packageDetailed?.package_name}
          </Text>
          <HomeOrCentre isHomeCollection={packageDetailed?.home_collection} />
        </View>
        <Text style={{ fontSize: 20, fontWeight: 700 }}>
          ₹ {packageDetailed?.price}
        </Text>
        <View style={{ marginTop: 18 }}>
          <Text>{packageDetailed?.about}</Text>
        </View>
        {/* <View style={styles.scrollContainer}>
          <View style={styles.item}>
            <Text style={{ textTransform: "capitalize" }}>
              {packageDetailed?.age_group}
            </Text>
          </View>
        </View> */}
        <View style={{ marginTop: 20 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 15,
              }}
            >
              Tests
            </Text>
            <Text style={{ color: "#FF8440" }}>
              {packageDetailed?.tests.length} Tests
            </Text>
          </View>
          {/* tests section  */}
          <View style={styles.testsSection}>
            <FlatList
              data={packageDetailed.tests}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.itemContainer}
                  onPress={() => {
                    router.push(`/screens/lab/test/${item.id}`);
                  }}
                >
                  <Text
                    style={{
                      textTransform: "capitalize",
                      marginBottom: 6,
                      fontWeight: 500,
                      fontSize: 17,
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      fontWeight: 500,
                      fontSize: 14,
                    }}
                  >
                    {" "}
                    ₹ {item.mrp}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
              horizontal={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </View>
      {packageDetailed.incart ? (
        <PrimaryButton
          title={
            removeFromCartMutation.isPending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              "Remove"
            )
          }
          rounded="lg"
          height={40}
          backgroundColor={Colors.errorText}
          disabled={removeFromCartMutation.isPending}
          // onPress={() => {
          //   handleRemoveFromCart(packageDetailed?.test_number);
          // }}
        />
      ) : (
        <PrimaryButton
          title={
            addToCartMutation.isPending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              "Add"
            )
          }
          rounded="lg"
          height={40}
          disabled={addToCartMutation.isPending}
          // onPress={() => {
          //   handleAddToCart(packageDetailed?.test_number);
          // }}
        />
      )}
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 15,
    paddingBottom: 15,
    display: "flex",
    justifyContent: "space-between",
  },
  details: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    padding: 15,
  },
  scrollContainer: {
    marginTop: 20,
  },
  item: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    padding: 5,
    width: 100,
    backgroundColor: Colors.backgroundTwo,
  },
  itemContainer: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: Colors.backgroundTwo,
  },
  testsSection: {
    marginTop: 10,
  },
});
