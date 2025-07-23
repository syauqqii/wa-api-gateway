const fs = require('fs');
const path = require('path');

const SESSION_CACHE_PATH = path.join(__dirname, '../../.cache/session_id.txt');

function saveSessionId(sessionId) {
    fs.mkdirSync(path.dirname(SESSION_CACHE_PATH), { recursive: true });
    fs.writeFileSync(SESSION_CACHE_PATH, sessionId, 'utf8');
}

function loadSessionId() {
    if (fs.existsSync(SESSION_CACHE_PATH)) {
        return fs.readFileSync(SESSION_CACHE_PATH, 'utf8').trim();
    }
    return null;
}

module.exports = { saveSessionId, loadSessionId };