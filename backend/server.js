const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { EmailClient } = require('@azure/communication-email');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());
app.use(cors());

// Environment variables
const connectionString = process.env.COMMUNICATION_SERVICES_CONNECTION_STRING;
const senderAddress = process.env.SENDER_EMAIL_ADDRESS;

// Database connection config (Azure Database for MySQL Flexible Server)
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'testdb',
  ssl: { rejectUnauthorized: false }
};

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'Healthy',
    service: 'Azure Backend Node.js API',
    timestamp: new Date().toISOString()
  });
});

// Database Connectivity Check API
app.get('/api/db-check', async (req, res) => {
  if (!process.env.DB_HOST) {
    return res.json({ status: 'Skipped', message: 'DB_HOST not configured yet.' });
  }
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.query('SELECT 1');
    await connection.end();
    res.json({ success: true, message: 'Successfully connected to Azure MySQL Flexible Server!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send Email API via Azure Communication Services
app.post('/api/send-email', async (req, res) => {
  const { toEmail, subject, message } = req.body;

  if (!toEmail) {
    return res.status(400).json({ success: false, error: 'Recipient email (toEmail) is required.' });
  }

  if (!connectionString || !senderAddress) {
    return res.status(500).json({
      success: false,
      error: 'Azure Communication Services connection string or sender address is not configured in Environment Variables.'
    });
  }

  try {
    const emailClient = new EmailClient(connectionString);

    const emailMessage = {
      senderAddress: senderAddress,
      content: {
        subject: subject || 'OTP / Azure Architecture Notification',
        plainText: message || 'Hello from Azure Enterprise Architecture! Your email notification service is working successfully.'
      },
      recipients: {
        to: [{ address: toEmail }]
      }
    };

    console.log(`Sending email to: ${toEmail}`);
    const poller = await emailClient.beginSend(emailMessage);
    const response = await poller.pollUntilDone();

    res.json({
      success: true,
      status: response.status,
      messageId: response.id,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Azure backend server running on port ${PORT}`);
});
