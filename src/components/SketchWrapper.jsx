import React from "react";
import useURLParams from "../hooks/useURLParams";
import U5Wrapper from "./U5Wrapper";
import TwoWrapper from "./TwoWrapper";

const P5Wrapper = React.lazy(() => import(`./P5Wrapper`));

const SketchWrapper = ({ sketch, renderer = "p5" }) => {
  const urlParams = useURLParams();

  if (
    (renderer === "u5" || urlParams.renderer === "u5") &&
    urlParams.renderer !== "p5"
  ) {
    return <U5Wrapper sketch={sketch} />;
  } else if (renderer === "two") {
    return <TwoWrapper sketch={sketch} />;
  }

  return (
    <React.Suspense fallback={<>...</>}>
      <P5Wrapper sketch={sketch} />
    </React.Suspense>
  );
};

export default SketchWrapper;
