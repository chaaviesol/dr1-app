import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Colors } from "../../../../constants/Colors";
import { router, useLocalSearchParams } from "expo-router";
import Loader from "../../../../components/Loader";
import CartControl from "../../../../components/product/CartControl";
import { usePharmacyContext } from "../../../../context/PharmacyContext";
import apiInstance from "../../../../hooks/useAxiosPrivate";
import { debounce } from "lodash";
import { useAuth } from "../../../../context/AuthContext";
import PrimaryButton from "../../../../components/PrimaryButton";
import { triggerHapticFeedback } from "../../../../utils/utils";

const ProductPage = ({}) => {
  const { product } = useLocalSearchParams(); // Get the query parameter
  const [parsedProduct, setParsedProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState("image1");
  const [isLoading, setIsLoading] = useState(false);
  const { fetchCart } = usePharmacyContext();
  const { authState } = useAuth();

  useEffect(() => {
    if (product) {
      try {
        const parsed = JSON.parse(product);
        setParsedProduct(parsed); // Set the parsed product in state
      } catch (error) {
        console.error("Failed to parse product:", error);
      }
    }
  }, [product]);
  console.log(parsedProduct);
  // Destructure product data with fallback values
  const {
    name: productName = "Product Name not available",
    brand: productBrand = "Brand not available",
    description: productDescription = "No description available",
    mrp = "Price not available",
    selling_price = "Null",
    images = {},
    id: productId,
    inCart = false,
    quantity = 0,
  } = parsedProduct || {};

  // Get the array of image keys (e.g., image1, image2, image3)
  const imageKeys = Object.keys(images);
  const imagesArray = imageKeys.map((key) => images[key]);

  //update product in cart

  const updateProductQuantityInState = (
    productId,
    quantity,
    inCart = false
  ) => {
    setParsedProduct((prevProduct) => ({
      ...prevProduct,
      quantity,
      inCart,
    }));
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
      const data = { prod_id: prodId, quantity: 1 };

      // Update local state first
      updateProductQuantityInState(prodId, 1, true);

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

  if (!parsedProduct) {
    return <Loader />; // Or handle error state if needed
  }

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productPage}
      >
        <View style={styles.productDetails}>
          <View style={styles.productTitle}>
            <Text style={styles.productName}>{productName}</Text>
            <Text style={styles.productBrand}>{productBrand}</Text>
          </View>

          {/* Carousel */}
          <View style={styles.carouselContainer}>
            <Image
              source={{ uri: images[currentImage] }} // Show the current image
              style={styles.carouselImage}
            />
            <View style={styles.dotsContainer}>
              {/* Uncomment below when adding carousel dots functionality */}
              {imageKeys.map((key, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.dot, currentImage === key && styles.activeDot]}
                  onPress={() => setCurrentImage(key)}
                />
              ))}
            </View>
          </View>

          {/* Price and Add to Cart Section */}
          <View style={styles.priceAddSection}>
            <View style={{display:"flex",flexDirection:"row",gap:5}}>
              {/* <Text style={{ textDecorationLine: "line-through", }}>
                {" "}
                ₹ {mrp}
              </Text> */}
              <Text style={styles.price}>₹ {mrp}</Text>
            </View>
            {parsedProduct.inCart ? (
              <CartControl product={parsedProduct} updateCount={updateCount} />
            ) : (
              <PrimaryButton
                title="Add"
                onPress={(event) => handleAddToCart(event, parsedProduct.id)}
                disabled={isLoading}
                height={30}
                rounded="lg"
              />
            )}
          </View>

          {/* Description Section */}
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{productDescription}</Text>

            <View style={styles.descPoints}>
              <Image
                source={require("../../../../assets/Icons/hexagon-check.png")}
                style={styles.bulletIcon}
              />
              <Text>Feature options</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  productPage: {
    flexGrow: 1,
    backgroundColor: Colors.lightGreyBg,
    padding: 15,
  },
  productDetails: {
    // container for product details
  },
  productTitle: {
    // marginTop: 10,
    paddingLeft: 10,
  },
  productName: {
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 22,
  },
  productBrand: {
    fontSize: 12,
    opacity: 0.6,
  },
  carouselContainer: {
    width: "100%",
    height: 400,
    position: "relative",
    overflow: "hidden",
    paddingTop: 10,
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain", // equivalent to object-fit: cover
    transition: "opacity 0.5s ease",
  },
  dotsContainer: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: [{ translateX: -50 }],
    flexDirection: "row",
    gap: 10,
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
  dot: {
    width: 10,
    height: 10,
    backgroundColor: "gray",
    borderRadius: 5,
    marginHorizontal: 2,
  },
  activeDot: {
    backgroundColor: Colors.primary,
  },
  priceAddSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 17,
    borderWidth: 0.5,
    borderColor: "rgba(0, 0, 0, 0.12)",
    marginVertical: 20,
    height: 60,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
  },
  addButton: {
    width: 70,
    height: 30,
    backgroundColor: Colors.primary,
    color: "white",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  descriptionSection: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 17,
    borderWidth: 0.5,
    borderColor: "rgba(0, 0, 0, 0.12)",
  },
  descriptionTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  descriptionText: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(0, 0, 0, 0.6)",
    marginBottom: 10,
    marginTop: 10,
  },
  bulletIcon: {
    width: 18,
    height: 18,
  },
  descPoints: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
});

export default ProductPage;
