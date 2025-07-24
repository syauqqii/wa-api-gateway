const express = require('express');
const WhatsappController = require('../controllers/whatsapp_controller');
const { getClient, getStatus } = require('../clients/whatsapp_client');

module.exports = () => {
    const router = express.Router();

    router.post('/:sessionId', (req, res) => {
        const sessionId = req.params.sessionId;
        const client = getClient(sessionId);

        if (!client) {
            return res.status(404).json({ success: false, message: `Session ${sessionId} not found` });
        }

        const status = getStatus(sessionId);
        if (status !== 'READY') {
            return res.status(400).json({
                success: false,
                message: `Session ${sessionId} belum siap. Status sekarang: ${status}. Silakan scan QR dulu.`,
            });
        }

        WhatsappController.SendMessage(client, req, res);
    });

    return router;
};