import { createGlobalStyle } from "styled-components";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
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

const Root = () => (
  <>
    <StyleReset />
    <Router>
      <App />
    </Router>
  </>
);

export default Root;
