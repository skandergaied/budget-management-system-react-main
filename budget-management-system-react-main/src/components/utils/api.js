
import axios from "axios";
import Cookies from "js-cookie";

export const fetchData = async (url) => {
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("No token found. User is not authenticated.");
  }

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
