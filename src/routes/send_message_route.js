const express = require('express');
const WhatsappController = require('../controllers/whatsapp_controller');

module.exports = (client) => {
    const router = express.Router();

    router.post('/', (req, res) => WhatsappController.SendMessage(client, req, res));

    return router;
};