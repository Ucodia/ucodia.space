import React from "react";
import { addDecorator } from "@storybook/react";
import { useDarkMode } from "storybook-dark-mode";
import { ThemeContext } from "styled-components";
import AppContext from "../src/components/AppContext";
import { defaultTheme, darkTheme } from "../src/themes";

const ThemeWrapper = ({ children }) => {
  return (
    <ThemeContext.Provider value={useDarkMode() ? darkTheme : defaultTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

addDecorator(storyFn => (
  <AppContext>
    <ThemeWrapper>{storyFn()}</ThemeWrapper>
  </AppContext>
));
