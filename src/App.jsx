import React, { useState, useEffect } from "react";
import LoveMessage from "./components/LoveMessage";
import Fireworks from "./components/Fireworks";
import ChatBot from "./components/ChatBot";

const App = () => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [fireworksActive, setFireworksActive] = useState(true);

  useEffect(() => {
    if (step === 1) {
      setTimeout(() => {
        let intensity = 1.0;
        const interval = setInterval(() => {
          intensity -= 0.05; 
          if (intensity <= 0) {
            clearInterval(interval);
            setFireworksActive(false);
            setStep(2);
          }
        }, 500); 
      }, 20000); 
    }
  }, [step]);

  return (
    <div>
      {step === 0 && (
        <LoveMessage
          onComplete={(userName) => {
            setName(userName);
            setStep(1);
          }}
        />
      )}
      {step === 1 && <Fireworks name={name} active={fireworksActive} />}
      {step === 2 && <ChatBot />}
    </div>
  );
};

export default App;

