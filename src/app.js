require('dotenv').config();

const express = require('express');
const cors = require('cors');

const InitialRoutes = require("./routes");
const { initializeWAClient } = require("./clients/whatsapp_client");

const app = express();
const HOST = process.env.HOST;
const PORT = process.env.PORT;
const DEBUG = parseInt(process.env.DEBUG) === 1;

app.use(cors());
app.use(express.json());

console.clear();
console.log('\n [INFORMATION] Checking your session... *(be patient)\n');

initializeWAClient().then(client => {
    app.locals.client = client;
    InitialRoutes(app, client);

    console.clear();
    app.listen(PORT, HOST, () => {
        if (DEBUG) {
            console.log(`\n > [Info] Whatsapp number active: +${client.info.wid.user} (${client.info.pushname})`);
            console.log(`\n > [Info] Server is running: http://${HOST}:${PORT}\n`);
            console.log(' > [Docs] URL: https://github.com/syauqqii/WA-Automation-Chat\n')
        } else {
            console.log(`\n > Server is running: http://${HOST}:${PORT}\n`);
            console.log = () => {};
        }
    });
});