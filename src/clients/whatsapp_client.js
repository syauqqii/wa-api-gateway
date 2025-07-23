const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const QRCode = require('qrcode');
const { Print, PrintError } = require('../utils/print');

const statuses = {};
const clients = {};
const qrCodes = {};
const sessionMeta = {};

exports.getStatus = (sessionId) => statuses[sessionId] || null;
exports.getClient = (sessionId) => clients[sessionId] || null;
exports.getQRCode = (sessionId) => qrCodes[sessionId] || null;
exports.getSessionMeta = (sessionId) => sessionMeta[sessionId] || null;

exports.getAllSessions = () => {
    return Object.keys(clients).map((sessionId) => ({
        id: sessionId,
        status: statuses[sessionId] || null,
        meta: sessionMeta[sessionId] || null
    }));
};

exports.initializeWAClient = (sessionId) => {
    if (clients[sessionId]) return Promise.resolve(clients[sessionId]);

    return new Promise((resolve, reject) => {
        const client = new Client({
            authStrategy: new LocalAuth({ clientId: sessionId }),
            puppeteer: {
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            }
        });

        statuses[sessionId] = 'PENDING';
        clients[sessionId] = client;

        client.on('qr', async qr => {
            qrcode.generate(qr, { small: true });
            Print(`QR code received for session ${sessionId}`);
            statuses[sessionId] = 'PENDING';

            try {
                const base64 = await QRCode.toDataURL(qr);
                qrCodes[sessionId] = base64;
            } catch (err) {
                PrintError('Failed to generate QR for frontend', err.message);
            }
        });

        client.on('ready', async () => {
            try {
                const chats = await client.getChats();
                const groups = chats.filter(c => c.isGroup);
                const privates = chats.filter(c => !c.isGroup);
                const unread = chats.filter(c => c.unreadCount > 0).length;

                sessionMeta[sessionId] = {
                    phone_number: client.info?.wid?.user || 'unknown',
                    name: client.info?.pushname || 'unknown',
                    chats: chats.length,
                    groups: groups.length,
                    privates: privates.length,
                    unread
                };

                statuses[sessionId] = 'READY';
                Print(`WhatsApp session ${sessionId} is ready!`);
                resolve(client);
            } catch (err) {
                PrintError(`Error fetching metadata for session ${sessionId}:`, err);
                statuses[sessionId] = 'ERROR';
                reject(err);
            }
        });

        client.on('auth_failure', msg => {
            PrintError(`Auth failure on session ${sessionId}:`, msg);
            statuses[sessionId] = 'FAILED';
            reject(new Error('Auth failure'));
        });

        client.on('disconnected', () => {
            Print(`Session ${sessionId} disconnected.`);
            statuses[sessionId] = 'DISCONNECTED';
            delete clients[sessionId];
            delete qrCodes[sessionId];
            delete sessionMeta[sessionId];
        });

        client.on('error', error => {
            PrintError(`WhatsApp client error [${sessionId}]:`, error.message);
            statuses[sessionId] = 'ERROR';
            reject(error);
        });

        // client.on('message_create', async (msg) => {});
        // client.on('message', async (msg) => {});

        client.initialize();
    });
};