import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMessage } from "./store/chatSlice";
import axios from "axios";

function App() {
  const messages = useSelector((state) => state.chat.messages);
  const dispatch = useDispatch();
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  const [isSending, setIsSending] = useState(false);

  const sendMessage = async () => {
    if (input.trim() === "" || isSending) return;

    setIsSending(true);
    dispatch(addMessage({ sender: "user", text: input }));
    setInput("");

    const typingId = Date.now();
    dispatch(
      addMessage({ sender: "bot", text: "Bot is typing...", id: typingId })
    );

    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill",
        { inputs: input },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_HUGGINGFACE_API_KEY}`,
          },
        }
      );

      const botReply = response.data[0]?.generated_text || "Ответ от модели.";

      dispatch({
        type: "chat/updateLastBotMessage",
        payload: { id: typingId, text: botReply },
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: "chat/updateLastBotMessage",
        payload: { id: typingId, text: "Ошибка при получении ответа." },
      });
    } finally {
      setTimeout(() => setIsSending(false), 1500);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-sm p-4 rounded-2xl transition-all ${
              msg.sender === "user"
                ? "ml-auto bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg"
                : "mr-auto bg-white border border-gray-200 shadow-md"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>
      <div className="p-4 bg-white flex gap-2 shadow-inner">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 border rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={sendMessage}
          className="px-5 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
