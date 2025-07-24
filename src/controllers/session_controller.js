const { v4: uuidv4 } = require('uuid');
const WhatsappClient = require("../clients/whatsapp_client");
const { Print, PrintError } = require("../utils/print");
const { saveSessions } = require('../utils/multi_session_cache');
const fs = require('fs');
const path = require('path');

class SessionController {
    static async InitSession(req, res) {
        try {
            const sessionId = `SESSION-${uuidv4()}`;
            
            await WhatsappClient.initializeWAClient(sessionId);
            saveSessions([...WhatsappClient.getAllSessions().map(s => s.id)]);

            Print(`session_controller - Session initialized: ${sessionId}`);
            res.status(201).json({
                success: true,
                message: "Session created. Please scan QR code.",
                id: sessionId,
            });
        } catch (err) {
            PrintError(`session_controller - Init failed: ${err.message}`);
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    }

    static async GetSession(req, res) {
        try {
            const sessionId = req.params.id;
            const session = WhatsappClient.getSessionIfExists(sessionId);
            
            if (!session) {
                return res.status(404).json({
                    success: false,
                    message: "Session not found"
                });
            }

            res.json({
                success: true,
                session
            });
        } catch (err) {
            PrintError(`session_controller - Get session failed: ${err.message}`);
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }

    static GetQRCode(req, res) {
        try {
            const sessionId = req.query.id;
            const qr = WhatsappClient.getQRCode(sessionId);

            res.json({
                success: true,
                id: sessionId,
                qr: qr,
            });
        } catch (err) {
            res.status(404).json({
                success: false,
                message: err.message,
            });
        }
    }

    static GetSessionStatus(req, res) {
        try {
            const sessionId = req.query.id;
            const status = WhatsappClient.getStatus(sessionId);

            res.json({
                success: true,
                id: sessionId,
                status,
            });
        } catch (err) {
            res.status(400).json({
                success: false,
                message: err.message,
            });
        }
    }

    static GetSessionDetail(req, res) {
        try {
            const sessionId = req.query.id;
            const status = WhatsappClient.getStatus(sessionId);
            const meta = WhatsappClient.getSessionMeta(sessionId);

            res.json({
                success: true,
                id: sessionId,
                status,
                metadata: meta,
            });
        } catch (err) {
            res.status(404).json({
                success: false,
                message: err.message,
            });
        }
    }

    static GetSessionList(req, res) {
        try {
            const sessions = WhatsappClient.getAllSessions();
            res.json({
                success: true,
                count: sessions.length,
                sessions,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    }

    static async LogoutSession(req, res) {
        try {
            const sessionId = req.query.id;
            const client = WhatsappClient.getClient(sessionId);

            if (!client) {
                return res.status(404).json({
                    success: false,
                    message: "Session not found or already logged out."
                });
            }

            await client.destroy();

            WhatsappClient.removeSession(sessionId);

            const authFolder = path.join(__dirname, `../.wwebjs_auth/${sessionId}`);
            if (fs.existsSync(authFolder)) {
                fs.rmSync(authFolder, { recursive: true, force: true });
            }

            const currentSessions = WhatsappClient.getAllSessions().map(s => s.id);
            saveSessions(currentSessions);

            Print(`session_controller - Session ${sessionId} logged out and cleaned.`);
            res.json({
                success: true,
                message: `Session ${sessionId} successfully logged out.`
            });
        } catch (err) {
            PrintError(`session_controller - Logout failed: ${err.message}`);
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }
}

module.exports = SessionController;