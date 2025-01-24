import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Colors } from "../../constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import { useAuth } from "../../context/AuthContext";
import { router } from "expo-router";
import Snackbar from "react-native-snackbar";
import PrimaryButton from "../../components/PrimaryButton";

const LoginMobile = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailEmpty, setIsEmailEmpty] = useState(false);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);
  const [emailError, setEmailError] = useState(""); // State for email error message
  const [isLoginPending, setIsLoginPending] = useState(false);
  const [errors, setErrors] = useState({});

  // constants
  const { authLogin } = useAuth();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Check for empty email and password fields
    const isEmailEmpty = email === "";
    const isPasswordEmpty = password === "";

    setIsEmailEmpty(isEmailEmpty);
    setIsPasswordEmpty(isPasswordEmpty);

    // Check email format
    if (!isEmailEmpty && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Invalid email address.");
    } else {
      setEmailError("");
    }

    // Proceed with API call if both fields are valid
    if (!isEmailEmpty && !isPasswordEmpty && !emailError) {
      customerLogin(email, password);
    }
  };

  const handleBlurEmail = () => {
    setIsEmailEmpty(email === "");
    // Check for invalid email format when the field loses focus
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Invalid email address.");
    }
  };

  const handleBlurPassword = () => {
    setIsPasswordEmpty(password === "");
  };

  const handleEmailChange = (newEmail) => {
    setEmail(newEmail);
    // Reset error if the email becomes valid
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setEmailError(""); // Clear the email error if the format is correct
    }
  };

  // Call login api
  const customerLogin = async (email, password) => {
    const newErrors = {};

    setIsLoginPending(true);
    try {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = `Invalid email address.`;
      }
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      const dta = await authLogin(email, password);
      // console.log("Login success, token:", dta);
      if (dta.success) {
        router.back();
        Snackbar.show({
          text: "Login Successful",
          duration: Snackbar.LENGTH_SHORT,
        });
    
      } else {
        // alert("error");
      }
    } catch (err) {
      // toast.error(err.response.data.message);
      console.log(err);
    } finally {
      setIsLoginPending(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      <View style={styles.innerContainer}>
        <TouchableOpacity>
          <Image
            source={require("../../assets/images/doconelogo.png")} // Replace with your logo image
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.welcomeText}>Welcome Back</Text>

        <TextInput
          style={[
            styles.input,
            { borderColor: isEmailEmpty || emailError ? "red" : "#f2f5ff" },
          ]}
          placeholder={isEmailEmpty ? "Email is required" : "Enter your Email"}
          value={email}
          onChangeText={handleEmailChange} // Use handleEmailChange here
          onBlur={handleBlurEmail}
        />
        <View style={styles.errorContainer}>
          {emailError && <Text style={styles.errorText}>{emailError}</Text>}
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.input,
              { borderColor: isPasswordEmpty ? "red" : "#f2f5ff" },
            ]}
            placeholder={
              isPasswordEmpty ? "Password is required" : "Enter your password"
            }
            value={password}
            onChangeText={setPassword}
            onBlur={handleBlurPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.iconContainer}
          >
            {showPassword ? (
              <Feather name="eye" size={24} color="black" />
            ) : (
              <Feather name="eye-off" size={24} color="black" />
            )}
          </TouchableOpacity>
        </View>
        <View style={{ marginVertical: "5", width: "100%" }}>
          <PrimaryButton
            onPress={handleLogin}
            disabled={isLoginPending}
            title={
              isLoginPending ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                "Login"
              )
            }
            rounded="sm"
            width="100%"
            height={45}
          />
        </View>

        <TouchableOpacity>
          <Text
            style={{ color: "#6688FE", marginTop: 20, textAlign: "center" }}
          >
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("/login/createAccount")}
        >
          <Text
            style={{ color: "#6688FE", marginTop: 10, textAlign: "center" }}
          >
            Don't have an account?
          </Text>
        </TouchableOpacity>

        <View style={styles.orContainer}>
          <Text style={{ fontSize: 16 }}>OR</Text>
        </View>

        <TouchableOpacity style={styles.googleBtn}>
          <Image
            source={require("../../assets/images/google.png")}
            style={styles.googleIcon}
          />
          <Text>Continue with Google</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 84,
    height: 80,
    alignSelf: "center",
    borderRadius: 60,
  },
  welcomeText: {
    textAlign: "center",
    fontSize: 24,
    marginVertical: 20,
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
  errorContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  passwordContainer: {
    width: "100%",
    position: "relative",
    marginBottom: 40,
    justifyContent: "center",
  },
  iconContainer: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  loginBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: "100%",
  },
  orContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  googleBtn: {
    marginTop: 20,
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
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
});

export default LoginMobile;
