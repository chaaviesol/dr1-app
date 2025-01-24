import { useState, useCallback, useEffect } from "react";
import { useFocusEffect } from "expo-router";
import apiInstance from "./useAxiosPrivate";
import { useAuth } from "../context/AuthContext";
import { useIsFocused } from "@react-navigation/native"; // Improved for handling focus

const useUserProfile = (authState) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isFocused = useIsFocused(); // New hook to track if the screen is focused


  // Use a cleanup mechanism with abort controller to cancel requests if needed
  const abortController = new AbortController();

  // UseFocusEffect will only trigger when the component is focused or authState.token changes
  useFocusEffect(
    useCallback(() => {
      setUserProfile(null); // Clear the previous user profile data
      setLoading(true); // Immediately show the loader when the tab is focused
      setError(null); // Reset any errors from previous attempts
      const fetchUser = async () => {
        if (!authState?.token) {
          setError("Token is not available");
          setLoading(false);
          return; // Don't fetch if there's no token
        }


        try {
          const response = await apiInstance.post("/user/getprofile", null, {
            signal: abortController.signal, // Attach abort signal to the request
          });
          if (response.data?.data) {
            const {
              id,
              name,
              email,
              phone_no,
              pincode,
              ageGroup,
              gender,
              image,
            } = response.data.data;
            setUserProfile({
              id: id ?? "",
              name: name ?? "",
              email: email ?? "",
              phone_no: phone_no ?? "",
              pincode: pincode ?? "",
              ageGroup: ageGroup ?? "",
              gender: gender ?? "",
              image: image ?? "",
            }); // Set the user profile data
          }
        } catch (err) {
          if (err.name === "AbortError") {
            console.log("Request aborted");
          } else {
            console.log(error);
            console.error(
              "Error fetching user data:",
              err.response || err.message || err.data
            );
            setUserProfile(null);
            setError("Failed to fetch user data"); // Set error state
          }
        } finally {
          setLoading(false);
        }
      };

      // Fetch user data when screen is focused and token is valid
      if (isFocused) {
        fetchUser();
      }

      // Cleanup function to cancel the request if screen is unfocused or token changes
      return () => {
        abortController.abort(); // Cancel the fetch request if it's still in progress
        setLoading(false); // Optionally reset loading state
      };
    }, [authState.token, isFocused]) // Dependencies: token change or screen focus change
  );

  return { userProfile, loading, error, setUserProfile };
};

export default useUserProfile;
