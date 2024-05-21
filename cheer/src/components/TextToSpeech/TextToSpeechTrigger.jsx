import React, { useState, useEffect, useRef } from 'react';
import speakerIcon from './speaker_logo.png'; // Update the path as needed
import axios from 'axios';
import './TextToSpeechTrigger.css'; // Import the CSS file
import useTextSelection from './useTextSelection'; // Import the custom hook

const routerPath = `/api/text-to-speech`;
const domainName = window.location.origin.split(':')[1].slice(2);
const backendUrl = `http://${domainName}:8080`;

const TextToSpeechTrigger = () => {
  const [isTTSActive, setIsTTSActive] = useState(false);
  const [queue, setQueue] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speakingRef = useRef(isSpeaking); // useRef to keep track of isSpeaking state in asynchronous calls
  const selectedText = useTextSelection();

  useEffect(() => {
    speakingRef.current = isSpeaking; // Update ref when isSpeaking changes
  }, [isSpeaking]);

  useEffect(() => {
    const speakText = async () => {
      if (!queue.length || speakingRef.current) return;
      setIsSpeaking(true);
      const text = queue[0]; // Get the first item in the queue
      try {
        const response = await axios.post(`${backendUrl}${routerPath}`, { text });
        const audioBlob = new Blob([Uint8Array.from(atob(response.data.audioContent), c => c.charCodeAt(0))], { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
          setQueue(currentQueue => currentQueue.slice(1)); // Remove the spoken text from the queue
          setIsSpeaking(false); // Ready to speak the next item
        };

        audio.play();
      } catch (error) {
        console.error('Error fetching or playing speech:', error);
        setIsSpeaking(false); // Ensure we can try speaking the next item
        setQueue(currentQueue => currentQueue.slice(1)); // Remove the current item from the queue on error
      }
    };

    speakText(); // Initiate speaking
  }, [queue, isSpeaking]);

  useEffect(() => {
    if (isTTSActive && selectedText) {
      setQueue(currentQueue => [...currentQueue, selectedText]); // Add new selected text to the queue
    }
  }, [selectedText, isTTSActive]);

  const handleToggleChange = (event) => {
    setIsTTSActive(event.target.checked);
    if (!event.target.checked) {
      setQueue([]); // Clear the queue if TTS is turned off
    }
  };

  return (
    <div className="speaker-toggle-container">
      <img 
        src={speakerIcon} 
        alt="Narrate Text" 
        className={`speaker-icon ${isTTSActive ? 'active' : ''}`}
        onClick={() => setIsTTSActive(!isTTSActive)}
      />
      <label className="switch">
        <input 
          type="checkbox" 
          id="speakerToggle" 
          checked={isTTSActive}
          onChange={handleToggleChange}
        />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default TextToSpeechTrigger;
