const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

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
            console.log(' [Info] QR code received, scan it with your WhatsApp app.');
        });

        client.on('ready', () => {
            console.log(' [Info] Client is ready!');
            resolve(client);
        });

        client.on('auth_failure', msg => {
            console.error(' [Error] Auth failure: ', msg);
            reject(new Error('Auth failure'));
        });

        client.on('error', error => {
            console.error(`  - [whatsapp_client] Error in WA client: ${error.message}`);
            reject(error);
        });

        client.on('message', async (msg) => {
            const from_number = msg.from.split('@')[0];
            const current_time = Date.now();

            console.log(`  - [whatsapp_client] message from ${from_number} (${current_time})`);
        });

        client.initialize();
    });
};