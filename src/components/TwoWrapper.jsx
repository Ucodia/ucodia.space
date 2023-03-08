import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Alert from "./Alert";

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const TwoWrapper = ({ sketch }) => {
  const [error, setError] = useState(undefined);
  const containerRef = useRef(null);
  useEffect(() => {
    try {
      const two = sketch(containerRef.current);
      two.play();
      setError(undefined);
      return () => {
        two.pause();
        two.unbind();
      };
    } catch (error) {
      setError(error);
    }
  }, []);

  if (error) {
    return (
      <Alert title="Ouch!">
        <p>There was an error initializing this sketch.</p>
        <pre>{error.message}</pre>
      </Alert>
    );
  }

  return <Container ref={containerRef} />;
};

export default TwoWrapper;
