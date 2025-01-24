import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import axios from "axios";
import Feather from "@expo/vector-icons/Feather";
import { Colors } from "../../constants/Colors";
import { BASE_URL } from "../../config";
import { router } from "expo-router";
import PrimaryButton from "../../components/PrimaryButton";

export default function CreaeAccount() {
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [formValues, setFormValues] = useState({
    email: "",
    name: "",
    phone_no: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [loader, setLoader] = useState(false);

  //   const navigation = useNavigation();

  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  const handleInputChange = (e, name) => {
    const value = e.nativeEvent.text;

    let updatedValue = value;

    if (name === "name") {
      updatedValue = value.replace(/[0-9]/g, "");
    } else if (name === "phone_no") {
      const sanitizedValue = value.replace(/[.-]/g, "");
      updatedValue = sanitizedValue.slice(0, 10);
    } else if (name === "password") {
      updatedValue = value.trim();
    }

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: updatedValue,
    }));

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: false,
    }));
  };

  const handleRegister = () => {
    const newErrors = {};

    // Required field validation
    Object.keys(formValues).forEach((field) => {
      if (!formValues[field]) {
        newErrors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`;
      }
    });

    const Passwordpattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&]).{6,}$/;
    const EmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const PhonePattern = /^[6-9]\d{9}$/;

    // Confirm password validation
    if (formValues.password !== formValues.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!EmailPattern.test(formValues.email)) {
      newErrors.email = "Invalid email address.";
    }

    if (!PhonePattern.test(formValues.phone_no)) {
      newErrors.phone_no = "Invalid contact number";
    }

    if (!Passwordpattern.test(formValues.password)) {
      newErrors.password = "Invalid password";
    }

    setFormErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoader(true);
      console.log(formValues);
      axios
        .post(`${BASE_URL}/user/addusers`, formValues) // Replace with your API URL
        .then((res) => {
          setLoader(false);
          if (res?.data?.success) {
            setFormValues({
              email: "",
              name: "",
              phone_no: "",
              password: "",
              confirmPassword: "",
            });
            router.back(); // Navigate to login screen
          }
        })
        .catch((err) => {
          setLoader(false);
          toast.info(err?.response?.data?.message);
        });
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity>
          <Image
            source={require("../../assets/images/doconelogo.png")}
            style={styles.logo}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Create Account</Text>
      </View>
      {["name", "phone_no", "email"].map((field, index) => (
        <TextInput
          key={index}
          style={[styles.input, formErrors[field] ? styles.inputError : null]}
          placeholder={
            formErrors[field] ||
            `Enter your ${field
              .replace(/_/g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase())}`
          }
          value={formValues[field]}
          keyboardType={field === "phone_no" ? "numeric" : "default"}
          maxLength={
            field === "phone_no" ? 10 : field === "email" ? 50 : 50
          }
          onChange={(e) => handleInputChange(e, field)}
        />
      ))}
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, formErrors.password ? styles.inputError : null]}
          secureTextEntry={!showPassword.password}
          placeholder={formErrors.password || "Enter your password"}
          value={formValues.password}
          onChange={(e) => handleInputChange(e, "password")}
        />
        <TouchableOpacity
          onPress={() => togglePasswordVisibility("password")}
          style={styles.passwordToggleButton}
        >
          <View>
            {showPassword.password ? (
              <Feather name="eye" size={24} color="black" />
            ) : (
              <Feather name="eye-off" size={24} color="black" />
            )}
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.passwordContainer}>
        <TextInput
          style={[
            styles.input,
            formErrors.confirmPassword ? styles.inputError : null,
          ]}
          secureTextEntry={!showPassword.confirmPassword}
          placeholder={formErrors.confirmPassword || "Confirm password"}
          value={formValues.confirmPassword}
          onChange={(e) => handleInputChange(e, "confirmPassword")}
        />
        <TouchableOpacity
          onPress={() => togglePasswordVisibility("confirmPassword")}
          style={styles.passwordToggleButton}
        >
          <View>
            {showPassword.confirmPassword ? (
              <Feather name="eye" size={24} color="black" />
            ) : (
              <Feather name="eye-off" size={24} color="black" />
            )}
          </View>
        </TouchableOpacity>
      </View>
      <Text style={styles.passwordInfo}>
        Password must be 6+ characters with an uppercase letter, digit, and
        special character.
      </Text>
      <View style={{ marginVertical: "20", width: "100%" }}>
        <PrimaryButton
          onPress={handleRegister}
          disabled={loader}
          title={
            loader ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              "Create Account"
            )
          }
          rounded="sm"
          width="100%"
          height={45}
        />
      </View>
      <TouchableOpacity onPress={() => router.replace("/login")}>
        <Text style={styles.loginLink}>Already have an account? Login</Text>
      </TouchableOpacity>

      <View style={styles.orContainer}>
        <Text style={{ fontSize: 16 }}>OR</Text>
      </View>
      <TouchableOpacity style={styles.googleButton}>
        <Image
          source={require("../../assets/images/google.png")}
          style={styles.googleImage}
        />
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    height: 58,
    width: 58,
    borderRadius: 29,
    marginBottom: 20,
  },
  title: {
    fontWeight: "800",
    fontSize: 24,
  },
  input: {
    height: 50,
    borderColor: "#f2f5ff",
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 6,
    backgroundColor: Colors.backgroundTwo,
    marginVertical: 10,
    width: "100%",
  },
  inputError: {
    borderColor: "red",
    borderWidth: 2,
  },
  passwordContainer: {
    position: "relative",
    width: "100%",
    justifyContent: "center",
  },
  passwordToggleButton: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  passwordInfo: {
    fontSize: 12,
    color: "#888",
    marginVertical: 10,
  },

  loginLink: {
    color: "#6688FE",
    fontSize: 14,
  },
  orContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  orText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    // transform: [{ translateX: -50% }, { translateY: -50% }],
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  googleButton: {
    backgroundColor: "white",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  googleImage: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    fontWeight: "500",
  },
});
