import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { BASE_URL } from "../../../../config";
import { Colors } from "../../../../constants/Colors";
import ProductTile from "../../../../components/product/ProductTile";
import apiInstance from "../../../../hooks/useAxiosPrivate";
import { useAuth } from "../../../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import PressableCartIcon from "../../../../components/PressableCartIcon";
import Skeleton from "../../../../components/ui/Skeleton";
import SearchInput from "../../../../components/SearchInput";

export default function productList() {
  const { id } = useLocalSearchParams();
  const [selectedCategoryId, setSelectedCategoryId] = useState(parseInt(id));
  const [categoriesAndProducts, setCategoriesAndProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isListFetching, setIsListFetching] = useState(true);
  const { authState } = useAuth();

  const handleSearchChange = (text) => {
    setSearchQuery(text);
  };
  //function which return products based on the search query
  const filterProductsBasedOnQuery = () => {
    const clonedData = productsToBeDisplayed();
    const filteredProducts = clonedData.filter(
      (product) =>
        (product.name &&
          product.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.brand &&
          product.brand.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    return filteredProducts;
  };
  //function which return products based on the selected category
  const productsToBeDisplayed = () => {
    return categoriesAndProducts.find(
      (category) => category.id === selectedCategoryId
    )?.products;
  };
  //fetch category and product data
  const fetchCategoryAndProducts = async () => {
    try {
      let response;
      if (authState.token) {
        // Check if the user is authenticated
        response = await apiInstance.get("/product/productsApp"); // Fetch products for authenticated users
      } else {
        response = await axios.get(`${BASE_URL}/product/products`); // Fetch products for unauthenticated users
      }
      console.log(response.data.data);
      setCategoriesAndProducts(response.data.data);
    } catch (err) {
    } finally {
      setIsListFetching(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchCategoryAndProducts();
    }, [authState.token])
  );

  const renderCategory = ({ item }) =>
    isListFetching ? (
      <CategorySkeleton item={item} />
    ) : (
      <TouchableOpacity
        style={[styles.categoryItem]}
        onPress={() => setSelectedCategoryId(item.id)}
      >
        <View
          style={
            item.id === selectedCategoryId
              ? styles.selectedCategory
              : styles.imageWrapper
          }
        >
          <Image
            style={styles.categoryItemImage}
            source={{ uri: item.categoryImage }}
            resizeMode="contain"
          />
        </View>
        <Text
          style={[
            styles.categoryText,
            item.id === selectedCategoryId && styles.selectedCategoryText,
          ]}
          numberOfLines={2}
        >
          {item.categoryName}
        </Text>
      </TouchableOpacity>
    );

  const renderProduct = ({ item }) =>
    isListFetching ? (
      <ProductSkeleton item={item} />
    ) : (
      <ProductTile
        refetch={fetchCategoryAndProducts}
        product={item}
        setCategoriesAndProducts={setCategoriesAndProducts}
      />
    );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity>
          <Ionicons
            name="arrow-back"
            size={24}
            color="black"
            onPress={() => router.back()}
          />
        </TouchableOpacity>
        <View style={styles.searchBoxWrapper}>
          <SearchInput onChangeText={handleSearchChange} value={searchQuery} />
        </View>
        <View style={{ height: 45, width: 45 }}>
          <PressableCartIcon />
        </View>
      </View>

      <View style={styles.productsContainer}>
        <View style={styles.sidebar}>
          <FlatList
            data={
              isListFetching
                ? [
                    { id: "tempCategoryId1" },
                    { id: "tempCategoryId2" },
                    { id: "tempCategoryId3" },
                    { id: "tempCategoryId4" },
                    { id: "tempCategoryId5" },
                    { id: "tempCategoryId6" },
                  ]
                : categoriesAndProducts
            }
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            horizontal={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
        <View style={styles.productListContainer}>
          <FlatList
            data={
              isListFetching
                ? [
                    { id: "tempId1" },
                    { id: "tempId2" },
                    { id: "tempId3" },
                    { id: "tempId4" },
                    { id: "tempId5" },
                    { id: "tempId6" },
                    { id: "tempId7" },
                    { id: "tempId8" },
                  ]
                : searchQuery.length > 0
                ? filterProductsBasedOnQuery()
                : productsToBeDisplayed()
            }
            renderItem={renderProduct}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBoxWrapper: {
    height: "100%",
    width: "80%",
  },
  backButtonContainer: {
    height: 45,
    marginTop: 5,
    marginBottom: 5,
    paddingHorizontal: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 6,
  },
  productsContainer: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: Colors.backgroundTwo,
  },
  sidebar: {
    width: 80,
    backgroundColor: Colors.whiteBackground,
    padding: 10,
    marginRight: 4,
    marginTop: 4,
    display: "flex",
    justifyContent: "center",
    // borderRadius:10
  },
  categoryItem: {
    // borderWidth:1,
    // borderColor:"red",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 100,
    marginVertical: 10,
  },
  categoryItemImage: {
    height: "100%",
    width: "100%",
  },
  selectedCategory: {
    backgroundColor: "#EDEDED",
    borderRadius: 10,
    height: 70,
    width: 60,
    padding: 10,
    borderColor: "#A8A196",
    borderWidth: 0.5,
  },
  imageWrapper: {
    height: 70,
    width: 60,
    padding: 10,
  },
  categoryText: {
    fontSize: 10,
    marginTop: 5,
    textTransform: "capitalize",
  },
  selectedCategoryText: {
    fontWeight: "bold",
    color: "#000",
  },
  productListContainer: {
    flex: 1,

    backgroundColor: Colors.whiteBackground,
    marginTop: 4,
  },
});

const ProductSkeleton = ({ item }) => {
  return (
    <View
      key={item}
      style={{
        width: "50%",
        height: 220,
        justifyContent: "center",
        borderRightWidth: 0.5,
        borderRightColor: "rgba(0, 0, 0, 0.12)",
        borderBottomWidth: 0.5,
        borderBottomColor: "rgba(0, 0, 0, 0.12)",
        alignItems: "center",
      }}
    >
      <Skeleton height={70} width="40%" borderRadius={10} />
      <View style={{ height: 15 }} />
      <View style={{ width: "100%", paddingLeft: 10 }}>
        <Skeleton height={5} width="30%" borderRadius={10} />
      </View>
      <View style={{ height: 5 }} />
      <View style={{ width: "100%", paddingLeft: 10 }}>
        <Skeleton height={9} width="50%" borderRadius={10} />
      </View>

      <View style={{ width: "100%", paddingLeft: 10, marginTop: 40 }}>
        <Skeleton height={10} width="80%" borderRadius={10} />
      </View>
    </View>
  );
};

const CategorySkeleton = ({ item }) => {
  return (
    <View
      key={item}
      style={{
        width: "100%",
        height: 100,
        justifyContent: "center",
        marginVertical: 10,
        alignItems: "center",
      }}
    >
      <Skeleton height={50} width="80%" borderRadius={10} />
      <View style={{ height: 15 }} />
      <View style={{ width: "100%", paddingLeft: 10 }}>
        <Skeleton height={10} width="80%" borderRadius={10} />
      </View>
    </View>
  );
};
