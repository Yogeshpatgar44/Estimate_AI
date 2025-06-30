const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendEstimateEmail = async (toEmail, subject, htmlContent, attachmentBase64) => {
  const mailOptions = {
    from: `"Estimate App" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject,
    html: htmlContent,
    attachments: [],
  };

  if (attachmentBase64) {
    mailOptions.attachments.push({
      filename: 'estimate.pdf',
      content: Buffer.from(attachmentBase64, 'base64'),
      encoding: 'base64',
      contentType: 'application/pdf',
    });
  }

  await transporter.sendMail(mailOptions);
};
