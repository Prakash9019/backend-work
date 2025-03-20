const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
require('dotenv').config();  // Corrected: load environment variables

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Create HTTP server and attach Socket.io
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { 
  cors: { origin: "*" } // Adjust for production if needed
});
app.set('io', io);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for an event to join a user's personal room
  socket.on('joinUser', (userId) => {
    socket.join(userId);
    console.log(`Socket ${socket.id} joined user room ${userId}`);
  });

  // Also, clients can join a conversation room
  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined conversation room ${room}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Connect to MongoDB (make sure MONGO_URI is set in your .env file)
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://plsprakash2003:Surya_2003@cluster0.bpe9m.mongodb.net/Cluster0?retryWrites=true&w=majority",
    );
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit process with failure
  }
};

connectDB();
// Import routes
const connectionRoutes = require('./routes/connection');
app.use('/api', connectionRoutes);

app.get("/", (req, res) => {
  res.json("API is running");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;