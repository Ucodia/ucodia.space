import React, { useRef, useEffect, useState } from "react";
import p5 from "p5";

const P5Wrapper = ({ sketch }) => {
  // eslint-disable-next-line no-unused-vars
  const [p5Instance, setP5Instance] = useState(null);
  const p5Container = useRef(null);
  useEffect(() => {
    if (p5Container.current) {
      const newP5Instance = new p5(sketch, p5Container.current);
      setP5Instance(newP5Instance);
    }
  }, [sketch]);

  return <div ref={p5Container} />;
};

export default P5Wrapper;
