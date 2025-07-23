const express = require('express');
const router = express.Router();

const SendMessage = require('./send_message_route');
const SendMessageWithFile = require('./send_message_with_file_route');
const sessionRoutes = require('./session_route');

module.exports = (client) => {
    router.use('/send-message', SendMessage(client));
    router.use('/send-message-with-file', SendMessageWithFile(client));
    router.use('/session', sessionRoutes);

    return router;
};