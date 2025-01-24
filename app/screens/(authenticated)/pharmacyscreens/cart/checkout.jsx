import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Keyboard,
  ActivityIndicator,
} from "react-native";

import BouncyCheckbox from "react-native-bouncy-checkbox";
import UseMyLocation from "../../../../../components/ui/UseMylocation";
import { useAuth } from "../../../../../context/AuthContext";
import useUserProfile from "../../../../../hooks/useUserProfile";
import apiInstance from "../../../../../hooks/useAxiosPrivate";
import { router } from "expo-router";
import Sheet from "../../../../../components/ui/BottomSheet";
import { Colors } from "../../../../../constants/Colors";
import PrimaryButton from "../../../../../components/PrimaryButton";
import Snackbar from "react-native-snackbar";

const Page = () => {
  const [formData, setFormData] = useState({
    name: "",
    contact_no: "",
    delivery_address: "",
    district: "",
    nearest_landmark: "",
    pincode: "",
    remarks: "",
    location: "", //lat lng
  });

  const [errors, setErrors] = useState({});
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSearchLocationModal, setShowSearchLocationModal] = useState(false);
  const { authState } = useAuth();
  const { userProfile } = useUserProfile(authState);
  const bottomSheetRef = useRef(null);
  const handleOpenPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);
  const handleClosePress = () => bottomSheetRef.current?.close();
  //fetch and save user data on page load
  useEffect(() => {
    setFormData({
      ...formData,
      name: userProfile?.name,
      contact_no: userProfile?.phone_no,
    });
  }, [userProfile]);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = () => {
    setChecked(!checked);
  };

  const handleLocationFetched = (location) => {
    setFormData({
      ...formData,
      delivery_address: location.formattedAddress,
      location: location.location,
      district: location.district,
      pincode: location.postalCode,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.delivery_address)
      newErrors.delivery_address = "Delivery details are required";
    if (!formData.nearest_landmark)
      newErrors.nearest_landmark = "Nearest landmark  required";
    if (!formData.contact_no || !/^[6-9]\d{9}$/.test(formData.contact_no))
      newErrors.contact_no = "Invalid Contact Number";
    if (!formData.district) newErrors.district = "district required";
    if (!formData.pincode || formData.pincode.length !== 6)
      newErrors.pincode = "Invalid Pincode";
    if (!formData.remarks) newErrors.remarks = "Remarks are required";
    // Check for consent checkbox
    if (!checked) newErrors.checked = "Please provide consent to be contacted";
    return newErrors;
  };
  //submit

  const handleSubmit = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      setLoading(true);
      const submissionData = new FormData();
      const orderType = "salesorder";
      submissionData.append("name", formData.name);
      submissionData.append("remarks", formData.remarks);
      submissionData.append("contact_no", formData.contact_no);
      submissionData.append("order_type", orderType);
      submissionData.append("pincode", formData.pincode);
      submissionData.append("delivery_address", formData.delivery_address);
      submissionData.append("nearest_landmark", formData.nearest_landmark);
      submissionData.append(
        "delivery_location",
        JSON.stringify(formData.location)
      );
      submissionData.append("district", formData.district);
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const response = await apiInstance.post(
        "/pharmacy/salesorder",
        submissionData,
        config
      );
      if (response.status === 200) {
        router.back();
        Snackbar.show({
          text: "Order Placed",
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (error) {
      console.log("Error details:", error.response || error.message || error);
      alert("An error occurred while submitting the details.");
    } finally {
      setLoading(false);
    }
  };

  //click on a suggested place
  const setlatAndLng = (lat, lng, placeName) => {
    setFormData({
      ...formData,
      location: { lat, lng },
      nearest_landmark: placeName, //set to tstate
    });
    setErrors((prevState) => ({
      ...prevState,
      nearest_landmark: "", //clear error
    }));
    setShowSearchLocationModal(false);
    Keyboard.dismiss(); //dismiss keyboard
    handleClosePress(); //close bottom sheet
  };
  console.log(formData);

  return (
    <>
      <View style={styles.container}>
        <ScrollView
          keyboardDismissMode="on-drag"
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false} // Hide vertical scrollbar
          showsHorizontalScrollIndicator={false} // Hide horizontal scrollbar
        >
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={formData.name}
              onChangeText={(value) => handleChange("name", value)}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Contact Number"
              keyboardType="numeric"
              maxLength={10}
              value={formData.contact_no}
              onChangeText={(value) => handleChange("contact_no", value)}
            />
            {errors.contact_no && (
              <Text style={styles.errorText}>{errors.contact_no}</Text>
            )}
          </View>
          <View style={styles.inputWrapper}>
            <TouchableOpacity
              onPress={() => handleOpenPress()}
              style={[
                styles.input,
                {
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  paddingHorizontal: 10,
                },
              ]}
            >
              <Text style={{ textAlign: "left" }}>
                {formData.nearest_landmark || "Nearest landmark"}
              </Text>
            </TouchableOpacity>

            {errors.nearest_landmark && (
              <Text style={styles.errorText}>{errors.nearest_landmark}</Text>
            )}
          </View>

          <View style={styles.locationContainer}>
            <UseMyLocation onLocationFetched={handleLocationFetched} />
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                {
                  paddingTop: 10,
                },
              ]}
              placeholder="Delivery address"
              value={formData.delivery_address}
              onChangeText={(value) => handleChange("delivery_address", value)}
              multiline
            />
            {errors.delivery_address && (
              <Text style={styles.errorText}>{errors.delivery_address}</Text>
            )}
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="District"
              value={formData.district}
              onChangeText={(value) => handleChange("district", value)}
            />
            {errors.district && (
              <Text style={styles.errorText}>{errors.district}</Text>
            )}
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Pincode"
              keyboardType="numeric"
              maxLength={6}
              value={formData.pincode}
              onChangeText={(value) => handleChange("pincode", value)}
            />
            {errors.pincode && (
              <Text style={styles.errorText}>{errors.pincode}</Text>
            )}
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Remarks"
              value={formData.remarks}
              onChangeText={(value) => handleChange("remarks", value)}
              multiline
            />
            {errors.remarks && (
              <Text style={styles.errorText}>{errors.remarks}</Text>
            )}
          </View>

          <View style={styles.consentSection}>
            <View style={styles.checkboxContainer}>
              <View>
                <BouncyCheckbox
                  isChecked={checked}
                  size={25}
                  fillColor={Colors.primary}
                  unfillColor="#FFFFFF"
                  iconStyle={{ borderColor: Colors.primary }}
                  onPress={handleCheckboxChange}
                />
              </View>
              <Text style={styles.consentText}>
                I consent to be contacted regarding my submission.
              </Text>
            </View>
            <View style={styles.consentErrorTextContainer}>
              {errors.checked && (
                <Text style={styles.errorText}>{errors.checked}</Text>
              )}
            </View>
          </View>

          <View style={{ marginVertical: "5", width: "100%" }}>
            <PrimaryButton
              onPress={handleSubmit}
              disabled={loading}
              title={
                loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  "Submit"
                )
              }
              rounded="sm"
              width="100%"
              height={45}
            />
          </View>
        </ScrollView>
      </View>
      <Sheet getCords={setlatAndLng} ref={bottomSheetRef} />
    </>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  scrollContainer: {
    flexGrow: 1, // Allow ScrollView to grow when content is small
    // paddingBottom: 20,
  },
  inputWrapper: {
    marginTop: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: Colors.inputBackground,
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top", // For Android multi-line text input
    padding: 15,
  },
  uploadButton: {
    padding: 10,
    backgroundColor: "#000000",
    borderRadius: 50,
    marginTop: 15,
  },
  uploadButtonText: {
    color: "white",
    textAlign: "center",
  },
  fileNames: {
    marginTop: 10,
  },
  attachText: {
    color: "#999",
  },
  locationContainer: {
    marginTop: 10,
    alignItems: "flex-end",
  },
  consentSection: {
    marginTop: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    // borderColor:"red",
    // borderWidth:2
  },
  consentErrorTextContainer: {
    marginTop: 5,
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
  },
  checkboxContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    marginRight: 10,
  },
  consentText: {
    fontSize: 13,
  },

  errorText: {
    color: "red",
    fontSize: 14,
    textAlign: "left",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContainer: {
    width: "93%",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "white",
    borderRadius: 3,
    // alignItems: "center",
    shadowColor: "#000", // Color of the shadow
    shadowOpacity: 0.3, // Increased opacity for a more pronounced shadow
    shadowRadius: 10, // Larger radius for a smoother shadow
    shadowOffset: { width: 0, height: 6 }, // Increase the height for a more subtle offset
    elevation: 12,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: 800,
    marginBottom: 20,
    marginTop: 10,
  },
  optionContainer: {
    gap: 8,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 15,
    textAlign: "left",
  },
  modalBtnContainer: {
    // borderColor:"red",
    // borderWidth:1,
    display: "flex",
    alignItems: "flex-end",
  },
  modalCloseBtn: {
    height: 45,
    paddingHorizontal: 35,
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
    borderColor: Colors.inActiveTabs,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 1,
  },
});
