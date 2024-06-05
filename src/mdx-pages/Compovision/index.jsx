import React from "react";
import { MDXProvider } from "@mdx-js/react";
import MDXPage from "./index.mdx";
import MDXLayout from "../MDXLayout";

const components = {};

const Compovision = () => (
  <MDXProvider components={components}>
    <MDXLayout>
      <MDXPage />
    </MDXLayout>
  </MDXProvider>
);

export default Compovision;
