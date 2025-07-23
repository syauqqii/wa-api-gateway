const express = require('express');
const router = express.Router();

const SessionController = require('../controllers/session_controller');

// router.post('/create', SessionController.InitSession);
router.get('/qr', SessionController.GetQRCode);
router.get('/status', SessionController.GetSessionStatus);
router.get('/detail', SessionController.GetSessionDetail);
router.get('/list', SessionController.GetSessionList);

module.exports = router;