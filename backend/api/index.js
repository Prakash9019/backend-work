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

// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   // Listen for an event to join a user's personal room
//   socket.on('joinUser', (userId) => {
//     socket.join(userId);
//     console.log(`Socket ${socket.id} joined user room ${userId}`);
//   });

//   // Also, clients can join a conversation room
//   socket.on('joinRoom', (room) => {
//     socket.join(room);
//     console.log(`Socket ${socket.id} joined conversation room ${room}`);
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });

// // Connect to MongoDB (make sure MONGO_URI is set in your .env file)
// mongoose.connect(process.env.MONGO_URI, { 
//   useNewUrlParser: true, 
//   useUnifiedTopology: true 
// })
// .then(() => console.log("MongoDB connected"))
// .catch(err => console.error("MongoDB connection error:", err));

// // Import routes
// const connectionRoutes = require('./routes/connection');
// app.use('/api', connectionRoutes);

app.get("/", (req, res) => {
  res.json("API is running");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;