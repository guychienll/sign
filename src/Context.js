import React, { createContext, useState } from "react";

export const Context = createContext({});

let actions = {};

export const Provider = props => {
  const { children } = props;
  const [state, setState] = useState({});

  actions = {};

  return (
    <Context.Provider value={{ state, actions }}>{children}</Context.Provider>
  );
};
