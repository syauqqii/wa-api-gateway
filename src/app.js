require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { Print } = require('./utils/print');
const Routes = require("./routes");
const { initializeWAClient } = require("./clients/whatsapp_client");
const { generateSessionId } = require('./utils/generate_session_id');
const { loadSessionId, saveSessionId } = require('./utils/session_cache');

const app = express();
const HOST = process.env.HOST;
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

console.clear();
console.log();
Print('Checking your session...\n');

let sessionId = loadSessionId();
if (!sessionId) {
    sessionId = generateSessionId();
    saveSessionId(sessionId);
    Print(`Generated and saved new sessionId: ${sessionId}`);
} else {
    Print(`Loaded sessionId from cache: ${sessionId}`);
}

initializeWAClient(sessionId).then(client => {
    app.locals.client = client;

    const apiRoutes = Routes(client);
    app.use('/api', apiRoutes);

    console.clear();
    app.listen(PORT, () => {
        Print(`Whatsapp number active: +${client.info.wid.user} (${client.info.pushname})`);
        Print(`Server is running: http://${HOST}:${PORT}\n`);
        Print('Docs URL: https://github.com/syauqqii/wa-gateway\n');
    });
});