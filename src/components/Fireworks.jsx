import React, { useEffect, useRef } from "react";
import birthdaySong from "../assets/happy_birthday.mp3";

const Fireworks = ({ isBuddyTalking }) => {
  const audioRef = useRef(null);
  const fireworksTimeoutRef = useRef(null);

  useEffect(() => {
    // Load the fireworks script
    const script = document.createElement("script");
    script.src = "/fireworks.js";
    script.async = true;
    script.onload = () => {
      if (window.startFireworks) window.startFireworks();
    };
    document.body.appendChild(script);

    // Load the stylesheet
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/styles.css";
    document.head.appendChild(link);

    // Play the birthday song
    audioRef.current = new Audio(birthdaySong);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;
    audioRef.current.play();

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      clearTimeout(fireworksTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (isBuddyTalking && audioRef.current) {
      audioRef.current.pause(); // Stop music when Buddy talks
    } else if (!isBuddyTalking && audioRef.current) {
      audioRef.current.play(); // Resume music when Buddy stops talking
    }
  }, [isBuddyTalking]);

  useEffect(() => {
    if (isBuddyTalking) {
      fireworksTimeoutRef.current = setTimeout(() => {
        if (window.stopFireworks) window.stopFireworks(); // Stop fireworks after 10 sec
      }, 10000);
    }
  }, [isBuddyTalking]);

  return (
    <div className="relative w-full h-screen flex flex-col justify-center items-center text-white">
      <h1 className="text-4xl font-bold text-center absolute top-20">
        🎉 Happy Birthday 🎉
      </h1>
      <h2 className="text-3xl font-semibold text-pink-400 absolute top-32">
        Khusi 💖
      </h2>
      <canvas
        id="birthday"
        className="absolute top-0 left-0 w-full h-full"
      ></canvas>
    </div>
  );
};

export default Fireworks;
