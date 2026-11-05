import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getUserConnections,
  getPendingIncomingConnections,
  getPendingOutgoingConnections,
  sendConnectionRequest,
} from "@/lib/services/connection";
import { sendConnectionSchema } from "@/lib/validations/connection";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "ACCEPTED";
    const page = Number(searchParams.get("page") || 1);
    const pageSize = Number(searchParams.get("pageSize") || 20);

    if (type === "PENDING_INCOMING") {
      const incoming = await getPendingIncomingConnections(session.user.id);
      return NextResponse.json({
        success: true,
        items: incoming,
      });
    }

    if (type === "PENDING_OUTGOING") {
      const outgoing = await getPendingOutgoingConnections(session.user.id);
      return NextResponse.json({
        success: true,
        items: outgoing,
      });
    }

    const result = await getUserConnections(session.user.id, page, pageSize);
    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("Error retrieving connections:", error);
    return NextResponse.json(
      { success: false, error: { code: "CONNECTIONS_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = sendConnectionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid connection request payload.",
            details: parsed.error.format(),
          },
        },
        { status: 400 }
      );
    }

    const connection = await sendConnectionRequest(session.user.id, parsed.data.receiverId);

    return NextResponse.json(
      {
        success: true,
        data: connection,
        message: "Connection request sent successfully.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error sending connection request:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "CONNECTION_FAILED",
          message: error.message || "Failed to send connection request.",
        },
      },
      { status: 400 }
    );
  }
}
