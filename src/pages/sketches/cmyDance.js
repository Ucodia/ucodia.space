import autoStretchP5 from "../../utils/autoStretchP5";
import presets from "./cmyDancePresets.json";

export const meta = {
  slug: "cmy-dance",
  name: "CMY Dance",
  created: "2023-02-12",
};

function f(xs, ys, t) {
  return [
    xs.reduce((acc, [tx, fx]) => (acc += Math.sin(t * (1 / tx)) * fx), 0),
    ys.reduce((acc, [ty, fy]) => (acc += Math.cos(t * (1 / ty)) * fy), 0),
  ];
}

const cmyDance = (sketch) => {
  const { preset = 0 } = getURLParams();
  const sx = {
    set: presets[Math.min(preset, presets.length - 1)],
    inc: 1 / 4,
    n: 16,
    opacity: 0.6,
  };

  const palette = [
    [0, 174, 239],
    [255, 242, 0],
    [236, 0, 140],
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
  }

  sketch.draw = (ctx) => {
    if (!ctx) ctx = sketch;

    ctx.clear();
    ctx.background("black");
    ctx.translate(ctx.width / 2, ctx.height / 2);
    ctx.scale(realScale - scaleOffset);
    ctx.strokeWeight(5);

    if (ctx.mouseIsPressed) {
      sx.inc = ctx.map(ctx.mouseX, 0, ctx.width, -1, 1);
      sx.n = Math.round(ctx.map(ctx.mouseY, 0, ctx.height, 3, 64));
    }
    t += sx.inc;

    for (let i = 0; i < sx.n; i++) {
      const tInc = i * 1.5;
      for (let j = 0; j < sx.set.length; j++) {
        const [r, g, b] = palette[j % palette.length];
        ctx.stroke(`rgba(${r},${g},${b},${sx.opacity})`);
        ctx.line(
          ...f(...sx.set[j][0], t + tInc),
          ...f(...sx.set[j][1], t + tInc)
        );
      }
    }
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
        svg.save(`cmy-dance-${Math.round(t)}.svg`);
        break;
      }
      case "g": {
        sx.set = getRandomSet();
        layout();
        break;
      }
      default: {
      }
    }
  };
};

function getRandomSet() {
  const getRandomTF = () => [getRandomInt(5, 50), getRandomInt(-300, 300)];
  const getRandomParams = () => [
    [...Array.from(Array(getRandomInt(1, 6)).keys()).map(getRandomTF)],
    [...Array.from(Array(getRandomInt(1, 6)).keys()).map(getRandomTF)],
  ];
  return [
    [getRandomParams(), getRandomParams()],
    [getRandomParams(), getRandomParams()],
    [getRandomParams(), getRandomParams()],
  ];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getURLParams() {
  return Object.fromEntries(new URLSearchParams(window.location.search));
}

export default cmyDance;
