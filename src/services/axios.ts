import { Cookies } from "react-cookie";
import axios from "axios";
import { apiUrl, tokenKey } from "../constants/common";

const cookies = new Cookies();

const instance = axios.create({
  baseURL: apiUrl,
});

const handleRemoveToken = async () => {
  try {
    await cookies.remove(tokenKey);
  } catch (error) {
    throw error;
  }
};

instance.interceptors.request.use(
  async (config) => {
    const token = await cookies.get(tokenKey);
    if (token && config.headers) {
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      handleRemoveToken();
    }
    return Promise.reject(error);
  }
);

export default instance;
