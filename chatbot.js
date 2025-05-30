const messagesContainer = document.getElementById("messages");
const userInput = document.getElementById("userInput");

// Perplexity API configuration
const API_URL = "https://api.perplexity.ai/chat/completions";
const API_KEY = ""; // Use your api key here
const MODEL_NAME = "sonar-pro"; // Use a valid model name

function addMessage(message, isUser = false) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.classList.add(isUser ? "user-message" : "bot-message");

  const messageContent = document.createElement("div");
  messageContent.classList.add("message-content");

  const timestamp = document.createElement("span");
  timestamp.classList.add("message-time");
  timestamp.textContent = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const messageText = document.createElement("p");
  messageText.innerHTML = message.replace(/\n/g, "<br>");

  messageContent.appendChild(timestamp);
  messageContent.appendChild(messageText);

  if (!isUser) {
    const messageIcon = document.createElement("div");
    messageIcon.classList.add("message-icon");
    messageElement.appendChild(messageIcon);
  }

  messageElement.appendChild(messageContent);
  messagesContainer.appendChild(messageElement);

  messagesContainer.scrollTo({
    top: messagesContainer.scrollHeight,
    behavior: "smooth",
  });
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, true);
  userInput.value = "";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant for Sagar's chatbot."
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${errorText}`);
    }

    const data = await response.json();
    const botResponse =
      data.choices[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    addMessage(botResponse);
  } catch (error) {
    addMessage(`Error: ${error.message}`);
    console.error("Error:", error);
  }
}

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});
