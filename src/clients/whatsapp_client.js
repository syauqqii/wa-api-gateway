const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const { Print, PrintError } = require('../utils/print');

exports.initializeWAClient = () => {
    return new Promise((resolve, reject) => {
        const client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: {
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            }
        });

        client.on('qr', qr => {
            qrcode.generate(qr, { small: true });
            Print('QR code received, scan it with your WhatsApp.');
        });

        client.on('ready', () => {
            Print('Client is ready!');
            resolve(client);
        });

        client.on('auth_failure', msg => {
            PrintError('whatsapp_client - on.auth_failure: ', msg);
            reject(new Error('Auth failure'));
        });

        client.on('error', error => {
            PrintError(`whatsapp_client - on.error: ${error.message}`);
            reject(error);
        });

        // Handle self msg
        // client.on('message_create', async (msg) => {});

        // Handle incoming msg
        // client.on('message', async (msg) => {});

        client.initialize();
    });
};