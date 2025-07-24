const SendMessage = require('./send_message_route');
const SendMessageWithFile = require('./send_message_with_file_route');
const { getClient } = require('../clients/whatsapp_client');

const SessionRoutes = require('./session_route');

module.exports = () => {
    const express = require('express');
    const router = express.Router();

    router.use('/send-message', SendMessage(getClient));
    router.use('/send-message-with-file', SendMessageWithFile(getClient));

    router.use('/session', SessionRoutes);

    return router;
};
