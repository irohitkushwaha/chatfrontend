import React from "react";

function ChatList({ users, onSelectUser }) {
  return (
    <div className="w-1/3 bg-gray-100 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Chats</h2>
      {users.map((user) => (
        <div
          key={user._id}
          className="flex items-center justify-between p-3 bg-white mb-2 rounded shadow cursor-pointer"
          onClick={() => onSelectUser(user)}
        >
          <div>
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-sm text-gray-500">
              {user.status === "online"
                ? "🟢 Online"
                : `⚪ Last seen: ${new Date(user.lastSeen).toLocaleTimeString()}`}
            </p>
          </div>
          {user.unseenMessages > 0 && (
            <div className="bg-red-500 text-white text-sm rounded-full px-2 py-1">
              {user.unseenMessages}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ChatList;
