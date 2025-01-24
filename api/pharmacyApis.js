import axios from "axios";
import { BASE_URL } from "../config";

const fetchCategories = async (first) => {
  try {
    const response = await axios.get(`${BASE_URL}/product/getcategory`);
    return response.data.data;
  } catch (err) {
    console.error("Error fetching categories:", err);
    throw err;
  }
};

export { fetchCategories };
