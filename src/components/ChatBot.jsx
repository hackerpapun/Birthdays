import { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import axios from "axios";

function TeddyModel({ isSpeaking }) {
  const { scene } = useGLTF("/teddy.glb");
  const teddyRef = useRef();
  let time = useRef(0);

  useFrame(() => {
    if (teddyRef.current) {
      time.current += 0.1;
      teddyRef.current.position.y = isSpeaking
        ? Math.sin(time.current * 10) * 0.25
        : 0;
      teddyRef.current.rotation.x = Math.PI/2;
      teddyRef.current.rotation.y = Math.PI/180;
    }
  });

  return (
    <primitive
      ref={teddyRef}
      object={scene}
      scale={0.034}
      position={[0, -4, 1]}
    />
  );
}

function FlirtyChatbot() {
  const [response, setResponse] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognition = useRef(null);
  const speaking = useRef(false);
  const listening = useRef(true);

  useEffect(() => {
    startListening();
    return () => stopListening();
  }, []);

  const startListening = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("Your browser does not support voice recognition.");
      return;
    }
    if (recognition.current) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition.current = new SpeechRecognition();
    recognition.current.lang = "en-US";
    recognition.current.interimResults = false;
    recognition.current.continuous = true;

    recognition.current.onresult = (event) => {
      if (isSpeaking) return;
      const voiceText = event.results[event.results.length - 1][0].transcript
        .trim()
        .toLowerCase();

      if (voiceText === "stop") {
        stopListening();
        return;
      }

      handleSend(voiceText);
    };

    recognition.current.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
    };

    recognition.current.onend = () => {
      if (listening.current && !isSpeaking) {
        setTimeout(() => recognition.current.start(), 1000);
      }
    };

    recognition.current.start();
  };

  const stopListening = () => {
    if (recognition.current) {
      recognition.current.stop();
      recognition.current = null;
      listening.current = false;
    }
  };

  const speakResponse = (text) => {
    if (speaking.current) return;
    stopListening();

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "hi-IN";
    speech.rate = 0.9; // **Smoother pace, not too slow**
    speech.pitch = 0.4; // **Deep, attractive male voice**
    speech.volume = 1;

    // Try selecting a more natural male voice
    const voices = speechSynthesis.getVoices();
    const maleVoice = voices.find(
      (voice) => voice.name.includes("Male") || voice.name.includes("Deep")
    );
    if (maleVoice) {
      speech.voice = maleVoice;
    }

    speech.onstart = () => {
      speaking.current = true;
      setIsSpeaking(true);
    };

    speech.onend = () => {
      speaking.current = false;
      setIsSpeaking(false);
      startListening();
    };

    speech.onerror = (event) => {
      console.error("Speech Synthesis Error:", event.error);
      speaking.current = false;
      setIsSpeaking(false);
      startListening();
    };

    window.speechSynthesis.speak(speech);
  };


  const handleSend = async (text) => {
    if (text.trim() === "") return;
    try {
      const res = await axios.post("http://localhost:5000/chat", {
        message: text,
      });
      const reply = res.data.reply;
      setResponse(reply);
      setTimeout(() => speakResponse(reply), 500);
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponse(
        "अरे जान, कुछ तो गड़बड़ हो गई! पर चिंता मत करो, मैं हूँ ना! 😘"
      );
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600 animate-pulse">
      <h2 className="text-4xl font-bold text-white mb-6 animate-bounce">
        💖 Your Ultimate Flirty Teddy 💖
      </h2>
      <Canvas className="w-full h-80">
        <ambientLight intensity={1.2} />
        <directionalLight position={[2, 5, 2]} intensity={1.8} />
        <TeddyModel isSpeaking={isSpeaking} />
        <OrbitControls />
      </Canvas>
      {response && (
        <p className="mt-4 text-2xl text-white text-center italic animate-fadeIn">
          🧸 Teddy: {response}
        </p>
      )}
      <button
        className="mt-4 px-8 py-3 bg-white text-pink-700 font-bold rounded-xl shadow-lg hover:bg-gray-200 transition-all text-lg animate-wiggle"
        onClick={() => handleSend("Flirt with me")}
      >
        Flirt With Me ❤️
      </button>
      <button
        className="mt-2 px-6 py-2 bg-white text-purple-700 font-bold rounded-lg shadow-md hover:bg-gray-200 transition-all"
        onClick={stopListening}
      >
        Stop Listening 🛑
      </button>
    </div>
  );
}

export default FlirtyChatbot;
