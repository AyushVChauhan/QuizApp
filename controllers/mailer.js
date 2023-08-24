const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
      user: "avcthehero@gmail.com",
      pass: "avgcmqglcwtoftsy",
    },
  });
transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
});

module.exports = transporter;