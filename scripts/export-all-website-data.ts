import { prisma } from "../lib/prisma";
import fs from "fs";
import path from "path";

async function exportAllData() {
  console.log("Exporting all website data from PostgreSQL (Neon) for Claude and documentation...\n");

  const tables = [
    { name: "users", model: "user", domain: "People and login", desc: "Core user accounts and authentication profiles" },
    { name: "profiles", model: "profile", domain: "People and login", desc: "Extended user portfolios, bios, and CGPAs" },
    { name: "departments", model: "department", domain: "People and login", desc: "Academic departments and faculties" },
    { name: "skills", model: "skill", domain: "People and login", desc: "Categorized skills taxonomy" },
    { name: "academic_records", model: "academicRecord", domain: "People and login", desc: "Semester-by-semester transcripts (1.1, 1.2...)" },
    { name: "membership_requests", model: "membershipRequest", domain: "People and login", desc: "Two-stage verification queue dossiers" },
    { name: "sessions", model: "session", domain: "People and login", desc: "Active browser device cookies and tokens" },
    { name: "accounts", model: "account", domain: "People and login", desc: "Better Auth credential stores and password hashes" },
    { name: "verifications", model: "verification", domain: "People and login", desc: "Ephemeral cryptographic email tokens" },
    { name: "opportunities", model: "opportunity", domain: "Jobs and applications", desc: "Job and internship listings" },
    { name: "companies", model: "company", domain: "Jobs and applications", desc: "Partner employer directory" },
    { name: "applications", model: "application", domain: "Jobs and applications", desc: "Student application tracker records" },
    { name: "application_status_history", model: "applicationStatusHistory", domain: "Jobs and applications", desc: "Status audit history timeline" },
    { name: "opportunity_bookmarks", model: "opportunityBookmark", domain: "Jobs and applications", desc: "Saved job opportunities" },
    { name: "opportunity_comments", model: "opportunityComment", domain: "Jobs and applications", desc: "Public questions and answers under jobs" },
    { name: "manual_applications", model: "manualApplication", domain: "Jobs and applications", desc: "Student tracker for external off-campus jobs" },
    { name: "company_members", model: "companyMember", domain: "Left over (Legacy)", desc: "Company member associations" },
    { name: "resumes", model: "resume", domain: "Left over (Legacy)", desc: "Student uploaded resume metadata" },
    { name: "posts", model: "post", domain: "Community and referrals", desc: "Community discussion feed posts" },
    { name: "comments", model: "comment", domain: "Community and referrals", desc: "Threaded comment replies" },
    { name: "post_reactions", model: "postReaction", domain: "Community and referrals", desc: "Atomic post likes and reactions" },
    { name: "post_bookmarks", model: "postBookmark", domain: "Community and referrals", desc: "Saved community posts" },
    { name: "content_reports", model: "contentReport", domain: "Community and referrals", desc: "Moderation reports against posts and comments" },
    { name: "connections", model: "connection", domain: "Community and referrals", desc: "Peer-to-peer student & alumni network connections" },
    { name: "referral_requests", model: "referralRequest", domain: "Community and referrals", desc: "Direct pitches to alumni for internal company referrals" },
    { name: "notifications", model: "notification", domain: "Alerts and calendar", desc: "In-app notification alerts" },
    { name: "notification_preferences", model: "notificationPreference", domain: "Alerts and calendar", desc: "User notification toggle preferences" },
    { name: "career_calendar_events", model: "careerCalendarEvent", domain: "Alerts and calendar", desc: "Application and job deadline events" },
    { name: "deadline_reminder_logs", model: "deadlineReminderLog", domain: "Alerts and calendar", desc: "Automated cron reminder dispatch logs" },
    { name: "admin_audit_logs", model: "adminAuditLog", domain: "Admin", desc: "Immutable administrative governance audit logs" },
  ];

  const fullData: Record<string, any> = {
    exportedAt: new Date().toISOString(),
    totalTables: tables.length,
    tables: {},
  };

  let totalRows = 0;
  const tableSummaries: Array<{ name: string; domain: string; desc: string; count: number }> = [];

  for (const t of tables) {
    try {
      const rows = await (prisma as any)[t.model].findMany();
      // Mask password hashes in accounts table for safety
      const sanitizedRows = rows.map((r: any) => {
        if (t.name === "accounts" && r.password) {
          return { ...r, password: "•••• [scrypt password hash masked]" };
        }
        return r;
      });

      fullData.tables[t.name] = {
        domain: t.domain,
        description: t.desc,
        count: sanitizedRows.length,
        rows: sanitizedRows,
      };

      totalRows += sanitizedRows.length;
      tableSummaries.push({ name: t.name, domain: t.domain, desc: t.desc, count: sanitizedRows.length });
      console.log(`Exported ${t.name.padEnd(28)} : ${String(sanitizedRows.length).padStart(4)} rows`);
    } catch (e: any) {
      console.error(`Error querying ${t.name}:`, e.message);
    }
  }

  fullData.totalRecords = totalRows;

  // 1. Write the full JSON file
  const jsonPath = path.join(process.cwd(), "docs", "ALL_WEBSITE_DATA.json");
  fs.writeFileSync(jsonPath, JSON.stringify(fullData, null, 2), "utf-8");
  console.log(`\nWritten full JSON data file: ${jsonPath} (${(fs.statSync(jsonPath).size / 1024).toFixed(1)} KB)`);

  // 2. Write a comprehensive, Claude-friendly Markdown documentation file
  let md = `# UniCareer Platform — Complete Website & Database Data Export\n\n`;
  md += `> **Generated At:** ${new Date().toUTCString()}  \n`;
  md += `> **Source Database:** PostgreSQL 16 (Neon Serverless) via Prisma ORM  \n`;
  md += `> **Total Tables:** ${tables.length}  \n`;
  md += `> **Total Database Records:** ${totalRows}  \n`;
  md += `> **Format:** Human-readable and AI-searchable Markdown with raw JSON companion: [\`docs/ALL_WEBSITE_DATA.json\`](file://${jsonPath})\n\n`;

  md += `This document contains the complete current state and all data records of the UniCareer Community web application. Claude (or any AI assistant) can read this document to answer any query regarding registered members, job opportunities, academic transcripts, community discussions, referral pitches, applications, or administrative governance.\n\n`;

  md += `## Table of Contents & Summary\n\n`;
  md += `| # | Table Name | Functional Domain | Row Count | Description |\n`;
  md += `| :---: | :--- | :--- | :---: | :--- |\n`;
  tableSummaries.forEach((s, idx) => {
    md += `| ${idx + 1} | [**\`${s.name}\`**](#${s.name.replace(/_/g, "-")}) | ${s.domain} | **${s.count}** | ${s.desc} |\n`;
  });
  md += `\n---\n\n`;

  // Render each table
  for (const t of tables) {
    const tableInfo = fullData.tables[t.name];
    if (!tableInfo) continue;

    md += `## \`${t.name}\`\n\n`;
    md += `* **Domain:** ${tableInfo.domain}\n`;
    md += `* **Description:** ${tableInfo.description}\n`;
    md += `* **Total Rows:** ${tableInfo.count}\n\n`;

    if (tableInfo.rows.length === 0) {
      md += `*No records present.*\n\n---\n\n`;
      continue;
    }

    // Format as JSON code block or compact tables
    md += `\`\`\`json\n`;
    md += JSON.stringify(tableInfo.rows, null, 2);
    md += `\n\`\`\`\n\n`;
    md += `---\n\n`;
  }

  const mdPath = path.join(process.cwd(), "docs", "ALL_WEBSITE_DATA.md");
  fs.writeFileSync(mdPath, md, "utf-8");
  console.log(`Written master Markdown data file: ${mdPath} (${(fs.statSync(mdPath).size / 1024).toFixed(1)} KB)`);

  console.log("\nExport complete! Both files are saved in docs/.");
}

exportAllData()
  .catch((e) => {
    console.error("Export failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
