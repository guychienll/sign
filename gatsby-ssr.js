import React from "react";
import { Root, Container } from "./src/Root";

export const wrapPageElement = ({ element, props }) => (
  <Container {...props}>{element}</Container>
);

export const wrapRootElement = ({ element }) => <Root>{element}</Root>;
