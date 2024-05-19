import React, { useState, useEffect } from "react";

const SpeechPage = () => {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [textToSpeak, setTextToSpeak] = useState("");
  const [listening, setListening] = useState(false);
  const [capturedText, setCapturedText] = useState("");

  useEffect(() => {
    // Fetch available voices when the component mounts
    const fetchVoices = () => {
      const speechSynthesisVoices = window.speechSynthesis.getVoices();
      setVoices(speechSynthesisVoices);
      setSelectedVoice(speechSynthesisVoices[0]);
    };

    fetchVoices();

    // Event listener for when voices change
    window.speechSynthesis.onvoiceschanged = fetchVoices;

    // Cleanup event listener on component unmount
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const handleSpeak = () => {
    if (textToSpeak && selectedVoice) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.voice = selectedVoice;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceChange = (event) => {
    const selectedVoiceName = event.target.value;
    const newSelectedVoice = voices.find(
      (voice) => voice.name === selectedVoiceName
    );
    setSelectedVoice(newSelectedVoice);
  };

  const handleListen = () => {
    const recognition = new window.webkitSpeechRecognition();

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      console.log(result);
      setCapturedText(result);
      setTextToSpeak((prevText) => prevText + " " + result);
    };

    recognition.start();
  };

  return (
    <div>
      <textarea
        placeholder="Type something or capture speech..."
        value={textToSpeak}
        onChange={(e) => setTextToSpeak(e.target.value)}
        rows={5} // Set the number of rows to make the textarea larger
      />
      <br />
      <select
        onChange={handleVoiceChange}
        value={selectedVoice ? selectedVoice.name : ""}
      >
        {voices.map((voice) => (
          <option key={voice.name} value={voice.name}>
            {voice.name}
          </option>
        ))}
      </select>
      <br />
      <button onClick={handleSpeak}>Speak</button>
      <button onClick={handleListen} disabled={listening}>
        {listening ? "Listening..." : "Listen"}
      </button>
      {capturedText && <p>Captured Text: {capturedText}</p>}
    </div>
  );
};

export default SpeechPage;
