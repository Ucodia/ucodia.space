import { GUI } from "dat.gui";
import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import useGui from "../hooks/useGui";

export const meta = {
  name: "Lorenz (for plotters)",
  created: "2021-01-13",
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;

  @media (prefers-color-scheme: dark) {
    background-color: #121212;
  }
`;

const Plot = styled.svg`
  width: 90%;
  height: 90%;

  path {
    fill: none;
    stroke: #121212;
  }

  @media (prefers-color-scheme: dark) {
    path {
      stroke: white;
    }
  }
`;

export const saveSVG = (svgElement, settings) => {
  if (svgElement) {
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });

    const filename = `lorenz-attractor_${Object.values(settings).join(
      "_"
    )}.svg`;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }
};

function lorenz({ x, y, z, a, b, c, dt }) {
  return {
    x: x + a * (y - x) * dt,
    y: y + (x * (b - z) - y) * dt,
    z: z + (x * y - c * z) * dt,
  };
}

function halvorsen({ x, y, z, a, dt }) {
  return {
    x: x + (-a * x - 4 * y - 4 * z - y * y) * dt,
    y: y + (-a * y - 4 * z - 4 * x - z * z) * dt,
    z: z + (-a * z - 4 * x - 4 * y - x * x) * dt,
  };
}

function sprott({ x, y, z, a, b, dt }) {
  return {
    x: x + (y + a * x * y + x * z) * dt,
    y: y + (1 - b * (x * x) + y * z) * dt,
    z: z + (x - x * x - y * y) * dt,
  };
}

function thomas({ x, y, z, a, b, dt }) {
  return {
    x: x + (Math.sin(y) - b * x) * dt,
    y: y + (Math.sin(z) - b * y) * dt,
    z: z + (Math.sin(x) - b * z) * dt,
  };
}

function getPathData(points, projection) {
  const xFn = (p) => p[projection[0]];
  const yFn = (p) => p[projection[1]];
  return `M ${points.map((p) => `${xFn(p)} ${yFn(p)}`).join(" L ")}`;
}

function getBounds(points, projection) {
  const min0 = Math.min(...points.map((p) => p[projection[0]]));
  const min1 = Math.min(...points.map((p) => p[projection[1]]));
  const max0 = Math.max(...points.map((p) => p[projection[0]]));
  const max1 = Math.max(...points.map((p) => p[projection[1]]));

  return {
    min0,
    min1,
    max0,
    max1,
    width: max0 - min0,
    height: max1 - min1,
  };
}

const getPoints = (fn, n, params, offset) => {
  const points = [];
  let currentParams = { ...params };

  for (let i = 0; i < n + offset; i++) {
    const result = fn(currentParams);
    currentParams = { ...currentParams, ...result };
    if (i > offset) points.push(result);
  }

  return points;
};

const getAttractorPoints = (settings) => {
  switch (settings.attractor) {
    case "lorenz": {
      return getPoints(
        lorenz,
        settings.pointCount,
        {
          x: settings.x,
          y: settings.y,
          z: settings.z,
          a: settings.a,
          b: settings.b,
          c: settings.c,
          dt: settings.dt,
        },
        settings.offset
      );
    }
    case "halvorsen": {
      return getPoints(
        halvorsen,
        settings.pointCount,
        {
          x: settings.x,
          y: settings.y,
          z: settings.z,
          a: settings.a,
          dt: settings.dt,
        },
        settings.offset
      );
    }
    case "sprott": {
      return getPoints(
        sprott,
        settings.pointCount,
        {
          x: settings.x,
          y: settings.y,
          z: settings.z,
          a: settings.a,
          b: settings.b,
          dt: settings.dt,
        },
        settings.offset
      );
    }
    case "thomas": {
      return getPoints(
        thomas,
        settings.pointCount,
        {
          x: 1.1,
          y: 1.1,
          z: -0.01,
          b: 0.2,
          dt: 0.2,
        },
        settings.offset
      );
    }
    default: {
    }
  }
};

const uiConfig = {
  attractor: {
    default: "lorenz",
    options: ["lorenz", "halvorsen", "sprott", "thomas"],
  },
  pointCount: {
    default: 10000,
    range: [100, 100000],
  },
  offset: {
    default: 0,
    range: [0, 10000],
  },
  projection: {
    default: "xy",
    options: ["xy", "yx", "xz", "zx", "yz", "zy"],
  },
  x: {
    default: 0.1,
    range: [-1, 1],
  },
  y: {
    default: 0,
    range: [-1, 1],
  },
  z: {
    default: -1,
    range: [-1, 1],
  },
  a: {
    default: 10,
    range: [0, 60],
  },
  b: {
    default: 28,
    range: [0, 100],
  },
  c: {
    default: 8 / 3,
    range: [0, 10],
  },
  dt: {
    default: 0.003,
    range: [0.001, 0.02],
    step: 0.0001,
  },
};

const LorenzSvg = () => {
  const svgRef = useRef(null);
  const settings = useGui({
    ...uiConfig,
    save: () => saveSVG(svgRef.current, settings),
  });
  const points = useMemo(() => getAttractorPoints(settings), [settings]);
  const bounds = useMemo(
    () => getBounds(points, settings.projection),
    [points, settings.projection]
  );
  const strokeWidth = Math.min(bounds.width, bounds.height) * 0.001;

  return (
    <Container>
      <Plot
        ref={svgRef}
        viewBox={`${bounds.min0} ${bounds.min1}
         ${bounds.width} ${bounds.height}`}
      >
        <g>
          <path
            d={getPathData(points, settings.projection)}
            strokeWidth={strokeWidth}
          />
        </g>
      </Plot>
    </Container>
  );
};

export default LorenzSvg;
