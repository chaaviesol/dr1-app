import { Button, Image, FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import Loader from "../../../../../components/Loader";
import PrimaryButton from "../../../../../components/PrimaryButton";
import apiInstance from "../../../../../hooks/useAxiosPrivate";
import { Colors } from "../../../../../constants/Colors";
import { router } from "expo-router";

// Memoize the order item component
const OrderItem = React.memo(({ item, index }) => {
  const handleTrackOrder = useCallback((item) => {
    router.push("/screens/(authenticated)/pharmacyscreens/orders/123");
  }, []);
  return (
    <>
      {index === 0 && <View style={styles.divider} />}
      <View style={styles.order}>
        <View style={styles.ordercardtop}>
          <View style={styles.orderdetails}>
            <Text style={styles.orderNumber}>Order # {item?.so_number}</Text>
            <Text style={styles.expectedDate}>Expected on Thu 22 Aug</Text>
          </View>

          <PrimaryButton
            title="Track Order"
            onPress={() => handleTrackOrder(item)}
            rounded="lg"
          />
        </View>
        {item.sales_list && item.sales_list.length > 0 && (
          <View style={styles.productsection}>
            {item.sales_list.map((products, productIndex) => (
              <View key={productIndex} style={styles.product}>
                <View style={styles.productimgcontainer}>
                  <Image
                    source={{
                      uri: products?.generic_prodid?.images?.image1,
                    }}
                    style={styles.productImage}
                  />
                </View>
                <Text style={styles.productname}>
                  {products?.generic_prodid?.name}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
      <View style={styles.divider} />
    </>
  );
});

const MyOrders = () => {
  const [myOrder, setMyOrder] = useState([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsOrdersLoading(true);
    const fetchOrders = async () => {
      try {
        const response = await apiInstance.get("/pharmacy/myorders");
        setMyOrder(response.data.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders. Please try again.");
      } finally {
        setIsOrdersLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isOrdersLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Retry" onPress={() => fetchOrders()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={myOrder}
        renderItem={({ item, index }) => (
          <OrderItem item={item} index={index} />
        )}
        keyExtractor={(item) =>
          item?.so_number?.toString() || item.id.toString()
        } // Unique key
        contentContainerStyle={styles.orderlist}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10} // Start with a smaller batch of items to render
        maxToRenderPerBatch={10} // Control the maximum batch size for better performance
        windowSize={5} // Number of items to render offscreen
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  orderlist: {
    // You can add marginTop here if needed
  },
  order: {
    flexDirection: "column",
    gap: 20,
    margin: 20,
    paddingHorizontal: 10,
  },
  ordercardtop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderdetails: {
    flexDirection: "column",
    gap: 5,
  },
  orderNumber: {
    color: "black",
    fontWeight: "500",
  },
  expectedDate: {
    fontWeight: "300",
    color: "red",
  },
  productsection: {
    flexDirection: "column",
    gap: 10,
    maxHeight: 400,
    overflow: "scroll",
  },
  product: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 30,
    fontSize: 14,
  },
  productimgcontainer: {
    backgroundColor: "#f2f5ff",
    height: 70,
    width: 70,
    padding: 16,
    borderRadius: 9,
  },
  productImage: {
    resizeMode: "contain", // Corrected to "resizeMode" for React Native
    height: "100%",
    width: "100%",
  },
  productname: {
    fontSize: 14,
  },
  divider: {
    height: 10,
    backgroundColor: Colors.backgroundTwo,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
});

export default MyOrders;
