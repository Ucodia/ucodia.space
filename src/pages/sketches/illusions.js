import autoStretchP5 from "../../utils/autoStretchP5";

export const meta = {
  name: "Illusions",
  created: "2015-11-02",
};

const illusions = (sketch) => {
  var n = 3;
  var shapes = [];
  var bands = [];
  var backColor = "black";
  var foreColor = "white";
  var size = 0;
  var space = 0;
  var speed = 7;

  function layout() {
    sketch.noLoop();
    size = sketch.width * 0.1;
    space = (sketch.width - size * n) / (n + 1);

    var baseY = sketch.height / 2;

    for (let i = 0; i < n; i++) {
      const baseX = (space + size) * (i + 1) - size / 2;
      shapes[i] = { x: baseX, y: baseY, form: i };
    }

    for (let i = 0; i < n + 2; i++) {
      const baseX = (space + size) * i - space / 2 - size;
      bands[i] = { x: baseX, y: baseY };
    }
    sketch.loop();
  }

  sketch.setup = () => {
    sketch.createCanvas(100, 100);
    sketch.frameRate(30);

    autoStretchP5(sketch, layout);
  };

  sketch.draw = () => {
    sketch.background(backColor);

    // draw bands
    for (let i = 0; i < bands.length; i++) {
      const band = bands[i];

      sketch.noStroke();
      sketch.fill(foreColor);
      sketch.rect(band.x, 0, size * 0.7, sketch.height);
    }

    // draw shapes
    for (let i = 0; i < shapes.length; i++) {
      var shape = shapes[i];

      sketch.strokeWeight(size * 0.15);
      sketch.stroke(backColor);
      sketch.noFill();

      if (shape.form === 0)
        sketch.rect(shape.x, shape.y - size / 2, size, size);
      else if (shape.form === 1) sketch.ellipse(shape.x, shape.y, size, size);
      else if (shape.form === 2) equi(shape.x, shape.y, size, 1);
    }

    // animate bands and shapes
    for (let i = 0; i < bands.length; i++) {
      const band = bands[i];

      band.x += speed;

      if (band.x >= sketch.width + size + space / 2) {
        band.x = -(size + space / 2);
        shiftShapes();
      }
    }
  };

  function shiftShapes() {
    for (let i = 0; i < shapes.length; i++) {
      var shape = shapes[i];
      shape.form = (shape.form + 1) % 3;
    }
  }

  function invert() {
    var temp = backColor;
    backColor = foreColor;
    foreColor = temp;
  }

  // event hooks

  sketch.mousePressed = () => {
    invert();
    return false;
  };

  // utilities

  function equi(x, y, size, mode) {
    // the mode changes vertical centering
    var m = mode | 0;
    var h = triHeight(size, size / 2);
    var h3 = h / 3;

    var x1 = x;
    var x2 = x - size / 2;
    var x3 = x + size / 2;
    var y1, y2, y3;

    if (m === 0) {
      y1 = y - 2 * h3;
      y2 = y + h3;
      y3 = y + h3;
    } else {
      y1 = y - h / 2;
      y2 = y + h / 2;
      y3 = y + h / 2;
    }

    sketch.triangle(x1, y1, x2, y2, x3, y3);
  }

  function triHeight(hypo, a) {
    return Math.sqrt(Math.pow(hypo, 2) - Math.pow(a, 2));
  }
};

export default illusions;
