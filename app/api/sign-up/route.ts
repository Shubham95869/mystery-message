
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { username, email, password } = await request.json();

    // Normalize email to avoid case-related duplicates
    const normalizedEmail = email.trim().toLowerCase();

    // Check whether username is already taken
    const existingUserByUsername = await UserModel.findOne({
      username: username.trim(),
      isVerified: true,
    });

    if (existingUserByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    // Reject ALL existing emails, verified or unverified
    const existingUserByEmail = await UserModel.findOne({
      email: normalizedEmail,
    });

    if (existingUserByEmail) {
      return Response.json(
        {
          success: false,
          message: "An account with this email already exists. Please sign in instead.",
        },
        { status: 400 }
      );
    }

    // Create a new user
    const verifyCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const hashedPassword = await bcrypt.hash(password, 10);

    const expiryDate = new Date(Date.now() + 60 * 60 * 1000);

    const newUser = new UserModel({
      username: username.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      verifyCode,
      verifyCodeExpiry: expiryDate,
      isVerified: false,
      isAcceptingMessage: true,
      messages: [],
    });

    await newUser.save();

    // Send verification email
    const emailResponse = await sendVerificationEmail(
      normalizedEmail,
      username.trim(),
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);

    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      { status: 500 }
    );
  }
}
