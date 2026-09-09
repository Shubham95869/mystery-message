import { transporter } from "@/lib/mailer";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifycode: string
) {
    console.log("📧 sendVerificationEmail called");
    console.log("📧 Sending to:", email);
    console.log("📧 Gmail user:", process.env.GMAIL_USER);

    try {
        const info = await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: email,
            subject: "Mystery Message - Verification code",

            text: `Hi ${username},

Your Mystery Message verification code is:

${verifycode}

This code will expire soon.

If you did not create this account, you can ignore this email.
`,

            html: `
                <div>
                    <h2>Mystery Message</h2>
                    <p>Hi ${username},</p>
                    <p>Your verification code is:</p>
                    <h1>${verifycode}</h1>
                    <p>This code will expire soon.</p>
                </div>
            `,
        });

        console.log("✅ EMAIL SENT");
        console.log("Message ID:", info.messageId);
        console.log("Response:", info.response);

        return {
            success: true,
            message: "Successfully sent verification email",
        };

    } catch (emailError) {
        console.error("❌ ERROR SENDING EMAIL:", emailError);

        return {
            success: false,
            message: "Failed to send verification email",
        };
    }
}