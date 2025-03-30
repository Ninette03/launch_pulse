import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const evaluation = await prisma.evaluation.findUnique({
      where: {
        id: params.id,
        userId: session.user.id, // Ensure user can only access their own data
      },
    });

    if (!evaluation) {
      return NextResponse.json({ error: "Evaluation not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ evaluation }, { status: 200 });
  } catch (error) {
    console.error("Error fetching evaluation:", error);
    return NextResponse.json({ error: "Failed to fetch evaluation" }, { status: 500 });
  }
}
