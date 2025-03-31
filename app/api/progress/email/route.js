import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const userId = session.user.id;

    // Fetch lesson
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Fetch user progress
    const progressData = await prisma.userProgress.aggregate({
      where: { userId },
      _count: {
        _all: true,
        completed: true,
      },
    });

    const totalLessons = await prisma.lesson.count();
    const completedLessons = progressData._count.completed || 0;
    const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

    // Find next lesson
    const nextLesson = await prisma.lesson.findFirst({
      where: {
        userProgress: {
          some: { userId, completed: false },
        },
      },
      orderBy: { order_number: "asc" },
    });

    // Send email notification
    await fetch(process.env.EMAIL_SERVICE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: session.user.email,
        subject: `Congratulations on completing ${lesson.title}!`,
        text: `Great job completing ${
          lesson.title
        }!\n\nYour current progress: ${progressPercentage}%\n\n${
          nextLesson ? `Ready for your next lesson? Check out: ${nextLesson.title}` : "You've completed all lessons!"
        }\n\nKeep up the great work!`,
      }),
    });

    // Log the reminder
    await prisma.reminderLogs.create({
      data: { userId, type: "progress_email" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending progress email:", error);
    return NextResponse.json({ error: "Failed to send progress notification" }, { status: 500 });
  }
}
