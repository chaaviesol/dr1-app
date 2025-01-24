import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchSingleTest } from "../../../../api/labApis";
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
  const { data: testDetailed, isFetching: isTestFetching } = useQuery({
    queryKey: ["singleTest"],
    queryFn: () => fetchSingleTest(id, token),
  });
  if (isTestFetching) {
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
            {testDetailed?.name}
          </Text>
          <HomeOrCentre isHomeCollection={testDetailed?.home_collection} />
        </View>
        <Text style={{ fontSize: 18, fontWeight: 700 }}>
          ₹ {testDetailed?.mrp}
        </Text>
        <View style={{ marginTop: 20 }}>
          <Text>{testDetailed?.description}</Text>
        </View>
        {/* <View style={styles.scrollContainer}>
          <View style={styles.item}>
            <Text style={{ textTransform: "capitalize" }}>
              {testDetailed?.age_group}
            </Text>
          </View>
        </View> */}
      </View>
      {testDetailed?.incart ? (
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
          onPress={() => {
            handleRemoveFromCart(testDetailed.test_number);
          }}
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
          onPress={() => {
            handleAddToCart(testDetailed?.test_number);
          }}
        />
      )}
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingBottom: 15,
    paddingTop: 10,
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
});
