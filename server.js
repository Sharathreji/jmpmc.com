const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Files will be saved in the 'uploads' folder

// POST route to handle file uploads and send emails
app.post('/send-email', upload.single('file'), (req, res) => {
    const position = req.body.position; // Position name from the form
    const file = req.file; // Uploaded file information

    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com', // Replace with your Gmail address
            pass: 'your-email-password', // Replace with your Gmail password or app-specific password
        },
    });

    // Configure email options
    const mailOptions = {
        from: 'your-email@gmail.com', // Sender's email
        to: 'sharathreji06@gmail.com', // Receiver's email
        subject: `Application for ${position}`,
        text: `The applicant has applied for the position of ${position}. Please find their CV attached.`,
        attachments: [
            {
                filename: file.originalname,
                path: file.path,
            },
        ],
    };

    // Send the email
    transporter.sendMail(mailOptions, (err, info) => {
        // Delete the uploaded file after sending the email
        fs.unlink(file.path, (unlinkErr) => {
            if (unlinkErr) console.error('Error deleting file:', unlinkErr);
        });

        if (err) {
            console.error('Error sending email:', err);
            return res.status(500).send('Error sending email.');
        }
        console.log('Email sent:', info.response);
        res.send('Application submitted successfully!');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});