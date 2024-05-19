import React from "react";
import GiphyVox from "./GiphyVox";
import Kinetic from "./Kinetic";
import Zukunft from "./Zukunft";
import Flowtime from "./Flowtime";
import Conundrum from "./Conundrum";
import LorenzSvg from "./LorenzSvg";
import SpeechPage from "./Speech";
import sketches from "./sketches";

const pages = {
  "giphy-vox": <GiphyVox />,
  kinetic: <Kinetic />,
  zukunft: <Zukunft />,
  flowtime: <Flowtime />,
  conundrum: <Conundrum />,
  "lorenz-svg": <LorenzSvg />,
  speech: <SpeechPage />,
  ...sketches,
};

export default pages;
