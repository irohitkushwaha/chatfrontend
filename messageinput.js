import React from "react";

function MessageInput({ messageText, setMessageText, sendMessage }) {
  return (
    <div className="flex items-center p-4 bg-white">
      <input
        type="text"
        className="flex-1 border rounded p-2 mr-2"
        placeholder="Type a message"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={sendMessage}
      >
        Send
      </button>
    </div>
  );
}

export default MessageInput;
