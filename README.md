# WhatsApp Automation: Customer Service AI with Gemini API & Backend Endpoint for Campaign Marketing
_WA Automation Chat is a project that utilizes ~~@open-wa/wa-automate~~ whatsapp-web.js for automating WhatsApp messages. This project allows you to send WhatsApp messages automatically using an Express API._  

Make sure you have Postman, Node.js, and NPM installed before running this project.  

## Features  
- Uses ~~@open-wa/wa-automate~~ whatsapp-web.js for WhatsApp message automation.  
- Implements Express with `express-rate-limit` to create an API with the `/send-message` or `/send-message-with-file` endpoint.  
- Uses dotenv to manage environment variables.  
- Integrates Gemini AI API for customer service (if needed).

## How to use (Video [Click Here](https://drive.google.com/file/d/1mb6Gpw3ecujCo18Rfj9OS0lqv6rfrBNE/view?usp=sharing))
1. Clone this repository
```
git clone https://github.com/syauqqii/WA-Automation-Chat
```
2. Navigate to the WA-Automation-Chat directory
```
cd WA-Automation-Chat
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
6. Use the following endpoints to send WhatsApp messages `/send-message` and `/send-message-with-file`

## Endpoint + Params (Tested in Postman)
**[RAW] Send Message (Single Message)**
```bash
[POST] http://localhost:4437/send-message

data :
{
    "to":"62877xxxxxxx",
    "text":"Hello!!"
}
```

**[RAW] Send Message (Many Message)**
```bash
[POST] http://localhost:4437/send-message

data :
{
    "to":[
        "62812xxxxxxx",
        "62877xxxxxxx"
    ],
    "text":"Hello!!"
}
```

**[FORM-DATA] Send Message with Media (Single Message)**
```bash
[POST] http://localhost:4437/send-message-with-file

data :
{
    "to":"62812xxxxxxx"
    "text":"Hello!!",
    "file":<SELECT FROM YOUR PERSONAL COMPUTER>
}
```

**[FORM-DATA] Send Message with Media (Many Message)**
```bash
[POST] http://localhost:4437/send-message-with-file

data :
{
    "to":"62812xxxxxxx",
    "to":"62877xxxxxxx"
    "text":"Hello!!",
    "file":<SELECT FROM YOUR PERSONAL COMPUTER>
}
```