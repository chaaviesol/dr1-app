import { useCallback, useState } from "react";
import apiInstance from "./useAxiosPrivate";
import Snackbar from "react-native-snackbar";
import { router } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTestToCart, removeFromCart } from "../api/labApis";
import { useLabContext } from "../context/LabContext";
import { useAuth } from "../context/AuthContext";
import { triggerHapticFeedback } from "../utils/utils";

const useLabCart = () => {
  const [labCartLength, setLabCartLength] = useState(0);
  const [labCart, setLabCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchLabCart: refetchCart } = useLabContext();
  const { authState } = useAuth();
  const queryClient = useQueryClient();
  const addToCartMutation = useMutation({
    mutationFn: ["add to cart"],
    mutationFn: (test_number) => addTestToCart(test_number),
    onSuccess: (responseMessage) => {
      refetchCart(); //for displaying the number of items in the cart icon
      queryClient.invalidateQueries({ queryKey: ["labtestsmin"] });
      queryClient.invalidateQueries({ queryKey: ["labtestsfull"] });
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      queryClient.invalidateQueries({ queryKey: ["allPackages"] });
      queryClient.invalidateQueries({ queryKey: ["singleLabPackage"] });
      queryClient.invalidateQueries({ queryKey: ["singleTest"] });
      Snackbar.show({
        text: responseMessage,
        duration: Snackbar.LENGTH_SHORT,
      });
    },
  });
  //this function will run first when add button pressed..if api calling two times when add to cart button pressed fastly move this function to that component and use local state to make button disabled
  const handleAddToCart = (test_number) => {
    if (!authState.token) {
      router.push("/login");
    } else {
      if (addToCartMutation.isPending) {
        return;
      }
      triggerHapticFeedback(); //not work on web
      addToCartMutation.mutateAsync(test_number);
    }
  };

  const removeFromCartMutation = useMutation({
    mutationFn: ["remove from cart"],
    mutationFn: (test_number) => removeFromCart(test_number),
    onSuccess: (responseMessage) => {
      refetchCart(); //for displaying the number of items in the cart icon
      Snackbar.show({
        text: responseMessage,
        duration: Snackbar.LENGTH_SHORT,
      });
      queryClient.invalidateQueries({ queryKey: ["labtestsmin"] });
      queryClient.invalidateQueries({ queryKey: ["labtestsfull"] });
      queryClient.invalidateQueries({ queryKey: ["singleLabPackage"] });
      queryClient.invalidateQueries({ queryKey: ["singleTest"] });
      queryClient.invalidateQueries({ queryKey: ["packages"] }); //labs tab
      queryClient.invalidateQueries({ queryKey: ["allPackages"] }); //all labs packages list
    },
  });
  const handleRemoveFromCart = async (test_number) => {
    if (!authState.token) {
      router.push("/login");
    } else {
      if (removeFromCartMutation.isPending) {
        return;
      }
       triggerHapticFeedback(); //not work on web
      removeFromCartMutation.mutateAsync(test_number);
    }
  };

  const fetchLabCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiInstance.get(`/labtest/gettestCart`);
      setLabCartLength(response.data.data.tests.length || 0);
      setLabCart(response.data.data.tests);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    handleAddToCart,
    addToCartMutation,
    handleRemoveFromCart,
    removeFromCartMutation,
    fetchLabCart,
    labCartLength,
    setLabCartLength,
  };
};
export default useLabCart;
