const nodemailer = require("nodemailer");
const sendEmail = (
  clienteEmail: string,
  bodyHtml: any,
  subjectEmail: string
) => {
  // Create a Nodemailer transporter

  const transporter = nodemailer.createTransport({
    host: process.env.API_EMAIL_HOST,
    // port: process.env.API_EMAIL_PORT, // Port for SSL
    secure: true, // Use SSL
    auth: {
      user: process.env.API_EMAIL_AUTH_USER,
      pass: process.env.API_EMAIL_AUTH_PASS,
    },
  });

  // Define the email content
  const mailOptions = {
    from: process.env.API_EMAIL_FROM,
    to: clienteEmail,
    subject: subjectEmail,
    html: bodyHtml,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error: Error | null, info: any) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent successfully: ", info.response);
    }
  });
};

export default sendEmail;
