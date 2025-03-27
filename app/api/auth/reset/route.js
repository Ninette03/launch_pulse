// app/api/auth/reset/route.js
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // 1. Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // 2. Always return same message for security
    const successResponse = {
      message: "If an account exists with this email, a reset link will be sent"
    };

    if (!user) {
      return NextResponse.json(successResponse, { status: 200 });
    }

    // 3. Generate secure token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // 4. Update user in database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: hashedToken,
        resetTokenExpires
      }
    });

    // 5. Send email (implementation depends on your email service)
    // await sendResetEmail(user.email, resetToken);

    return NextResponse.json(successResponse, { status: 200 });

  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: "An error occurred processing your request" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}