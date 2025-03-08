export const generateChatResponse = async (message) => {
  try {
    const response = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    return data.reply || "⚠️ Teddy is sleeping! Try again.";
  } catch (error) {
    console.error("Fetch Error:", error);
    return "⚠️ Teddy is not responding. Try again later.";
  }
};
