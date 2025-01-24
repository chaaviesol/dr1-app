import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import CartControl from "./CartControl";
import { Colors } from "../../constants/Colors";

const CartItemTile = ({ product, isSelected, updateCount }) => {
  return (
    <View
      key={product.product_id}
      style={[styles.cartItemTile, isSelected && styles.selected]}
      activeOpacity={0.9}
    >
      <View style={styles.productImageWrap}>
        <View style={styles.cartItemImage}>
          <Image
            source={{ uri: product?.images?.image1 }}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {product?.product_name}
          </Text>
          <Text style={styles.productPrice}>₹ {product?.mrp}</Text>
        </View>
      </View>
      <View style={styles.countControls}>
        <CartControl product={product} updateCount={updateCount} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartItemTile: {
    height: 100,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 0.5,
    borderColor: Colors.inActiveTabs,
    borderRadius: 17,
    padding: 20,
    marginVertical: 10,
    backgroundColor: "white",
  },
  selected: {
    borderColor: "rgba(58, 101, 253, 1)",
    backgroundColor: "#f0f8ff",
  },
  productImageWrap: {
    height: "100%",
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10,
  },
  cartItemImage: {
    marginRight: 10,
    height: "100%",
    width: "25%",
  },
  productImage: {
    height: "100%",
    width: "100%",
    borderRadius: 10,
  },
  productInfo: {
    justifyContent: "center",
    flex: 1,
  },
  productName: {
    margin: 0,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: "black",
  },
  productPrice: {
    marginTop: 12,
    fontSize: 14,
    color: "rgba(124, 124, 124, 1)",
    fontWeight: "700",
    lineHeight: 13,
    letterSpacing: -0.41,
  },
  countControls: {
    flex: 1,
  },
});

export default CartItemTile;
