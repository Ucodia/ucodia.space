import autoStretchP5 from "../../../utils/autoStretchP5";
import pointsToSegments from "../utils/pointsToSegments";

export default (sketch) => {
  let letter = "e";
  let font;
  let points;
  let segments;
  let xoff;
  let yoff;

  // noise settings
  let noiseInc = 0.2;
  let noiseScale = 10;
  let noisePos = [];
  let segmentsOffsets = [];

  sketch.preload = () => {
    font = sketch.loadFont("fonts/Righteous-Regular.ttf");
  };

  function layout() {
    const fontSize = sketch.height * 1;
    points = font.textToPoints(letter, 0, 0, fontSize, {
      sampleFactor: 2,
    });
    segments = pointsToSegments(points, 5);

    // compute offset to center letter on screen
    const bounds = font.textBounds(letter, 0, 0, fontSize);
    xoff = -bounds.x - bounds.w / 2 + sketch.width / 2;
    yoff = -bounds.y - bounds.h / 2 + sketch.height / 2;

    // initialize noise
    noisePos = [];
    segmentsOffsets = [];
    for (let i = 0; i < segments.length; i++) {
      noisePos[i] = 0;
      segmentsOffsets[i] = [];
      for (let j = 0; j < segments[i].length; j++) {
        segmentsOffsets[i].push({
          x: sketch.noise(noisePos[i]),
          y: sketch.noise(noisePos[i] + 1000),
        });
        noisePos[i] += noiseInc;
      }
    }
  }

  sketch.setup = () => {
    sketch.createCanvas(100, 100);
    sketch.frameRate(30);

    autoStretchP5(sketch, layout);
  };

  sketch.draw = () => {
    sketch.background("#FFBE03");
    sketch.fill("#000000");
    sketch.noStroke();

    sketch.translate(xoff, yoff);

    for (let i = 0; i < segments.length; i++) {
      if (i > 0) {
        sketch.fill("#FFBE03");
      }

      sketch.beginShape();
      for (let j = 0; j < segments[i].length; j++) {
        const p = segments[i][j];
        const offsetX = sketch.map(
          segmentsOffsets[i][j].x,
          0,
          1,
          -noiseScale,
          noiseScale
        );
        const offsetY = sketch.map(
          segmentsOffsets[i][j].y,
          0,
          1,
          -noiseScale,
          noiseScale
        );
        sketch.vertex(p.x + offsetX, p.y + offsetY);
      }
      sketch.endShape(sketch.CLOSE);
    }

    for (let i = 0; i < noisePos.length; i++) {
      const first = segmentsOffsets[i].shift();
      segmentsOffsets[i].push(first);
    }

    // if (sketch.frameCount < segments[0].length) {
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
