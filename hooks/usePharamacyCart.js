import { useState, useCallback } from "react";
import apiInstance from "./useAxiosPrivate";

const usePharamacyCart = () => {
  const [cartLength, setCartLength] = useState(0);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    try {
      const response = await apiInstance.get("/pharmacy/getcart");
      setCartLength(response.data.data.length || 0);
      setCart(response.data.data)
    } catch (err) {
      console.error("Error fetching cart:", err);
    }finally{
      setIsLoading(false)
    }
  }, []);

  return {
    cartLength,
    fetchCart,
    cart,
    setCart,
    isLoading
  };
};

export default usePharamacyCart;
