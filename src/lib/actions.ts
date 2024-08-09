import axios from "axios";
import { CollectionType, LogType, ProductType, UserType } from "./types";

export const getIpInCloudflare = async () => {
  try {
    const res = await axios.get(import.meta.env.VITE_GET_IPADDRESS_Cloudflare, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: false,
    });
    // 提取 IP 地址
    const ipMatch = res.data.match(/ip=([^\n]+)/);
    const ipAddress = ipMatch ? ipMatch[1] : null;
    return ipAddress;
  } catch (err) {
    // console.log("[getIp_GET]...", err);
    return Promise.reject(err);
  }
};

export const getIpInDBIP = async () => {
  try {
    const res = await axios.get(import.meta.env.VITE_CHECK_IPADDRESS_DBIP, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: false,
    });
    return res.data;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const Loginlog = async (message: LogType) => {
  try {
    return await axios.post("/log/login", message);
  } catch (err) {
    return Promise.reject(err);
  }
};

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

export const getUserIpInDB = async (username: string) => {
  try {
    if (username === "" && username === undefined) {
      return Promise.reject("Username is required.");
    }
    const res = await axios.get(`/user/ip/${username}`);
    return res.data.ip;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const logAction = async (message: LogType) => {
  try {
    return await axios.post("/log", message);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const login = async (values: UserType) => {
  try {
    return await axios.post("/login", values);
  } catch (err) {
    // console.log("[login_POST]...", err);
    return Promise.reject(err);
  }
};

export const register = async (values: UserType) => {
  try {
    return await axios.post("/signup", values);
  } catch (err) {
    // console.log("[register_POST]...", err);
    return Promise.reject(err);
  }
};

export const validate = async () => {
  try {
    return await axios.get("/validate");
  } catch (err) {
    // console.log("[validate_GET]...", err);
    return Promise.reject(err);
  }
};

export const getCollectionStatus = async () => {
  try {
    return await axios.get("/collection_status");
  } catch (err) {
    // console.log("[getCollectionStatus_GET]...", err);
    return Promise.reject(err);
  }
};

export const getCollectionDetails = async (id: string) => {
  try {
    return await axios.get(`/collections/${id}`);
  } catch (err) {
    // console.log("[getCollectionDetails_GET]...", err);
    return Promise.reject(err);
  }
};

export const getCollections = async () => {
  try {
    return await axios.get("/collections");
  } catch (err) {
    // console.log("[getCollections_GET]...", err);
    return Promise.reject(err);
  }
};

export const addCollection = async (newCollection: CollectionType) => {
  try {
    return await axios.post("/collections", newCollection);
  } catch (err) {
    // console.log("[addCollection_POST]...", err);
    return Promise.reject(err);
  }
};

export const updateCollection = async (collectionId: number, newCollection: CollectionType) => {
  try {
    return await axios.put(`/collections/${collectionId}`, newCollection);
  } catch (err) {
    // console.log("[editCollection_PUT]...", err);
    return Promise.reject(err);
  }
};

export const deleteCollection = async (collectionId: number) => {
  try {
    return await axios.delete(`/collections/${collectionId}`);
  } catch (err) {
    // console.log("[deleteCollection_DELETE]...", err);
    return Promise.reject(err);
  }
};

export const getProducts = async () => {
  try {
    return await axios.get("/products");
  } catch (err) {
    // console.log("[getProducts_GET]...", err);
    return Promise.reject(err);
  }
};

export const getProductStatus = async () => {
  try {
    return await axios.get("/product_status");
  } catch (err) {
    // console.log("[getProductStatus_GET]...", err);
    return Promise.reject(err);
  }
};

export const addProduct = async (product: ProductType) => {
  try {
    return await axios.post("/products", product);
  } catch (err) {
    // console.log("[addProduct_POST]...", err);
    return Promise.reject(err);
  }
};

export const getProductDetails = async (id: string) => {
  try {
    return await axios.get(`/products/${id}`);
  } catch (err) {
    // console.log("[getProductDetails_GET]...", err);
    return Promise.reject(err);
  }
};

export const updateProduct = async (productId: number, product: ProductType) => {
  try {
    return await axios.put(`/products/${productId}`, product);
  } catch (err) {
    // console.log("[editProduct_PUT]...", err);
    return Promise.reject(err);
  }
};

export const deleteProduct = async (productId: number) => {
  try {
    return await axios.delete(`/products/${productId}`);
  } catch (err) {
    // console.log("[deleteProduct_DELETE]...", err);
    return Promise.reject(err);
  }
};

export const getUsers = async () => {
  try {
    return await axios.get("/users");
  } catch (err) {
    // console.log("[getUsers_GET]...", err);
    return Promise.reject(err);
  }
};

export const getSystemLogs = async () => {
  try {
    return await axios.get("/logs");
  } catch (err) {
    return Promise.reject(err);
  }
};

// 根据ip获取具体信息
export const checkIpInfo = async (ip: string) => {
  try {
    const res = await axios.get(`/logs/${ip}`);
    return res.data.ip_detail;
  } catch (err) {
    return Promise.reject(err);
  }
};
