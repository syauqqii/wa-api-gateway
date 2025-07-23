const WhatsappClient = require("../clients/whatsapp_client");
// const { Print, PrintError } = require("../utils/print");

class SessionController {
    // static async InitSession(req, res) {
    //     try {
    //         const sessionId = WhatsappSessionDTO.InitRequest();
    //         await WhatsappClient.InitSession(sessionId);

    //         Print(`session_controller - Session initialized: ${sessionId}`);
    //         res.status(201).json({
    //             success: true,
    //             message: "Session created",
    //             id: sessionId,
    //         });
    //     } catch (err) {
    //         PrintError(`session_controller - Init failed: ${err.message}`);
    //         res.status(500).json({
    //             success: false,
    //             message: err.message,
    //         });
    //     }
    // }

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
}

module.exports = SessionController;