import transporter from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifycode: string
): Promise<ApiResponse> {
  try {
    const mailOptions = {
      from: `"Mystery Message" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Mystery Message | Verification Code",
      html: `
        <div style="font-family: 'Segoe UI', Roboto, Verdana, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 12px;">
          <h2 style="color: #111827; margin-bottom: 8px;">Hello ${username},</h2>
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">
            Thank you for registering. Please use the following verification code to complete your registration:
          </p>
          <div style="text-align: center; margin: 24px 0;">
            <span style="display: inline-block; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #4f46e5; background: #eef2ff; padding: 12px 24px; border-radius: 8px;">
              ${verifycode}
            </span>
          </div>
          <p style="color: #6b7280; font-size: 13px;">
            If you did not request this code, please ignore this email.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: "Successfully sent verification email" };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
