import React from "react";
import { Reset } from "styled-reset";
import "antd/dist/antd.css";
import { Layout as AntLayout, Menu } from "antd";
import { EnvironmentOutlined, HomeOutlined } from "@ant-design/icons";
import { navigate } from "gatsby-link";
import { URL_PATH } from "../constants";

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
                await navigate("/");
              }}
              key="1"
              icon={<HomeOutlined />}
            />

            <Menu.Item
              onClick={async () => {
                await navigate(URL_PATH.admin);
              }}
              key="2"
              icon={<EnvironmentOutlined />}
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
