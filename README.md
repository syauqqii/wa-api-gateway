# WhatsApp to API
_This project allows you to send WhatsApp messages using an Express API._  

Make sure you have Postman, Node.js, and NPM installed before running this project.  

## Features  
- Uses ~~@open-wa/wa-automate~~ whatsapp-web.js for WhatsApp message automation.  
- Implements Express with `express-rate-limit` to create an API with the `/send-message` or `/send-message-with-file` endpoint.  
- Uses dotenv to manage environment variables.

## How to use
1. Clone this repository
```
git clone https://github.com/syauqqii/wa-gateway
```
2. Navigate to the wa-gateway directory
```
cd wa-gateway
```
3. Instal dependencies
```
npm install
```
4. Configure variables in the `.env` file
5. Start the application
```
npm start
```
6. Use the following endpoints to send WhatsApp messages `/api/send-message`, `/api/send-message-with-file`, and `/api/session/<..>`
7. Open `http://127.0.0.1:4437/` in your web browser (FRONT END MANAGER for WA-GATEWAY).

## Endpoint + Params (Tested in Postman)
**Create Session [POST:RAW]**
```bash
[POST] http://localhost:4437/api/session/create
```

**Get QR Code by Session ID**
```bash
[GET] http://localhost:4437/api/session/qr?id=:sessionId
```

**Get Status by Session ID**
```bash
[GET] http://localhost:4437/api/session/status?id=:sessionId
```

**Get Detail by Session ID**
```bash
[GET] http://localhost:4437/api/session/detail?id=:sessionId
```

**Get All Session List**
```
[GET] http://localhost:4437/api/session/list
```

**Send Message (Single Message) [POST:RAW]**
```bash
[POST] http://localhost:4437/api/send-message/:sessionId

data :
{
    "to":"62877xxxxxxx",
    "text":"Hello!!"
}
```

**Send Message (Many Message) [POST:RAW]**
```bash
[POST] http://localhost:4437/api/send-message/:sessionId

data :
{
    "to":[
        "62812xxxxxxx",
        "62877xxxxxxx"
    ],
    "text":"Hello!!"
}
```

**Send Message with Media (Single Message) [POST:FORM-DATA]**
```bash
[POST] http://localhost:4437/api/send-message-with-file/:sessionId

data :
{
    "to":"62812xxxxxxx"
    "text":"Hello!!",
    "file":<SELECT FROM YOUR PERSONAL COMPUTER>
}
```

**Send Message with Media (Many Message) [POST:FORM-DATA]**
```bash
[POST] http://localhost:4437/api/send-message-with-file/:sessionId

data :
{
    "to":"62812xxxxxxx",
    "to":"62877xxxxxxx"
    "text":"Hello!!",
    "file":<SELECT FROM YOUR PERSONAL COMPUTER>
}
```