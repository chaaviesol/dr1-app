import React, { useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ScrollView,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";
import { useAuth } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../../api/pharmacyApis";
import Skeleton from "../../components/ui/Skeleton";

const Pharmacy = () => {
  const { authState } = useAuth();
  const router = useRouter();

  //route based on logged in or not
  const handleRoute = () => {
    const targetPath = authState.token
      ? "/screens/(authenticated)/pharmacyscreens/prescription/upload"
      : "/login";
    router.push({ pathname: targetPath });
  };

  const {
    data: marketplaceProducts,
    isFetching: isCategoryFetching,
    isLoading: isCategoryLoading,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ["fetchCategories"],
    queryFn: () => fetchCategories(),
  });

  // Fetch categories
  useFocusEffect(
    useCallback(() => {
      refetchCategories();
    }, [])
  );

  // Go to product list
  const handleSelectCategoryAndRoute = (id) => {
    router.push({
      pathname: "/screens/pharmacy/product",
      params: { id: parseInt(id) },
    });
  };
  // Render item for FlatList
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleSelectCategoryAndRoute(item.id)}
      style={styles.categoryBox}
    >
      <View style={styles.categoryImg}>
        <Image source={{ uri: item?.image }} style={styles.productImage} />
      </View>
      <View style={styles.pharmacyshopproducttitle}>
        <Text style={styles.productTitle} numberOfLines={2}>
          {item?.category}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 15 }}
      >
        <View style={styles.uploadPrescriptionSection}>
          <View style={styles.uploadPrescriptionLeft}>
            <View>
              <Text style={styles.header}>Get Your Medicine</Text>
              <Text style={styles.header}>At Home</Text>
            </View>

            <View style={styles.features}>
              <FeatureItem icon="📅" text="Fast Delivery" />
              <FeatureItem icon="💵" text="Cash On Delivery" />
            </View>

            <TouchableOpacity style={styles.uploadButton} onPress={handleRoute}>
              <Text style={styles.uploadButtonText}>Upload Prescription</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.uploadPrescriptionRight}>
            <Image
              source={require("../../assets/images/pre.png")}
              style={styles.image}
            />
          </View>
        </View>

        <Text style={styles.shopTitleText}>Explore Our Shop</Text>

        {isCategoryLoading ? (
          <>
            <CategorySkeleton />
            <CategorySkeleton />
            <CategorySkeleton />
          </>
        ) : (
          <FlatList
            scrollEnabled={false}
            data={marketplaceProducts}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2} // To display categories in two columns
            contentContainerStyle={styles.categoryContainer}
            horizontal={false}
            showsVerticalScrollIndicator={false}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.whiteBackground,
  },
  safeArea: {
    flex: 1,
    // paddingTop: 15,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
  },
  uploadPrescriptionSection: {
    height: 230,
    backgroundColor: "rgb(42, 60, 168)",
    borderRadius: 8,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  uploadPrescriptionLeft: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  features: {
    marginTop: 10,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  icon: {
    fontSize: 16,
    fontWeight: "100",
    color: "white",
    marginRight: 8,
  },
  featureText: {
    fontSize: 12,
    color: "white",
  },
  uploadButton: {
    borderRadius: 25,
    backgroundColor: "transparent",
    borderWidth: 0.5,
    borderColor: "white",
    alignItems: "center",
    padding: 5,
    width: 150,
  },
  uploadButtonText: {
    color: "white",
    fontSize: 12,
  },
  uploadPrescriptionRight: {
    width: "35%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: "70%",
    resizeMode: "contain",
  },
  shopTitleText: {
    fontSize: 20,
    fontWeight: "semibold",
    marginTop: 20,
  },
  categoryContainer: {
    marginTop: 20,
  },
  categoryBox: {
    flexDirection: "row-reverse",
    backgroundColor: Colors.backgroundTwo,
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    height: 110,
    marginBottom: 20,
    width: "48%", // Adjust width to 48% to fit two items per row with space between
    marginHorizontal: "1%",
  },
  categoryImg: {
    height: 100,
    width: "55%",
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  pharmacyshopproducttitle: {
    justifyContent: "center",
    height: "70%",
    width: "45%",
  },
  productTitle: {
    fontSize: 12,
    textTransform: "capitalize",
  },
});

export default Pharmacy;

const FeatureItem = ({ icon, text }) => (
  <View style={styles.feature}>
    <Text style={styles.icon}>{icon}</Text>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const CategorySkeleton = ({ i }) => {
  return (
    <View
      style={{
        marginTop: 20,
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
      }}
    >
      {[1, 2].map((i) => (
        <View
          key={i}
          style={{
            display: "flex",
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "space-around",
            flexDirection: "row",
            width: "48%",
            height: 110,
            borderWidth: 1,
            borderColor: Colors.skeleton,
            marginHorizontal: "1%",
          }}
        >
          <View
            style={{
              width: "42%",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <Skeleton height={7} width="100%" borderRadius={8} />
            <Skeleton height={7} width="60%" borderRadius={8} />
          </View>

          <Skeleton height={60} width={60} borderRadius={15} />
        </View>
      ))}
    </View>
  );
};
