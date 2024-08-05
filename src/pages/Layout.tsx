import React, { useEffect, useState } from "react";
import { ContainerOutlined, DesktopOutlined, PieChartOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.ts";

const { Header, Content, Footer, Sider } = Layout;

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
  // console.log(user)
  const navigate = useNavigate();
  const pathname = window.location.pathname;

  useEffect(() => {
    if (pathname) {
      setCurrent(pathname);
    }
  }, [pathname]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, navigate, loading]);

  return (
    <Layout hasSider>
      <Sider style={siderStyle}>
        <div className="demo-logo-vertical" />
        <Menu
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          onClick={onClick}
          theme="dark"
          selectedKeys={[current]}
          items={items}
        />
      </Sider>
      <Layout style={{ marginInlineStart: 200 }}>
        <Header style={{ padding: 0, background: colorBgContainer }}></Header>
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <div
            style={{
              padding: 24,
              textAlign: "start",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {/*children在这里*/}
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Copyright ©{new Date().getFullYear()} AISNK All rights reserved.
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
