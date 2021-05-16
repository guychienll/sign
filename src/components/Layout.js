import React from "react";
import { Reset } from "styled-reset";
import "antd/dist/antd.css";
import { Layout as AntLayout } from "antd";

const { Content, Footer } = AntLayout;

const Layout = ({ children }) => {
  return (
    <div style={{ display: "flex", width: "100%", minHeight: "100vh" }}>
      <Reset />
      <AntLayout>
        <Content
          style={{
            display: "flex",
            flexDirection: "column",
            maxHeight: `calc(100vh - 62px)`,
            overflow: "auto",
          }}
        >
          {children}
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Sign ©2021 Created by{" "}
          <a href="https://github.com/guychienll">@guychienll</a> &{" "}
          <a href="https://github.com/riljian">@riljian</a>
        </Footer>
      </AntLayout>
    </div>
  );
};

export default Layout;
