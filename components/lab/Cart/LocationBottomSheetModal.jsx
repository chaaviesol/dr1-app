import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useMemo, useState, useCallback } from "react";
import PrimaryButton from "../../PrimaryButton";
import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { Colors } from "../../../constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import UseMyLocation from "../../ui/UseMylocation";

const LocationBottomSheet = React.forwardRef((props, ref) => {
  const [errors, setErrors] = useState({});
  const { patientAddress, setPatientAddress } = props;
  const snapPoints = useMemo(() => ["60%", "60%", "80%"], []);

  const validateForm = () => {
    const newErrors = {};
    if (!patientAddress.address) newErrors.address = "required";
    if (!patientAddress.pincode || patientAddress.pincode.length !== 6)
      newErrors.pincode = "Invalid Pincode";
    // Check for consent checkbox
    return newErrors;
  };

  //handle patient details changes

  const handleOnChange = (value, name) => {
    setPatientAddress((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  //handle date changes

  const handlePresentModalClose = useCallback(() => {
    ref.current?.dismiss();
  }, []);

  const handleLocationFetched = (location) => {
    setPatientAddress({
      address: location.formattedAddress,
      location: location.location,
      pincode: location.postalCode,
    });
  };

  const handleContinuePress = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    handlePresentModalClose();
  };

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={BottomSheetBackdrop}
      enablePanDownToClose={false}
      enableDynamicSizing={false}
      handleIndicatorStyle={{ opacity: 0 }}
    >
      <View style={styles.bottomSheetModalContainer}>
        <View style={styles.contentContainer}>
          <View
            style={{
              marginRight: 0,
              height: 60,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: Colors.blackText,
              }}
            >
              Address Details
            </Text>
            <TouchableOpacity onPress={handlePresentModalClose}>
              <AntDesign name="close" size={24} color={Colors.greyIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.bottomSheetView}>
            <BottomSheetTextInput
              multiline
              style={[
                styles.userDeatilsInput,
                {
                  height: 100,
                },
              ]}
              placeholder="Address"
              maxLength={100}
              defaultValue={patientAddress?.address}
              onChangeText={(value) => handleOnChange(value, "address")}
            />
            {errors.address && (
              <Text style={styles.errorText}>{errors.address}</Text>
            )}
          </View>
          <View style={{ height: 20 }}></View>
          <View style={styles.bottomSheetView}>
            <TextInput
              style={styles.userDeatilsInput}
              placeholder="Pincode"
              keyboardType="numeric"
              maxLength={6}
              defaultValue={patientAddress.pincode}
              onChangeText={(value) => handleOnChange(value, "pincode")}
            />
            {errors.pincode && (
              <Text style={styles.errorText}>{errors.pincode}</Text>
            )}
          </View>
          <View style={{ height: 20 }}></View>
          <View style={{ marginTop: 10, alignItems: "flex-end" }}>
            <UseMyLocation onLocationFetched={handleLocationFetched} />
          </View>

          <View style={{ height: 20 }}></View>
          <View
            style={[
              styles.bottomSheetView,
              {
                flexDirection: "row",
                justifyContent: "space-between",
              },
            ]}
          ></View>

          <View style={{ marginTop: 30 }}>
            <PrimaryButton
              title="Continue"
              height={45}
              onPress={() => handleContinuePress()}
            />
            {/* <PrimaryButton title="Continue" height={45} disabled={true} /> */}
          </View>
        </View>
      </View>
    </BottomSheetModal>
  );
});

export default LocationBottomSheet;

const styles = StyleSheet.create({
  bottomSheetModalContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    // justifyContent:"space-between",
    flex: 1,
  },
  userDeatilsInput: {
    height: 50,
    backgroundColor: Colors.inputBackground,
    borderRadius: 5,
    paddingHorizontal: 15,
    textAlignVertical: "center",
  },
  bottomSheetView: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  errorText: {
    color: Colors.errorText,
    fontSize: 14,
    textAlign: "left",
  },
});
