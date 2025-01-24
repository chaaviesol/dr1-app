import { React, createContext, useContext, useEffect, useState } from "react";
// import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { BASE_URL } from "../config";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    userId: "",
    userType: "",
    token: null,
  });
  // console.log("authState", authState);
  const [isLoading, setIsLoading] = useState(false); //validating token

  const isTokenExpired = (token) => {
    if (!token) return true;
    const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT token
    const currentTime = Date.now() / 1000; // Get current time in seconds
    return decodedToken.exp < currentTime;
  };

  const validateAccessToken = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/auth/accesstoken");
      const user = response.data;
      setAuthState({
        userId: user.userId,
        userType: user.userType,
      });
    } catch (err) {
      authLogout(); // Log out if there's an error validating the token
      // toast.error("Session expired please login");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync("accessToken");
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      if (token && !isTokenExpired(refreshToken)) {
        setAuthState({
          userId: "",
          userType: "",
          token: token,
        });
      } else {
        authLogout();
      }
    };
    loadToken();
  }, []);

  const authLogin = async (email, password) => {
    try {
      const response = await axios.post(`${BASE_URL}/user/userlogin`, {
        email,
        password,
      });
      const data = response.data;
      // console.log(data);
      const { userId, userType, accessToken, refreshToken } = data;
      setAuthState({
        userId,
        userType,
        token: accessToken,
      });
      await SecureStore.setItemAsync("accessToken", accessToken);
      await SecureStore.setItemAsync("refreshToken", refreshToken);
      return {
        success: true,
        error: false,
        data: response,
      };
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message);
      return {
        success: false,
        error: true,
        data: err,
      };
    }
  };

  const authLogout = async () => {
    setAuthState({ userId: "", userType: "", token: null });
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
  };

  return (
    <AuthContext.Provider
      value={{ authState, setAuthState, authLogout, authLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
