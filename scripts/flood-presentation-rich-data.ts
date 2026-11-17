import { prisma } from "../lib/prisma";

async function main() {
  console.log("Starting database enrichment for defense presentation...\n");

  // 1. Get reference users
  const students = await prisma.user.findMany({
    where: { membershipType: "STUDENT" },
    take: 10,
  });
  const alumni = await prisma.user.findMany({
    where: { membershipType: "ALUMNI" },
    take: 10,
  });
  const allUsers = [...students, ...alumni];

  if (students.length === 0 || alumni.length === 0) {
    throw new Error("Cannot find enough students or alumni to link data.");
  }

  const companies = await prisma.company.findMany({ take: 10 });
  const opportunities = await prisma.opportunity.findMany({ take: 10 });
  const posts = await prisma.post.findMany({ take: 10 });

  console.log(`Found ${students.length} students, ${alumni.length} alumni, ${companies.length} companies, ${opportunities.length} opportunities, ${posts.length} posts.`);

  // =========================================================================
  // 1. ACADEMIC RECORDS (Standardize with "1.1", "1.2", "2.1", "2.2", etc.)
  // =========================================================================
  console.log("\n--- 1. Updating academic_records to official 1.1, 1.2 format ---");
  // Delete existing records to replace with pristine presentation transcripts
  await prisma.academicRecord.deleteMany({});

  const semesterPlan = [
    { semester: "1.1", academicYear: "1st Year", gpa: 3.85, credits: 19.5, notes: "Structured Programming (C), Discrete Mathematics, Physics" },
    { semester: "1.2", academicYear: "1st Year", gpa: 3.90, credits: 20.0, notes: "Object Oriented Programming (Java), Data Structures, Digital Logic" },
    { semester: "2.1", academicYear: "2nd Year", gpa: 3.82, credits: 18.5, notes: "Algorithms, Computer Architecture, Mathematics for CS" },
    { semester: "2.2", academicYear: "2nd Year", gpa: 3.88, credits: 19.0, notes: "Database Management Systems, Software Engineering, Theory of Computation" },
    { semester: "3.1", academicYear: "3rd Year", gpa: 3.92, credits: 18.0, notes: "Operating Systems, Computer Networks, Information Security" },
    { semester: "3.2", academicYear: "3rd Year", gpa: 3.86, credits: 19.5, notes: "Artificial Intelligence, Microprocessors & Assembly, Web Technologies" },
    { semester: "4.1", academicYear: "4th Year", gpa: 3.94, credits: 18.0, notes: "Distributed Systems, Machine Learning, Cloud Computing" },
    { semester: "4.2", academicYear: "4th Year", gpa: 3.96, credits: 12.0, notes: "Undergraduate Thesis / Capstone Defense (Dept. of CSE, JnU)" },
  ];

  let acaCount = 0;
  for (let i = 0; i < Math.min(4, students.length); i++) {
    const student = students[i];
    // Give 4 to 8 semesters
    const numSemesters = i === 0 ? 8 : i === 1 ? 6 : i === 2 ? 5 : 4;
    for (let s = 0; s < numSemesters; s++) {
      const plan = semesterPlan[s];
      // small variation in GPA
      const gpaOffset = ((i * 3 + s * 7) % 15 - 7) * 0.01;
      const finalGpa = Math.min(4.0, Math.max(3.5, Number((plan.gpa + gpaOffset).toFixed(2))));

      await prisma.academicRecord.create({
        data: {
          userId: student.id,
          semester: plan.semester,
          academicYear: plan.academicYear,
          gpa: finalGpa,
          credits: plan.credits,
          notes: plan.notes,
          isVerified: true,
        },
      });
      acaCount++;
    }
  }
  console.log(`Created ${acaCount} academic records formatted as 1.1, 1.2, etc.`);

  // =========================================================================
  // 2. MANUAL APPLICATIONS (Off-campus jobs tracker, target >= 6 rows)
  // =========================================================================
  console.log("\n--- 2. Populating manual_applications ---");
  await prisma.manualApplication.deleteMany({});
  const manualJobs = [
    { company: "Google", role: "Software Engineering Intern - Cloud", location: "Bangalore / Remote", status: "INTERVIEWING", notes: "Technical screen passed. System design round scheduled." },
    { company: "Therap BD", role: "Software Engineer (Java Track)", location: "Dhaka, Bangladesh", status: "APPLIED", notes: "Applied via Therap career portal. Waiting for written exam schedule." },
    { company: "Brain Station 23", role: "Junior Full-Stack Engineer", location: "Mohakhali, Dhaka", status: "OFFERED", notes: "Formal offer letter received! 45,000 BDT/month + health insurance." },
    { company: "TigerIT Bangladesh", role: "Associate Software Engineer", location: "Banani, Dhaka", status: "INTERVIEWING", notes: "Technical round 2 on Algorithms & Concurrency." },
    { company: "Samsung R&D Institute BD", role: "Software Engineer Trainee", location: "Dhaka", status: "APPLIED", notes: "Coding test cleared (Advanced level); waiting for panel interview." },
    { company: "Optimizely", role: "Graduate Software Engineer", location: "Gulshan, Dhaka", status: "INTERVIEWING", notes: "Behavioral interview and live coding assessment." },
    { company: "Chaldal Tech", role: "Software Development Engineer", location: "Jashore / Dhaka", status: "APPLIED", notes: "Applied directly on Chaldal Tech careers board." },
    { company: "bKash Limited", role: "Junior DevOps & SRE Engineer", location: "Dhaka", status: "OFFERED", notes: "Selected for Core Platform Infrastructure team." },
  ];

  for (let i = 0; i < manualJobs.length; i++) {
    const job = manualJobs[i];
    const student = students[i % students.length];
    await prisma.manualApplication.create({
      data: {
        userId: student.id,
        companyName: job.company,
        roleTitle: job.role,
        location: job.location,
        status: job.status,
        notes: job.notes,
        appliedDate: new Date(Date.now() - (i + 2) * 86400000 * 3),
      },
    });
  }
  console.log(`Created ${manualJobs.length} manual_applications.`);

  // =========================================================================
  // 3. OPPORTUNITY COMMENTS (Q&A under jobs, target >= 6 rows)
  // =========================================================================
  console.log("\n--- 3. Populating opportunity_comments ---");
  await prisma.opportunityComment.deleteMany({});
  const oppComments = [
    { content: "Is this opening eligible for 2026 graduating batch students from JnU CSE?", isStudent: true },
    { content: "Yes! Final-year undergraduate students with CGPA >= 3.50 are welcome to apply.", isStudent: false },
    { content: "Does this position support hybrid work during university semester final examination periods?", isStudent: true },
    { content: "Yes, flexible hybrid arrangements are supported during semester finals.", isStudent: false },
    { content: "What tech stack will the engineering team primarily focus on during the initial 6 months?", isStudent: true },
    { content: "The core stack is Next.js 15, TypeScript, PostgreSQL, Docker, and Apache Kafka for event pipelines.", isStudent: false },
    { content: "Is there an online coding assessment before the technical interview?", isStudent: true },
    { content: "Yes, an 80-minute online assessment covering Data Structures, Algorithms, and SQL queries.", isStudent: false },
  ];

  for (let i = 0; i < oppComments.length; i++) {
    const opp = opportunities[i % opportunities.length];
    const commentData = oppComments[i];
    const author = commentData.isStudent ? students[i % students.length] : alumni[i % alumni.length];
    await prisma.opportunityComment.create({
      data: {
        opportunityId: opp.id,
        authorId: author.id,
        content: commentData.content,
        createdAt: new Date(Date.now() - (8 - i) * 3600000 * 4),
      },
    });
  }
  console.log(`Created ${oppComments.length} opportunity_comments.`);

  // =========================================================================
  // 4. COMPANY MEMBERS (Legacy partner roles, target >= 6 rows)
  // =========================================================================
  console.log("\n--- 4. Populating company_members ---");
  await prisma.companyMember.deleteMany({});
  let compMemCount = 0;
  for (let i = 0; i < Math.min(6, companies.length, alumni.length); i++) {
    const comp = companies[i];
    const alum = alumni[i];
    await prisma.companyMember.create({
      data: {
        companyId: comp.id,
        userId: alum.id,
        role: i < 2 ? "ADMIN" : "MEMBER",
      },
    });
    compMemCount++;
  }
  console.log(`Created ${compMemCount} company_members.`);

  // =========================================================================
  // 5. NOTIFICATION PREFERENCES (Settings, target >= 6 rows)
  // =========================================================================
  console.log("\n--- 5. Populating notification_preferences ---");
  await prisma.notificationPreference.deleteMany({});
  let prefCount = 0;
  for (let i = 0; i < Math.min(10, allUsers.length); i++) {
    const user = allUsers[i];
    await prisma.notificationPreference.create({
      data: {
        userId: user.id,
        opportunitiesInApp: true,
        applicationsInApp: true,
        communityInApp: true,
        membershipInApp: true,
        remindersInApp: true,
        opportunitiesEmail: true,
        applicationsEmail: true,
        communityEmail: i % 2 === 0,
        membershipEmail: true,
        remindersEmail: true,
      },
    });
    prefCount++;
  }
  console.log(`Created ${prefCount} notification_preferences.`);

  // =========================================================================
  // 6. OPPORTUNITY BOOKMARKS (Saved jobs, target >= 6 rows)
  // =========================================================================
  console.log("\n--- 6. Populating opportunity_bookmarks ---");
  await prisma.opportunityBookmark.deleteMany({});
  let oppBkCount = 0;
  for (let i = 0; i < Math.min(8, opportunities.length); i++) {
    const opp = opportunities[i];
    const student = students[i % students.length];
    await prisma.opportunityBookmark.create({
      data: {
        userId: student.id,
        opportunityId: opp.id,
      },
    });
    oppBkCount++;
  }
  console.log(`Created ${oppBkCount} opportunity_bookmarks.`);

  // =========================================================================
  // 7. POST BOOKMARKS (Saved feed posts, target >= 6 rows)
  // =========================================================================
  console.log("\n--- 7. Populating post_bookmarks ---");
  await prisma.postBookmark.deleteMany({});
  let postBkCount = 0;
  for (let i = 0; i < Math.min(8, posts.length); i++) {
    const post = posts[i];
    const student = students[i % students.length];
    await prisma.postBookmark.create({
      data: {
        userId: student.id,
        postId: post.id,
      },
    });
    postBkCount++;
  }
  console.log(`Created ${postBkCount} post_bookmarks.`);

  // =========================================================================
  // 8. RESUMES (Legacy metadata, target >= 5 rows)
  // =========================================================================
  console.log("\n--- 8. Populating resumes ---");
  // Keep existing and top up to >= 5
  const existingResumes = await prisma.resume.count();
  const resumesToAdd = [
    { name: "Farhan_Ahmed_SWE_CV_2026.pdf", size: 245760, mime: "application/pdf", key: "resumes/farhan_swe_2026.pdf" },
    { name: "Nusrat_Jahan_Frontend_Resume.pdf", size: 184320, mime: "application/pdf", key: "resumes/nusrat_frontend_2026.pdf" },
    { name: "Tanvir_Hossain_FullStack_Resume.pdf", size: 312000, mime: "application/pdf", key: "resumes/tanvir_fullstack_2026.pdf" },
    { name: "Fariha_Yasmeen_DataEngineer_Resume.pdf", size: 220100, mime: "application/pdf", key: "resumes/fariha_data_2026.pdf" },
    { name: "Sajib_Hasan_Software_Engineer_CV.pdf", size: 285400, mime: "application/pdf", key: "resumes/sajib_swe_2026.pdf" },
  ];

  for (let i = 0; i < resumesToAdd.length; i++) {
    const r = resumesToAdd[i];
    const user = allUsers[i % allUsers.length];
    await prisma.resume.upsert({
      where: { storageKey: r.key },
      create: {
        userId: user.id,
        fileName: r.name,
        fileSize: r.size,
        mimeType: r.mime,
        storageKey: r.key,
        isDefault: true,
      },
      update: {},
    });
  }
  console.log("Resumes populated (>= 5 rows guaranteed).");

  // =========================================================================
  // 9. CONTENT REPORTS (Moderation queue, target >= 6 rows)
  // =========================================================================
  console.log("\n--- 9. Populating content_reports ---");
  const reportsToAdd = [
    { targetType: "POST" as const, reason: "SPAM" as const, desc: "Repeated promotional link for external unofficial WhatsApp group." },
    { targetType: "POST" as const, reason: "MISINFORMATION" as const, desc: "Outdated deadline and incorrect stipend figure for government scholarship opening." },
    { targetType: "COMMENT" as const, reason: "INAPPROPRIATE" as const, desc: "Off-topic aggressive argument under an alumni career advice post." },
    { targetType: "POST" as const, reason: "SPAM" as const, desc: "Duplicate copy-paste of a previous question already answered in the forum." },
    { targetType: "COMMENT" as const, reason: "OTHER" as const, desc: "Requesting personal phone numbers in public comments section." },
    { targetType: "POST" as const, reason: "INAPPROPRIATE" as const, desc: "Solicitation of academic assignment solutions." },
  ];

  for (let i = 0; i < reportsToAdd.length; i++) {
    const rep = reportsToAdd[i];
    const reporter = students[i % students.length];
    const post = posts[i % posts.length];
    await prisma.contentReport.create({
      data: {
        reporterId: reporter.id,
        targetType: rep.targetType,
        postId: rep.targetType === "POST" ? post.id : null,
        reason: rep.reason,
        description: rep.desc,
        status: i < 3 ? "PENDING" : "RESOLVED",
        reviewedById: i >= 3 ? alumni[0].id : null,
        reviewNotes: i >= 3 ? "Reviewed by moderation team. Handled per community guidelines." : null,
        reviewedAt: i >= 3 ? new Date() : null,
      },
    });
  }
  console.log(`Created ${reportsToAdd.length} content_reports.`);

  // =========================================================================
  // 10. DEADLINE REMINDER LOGS (Automated cron logs, target >= 6 rows)
  // =========================================================================
  console.log("\n--- 10. Populating deadline_reminder_logs ---");
  for (let i = 0; i < Math.min(6, opportunities.length); i++) {
    const opp = opportunities[i];
    const student = students[i % students.length];
    const remType = i % 2 === 0 ? "DEADLINE_24_HOURS" : "DEADLINE_3_DAYS";
    await prisma.deadlineReminderLog.upsert({
      where: {
        userId_opportunityId_reminderType_channel: {
          userId: student.id,
          opportunityId: opp.id,
          reminderType: remType,
          channel: "IN_APP",
        },
      },
      create: {
        userId: student.id,
        opportunityId: opp.id,
        reminderType: remType,
        channel: "IN_APP",
        sentAt: new Date(Date.now() - (i + 1) * 3600000 * 6),
      },
      update: {},
    });
  }
  console.log("Deadline reminder logs populated (>= 6 rows guaranteed).");

  console.log("\nAll target tables successfully enriched!");
}

main()
  .catch((e) => {
    console.error("Error seeding presentation data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
