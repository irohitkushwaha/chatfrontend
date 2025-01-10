import React, { useState, useEffect } from "react";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // Backend WebSocket URL

function ChatPage() {
  const [users, setUsers] = useState([]); // List of users
  const [selectedUser, setSelectedUser] = useState(null); // Currently selected user
  const [messages, setMessages] = useState([]); // All messages
  const [currentUser, setCurrentUser] = useState({
    _id: "123", // Mock current user
    username: "John Doe",
  });

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
      // Emit offline status to server on component unmount
      socket.emit("user_disconnected", currentUser._id);
    };
  }, [currentUser]);

  // Listen for server events
  useEffect(() => {
    // Listen for new messages
    socket.on("new_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Listen for user status updates (online/offline/last seen)
    socket.on("user_status_update", (updatedUser) => {
      setUsers((prev) =>
        prev.map((user) =>
          user._id === updatedUser.userId
            ? { ...user, status: updatedUser.status, lastSeen: updatedUser.lastSeen }
            : user
        )
      );
    });

    return () => {
      // Remove socket listeners on component unmount
      socket.off("new_message");
      socket.off("user_status_update");
    };
  }, []);

  // Handle read status when opening a chat window
  useEffect(() => {
    if (selectedUser) {
      const unreadMessages = messages.filter(
        (msg) =>
          msg.sender === selectedUser._id &&
          msg.receiver === currentUser._id &&
          msg.status !== "read"
      );

      if (unreadMessages.length > 0) {
        // Emit event to mark messages as "read"
        const messageIds = unreadMessages.map((msg) => msg._id);
        socket.emit("message_read", { messageIds });

        // Update the local messages state
        setMessages((prev) =>
          prev.map((msg) =>
            messageIds.includes(msg._id) ? { ...msg, status: "read" } : msg
          )
        );
      }
    }
  }, [selectedUser, messages, currentUser._id]);

  return (
    <div className="flex h-screen">
      {/* Chat List Component */}
      <ChatList
        users={users}
        onSelectUser={(user) => setSelectedUser(user)}
        currentUser={currentUser}
      />

      {/* Chat Window Component */}
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
