import React from "react";
import { Reset } from "styled-reset";
import "antd/dist/antd.css";
import { Layout as AntLayout, Menu } from "antd";
import {
  EnvironmentOutlined,
  UserOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import { navigate } from "gatsby-link";

const { Header, Content, Footer } = AntLayout;

const Layout = ({ children }) => {
  return (
    <div style={{ display: "flex", width: "100%", minHeight: "100vh" }}>
      <Reset />
      <AntLayout>
        <Header>
          <Menu theme="dark" mode="horizontal">
            <Menu.Item
              onClick={async () => {
                await navigate("/scan");
              }}
              key="1"
              icon={<CameraOutlined />}
            />

            <Menu.Item
              onClick={async () => {
                await navigate("/location-info");
              }}
              key="2"
              icon={<EnvironmentOutlined />}
            />

            <Menu.Item
              onClick={async () => {
                await navigate("/user-info");
              }}
              key="3"
              icon={<UserOutlined />}
            />
          </Menu>
        </Header>
        <Content
          style={{
            display: "flex",
            flexDirection: "column",
            maxHeight: `calc(100vh - 126px)`,
            overflow: "auto",
          }}
        >
          {children}
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </AntLayout>
    </div>
  );
};

export default Layout;
