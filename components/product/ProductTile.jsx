import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "../../constants/Colors";
import CartControl from "./CartControl";
import apiInstance from "../../hooks/useAxiosPrivate";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import { usePharmacyContext } from "../../context/PharmacyContext";
import { debounce } from "lodash";
import PrimaryButton from "../PrimaryButton";
import { triggerHapticFeedback } from "../../utils/utils";

const ProductTile = ({ product, refetch, setCategoriesAndProducts }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { authState } = useAuth();
  const { fetchCart } = usePharmacyContext();
  // const { cart, setCart, fetchCart } = usePharamacyCart();
  const router = useRouter();

  // Update local state when quantity changes
  const updateProductQuantityInState = (
    productId,
    quantity,
    inCart = false
  ) => {
    setCategoriesAndProducts((prev) => {
      return prev.map((category) => ({
        ...category,
        products: category.products.map((product) =>
          product.id === productId ? { ...product, quantity, inCart } : product
        ),
      }));
    });
  };

  // Handle adding a product to the cart
  const handleAddToCart = async (e, prodId) => {
    if (!authState.token) {
      router.push("/login");
      return;
    }
    triggerHapticFeedback(); //not work on web
    setIsLoading(true);
    try {
      const quantity = 1;
      const data = { prod_id: prodId, quantity };

      // Update local state first
      updateProductQuantityInState(prodId, quantity, true);

      // Call the API to add the product to the cart
      await apiInstance.post("/pharmacy/addToCart", data);

      // Fetch updated cart and refetch product data
      fetchCart();
      // refetch();
    } catch (err) {
      console.error(err.response);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle updating the product quantity in the cart
  const updateCount = async (currentQuantity, variant, productId) => {
    if (currentQuantity === 1 && variant === "decrease") {
      handleRemoveFromCart(productId);
      return;
    }

    const newQuantity =
      variant === "increase" ? currentQuantity + 1 : currentQuantity - 1;

    // Update local state immediately
    updateProductQuantityInState(productId, newQuantity, true);

    // Call API to update the cart
    debouncedUpdateCart(productId, newQuantity);
  };

  const debouncedUpdateCart = debounce(async (productId, quantity) => {
    try {
      const data = { prod_id: productId, quantity };
      await apiInstance.post("/pharmacy/addToCart", data);
    } catch (err) {
      console.error(err.response);
    }
  }, 500);

  // Handle removing a product from the cart
  const handleRemoveFromCart = async (productId) => {
    updateProductQuantityInState(productId, 0, false);

    try {
      const data = { prod_id: productId };
      await apiInstance.post("/pharmacy/removeFromCart", data);
      fetchCart();
    } catch (err) {
      console.error(err.response);
    }
  };

  const handleProductDetailedRoute = (dta) => {
    router.push({
      pathname: "/screens/pharmacy/product/productdetailed",
      params: { product: JSON.stringify(dta) }, // pass as string
    });
  };
  return (
    <View key={product?.id} style={styles.productTile}>
      {/* Product Image */}
      <TouchableOpacity
        onPress={() => handleProductDetailedRoute(product)}
        style={styles.productImage}
      >
        <Image
          source={{ uri: product?.images?.image1 }}
          style={styles.productImageImg}
        />
      </TouchableOpacity>

      {/* Product Info */}
      <TouchableOpacity style={styles.productInfo}>
        <Text style={styles.productBrandName}>{product?.brand}</Text>
        <Text style={styles.productName}>
          {product?.name?.length > 18
            ? `${product.name.slice(0, 18)}...`
            : product.name}
        </Text>
      </TouchableOpacity>

      {/* Product Price and Cart Control */}
      <View style={styles.priceAndCartContainer}>
        <View style={styles.productPriceContainer}>
          <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            {/* <Text
              style={[
                styles.productPrice,
                { textDecorationLine: "line-through" },
              ]}
            >
              {" "}
              ₹ {product?.mrp}
            </Text> */}
            <Text style={styles.productPrice}>₹ {product?.mrp}</Text>
          </View>
          {/* <Text style={styles.productPrice}>₹ {product?.mrp}</Text> */}
        </View>
        <View styles={styles.cartControl}>
          {product?.inCart ? (
            <CartControl product={product} updateCount={updateCount} />
          ) : (
            <View
              style={{
                height: 25,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PrimaryButton
                onPress={(event) => handleAddToCart(event, product.id)}
                title="Add"
                rounded="lg"
              />
            </View>
          )}
        </View>
        {/* Conditionally render CartControl or Add Button */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  productTile: {
    backgroundColor: Colors.whiteBackground,
    flexDirection: "column",
    width: "50%",
    alignItems: "center",
    justifyContent: "space-between",
    borderRightWidth: 0.5,
    borderRightColor: "rgba(0, 0, 0, 0.12)",
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0, 0, 0, 0.12)",
    padding: 10,
    gap: 10,
    height: 220,
  },
  productImage: {
    height: 100,
    width: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  productImageImg: {
    height: "100%",
    width: "90%",
    resizeMode: "contain",
  },
  productInfo: {
    flexDirection: "column",
    alignItems: "flex-start",
    height: 40,
    width: "100%",
  },
  productBrandName: {
    paddingVertical: 2,
    fontSize: 11,
    fontWeight: "500",
    color: "rgba(0, 0, 0, 0.49)",
  },
  productName: {
    fontSize: 11,
    fontWeight: "600",
  },
  productPrice: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(0, 0, 0, 1)",
  },
  priceAndCartContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingTop: 10,
  },
  productPriceContainer: {
    width: "40%",
  },
  cartControl: {
    width: "60%",
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 20,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default ProductTile;
