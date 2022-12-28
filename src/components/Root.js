import { createGlobalStyle } from "styled-components";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import setViewportVariables from "../utils/setViewportVariables";
import debounce from "../utils/debounce";

const StyleReset = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Helvetica', sans-serif;

    color: #000000;
    background-color: #ffffff;
    @media (prefers-color-scheme: dark) {
      color: #ededed;
      background-color: #121212;
    }
  }
`;

// define and update viewport CSS variable
setViewportVariables();
window.addEventListener("resize", debounce(setViewportVariables, 400));

const Root = () => (
  <>
    <StyleReset />
    <Router>
      <App />
    </Router>
  </>
);

export default Root;
