import  { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const USER_ID = "04d2c0b4-8c99-42c3-b185-0df0d5fc2066";

const ChatComponent = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const taskId = "874e5c15-f917-4370-8221-c19ecd645c13";

  const assistantBuffer = useRef({ role: "assistant", content: "" });

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

    socket.on("assistant_message_token", ({ token }) => {
      assistantBuffer.current.content += token;

      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];

        if (last?.role === "assistant") {
          updated[updated.length - 1] = { ...assistantBuffer.current };
        } else {
          updated.push({ ...assistantBuffer.current });
        }

        return updated;
      });
    });

    socket.on("assistant_message_done", (data) => {
      console.log("✅ Assistant message complete:", data);
      assistantBuffer.current = { role: "assistant", content: "" };

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = data;
        return updated;
      });
    });

    socket.on("error_message", ({ error }) => {
      alert(error);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message_saved");
      socket.off("assistant_message_token");
      socket.off("assistant_message_done");
      socket.off("error_message");
    };
  }, []);

  const sendMessage = () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    // ✅ Include userId in emitted data
    socket.emit("user_message", {
      taskId,
      message: trimmed,
      userId: USER_ID,
    });

    setMessage("");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <h2>💬 AI Chat</h2>
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "1rem",
          marginBottom: "1rem",
          minHeight: "200px",
          background: "#f9f9f9",
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: "0.5rem" }}>
            <strong
              style={{
                color: msg.role === "user" ? "#007bff" : "#28a745",
              }}
            >
              {msg.role}:
            </strong>{" "}
            {msg.content}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <button onClick={sendMessage} style={{ padding: "0.5rem 1rem" }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;