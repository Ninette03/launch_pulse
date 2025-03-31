import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    // Fetch lessons and join with user progress
    const lessons = await prisma.lesson.findMany({
      orderBy: { order_number: "asc" },
      include: {
        userProgress: {
          where: { userId: session.user.id },
          select: {
            completed: true,
            last_accessed: true,
          },
        },
      },
    });

    // Format response
    const formattedLessons = lessons.map((lesson) => ({
      ...lesson,
      completed: lesson.userProgress.length > 0 ? lesson.userProgress[0].completed : false,
      last_accessed: lesson.userProgress.length > 0 ? lesson.userProgress[0].last_accessed : null,
    }));

    return NextResponse.json({ lessons: formattedLessons });
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return NextResponse.json({ error: "Failed to fetch lessons" }, { status: 500 });
  }
}
