const { Client, LocalAuth } = require('whatsapp-web.js');
// const qrcode = require('qrcode-terminal');
const QRCode = require('qrcode');
const { Print, PrintError } = require('../utils/print');
const { saveSessions, getSessionById } = require('../utils/multi_session_cache');

const statuses = {};
const clients = {};
const qrCodes = {};
const sessionMeta = {};

exports.getStatus = (sessionId) => statuses[sessionId] || null;
exports.getClient = (sessionId) => clients[sessionId] || null;
exports.getQRCode = (sessionId) => qrCodes[sessionId] || null;
exports.getSessionMeta = (sessionId) => sessionMeta[sessionId] || null;

exports.removeSession = (sessionId) => {
    delete clients[sessionId];
    delete statuses[sessionId];
    delete qrCodes[sessionId];
    delete sessionMeta[sessionId];
};

exports.getSessionIfExists = (sessionId) => {
    const existingSession = getSessionById(sessionId);
    if (existingSession) {
        return {
            id: sessionId,
            status: statuses[sessionId] || 'DISCONNECTED',
            meta: sessionMeta[sessionId] || null
        };
    }
    return null;
};

exports.getAllSessions = () => {
    return Object.keys(clients).map((sessionId) => ({
        id: sessionId,
        status: statuses[sessionId] || null,
        meta: sessionMeta[sessionId] || null
    }));
};

exports.initializeWAClient = (sessionId) => {
    const existingSession = getSessionById(sessionId);
    if (existingSession && clients[sessionId]) {
        return Promise.resolve(clients[sessionId]);
    }

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

        resolve(client);

        client.on('qr', async qr => {
            Print(`QR code received for session ${sessionId}`);
            try {
                const base64 = await QRCode.toDataURL(qr);
                qrCodes[sessionId] = base64;
                statuses[sessionId] = 'PENDING';
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
            } catch (err) {
                PrintError(`Error fetching metadata for session ${sessionId}:`, err);
                statuses[sessionId] = 'ERROR';
            }
        });

        client.on('auth_failure', msg => {
            PrintError(`Auth failure on session ${sessionId}:`, msg);
            statuses[sessionId] = 'FAILED';
        });

        client.on('disconnected', async () => {
            Print(`Session ${sessionId} disconnected. Attempting to reconnect...`);
            statuses[sessionId] = 'DISCONNECTED';
            delete clients[sessionId];
            delete qrCodes[sessionId];
            delete sessionMeta[sessionId];

            const sessions = Object.keys(clients);
            saveSessions(sessions);
        });

        client.on('error', error => {
            PrintError(`WhatsApp client error [${sessionId}]:`, error.message);
            statuses[sessionId] = 'ERROR';
        });

        client.initialize();
    });
};