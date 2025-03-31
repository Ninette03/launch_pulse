import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function handler({ user }) {
  if (!user) {
    return { error: "Authentication required" };
  }

  try {
    // Fetch overall progress stats
    const totalLessons = await prisma.lesson.count();
    const completedLessons = await prisma.userProgress.count({
      where: {
        userId: user.id,
        completed: true,
      },
    });
    const inProgressLessons = await prisma.userProgress.count({
      where: {
        userId: user.id,
        completed: false,
        lastAccessed: { not: null },
      },
    });

    const stats = {
      total_lessons: totalLessons,
      completed_lessons: completedLessons,
      in_progress_lessons: inProgressLessons,
    };

    // Fetch category progress
    const categoryProgress = await prisma.lesson.groupBy({
      by: ["category"],
      _count: {
        id: true,
      },
      _sum: {
        completed: true,
      },
      where: {
        userProgress: {
          some: {
            userId: user.id,
          },
        },
      },
    });

    // Fetch recent activity
    const recentActivity = await prisma.userProgress.findMany({
      where: { userId: user.id },
      include: { lesson: true },
      orderBy: { lastAccessed: "desc" },
      take: 5,
    });

    return {
      stats,
      categoryProgress,
      recentActivity,
    };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch progress statistics" };
  }
}
