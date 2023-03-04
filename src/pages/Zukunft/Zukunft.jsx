import React, { useEffect, useRef, useState } from "react";
import { withSize } from "react-sizeme";
import id from "../../utils/id";
import downloadSvgElement from "../../utils/downloadSvgElement";
import Dice from "./Dice";

export const meta = {
  name: "Zukunft",
  created: "2016-04-02",
};

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const getN = (n, fn) => Array.from(Array(n).keys()).map(fn);
const createDice = (face = 1, orientation = 0, primary = false) => ({
  face,
  orientation,
  primary,
  id: id(),
});
const randomDice = () => createDice(randomInt(1, 6), randomInt(0, 1));
const generateDices = (columns, rows) => {
  const dices = getN(columns * rows, randomDice);
  const wordAsArray = "zukunft".split("");
  const wordStart =
    (Math.ceil(rows / 2) - 1) * columns +
    Math.floor((columns - wordAsArray.length) / 2);

  wordAsArray.forEach((letter, i) => {
    dices[wordStart + i] = createDice(letter);
  });

  return dices;
};

const fullSizeStyle = { width: "100%", height: "100%" };

const Zukunft = ({ size }) => {
  const svgRef = useRef(null);
  const diceSize = size.width >= 1024 ? 40 : 30;
  const [grid, setGrid] = useState({ dices: [], columns: 0, rows: 0 });

  useEffect(() => {
    const columns = Math.floor(size.width / diceSize) - 1;
    const rows = Math.floor(size.height / diceSize) - 1;
    const dices = generateDices(columns, rows);
    setGrid({ dices, columns, rows });
  }, [size, diceSize]);

  const handleRandomizeCanvas = () => {
    setGrid((g) => {
      const dices = generateDices(g.columns, g.rows);
      return { ...g, dices };
    });
  };

  const handleDownloadSvg = () => {
    downloadSvgElement(svgRef.current, `zukunft-${new Date().getTime()}`);
  };

  return (
    <div style={fullSizeStyle}>
      <svg
        style={fullSizeStyle}
        viewBox={`0 0 ${size.width} ${size.height}`}
        ref={svgRef}
      >
        <rect
          fill="black"
          stroke="none"
          width={size.width}
          height={size.height}
        />
        {grid.dices.map((dice, i) => {
          const x = i % grid.columns;
          const xOff = (size.width - grid.columns * diceSize) / 2;
          const yOff = (size.height - grid.rows * diceSize) / 2;
          const y = Math.floor(i / grid.columns);
          const translate = `translate(${x * diceSize + xOff}, ${
            y * diceSize + yOff
          })`;
          const rotate = `rotate(${dice.orientation * 90}, ${diceSize / 2}, ${
            diceSize / 2
          })`;

          return (
            <Dice
              key={dice.id}
              face={dice.face}
              size={diceSize}
              transform={`${translate} ${rotate}`}
              onClick={
                i === grid.dices.length - 1
                  ? () => handleDownloadSvg()
                  : () => handleRandomizeCanvas(i)
              }
            />
          );
        })}
      </svg>
    </div>
  );
};

export default withSize({
  monitorHeight: true,
  refreshRate: 100,
  refreshMode: "debounce",
  // noPlaceholder: true,
})(Zukunft);
