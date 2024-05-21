const router = require("express").Router();
const chatLog = require("../models/chatlog");
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8081 });

const clients = []; // store all clients connected

// broadcast messages to all connected client
const broadcastMessage = (message) => {
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
};

const changeStream = chatLog.watch();

 // listen for changes in collection
 changeStream.on('change', (change) => {
    broadcastMessage(JSON.stringify(change));
});

// handle client connection
wss.on('connection', (ws) => {
    clients.push(ws);

    // handle client disconnection
    ws.on('close', () => {
        // remove client from list of connected clients
        const index = clients.indexOf(ws);
        if (index !== -1) {
            clients.splice(index, 1);
        }
    });
});



// store messages in database
router.post('/chat', async (req, res) => {
    try {
        await new chatLog({
            sender: req.body.sender,
            receiver: req.body.receiver,
            message: req.body.message
        }).save();
        res.status(200).send({ status: "Message saved successfully" });
    } catch (error) {
        console.log('Error saving message:', error);
        res.status(500).send("Error saving message");
    }
});

// getting chat messages
router.get('/chat', async (req, res) => {
    try{
        const sender = req.query.sender;
        const receiver = req.query.receiver;
    
        // gets all messages sent between sender and receiver
        const chatMessages = await chatLog.find({
            $or: [
                { sender: sender, receiver: receiver },
                { sender: receiver, receiver: sender }
            ]
        });
    
        res.status(200).json(chatMessages);

    }
    catch(error){
        console.log('Error getting chats: ', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;