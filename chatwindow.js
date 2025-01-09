import React, { useState } from "react";
import MessageInput from "./MessageInput";

function ChatWindow({ selectedUser, messages, socket, currentUser }) {
  const [messageText, setMessageText] = useState("");

  const sendMessage = async () => {
    const message = {
      sender: currentUser._id,
      receiver: selectedUser._id,
      content: messageText,
      type: "text",
    };
    socket.emit("send_message", message);
    setMessageText("");
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 bg-gray-200 overflow-y-auto p-4">
        {messages
          .filter(
            (msg) =>
              (msg.sender === currentUser._id && msg.receiver === selectedUser._id) ||
              (msg.sender === selectedUser._id && msg.receiver === currentUser._id)
          )
          .map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded mb-2 ${
                msg.sender === currentUser._id ? "bg-blue-500 text-white ml-auto" : "bg-white"
              }`}
            >
              {msg.content}
            </div>
          ))}
      </div>
      <MessageInput
        messageText={messageText}
        setMessageText={setMessageText}
        sendMessage={sendMessage}
      />
    </div>
  );
}

export default ChatWindow;
