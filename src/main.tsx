import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ConfigProvider } from "antd";
import Layout from "./pages/Layout.tsx";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Collections from "./pages/collections/Collections.tsx";
import Products from "./pages/products/Products.tsx";
import Orders from "./pages/Orders.tsx";
import Customers from "./components/Customers.tsx";
import Users from "./pages/Users.tsx";
import { CookiesProvider } from "react-cookie";
import NewProduct from "./pages/products/NewProduct.tsx";
import EditProduct from "./pages/products/EditProduct.tsx";
import NewCollection from "./pages/collections/NewCollection.tsx";
import EditCollection from "./pages/collections/EditCollection.tsx";
import { AuthProvider } from "./context/AuthProvider.tsx";
import SystemLogs from "./pages/SystemLogs.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <Layout />
      </AuthProvider>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/collections",
        element: <Collections />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/orders",
        element: <Orders />,
      },
      {
        path: "/customers",
        element: <Customers />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/logs",
        element: <SystemLogs />,
      },
      {
        path: "/collections/new",
        element: <NewCollection />,
      },
      {
        path: "/collections/:collectionId",
        element: <EditCollection />,
      },
      {
        path: "/products/:productId",
        element: <EditProduct />,
      },
      {
        path: "/products/new",
        element: <NewProduct />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          // Seed Token，影响范围大
          colorPrimary: "#1677ff",
          borderRadius: 4,

          // 派生变量，影响范围小
          colorBgContainer: "#f5f5f5",
        },
      }}
    >
      <CookiesProvider defaultSetOptions={{ path: "/" }}>
        <RouterProvider router={router}></RouterProvider>
      </CookiesProvider>
    </ConfigProvider>
  </React.StrictMode>
);
