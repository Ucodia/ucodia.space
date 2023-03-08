import Two from "two.js";

export const meta = {
  slug: "circle-clock-two",
  name: "Circle Clock",
  created: "2021-10-12",
  renderer: "two",
};

const circleClock = (element) => {
  const darkBg = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const backgroundColor = darkBg ? "black" : "white";
  const constrastColor = darkBg ? "white" : "black";

  const two = new Two({
    type: Two.Types.svg,
    fullscreen: true,
  }).appendTo(element);

  two.renderer.domElement.style.background = backgroundColor;

  const bodyCircle = two.makeCircle(0, 0);
  bodyCircle.fill = constrastColor;
  bodyCircle.noStroke();
  const hourCircle = two.makeCircle();
  hourCircle.fill = backgroundColor;
  hourCircle.noStroke();
  const minuteCircle = two.makeCircle();
  minuteCircle.fill = constrastColor;
  minuteCircle.noStroke();
  const secondCircle = two.makeCircle();
  secondCircle.fill = backgroundColor;
  secondCircle.noStroke();

  two.bind("resize", resize);
  two.bind("update", update);
  two.bind("dblclick", function () {
    console.log("dblclick");
  });
  resize();
  update();

  function resize() {
    console.log("resize");
    two.scene.position.set(two.width / 2, two.height / 2);
  }

  function update() {
    console.log("update");
    const bodyR = Math.min(two.width, two.height) * 0.4;
    const { hour, minute, second } = getHandsCircles(new Date(), bodyR);
    bodyCircle.radius = bodyR;
    hourCircle.position.x = hour.x;
    hourCircle.position.y = hour.y;
    hourCircle.radius = hour.r;
    minuteCircle.position.x = minute.x;
    minuteCircle.position.y = minute.y;
    minuteCircle.radius = minute.r;
    secondCircle.position.x = second.x;
    secondCircle.position.y = second.y;
    secondCircle.radius = second.r;
  }

  return two;
};

function getHandsCircles(date, radius = 1) {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const milli = date.getMilliseconds();

  const hourOffset = map(minute, 0, 60, 0, 1);
  const minuteOffset = map(second, 0, 60, 0, 1);
  const secondOffset = map(milli, 0, 1000, 0, 1);
  const hourA =
    map((hour % 12) + hourOffset, 0, 12, 0, Math.PI * 2) - Math.PI * 0.5;
  const minuteA =
    map(minute + minuteOffset, 0, 60, 0, Math.PI * 2) - Math.PI * 0.5;
  const secondA =
    map(second + secondOffset, 0, 60, 0, Math.PI * 2) - Math.PI * 0.5;

  // 3/4 2/3 1/2 design
  const hourR = radius * (3 / 4);
  const minuteR = hourR * (2 / 3);
  const secondR = minuteR * (1 / 2);

  const posOnRadius = pointOnCircle(0, 0, hourA, radius);
  const hourPos = pointOnCircle(...posOnRadius, hourA + Math.PI, hourR);
  const posOnHours = pointOnCircle(...hourPos, minuteA, hourR);
  const minutePos = pointOnCircle(...posOnHours, minuteA + Math.PI, minuteR);
  const posOnMinutes = pointOnCircle(...minutePos, secondA, minuteR);
  const secondPos = pointOnCircle(...posOnMinutes, secondA + Math.PI, secondR);

  return {
    hour: { x: hourPos[0], y: hourPos[1], r: hourR },
    minute: { x: minutePos[0], y: minutePos[1], r: minuteR },
    second: { x: secondPos[0], y: secondPos[1], r: secondR },
  };
}

function map(n, start1, stop1, start2, stop2) {
  return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

function pointOnCircle(x, y, angle, radius) {
  return [radius * Math.cos(angle) + x, radius * Math.sin(angle) + y];
}

export default circleClock;
