require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { Print } = require('./utils/print');
const Routes = require("./routes");
const { loadSessions } = require('./utils/multi_session_cache');
const WhatsappClient = require('./clients/whatsapp_client');

const app = express();
const HOST = process.env.HOST;
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

const apiRoutes = Routes();
app.use('/api', apiRoutes);

async function initializeSavedSessions() {
    const savedSessions = loadSessions();
    if (savedSessions.length > 0) {
        Print(`Found ${savedSessions.length} saved sessions. Attempting to restore in parallel...`);
        
        const initPromises = savedSessions.map(async (sessionId) => {
            try {
                await WhatsappClient.initializeWAClient(sessionId);
                Print(`Restored session: ${sessionId}`);
                return { sessionId, success: true };
            } catch (err) {
                Print(`Failed to restore session ${sessionId}: ${err.message}`);
                return { sessionId, success: false, error: err.message };
            }
        });

        const results = await Promise.all(initPromises);
        const successful = results.filter(r => r.success).length;
        Print(`Restored ${successful}/${savedSessions.length} sessions`);
    }
}

app.listen(PORT, async () => {
    Print(`Server is running: http://${HOST}:${PORT}`);
    Print('Docs URL: https://github.com/syauqqii/wa-gateway\n');
    
    await initializeSavedSessions();
});