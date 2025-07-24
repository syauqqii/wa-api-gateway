const SendMessage = require('./send_message_route');
const SendMessageWithFile = require('./send_message_with_file_route');

const SessionRoutes = require('./session_route');

module.exports = () => {
    const express = require('express');
    const router = express.Router();

    router.use('/send-message', SendMessage());
    router.use('/send-message-with-file', SendMessageWithFile());

    router.use('/session', SessionRoutes);

    return router;
};