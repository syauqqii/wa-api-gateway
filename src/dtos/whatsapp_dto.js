class WhatsappDTO {
    static SendMessageRequest({ to, text }) {
        if (!to || !text || (typeof to !== 'string' && !Array.isArray(to)) || typeof text !== 'string') {
            console.log('  - [WhatsappDTO::SendMessageRequest] Invalid JSON format\n');
            throw new Error("Invalid JSON format");
        }

        return { to, text };
    }

    static SendMessageWithFileRequest({ to, text, file }) {
        if (!to || (typeof to !== 'string' && !Array.isArray(to))) {
            console.log('  - [WhatsappDTO::SendMessageWithFileRequest] Invalid recipient format\n');
            throw new Error("Invalid recipient format");
        }
    
        if (!file) {
            console.log('  - [WhatsappDTO::SendMessageWithFileRequest] File is required for this endpoint\n');
            throw new Error("File must be provided");
        }
    
        if (text && typeof text !== 'string') {
            console.log('  - [WhatsappDTO::SendMessageWithFileRequest] Text must be a string\n');
            throw new Error("Text must be a string");
        }
    
        return { to, text, file };
    }    
}

module.exports = WhatsappDTO;