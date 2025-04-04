const messagesContainer = document.getElementById("messages");
const userInput = document.getElementById("userInput");

// Google Generative AI REST API endpoint
const API_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const API_KEY = "Your Api Key here"; // Replace with your API key

function addMessage(message, isUser = false) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.classList.add(isUser ? "user-message" : "bot-message");

  // Create message content structure
  const messageContent = document.createElement("div");
  messageContent.classList.add("message-content");

  // Add timestamp
  const timestamp = document.createElement("span");
  timestamp.classList.add("message-time");
  timestamp.textContent = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Add message text
  const messageText = document.createElement("p");
  messageText.innerHTML = message.replace(/\n/g, "<br>"); // Preserve line breaks

  // Append elements
  messageContent.appendChild(timestamp);
  messageContent.appendChild(messageText);

  // Add icon for bot messages
  if (!isUser) {
    const messageIcon = document.createElement("div");
    messageIcon.classList.add("message-icon");
    messageElement.appendChild(messageIcon);
  }

  messageElement.appendChild(messageContent);
  messagesContainer.appendChild(messageElement);

  // Scroll to the bottom smoothly
  messagesContainer.scrollTo({
    top: messagesContainer.scrollHeight,
    behavior: "smooth",
  });
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  // Add user message to chat
  addMessage(message, true);
  userInput.value = "";

  try {
    // Send message to Google Generative AI API
    const response = await fetch(`${API_ENDPOINT}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: message,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const botResponse =
      data.candidates[0].content.parts[0].text ||
      "Sorry, no response generated.";

    // Add bot response to chat
    addMessage(botResponse);
  } catch (error) {
    addMessage(`Error: ${error.message}`);
    console.error("Error:", error);
  }
}

// Handle Enter key press
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});
