import {
  useState,
  createContext,
  useContext,
  useEffect,
  useCallback,
} from "react";
import apiInstance from "@/hooks/useAxiosPrivate";
import { useAuth } from "./AuthContext";

export const LabContext = createContext();

export const LabProvider = ({ children }) => {
  const [labCartLength, setLabCartLength] = useState(0);
  const [labCart, setLabCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { authState } = useAuth();

  const fetchLabCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiInstance.get(`/labtest/gettestCart`);
      const cart = response.data.data.tests;
      setLabCartLength(cart?.length || 0);
      setLabCart(cart);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authState.token !== null) {
      fetchLabCart();
    }
  }, []);

  return (
    <LabContext.Provider
      value={{
        labCart,
        fetchLabCart,
        labCartLength,
        setLabCartLength,
      }}
    >
      {children}
    </LabContext.Provider>
  );
};

export const useLabContext = () => useContext(LabContext);
