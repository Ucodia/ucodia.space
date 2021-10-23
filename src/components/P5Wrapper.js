import React, { useRef, useEffect } from "react";
import p5 from "p5/lib/p5.min.js";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const P5Wrapper = ({ sketch }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    // prevent scrolling on mobile
    const preventScrolling = (event) => event.preventDefault();
    container.addEventListener("touchmove", preventScrolling, {
      passive: true,
    });
    return () => container.removeEventListener("touchmove", preventScrolling);
  }, []);

  useEffect(() => {
    const newP5Instance = new p5(sketch, containerRef.current);

    // cleanup when sketch changes
    return () => {
      newP5Instance.remove();
      if (newP5Instance.cleanup) {
        newP5Instance.cleanup();
      }
    };
  }, [sketch]);

  return <Container ref={containerRef} />;
};

export default P5Wrapper;
