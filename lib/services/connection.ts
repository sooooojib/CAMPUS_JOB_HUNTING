import { prisma } from "@/lib/prisma";
import { ConnectionStatus } from "@/types";

export type ConnectionState = "SELF" | "NONE" | "PENDING_SENT" | "PENDING_RECEIVED" | "CONNECTED";

/**
 * Retrieves the connection relationship state between the active user and target user.
 */
export async function getConnectionState(
  viewerId: string,
  targetUserId: string
): Promise<{ state: ConnectionState; connectionId?: string }> {
  if (viewerId === targetUserId) {
    return { state: "SELF" };
  }

  const connection = await prisma.connection.findFirst({
    where: {
      OR: [
        { senderId: viewerId, receiverId: targetUserId },
        { senderId: targetUserId, receiverId: viewerId },
      ],
    },
  });

  if (!connection) {
    return { state: "NONE" };
  }

  if (connection.status === "ACCEPTED") {
    return { state: "CONNECTED", connectionId: connection.id };
  }

  if (connection.status === "PENDING") {
    if (connection.senderId === viewerId) {
      return { state: "PENDING_SENT", connectionId: connection.id };
    } else {
      return { state: "PENDING_RECEIVED", connectionId: connection.id };
    }
  }

  // REJECTED allows a new request
  return { state: "NONE", connectionId: connection.id };
}

/**
 * Sends a connection request from one member to another.
 * Prevents self-connection, duplicates, and unauthenticated requests.
 */
export async function sendConnectionRequest(senderId: string, receiverId: string) {
  if (senderId === receiverId) {
    throw new Error("You cannot send a connection request to yourself.");
  }

  const receiver = await prisma.user.findUnique({
    where: { id: receiverId },
    select: { id: true, accountStatus: true, name: true },
  });

  if (!receiver) {
    throw new Error("Target member not found.");
  }

  if (receiver.accountStatus === "SUSPENDED" || receiver.accountStatus === "DEACTIVATED") {
    throw new Error("Cannot connect with an inactive or suspended account.");
  }

  // Check existing connection in either direction
  const existing = await prisma.connection.findFirst({
    where: {
      OR: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    },
  });

  if (existing) {
    if (existing.status === "ACCEPTED") {
      throw new Error("You are already connected with this member.");
    }
    if (existing.status === "PENDING") {
      if (existing.senderId === senderId) {
        throw new Error("Connection request is already pending.");
      } else {
        throw new Error(
          "This member has already sent you a connection request. Please check your incoming requests to accept."
        );
      }
    }
    // If previously rejected, reuse/update record to pending from new sender
    const updated = await prisma.connection.update({
      where: { id: existing.id },
      data: {
        senderId,
        receiverId,
        status: "PENDING",
        updatedAt: new Date(),
      },
    });
    return updated;
  }

  const connection = await prisma.connection.create({
    data: {
      senderId,
      receiverId,
      status: "PENDING",
    },
  });

  return connection;
}

/**
 * Responds to an incoming connection request (ACCEPT or REJECT).
 * Enforces that only the designated recipient can respond.
 */
export async function respondToConnectionRequest(
  userId: string,
  connectionId: string,
  action: "ACCEPT" | "REJECT"
) {
  const connection = await prisma.connection.findUnique({
    where: { id: connectionId },
  });

  if (!connection) {
    throw new Error("Connection request not found.");
  }

  if (connection.receiverId !== userId) {
    throw new Error("You are not authorized to respond to this connection request.");
  }

  if (connection.status !== "PENDING") {
    throw new Error(`This request has already been ${connection.status.toLowerCase()}.`);
  }

  const newStatus: ConnectionStatus = action === "ACCEPT" ? "ACCEPTED" : "REJECTED";

  const updated = await prisma.connection.update({
    where: { id: connectionId },
    data: {
      status: newStatus,
    },
    include: {
      sender: {
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

  return updated;
}

/**
 * Cancels an outgoing pending connection request.
 * Enforces that only the original sender can cancel.
 */
export async function cancelConnectionRequest(userId: string, connectionId: string) {
  const connection = await prisma.connection.findUnique({
    where: { id: connectionId },
  });

  if (!connection) {
    throw new Error("Connection request not found.");
  }

  if (connection.senderId !== userId) {
    throw new Error("You are not authorized to cancel this connection request.");
  }

  if (connection.status !== "PENDING") {
    throw new Error("Only pending connection requests can be cancelled.");
  }

  await prisma.connection.delete({
    where: { id: connectionId },
  });

  return { success: true };
}

/**
 * Removes an existing accepted connection between two members.
 * Either party may dissolve the connection.
 */
export async function removeConnection(userId: string, connectionId: string) {
  const connection = await prisma.connection.findUnique({
    where: { id: connectionId },
  });

  if (!connection) {
    throw new Error("Connection not found.");
  }

  if (connection.senderId !== userId && connection.receiverId !== userId) {
    throw new Error("You are not part of this connection.");
  }

  await prisma.connection.delete({
    where: { id: connectionId },
  });

  return { success: true };
}

/**
 * Retrieves all accepted connections for a member.
 */
export async function getUserConnections(userId: string, page = 1, pageSize = 20) {
  const skip = (page - 1) * pageSize;

  const [totalCount, records] = await Promise.all([
    prisma.connection.count({
      where: {
        status: "ACCEPTED",
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
    }),
    prisma.connection.findMany({
      where: {
        status: "ACCEPTED",
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
            membershipType: true,
            verificationStatus: true,
            profile: {
              select: {
                headline: true,
                department: true,
                company: true,
                designation: true,
                skills: true,
              },
            },
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            image: true,
            membershipType: true,
            verificationStatus: true,
            profile: {
              select: {
                headline: true,
                department: true,
                company: true,
                designation: true,
                skills: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      skip,
      take: pageSize,
    }),
  ]);

  const items = records.map((c) => {
    const isSender = c.senderId === userId;
    const peer = isSender ? c.receiver : c.sender;
    return {
      connectionId: c.id,
      connectedAt: c.updatedAt,
      member: peer,
    };
  });

  return {
    items,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      hasNextPage: skip + pageSize < totalCount,
      hasPreviousPage: page > 1,
    },
  };
}

/**
 * Retrieves pending incoming connection requests for a user.
 */
export async function getPendingIncomingConnections(userId: string) {
  return prisma.connection.findMany({
    where: {
      receiverId: userId,
      status: "PENDING",
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          image: true,
          membershipType: true,
          verificationStatus: true,
          profile: {
            select: {
              headline: true,
              department: true,
              company: true,
              designation: true,
              skills: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Retrieves pending outgoing connection requests sent by a user.
 */
export async function getPendingOutgoingConnections(userId: string) {
  return prisma.connection.findMany({
    where: {
      senderId: userId,
      status: "PENDING",
    },
    include: {
      receiver: {
        select: {
          id: true,
          name: true,
          image: true,
          membershipType: true,
          verificationStatus: true,
          profile: {
            select: {
              headline: true,
              department: true,
              company: true,
              designation: true,
              skills: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
