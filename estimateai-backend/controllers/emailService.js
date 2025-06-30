// // emailService.js or wherever your email logic is
// const nodemailer = require('nodemailer');
// require('dotenv').config();

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   secure: false, // use true for port 465 if needed
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// // Exported function
// exports.sendEstimateEmail = async (toEmail, subject, htmlContent) => {
//   try {
//     const info = await transporter.sendMail({
//       from: `"Estimate App" <${process.env.SMTP_USER}>`,
//       to: toEmail,
//       subject,
//       html: htmlContent,
//     });

//     console.log('Email sent:', info.messageId);
//     return info;
//   } catch (error) {
//     console.error('Email sending failed:', error);
//     throw error;
//   }
// };

const nodemailer = require('nodemailer');

exports.sendEstimateEmail = async (req, res) => {
  try {
    const { to, subject, htmlContent, pdfBase64 } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Estimate App" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: htmlContent,
      attachments: [
        {
          filename: 'estimate.pdf',
          content: pdfBase64.split('base64,')[1], // remove the prefix
          encoding: 'base64',
          contentType: 'application/pdf',
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Email sent with PDF attachment.' });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ message: 'Failed to send email with PDF' });
  }
};

