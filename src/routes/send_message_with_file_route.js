const express = require('express');
const multer = require('multer');
const WhatsappController = require('../controllers/whatsapp_controller');

module.exports = (getClient) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, 'files/'),
        filename: (req, file, cb) => cb(null, file.originalname),
    });

    const upload = multer({ storage });

    const router = express.Router();

    router.post('/:sessionId', upload.single('file'), (req, res) => {
        const sessionId = req.params.sessionId;
        const client = getClient(sessionId);

        if (!client) {
            return res.status(404).json({ success: false, message: `Session ${sessionId} not found` });
        }

        WhatsappController.SendMessageWithFile(client, req, res);
    });

    return router;
};