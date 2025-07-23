const { Print } = require('../utils/print');

class WhatsappDTO {
    static SendMessageRequest({ to, text }) {
        if (!to || !text || (typeof to !== 'string' && !Array.isArray(to)) || typeof text !== 'string') {
            Print('whatsapp_dto - Invalid JSON format\n');
            throw new Error("Invalid JSON format");
        }

        return { to, text };
    }

    static SendMessageWithFileRequest({ to, text, file }) {
        if (!to || (typeof to !== 'string' && !Array.isArray(to))) {
            Print('whatsapp_dto - Invalid recipient format\n');
            throw new Error("Invalid recipient format");
        }
    
        if (!file) {
            Print('whatsapp_dto - File is required for this endpoint\n');
            throw new Error("File must be provided");
        }
    
        if (text && typeof text !== 'string') {
            Print('whatsapp_dto - Text must be a string\n');
            throw new Error("Text must be a string");
        }
    
        return { to, text, file };
    }    
}

module.exports = WhatsappDTO;