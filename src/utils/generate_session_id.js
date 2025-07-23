const generateSessionId = () => {
    const timestamp = Date.now();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `SESSION-${timestamp}-${random}`;
};

module.exports = { generateSessionId };