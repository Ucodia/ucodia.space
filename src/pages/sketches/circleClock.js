import autoStretchP5 from "../../utils/autoStretchP5";

export const meta = {
  name: "Circle Clock",
  created: "2021-10-12",
};

const circleClock = (sketch) => {
  const noSeconds = new URLSearchParams(window.location.search).has(
    "noSeconds"
  );
  const secondsEnabled = !noSeconds;
  let darkBg = window.matchMedia("(prefers-color-scheme: dark)").matches;

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    sketch.frameRate(noSeconds ? 1 : 25);
    sketch.noStroke();
    autoStretchP5(sketch);
  };

  sketch.draw = () => {
    sketch.background(darkBg ? "black" : "white");

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const millis = now.getMilliseconds();
    const minSide = Math.min(sketch.width, sketch.height);
    const centerX = sketch.width / 2;
    const centerY = sketch.height / 2;

    const clockR = minSide * 0.4;
    // 3/4 2/3 1/2 design
    const hoursR = clockR * (secondsEnabled ? 3 / 4 : 2 / 3);
    const minutesR = hoursR * (secondsEnabled ? 2 / 3 : 1 / 2);
    const secondsR = minutesR * (1 / 2);

    const hoursA = sketch.map(
      (hours % 12) + sketch.map(minutes, 0, 60, 0, 1),
      0,
      12,
      -sketch.HALF_PI,
      sketch.TWO_PI - sketch.HALF_PI
    );
    const minutesA = sketch.map(
      minutes + sketch.map(seconds, 0, 60, 0, 1),
      0,
      60,
      -sketch.HALF_PI,
      sketch.TWO_PI - sketch.HALF_PI
    );
    const secondsA = sketch.map(
      seconds + sketch.map(millis, 0, 1000, 0, 1),
      0,
      60,
      -sketch.HALF_PI,
      sketch.TWO_PI - sketch.HALF_PI
    );

    const posOnOuter = pointOnCircle(centerX, centerY, hoursA, clockR);
    const hoursCenter = pointOnCircle(
      ...posOnOuter,
      hoursA + sketch.PI,
      hoursR
    );
    const posOnHours = pointOnCircle(...hoursCenter, minutesA, hoursR);
    const minutesCenter = pointOnCircle(
      ...posOnHours,
      minutesA + sketch.PI,
      minutesR
    );
    const posOnMinutes = pointOnCircle(...minutesCenter, secondsA, minutesR);
    const secondsCenter = pointOnCircle(
      ...posOnMinutes,
      secondsA + sketch.PI,
      secondsR
    );

    sketch.fill(darkBg ? "white" : "black");
    sketch.ellipse(centerX, centerY, clockR * 2, clockR * 2);
    sketch.fill(darkBg ? "black" : "white");
    sketch.ellipse(...hoursCenter, hoursR * 2, hoursR * 2);
    sketch.fill(darkBg ? "white" : "black");
    sketch.ellipse(...minutesCenter, minutesR * 2, minutesR * 2);
    if (secondsEnabled) {
      sketch.fill(darkBg ? "black" : "white");
      sketch.ellipse(...secondsCenter, secondsR * 2, secondsR * 2);
    }
  };

  sketch.doubleClicked = () => {
    darkBg = !darkBg;
  };

  const pointOnCircle = (x, y, angle, radius) => [
    radius * Math.cos(angle) + x,
    radius * Math.sin(angle) + y,
  ];
};

export default circleClock;
