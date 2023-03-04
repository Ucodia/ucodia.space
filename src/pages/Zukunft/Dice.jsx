import React, { useMemo } from "react";

const faceToDots = {
  0: [],
  1: [4],
  2: [2, 6],
  3: [2, 4, 6],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
  h: [0, 2, 3, 4, 5, 6, 8],
  e: [0, 1, 2, 3, 4, 6, 7, 8],
  f: [0, 1, 2, 3, 4, 6],
  k: [0, 2, 3, 4, 6, 8],
  l: [0, 3, 6, 7, 8],
  n: [0, 1, 2, 3, 5, 6, 8],
  o: [0, 1, 2, 3, 5, 6, 7, 8],
  t: [0, 1, 2, 4, 7],
  u: [0, 2, 3, 5, 6, 7, 8],
  z: [0, 1, 4, 7, 8],
  "-": [3, 4, 5],
  "+": [1, 3, 4, 5, 7],
  "carret-down": [3, 4, 5, 7],
};

const groupStyle = {
  cursor: "pointer",
};

const Dice = ({
  face = 1,
  size = 30,
  transform,
  onClick = () => {},
  onMouseEnter = () => {},
}) => {
  const dotsProps = useMemo(
    () =>
      faceToDots[face].map((dot, i) => ({
        cx: (size / 4) * ((dot % 3) + 1),
        cy: (size / 4) * (Math.floor(dot / 3) + 1),
        rx: size / 10,
        ry: size / 10,
      })),
    [face, size]
  );

  return (
    <g
      style={groupStyle}
      transform={transform}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <rect
        fill={"none"}
        stroke={"#333"}
        strokeWidth={"1px"}
        width={size}
        height={size}
        rx={size / 5}
        ry={size / 5}
      />
      {dotsProps.map((dotProps, i) => (
        <ellipse fill={"white"} stroke={"none"} key={i} {...dotProps} />
      ))}
    </g>
  );
};

export default Dice;
