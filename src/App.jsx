// import React, { useEffect, useState } from "react";
// import { io } from "socket.io-client";

// // IMPORTANT: Remove `/api` from the URL
// const socket = io("http://localhost:5000");

// const ChatComponent = () => {
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const taskId = "e59f9ce5-afa7-4f66-bc4a-f3092eef6813"; 

//   useEffect(() => {
//   socket.on("connect", () => {
//     console.log("✅ Connected to socket server");
//   });

//   socket.on("disconnect", () => {
//     console.log("❌ Disconnected from socket server");
//   });

//   socket.on("message_saved", (data) => {
//     console.log("🟢 User message saved:", data);
//     setMessages((prev) => [...prev, data]);
//   });

//   socket.on("assistant_message", (data) => {
//     console.log("🟡 Assistant message received:", data);
//     setMessages((prev) => [...prev, data]);
//   });

//   return () => {
//     socket.off("connect");
//     socket.off("disconnect");
//     socket.off("message_saved");
//     socket.off("assistant_message");
//   };
// }, []);


//   const sendMessage = () => {
//     if (!message.trim()) return;

//     socket.emit("user_message", { taskId, message });
//     setMessage("");
//   };

//   return (
//     <div>
//       <h2>Chat Test</h2>
//       <div>
//         {messages.map((msg, idx) => (
//           <div key={idx}>
//             <strong>{msg.role}:</strong> {msg.content}
//           </div>
//         ))}
//       </div>

//       <input
//         type="text"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         placeholder="Type message..."
//       />
//       <button onClick={sendMessage}>Send</button>
//     </div>
//   );
// };

// export default ChatComponent;


// import React, { useEffect, useState } from "react";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:5000");

// const ChatComponent = () => {
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const taskId = "874e5c15-f917-4370-8221-c19ecd645c13";

//   useEffect(() => {
//     let currentAssistantMessage = { role: "assistant", content: "" };

//     socket.on("connect", () => {
//       console.log("✅ Connected to socket server");
//     });

//     socket.on("disconnect", () => {
//       console.log("❌ Disconnected from socket server");
//     });

//     socket.on("message_saved", (data) => {
//       console.log("🟢 User message saved:", data);
//       setMessages((prev) => [...prev, data]);
//     });

//     socket.on("assistant_message_token", ({ token }) => {
//       currentAssistantMessage.content += token;

//       setMessages((prev) => {
//         const updated = [...prev];
//         const last = updated[updated.length - 1];
//         if (last?.role === "assistant") {
//           updated[updated.length - 1] = { ...currentAssistantMessage };
//         } else {
//           updated.push({ ...currentAssistantMessage });
//         }
//         return updated;
//       });
//     });

//     socket.on("assistant_message_done", (data) => {
//       console.log("✅ Assistant message complete:", data);
//       currentAssistantMessage = { role: "assistant", content: "" };
//       setMessages((prev) => {
//         const updated = [...prev];
//         updated[updated.length - 1] = data;
//         return updated;
//       });
//     });

//     return () => {
//       socket.off("connect");
//       socket.off("disconnect");
//       socket.off("message_saved");
//       socket.off("assistant_message_token");
//       socket.off("assistant_message_done");
//     };
//   }, []);

//   const sendMessage = () => {
//     if (!message.trim()) return;
//     socket.emit("user_message", { taskId, message });
//     setMessage("");
//   };

//   return (
//     <div>
//       <h2>Chat Test</h2>
//       <div>
//         {messages.map((msg, idx) => (
//           <div key={idx}>
//             <strong>{msg.role}:</strong> {msg.content}
//           </div>
//         ))}
//       </div>

//       <input
//         type="text"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         placeholder="Type message..."
//       />
//       <button onClick={sendMessage}>Send</button>
//     </div>
//   );
// };

// export default ChatComponent;


import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

// Setup socket connection (adjust if deploying)
const socket = io("http://localhost:5000");

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

    // Handle saved user message
    socket.on("message_saved", (data) => {
      console.log("🟢 User message saved:", data);
      setMessages((prev) => [...prev, data]);
    });

    // Handle streamed AI tokens
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

    // Handle final AI message
    socket.on("assistant_message_done", (data) => {
      console.log("✅ Assistant message complete:", data);
      assistantBuffer.current = { role: "assistant", content: "" };

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = data;
        return updated;
      });
    });

    // Clean up on unmount
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message_saved");
      socket.off("assistant_message_token");
      socket.off("assistant_message_done");
    };
  }, []);

  const sendMessage = () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    socket.emit("user_message", { taskId, message: trimmed });
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
            <strong style={{ color: msg.role === "user" ? "#007bff" : "#28a745" }}>
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
          style={{ flex: 1, padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <button onClick={sendMessage} style={{ padding: "0.5rem 1rem" }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
