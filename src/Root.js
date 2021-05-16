import React from "react";
import Layout from "./components/Layout";
import { Provider } from "./Context";

export const Container = props => {
  return <Layout {...props}>{props.children}</Layout>;
};

export const Root = props => {
  return <Provider {...props}>{props.children}</Provider>;
};
