import axios from "axios";
import { BASE_URL } from "../config";
import apiInstance from "../hooks/useAxiosPrivate";

const fetchLabTests = async (first, token) => {
  try {
    let response;

    if (token) {
      response = await apiInstance.post("/labtest/gettestswithauth", { first });
    } else {
      response = await axios.post(`${BASE_URL}/labtest/getalltests`, { first });
    }
    return response.data.data;
  } catch (err) {
    console.error("Error fetching lab tests:", err);
    throw err;
  }
};
const fetchPackages = async (first, token) => {
  try {
    let response;
    if (token) {
      response = await apiInstance.post("/labtest/getpackageswithauth", {
        first,
      });
    } else {
      response = await axios.post(`${BASE_URL}/labtest/getallpackages`, {
        first,
      });
    }
    return response.data.data;
  } catch (err) {
    console.error("Error fetching packages:", err);
    throw err;
  }
};
const fetchSingleTest = async (id, token) => {
  try {
    let response;
    if (token) {
      response = await apiInstance.post(`/labtest/testdetailwithauth`, {
        id: parseInt(id),
      });
    } else {
      response = await axios.post(`${BASE_URL}/labtest/testdetail`, {
        id: parseInt(id),
      });
    }
    return response.data.data;
  } catch (err) {
    // console.log(err.response.data.message)
    console.error("Error fetching packages:", err);
    throw err;
  }
};
const fetchSinglePackage = async (id, token) => {
  try {
    let response;
    if (token) {
      response = await apiInstance.post(`/labtest/packagedetailwithauth`, {
        id: parseInt(id),
      });
    } else {
      response = await axios.post(`${BASE_URL}/labtest/packagedetail`, {
        id: parseInt(id),
      });
    }
    return response.data.data;
  } catch (err) {
    console.error("Error fetching packages:", err);
    throw err;
  }
};
const fetchLabCart = async () => {
  try {
    const response = await apiInstance.get(`/labtest/gettestCart`);
    return response.data.data;
  } catch (err) {
    console.error("Error fetching lab cart:", err);
    throw err;
  }
};
const addTestToCart = async (test_number) => {
  try {
    const response = await apiInstance.post("/labtest/testToCart", {
      test_number,
    });
    return response.data.message;
  } catch (err) {
    console.error("Error adding to lab cart:", err);
    throw err;
  }
};
const removeFromCart = async (test_number) => {
  try {
    const response = await apiInstance.post("/labtest/removeTestFromCart", {
      test_number,
    });
    return response.data.message;
  } catch (err) {
    console.error("Error adding to lab cart:", err);
    throw err;
  }
};

export {
  fetchLabTests,
  fetchPackages,
  fetchSingleTest,
  fetchSinglePackage,
  fetchLabCart,
  addTestToCart,
  removeFromCart,
};
