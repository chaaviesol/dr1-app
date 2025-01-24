import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import DatePicker from "react-native-date-picker";
import PrimaryButton from "../../../components/PrimaryButton";
import { Colors } from "../../../constants/Colors";
import { Picker } from "@react-native-picker/picker";
import useUserProfile from "../../../hooks/useUserProfile";
import { useAuth } from "../../../context/AuthContext";
import { convertDateToDDMMYYYY } from "../../../utils/utils";
import Loader from "../../../components/Loader";
import Snackbar from "react-native-snackbar";
import { Entypo } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import apiInstance from "../../../hooks/useAxiosPrivate";

const Page = () => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { authState } = useAuth();
  const {
    userProfile,
    loading: profileLoading,
    setUserProfile,
  } = useUserProfile(authState);
  const handleOnChange = (value, name) => {
    setUserProfile((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  //saving user profile
  const onSave = async () => {
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    if (
      !userProfile.name ||
      !userProfile.ageGroup ||
      !userProfile.gender ||
      !userProfile.pincode
    ) {
      Snackbar.show({
        text: "All fileds are required",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "#ff6161",
        textColor: "white",
      });
      return;
    }
    if (!pincodeRegex.test(userProfile.pincode)) {
      Snackbar.show({
        text: "Please enter a valid 6-digit pincode.",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "#ff6161",
        textColor: "white",
      });
      return;
    }
    setIsLoading(true);
    try {
      const submissionData = new FormData();
      if (Array.isArray(userProfile.image)) {
        submissionData.append("images", userProfile.image[0]);
      }

      submissionData.append("data", JSON.stringify(userProfile));

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const response = await apiInstance.post(
        "/user/edituser",
        submissionData,
        config
      );
      Snackbar.show({
        text: response.data.message,
        duration: Snackbar.LENGTH_SHORT,
        textColor: "white",
      });
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

  const handleConfirmDate = (date) => {
    setOpen(false);
    setUserProfile((prevData) => ({
      ...prevData,
      ageGroup: convertDateToDDMMYYYY(date),
    }));
  };
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*"],
        multiple: false,
        copyToCacheDirectory: true, // You can specify file types, or use '*' to allow any file type
      });
      console.log(result);
      if (!result.canceled) {
        const file = result.assets[0];
        const documentFile = {
          name: file.name.split(".")[0],
          uri: file.uri,
          type: file.mimeType,
          size: file.size,
        };

        setUserProfile((prev) => ({
          ...prev,
          image: [documentFile],
          imageUri: documentFile.uri,
        }));
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  console.log(userProfile);

  if (profileLoading) {
    return (
      <View
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loader />
      </View>
    );
  }
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      <View style={styles.sections}>
        <View style={styles.profilePicContainer}>
          <View style={styles.profileImage}>
            <Image
              style={{
                height: "100%",
                width: "100%",
                resizeMode: "cover",
                borderRadius: 50,
              }}
              source={
                userProfile?.imageUri
                  ? { uri: userProfile?.imageUri }
                  : userProfile?.image
                  ? { uri: userProfile?.image }
                  : require("../../../assets/images/newavatar.jpg")
              }
            />
            <TouchableOpacity style={styles.cameraIcon} onPress={pickDocument}>
              <Entypo name="camera" size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.sections}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          maxLength={30}
          value={userProfile?.name}
          onChangeText={(text) => handleOnChange(text, "name")}
        />
      </View>

      <View style={styles.sections}>
        <Text style={styles.label}>Gender</Text>
        <View
          style={[
            styles.input,
            {
              paddingLeft: 5,
            },
          ]}
        >
          <Picker
            selectedValue={userProfile?.gender}
            onValueChange={(itemValue, itemIndex) => {
              setUserProfile((prev) => ({
                ...prev,
                gender: itemValue,
              }));
            }}
          >
            <Picker.Item label="Select an option" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Others" value="Others" />
          </Picker>
        </View>
      </View>

      <View style={styles.sections}>
        <Text style={styles.label}>Date of Birth</Text>
        <TouchableOpacity
          onPress={() => setOpen(true)}
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
          <Text style={{ textAlign: "left" }}>{userProfile?.ageGroup}</Text>
        </TouchableOpacity>

        <DatePicker
          mode="date"
          modal
          maximumDate={date}
          open={open}
          date={date}
          onConfirm={(date) => {
            handleConfirmDate(date);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
      </View>

      <View style={styles.sections}>
        <Text style={styles.label}>Pincode</Text>
        <TextInput
          style={styles.input}
          placeholder="Pincode"
          keyboardType="numeric"
          value={userProfile?.pincode}
          maxLength={6}
          onChangeText={(text) => handleOnChange(text, "pincode")}
        />
      </View>
      <View style={{ marginTop: 30 }}>
        <PrimaryButton
          onPress={onSave}
          disabled={isLoading}
          title={
            isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              "Save"
            )
          }
          height={45}
          rounded="lg"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 15,
  },
  sections: {
    marginVertical: 6,
  },
  profilePicContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIcon: {
    backgroundColor: "white",
    borderRadius: "50%",
    borderColor: Colors.primary,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 5,
    position: "absolute",
    bottom: 1,
    right: 0,
  },
  profileImage: {
    // borderWidth: 1,
    // borderColor: "red",
    position: "relative",
    height: 100,
    width: 100,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 50,
    backgroundColor: Colors.inputBackground,
    borderRadius: 24,
    paddingHorizontal: 15,
  },
});

export default Page;
