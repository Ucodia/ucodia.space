import autoStretchP5 from "../../../utils/autoStretchP5";
import pointsToSegments from "../utils/pointsToSegments";
import cyclicIterator from "../../../utils/cyclicIterator";

export default (sketch) => {
  let letter = "D";
  let font;
  let points;
  let segments;
  let segmentsIterators = [];
  let xoff;
  let yoff;

  sketch.preload = () => {
    font = sketch.loadFont("fonts/Righteous-Regular.ttf");
  };

  function layout() {
    const fontSize = sketch.height * 1;
    points = font.textToPoints(letter, 0, 0, fontSize, {
      sampleFactor: 1 / 2,
    });
    segments = pointsToSegments(points, 20);
    segmentsIterators = segments.map(cyclicIterator);

    // compute offset to center letter on screen
    const bounds = font.textBounds(letter, 0, 0, fontSize);
    xoff = -bounds.x - bounds.w / 2 + sketch.width / 2;
    yoff = -bounds.y - bounds.h / 2 + sketch.height / 2;
  }

  sketch.setup = () => {
    sketch.createCanvas(100, 100);
    sketch.frameRate(30);

    autoStretchP5(sketch, layout);
  };

  sketch.draw = () => {
    sketch.background("#0F146A");
    sketch.stroke("#FFBE03");
    sketch.strokeWeight(10);

    sketch.translate(xoff, yoff);

    for (const it of segmentsIterators) {
      const speed = Math.floor(it.length() * 0.03);
      const segmentPoints = it.cycle(speed).take(Math.floor(it.length() / 2));

      for (let i = 0; i < segmentPoints.length - 1; i++) {
        const p = segmentPoints[i];
        const pnext = segmentPoints[i + 1];
        sketch.line(p.x, p.y, pnext.x, pnext.y);
      }
    }

    // if (sketch.frameCount < 34) {
    //   sketch.save(
    //     `${letter}_${sketch.frameCount.toString().padStart(4, "0")}.png`
    //   );
    // }
  };

  sketch.keyTyped = () => {
    letter = sketch.key;
    layout();
  };
};
