import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import {
  createCommunityPost,
  getCommunityFeed,
  getCommunityPostById,
  updateCommunityPost,
  deleteCommunityPost,
  addPostComment,
  getPostComments,
  updatePostComment,
  deletePostComment,
  togglePostReaction,
  togglePostBookmark,
  createContentReport,
} from "@/lib/services/community";
import { createPostSchema } from "@/lib/validations/community";

describe("Stage 9: Community Feed, Discussions & Moderation Test Suite", () => {
  let authorUser: any;
  let peerUser: any;
  let suspendedUser: any;
  let adminUser: any;
  let testPost: any;
  let questionPost: any;
  let advicePost: any;

  beforeAll(async () => {
    const ts = Date.now();

    // 1. Author member
    authorUser = await prisma.user.create({
      data: {
        name: `Author Member ${ts}`,
        email: `author_${ts}@university.edu`,
        membershipType: "STUDENT",
        verificationStatus: "VERIFIED",
        emailVerified: true,
        accountStatus: "ACTIVE",
        profile: {
          create: {
            headline: "CS Senior & Tech Enthusiast",
            department: "Computer Science & Engineering",
          },
        },
      },
    });

    // 2. Peer member
    peerUser = await prisma.user.create({
      data: {
        name: `Peer Member ${ts}`,
        email: `peer_${ts}@university.edu`,
        membershipType: "ALUMNI",
        verificationStatus: "VERIFIED",
        emailVerified: true,
        accountStatus: "ACTIVE",
        profile: {
          create: {
            headline: "Software Engineer at Google Cloud",
            department: "Computer Science & Engineering",
          },
        },
      },
    });

    // 3. Suspended user
    suspendedUser = await prisma.user.create({
      data: {
        name: `Suspended Member ${ts}`,
        email: `suspended_${ts}@university.edu`,
        membershipType: "STUDENT",
        verificationStatus: "VERIFIED",
        emailVerified: true,
        accountStatus: "SUSPENDED",
      },
    });

    // 4. Admin user
    adminUser = await prisma.user.create({
      data: {
        name: `Community Admin ${ts}`,
        email: `admin_${ts}@university.edu`,
        membershipType: "ADMIN",
        systemRole: "ADMIN",
        verificationStatus: "VERIFIED",
        emailVerified: true,
        accountStatus: "ACTIVE",
      },
    });
  });

  afterAll(async () => {
    // Clean up created entities
    const userIds = [authorUser?.id, peerUser?.id, suspendedUser?.id, adminUser?.id].filter(Boolean);
    if (userIds.length > 0) {
      await prisma.contentReport.deleteMany({
        where: { reporterId: { in: userIds } },
      });
      await prisma.postReaction.deleteMany({
        where: { userId: { in: userIds } },
      });
      await prisma.postBookmark.deleteMany({
        where: { userId: { in: userIds } },
      });
      await prisma.comment.deleteMany({
        where: { authorId: { in: userIds } },
      });
      await prisma.post.deleteMany({
        where: { authorId: { in: userIds } },
      });
      await prisma.profile.deleteMany({
        where: { userId: { in: userIds } },
      });
      await prisma.user.deleteMany({
        where: { id: { in: userIds } },
      });
    }
  });

  // ==========================================
  // TASK 1 & 3: Post Creation & Validation
  // ==========================================
  describe("Task 1 & 3: Community Post Creation & Validation", () => {
    it("1. creates a community post with valid content and type", async () => {
      testPost = await createCommunityPost(authorUser.id, {
        title: "Distributed Systems Study Group",
        content: "We are forming a campus study group for Raft and Paxos consensus algorithms. Meeting every Thursday!",
        postType: "GENERAL_DISCUSSION",
        tags: ["DistributedSystems", "StudyGroup"],
        visibility: "PUBLIC",
      });

      expect(testPost).toBeDefined();
      expect(testPost.id).toBeDefined();
      expect(testPost.title).toBe("Distributed Systems Study Group");
      expect(testPost.postType).toBe("GENERAL_DISCUSSION");
      expect(testPost.author.name).toBe(authorUser.name);
      expect(testPost.tags).toContain("DistributedSystems");
      expect(testPost.isAuthor).toBe(true);
    });

    it("2. rejects post creation with content shorter than 10 characters", () => {
      const result = createPostSchema.safeParse({
        content: "Too short",
        postType: "GENERAL_DISCUSSION",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("at least 10 characters");
      }
    });

    it("3. blocks suspended users from creating community posts", async () => {
      await expect(
        createCommunityPost(suspendedUser.id, {
          title: "Spammy Post",
          content: "This account has been suspended and should not be allowed to post.",
          postType: "GENERAL_DISCUSSION",
          visibility: "PUBLIC",
        })
      ).rejects.toThrow("account is suspended");
    });
  });

  // ==========================================
  // TASK 6: Post Editing & Deletion
  // ==========================================
  describe("Task 6: Post Editing, Updates & Deletion", () => {
    it("4. allows post author to edit their own post", async () => {
      const updated = await updateCommunityPost(authorUser.id, testPost.id, {
        title: "Distributed Systems Study Group (Updated)",
        content: "Meeting time updated: every Wednesday at 5 PM in CSE Lab 4.",
      });

      expect(updated.title).toBe("Distributed Systems Study Group (Updated)");
      expect(updated.content).toContain("every Wednesday");
    });

    it("5. prevents unauthorized member from editing another user's post", async () => {
      await expect(
        updateCommunityPost(peerUser.id, testPost.id, {
          title: "Malicious Edit",
          content: "Trying to overwrite someone else's announcement.",
        })
      ).rejects.toThrow("not authorized to edit this post");
    });

    it("6. allows platform admin to edit any post for moderation", async () => {
      const adminEdited = await updateCommunityPost(adminUser.id, testPost.id, {
        title: "Distributed Systems Study Group (Moderated)",
      });

      expect(adminEdited.title).toBe("Distributed Systems Study Group (Moderated)");
    });
  });

  // ==========================================
  // TASK 4: Comments and Nested Replies
  // ==========================================
  describe("Task 4: Comments and Threaded Replies", () => {
    let parentComment: any;
    let replyComment: any;

    it("7. adds a top-level comment to a post and increments comments count", async () => {
      parentComment = await addPostComment(peerUser.id, testPost.id, {
        content: "Count me in! I worked on Raft consensus during my internship.",
      });

      expect(parentComment).toBeDefined();
      expect(parentComment.id).toBeDefined();
      expect(parentComment.postId).toBe(testPost.id);
      expect(parentComment.author.name).toBe(peerUser.name);
      expect(parentComment.parentId).toBeNull();

      // Check comments count on post
      const post = await prisma.post.findUnique({
        where: { id: testPost.id },
        select: { commentsCount: true },
      });
      expect(post?.commentsCount).toBe(1);
    });

    it("8. adds a nested reply to an existing comment using parentId", async () => {
      replyComment = await addPostComment(authorUser.id, testPost.id, {
        content: "Awesome, thanks Tanvir! Would love to have you lead the demo.",
        parentId: parentComment.id,
      });

      expect(replyComment).toBeDefined();
      expect(replyComment.parentId).toBe(parentComment.id);

      // Verify hierarchical comments retrieval
      const thread = await getPostComments(testPost.id, authorUser.id);
      expect(thread.length).toBe(1); // 1 top-level comment
      expect(thread[0].replies.length).toBe(1); // 1 nested reply
      expect(thread[0].replies[0].id).toBe(replyComment.id);
    });

    it("9. allows comment author to edit their own comment", async () => {
      const updated = await updatePostComment(peerUser.id, parentComment.id, {
        content: "Count me in! I will bring slides from my Stripe backend team.",
      });

      expect(updated.content).toContain("bring slides");
    });

    it("10. prevents unauthorized users from editing other comments", async () => {
      await expect(
        updatePostComment(authorUser.id, parentComment.id, {
          content: "Trying to edit peer's comment",
        })
      ).rejects.toThrow("not authorized to edit this comment");
    });

    it("11. allows comment deletion and decrements post comments count", async () => {
      await deletePostComment(authorUser.id, replyComment.id);

      const thread = await getPostComments(testPost.id, authorUser.id);
      expect(thread[0].replies.length).toBe(0);

      const post = await prisma.post.findUnique({
        where: { id: testPost.id },
        select: { commentsCount: true },
      });
      expect(post?.commentsCount).toBe(1);
    });
  });

  // ==========================================
  // TASK 5: Reactions & Duplicate Prevention
  // ==========================================
  describe("Task 5: Reactions & Duplicate Prevention", () => {
    it("12. adds a reaction (LIKE) to a post and increments count", async () => {
      const result = await togglePostReaction(peerUser.id, testPost.id, "LIKE");

      expect(result.reacted).toBe(true);
      expect(result.currentReaction).toBe("LIKE");
      expect(result.reactions.LIKE).toBe(1);
      expect(result.totalLikes).toBe(1);
    });

    it("13. removes reaction when the same reaction is clicked again", async () => {
      const result = await togglePostReaction(peerUser.id, testPost.id, "LIKE");

      expect(result.reacted).toBe(false);
      expect(result.currentReaction).toBeNull();
      expect(result.reactions.LIKE).toBe(0);
      expect(result.totalLikes).toBe(0);
    });

    it("14. switches reaction type seamlessly (e.g., LIKE to INSIGHTFUL)", async () => {
      // First react with LIKE
      await togglePostReaction(peerUser.id, testPost.id, "LIKE");

      // Switch to INSIGHTFUL
      const result = await togglePostReaction(peerUser.id, testPost.id, "INSIGHTFUL");

      expect(result.reacted).toBe(true);
      expect(result.currentReaction).toBe("INSIGHTFUL");
      expect(result.reactions.LIKE).toBe(0);
      expect(result.reactions.INSIGHTFUL).toBe(1);
      expect(result.totalLikes).toBe(1);
    });
  });

  // ==========================================
  // TASK 6: Post Bookmarks & Saved Feed
  // ==========================================
  describe("Task 6: Post Bookmarking", () => {
    it("15. toggles bookmark on a post and enforces unique constraint", async () => {
      // Bookmark
      const b1 = await togglePostBookmark(peerUser.id, testPost.id);
      expect(b1.bookmarked).toBe(true);

      // Verify in database
      const saved = await prisma.postBookmark.findUnique({
        where: {
          postId_userId: {
            postId: testPost.id,
            userId: peerUser.id,
          },
        },
      });
      expect(saved).toBeDefined();

      // Unbookmark
      const b2 = await togglePostBookmark(peerUser.id, testPost.id);
      expect(b2.bookmarked).toBe(false);
    });
  });

  // ==========================================
  // TASK 7: Content Moderation & Reporting
  // ==========================================
  describe("Task 7: Content Moderation & Reporting", () => {
    it("16. submits a content report for an inappropriate post", async () => {
      const report = await createContentReport(peerUser.id, {
        targetType: "POST",
        postId: testPost.id,
        reason: "SPAM",
        description: "Checking reporting mechanism",
      });

      expect(report).toBeDefined();
      expect(report.id).toBeDefined();
      expect(report.targetType).toBe("POST");
      expect(report.postId).toBe(testPost.id);
      expect(report.status).toBe("PENDING");
    });

    it("17. prevents duplicate pending reports from the same user on the same post", async () => {
      await expect(
        createContentReport(peerUser.id, {
          targetType: "POST",
          postId: testPost.id,
          reason: "SPAM",
          description: "Submitting second report",
        })
      ).rejects.toThrow("already submitted a pending report");
    });

    it("18. submits a content report for an inappropriate comment", async () => {
      // Find the parent comment created in earlier test
      const comments = await prisma.comment.findMany({
        where: { postId: testPost.id },
      });
      expect(comments.length).toBeGreaterThan(0);

      const report = await createContentReport(authorUser.id, {
        targetType: "COMMENT",
        commentId: comments[0].id,
        reason: "INAPPROPRIATE",
      });

      expect(report).toBeDefined();
      expect(report.targetType).toBe("COMMENT");
      expect(report.commentId).toBe(comments[0].id);
    });
  });

  // ==========================================
  // TASK 2 & 8: Feed Queries, Filtering & Pagination
  // ==========================================
  describe("Task 2 & 8: Feed Filtering & Pagination Performance", () => {
    beforeAll(async () => {
      questionPost = await createCommunityPost(peerUser.id, {
        title: "How to prepare for System Design interviews as a junior?",
        content: "What are the best resources for low-level design vs high-level architecture?",
        postType: "GENERAL_DISCUSSION",
        tags: ["SystemDesign", "Interviews"],
        visibility: "PUBLIC",
      });

      advicePost = await createCommunityPost(authorUser.id, {
        title: "My experience passing the Jane Street Quant Software assessment",
        content: "Here is a breakdown of the algorithms, complexity questions, and OCaml/C++ tips.",
        postType: "ACHIEVEMENT",
        tags: ["Quant", "CareerAdvice"],
        visibility: "PUBLIC",
      });
    });

    it("19. filters community feed by PostType (GENERAL_DISCUSSION)", async () => {
      const feed = await getCommunityFeed(authorUser.id, {
        postType: "GENERAL_DISCUSSION",
        page: 1,
        limit: 10,
      });

      expect(feed.items.length).toBeGreaterThanOrEqual(1);
      const allQuestions = feed.items.every((p) => p.postType === "GENERAL_DISCUSSION");
      expect(allQuestions).toBe(true);
    });

    it("20. filters community feed by keyword search and pagination", async () => {
      const feed = await getCommunityFeed(authorUser.id, {
        search: "System Design",
        page: 1,
        limit: 10,
      });

      expect(feed.items.length).toBeGreaterThanOrEqual(1);
      expect(feed.items.some((p) => p.id === questionPost.id)).toBe(true);
      expect(feed.pagination.page).toBe(1);
    });

    it("21. retrieves single post by ID with reactions and bookmarks context", async () => {
      const fetched = await getCommunityPostById(advicePost.id, authorUser.id);

      expect(fetched).toBeDefined();
      expect(fetched?.id).toBe(advicePost.id);
      expect(fetched?.title).toContain("Jane Street");
      expect(fetched?.isAuthor).toBe(true);
    });

    it("22. author successfully deletes their post and cascades", async () => {
      const res = await deleteCommunityPost(authorUser.id, advicePost.id);
      expect(res.success).toBe(true);

      const check = await prisma.post.findUnique({
        where: { id: advicePost.id },
      });
      expect(check).toBeNull();
    });
  });
});
