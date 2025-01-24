import { useState, createContext, useContext, useEffect } from "react";
import apiInstance from "@/hooks/useAxiosPrivate";
import { useAuth } from "./AuthContext";

export const PharmacyContext = createContext();

export const PharmacyProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartLength, setCartLength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { authState } = useAuth();
  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const response = await apiInstance.get("/pharmacy/getcart");
      setCartLength(response.data.data.length);
      setCartItems(response.data.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (authState.token !== null) {
      fetchCart();
    }
  }, []);

  return (
    <PharmacyContext.Provider
      value={{
        cartItems,
        setCartItems,
        cartLength,
        isLoading,
        fetchCart,
        setCartLength
      }}
    >
      {children}
    </PharmacyContext.Provider>
  );
};

export const usePharmacyContext = () => useContext(PharmacyContext);
