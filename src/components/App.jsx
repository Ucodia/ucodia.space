import React from "react";
import { Routes, Route } from "react-router-dom";
import styled from "styled-components";
import Page from "./Page";
import Home from "./Home";
import Alert from "./Alert";
import pages from "../pages";
import mdxPages from "../mdx-pages";

const FullScreen = styled.div`
  width: 100vw;
  height: 100vh;
  height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        exact
        element={
          <Page title="You're Home">
            <Home />
          </Page>
        }
      />
      {Object.keys(pages).map((page) => {
        return (
          <Route
            key={page}
            path={`/${page}`}
            element={
              <Page title={page}>
                <FullScreen>{pages[page]}</FullScreen>
              </Page>
            }
          />
        );
      })}
      {Object.keys(mdxPages).map((page) => {
        return (
          <Route
            key={page}
            path={`/${page}`}
            element={<Page title={page}>{mdxPages[page]}</Page>}
          />
        );
      })}
      <Route
        path="*"
        element={
          <Page title="404">
            <FullScreen>
              <Alert title="404">
                <p>Ceci n'est pas une page.</p>
              </Alert>
            </FullScreen>
          </Page>
        }
      />
    </Routes>
  );
};

export default App;
