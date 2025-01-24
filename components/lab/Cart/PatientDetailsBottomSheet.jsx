import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useMemo, useState, useCallback } from "react";
import PrimaryButton from "../../PrimaryButton";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { Colors } from "../../../constants/Colors";
import { convertDateToDDMMYYYY } from "../../../utils/utils";
import { Picker } from "@react-native-picker/picker";
import DatePicker from "react-native-date-picker";
import { AntDesign } from "@expo/vector-icons";

const PatientDetailsBottomSheet = React.forwardRef((props, ref) => {
  const { patientDetails, setPatientDetails } = props;
  const [dob, setDob] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const snapPoints = useMemo(() => ["70", "70%"], []);

  //handle patient details changes

  const handleOnChange = (value, name) => {
    setPatientDetails((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  //handle date changes
  const handleConfirmDate = (date) => {
    setIsDatePickerOpen(false);
    setPatientDetails((prevData) => ({
      ...prevData,
      dob: convertDateToDDMMYYYY(date),
    }));
  };

  const handlePresentModalClose = useCallback(() => {
    ref.current?.dismiss();
  }, []);
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
              Fill out Patient Details
            </Text>
            <TouchableOpacity onPress={handlePresentModalClose}>
              <AntDesign name="close" size={24} color={Colors.greyIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.bottomSheetView}>
            <Text>Name</Text>
            <BottomSheetTextInput
              style={styles.userDeatilsInput}
              placeholder="Full name"
              maxLength={30}
              defaultValue={patientDetails?.name}
              onChangeText={(text) => handleOnChange(text, "name")}
            />
          </View>
          <View style={{ height: 20 }}></View>
          <View style={styles.bottomSheetView}>
            <Text>Mobile number</Text>
            <BottomSheetTextInput
              style={styles.userDeatilsInput}
              placeholder="Mobile Number"
              maxLength={10}
              keyboardType="numeric"
              value={patientDetails?.phone_no}
              onChangeText={(text) => handleOnChange(text, "phone_no")}
            />
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
          >
            <View style={{ width: "45%" }}>
              <Text>Date Of Birth</Text>
              <TouchableOpacity
                onPress={() => setIsDatePickerOpen(true)}
                style={[
                  styles.userDeatilsInput,
                  {
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    paddingHorizontal: 10,
                    marginTop: 5,
                  },
                ]}
              >
                <Text style={{ textAlign: "left" }}>
                  {patientDetails.dob || "DD/MM/YYYY"}
                </Text>
              </TouchableOpacity>
              <DatePicker
                mode="date"
                modal
                maximumDate={dob}
                open={isDatePickerOpen}
                date={dob}
                onConfirm={(date) => {
                  handleConfirmDate(date);
                  Keyboard.dismiss();
                }}
                onCancel={() => {
                  setIsDatePickerOpen(false);
                }}
              />
            </View>
            <View style={{ width: "45%" }}>
              <Text>Gender</Text>
              <View
                style={[
                  styles.userDeatilsInput,
                  {
                    paddingLeft: 5,
                    marginTop: 5,
                  },
                ]}
              >
                <Picker
                  selectedValue={patientDetails?.gender}
                  onValueChange={(itemValue, itemIndex) => {
                    setPatientDetails((prev) => ({
                      ...prev,
                      gender: itemValue,
                    }));
                  }}
                >
                  <Picker.Item
                    enabled={false}
                    label="Select an option"
                    value=""
                  />
                  <Picker.Item label="Male" value="male" />
                  <Picker.Item label="Female" value="female" />
                  <Picker.Item label="Others" value="others" />
                </Picker>
              </View>
            </View>
          </View>

          <View style={{ marginTop: 30 }}>
            <PrimaryButton
              title="Continue"
              height={45}
              onPress={handlePresentModalClose}
            />
          </View>
        </View>
      </View>
    </BottomSheetModal>
  );
});

export default PatientDetailsBottomSheet;

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
});
