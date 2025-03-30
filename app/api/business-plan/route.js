import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();


export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    // Fetch the latest business plan for the authenticated user
    const plan = await prisma.businessPlan.findFirst({
      where: { userId: session.user.id },
      orderBy: { created_at: "desc" },
    });

    if (!plan) {
      return NextResponse.json({ error: "No business plan found" }, { status: 404 });
    }

    return NextResponse.json({ plan });
  } catch (error) {
    console.error("Failed to fetch business plan:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}