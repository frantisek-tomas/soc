import axios from "axios";
import { getBaseUrl } from "../services/baseModifier";

const createAPIInstance = () => {
  const token = localStorage.getItem("jwtToken");
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return axios.create({
    baseURL: getBaseUrl(),
    headers: headers,
  });
};

export default createAPIInstance;
