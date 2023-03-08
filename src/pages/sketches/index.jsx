import React from "react";
import SketchWrapper from "../../components/SketchWrapper";
import * as diamonds from "./diamonds";
import * as circuit from "./circuit";
import * as dizzyWaves from "./dizzyWaves";
import * as area715 from "./area715";
import * as illusions from "./illusions";
import * as lookAbove from "./lookAbove";
import * as vintage from "./vintage";
import * as scales from "./scales";
import * as drawbot from "./drawbot";
import * as revolutions from "./revolutions";
import * as fittestBubleBath from "./fittestBubbleBath";
import * as circleClock from "./circleClock";
import * as circleClockTwo from "./circleClockTwo";
import * as lorenz from "./lorenz";
import * as cmyDance from "./cmyDance";

const sketches = [
  diamonds,
  circleClock,
  circuit,
  dizzyWaves,
  area715,
  illusions,
  lookAbove,
  vintage,
  scales,
  drawbot,
  revolutions,
  fittestBubleBath,
  lorenz,
  cmyDance,
  circleClockTwo,
];

const wrappedSketches = sketches.reduce((acc, cur) => {
  acc[cur.meta.slug] = (
    <SketchWrapper sketch={cur.default} renderer={cur.meta.renderer} />
  );
  return acc;
}, {});

export default wrappedSketches;
