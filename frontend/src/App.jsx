import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import SendRequest from './components/SendRequest';
import RequestList from './components/RequestList';
import ChatList from './components/ChatList'; // if needed
import Chat from './components/Chat';

// Sample users for demo (in production, get these from your backend/auth)
const users = [
  { id: "630d7c8c2f9b9c1f88e0d1a1", name: "User1" },
  { id: "630d7c8c2f9b9c1f88e0d1a2", name: "User2" },
  { id: "630d7c8c2f9b9c1f88e0d1a3", name: "User3" },
  { id: "630d7c8c2f9b9c1f88e0d1a4", name: "User4" },
  { id: "630d7c8c2f9b9c1f88e0d1a5", name: "User5" },
  { id: "630d7c8c2f9b9c1f88e0d1a6", name: "User6" }
];

function App() {
  // Simulate logged in user (for desktop or phone, set accordingly)
  const [currentUser, setCurrentUser] = useState(users[0].id); // e.g., desktop = User1
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to Socket.io using current origin so it works in production.
    const newSocket = io(window.location.origin);
    newSocket.emit('joinUser', currentUser);
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [currentUser]);

  return (
    <div>
      <h1>MERN Real-Time Chat App</h1>
      <p>Logged in as: {currentUser}</p>
      {/* In production, currentUser is automatically determined */}
      <SendRequest currentUser={currentUser} users={users} />
      <RequestList userId={currentUser} setSelectedConnectionId={setSelectedConnection} users={users} socket={socket} />
      <ChatList currentUser={currentUser} setSelectedConnection={setSelectedConnection} users={users} />
      {selectedConnection && (
        <Chat
          connectionRequestId={selectedConnection.id}
          currentUser={currentUser}
          otherUser={selectedConnection.otherUser}
          users={users}
        />
      )}
    </div>
  );
}

export default App;
