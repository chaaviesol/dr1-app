import { FlatList, StyleSheet, Text, View, Image, Button } from "react-native";
import React, { useCallback } from "react";
import { debounce } from "lodash";
import usePharamacyCart from "../../../../../hooks/usePharamacyCart";
import { useAuth } from "../../../../../context/AuthContext";
import apiInstance from "../../../../../hooks/useAxiosPrivate";
import { Colors } from "../../../../../constants/Colors";
import CartFooter from "../../../../../components/product/CartFooter";
import Skeleton from "../../../../../components/ui/Skeleton";
import { router, useFocusEffect } from "expo-router";
import CartItemTile from "../../../../../components/product/CartItemTile";

export default function Page() {
  const { cart, setCart, fetchCart, isLoading } = usePharamacyCart();
  const { authState } = useAuth();
  const updateCount = async (currentQuantity, variant, productId) => {
    if (currentQuantity === 1 && variant === "decrease") {
      handleRemoveFromCart(productId);
      return;
    }
    const newQuantity =
      variant === "increase"
        ? parseInt(currentQuantity) + 1
        : parseInt(currentQuantity) - 1;

    const currentProductIndex = cart.findIndex(
      (item) => item.product_id === productId
    );

    // Proceed only if the product exists in cart
    if (currentProductIndex === -1) return;

    // Optimistically update cart items in local state
    setCart((prevCartItems) =>
      prevCartItems.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );

    debouncedUpdateCart(productId, newQuantity);
  };
  const debouncedUpdateCart = debounce(async (productId, quantity) => {
    try {
      const data = {
        prod_id: productId,
        quantity,
      };
      await apiInstance.post("/pharmacy/addToCart", data);
    } catch (err) {
      console.error(err.response);
    } finally {
    }
  }, 500);

  const handleRemoveFromCart = async (productId) => {
    setCart((prev) => prev.filter((ele) => ele.product_id !== productId));

    try {
      const data = {
        prod_id: productId,
      };
      await apiInstance.post("/pharmacy/removeFromCart", data);
      fetchCart();
    } catch (err) {
      console.error(err.response);
    } finally {
    }
  };
  useFocusEffect(
    useCallback(() => {
      if (authState.token) {
        fetchCart(); // Fetch cart when screen is focused
      } else {
        setCart([]); // Reset cart when user is not authenticated;
      }
    }, [fetchCart, authState.token])
  );

  const renderCartItemTile = ({ item, index }) =>
    isLoading ? (
      <CartItemTileSkeleton key={item} />
    ) : (
      <CartItemTile product={item} index={index} updateCount={updateCount} />
    );

  if (cart.length === 0 && !isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyCart}>
          <Image
            style={styles.emptyCartImg}
            source={require("../../../../../assets/images/empty-cart.png")}
          />
        </View>
      </View>
    );
  }

  const totalPrice = () => {
    if (cart && cart.length > 0) {
      const totalMRP = cart.reduce((accumulator, product) => {
        return accumulator + product.mrp * product.quantity;
      }, 0);
      return totalMRP;
    } else {
      return 0;
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={
          isLoading
            ? [
                { product_id: "tempProduct_id1" },
                { product_id: "tempProduct_id2" },
                { product_id: "tempProduct_id3" },
                { product_id: "tempProduct_id4" },
                { product_id: "tempProduct_id5" },
              ]
            : cart
        }
        renderItem={renderCartItemTile}
        keyExtractor={(item) => item.product_id}
        horizontal={false}
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
      />

      <CartFooter
        cartItems={cart}
        totalPrice={totalPrice}
        disabled={isLoading}
        onPress={async () => {
          try {
            await fetchCart();
            if (cart && cart.length > 0) {
              router.push(
                "/screens/(authenticated)/pharmacyscreens/cart/checkout"
              );
            }
          } catch (error) {
            console.error("Error fetching cart:", error);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    paddingHorizontal: 15,
    paddingBottom: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCart: {
    height: 210,
    width: 210,
  },
  emptyCartImg: {
    height: "100%",
    width: "100%",
    resizeMode: "contain",
  },
});

const CartItemTileSkeleton = ({ item }) => {
  return (
    <View
      key={item}
      style={{
        height: 100,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 0.5,
        borderColor: Colors.inActiveTabs,
        borderRadius: 17,
        marginVertical: 10,
        padding: 20,
        backgroundColor: "white",
      }}
    >
      <View
        style={{ width: "30%", display: "flex", flexDirection: "row", gap: 30 }}
      >
        <Skeleton height={50} width="50%" borderRadius={10} />
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            justifyContent: "space-around",
          }}
        >
          <Skeleton height={10} width="100%" borderRadius={10} />
          <Skeleton height={10} width="40%" borderRadius={10} />
        </View>
      </View>
      <Skeleton height={10} width="20%" borderRadius={10} />
    </View>
  );
};
