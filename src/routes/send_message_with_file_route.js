const express = require('express');
const multer = require('multer');
const WhatsappController = require('../controllers/whatsapp_controller');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'files/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

module.exports = (client) => {
    const router = express.Router();

    router.post('/', upload.single('file'), (req, res) => {
        WhatsappController.SendMessageWithFile(client, req, res);
    });

    return router;
};