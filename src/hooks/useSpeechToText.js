import { useEffect, useState } from "react";

const getBrowserSpeechRecognition = () =>
  typeof window !== "undefined" &&
  (window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition ||
    window.oSpeechRecognition);

const createSpeechRecognition = () => {
  const BrowserSpeechRecognition = getBrowserSpeechRecognition();

  const recognition = BrowserSpeechRecognition
    ? new BrowserSpeechRecognition()
    : null;

  if (recognition) {
    // recognition.continuous = true;
    recognition.interimResults = true;
  }

  return recognition;
};

const useSpeechToText = () => {
  const [speech, setSpeech] = useState(createSpeechRecognition());
  const [transcript, setTranscript] = useState("");
  const [pending, setPending] = useState(false);
  useEffect(() => {
    if (!speech) return;

    const onSpeechStart = () => {
      console.log("speech start");
      setPending(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setPending(false);
      speech.stop();

      speech.removeEventListener("speechstart", onSpeechStart);
      speech.removeEventListener("speechend", onSpeechEnd);
      speech.removeEventListener("result", onResult);

      setSpeech(null);

      const newSpeech = createSpeechRecognition();
      setSpeech(newSpeech);
    };

    const onResult = (event) => {
      setTranscript(event.results[0][0].transcript);
    };

    speech.addEventListener("speechstart", onSpeechStart);
    speech.addEventListener("speechend", onSpeechEnd);
    speech.addEventListener("result", onResult);

    speech.start();

    return () => {
      if (speech) speech.stop();
    };
  }, [speech]);

  return [transcript, pending, speech];
};

export default useSpeechToText;
