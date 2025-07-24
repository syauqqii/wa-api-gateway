const express = require('express');
const WhatsappController = require('../controllers/whatsapp_controller');

module.exports = (getClient) => {
    const router = express.Router();
    router.post('/:sessionId', (req, res) => {
        const sessionId = req.params.sessionId;
        const client = getClient(sessionId);

        if (!client) {
            return res.status(404).json({ success: false, message: `Session ${sessionId} not found` });
        }

        WhatsappController.SendMessage(client, req, res);
    });
    return router;
};