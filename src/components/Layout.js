import React, { useContext } from "react";
import { Reset } from "styled-reset";
import "antd/dist/antd.css";
import { Layout as AntLayout, Spin } from "antd";
import { Context } from "../Context";
import { createGlobalStyle } from "styled-components";
import { Helmet } from "react-helmet";

const { Content, Footer } = AntLayout;

const Global = createGlobalStyle`
  body * {
    font-family: 'Noto Sans TC', sans-serif;
  }
  .ant-form-item-required::before {
    display: none !important;
  }
  .ant-btn-background-ghost {
    color: #83c5be;
    border-color: #83c5be;
  }
  .ant-btn-primary, .ant-btn-primary:hover {
    background-color: #83c5be;
    border-color: #83c5be;
  }
`;

const Layout = ({ children }) => {
  const app = useContext(Context);
  return (
    <div style={{ display: "flex", width: "100%", minHeight: "100vh" }}>
      <Reset />
      <Global />
      <Helmet title="實名制" defer={false}>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC&display=swap" rel="stylesheet" />
      </Helmet>
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
          Sign ©2021 Created by<br /><br />
          <a href="https://github.com/guychienll">@guychienll</a>&nbsp;&amp;&nbsp;<a href="https://github.com/riljian">@riljian</a>
        </Footer>
      </AntLayout>
    </div>
  );
};

export default Layout;
