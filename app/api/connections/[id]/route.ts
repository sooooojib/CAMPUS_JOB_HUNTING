import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  respondToConnectionRequest,
  cancelConnectionRequest,
  removeConnection,
} from "@/lib/services/connection";
import { respondConnectionSchema } from "@/lib/validations/connection";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();
    const parsed = respondConnectionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid action. Must be ACCEPT or REJECT.",
            details: parsed.error.format(),
          },
        },
        { status: 400 }
      );
    }

    const updated = await respondToConnectionRequest(
      session.user.id,
      id,
      parsed.data.action
    );

    return NextResponse.json({
      success: true,
      data: updated,
      message: `Connection request ${parsed.data.action.toLowerCase()}ed successfully.`,
    });
  } catch (error: any) {
    console.error("Error updating connection request:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UPDATE_FAILED",
          message: error.message || "Failed to update connection request.",
        },
      },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action"); // "cancel" or "remove"

    if (action === "cancel") {
      await cancelConnectionRequest(session.user.id, id);
      return NextResponse.json({
        success: true,
        message: "Connection request cancelled successfully.",
      });
    }

    // Default or action === "remove"
    await removeConnection(session.user.id, id);
    return NextResponse.json({
      success: true,
      message: "Connection removed successfully.",
    });
  } catch (error: any) {
    console.error("Error deleting/cancelling connection:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "OPERATION_FAILED",
          message: error.message || "Failed to modify connection.",
        },
      },
      { status: 400 }
    );
  }
}

