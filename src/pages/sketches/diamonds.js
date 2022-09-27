import autoStretchP5 from "../../utils/autoStretchP5";
import diamond from "./diamond";

export const meta = {
  name: "Diamonds",
  year: "2014",
};

const diamonds = (sketch, n = 3, spaceRatio = 0.2, transparent = false) => {
  let diams = [];

  sketch.setup = () => {
    sketch.createCanvas(100, 100);
    sketch.frameRate(60);
    sketch.noStroke();

    autoStretchP5(sketch, layout);
  };

  function layout() {
    const isHorizontal = sketch.width >= sketch.height;

    let spacing = isHorizontal
      ? (sketch.width * spaceRatio) / (n + 1)
      : (sketch.height * spaceRatio) / (n + 1);
    let r = isHorizontal
      ? (sketch.width * (1 - spaceRatio)) / (n * 2)
      : (sketch.height * (1 - spaceRatio)) / (n * 2);

    for (let i = 0; i < n; i++) {
      let c1 = (i + 1) * spacing;
      let c2 = 2 * r * i + r;
      let baseX = isHorizontal ? c1 + c2 : sketch.width / 2;
      let baseY = isHorizontal ? sketch.height / 2 : c1 + c2;

      let offset = (i + 1) * 0.25;
      if (diams[i]) offset = diams[i].pos();

      diams[i] = createDiamond(baseX, baseY, r, 8, offset);
    }
  }

  sketch.draw = () => {
    sketch.clear();

    if (!transparent) {
      sketch.background(255);
    }

    for (let i = 0; i < n; ++i) {
      diams[i].draw();
      diams[i].move();
    }
  };

  function createDiamond(x, y, radius, sides, offset) {
    if (!x) x = 0;
    if (!y) y = 0;
    if (!radius) radius = 100;
    if (!sides) sides = 8;
    if (!offset) offset = 0;

    const palette = [
      sketch.color(0, 174, 239, 50), // cyan
      sketch.color(255, 242, 0, 50), // yellow
      sketch.color(236, 0, 140, 50), // magenta
    ];
    const inc = 1 / 1000;
    let position = sketch.constrain(offset, 0, 1);

    return {
      draw: function () {
        const facets = diamond(x, y, radius, sides, position, palette);
        for (let i = 0; i < facets.length; i++) {
          const facet = facets[i];
          sketch.fill(palette[facet.color]);
          sketch.triangle(...facet.points);
        }
      },
      move: function () {
        position += inc;
        if (position > 1) position = position % 1;
      },
      pos() {
        return position;
      },
    };
  }
};

export const singleDiamond = (sketch) => diamonds(sketch, 1, 0, true);
export default diamonds;