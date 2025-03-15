const express = require("express");
const webPush = require("web-push");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

const publicVapidKey = "BIEw9ZQe-ZtbQbB9GUIrkqozce1iIBa3daF-dCm1YUyivjPzdtcTo4UGlpf0p7XcSIB2yiYu5baAyxzu-Z6ltg4"; // Replace with your VAPID public key
const privateVapidKey = "v_ufdHLKo18d9Qd5-5Z5QVf9Ytn9HRs-gjGfvWl3OFo"; // Replace with your VAPID private key

webPush.setVapidDetails(
    "mailto:test@example.com",
    publicVapidKey,
    privateVapidKey
);

app.use(bodyParser.json());

let subscriptions = [];

app.post("/subscribe", (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription);
    res.status(201).json({});
});

app.post("/send-notification", (req, res) => {
    const { title, body } = req.body;
    
    subscriptions.forEach((subscription) => {
        webPush.sendNotification(subscription, JSON.stringify({ title, body }))
            .catch((error) => console.error(error));
    });

    res.status(200).json({ message: "Notifications sent." });
});

app.listen(port, () => console.log(`Server started on port ${port}`));
