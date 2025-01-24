import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { fetchLabCart, removeFromCart } from "../../../../api/labApis";
import { useMutation, useQuery } from "@tanstack/react-query";
import HomeOrCentre from "../../../../components/lab/HomeOrCentre";
import PrimaryButton from "../../../../components/PrimaryButton";
import { MaterialIcons } from "@expo/vector-icons";
import CartFooter from "../../../../components/product/CartFooter";
import Loader from "../../../../components/Loader";
import { Colors } from "../../../../constants/Colors";
import PatientDetailsBottomSheet from "../../../../components/lab/Cart/PatientDetailsBottomSheet";
import LocationBottomSheet from "../../../../components/lab/Cart/LocationBottomSheetModal";
import apiInstance from "../../../../hooks/useAxiosPrivate";
import Snackbar from "react-native-snackbar";

const Page = () => {
  const [patientDetails, setPatientDetails] = useState({
    name: "",
    phone_no: "",
    dob: "",
    gender: "",
  });
  const [patientAddress, setPatientAddress] = useState({
    address: "",
    pincode: "",
    location: "",
  });
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isAssigningToLabcart, setIsAssigningToLabCart] = useState(false);
  const [labCart, setlabCart] = useState([]);
  const patientDetailsBottomSheetModalRef = useRef(null);
  const handlePresentModalPress = useCallback(() => {
    patientDetailsBottomSheetModalRef.current?.present();
  }, []);
  const LocationBottomSheetModalRef = useRef(null);
  const handlePresentLocationModalPress = useCallback(() => {
    LocationBottomSheetModalRef.current?.present();
  }, []);

  //cart api call
  const {
    data: cart,
    isFetching: isCartFetching,
    refetch,
  } = useQuery({
    queryKey: ["getcart"],
    queryFn: () => fetchLabCart(),
  });
  //remove from cart api call
  const removeFromCartMutation = useMutation({
    mutationFn: ["remove from cart"],
    mutationFn: (test_number) => removeFromCart(test_number),
    onSuccess: (responseMessage) => {
      refetch();
    },
  });
  //remove from cart state
  const handleRemoveItem = async (test_number) => {
    const data = labCart.filter((item) => {
      return item.test_number !== test_number ? item : "";
    });
    setlabCart(data);
    removeFromCartMutation.mutateAsync(test_number);
  };
  //setting cart data to labCart state
  useEffect(() => {
    setIsAssigningToLabCart(true);
    if (cart && cart.tests && cart.tests.length > 0) {
      setlabCart(cart.tests);
      setIsAssigningToLabCart(false);
    } else {
      setIsAssigningToLabCart(false);
    }
  }, [cart]);
  //calculate the total price
  const totalPrice = () => {
    if (labCart && labCart?.length > 0) {
      const totalMRP = labCart.reduce((accumulator, product) => {
        return accumulator + product.price;
      }, 0);
      return totalMRP;
    } else {
      return 0;
    }
  };
  //handle patient details changes
  // const handleOnChange = (value, name) => {
  //   setPatientDetails((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };

  //handle checkout

  const handleCheckout = async () => {
    const payload = {
      total_amount: totalPrice(),
      order_type: "normal_order",
      delivery_location: patientAddress?.location,
      pincode: patientAddress.pincode,
      contact_no: patientDetails.phone_no,
      patientDetails,
      delivery_details: patientAddress,
    };
    setIsCheckoutLoading(true);
    try {
      const response = await apiInstance.post("/labtest/checkout", payload);
      Snackbar.show({
        text: response.data.message,
        duration: Snackbar.LENGTH_SHORT,
      });
    } catch (err) {
      console.error("Checkout failed:", err);
    } finally {
      setIsCheckoutLoading(false);
    }
  };
  if (isCartFetching || isAssigningToLabcart) {
    return <Loader />;
  }
  if (cart && cart.tests && cart.tests.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={{ height: 210, width: 210 }}>
          <Image
            style={{ height: "100%", width: "100%", resizeMode: "contain" }}
            source={require("../../../../assets/images/empty-cart.png")}
          />
        </View>
      </View>
    );
  }
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: Colors.whiteBackground,
        },
      ]}
    >
      {/* Patient Details Section */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {(!patientDetails.dob ||
          !patientDetails.gender ||
          !patientDetails.name ||
          !patientDetails.phone_no) && (
          <View style={styles.labcart}>
            <View>
              <Text style={styles.heading}>Patient Details</Text>
              <Text style={styles.subheading}>Add patient details</Text>
            </View>
            <PrimaryButton
              title="Add"
              rounded="lg"
              height={30}
              width={80}
              onPress={handlePresentModalPress}
            />
          </View>
        )}

        {/* Location Section */}
        {(!patientAddress.address || !patientAddress.pincode) && (
          <View style={styles.labcart}>
            <View>
              <Text style={styles.heading}>Location</Text>
              <Text style={styles.subheading}>Add Location</Text>
            </View>
            <PrimaryButton
              title="Add"
              rounded="lg"
              height={30}
              width={80}
              onPress={handlePresentLocationModalPress}
            />
          </View>
        )}

        {/* Added Patient Details */}
        <View style={styles.locationadded}>
          <Text style={styles.heading}>Patient Details</Text>
          <View style={styles.addeddetails}>
            <Image
              style={styles.patientImage}
              source={{
                uri: "https://images.unsplash.com/photo-1489980557514-251d61e3eeb6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              }}
            />
            <View>
              <Text style={styles.patientName}>
                {patientDetails?.name || "Name"}
              </Text>
              <Text style={styles.patientGender}>
                {patientDetails?.gender || "Gender"}
              </Text>
              <Text style={styles.patientAge}>
                {patientDetails?.dob || "Date of Birth"}
              </Text>
            </View>
          </View>
        </View>

        {/* Location Added */}
        <View style={styles.locationadded}>
          <Text style={styles.heading}>Location</Text>
          <Text style={styles.locationDescription}>
            {patientAddress.address}
          </Text>
          <Text style={{ fontSize: 14, color: "#616161" }}>
            {patientAddress.pincode}
          </Text>
        </View>

        {/* Orders Section */}
        <View style={styles.ordersec}>
          <Text style={styles.orderTitle}>Orders</Text>
          {(cart.testLocation === "home" || cart.testLocation === "center") && (
            <HomeOrCentre
              isHomeCollection={
                cart.testLocation === "home"
                  ? true
                  : cart.testLocation === "center"
                  ? false
                  : ""
              }
            />
          )}
        </View>

        {/* Order Items */}
        <FlatList
          data={labCart}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.labcartorder}>
              <View style={{ width: "90%" }}>
                <Text style={styles.orderName}>{item?.name}</Text>
                <Text style={styles.orderPrice}>
                  ₹ {item?.price || item?.mrp}
                </Text>
              </View>
              <TouchableOpacity
                disabled={removeFromCartMutation.isPending}
                onPress={() => handleRemoveItem(item.test_number)}
              >
                <MaterialIcons name="delete-outline" size={24} color="black" />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.test_number.toString()}
          horizontal={false}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>

      {/* Add More Button */}
      {/* <TouchableOpacity style={styles.labcartaddmore}>
        <PrimaryButton title="Add More" rounded="sm" height={40} width="100%" />
      </TouchableOpacity> */}
      <PatientDetailsBottomSheet
        patientDetails={patientDetails}
        setPatientDetails={setPatientDetails}
        ref={patientDetailsBottomSheetModalRef}
      />
      <LocationBottomSheet
        patientAddress={patientAddress}
        setPatientAddress={setPatientAddress}
        ref={LocationBottomSheetModalRef}
      />
      <View style={styles.stickyFooter}>
        <CartFooter
          diabled={isCheckoutLoading}
          cartItems={labCart}
          totalPrice={totalPrice}
          onPress={handleCheckout}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  stickyFooter: {
    position: "absolute",
    marginHorizontal: 15,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    zIndex: 10,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    padding: 15,
    paddingBottom: 90,
  },
  labcart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: "semibold",
  },
  subheading: {
    fontSize: 14,
    color: "#616161",
  },
  button: {
    backgroundColor: "#3A65FD",
    borderRadius: 50,
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
  },
  locationadded: {
    paddingVertical: 10,
  },
  addeddetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginTop: 10,
  },
  patientImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    objectFit: "cover",
  },
  patientName: {
    fontSize: 18,
    fontWeight: "semibold",
    textTransform: "capitalize",
  },
  patientGender: {
    fontSize: 14,
    color: "#616161",
    textTransform: "capitalize",
  },
  patientAge: {
    fontSize: 14,
    color: "#616161",
  },
  locationDescription: {
    fontSize: 14,
    color: "#616161",
    marginTop: 10,
  },
  ordersec: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: "semibold",
  },
  labcartorder: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    marginTop: 20,
    paddingRight: 10,
  },
  orderName: {
    fontSize: 16,
    fontWeight: "semibold",
    textTransform: "capitalize",
  },
  orderPrice: {
    fontSize: 14,
    fontWeight: "semibold",
    color: "#616161",
  },
  labcartaddmore: {
    width: "100%",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  addMoreText: {
    color: "white",
    fontSize: 16,
    fontWeight: "semibold",
  },
  userDeatilsInput: {
    height: 50,
    backgroundColor: Colors.inputBackground,
    borderRadius: 5,
    paddingHorizontal: 15,
  },
});

export default Page;
