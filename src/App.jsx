import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

// IMPORTANT: Remove `/api` from the URL
const socket = io("http://localhost:5000");

const ChatComponent = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const taskId = "e59f9ce5-afa7-4f66-bc4a-f3092eef6813"; 

  useEffect(() => {
  socket.on("connect", () => {
    console.log("✅ Connected to socket server");
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected from socket server");
  });

  socket.on("message_saved", (data) => {
    console.log("🟢 User message saved:", data);
    setMessages((prev) => [...prev, data]);
  });

  socket.on("assistant_message", (data) => {
    console.log("🟡 Assistant message received:", data);
    setMessages((prev) => [...prev, data]);
  });

  return () => {
    socket.off("connect");
    socket.off("disconnect");
    socket.off("message_saved");
    socket.off("assistant_message");
  };
}, []);


  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("user_message", { taskId, message });
    setMessage("");
  };

  return (
    <div>
      <h2>Chat Test</h2>
      <div>
        {messages.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatComponent;
