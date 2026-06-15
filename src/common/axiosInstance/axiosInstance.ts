import axios from "axios";
import { BASE_API_URL, SERVER_BASE_API_URL } from "@/common/constants";

const isServer = typeof window === "undefined";

export const axiosInstance = axios.create({
  baseURL: isServer ? SERVER_BASE_API_URL : BASE_API_URL,
});
