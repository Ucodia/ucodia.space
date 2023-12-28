import autoStretchP5 from "../../utils/autoStretchP5";
import { numericalRecipesLcg } from "../../utils/lcg";
import presets from "./cmyDancePresets.json";

export const meta = {
  slug: "cmy-dance",
  name: "CMY Dance",
  created: "2023-02-12",
};

/***
 * Parametric equation function which returns a 2D position based on time and radial movement
 * equation. Modifiers xms = [[m1, m2], ... ] and yms = [[m1, m2], ... ] manipulates the parametric
 * equation such as
 *   x = sum(sin(t * (1 / m1)) * m2))
 *   y = sum(cos(t * (1 / m1)) * m2))
 */
function f(xms, yms, t) {
  return [
    xms.reduce((acc, [m1, m2]) => (acc += Math.sin(t * (1 / m1)) * m2), 0),
    yms.reduce((acc, [m1, m2]) => (acc += Math.cos(t * (1 / m1)) * m2), 0),
  ];
}

const cmyDance = (sketch) => {
  const { preset = 0, seed = "" } = getURLParams();
  const sx = {
    set: presets[Math.min(preset, presets.length - 1)],
    speedInc: 1 / 4,
    spaceInc: 0.5,
    thickness: 3,
    n: 500,
    maxN: 1000,
    opacity: 0.3,
    looping: true,
    seed,
  };
  if (sx.seed) {
    sx.set = getRandomSet3(sx.seed);
  }

  const toggleLooping = () => {
    sx.looping = !sx.looping;
    if (sx.looping) {
      sketch.loop();
    }
  };

  const palette = [
    [255, 242, 0], // yellow
    [236, 0, 140], // magenta
    [0, 174, 239], // cyan
  ];
  let t = 0;
  let realScale = 1;
  let scaleOffset = 0.1;

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    autoStretchP5(sketch, layout);
  };

  function layout() {
    let maxX = 0;
    let maxY = 0;
    // brute force way to find bounds
    for (let i = 1; i < 1000; i++) {
      for (let j = 0; j < sx.set.length; j++) {
        const [x1, y1] = f(...sx.set[j][0], i);
        const [x2, y2] = f(...sx.set[j][1], i);
        maxX = Math.max(maxX, x1, x2);
        maxY = Math.max(maxY, y1, y2);
      }
    }

    realScale =
      1 / Math.max((maxX * 2) / sketch.width, (maxY * 2) / sketch.height);

    sketch.clear();
    sketch.background("black");
  }

  sketch.draw = (ctx) => {
    if (!ctx) ctx = sketch;

    ctx.clear();
    ctx.background("black");
    ctx.translate(ctx.width / 2, ctx.height / 2);
    ctx.scale(realScale - scaleOffset);
    ctx.strokeWeight(sx.thickness);

    if (ctx.mouseIsPressed) {
      sx.speedInc = ctx.map(ctx.mouseX, 0, ctx.width, -1, 1);
      sx.n = Math.round(ctx.map(ctx.mouseY, 0, ctx.height, 1, sx.maxN));
    }
    t += sx.speedInc;
    // t = 0;

    for (let i = 0; i < sx.n; i++) {
      const tInc = i * sx.spaceInc;
      for (let j = 0; j < sx.set.length; j++) {
        const [r, g, b] = palette[j % palette.length];
        ctx.stroke(`rgba(${r},${g},${b},${sx.opacity})`);
        ctx.line(
          ...f(...sx.set[j][0], t + tInc),
          ...f(...sx.set[j][1], t + tInc)
        );
      }
    }

    // if (!sx.looping) {
    //   sketch.noLoop();
    // }
  };

  sketch.keyPressed = () => {
    switch (sketch.key) {
      case "s": {
        const svg = sketch.createGraphics(
          sketch.windowWidth,
          sketch.windowHeight,
          sketch.SVG
        );
        sketch.draw(svg);
        svg.save(`cmy-dance-${sx.seed}.svg`);
        break;
      }
      case "g": {
        sx.seed = getRandomString();
        setURLParam("seed", sx.seed);
        sx.set = getRandomSet(sx.seed);
        layout();
        if (!sx.looping) {
          sketch.loop();
        }
        break;
      }
      case " ": {
        toggleLooping();
        break;
      }
      default: {
      }
    }
    switch (sketch.keyCode) {
      case sketch.SPACE: {
        toggleLooping();
        break;
      }
      default:
    }
  };

  sketch.mouseWheel = (event) => {
    if (sx.spaceInc <= 0) return;
    console.log(event.delta * 0.01);
    sx.spaceInc += event.delta * 0.01;
    console.log(sx.spaceInc);
    if (sx.spaceInc < 0) sx.spaceInc = 0.001;
    console.log(sx.spaceInc);
  };
};

function getRandomSet(seed) {
  const lcg = numericalRecipesLcg(hashCode(seed));
  const getRandomTF = () => [
    getRandomInt(5, 50, lcg),
    getRandomInt(-300, 300, lcg),
  ];
  const getRandomParams = () => [
    [...Array.from(Array(getRandomInt(1, 6, lcg)).keys()).map(getRandomTF)],
    [...Array.from(Array(getRandomInt(1, 6, lcg)).keys()).map(getRandomTF)],
  ];

  const a = getRandomParams();
  const b = getRandomParams();
  const c = getRandomParams();
  const d = getRandomParams();
  const e = getRandomParams();
  const f = getRandomParams();

  return [
    [a, b],
    [c, d],
    [e, f],
  ];
}

function getRandomSet2(seed) {
  const lcg = numericalRecipesLcg(hashCode(seed));
  const getRandomTF = () => [
    getRandomInt(20, 40, lcg),
    getRandomInt(20, 40, lcg),
  ];
  const getRandomParams = () => [
    [...Array.from(Array(getRandomInt(1, 16, lcg)).keys()).map(getRandomTF)],
    [...Array.from(Array(getRandomInt(1, 16, lcg)).keys()).map(getRandomTF)],
  ];
  const a = getRandomParams();
  const b = getRandomParams();
  const c = getRandomParams();
  return [
    [a, b],
    [b, c],
    [c, a],
  ];
}

function getRandomSet3(seed) {
  const lcg = numericalRecipesLcg(hashCode(seed));
  const getRandomTF = () => [
    getRandomInt(20, 40, lcg),
    getRandomInt(-200, 200, lcg),
  ];

  const getRandomParams = () => [
    [...Array.from(Array(getRandomInt(1, 16, lcg)).keys()).map(getRandomTF)],
    [...Array.from(Array(getRandomInt(1, 16, lcg)).keys()).map(getRandomTF)],
  ];
  const a = getRandomParams();
  const b = getRandomParams();
  const c = getRandomParams();
  const d = getRandomParams();
  return [
    [a, b],
    [c, d],
  ];
}

function hashCode(str) {
  var hash = 0,
    i,
    chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  console.log(hash);
  return Math.abs(hash);
}

function getRandomInt(min, max, lcg) {
  console.log(lcg());
  return Math.floor(lcg() * (max - min + 1)) + min;
}

function getRandomString() {
  return Math.random().toString(36).substr(2, 9);
}

function getURLParams() {
  return Object.fromEntries(new URLSearchParams(window.location.search));
}

function setURLParam(name, value) {
  const url = new URL(window.location.href);
  url.searchParams.set(name, value);
  window.history.pushState(null, "", url);
}

export default cmyDance;
