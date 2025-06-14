import { GUI } from "lil-gui";
import p5plotSvg from "p5.plotsvg";
import autoStretchP5 from "@/utils/auto-stretch-p5";
import hsvToHex from "@/utils/hsv-to-hex";

export const meta = {
  name: "Squircle",
  created: "2021-11-16",
};

const defaultSx = {
  lineCount: 18,
  marginRatio: 0.2,
  thickness: 2,
  squareness: 1,
  background: "#fff",
  stroke: "#000",
  transparent: true,
  noiseSeed: 2,
  noiseRes: 1 / 20,
  radiusFn: "linear",
  radiusInc: 30,
  radiusReverse: false,
  rotateFn: "linear",
  rotateInc: (Math.PI * 2) / 120,
  rotateReverse: false,
  translateFn: "none",
  translateInc: 3,
  translateReverse: false,
};

const squircle = (sketch) => {
  const urlSx = getURLParams();
  const sx = { ...defaultSx, ...urlSx };

  const gui = new GUI();
  gui.close();
  gui.add(sx, "lineCount", 3, 500, 1);
  gui.add(sx, "thickness", 0.1, 10, 0.1);
  gui.add(sx, "squareness", 0, 1, 0.01);
  gui.add(sx, "marginRatio", 0, 1, 0.01);
  gui.addColor(sx, "background");
  gui.addColor(sx, "stroke");
  gui.add(sx, "transparent");

  const noiseFolder = gui.addFolder("noise");
  noiseFolder.open();
  noiseFolder.add(sx, "noiseSeed", 0, 10000, 1);
  noiseFolder.add(sx, "noiseRes", 0.001, 1, 0.001);

  const radiusFolder = gui.addFolder("radius");
  radiusFolder.open();
  radiusFolder.add(sx, "radiusFn", ["none", "fixed", "linear"]);
  radiusFolder.add(sx, "radiusInc", 1, 100);
  radiusFolder.add(sx, "radiusReverse");

  const rotateFolder = gui.addFolder("rotate");
  rotateFolder.open();
  rotateFolder.add(sx, "rotateFn", ["none", "linear", "sin", "noise"]);
  rotateFolder.add(sx, "rotateInc", 0, Math.PI / 4);
  rotateFolder.add(sx, "rotateReverse");

  const translateFolder = gui.addFolder("translate");
  translateFolder.open();
  translateFolder.add(sx, "translateFn", ["none", "fixed", "linear"]);
  translateFolder.add(sx, "translateInc", -500, 500, 0.01);
  translateFolder.add(sx, "translateReverse");
  const actions = {
    randomize: () => {
      randomizeFeatures();
      sketch.draw();
    },
    savePlotter: () => {
      p5plotSvg.beginRecordSVG(sketch, `squircle.svg`);
      sketch.draw();
      p5plotSvg.endRecordSVG();
    },
    saveImage: () => {
      sketch.save(`squircle.png`);
    },
    shareUrl: () => {
      const urlParams = {};
      Object.keys(defaultSx).forEach((key) => {
        const value = sx[key];
        if (value !== defaultSx[key]) {
          urlParams[key] = value;
        }
      });
      const url = setURLParams(urlParams);
      copyToClipboard(url);
    },
  };
  Object.keys(actions).forEach((name) => gui.add(actions, name));

  const data = { colors: {}, palettes: {} };

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    sketch.colorMode(sketch.HSB);
    sketch.rectMode(sketch.CENTER);

    data.colors = {
      black: "#000000",
      white: "#ffffff",
    };
    data.palettes = {
      bw: [data.colors.black, data.colors.white],
    };

    if (Object.entries(urlSx).length === 0) {
      randomizeFeatures();
    }
    autoStretchP5(sketch);
  };

  sketch.keyPressed = () => {
    switch (sketch.key) {
      case "s": {
        actions.saveImage();
        break;
      }
      case "p": {
        actions.savePlotter();
        break;
      }
      case "n": {
        actions.randomize();
      }
    }
  };

  sketch.draw = () => {
    sketch.clear();
    sketch.background(sx.background);
    sketch.stroke(sx.stroke);
    sketch.strokeWeight(sx.thickness);
    if (sx.transparent) {
      sketch.noFill();
    } else {
      sketch.fill(sx.background);
    }

    const minSide = getMinSide();
    const portrait = minSide === sketch.width;
    const maxWidth = minSide * (1 - sx.marginRatio);
    const minWidth = minSide * 0.01;
    const inc = (maxWidth - minWidth) / (sx.lineCount - 1);

    for (let i = 0; i < sx.lineCount; i++) {
      const rot = getRotation(sx, i);
      const trans = getTranslation(sx, i);
      const rads = getRadiuses(sx, i);
      const w = maxWidth - i * inc;

      sketch.push();
      sketch.translate(sketch.width / 2, sketch.height / 2);
      sketch.rotate(rot);
      sketch.translate(-sketch.width / 2 + trans, -sketch.height / 2 + trans);
      sketch.rect(
        sketch.width / 2,
        sketch.height / 2,
        portrait ? w * sx.squareness : w,
        portrait ? w : w * sx.squareness,
        ...rads
      );
      sketch.pop();
    }

    // sketch.noLoop();
  };

  sketch.cleanup = () => {
    gui.destroy();
  };

  function getMinSide() {
    return Math.min(sketch.width, sketch.height);
  }

  function getRotation(sx, i) {
    switch (sx.rotateFn) {
      case "linear": {
        return sx.rotateInc * i * (sx.rotateReverse ? -1 : 1);
      }
      case "sin": {
        const period = sx.lineCount;
        const pos = sketch.map(i % period, 0, period, 0, sketch.TWO_PI);
        const factor = sketch.map(Math.sin(pos), 0, 1, -1, 1);
        return (sx.rotateInc / (period * 0.3)) * 4 * i * factor;
      }
      case "noise": {
        sketch.noiseSeed(sx.noiseSeed);
        return (
          sx.rotateInc *
          sketch.map(sketch.noise(i * sx.noiseRes), 0, 1, -0.5, 0.5) *
          10
        );
      }
      default: {
        return 0;
      }
    }
  }

  function getTranslation(sx, i) {
    switch (sx.translateFn) {
      case "fixed": {
        return sx.translateInc;
      }
      case "linear": {
        return sx.translateInc * i * (sx.translateReverse ? -1 : 1);
      }
      default: {
        return 0;
      }
    }
  }

  function getRadiuses(sx, i) {
    switch (sx.radiusFn) {
      case "fixed": {
        return [sx.radiusInc, sx.radiusInc, sx.radiusInc, sx.radiusInc];
      }
      case "linear": {
        const r = sx.radiusReverse
          ? sketch.map(i, 0, sx.lineCount - 1, getMinSide() * 0.1, 0)
          : sketch.map(i, 0, sx.lineCount - 1, 0, getMinSide() * 0.1);
        return [r, r, r, r];
      }
      default: {
        return [0, 0, 0, 0];
      }
    }
  }

  // palette generation

  function hueDivisions(offset, n, hueMax = 360) {
    const hues = [];
    const inc = hueMax / n;
    for (let i = 0; i < n; i++) {
      hues.push(Math.round((offset * hueMax + i * inc) % hueMax));
    }
    return hues;
  }

  function bw(offset) {
    return offset < 0.5
      ? data.palettes.bw.slice()
      : data.palettes.bw.slice().reverse();
  }

  function complementary(offset) {
    return hueDivisions(offset, 2).map((h) => hsvToHex(h, 1, 1));
  }

  function triadic(offset) {
    return hueDivisions(offset, 3).map((h) => hsvToHex(h, 1, 1));
  }

  function analogous(offset) {
    return hueDivisions(offset, 12).map((h) => hsvToHex(h, 1, 1));
  }

  // feature generation

  function getFeature(variants) {
    const variantsByRarity = variants.sort((a, b) => a.rarity - b.rarity);
    const value = Math.random();
    let runningSum = 0;

    for (let i = 0; i < variantsByRarity.length; i++) {
      const variant = variantsByRarity[i];
      runningSum += variant.rarity;
      if (value < runningSum) {
        return {
          name: variant.name,
          value: variant.value(Math.random),
        };
      }
    }
  }

  function randomizeFeatures() {
    const densityVariants = [
      {
        name: "High",
        rarity: 1 / 30,
        value: (rand) => Math.round(sketch.map(rand(), 0, 1, 51, 100)),
      },
      {
        name: "Medium",
        rarity: 1 / 10,
        value: (rand) => Math.round(sketch.map(rand(), 0, 1, 31, 50)),
      },
      {
        name: "Low",
        rarity: 1,
        value: (rand) => Math.round(sketch.map(rand(), 0, 1, 10, 30)),
      },
    ];
    const rotationVariants = [
      {
        name: "Noisy",
        rarity: 1 / 30,
        value: () => "noise",
      },
      {
        name: "Linear",
        rarity: 2 / 5,
        value: () => "linear",
      },
      {
        name: "Sinusoid",
        rarity: 2 / 5,
        value: () => "sin",
      },
      {
        name: "None",
        rarity: 1,
        value: () => "none",
      },
    ];
    const rotationStrengthVariants = [
      {
        name: "High",
        rarity: 1 / 10,
        value: (rand) => (Math.PI * 2) / sketch.map(rand(), 0, 1, 30, 60),
      },
      {
        name: "Medium",
        rarity: 1 / 5,
        value: (rand) => (Math.PI * 2) / sketch.map(rand(), 0, 1, 60, 120),
      },
      {
        name: "Low",
        rarity: 1,
        value: (rand) => (Math.PI * 2) / sketch.map(rand(), 0, 1, 120, 360),
      },
    ];
    const radiusVariants = [
      {
        name: "Linear",
        rarity: 2 / 5,
        value: () => "linear",
      },
      {
        name: "None",
        rarity: 1,
        value: () => "none",
      },
    ];

    const paletteOffset = Math.random();
    const paletteVariants = [
      {
        name: "Complementary",
        rarity: 1 / 3,
        value: () => complementary(paletteOffset),
      },
      {
        name: "Analogous",
        rarity: 1 / 3,
        value: () => analogous(paletteOffset),
      },
      { name: "Triadic", rarity: 1, value: () => triadic(paletteOffset) },
    ];
    const paletteFeature = getFeature(paletteVariants);

    const colorVariant = [
      {
        name: "Black & White",
        rarity: 1 / 2,
        value: () => bw(paletteOffset),
      },
      { name: "Color", rarity: 1 / 2, value: () => paletteFeature.value },
    ];
    const paperColorFeature = getFeature(colorVariant);
    const inkColorFeature = getFeature(colorVariant);

    const densityFeature = getFeature(densityVariants);
    const rotationFeature = getFeature(rotationVariants);
    let rotationStrengthFeature = {
      name: "None",
      value: 0,
    };
    if (rotationFeature.value !== "none") {
      rotationStrengthFeature = getFeature(rotationStrengthVariants);
    }
    const radiusFeature = getFeature(radiusVariants);

    sx.noiseSeed = Math.floor(sketch.map(Math.random(), 0, 1, 0, 10000));
    sx.lineCount = densityFeature.value;
    sx.rotateFn = rotationFeature.value;
    sx.rotateInc = truncateFloat(rotationStrengthFeature.value, 4);
    sx.rotateReverse = Math.random() > 0.5;
    sx.radiusFn = radiusFeature.value;
    sx.background = paperColorFeature.value[0];
    sx.stroke = inkColorFeature.value[1];

    // console.log(sx);
    gui.controllersRecursive().forEach((c) => c.updateDisplay());
  }

  function truncateFloat(num, decimalPlaces = 4) {
    return Number.parseFloat(num.toFixed(decimalPlaces));
  }

  function getURLParams() {
    const params = new URLSearchParams(window.location.search);
    const parsedParams = {};
    for (const [key, value] of params) {
      if (/^-?\d+(\.\d+)?$/.test(value)) {
        parsedParams[key] = parseFloat(value);
      } else if (
        value.toLowerCase() === "true" ||
        value.toLowerCase() === "false"
      ) {
        parsedParams[key] = value.toLowerCase() === "true";
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
    window.history.replaceState(null, "", url);
    copyToClipboard(url.toString());
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Unable to copy text to clipboard", err);
    }
  }
};

export default squircle;
