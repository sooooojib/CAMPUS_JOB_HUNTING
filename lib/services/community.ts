import { prisma } from "@/lib/prisma";
import {
  CreatePostInput,
  UpdatePostInput,
  CreateCommentInput,
  UpdateCommentInput,
  CommunityFilterInput,
  CreateReportInput,
} from "@/lib/validations/community";
import { PostType, ReactionType } from "@/types";
import { createNotification } from "./notification";

export interface FeedPostResult {
  id: string;
  title: string | null;
  content: string;
  postType: PostType;
  visibility: string;
  isPinned: boolean;
  tags: string[];
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    image: string | null;
    membershipType: string;
    verificationStatus: string;
    department?: string | null;
    headline?: string | null;
  };
  attachedOpportunity?: {
    id: string;
    title: string;
    companyName: string;
    companyLogo: string | null;
    type: string;
    workplaceType: string;
  } | null;
  reactions: {
    LIKE: number;
    INSIGHTFUL: number;
    SUPPORT: number;
    CELEBRATE: number;
  };
  userReaction: ReactionType | null;
  isBookmarked: boolean;
  isAuthor: boolean;
}

/**
 * Asserts the user is active and can participate in the community feed.
 */
export async function assertCanParticipateInCommunity(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, accountStatus: true, verificationStatus: true, systemRole: true },
  });

  if (!user) {
    const error = new Error("User account not found");
    (error as unknown as { code: string }).code = "UNAUTHORIZED";
    throw error;
  }

  if (user.accountStatus === "SUSPENDED" || user.accountStatus === "DEACTIVATED") {
    const error = new Error("Your account is suspended from community participation");
    (error as unknown as { code: string }).code = "FORBIDDEN_ACCOUNT_SUSPENDED";
    throw error;
  }

  return user;
}

/**
 * Creates a new community post.
 */
export async function createCommunityPost(
  authorId: string,
  input: CreatePostInput
): Promise<FeedPostResult> {
  await assertCanParticipateInCommunity(authorId);

  // If attachedOpportunityId provided, verify it exists and is not removed
  if (input.attachedOpportunityId) {
    const opp = await prisma.opportunity.findUnique({
      where: { id: input.attachedOpportunityId },
      select: { id: true, status: true },
    });
    if (!opp) {
      const error = new Error("Attached opportunity not found");
      (error as unknown as { code: string }).code = "OPPORTUNITY_NOT_FOUND";
      throw error;
    }
  }

  const post = await prisma.post.create({
    data: {
      authorId,
      title: input.title || null,
      content: input.content,
      postType: input.postType,
      visibility: input.visibility,
      attachedOpportunityId: input.attachedOpportunityId || null,
      status: "ACTIVE",
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          membershipType: true,
          verificationStatus: true,
          profile: {
            select: {
              department: true,
              headline: true,
            },
          },
        },
      },
      attachedOpportunity: {
        select: {
          id: true,
          title: true,
          companyName: true,
          companyLogo: true,
          type: true,
          workplaceType: true,
        },
      },
    },
  });

  return {
    id: post.id,
    title: post.title,
    content: post.content,
    postType: post.postType as PostType,
    visibility: post.visibility,
    isPinned: post.isPinned,
    tags: [],
    viewsCount: post.viewsCount,
    likesCount: 0,
    commentsCount: 0,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    author: {
      id: post.author.id,
      name: post.author.name,
      image: post.author.image,
      membershipType: post.author.membershipType,
      verificationStatus: post.author.verificationStatus,
      department: post.author.profile?.department,
      headline: post.author.profile?.headline,
    },
    attachedOpportunity: post.attachedOpportunity
      ? {
          id: post.attachedOpportunity.id,
          title: post.attachedOpportunity.title,
          companyName: post.attachedOpportunity.companyName,
          companyLogo: post.attachedOpportunity.companyLogo,
          type: post.attachedOpportunity.type,
          workplaceType: post.attachedOpportunity.workplaceType,
        }
      : null,
    reactions: { LIKE: 0, INSIGHTFUL: 0, SUPPORT: 0, CELEBRATE: 0 },
    userReaction: null,
    isBookmarked: false,
    isAuthor: true,
  };
}

export interface CommunityFilterParams {
  postType?: string;
  search?: string;
  tag?: string;
  authorId?: string;
  bookmarkedOnly?: boolean;
  page?: number;
  limit?: number;
}

/**
 * Retrieves the community feed with filters, pagination, and viewer reaction context.
 */
export async function getCommunityFeed(
  viewerId: string,
  filters: CommunityFilterParams = {}
): Promise<{
  items: FeedPostResult[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}> {
  const page = filters.page || 1;
  const pageSize = filters.limit || 10;
  const skip = (page - 1) * pageSize;

  // Build where clause
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    status: { not: "REMOVED" },
  };

  if (filters.postType && filters.postType !== "ALL") {
    where.postType = filters.postType;
  } else {
    // Exclude job announcements from the community feed because jobs/internships have their dedicated tab (/opportunities)
    where.postType = { not: "JOB_ANNOUNCEMENT" };
  }

  if (filters.authorId) {
    where.authorId = filters.authorId;
  }

  if (filters.search) {
    const term = filters.search.trim();
    where.OR = [
      { title: { contains: term, mode: "insensitive" } },
      { content: { contains: term, mode: "insensitive" } },
    ];
  }

  if (filters.bookmarkedOnly) {
    where.bookmarks = { some: { userId: viewerId } };
  }

  const [totalCount, posts] = await Promise.all([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: [
        { isPinned: "desc" },
        { createdAt: "desc" },
      ],
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            membershipType: true,
            verificationStatus: true,
            profile: {
              select: {
                department: true,
                headline: true,
              },
            },
          },
        },
        attachedOpportunity: {
          select: {
            id: true,
            title: true,
            companyName: true,
            companyLogo: true,
            type: true,
            workplaceType: true,
          },
        },
        reactions: {
          select: {
            type: true,
            userId: true,
          },
        },
        bookmarks: {
          where: { userId: viewerId },
          select: { id: true },
        },
        _count: {
          select: {
            comments: {
              where: { status: { not: "REMOVED" } },
            },
          },
        },
      },
    }),
  ]);

  const items: FeedPostResult[] = posts.map((post) => {
    const reactionCounts = { LIKE: 0, INSIGHTFUL: 0, SUPPORT: 0, CELEBRATE: 0 };
    let userReaction: ReactionType | null = null;

    for (const r of post.reactions) {
      const type = r.type as ReactionType;
      if (reactionCounts[type] !== undefined) {
        reactionCounts[type]++;
      }
      if (r.userId === viewerId) {
        userReaction = type;
      }
    }

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      postType: post.postType as PostType,
      visibility: post.visibility,
      isPinned: post.isPinned,
      tags: [],
      viewsCount: post.viewsCount,
      likesCount: post.reactions.length,
      commentsCount: post._count.comments,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      author: {
        id: post.author.id,
        name: post.author.name,
        image: post.author.image,
        membershipType: post.author.membershipType,
        verificationStatus: post.author.verificationStatus,
        department: post.author.profile?.department,
        headline: post.author.profile?.headline,
      },
      attachedOpportunity: post.attachedOpportunity
        ? {
            id: post.attachedOpportunity.id,
            title: post.attachedOpportunity.title,
            companyName: post.attachedOpportunity.companyName,
            companyLogo: post.attachedOpportunity.companyLogo,
            type: post.attachedOpportunity.type,
            workplaceType: post.attachedOpportunity.workplaceType,
          }
        : null,
      reactions: reactionCounts,
      userReaction,
      isBookmarked: post.bookmarks.length > 0,
      isAuthor: post.authorId === viewerId,
    };
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    items,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

/**
 * Retrieves a single community post by ID.
 */
export async function getCommunityPostById(
  postId: string,
  viewerId: string
): Promise<FeedPostResult | null> {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          membershipType: true,
          verificationStatus: true,
          profile: {
            select: {
              department: true,
              headline: true,
            },
          },
        },
      },
      attachedOpportunity: {
        select: {
          id: true,
          title: true,
          companyName: true,
          companyLogo: true,
          type: true,
          workplaceType: true,
        },
      },
      reactions: {
        select: {
          type: true,
          userId: true,
        },
      },
      bookmarks: {
        where: { userId: viewerId },
        select: { id: true },
      },
      _count: {
        select: {
          comments: {
            where: { status: { not: "REMOVED" } },
          },
        },
      },
    },
  });

  if (!post || post.status === "REMOVED") {
    return null;
  }

  const reactionCounts = { LIKE: 0, INSIGHTFUL: 0, SUPPORT: 0, CELEBRATE: 0 };
  let userReaction: ReactionType | null = null;

  for (const r of post.reactions) {
    const type = r.type as ReactionType;
    if (reactionCounts[type] !== undefined) {
      reactionCounts[type]++;
    }
    if (r.userId === viewerId) {
      userReaction = type;
    }
  }

  return {
    id: post.id,
    title: post.title,
    content: post.content,
    postType: post.postType as PostType,
    visibility: post.visibility,
    isPinned: post.isPinned,
    tags: [],
    viewsCount: post.viewsCount,
    likesCount: post.reactions.length,
    commentsCount: post._count.comments,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    author: {
      id: post.author.id,
      name: post.author.name,
      image: post.author.image,
      membershipType: post.author.membershipType,
      verificationStatus: post.author.verificationStatus,
      department: post.author.profile?.department,
      headline: post.author.profile?.headline,
    },
    attachedOpportunity: post.attachedOpportunity
      ? {
          id: post.attachedOpportunity.id,
          title: post.attachedOpportunity.title,
          companyName: post.attachedOpportunity.companyName,
          companyLogo: post.attachedOpportunity.companyLogo,
          type: post.attachedOpportunity.type,
          workplaceType: post.attachedOpportunity.workplaceType,
        }
      : null,
    reactions: reactionCounts,
    userReaction,
    isBookmarked: post.bookmarks.length > 0,
    isAuthor: post.authorId === viewerId,
  };
}

/**
 * Updates an existing community post (Author or Admin only).
 */
export async function updateCommunityPost(
  userId: string,
  postId: string,
  input: UpdatePostInput
) {
  const user = await assertCanParticipateInCommunity(userId);
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true, authorId: true, status: true },
  });

  if (!post || post.status === "REMOVED") {
    const error = new Error("Post not found");
    (error as unknown as { code: string }).code = "POST_NOT_FOUND";
    throw error;
  }

  if (post.authorId !== userId && user.systemRole !== "ADMIN") {
    const error = new Error("You are not authorized to edit this post");
    (error as unknown as { code: string }).code = "FORBIDDEN";
    throw error;
  }

  const updated = await prisma.post.update({
    where: { id: postId },
    data: {
      title: input.title !== undefined ? input.title : undefined,
      content: input.content || undefined,
      postType: input.postType || undefined,
    },
  });

  return updated;
}

/**
 * Deletes a community post (Author or Admin only).
 */
export async function deleteCommunityPost(userId: string, postId: string) {
  const user = await assertCanParticipateInCommunity(userId);
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true, authorId: true },
  });

  if (!post) {
    const error = new Error("Post not found");
    (error as unknown as { code: string }).code = "POST_NOT_FOUND";
    throw error;
  }

  if (post.authorId !== userId && user.systemRole !== "ADMIN") {
    const error = new Error("You are not authorized to delete this post");
    (error as unknown as { code: string }).code = "FORBIDDEN";
    throw error;
  }

  // Delete cascading records
  await prisma.post.delete({
    where: { id: postId },
  });

  return { success: true };
}

/**
 * Adds a comment (or reply) to a community post.
 */
export async function addPostComment(
  authorId: string,
  postId: string,
  input: CreateCommentInput
) {
  await assertCanParticipateInCommunity(authorId);

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true, status: true, authorId: true },
  });

  if (!post || post.status === "REMOVED") {
    const error = new Error("Post not found");
    (error as unknown as { code: string }).code = "POST_NOT_FOUND";
    throw error;
  }

  let parentAuthorId: string | null = null;
  if (input.parentId) {
    const parentComment = await prisma.comment.findUnique({
      where: { id: input.parentId },
      select: { id: true, postId: true, status: true, authorId: true },
    });
    if (!parentComment || parentComment.postId !== postId || parentComment.status === "REMOVED") {
      const error = new Error("Parent comment not found on this post");
      (error as unknown as { code: string }).code = "PARENT_COMMENT_NOT_FOUND";
      throw error;
    }
    parentAuthorId = parentComment.authorId;
  }

  const [comment] = await prisma.$transaction([
    prisma.comment.create({
      data: {
        postId,
        authorId,
        parentId: input.parentId || null,
        content: input.content,
        status: "ACTIVE",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            membershipType: true,
            verificationStatus: true,
            profile: {
              select: {
                department: true,
                headline: true,
              },
            },
          },
        },
      },
    }),
    prisma.post.update({
      where: { id: postId },
      data: { commentsCount: { increment: 1 } },
    }),
  ]);

  // Dispatch comment / reply notification
  if (parentAuthorId && parentAuthorId !== authorId) {
    createNotification({
      recipientId: parentAuthorId,
      type: "COMMENT_REPLY",
      title: "New Reply to Your Comment",
      message: `${comment.author.name} replied to your comment on a community discussion.`,
      relatedEntityType: "COMMENT",
      relatedEntityId: comment.id,
      actionUrl: `/feed?post=${postId}`,
    }).catch(() => {});
  } else if (post.authorId && post.authorId !== authorId) {
    createNotification({
      recipientId: post.authorId,
      type: "POST_COMMENT",
      title: "New Comment on Your Post",
      message: `${comment.author.name} commented on your community post.`,
      relatedEntityType: "POST",
      relatedEntityId: post.id,
      actionUrl: `/feed?post=${postId}`,
    }).catch(() => {});
  }

  return {
    id: comment.id,
    postId: comment.postId,
    parentId: comment.parentId,
    content: comment.content,
    createdAt: comment.createdAt.toISOString(),
    updatedAt: comment.updatedAt.toISOString(),
    likesCount: comment.likesCount,
    author: {
      id: comment.author.id,
      name: comment.author.name,
      image: comment.author.image,
      membershipType: comment.author.membershipType,
      verificationStatus: comment.author.verificationStatus,
      department: comment.author.profile?.department,
      headline: comment.author.profile?.headline,
    },
    isAuthor: true,
    replies: [],
  };
}

/**
 * Retrieves comments and replies for a post.
 */
export async function getPostComments(postId: string, viewerId: string) {
  const comments = await prisma.comment.findMany({
    where: {
      postId,
      parentId: null,
      status: { not: "REMOVED" },
    },
    orderBy: { createdAt: "asc" },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          membershipType: true,
          verificationStatus: true,
          profile: {
            select: {
              department: true,
              headline: true,
            },
          },
        },
      },
      replies: {
        where: { status: { not: "REMOVED" } },
        orderBy: { createdAt: "asc" },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              membershipType: true,
              verificationStatus: true,
              profile: {
                select: {
                  department: true,
                  headline: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return comments.map((c) => ({
    id: c.id,
    postId: c.postId,
    parentId: c.parentId,
    content: c.content,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    likesCount: c.likesCount,
    author: {
      id: c.author.id,
      name: c.author.name,
      image: c.author.image,
      membershipType: c.author.membershipType,
      verificationStatus: c.author.verificationStatus,
      department: c.author.profile?.department,
      headline: c.author.profile?.headline,
    },
    isAuthor: c.authorId === viewerId,
    replies: c.replies.map((r) => ({
      id: r.id,
      postId: r.postId,
      parentId: r.parentId,
      content: r.content,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      likesCount: r.likesCount,
      author: {
        id: r.author.id,
        name: r.author.name,
        image: r.author.image,
        membershipType: r.author.membershipType,
        verificationStatus: r.author.verificationStatus,
        department: r.author.profile?.department,
        headline: r.author.profile?.headline,
      },
      isAuthor: r.authorId === viewerId,
    })),
  }));
}

/**
 * Updates a comment (Author only).
 */
export async function updatePostComment(
  userId: string,
  commentId: string,
  input: UpdateCommentInput
) {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { id: true, authorId: true, status: true },
  });

  if (!comment || comment.status === "REMOVED") {
    const error = new Error("Comment not found");
    (error as unknown as { code: string }).code = "COMMENT_NOT_FOUND";
    throw error;
  }

  if (comment.authorId !== userId) {
    const error = new Error("You are not authorized to edit this comment");
    (error as unknown as { code: string }).code = "FORBIDDEN";
    throw error;
  }

  const updated = await prisma.comment.update({
    where: { id: commentId },
    data: { content: input.content },
  });

  return updated;
}

/**
 * Deletes a comment (Author or Admin only).
 */
export async function deletePostComment(userId: string, commentId: string) {
  const user = await assertCanParticipateInCommunity(userId);
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { id: true, authorId: true, postId: true },
  });

  if (!comment) {
    const error = new Error("Comment not found");
    (error as unknown as { code: string }).code = "COMMENT_NOT_FOUND";
    throw error;
  }

  if (comment.authorId !== userId && user.systemRole !== "ADMIN") {
    const error = new Error("You are not authorized to delete this comment");
    (error as unknown as { code: string }).code = "FORBIDDEN";
    throw error;
  }

  await prisma.$transaction([
    prisma.comment.delete({
      where: { id: commentId },
    }),
    prisma.post.update({
      where: { id: comment.postId },
      data: { commentsCount: { decrement: 1 } },
    }),
  ]);

  return { success: true };
}

/**
 * Toggles a user's reaction on a post.
 * If user already clicked this reaction, it's removed.
 * If user switches to another reaction, the previous is removed and the new one is added.
 */
export async function togglePostReaction(
  userId: string,
  postId: string,
  reactionType: ReactionType
) {
  await assertCanParticipateInCommunity(userId);

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true, status: true },
  });

  if (!post || post.status === "REMOVED") {
    const error = new Error("Post not found");
    (error as unknown as { code: string }).code = "POST_NOT_FOUND";
    throw error;
  }

  // Check if user already has this specific reaction
  const existingReaction = await prisma.postReaction.findUnique({
    where: {
      postId_userId_type: {
        postId,
        userId,
        type: reactionType,
      },
    },
  });

  let currentReaction: ReactionType | null = null;
  let reacted = false;

  if (existingReaction) {
    // Remove it (toggle off)
    await prisma.postReaction.delete({
      where: { id: existingReaction.id },
    });
    currentReaction = null;
    reacted = false;
  } else {
    // Remove any previous reaction from this user on this post so each user has 1 active type
    await prisma.postReaction.deleteMany({
      where: { postId, userId },
    });

    // Create the new reaction
    await prisma.postReaction.create({
      data: {
        postId,
        userId,
        type: reactionType,
      },
    });

    currentReaction = reactionType;
    reacted = true;
  }

  // Recount all reactions for this post
  const allReactions = await prisma.postReaction.findMany({
    where: { postId },
    select: { type: true },
  });

  const reactionCounts = { LIKE: 0, INSIGHTFUL: 0, SUPPORT: 0, CELEBRATE: 0 };
  for (const r of allReactions) {
    const t = r.type as ReactionType;
    if (reactionCounts[t] !== undefined) {
      reactionCounts[t]++;
    }
  }

  // Update total likesCount on post
  await prisma.post.update({
    where: { id: postId },
    data: { likesCount: allReactions.length },
  });

  return {
    reacted,
    currentReaction,
    reactions: reactionCounts,
    totalLikes: allReactions.length,
  };
}

/**
 * Toggles a user's bookmark on a post.
 */
export async function togglePostBookmark(userId: string, postId: string) {
  await assertCanParticipateInCommunity(userId);

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true, status: true },
  });

  if (!post || post.status === "REMOVED") {
    const error = new Error("Post not found");
    (error as unknown as { code: string }).code = "POST_NOT_FOUND";
    throw error;
  }

  const existing = await prisma.postBookmark.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });

  if (existing) {
    await prisma.postBookmark.delete({
      where: { id: existing.id },
    });
    return { bookmarked: false };
  } else {
    await prisma.postBookmark.create({
      data: {
        postId,
        userId,
      },
    });
    return { bookmarked: true };
  }
}

/**
 * Creates a content report for a post or comment.
 */
export async function createContentReport(
  reporterId: string,
  input: CreateReportInput
) {
  await assertCanParticipateInCommunity(reporterId);

  if (input.targetType === "POST") {
    const post = await prisma.post.findUnique({
      where: { id: input.postId! },
      select: { id: true, status: true },
    });
    if (!post || post.status === "REMOVED") {
      const error = new Error("Reported post not found");
      (error as unknown as { code: string }).code = "POST_NOT_FOUND";
      throw error;
    }
  } else {
    const comment = await prisma.comment.findUnique({
      where: { id: input.commentId! },
      select: { id: true, status: true },
    });
    if (!comment || comment.status === "REMOVED") {
      const error = new Error("Reported comment not found");
      (error as unknown as { code: string }).code = "COMMENT_NOT_FOUND";
      throw error;
    }
  }

  // Prevent multiple pending reports from the same user for the same target
  const existingReport = await prisma.contentReport.findFirst({
    where: {
      reporterId,
      targetType: input.targetType,
      postId: input.postId || null,
      commentId: input.commentId || null,
      status: "PENDING",
    },
  });

  if (existingReport) {
    const error = new Error("You have already submitted a pending report for this content");
    (error as unknown as { code: string }).code = "DUPLICATE_REPORT";
    throw error;
  }

  const report = await prisma.contentReport.create({
    data: {
      reporterId,
      targetType: input.targetType,
      postId: input.postId || null,
      commentId: input.commentId || null,
      reason: input.reason,
      description: input.description || null,
      status: "PENDING",
    },
  });

  // Check if multiple reports have been lodged; flag if >= 3
  if (input.targetType === "POST" && input.postId) {
    const reportCount = await prisma.contentReport.count({
      where: { postId: input.postId, status: "PENDING" },
    });
    if (reportCount >= 3) {
      await prisma.post.update({
        where: { id: input.postId },
        data: { status: "FLAGGED" },
      });
    }
  } else if (input.targetType === "COMMENT" && input.commentId) {
    const reportCount = await prisma.contentReport.count({
      where: { commentId: input.commentId, status: "PENDING" },
    });
    if (reportCount >= 3) {
      await prisma.comment.update({
        where: { id: input.commentId },
        data: { status: "FLAGGED" },
      });
    }
  }

  return report;
}
