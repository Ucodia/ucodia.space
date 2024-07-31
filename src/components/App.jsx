import React from "react";
import { Routes, Route } from "react-router-dom";
import Page from "./Page";
import Home from "./Home";
import Alert from "./Alert";
import pages from "../pages";
import ExternalRedirect from "./ExternalRedirect";

const FullScreen = ({ children }) => (
  <div className="w-screen h-screen flex items-center justify-center">
    {children}
  </div>
);

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
      <Route
        path="/contact"
        exact
        element={<ExternalRedirect to="https://linktr.ee/ucodia" />}
      />
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