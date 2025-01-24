import axios from "axios";
import * as SecureStore from "expo-secure-store"; // Import SecureStore for token retrieval
import { BASE_URL } from "../config";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";

// Create an instance of axios with the base URL
const apiInstance = axios.create({
  baseURL: BASE_URL, // Replace with your actual base URL
});

// Add a request interceptor to automatically include the token
apiInstance.interceptors.request.use(
  async (config) => {
    try {
      // Retrieve token from SecureStore
      const token = await SecureStore.getItemAsync("accessToken"); // Corrected 'acessToken' to 'accessToken'

      // If the token exists, add it to the Authorization header
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }

      return config; // Proceed with the request
    } catch (error) {
      // Handle the error if token retrieval fails
      console.error("Error fetching token:", error);
      return Promise.reject(error); // Reject the error to continue the request process
    }
  },
  (error) => {
    // Handle request error (network failure, etc.)
    console.error("Request Error:", error);
    return Promise.reject(error); // Reject the error and pass it to the next handler
  }
);

// Add a response interceptor to handle token expiration
apiInstance.interceptors.response.use(
  (response) => {
    // If the response is successful, return it as is
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      // If the error is a 401 Unauthorized, it might be due to an expired token

      // You can attempt to refresh the token here, or prompt the user to log in again
      console.log("Token expired. Attempting to refresh the token...");

      // Retrieve the refresh token (assuming it's stored securely too)
      const refreshToken = await SecureStore.getItemAsync("refreshToken");

      if (refreshToken) {
        try {
          const headers = {
            Authorization: `Bearer ${refreshToken}`,
          };
          const response = await axios.post(
            `${BASE_URL}/auth/refreshtoken`,
            null,
            {
              headers,
            }
          );
          // Attempt to refresh the token (this is an example, replace it with your actual refresh logic)

          // Assuming the response contains a new access token, save it in SecureStore
          const newAccessToken = response.data.accessToken;
          await SecureStore.setItemAsync("accessToken", newAccessToken);

          // Retry the original request with the new token
          error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axios(error.config); // Retry the request with the new token
        } catch (refreshError) {
          console.error("Error refreshing the token:", refreshError);
          await SecureStore.deleteItemAsync("accessToken");
          await SecureStore.deleteItemAsync("refreshToken");
          router.push("/login");
          // Optionally, redirect to login if token refresh fails
          // For example, you could reset the user's session, log them out, and redirect to login
        }
      } else {
        console.error("No refresh token found!");
        await SecureStore.deleteItemAsync("accessToken"); 
        router.replace("/login");
        // If no refresh token, log the user out or redirect to the login page
      }
    }

    // If the error is not a 401, or refreshing the token fails, reject the error
    return Promise.reject(error);
  }
);

// Export the Axios instance for use in other files
export default apiInstance;
