const fs = require('fs');
const { MessageMedia } = require('whatsapp-web.js');
const GeneralUtil = require("../utils/general_util");

const MIN_DELAY = parseInt(process.env.MIN_DELAY_EVERY_CHAT) || 1;
const MAX_DELAY = parseInt(process.env.MAX_DELAY_EVERY_CHAT) || 3;
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE) || 5;

class WhatsappService {
    static async SendMessage(client, recipients, text) {
        if (!text || typeof text !== 'string') {
            throw new Error("Text message must be provided and be a string");
        }

        recipients = Array.isArray(recipients) ? recipients : [recipients];
        const results = [];

        for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
            const batch = recipients.slice(i, i + BATCH_SIZE);
            console.log(`  - [WhatsappService] Sending batch: ${batch.join(", ")}`);

            await Promise.all(batch.map(async (num) => {
                try {
                    const chat = await client.getChatById(`${num}@c.us`);
                    await chat.sendMessage(text);
                    console.log(`  - [WhatsappService] Message sent to ${num}`);
                    results.push(GeneralUtil.SuccessResponse(num));
                } catch (error) {
                    console.log(`  - [WhatsappService] Error sending to ${num}: ${error.message}`);
                    results.push(GeneralUtil.ErrorResponse(num, error.message));
                }
            }));

            if (i + BATCH_SIZE < recipients.length) {
                const delayTime = Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1) + MIN_DELAY) * 1000;
                console.log(`  - [WhatsappService] Waiting ${delayTime / 1000} seconds before next batch...`);
                await GeneralUtil.Delay(delayTime);
            }
        }

        return results;
    }

    static async SendMessageWithFile(client, recipients, text, filePath) {
        if (!filePath || typeof filePath !== 'string' || !fs.existsSync(filePath)) {
            throw new Error("Valid filePath is required");
        }

        recipients = Array.isArray(recipients) ? recipients : [recipients];
        const results = [];
        const media = MessageMedia.fromFilePath(filePath);

        for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
            const batch = recipients.slice(i, i + BATCH_SIZE);
            console.log(`  - [WhatsappService] Sending media batch: ${batch.join(", ")}`);

            await Promise.all(batch.map(async (num) => {
                try {
                    await client.sendMessage(`${num}@c.us`, media, { caption: text });
                    console.log(`  - [WhatsappService] Media message sent to ${num}`);
                    results.push(GeneralUtil.SuccessResponse(num));
                } catch (error) {
                    console.log(`  - [WhatsappService] Error sending media to ${num}: ${error.message}`);
                    results.push(GeneralUtil.ErrorResponse(num, error.message));
                }
            }));

            if (i + BATCH_SIZE < recipients.length) {
                const delayTime = Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1) + MIN_DELAY) * 1000;
                console.log(`  - [WhatsappService] Waiting ${delayTime / 1000} seconds before next batch...`);
                await GeneralUtil.Delay(delayTime);
            }
        }

        fs.unlinkSync(filePath);
        return results;
    }
}

module.exports = WhatsappService;