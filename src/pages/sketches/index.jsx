import React from "react";
import U5Wrapper from "../../components/U5Wrapper";
import diamonds from "./diamonds";
import circuit from "./circuit";
import dizzyWaves from "./dizzyWaves";
import area715 from "./area715";
import illusions from "./illusions";
import lookAbove from "./lookAbove";
import vintage from "./vintage";
import scales from "./scales";
import drawbot from "./drawbot";
import revolutions from "./revolutions";
import fittestBubleBath from "./fittestBubbleBath";
import circleClock from "./circleClock";
import lorenz from "./lorenz";
import cmyDance from "./cmyDance";
import styled from "styled-components";
const P5Wrapper = React.lazy(() => import(`../../components/P5Wrapper`));

const u5Sketches = {
  diamonds,
  "circle-clock": circleClock,
};
const p5Sketches = {
  circuit,
  "dizzy-waves": dizzyWaves,
  area715,
  illusions,
  "look-above": lookAbove,
  vintage,
  scales,
  drawbot,
  revolutions,
  "fittest-bubble-bath": fittestBubleBath,
  lorenz: lorenz,
  "cmy-dance": cmyDance,
};

const Columns = styled.div`
  display: grid;
  grid-template-columns: 800px 800px;
`;

const wrappedSketches = {};
for (const key in u5Sketches) {
  wrappedSketches[key] = (
    <Columns>
      <U5Wrapper sketch={u5Sketches[key]} />
      <React.Suspense fallback={<>...</>}>
        <P5Wrapper sketch={u5Sketches[key]} />
      </React.Suspense>
    </Columns>
  );
}
for (const key in p5Sketches) {
  wrappedSketches[key] = (
    <React.Suspense fallback={<>...</>}>
      <P5Wrapper sketch={p5Sketches[key]} />
    </React.Suspense>
  );
}

export default wrappedSketches;
