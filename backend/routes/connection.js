const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const ConnectionRequest = require('../models/ConnectionRequest');
const ChatMessage = require('../models/ChatMessage');

// POST: Send a connection request
router.post('/connection-request', async (req, res) => {
  const { fromUser, toUser, message } = req.body;
  if (!fromUser || !toUser) {
    return res.status(400).json({ error: 'Both sender and recipient IDs are required' });
  }
  if (!mongoose.Types.ObjectId.isValid(fromUser) || !mongoose.Types.ObjectId.isValid(toUser)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }
  try {
    const newRequest = new ConnectionRequest({ fromUser, toUser, message });
    await newRequest.save();
    
    // Emit the new connection request to the recipient's room
    const io = req.app.get('io');
    io.to(toUser).emit('newConnectionRequest', newRequest);
    
    res.status(201).json({ message: 'Connection request sent', request: newRequest });
  } catch (err) {
    console.error('Error sending connection request:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET: Retrieve incoming connection requests for a user
router.get('/connection-requests/:userId', async (req, res) => {
  const userId = req.params.userId;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }
  try {
    const requests = await ConnectionRequest.find({ toUser: userId });
    res.status(200).json(requests);
  } catch (err) {
    console.error('Error fetching connection requests:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST: Accept a connection request
router.post('/connection-request/accept', async (req, res) => {
  const { requestId } = req.body;
  if (!mongoose.Types.ObjectId.isValid(requestId)) {
    return res.status(400).json({ error: 'Invalid request ID format' });
  }
  try {
    const request = await ConnectionRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    request.status = 'accepted';
    await request.save();
    res.status(200).json({ message: 'Connection accepted', request });
  } catch (err) {
    console.error('Error accepting connection request:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET: Retrieve accepted chats (conversations) for a user
router.get('/chats/:userId', async (req, res) => {
  const userId = req.params.userId;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }
  try {
    const chats = await ConnectionRequest.find({
      status: 'accepted',
      $or: [{ fromUser: userId }, { toUser: userId }]
    });
    res.status(200).json(chats);
  } catch (err) {
    console.error('Error fetching chats:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST: Send a chat message (real-time via Socket.io)
router.post('/chat/send', async (req, res) => {
  const { connectionRequest, sender, message } = req.body;
  if (!mongoose.Types.ObjectId.isValid(connectionRequest) || !mongoose.Types.ObjectId.isValid(sender)) {
    return res.status(400).json({ error: 'Invalid connectionRequest or sender ID format' });
  }
  try {
    const chatMessage = new ChatMessage({ connectionRequest, sender, message });
    await chatMessage.save();

    // Emit the new message to the room (using the conversation/connectionRequest ID)
    const io = req.app.get('io');
    io.to(connectionRequest).emit('newMessage', chatMessage);
    
    res.status(201).json({ message: 'Chat message sent', chatMessage });
  } catch (err) {
    console.error('Error sending chat message:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET: Retrieve chat messages for a conversation
router.get('/chat/:connectionRequestId', async (req, res) => {
  const connectionRequestId = req.params.connectionRequestId;
  if (!mongoose.Types.ObjectId.isValid(connectionRequestId)) {
    return res.status(400).json({ error: 'Invalid connectionRequestId format' });
  }
  try {
    const messages = await ChatMessage.find({ connectionRequest: connectionRequestId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    console.error('Error fetching chat messages:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
