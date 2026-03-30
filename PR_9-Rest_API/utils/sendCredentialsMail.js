const transporter = require("../config/nodemailerConfig");

/**
 * Send login credentials email to a newly created user
 * @param {string} recipientEmail - The new user's email
 * @param {string} recipientName - The new user's full name
 * @param {string} password - The plain text password (before hashing)
 * @param {string} role - The role assigned (admin, manager, employee)
 * @param {string} createdByRole - Who created this user (superadmin, admin, manager)
 */
const sendCredentialsMail = async (recipientEmail, recipientName, password, role, createdByRole) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: `Welcome! Your ${role.charAt(0).toUpperCase() + role.slice(1)} Account Has Been Created`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Welcome to the Team!</h1>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #333;">Hello <strong>${recipientName}</strong>,</p>
            
            <p style="font-size: 14px; color: #555;">
              Your <strong>${role.charAt(0).toUpperCase() + role.slice(1)}</strong> account has been created by the 
              <strong>${createdByRole.charAt(0).toUpperCase() + createdByRole.slice(1)}</strong>.
            </p>
            
            <div style="background: #f8f9fa; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <h3 style="margin: 0 0 10px 0; color: #333;">Your Login Credentials:</h3>
              <p style="margin: 5px 0; font-size: 14px;"><strong>Email:</strong> ${recipientEmail}</p>
              <p style="margin: 5px 0; font-size: 14px;"><strong>Password:</strong> ${password}</p>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 12px; border-radius: 4px; margin: 15px 0;">
              <p style="margin: 0; font-size: 13px; color: #856404;">
                <strong>Important:</strong> Please change your password after your first login for security purposes.
              </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
            
            <p style="font-size: 12px; color: #999; text-align: center;">
              This is an automated email. Please do not reply to this message.
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Credentials email sent to: ${recipientEmail}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Failed to send email to ${recipientEmail}:`, error.message);
    return { success: false, error: error.message };
  }
};

module.exports = sendCredentialsMail;
