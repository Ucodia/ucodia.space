import React, { useState, useEffect } from "react";
import styled from "styled-components";
import useSpeechToText from "../hooks/useSpeechToText";
import giphy from "../apis/giphy";

const Container = styled.div`
  width: 100%;
  height: 100%;
`;
const Alert = styled.div`
  max-width: 70%;
`;

const Gif = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const Keyword = styled.div`
  padding: 20px;
  width: 100%;
  font-size: 3rem;
  position: absolute;
  background-color: white
  top: 70%;
  opacity: 0.5;
  text-align: center;
  z-index: 99;
`;

const GiphyVox = () => {
  const [keyword, setKeyword] = useState("");
  const [gifUrl, setGifUrl] = useState("");
  const [transcript, speech] = useSpeechToText();
  useEffect(() => {
    if (!keyword) return;

    async function fetchData() {
      const response = await giphy.search(keyword);
      if (response.data.length === 0) return;
      setGifUrl(response.data[0].images.original.url);
    }

    fetchData();
  }, [keyword]);
  useEffect(() => {
    setKeyword(transcript);
  }, [transcript]);

  if (!speech) {
    return (
      <Alert>
        <h1>Sorry!</h1>
        <p>
          This experience requires speech recognition which is not available in
          your browser ¯\_(ツ)_/¯
        </p>
        <p>PS: You can try it in Chrome desktop.</p>
      </Alert>
    );
  }

  return (
    <Container>
      {gifUrl && <Gif src={gifUrl} alt={`gif for keyword "${keyword}"`} />}
      <Keyword>{keyword ? keyword : "say something..."}</Keyword>
    </Container>
  );
};

export const meta = {
  name: "Giphy Vox",
  year: "201?",
};

export default GiphyVox;
