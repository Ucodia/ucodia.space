import { GUI } from "dat.gui";
import autoStretchP5 from "../../utils/autoStretchP5";
import { numericalRecipesLcg as lcg } from "../../utils/lcg";

export const meta = {
  slug: "infinite-chaos",
  name: "Infinite Chaos",
  created: "2023-02-12",
};

/**
 * Computes the next position in a system
 * as defined by a 2D quadratic function
 * @param {*} x Current x position
 * @param {*} y Current y position
 * @param {*} ax a parameters of the system
 * @param {*} ay b parameters of the system
 * @returns The next coordinate [x, y]
 */
function attractor(x, y, ax, ay) {
  return [
    ax[0] +
      ax[1] * x +
      ax[2] * x * x +
      ax[3] * x * y +
      ax[4] * y +
      ax[5] * y * y,
    ay[0] +
      ay[1] * x +
      ay[2] * x * x +
      ay[3] * x * y +
      ay[4] * y +
      ay[5] * y * y,
  ];
}

const colors = {
  black: "#000000",
  darkgrey: "#333333",
  lightgrey: "#cccccc",
  white: "#ffffff",
  cyan: "#00aeef",
  magenta: "#ec008c",
  yellow: "#fff200",
};

const defaultSx = {
  length: 100000,
  background: colors.darkgrey,
  color: colors.white,
  opacity: 0.3,
  marginRatio: 0.3,
  seed: "3vg11h8l6",
  paramsSet: {},
  attractorData: {},
  lyapunovStart: 1000,
  lyapunovEnd: 2000,
};

// seeds of interests
// 3vg11h8l6
// 1mr99uuz9
// 3r3anjk2v

const infiniteChaos = (sketch) => {
  const urlSx = getURLParams();
  const sx = { ...defaultSx, ...urlSx };

  if (!sx.seed) {
    sx.seed = randomString();
  }
  updateAttractorData();

  const gui = new GUI();
  gui.close();
  const lengthController = gui.add(sx, "length", 1000, 500000, 1);
  const bgController = gui.addColor(sx, "background");
  const colorController = gui.addColor(sx, "color");
  const opacityController = gui.add(sx, "opacity", 0, 1, 0.01);
  const seedController = gui.add(sx, "seed");

  lengthController.onFinishChange(() => {
    updateAttractorData();
    sketch.draw();
  });
  bgController.onFinishChange(() => {
    sketch.draw();
  });
  colorController.onFinishChange(() => {
    sketch.draw();
  });
  opacityController.onFinishChange(() => {
    sketch.draw();
  });
  seedController.onFinishChange(() => {
    updateAttractorData();
    sketch.draw();
  });

  const actions = {
    randomize: () => {
      debugger;
      sx.seed = randomString();
      updateAttractorData();
      sketch.draw();
    },
    save: () => {
      // const svg = sketch.createGraphics(
      //   sketch.windowWidth,
      //   sketch.windowHeight,
      //   sketch.SVG
      // );
      // sketch.draw(svg);
      // svg.save(`infinite-chaos-${sx.seed}.svg`);
      sketch.save(`infinite-chaos-${sx.seed}.png`);
    },
  };
  Object.keys(actions).forEach((name) => gui.add(actions, name));

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    autoStretchP5(sketch, layout);
    sketch.noLoop();
  };

  function layout() {}

  sketch.draw = (ctx) => {
    if (!ctx) ctx = sketch;

    ctx.clear();
    ctx.background(sx.background);
    ctx.noStroke();
    ctx.fill(`${sx.color}${opacityToHex(sx.opacity)}`);

    const { x, y, xMin, xMax, yMin, yMax } = sx.attractorData;

    const margin = ctx.width * sx.marginRatio;
    const attractorWidth = xMax - xMin;
    const attractorHeight = yMax - yMin;
    const scale = Math.min(
      (ctx.width - margin) / attractorWidth,
      (ctx.height - margin) / attractorHeight
    );
    const centerX = (ctx.width - attractorWidth * scale) / 2;
    const centerY = (ctx.height - attractorHeight * scale) / 2;
    for (let i = 0; i < x.length; i++) {
      let ix = centerX + (x[i] - xMin) * scale;
      let iy = centerY + (y[i] - yMin) * scale;
      ctx.ellipse(ix, iy, 1, 1);
    }

    sketch.noLoop();
  };

  sketch.keyPressed = () => {
    switch (sketch.key) {
      case "s": {
        break;
      }
      default: {
      }
    }
  };

  sketch.cleanup = () => {
    gui.destroy();
  };

  function updateAttractorData() {
    const rand = lcg(Math.abs(hashCode(sx.seed)));
    sx.paramsSet = createAttractorParams(rand);
    sx.attractorData = generateAttractor(sx.paramsSet, sx.length);
  }

  function createAttractorParams(rand) {
    const ax = [];
    const ay = [];
    for (let i = 0; i < 6; i++) {
      ax[i] = truncateFloat(4 * (rand() - 0.5));
      ay[i] = truncateFloat(4 * (rand() - 0.5));
    }
    const x0 = truncateFloat(rand() - 0.5);
    const y0 = truncateFloat(rand() - 0.5);

    return { ax, ay, x0, y0 };
  }

  function isChaotic() {}

  function generateAttractor({ ax, ay, x0, y0 }, n) {
    let x = [x0];
    let y = [y0];
    let xMin = Number.MAX_VALUE;
    let xMax = Number.MIN_VALUE;
    let yMin = Number.MAX_VALUE;
    let yMax = Number.MIN_VALUE;

    for (let i = 1; i < n; i++) {
      const [nextX, nextY] = attractor(x[i - 1], y[i - 1], ax, ay);
      x[i] = nextX;
      y[i] = nextY;

      xMin = Math.min(xMin, x[i]);
      yMin = Math.min(yMin, y[i]);
      xMax = Math.max(xMax, x[i]);
      yMax = Math.max(yMax, y[i]);
    }

    return { x, y, xMin, xMax, yMin, yMax };
  }
};

function opacityToHex(opacity) {
  return Math.round(Math.max(0, Math.min(1, opacity)) * 255)
    .toString(16)
    .toUpperCase()
    .padStart(2, "0");
}

function truncateFloat(num, decimalPlaces = 4) {
  return Number.parseFloat(num.toFixed(decimalPlaces));
}

function hashCode(s) {
  for (var i = 0, h = 0; i < s.length; i++)
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}

function randomInt(min, max, lcg) {
  return Math.floor(lcg() * (max - min + 1)) + min;
}

function randomString() {
  return Math.random().toString(36).substr(2, 9);
}

function getURLParams() {
  const params = new URLSearchParams(window.location.search);
  const parsedParams = {};
  for (const [key, value] of params) {
    if (/^-?\d+(\.\d+)?$/.test(value)) {
      parsedParams[key] = parseFloat(value);
    } else {
      parsedParams[key] = value;
    }
  }
  return parsedParams;
}

function setURLParams(obj) {
  const url = new URL(window.location.href);
  const params = Array.from(url.searchParams.keys());
  params.forEach((param) => {
    if (!Object.hasOwnProperty.call(obj, param)) {
      url.searchParams.delete(param);
    }
  });
  for (const [key, value] of Object.entries(obj)) {
    url.searchParams.set(key, value);
  }
  window.history.pushState(null, "", url);
}

export default infiniteChaos;
