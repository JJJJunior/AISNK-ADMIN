import React, { useEffect, useState } from "react";
import { ContainerOutlined, DesktopOutlined, PieChartOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.ts";

const { Content, Footer, Sider } = Layout;

const siderStyle: React.CSSProperties = {
  overflow: "auto",
  height: "100vh",
  position: "fixed",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: "thin",
  scrollbarColor: "unset",
};

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  { key: "/", icon: <PieChartOutlined />, label: "首页" },
  { key: "/collections", icon: <DesktopOutlined />, label: "栏目管理" },
  { key: "/products", icon: <ContainerOutlined />, label: "产品管理" },
  { key: "/customers", icon: <ContainerOutlined />, label: "客户管理" },
  { key: "/orders", icon: <ContainerOutlined />, label: "订单管理" },
  { key: "/users", icon: <ContainerOutlined />, label: "用户管理" },
  { key: "/logout", icon: <ContainerOutlined />, label: "退出登录" },
];

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [current, setCurrent] = useState("1");
  const onClick: MenuProps["onClick"] = (e) => {
    if (e.key === "/logout") {
      logout();
      return;
    }
    setCurrent(e.key);
    navigate(e.key);
  };
  const { user, loading, logout } = useAuth();

  const navigate = useNavigate();
  const pathname = window.location.pathname;

  useEffect(() => {
    if (pathname) {
      setCurrent(pathname);
    }
  }, [pathname]);

  // console.log(user);

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/login";
    }
  }, [user, loading]);

  if (!user) {
    return null;
  }

  return (
    <Layout hasSider>
      <Sider style={siderStyle}>
        <div className="demo-logo-vertical" />
        <Menu
          defaultSelectedKeys={["1"]}
          mode="inline"
          onClick={onClick}
          theme="dark"
          selectedKeys={[current]}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Sider>
      <Layout style={{ marginInlineStart: 200 }}>
        <Content
          style={{
            margin: "6px 0px",
            padding: 16,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {/*children在这里*/}
          <Outlet />
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Copyright ©{new Date().getFullYear()} AISNK All rights reserved.
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
