import React, { Fragment } from "react";
import styled from "styled-components";
import { Reset } from "styled-reset";

const S = {};
S.Layout = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: #fff;
`;

const Layout = ({ children }) => {
  return (
    <Fragment>
      <Reset />
      <S.Layout>{children}</S.Layout>
    </Fragment>
  );
};

export default Layout;
