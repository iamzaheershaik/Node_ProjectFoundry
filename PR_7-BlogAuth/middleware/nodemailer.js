const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "zaheershaik0323@gmail.com",       // Replace with your Gmail
        pass: "wybscbgkaivjvmqa"            // Replace with your Gmail App Password
    }
});

const sendMail = async (to, subject, html) => {
    try {
        let info = await transporter.sendMail({
            from: '"Blog Admin Panel" <zaheershaik0323@gmail.com>',  // Replace with your Gmail
            to: to,
            subject: subject,
            html: html
        });
        console.log("Email sent: ", info.messageId);
        return info;
    } catch (error) {
        console.log("Email Error: ", error);
        throw error;
    }
};

module.exports = sendMail;
