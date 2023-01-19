import React from "react";
import { useRouter } from "next/router";
import Sketch from "../components/Sketch";

export const meta = {
  name: "Circle Clock",
  created: "2021-10-12",
};

const CircleClock = () => {
  const { query } = useRouter();

  const { secondsOffsetRatio, stepAngle } = new URLSearchParams(query);
  let darkBg =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false;

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight);

    const fps = stepAngle ? 360 / stepAngle / 60 : 25;
    p5.frameRate(fps);
    p5.noStroke();
  };

  const draw = (p5, canvasParentRef) => {
    p5.clear();
    p5.background(darkBg ? 0 : 255);

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const millis = now.getMilliseconds();
    const minSide = Math.min(p5.width, p5.height);
    const centerX = p5.width / 2;
    const centerY = p5.height / 2;

    const clockR = minSide * 0.4;
    // 3/4 2/3 1/2 design
    const hoursR = clockR * (3 / 4);
    const minutesR = hoursR * (2 / 3);
    const secondOffset = secondsOffsetRatio ? minutesR * secondsOffsetRatio : 0;
    const secondsR = minutesR * (1 / 2) + secondOffset;

    const hoursA = p5.map(
      (hours % 12) + p5.map(minutes, 0, 60, 0, 1),
      0,
      12,
      -p5.HALF_PI,
      p5.TWO_PI - p5.HALF_PI
    );
    const minutesA = p5.map(
      minutes + p5.map(seconds, 0, 60, 0, 1),
      0,
      60,
      -p5.HALF_PI,
      p5.TWO_PI - p5.HALF_PI
    );
    const secondsA = p5.map(
      seconds + p5.map(millis, 0, 1000, 0, 1),
      0,
      60,
      -p5.HALF_PI,
      p5.TWO_PI - p5.HALF_PI
    );

    const posOnOuter = pointOnCircle(centerX, centerY, hoursA, clockR);
    const hoursCenter = pointOnCircle(
      posOnOuter.x,
      posOnOuter.y,
      hoursA + p5.PI,
      hoursR
    );
    const posOnHours = pointOnCircle(
      hoursCenter.x,
      hoursCenter.y,
      minutesA,
      hoursR
    );
    const minutesCenter = pointOnCircle(
      posOnHours.x,
      posOnHours.y,
      minutesA + p5.PI,
      minutesR
    );
    const posOnMinutes = pointOnCircle(
      minutesCenter.x,
      minutesCenter.y,
      secondsA,
      minutesR
    );
    const secondsCenter = pointOnCircle(
      posOnMinutes.x,
      posOnMinutes.y,
      secondsA + p5.PI,
      secondsR
    );

    p5.fill(darkBg ? 255 : 0);
    p5.ellipse(centerX, centerY, clockR * 2, clockR * 2);
    p5.fill(darkBg ? 0 : 255);
    p5.ellipse(hoursCenter.x, hoursCenter.y, hoursR * 2, hoursR * 2);
    p5.fill(darkBg ? 255 : 0);
    p5.ellipse(minutesCenter.x, minutesCenter.y, minutesR * 2, minutesR * 2);
    p5.fill(darkBg ? 0 : 255);
    p5.ellipse(secondsCenter.x, secondsCenter.y, secondsR * 2, secondsR * 2);
  };

  const windowResized = () => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };

  const doubleClicked = () => {
    darkBg = !darkBg;
  };

  const pointOnCircle = (x, y, angle, radius) => {
    return {
      x: radius * Math.cos(angle) + x,
      y: radius * Math.sin(angle) + y,
    };
  };

  return (
    <Sketch
      setup={setup}
      draw={draw}
      windowResized={windowResized}
      doubleClicked={doubleClicked}
    />
  );
};

export default CircleClock;
