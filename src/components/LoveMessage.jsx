import React, { useState, useEffect } from "react";
import "./love.css";

const LoveMessage = ({ onComplete }) => {
  const [name, setName] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const handleInputChange = (event) => setName(event.target.value);

  const showLoveMessage = () => {
    if (!name.trim()) {
      alert("Please enter your name!");
      return;
    }
    setShowMessage(true);
  };

  useEffect(() => {
    if (showMessage) {
      setTimeout(() => onComplete(name), 3000); 
    }
  }, [showMessage]);

  return (
    <div className="container"style={{justifyContent:"center",display:'flex'}}>
      {!showMessage ? (
        <div>
          <h1>Enter Your Cute Name ❤️</h1>
          <input
            type="text"
            value={name}
            onChange={handleInputChange}
            placeholder="Name ta lekhe athi......."
          />
          <button onClick={showLoveMessage}>Start Celebration</button>
        </div>
      ) : (
        <div>
          <div className="heart">❤️</div>
          <h1>
            I Miss You, <span>{name}</span>!
          </h1>
          <p>You mean the world to me 🌍</p>
          <div className="heart">💖</div>
        </div>
      )}
    </div>
  );
};

export default LoveMessage;
