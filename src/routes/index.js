const SendMessage = require('./send_message_route');
const SendMessageWithFile = require('./send_message_with_file_route');

module.exports = (app, client) => {
    app.use('/send-message', SendMessage(client));
    app.use('/send-message-with-file', SendMessageWithFile(client));
};