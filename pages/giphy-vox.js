import { useState, useEffect } from "react";
import styled from "styled-components";
import useSpeechToText from "../src/hooks/useSpeechToText";
import giphy from "../src/apis/giphy";

export const meta = {
  name: "Giphy Vox",
  created: "2017-11-13",
};

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
  font-size: 3rem;
  position: absolute;
  bottom: 0;
  width: 100%;
  color: black;
  background-color: white;
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
      {gifUrl ? (
        <Gif src={gifUrl} alt={`gif for keyword "${keyword}"`} />
      ) : (
        <Container />
      )}
      <Keyword>{keyword ? keyword : "say something..."}</Keyword>
    </Container>
  );
};

export default GiphyVox;
