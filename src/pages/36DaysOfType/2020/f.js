import cyclicIterator from "../../../utils/cyclicIterator";
import autoStretchP5 from "../../../utils/autoStretchP5";
import pointsToSegments from "../utils/pointsToSegments";

const f = (sketch) => {
  let letter = "f";
  let font;
  let points;
  let segments;
  let paths = [];
  let xoff;
  let yoff;
  let colors = [
    sketch.color(0, 174, 239, 30), // cyan
    sketch.color(255, 242, 0, 30), // yellow
    sketch.color(236, 0, 140, 30), // magenta
  ];

  sketch.preload = () => {
    font = sketch.loadFont("fonts/Righteous-Regular.ttf");
  };

  sketch.setup = () => {
    sketch.createCanvas(100, 100);
    sketch.frameRate(30);

    autoStretchP5(sketch, layout);
  };

  function layout() {
    const fontSize = sketch.height * 0.8;
    points = font.textToPoints(letter, 0, 0, fontSize, {
      sampleFactor: 1 / 2,
    });
    segments = pointsToSegments(points, 20);

    // compute offset to center letter on screen
    const bounds = font.textBounds(letter, 0, 0, fontSize);
    xoff = -bounds.x - bounds.w / 2 + sketch.width / 2;
    yoff = -bounds.y - bounds.h / 2 + sketch.height / 2;

    paths = [];
    const offsetRadius = bounds.w * 0.1;

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      for (var j = 0; j < colors.length; j++) {
        const color = colors[j];
        const speed = Math.ceil(segment.length * 0.005 * (j + 1));
        const iterator = cyclicIterator(segment);
        const length = Math.floor(
          (segment.length / (colors.length + 1)) * (colors.length - j)
        );

        const angle = (sketch.TWO_PI / colors.length) * j + sketch.QUARTER_PI;
        const offset = pointOnCircle(0, 0, angle, offsetRadius);

        paths.push({
          color,
          speed,
          iterator,
          length,
          offset,
        });
      }
    }
  }

  sketch.draw = () => {
    sketch.background("#FFFFFF");
    sketch.strokeWeight(sketch.width * 0.02);

    sketch.translate(xoff, yoff);

    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];
      sketch.stroke(path.color);

      const segmentPoints = path.iterator.cycle(path.speed).take(path.length);
      for (let j = 0; j < segmentPoints.length - 1; j++) {
        const p = segmentPoints[j];
        const pnext = segmentPoints[j + 1];
        sketch.line(
          p.x + path.offset.x,
          p.y + path.offset.y,
          pnext.x + path.offset.x,
          pnext.y + path.offset.y
        );
      }
    }

    // if (sketch.frameCount < 735) {
    //   sketch.save(
    //     `${letter}_${sketch.frameCount.toString().padStart(4, "0")}.png`
    //   );
    // }
  };

  sketch.keyTyped = () => {
    letter = sketch.key;
    layout();
  };

  function pointOnCircle(x, y, angle, radius) {
    return {
      x: radius * Math.cos(angle) + x,
      y: radius * Math.sin(angle) + y,
    };
  }
};

export default f;
