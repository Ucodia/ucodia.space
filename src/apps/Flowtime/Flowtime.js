import React, { useState } from "react";
import styled from "styled-components";
import { fromNow } from "flowtime";
import { format } from "date-fns";
import useInterval from "../../utils/useInterval";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  cursor: pointer;

  animation-name: background-gradient;
  animation-duration: 10s;
  animation-iteration-count: infinite;
  animation-direction: alternate;

  @keyframes background-gradient {
    from {
      background-color: #00c3ff;
    }
    to {
      background-color: #ffff1c;
    }
  }
`;

const Time = styled.code`
  font-size: 3rem;

  @media only screen and (min-width: 768px) {
    font-size: 5rem;
  }

  @media only screen and (min-width: 1024px) {
    font-size: 7rem;
  }
`;

const Flowtime = () => {
  const [time, setTime] = useState(fromNow().toDate());
  const [realityCheck, setRealityCheck] = useState(false);
  useInterval(() => {
    setTime(realityCheck ? new Date() : fromNow().toDate());
  }, 1000);

  const showReality = () => {
    setRealityCheck(true);
    setTime(new Date());
  };
  const showFlowtime = () => {
    setRealityCheck(false);
    setTime(fromNow().toDate());
  };

  return (
    <Container
      onMouseDown={showReality}
      onTouchStart={showReality}
      onMouseUp={showFlowtime}
      onTouchEnd={showFlowtime}
    >
      <Time>{format(time, "pp")}</Time>
    </Container>
  );
};

export default Flowtime;
