const nodemailer = require('nodemailer')

// Transporter

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ismail.aberlianto@gmail.com',
        pass: 'xnqx eunq xpyc kfyz'
    }
})

// send email

function welcomeEmail(userEmail, username) {
    const mailOptions = {
        from: '"Addplay Team" <ismail.aberlianto@gmail.com>', // Nama Pengirim & Email
        to: userEmail,                                // Email tujuan 
        subject: 'Welcome to Addplay Web App! 🎵',            // Subjek Email

        html: `
            <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
                <h2 style="color: #006699;">Welcome to Addplay, ${username}! 🎉</h2>
                <p style="color: #1e293b; font-size: 14px; line-height: 1.6;">
                    Thank you for joining our community. Your account has been successfully created. Now you can craft your own personalized music playlists and manage your favorite tracks seamlessly.
                </p>
                <div style="margin: 24px 0; text-align: center;">
                    <a href="http://localhost:3013/login" style="background-color: #7cd0ff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 20px; font-weight: 600; display: inline-block;">
                        Get Started & Login
                    </a>
                </div>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin-bottom: 16px;">
                <p style="font-size: 11px; color: #64748b; text-align: center;">
                    This is an automated welcome message from Addplay Co. Please do not reply to this email.
                </p>
            </div>
        `
    };
    // send email async on background
    return transporter.sendMail(mailOptions);
}

module.exports = welcomeEmail