// import { useEffect, useRef, useState } from "react";
// import { io } from "socket.io-client";

// // Replace with your actual values
// const USER_ID = "933adebb-a28f-4752-85fd-712d0fb2d9f9";
// const TASK_ID = "ab75c324-2660-494e-bbf3-14adba723e86";
// const SOCKET_URL = "http://localhost:5000";
// const API_URL = "http://localhost:5000/api/chat";

// const socket = io(SOCKET_URL, {
//   auth: {
//     token: "your_jwt_token_here",
//   },
// });

// const ChatComponent = () => {
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const assistantBuffer = useRef({ role: "assistant", content: "" });
//   const bottomRef = useRef(null);

//   // Scroll to bottom when new message arrives
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Load chat history
//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const res = await fetch(`${API_URL}/${TASK_ID}/messages`);
//         const json = await res.json();
//         setMessages(json?.data || []);
//       } catch (err) {
//         console.error("Failed to load messages", err);
//       }
//     };

//     fetchMessages();
//   }, []);

//   // Setup socket listeners
//   useEffect(() => {
//     socket.on("connect", () => {
//       console.log("✅ Connected to socket server");
//     });

//     socket.on("disconnect", () => {
//       console.log("❌ Disconnected from socket server");
//     });

//     socket.on("message_saved", (data) => {
//       setMessages((prev) => [...prev, data]);
//     });

//     socket.on("assistant_message_token", ({ token }) => {
//       assistantBuffer.current.content += token;

//       setMessages((prev) => {
//         const updated = [...prev];
//         const last = updated[updated.length - 1];

//         if (last?.role === "assistant") {
//           updated[updated.length - 1] = { ...assistantBuffer.current };
//         } else {
//           updated.push({ ...assistantBuffer.current });
//         }

//         return updated;
//       });
//     });

//     socket.on("assistant_message_done", (data) => {
//       assistantBuffer.current = { role: "assistant", content: "" };

//       setMessages((prev) => {
//         const updated = [...prev];
//         updated[updated.length - 1] = data;
//         return updated;
//       });
//     });

//     socket.on("error_message", ({ error }) => {
//       alert(error);
//     });

//     return () => {
//       socket.off("connect");
//       socket.off("disconnect");
//       socket.off("message_saved");
//       socket.off("assistant_message_token");
//       socket.off("assistant_message_done");
//       socket.off("error_message");
//     };
//   }, []);

//   const sendMessage = () => {
//     const trimmed = message.trim();
//     if (!trimmed) return;

//     socket.emit("user_message", {
//       taskId: TASK_ID,
//       message: trimmed,
//       userId: USER_ID,
//     });

//     setMessage("");
//   };

//   return (
//     <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
//       <h2>💬 AI Chat</h2>

//       <div
//         style={{
//           border: "1px solid #ddd",
//           borderRadius: "8px",
//           padding: "1rem",
//           marginBottom: "1rem",
//           minHeight: "300px",
//           background: "#f9f9f9",
//           overflowY: "auto",
//           maxHeight: "400px",
//         }}
//       >
//         {messages.map((msg, idx) => (
//           <div key={idx} style={{ marginBottom: "0.5rem" }}>
//             <strong style={{ color: msg.role === "user" ? "#007bff" : "#28a745" }}>
//               {msg.role}:
//             </strong>{" "}
//             {msg.content}
//           </div>
//         ))}
//         <div ref={bottomRef} />
//       </div>

//       <div style={{ display: "flex", gap: "0.5rem" }}>
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Type your message..."
//           style={{
//             flex: 1,
//             padding: "0.5rem",
//             borderRadius: "4px",
//             border: "1px solid #ccc",
//           }}
//         />
//         <button onClick={sendMessage} style={{ padding: "0.5rem 1rem" }}>
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatComponent;














import  { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im9saS5zbXRlY2hAZ21haWwuY29tIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzUwOTk1OTg2LCJleHAiOjE3NTE4OTU5ODZ9.Ylm4xua350yCNQyLqItDt1M9VEXq_su7nQ3BISqW4GI",
  },
});

const USER_ID = "933adebb-a28f-4752-85fd-712d0fb2d9f9";

const ChatComponent = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const taskId = "ab75c324-2660-494e-bbf3-14adba723e86";

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