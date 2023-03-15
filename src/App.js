import "./App.css";
import { useState } from "react";

const USER_ROLE = "User";
const BOT_ROLE = "Bot";

const INIT_MESSAGE = {
  role: BOT_ROLE,
  content: "Bonjour, comment est-ce que je vous aider ?",
};

function App() {
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState([INIT_MESSAGE]);
  const [loading, setLoading] = useState(false);

  const onSendMessage = async () => {
    const newUserMessage = {
      role: USER_ROLE,
      content,
    };

    const allMessages = [...messages, newUserMessage];
    setMessages(allMessages);
    setLoading(true);
    setContent("");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: allMessages,
        }),
      });

      setMessages((messages) => [
        ...messages,
        {
          role: "assistant",
          content: response.data,
        },
      ]);
    } catch (error) {
      console.error("une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    console.log("eee", e);
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="App">
      <h1>Chatbot</h1>
      <div className="Container">
        <div className="ChatMessages">
          {messages.map((message) => (
            <p className={`ChatBubble ${message.role}`}>{message.content}</p>
          ))}

          {loading && <p className={`ChatBubble ${BOT_ROLE}`}>Chargement...</p>}
        </div>
        <div className="ChatInput">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            handlekeydown={handleKeyDown}
          />
          <button onClick={onSendMessage}>Envoyer</button>
        </div>
      </div>
    </div>
  );
}

export default App;
