const fs = require('fs');
const path = require('path');

const CACHE_PATH = path.join(__dirname, '../../.cache/sessions.json');

function loadSessions() {
    if (!fs.existsSync(CACHE_PATH)) return [];
    return JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'));
}

function saveSessions(sessions) {
    fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
    fs.writeFileSync(CACHE_PATH, JSON.stringify(sessions), 'utf-8');
}

function getSessionById(sessionId) {
    const sessions = loadSessions();
    return sessions.find(id => id === sessionId) || null;
}

module.exports = { loadSessions, saveSessions, getSessionById };