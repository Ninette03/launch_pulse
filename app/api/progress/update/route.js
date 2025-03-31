import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const { lessonId, completed } = req.body;

  if (!lessonId) {
    return res.status(400).json({ error: "Lesson ID is required" });
  }

  try {
    await prisma.userProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId: lessonId,
        },
      },
      update: {
        completed: completed,
        lastAccessed: new Date(),
      },
      create: {
        userId: session.user.id,
        lessonId: lessonId,
        completed: completed,
        lastAccessed: new Date(),
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update progress" });
  }
}
