const WhatsappDTO = require("../dtos/whatsapp_dto");
const WhatsappService = require("../services/whatsapp_service");

class WhatsappController {
    static async SendMessage(client, req, res) {
        try {
            const data = WhatsappDTO.SendMessageRequest({
                to: req.body.to,
                text: req.body.text,
            });

            const result = await WhatsappService.SendMessage(client, data.to, data.text);
            console.log("  - [WhatsappController::SendMessage] Message sent successfully\n");

            res.status(200).json(result);
        } catch (error) {
            console.error(`  - [WhatsappController::SendMessage] Failed to send message: ${error.message}\n`);

            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    static async SendMessageWithFile(client, req, res) {
        try {
            const data = WhatsappDTO.SendMessageWithFileRequest({
                to: req.body.to,
                text: req.body.text,
                file: req.file,
            });

            const result = await WhatsappService.SendMessageWithFile(client, data.to, data.text, data.file.path);
            console.log("  - [WhatsappController::SendMessageWithFile] Message (with File) sent successfully\n");

            res.status(200).json(result);
        } catch (error) {
            console.error(`  - [WhatsappController::SendMessage] Failed to send message (with File): ${error.message}\n`);

            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}

module.exports = WhatsappController;