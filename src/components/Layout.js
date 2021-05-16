import React, { useContext } from "react";
import { Reset } from "styled-reset";
import "antd/dist/antd.css";
import { Layout as AntLayout, Spin } from "antd";
import { Context } from "../Context";
import { createGlobalStyle } from "styled-components";

const { Content, Footer } = AntLayout;

const Global = createGlobalStyle`
  body * {
  }
`;

const Layout = ({ children }) => {
  const app = useContext(Context);
  return (
    <div style={{ display: "flex", width: "100%", minHeight: "100vh" }}>
      <Reset />
      <Global />
      <AntLayout>
        <Content
          style={{
            display: "flex",
            flexDirection: "column",
            maxHeight: `calc(100vh - 62px)`,
            overflow: "auto",
          }}
        >
          {!app.state.initialized && <Spin />}
          {app.state.initialized && children}
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
