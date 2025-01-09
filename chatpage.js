import React, { useState, useEffect } from "react";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // Backend WebSocket URL

function ChatPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState({}); // Mock current user

  // Fetch users and statuses on component mount
  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch("/api/v1/users"); // API to fetch user list
      const data = await response.json();
      setUsers(data);
    }
    fetchUsers();

    // Emit online status to server
    socket.emit("user_connected", currentUser._id);

    return () => {
      socket.emit("user_disconnected", currentUser._id); // Emit offline on unmount
    };
  }, [currentUser]);

  // Listen for new messages
  useEffect(() => {
    socket.on("new_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("user_status_update", (updatedUser) => {
      setUsers((prev) =>
        prev.map((user) =>
          user._id === updatedUser.userId
            ? { ...user, status: updatedUser.status, lastSeen: updatedUser.lastSeen }
            : user
        )
      );
    });

    return () => socket.off("new_message user_status_update");
  }, []);

  return (
    <div className="flex h-screen">
      <ChatList
        users={users}
        onSelectUser={(user) => setSelectedUser(user)}
        currentUser={currentUser}
      />
      {selectedUser && (
        <ChatWindow
          selectedUser={selectedUser}
          messages={messages}
          socket={socket}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}

export default ChatPage;
