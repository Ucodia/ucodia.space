import React from "react";
import { MDXProvider } from "@mdx-js/react";
import MDXPage from "./index.mdx";

const components = {};

const Compovision = () => (
  <MDXProvider components={components}>
    <article className="prose">
      <MDXPage />
    </article>
  </MDXProvider>
);

export default Compovision;
