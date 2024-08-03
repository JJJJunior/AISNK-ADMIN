import axios from "axios";
import { CollectionType, ProductType, UserType } from "./types";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

type CookiesType = any;

export const login = async (values: UserType) => {
  try {
    return await axios.post("/login", values);
  } catch (err) {
    console.log("[login_POST]...", err);
    return Promise.reject(err);
  }
};

export const register = async (values: UserType, cookies: CookiesType) => {
  axios.defaults.headers.common = {
    Authorization: `${cookies.Authorization}`,
  };
  try {
    return await axios.post("/signup", values);
  } catch (err) {
    console.log("[register_POST]...", err);
    return Promise.reject(err);
  }
};

export const validate = async (cookies: CookiesType) => {
  axios.defaults.headers.common = {
    Authorization: `${cookies.Authorization}`,
  };
  try {
    return await axios.get("/validate");
  } catch (err) {
    console.log("[validate_GET]...", err);
    return Promise.reject(err);
  }
};

export const getCollectionStatus = async () => {
  try {
    return await axios.get("/collection_status");
  } catch (err) {
    console.log("[getCollectionStatus_GET]...", err);
    return Promise.reject(err);
  }
};

export const getCollectionDetails = async (id: string) => {
  try {
    return await axios.get(`/collections/${id}`);
  } catch (err) {
    console.log("[getCollectionDetails_GET]...", err);
    return Promise.reject(err);
  }
};

export const getCollections = async () => {
  try {
    return await axios.get("/collections");
  } catch (err) {
    console.log("[getCollections_GET]...", err);
    return Promise.reject(err);
  }
};

export const addCollection = async (newCollection: CollectionType, cookies: CookiesType) => {
  axios.defaults.headers.common = {
    Authorization: `${cookies.Authorization}`,
  };
  try {
    return await axios.post("/collections", newCollection);
  } catch (err) {
    console.log("[addCollection_POST]...", err);
    return Promise.reject(err);
  }
};

export const updateCollection = async (collectionId: number, newCollection: CollectionType, cookies: CookiesType) => {
  axios.defaults.headers.common = {
    Authorization: `${cookies.Authorization}`,
  };
  try {
    return await axios.put(`/collections/${collectionId}`, newCollection);
  } catch (err) {
    console.log("[editCollection_PUT]...", err);
    return Promise.reject(err);
  }
};

export const deleteCollection = async (collectionId: number, cookies: CookiesType) => {
  try {
    axios.defaults.headers.common = {
      Authorization: `${cookies.Authorization}`,
    };
    return await axios.delete(`/collections/${collectionId}`);
  } catch (err) {
    console.log("[deleteCollection_DELETE]...", err);
    return Promise.reject(err);
  }
};

export const getProducts = async () => {
  try {
    return await axios.get("/products");
  } catch (err) {
    console.log("[getProducts_GET]...", err);
    return Promise.reject(err);
  }
};

export const getProductStatus = async () => {
  try {
    return await axios.get("/product_status");
  } catch (err) {
    console.log("[getProductStatus_GET]...", err);
    return Promise.reject(err);
  }
};

export const addProduct = async (product: ProductType, cookies: CookiesType) => {
  axios.defaults.headers.common = {
    Authorization: `${cookies.Authorization}`,
  };
  try {
    return await axios.post("/products", product);
  } catch (err) {
    console.log("[addProduct_POST]...", err);
    return Promise.reject(err);
  }
};

export const getProductDetails = async (id: string) => {
  try {
    return await axios.get(`/products/${id}`);
  } catch (err) {
    console.log("[getProductDetails_GET]...", err);
    return Promise.reject(err);
  }
};

export const updateProduct = async (productId: number, product: ProductType, cookies: CookiesType) => {
  axios.defaults.headers.common = {
    Authorization: `${cookies.Authorization}`,
  };
  try {
    return await axios.put(`/products/${productId}`, product);
  } catch (err) {
    console.log("[editProduct_PUT]...", err);
    return Promise.reject(err);
  }
};

export const deleteProduct = async (productId: number, cookies: CookiesType) => {
  try {
    axios.defaults.headers.common = {
      Authorization: `${cookies.Authorization}`,
    };
    return await axios.delete(`/products/${productId}`);
  } catch (err) {
    console.log("[deleteProduct_DELETE]...", err);
    return Promise.reject(err);
  }
};
