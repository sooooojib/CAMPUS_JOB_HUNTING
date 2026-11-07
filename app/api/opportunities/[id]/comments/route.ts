import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const comments = await prisma.opportunityComment.findMany({
      where: { opportunityId: id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            membershipType: true,
            verificationStatus: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ comments });
  } catch (err: any) {
    console.error("Error retrieving opportunity comments:", err);
    return NextResponse.json(
      { error: "Failed to retrieve opportunity comments" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const content = (body.content || "").trim();

    if (!content) {
      return NextResponse.json({ error: "Comment content cannot be empty" }, { status: 400 });
    }

    // Verify opportunity exists
    const opp = await prisma.opportunity.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!opp) {
      return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
    }

    const newComment = await prisma.opportunityComment.create({
      data: {
        opportunityId: id,
        authorId: session.user.id,
        content,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            membershipType: true,
            verificationStatus: true,
          },
        },
      },
    });

    return NextResponse.json({ comment: newComment }, { status: 201 });
  } catch (err: any) {
    console.error("Error posting opportunity comment:", err);
    return NextResponse.json(
      { error: err.message || "Failed to post comment" },
      { status: 500 }
    );
  }
}
