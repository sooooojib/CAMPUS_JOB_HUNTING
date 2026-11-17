# UniCareer Platform — Complete Website & Database Data Export

> **Generated At:** Tue, 17 Nov 2026 17:38:45 GMT  
> **Source Database:** PostgreSQL 16 (Neon Serverless) via Prisma ORM  
> **Total Tables:** 30  
> **Total Database Records:** 850  
> **Format:** Human-readable and AI-searchable Markdown with raw JSON companion: [`docs/ALL_WEBSITE_DATA.json`](file:///Users/sajib/se_project/docs/ALL_WEBSITE_DATA.json)

This document contains the complete current state and all data records of the UniCareer Community web application. Claude (or any AI assistant) can read this document to answer any query regarding registered members, job opportunities, academic transcripts, community discussions, referral pitches, applications, or administrative governance.

## Table of Contents & Summary

| # | Table Name | Functional Domain | Row Count | Description |
| :---: | :--- | :--- | :---: | :--- |
| 1 | [**`users`**](#users) | People and login | **36** | Core user accounts and authentication profiles |
| 2 | [**`profiles`**](#profiles) | People and login | **34** | Extended user portfolios, bios, and CGPAs |
| 3 | [**`departments`**](#departments) | People and login | **16** | Academic departments and faculties |
| 4 | [**`skills`**](#skills) | People and login | **92** | Categorized skills taxonomy |
| 5 | [**`academic_records`**](#academic-records) | People and login | **23** | Semester-by-semester transcripts (1.1, 1.2...) |
| 6 | [**`membership_requests`**](#membership-requests) | People and login | **29** | Two-stage verification queue dossiers |
| 7 | [**`sessions`**](#sessions) | People and login | **57** | Active browser device cookies and tokens |
| 8 | [**`accounts`**](#accounts) | People and login | **31** | Better Auth credential stores and password hashes |
| 9 | [**`verifications`**](#verifications) | People and login | **8** | Ephemeral cryptographic email tokens |
| 10 | [**`opportunities`**](#opportunities) | Jobs and applications | **60** | Job and internship listings |
| 11 | [**`companies`**](#companies) | Jobs and applications | **32** | Partner employer directory |
| 12 | [**`applications`**](#applications) | Jobs and applications | **13** | Student application tracker records |
| 13 | [**`application_status_history`**](#application-status-history) | Jobs and applications | **11** | Status audit history timeline |
| 14 | [**`opportunity_bookmarks`**](#opportunity-bookmarks) | Jobs and applications | **8** | Saved job opportunities |
| 15 | [**`opportunity_comments`**](#opportunity-comments) | Jobs and applications | **8** | Public questions and answers under jobs |
| 16 | [**`manual_applications`**](#manual-applications) | Jobs and applications | **8** | Student tracker for external off-campus jobs |
| 17 | [**`company_members`**](#company-members) | Left over (Legacy) | **6** | Company member associations |
| 18 | [**`resumes`**](#resumes) | Left over (Legacy) | **7** | Student uploaded resume metadata |
| 19 | [**`posts`**](#posts) | Community and referrals | **31** | Community discussion feed posts |
| 20 | [**`comments`**](#comments) | Community and referrals | **37** | Threaded comment replies |
| 21 | [**`post_reactions`**](#post-reactions) | Community and referrals | **24** | Atomic post likes and reactions |
| 22 | [**`post_bookmarks`**](#post-bookmarks) | Community and referrals | **8** | Saved community posts |
| 23 | [**`content_reports`**](#content-reports) | Community and referrals | **9** | Moderation reports against posts and comments |
| 24 | [**`connections`**](#connections) | Community and referrals | **9** | Peer-to-peer student & alumni network connections |
| 25 | [**`referral_requests`**](#referral-requests) | Community and referrals | **7** | Direct pitches to alumni for internal company referrals |
| 26 | [**`notifications`**](#notifications) | Alerts and calendar | **42** | In-app notification alerts |
| 27 | [**`notification_preferences`**](#notification-preferences) | Alerts and calendar | **10** | User notification toggle preferences |
| 28 | [**`career_calendar_events`**](#career-calendar-events) | Alerts and calendar | **5** | Application and job deadline events |
| 29 | [**`deadline_reminder_logs`**](#deadline-reminder-logs) | Alerts and calendar | **7** | Automated cron reminder dispatch logs |
| 30 | [**`admin_audit_logs`**](#admin-audit-logs) | Admin | **182** | Immutable administrative governance audit logs |

---

## `users`

* **Domain:** People and login
* **Description:** Core user accounts and authentication profiles
* **Total Rows:** 36

```json
[
  {
    "id": "cmw8zily10013idr76p7t5rje",
    "name": "Mahfuzur Rahman",
    "email": "mahfuz.rahman.alumni@therapbd.com",
    "emailVerified": true,
    "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    "membershipType": "ALUMNI",
    "systemRole": "MEMBER",
    "accountStatus": "ACTIVE",
    "verificationStatus": "VERIFIED",
    "canPostOpportunities": true,
    "canReviewApplicants": false,
    "verifiedAt": null,
    "verifiedBy": null,
    "createdAt": "2026-11-09T08:13:49.081Z",
    "updatedAt": "2026-11-14T15:25:44.149Z"
  },
  {
    "id": "cmw8zim6y0017idr7urnpaq8d",
    "name": "Kazi Nahian",
    "email": "kazi.nahian.alumni@tigerit.com",
    "emailVerified": true,
    "image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
    "membershipType": "ALUMNI",
    "systemRole": "MEMBER",
    "accountStatus": "ACTIVE",
    "verificationStatus": "VERIFIED",
    "canPostOpportunities": true,
    "canReviewApplicants": false,
    "verifiedAt": null,
    "verifiedBy": null,
    "createdAt": "2026-11-09T08:13:49.402Z",
    "updatedAt": "2026-11-14T15:25:44.372Z"
  },
  {
    "id": "cmw8zimfr001bidr7ny0k72sl",
    "name": "Farhana Yesmin",
    "email": "farhana.yesmin.alumni@samsung.com",
    "emailVerified": true,
    "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    "membershipType": "ALUMNI",
    "systemRole": "MEMBER",
    "accountStatus": "ACTIVE",
    "verificationStatus": "VERIFIED",
    "canPostOpportunities": true,
    "canReviewApplicants": false,
    "verifiedAt": null,
    "verifiedBy": null,
    "createdAt": "2026-11-09T08:13:49.719Z",
    "updatedAt": "2026-11-14T15:25:44.598Z"
  },
  {
    "id": "cmw8zimoo001fidr7gceqsc6q",
    "name": "Al-Amin Hossain",
    "email": "alamin.hossain.alumni@chaldal.com",
    "emailVerified": true,
    "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    "membershipType": "ALUMNI",
    "systemRole": "MEMBER",
    "accountStatus": "ACTIVE",
    "verificationStatus": "VERIFIED",
    "canPostOpportunities": true,
    "canReviewApplicants": false,
    "verifiedAt": null,
    "verifiedBy": null,
    "createdAt": "2026-11-09T08:13:50.040Z",
    "updatedAt": "2026-11-14T15:25:44.822Z"
  },
  {
    "id": "cmw8zinfb001sidr756wc25l0",
    "name": "Sayed Mahmud Hasan",
    "email": "sayed.hasan.alumni@optimizely.com",
    "emailVerified": true,
    "image": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80",
    "membershipType": "ALUMNI",
    "systemRole": "MEMBER",
    "accountStatus": "ACTIVE",
    "verificationStatus": "VERIFIED",
    "canPostOpportunities": true,
    "canReviewApplicants": false,
    "verifiedAt": null,
    "verifiedBy": null,
    "createdAt": "2026-11-09T08:13:50.999Z",
    "updatedAt": "2026-11-14T15:25:45.048Z"
  },
  {
    "id": "lInQM5fUHIDxGH2Zgs5qdm0aWZSjVTUr",
    "name": "Ifrat Jahan Juthy",
    "email": "ifratjuthy@gmail.com",
    "emailVerified": false,
    "image": null,
    "membershipType": "STUDENT",
    "systemRole": "MEMBER",
    "accountStatus": "ACTIVE",
    "verificationStatus": "PENDING",
    "canPostOpportunities": false,
    "canReviewApplicants": false,
    "verifiedAt": null,
    "verifiedBy": null,
    "createdAt": "2026-11-09T06:39:43.828Z",
    "updatedAt": "2026-11-09T06:39:43.828Z"
  },
  {
    "id": "cmw8zimxk001jidr7fg35pzjs",
    "name": "Shahriar Kabir",
    "email": "shahriar.kabir@cse.jnu.ac.bd",
    "emailVerified": true,
    "image": null,
    "membershipType": "STUDENT",
    "systemRole": "MEMBER",
    "accountStatus": "ACTIVE",
    "verificationStatus": "PENDING",
    "canPostOpportunities": false,
    "canReviewApplicants": false,
    "verifiedAt": null,
    "verifiedBy": null,
    "createdAt": "2026-11-09T08:13:50.360Z",
    "updatedAt": "2026-11-09T08:13:50.360Z"
  },
  {
    "id": "cmw8zin3k001midr7y6krarlz",
    "name": "Mst. Jannatul Ferdous",
    "email": "jannat.ferdous@swe.jnu.ac.bd",
    "emailVerified": true,
    "image": null,
    "membershipType": "STUDENT",
    "systemRole": "MEMBER",
    "accountStatus": "ACTIVE",
    "verificationStatus": "PENDING",
    "canPostOpportunities": false,
    "canReviewApplicants": false,
    "verifiedAt": null,
    "verifiedBy": null,
    "createdAt": "2026-11-09T08:13:50.576Z",
    "updatedAt": "2026-11-09T08:13:50.576Z"
  },
  {
    "id": "cmw8zin9e001pidr7i8qdy25s",
    "name": "Rashedul Karim",
    "email": "rashed.karim@eee.jnu.ac.bd",
    "emailVerified": true,
    "image": null,
    "membershipType": "STUDENT",
    "systemRole": "MEMBER",
    "accountStatus": "ACTIVE",
    "verificationStatus": "PENDING",
    "canPostOpportunities": false,
    "canReviewApplicants": false,
    "verifiedAt": null,
    "verifiedBy": null,
    "createdAt": "2026-11-09T08:13:50.786Z",
    "updatedAt": "2026-11-09T08:13:50.786Z"
  },
  {
    "id": "cmw8zinl9001vidr7tzkkwaqk",
    "name": "Dilruba Sharmin",
    "email": "dilruba.sharmin@pharm.jnu.ac.bd",
    "emailVerified": true,
    "image": null,
    "membershipType": "STUDENT",
    "systemRole": "MEMBER",
    "accountStatus": "ACTIVE",
    "verificationStatus": "PENDING",
    "canPostOpportunities": false,
    "canReviewApplicants": false,
    "verifiedAt": null,
    "verifiedBy": null,
    "createdAt": "2026-11-09T08:13:51.213Z",
    "updatedAt": "2026-11-09T08:13:51.213Z"
  },
  {
    "id": "cmw8zinr5001yidr7mn8oxw3w",
    "name": "Tanzeemul Haque",
    "email": "tanzeem.haque@fin.jnu.ac.bd",
    "emailVerified": true,
    "image": null,
    "membershipType": "STUDENT",
    "systemRole": "MEMBER",
    "accountStatus": "ACTIVE",
    "verificationStatus": "PENDING",
    "canPostOpportunities": false,
    "canReviewApplicants": false,
    "verifiedAt": null,
    "verifiedBy": null,
    "createdAt": "2026-11-09T08:13:51.425Z",
    "updatedAt": "2026-11-09T08:13:51.425Z"
  },
  {
    "id": "RIJPFcXMMKdUlnlTRBSMuFZANw97nzSe",
    "name": "jkhksd",
    "email": "sajibhasanbd2345@gmail.com",
    "emailVerified": false,
    "image": null,
    "membershipType": "STUDENT",
    "systemRole": "MEMBER",
    "accountStatus": "ACTIVE",
    "verificationStatus": "PENDING",
    "canPostOpportunities": false,
    "canReviewApplicants": false,
    "verifiedAt": null,
    "verifiedBy": null,
    "createdAt": "2026-11-09T06:05:11.779Z",
    "updatedAt": "2026-11-09T06:05:11.779Z"
  },
  {
    "id": "cmw32x6lo000gx6r7cxbbtlrb",
    "name": "Campus Administrator",
    "email": "admin@unicareer.edu",
    "emailVerified": true,
    "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    "membershipType": "ADMIN",
    "systemRole": "ADMIN",
    "accountStatus": "ACTIVE",
    "verificationStatus": "VERIFIED",
    "canPostOpportunities": true,
    "canReviewApplicants": true,
    "verifiedAt": "2026-11-05T09:10:32.669Z",
    "verifiedBy": null,
    "createdAt": "2026-11-05T05:02:30.828Z",
    "updatedAt": "2026-11-08T09:07:17.482Z"
  },
  {
    "id": "zw0XJr3KbwTWoM9S18hfFR3WCgilIzLf",
    "name": "Fariha Yasmeen",
    "email": "farihayasmeen0612@gmail.com",
    "emailVerified": true,
    "image": null,
    "membershipType": "STUDENT",
    "systemRole": "MEMBER",
    "accountStatus": "ACTIVE",
    "verificationStatus": "VERIFIED",
    "canPostOpportunities": true,
    "canReviewApplicants": false,
    "verifiedAt": "2026-11-09T13:14:22.053Z",
    "verifiedBy": "cmw32x6lo000gx6r7cxbbtlrb",
    "createdAt": "2026-11-09T08:33:49.597Z",
    "updatedAt": "2026-11-10T16:36:18.353Z"
  },
  {
    "id": "9eX2XFGRfXneGZFXb37Qdpo0RhAPWzSx",
    "name": "Naima marjan Jerin",
    "email": "naimamarjanjerin@gmail.com",
    "emailVerified": true,
    "image": null,
    "membershipType": "STUDENT",
    "systemRole": "MEMBER",
    "accountStatus": "ACTIVE",
    "verificationStatus": "VERIFIED",
    "canPostOpportunities": true,
    "canReviewApplicants": false,
    "verifiedAt": "2026-11-09T13:15:15.515Z",
    "verifiedBy": "cmw32x6lo000gx6r7cxbbtlrb",
    "createdAt": "2026-11-09T12:20:24.952Z",
    "updatedAt": "2026-11-10T16:36:18.353Z"
  },
  {
    "id": "lnCXe6mNhDbNA5kcNrPRCHyIrxn2BLTH",
    "name": "maufiya khatun",
    "email": "maufiyakhatun99@gmail.com",
    "emailVerified": true,
    "image": null,
    "membershipType": "STUDENT",
    "systemRole": "MEMBER",
    "accountStatus": "ACTIVE",
    "verificationStatus": "VERIFIED",
    "canPostOpportunities": true,
    "canReviewApplicants": false,
    "verifiedAt": "2026-11-09T13:15:23.801Z",
    "verifiedBy": "cmw32x6lo000gx6r7cxbbtlrb",
    "createdAt": "2026-11-09T10:34:16.766Z",
    "updatedAt": "2026-11-10T16:36:18.353Z"
  },
  {
    "id": "cmwgk4qsj001b6pr78xfu201h",
    "name": "Sabrina Rahman",
    "email": "sabrina.rahman.alumni@bkash.com",
    "emailVerified": true,
    "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    "membershipType": "ALUMNI",
    "systemRole": "MEMBER",
    "accountStatus": "ACTIVE",
    "verificationStatus": "VERIFIED",
    "canPostOpportunities": true,
    "canReviewApplicants": false,
    "verifiedAt": null,
    "verifiedBy": null,
    "createdAt": "2026-11-14T15:25:17.347Z",
    "updatedAt": "2026-11-14T15:25:45.270Z"
  },
  {
    "id": "cmwgk4r1r001f6pr7586h1bzs",
    "name": "Dr. Mahbubur Rahman",
    "email": "mahbub.faculty@unicareer.edu",
    "emailVerified": true,
    "image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
    "membershipType": "ALUMNI",
    "systemRole": "MEMBER",
    "accountStatus": "ACTIVE",
    "verificationStatus": "VERIFIED",
    "canPostOpportunities": true,
    "canReviewApplicants": false,
    "verifiedAt": null,
    "verifiedBy": null,
    "createdAt": "2026-11-14T15:25:17.679Z",
    "updatedAt": "2026-11-14T15:25:45.758Z"
  },
  {
    "id": "VIbCmTGFv3plionrQgC4QHcQ8VLxIjLg",
    "name": "asldhjas",
    "email": "idontknowsajib009@gmail.com",
    "emailVerified": true,
    "image": null,
    "membershipType": "STUDENT",
    "systemRole": "MEMBER",
    "accountStatus": "ACTIVE",
    "verificationStatus": "PENDING",
    "canPostOpportunities": false,
    "canReviewApplicants": false,
    "verifiedAt": null,
    "verifiedBy": null,
    "createdAt": "2026-11-09T07:11:18.741Z",
    "updatedAt": "2026-11-09T07:50:34.421Z"
  },
  {
    "id": "cmw3bo551000s3jr7amz6hxy9",
    "name": "Sabrina Rahman",
    "email": "sabrina.alumni@unicareer.edu",
    "emailVerified": true,
    "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    "membershipType": "ALUMNI",
    "systemRole": "MEMBER",
    "accountStatus": "ACTIVE",
    "verificationStatus": "VERIFIED",
    "canPostOpportunities": true,
    "canReviewApplicants": false,
    "verifiedAt": "2026-11-05T09:10:33.570Z",
    "verifiedBy": null,
    "createdAt": "2026-11-05T09:07:25.573Z",
    "updatedAt": "2026-11-08T14:42:51.382Z"
  },
  {
    "id": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "name": "Sajib Hasan",
    "email": "b220305009@cse.jnu.ac.bd",
    "emailVerified": true,
    "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    "membershipType": "STUDENT",
    "systemRole": "MEMBER",
    "accountStatus": "ACTIVE",
    "verificationStatus": "VERIFIED",
    "canPostOpportunities": false,
    "canReviewApplicants": false,
    "verifiedAt": null,
    "verifiedBy": null,
    "createdAt": "2026-11-14T06:02:30.159Z",
    "updatedAt": "2026-11-14T15:25:41.890Z"
  },
  {
    "id": "cmw3bo4y7000p3jr756dqp21t",
    "name": "Tariqul Islam",
    "email": "tariqul.alumni@unicareer.edu",
    "emailVerified": true,
    "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    "membershipType": "ALUMNI",
    "systemRole": "MEMBER",
    "accountStatus": "ACTIVE",
    "verificationStatus": "VERIFIED",
    "canPostOpportunities": true,
    "canReviewApplicants": false,
    "verifiedAt": "2026-11-05T09:10:33.344Z",
    "verifiedBy": null,
    "createdAt": "2026-11-05T09:07:25.327Z",
    "updatedAt": "2026-11-08T14:42:51.382Z"
  },
  {
    "id": "cmw54b766005cuar7sdkyfuq8",
    "name": "Standard Alumni",
    "email": "alumni@unicareer.edu",
    "emailVerified": true,
    "image": null,
    "membershipType": "ALUMNI",
    "systemRole": "MEMBER",
    "accountStatus": "ACTIVE",
    "verificationStatus": "VERIFIED",
    "canPostOpportunities": true,
    "canReviewApplicants": false,
    "verifiedAt": "2026-11-07T18:25:35.021Z",
    "verifiedBy": null,
    "createdAt": "2026-11-06T15:16:56.718Z",
    "updatedAt": "2026-11-08T14:42:51.382Z"
  },
  {
    "id": "cmw3bo4ip000j3jr7a4gq18s0",
    "name": "Farhan Ahmed",
    "email": "farhan.student@unicareer.edu",
    "emailVerified": true,
    "image": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
    "membershipType": "STUDENT",
    "systemRole": "MEMBER",
    "accountStatus": "ACTIVE",
    "verificationStatus": "VERIFIED",
    "canPostOpportunities": true,
    "canReviewApplicants": false,
    "verifiedAt": "2026-11-05T09:10:32.902Z",
    "verifiedBy": null,
    "createdAt": "2026-11-05T09:07:24.769Z",
    "updatedAt": "2026-11-10T16:36:18.353Z"
  },
  {
    "id": "cmw8zilg9000vidr7nzmteig6",
    "name": "Tariqul Islam",
    "email": "tariqul.islam.alumni@bkash.com",
    "emailVerified": true,
    "image": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80",
    "membershipType": "ALUMNI",
    "systemRole": "MEMBER",
    "accountStatus": "ACTIVE",
    "verificationStatus": "VERIFIED",
    "canPostOpportunities": true,
    "canReviewApplicants": false,
    "verifiedAt": null,
    "verifiedBy": null,
    "createdAt": "2026-11-09T08:13:48.441Z",
    "updatedAt": "2026-11-14T15:25:43.700Z"
  },
  {
    "id": "cmw8zilp5000zidr7hfoq6b8j",
    "name": "Sadia Afrin",
    "email": "sadia.afrin.alumni@brainstation-23.com",
    "emailVerified": true,
    "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    "membershipType": "ALUMNI",
    "systemRole": "MEMBER",
    "accountStatus": "ACTIVE",
    "verificationStatus": "VERIFIED",
    "canPostOpportunities": true,
    "canReviewApplicants": false,
    "verifiedAt": null,
    "verifiedBy": null,
    "createdAt": "2026-11-09T08:13:48.761Z",
    "updatedAt": "2026-11-14T15:25:43.923Z"
  },
  {
    "id": "cmw8zijo20003idr7iajyx8sj",
    "name": "Tanvir Ahmed Chowdhury",
    "email": "tanvir.ahmed@cse.jnu.ac.bd",
    "emailVerified": true,
    "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    "membershipType": "STUDENT",
    "systemRole": "MEMBER",
    "accountStatus": "ACTIVE",
    "verificationStatus": "VERIFIED",
    "canPostOpportunities": false,
    "canReviewApplicants": false,
    "verifiedAt": null,
    "verifiedBy": null,
    "createdAt": "2026-11-09T08:13:46.130Z",
    "updatedAt": "2026-11-14T15:25:42.119Z"
  },
  {
    "id": "l1gQBbGkGyFhqUKNkJFyKAfX7uplfyrM",
    "name": "Jannatun Nahar Jui",
    "email": "jannatunnaharjui872@gmail.com",
    "emailVerified": true,
    "image": null,
    "membershipType": "STUDENT",
    "systemRole": "MEMBER",
    "accountStatus": "ACTIVE",
    "verificationStatus": "VERIFIED",
    "canPostOpportunities": true,
    "canReviewApplicants": false,
    "verifiedAt": "2026-11-09T13:15:20.093Z",
    "verifiedBy": "cmw32x6lo000gx6r7cxbbtlrb",
    "createdAt": "2026-11-09T10:49:42.933Z",
    "updatedAt": "2026-11-10T16:36:18.353Z"
  },
  {
    "id": "cmw8zijx70007idr7jaac04lw",
    "name": "Nusrat Jahan Sneha",
    "email": "nusrat.jahan@swe.jnu.ac.bd",
    "emailVerified": true,
    "image": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
    "membershipType": "STUDENT",
    "systemRole": "MEMBER",
    "accountStatus": "ACTIVE",
    "verificationStatus": "VERIFIED",
    "canPostOpportunities": false,
    "canReviewApplicants": false,
    "verifiedAt": null,
    "verifiedBy": null,
    "createdAt": "2026-11-09T08:13:46.459Z",
    "updatedAt": "2026-11-14T15:25:42.342Z"
  },
  {
    "id": "cmw8zik6k000bidr7pthsc98t",
    "name": "Mehedi Hasan Rifat",
    "email": "mehedi.rifat@eee.jnu.ac.bd",
    "emailVerified": true,
    "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    "membershipType": "STUDENT",
    "systemRole": "MEMBER",
    "accountStatus": "ACTIVE",
    "verificationStatus": "VERIFIED",
    "canPostOpportunities": false,
    "canReviewApplicants": false,
    "verifiedAt": null,
    "verifiedBy": null,
    "createdAt": "2026-11-09T08:13:46.796Z",
    "updatedAt": "2026-11-14T15:25:42.566Z"
  },
  {
    "id": "cmw8zikgj000fidr7huk9whgr",
    "name": "Anika Tabassum",
    "email": "anika.tabassum@stat.jnu.ac.bd",
    "emailVerified": true,
    "image": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
    "membershipType": "STUDENT",
    "systemRole": "MEMBER",
    "accountStatus": "ACTIVE",
    "verificationStatus": "VERIFIED",
    "canPostOpportunities": false,
    "canReviewApplicants": false,
    "verifiedAt": null,
    "verifiedBy": null,
    "createdAt": "2026-11-09T08:13:47.155Z",
    "updatedAt": "2026-11-14T15:25:42.791Z"
  },
  {
    "id": "cmw8zikpk000jidr7dmcxnytw",
    "name": "Kazi Fahim Muntasir",
    "email": "kazi.fahim@cse.jnu.ac.bd",
    "emailVerified": true,
    "image": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80",
    "membershipType": "STUDENT",
    "systemRole": "MEMBER",
    "accountStatus": "ACTIVE",
    "verificationStatus": "VERIFIED",
    "canPostOpportunities": false,
    "canReviewApplicants": false,
    "verifiedAt": null,
    "verifiedBy": null,
    "createdAt": "2026-11-09T08:13:47.480Z",
    "updatedAt": "2026-11-14T15:25:43.019Z"
  },
  {
    "id": "cmw3bo4p1000m3jr79ogndqat",
    "name": "Nusrat Jahan",
    "email": "nusrat.student@unicareer.edu",
    "emailVerified": true,
    "image": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
    "membershipType": "STUDENT",
    "systemRole": "MEMBER",
    "accountStatus": "ACTIVE",
    "verificationStatus": "VERIFIED",
    "canPostOpportunities": true,
    "canReviewApplicants": false,
    "verifiedAt": "2026-11-05T09:10:33.123Z",
    "verifiedBy": null,
    "createdAt": "2026-11-05T09:07:24.997Z",
    "updatedAt": "2026-11-10T16:36:18.353Z"
  },
  {
    "id": "cmw8zikyh000nidr7dwp2ckzw",
    "name": "Ayesha Siddiqua",
    "email": "ayesha.siddiqua@mkt.jnu.ac.bd",
    "emailVerified": true,
    "image": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
    "membershipType": "STUDENT",
    "systemRole": "MEMBER",
    "accountStatus": "ACTIVE",
    "verificationStatus": "VERIFIED",
    "canPostOpportunities": false,
    "canReviewApplicants": false,
    "verifiedAt": null,
    "verifiedBy": null,
    "createdAt": "2026-11-09T08:13:47.801Z",
    "updatedAt": "2026-11-14T15:25:43.246Z"
  },
  {
    "id": "cmw8zil7f000ridr7rz8k2ftx",
    "name": "Farhan Ishraq",
    "email": "farhan.ishraq@swe.jnu.ac.bd",
    "emailVerified": true,
    "image": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80",
    "membershipType": "STUDENT",
    "systemRole": "MEMBER",
    "accountStatus": "ACTIVE",
    "verificationStatus": "VERIFIED",
    "canPostOpportunities": false,
    "canReviewApplicants": false,
    "verifiedAt": null,
    "verifiedBy": null,
    "createdAt": "2026-11-09T08:13:48.123Z",
    "updatedAt": "2026-11-14T15:25:43.472Z"
  },
  {
    "id": "cmw54b6zy0059uar7d57zug0h",
    "name": "Standard Student",
    "email": "student@unicareer.edu",
    "emailVerified": true,
    "image": null,
    "membershipType": "STUDENT",
    "systemRole": "MEMBER",
    "accountStatus": "ACTIVE",
    "verificationStatus": "VERIFIED",
    "canPostOpportunities": true,
    "canReviewApplicants": false,
    "verifiedAt": "2026-11-08T08:57:54.297Z",
    "verifiedBy": "cmw32x6lo000gx6r7cxbbtlrb",
    "createdAt": "2026-11-06T15:16:56.494Z",
    "updatedAt": "2026-11-10T16:36:18.353Z"
  }
]
```

---

## `profiles`

* **Domain:** People and login
* **Description:** Extended user portfolios, bios, and CGPAs
* **Total Rows:** 34

```json
[
  {
    "id": "cmwgk4qx3001d6pr7hhd7uivm",
    "userId": "cmwgk4qsj001b6pr78xfu201h",
    "headline": "Lead Product Manager @ bKash Limited | FinTech Innovation & Payments",
    "bio": "BBA Finance Alumna (Class of 2020). Leading merchant payment experience and QR ecosystem serving millions.",
    "department": "Finance & Banking",
    "studentId": "B160309002",
    "academicYear": null,
    "graduationYear": 2020,
    "degree": "B.B.A. in Finance & Banking",
    "currentCgpa": null,
    "isCgpaVerified": false,
    "company": "bKash Limited",
    "designation": "Lead Product Manager",
    "skills": [
      "Product Management",
      "Financial Analysis",
      "FinTech",
      "SQL",
      "Agile Leadership"
    ],
    "interests": [
      "Product Strategy",
      "FinTech Disruptions",
      "Career Mentoring"
    ],
    "projects": null,
    "experience": null,
    "linkedinUrl": "https://linkedin.com/in/sabrina-rahman-fintech",
    "githubUrl": null,
    "websiteUrl": null,
    "phone": null,
    "showEmail": true,
    "isOnboarded": true,
    "createdAt": "2026-11-14T15:25:17.511Z",
    "updatedAt": "2026-11-14T15:25:45.383Z"
  },
  {
    "id": "cmw3bo53h000r3jr7yoksn8f9",
    "userId": "cmw3bo4y7000p3jr756dqp21t",
    "headline": "Senior Software Engineer @ Databricks | Distributed Cloud Runtimes",
    "bio": "Proud alumnus (Class of 2021). Leading serverless compute infrastructure at Databricks. Always happy to mentor university juniors, review code, and provide internal job referrals.",
    "department": "Computer Science & Engineering",
    "studentId": null,
    "academicYear": null,
    "graduationYear": 2021,
    "degree": "B.Sc. in Computer Science & Engineering",
    "currentCgpa": null,
    "isCgpaVerified": false,
    "company": "Databricks",
    "designation": "Senior Software Engineer",
    "skills": [
      "Go",
      "Kubernetes",
      "Distributed Systems",
      "Apache Kafka",
      "Cloud Architecture",
      "PostgreSQL"
    ],
    "interests": [
      "System Design",
      "Mentorship",
      "Alumni Networking",
      "Cloud Infrastructure"
    ],
    "projects": null,
    "experience": null,
    "linkedinUrl": "https://linkedin.com/in/tariqul-islam-cloud",
    "githubUrl": "https://github.com/tariqul-databricks",
    "websiteUrl": null,
    "phone": null,
    "showEmail": true,
    "isOnboarded": true,
    "createdAt": "2026-11-05T09:07:25.517Z",
    "updatedAt": "2026-11-08T09:07:03.040Z"
  },
  {
    "id": "cmw3bo4tj000o3jr7dhktcyre",
    "userId": "cmw3bo4p1000m3jr79ogndqat",
    "headline": "Junior SWE Student | Applied AI & Competitive Programmer",
    "bio": "Software Engineering 3rd year undergraduate. Top 5% in National Collegiate Programming Contest. Active researcher in natural language processing and computer vision.",
    "department": "Software Engineering",
    "studentId": "STU-2024-0891",
    "academicYear": "3rd Year",
    "graduationYear": 2028,
    "degree": "B.Sc. in Software Engineering",
    "currentCgpa": 3.72,
    "isCgpaVerified": false,
    "company": null,
    "designation": null,
    "skills": [
      "Python",
      "Machine Learning",
      "TensorFlow",
      "C++",
      "Data Structures",
      "FastAPI",
      "Git",
      "SQL"
    ],
    "interests": [
      "Deep Learning",
      "Competitive Programming",
      "Robotics",
      "Algorithm Design"
    ],
    "projects": [
      {
        "id": "proj-3",
        "link": "https://github.com/nusrat-jahan-swe/bengali-nlp",
        "title": "Bengali NLP Semantic Classifier",
        "techStack": [
          "Python",
          "PyTorch",
          "Transformers",
          "FastAPI"
        ],
        "description": "Fine-tuned transformer model classifying complex linguistic sentiment in Bengali literature."
      }
    ],
    "experience": null,
    "linkedinUrl": "https://linkedin.com/in/nusrat-jahan-ai",
    "githubUrl": "https://github.com/nusrat-jahan-swe",
    "websiteUrl": null,
    "phone": null,
    "showEmail": true,
    "isOnboarded": true,
    "createdAt": "2026-11-05T09:07:25.159Z",
    "updatedAt": "2026-11-08T09:07:09.788Z"
  },
  {
    "id": "cmw9534wf000207jwwpxflghg",
    "userId": "l1gQBbGkGyFhqUKNkJFyKAfX7uplfyrM",
    "headline": null,
    "bio": null,
    "department": "Computer Science & Engineering",
    "studentId": "B220305005",
    "academicYear": null,
    "graduationYear": null,
    "degree": "Degree in Computer Science & Engineering",
    "currentCgpa": null,
    "isCgpaVerified": false,
    "company": null,
    "designation": null,
    "skills": [],
    "interests": [],
    "projects": null,
    "experience": null,
    "linkedinUrl": null,
    "githubUrl": null,
    "websiteUrl": null,
    "phone": null,
    "showEmail": false,
    "isOnboarded": true,
    "createdAt": "2026-11-09T10:49:44.847Z",
    "updatedAt": "2026-11-09T13:15:20.537Z"
  },
  {
    "id": "cmw8vxkyh000008l5k23zfaqr",
    "userId": "RIJPFcXMMKdUlnlTRBSMuFZANw97nzSe",
    "headline": null,
    "bio": null,
    "department": null,
    "studentId": null,
    "academicYear": null,
    "graduationYear": null,
    "degree": null,
    "currentCgpa": null,
    "isCgpaVerified": false,
    "company": null,
    "designation": null,
    "skills": [],
    "interests": [],
    "projects": null,
    "experience": null,
    "linkedinUrl": null,
    "githubUrl": null,
    "websiteUrl": null,
    "phone": null,
    "showEmail": false,
    "isOnboarded": false,
    "createdAt": "2026-11-09T06:33:29.177Z",
    "updatedAt": "2026-11-09T06:33:29.177Z"
  },
  {
    "id": "cmw8zimk9001didr7z9r0ngkk",
    "userId": "cmw8zimfr001bidr7ny0k72sl",
    "headline": "Software Engineer at Samsung R&D Bangladesh | JnU CSE '22 | On-Device AI",
    "bio": "Optimizing deep learning models for Samsung Galaxy flagship devices. Winner of JnU Intra-Department Coding Championship 2021.",
    "department": "Computer Science & Engineering",
    "studentId": "B180305041",
    "academicYear": null,
    "graduationYear": 2022,
    "degree": "B.Sc. in Computer Science & Engineering",
    "currentCgpa": null,
    "isCgpaVerified": false,
    "company": "Samsung R&D Institute Bangladesh",
    "designation": "Software Engineer (Mobile AI Team)",
    "skills": [
      "C++",
      "Python",
      "TensorFlow Lite",
      "PyTorch",
      "Android NDK",
      "Algorithms"
    ],
    "interests": [
      "Edge AI",
      "Neural Accelerators",
      "Mobile Performance"
    ],
    "projects": null,
    "experience": null,
    "linkedinUrl": "https://linkedin.com/in/farhana-yesmin-ai",
    "githubUrl": "https://github.com/farhana-samsung-ai",
    "websiteUrl": null,
    "phone": null,
    "showEmail": true,
    "isOnboarded": true,
    "createdAt": "2026-11-09T08:13:49.881Z",
    "updatedAt": "2026-11-14T15:25:44.711Z"
  },
  {
    "id": "cmw8zijsp0005idr7mcqu6cv1",
    "userId": "cmw8zijo20003idr7iajyx8sj",
    "headline": "Backend Engineer & Distributed Systems Enthusiast | JnU CSE '25",
    "bio": "Final year student focused on Go, Kafka, and microservices architecture. Ex-Intern at Chaldal. Incoming Associate Software Engineer.",
    "department": "Computer Science & Engineering",
    "studentId": "B210305018",
    "academicYear": "4th Year / Senior",
    "graduationYear": 2025,
    "degree": "B.Sc. in Computer Science & Engineering",
    "currentCgpa": 3.91,
    "isCgpaVerified": true,
    "company": null,
    "designation": null,
    "skills": [
      "Go",
      "Kafka",
      "PostgreSQL",
      "Redis",
      "Docker",
      "Kubernetes",
      "gRPC"
    ],
    "interests": [
      "High-Throughput Systems",
      "Database Internals",
      "Distributed Consensus"
    ],
    "projects": null,
    "experience": null,
    "linkedinUrl": "https://linkedin.com/in/tanvir-ahmed-cse",
    "githubUrl": "https://github.com/tanvir-ahmed-dev",
    "websiteUrl": null,
    "phone": null,
    "showEmail": true,
    "isOnboarded": true,
    "createdAt": "2026-11-09T08:13:46.297Z",
    "updatedAt": "2026-11-14T15:25:42.230Z"
  },
  {
    "id": "cmw3bo4gv000i3jr7jgjejso8",
    "userId": "cmw32x6lo000gx6r7cxbbtlrb",
    "headline": "Chief Career Services & Campus Administrator",
    "bio": "Dedicated to building high-trust career pathways between university scholars, research laboratories, and industry partners.",
    "department": null,
    "studentId": null,
    "academicYear": null,
    "graduationYear": null,
    "degree": null,
    "currentCgpa": null,
    "isCgpaVerified": false,
    "company": null,
    "designation": null,
    "skills": [
      "Academic Leadership",
      "Higher Education Policy",
      "Career Counseling",
      "Institutional Partnerships"
    ],
    "interests": [
      "Higher Ed Tech",
      "Industry Mentorship",
      "Career Readiness"
    ],
    "projects": null,
    "experience": null,
    "linkedinUrl": null,
    "githubUrl": null,
    "websiteUrl": null,
    "phone": null,
    "showEmail": true,
    "isOnboarded": true,
    "createdAt": "2026-11-05T09:07:24.703Z",
    "updatedAt": "2026-11-08T09:07:17.539Z"
  },
  {
    "id": "cmw54b71k005auar7l1vgwymu",
    "userId": "cmw54b6zy0059uar7d57zug0h",
    "headline": "Enrolled Student | Computer Science & Engineering",
    "bio": "ouolip",
    "department": null,
    "studentId": "B230423049823",
    "academicYear": "3rd Year / Junior",
    "graduationYear": 2027,
    "degree": "B.S. in Computer Science & Engineering",
    "currentCgpa": 0.47,
    "isCgpaVerified": false,
    "company": null,
    "designation": null,
    "skills": [
      "TypeScript",
      "Python",
      "React",
      "PostgreSQL"
    ],
    "interests": [],
    "projects": null,
    "experience": null,
    "linkedinUrl": null,
    "githubUrl": null,
    "websiteUrl": null,
    "phone": null,
    "showEmail": true,
    "isOnboarded": true,
    "createdAt": "2026-11-06T15:16:56.552Z",
    "updatedAt": "2026-11-08T20:22:48.956Z"
  },
  {
    "id": "cmw54b77t005duar7bovvb6ec",
    "userId": "cmw54b766005cuar7sdkyfuq8",
    "headline": "University Alumnus | Industry Professional",
    "bio": null,
    "department": null,
    "studentId": null,
    "academicYear": null,
    "graduationYear": null,
    "degree": null,
    "currentCgpa": null,
    "isCgpaVerified": false,
    "company": "Tech Global Inc",
    "designation": "Software Engineer",
    "skills": [],
    "interests": [],
    "projects": null,
    "experience": null,
    "linkedinUrl": null,
    "githubUrl": null,
    "websiteUrl": null,
    "phone": null,
    "showEmail": true,
    "isOnboarded": true,
    "createdAt": "2026-11-06T15:16:56.777Z",
    "updatedAt": "2026-11-08T09:07:17.977Z"
  },
  {
    "id": "cmw908dnv000008jz6gaiohxe",
    "userId": "zw0XJr3KbwTWoM9S18hfFR3WCgilIzLf",
    "headline": "Undergraduated in Computer Science",
    "bio": null,
    "department": "Computer Science & Engineering",
    "studentId": "B220305007",
    "academicYear": null,
    "graduationYear": null,
    "degree": "Degree in Computer Science & Engineering",
    "currentCgpa": 3.59,
    "isCgpaVerified": true,
    "company": null,
    "designation": null,
    "skills": [],
    "interests": [],
    "projects": null,
    "experience": null,
    "linkedinUrl": null,
    "githubUrl": null,
    "websiteUrl": null,
    "phone": null,
    "showEmail": false,
    "isOnboarded": true,
    "createdAt": "2026-11-09T08:33:51.403Z",
    "updatedAt": "2026-11-09T13:14:22.521Z"
  },
  {
    "id": "cmw3bo59g000u3jr78qihtdil",
    "userId": "cmw3bo551000s3jr7amz6hxy9",
    "headline": "Lead Product Manager @ bKash Limited | FinTech Innovation",
    "bio": "BBA Finance Alumna (Class of 2020). Leading merchant payment experience and QR ecosystem serving millions. Passionate about empowering women in product management and fintech.",
    "department": "Finance & Banking",
    "studentId": null,
    "academicYear": null,
    "graduationYear": 2020,
    "degree": "BBA in Finance & Banking",
    "currentCgpa": null,
    "isCgpaVerified": false,
    "company": "bKash Limited",
    "designation": "Lead Product Manager",
    "skills": [
      "Product Management",
      "Financial Analysis",
      "FinTech",
      "SQL",
      "Agile Leadership",
      "User Research"
    ],
    "interests": [
      "Product Strategy",
      "FinTech Disruptions",
      "Career Mentoring"
    ],
    "projects": null,
    "experience": null,
    "linkedinUrl": "https://linkedin.com/in/sabrina-rahman-fintech",
    "githubUrl": null,
    "websiteUrl": null,
    "phone": null,
    "showEmail": true,
    "isOnboarded": true,
    "createdAt": "2026-11-05T09:07:25.732Z",
    "updatedAt": "2026-11-08T09:06:59.312Z"
  },
  {
    "id": "cmw3bo4nh000l3jr7y3gqvuz9",
    "userId": "cmw3bo4ip000j3jr7a4gq18s0",
    "headline": "Senior CS Scholar | Distributed Systems & Full-Stack Cloud Engineer",
    "bio": "Undergraduate senior with extensive experience in Next.js, Go, and PostgreSQL. Dean's Honor Roll recipient. Passionate about high-throughput microservices and cloud infrastructure.",
    "department": "Computer Science & Engineering",
    "studentId": "STU-2023-0142",
    "academicYear": "4th Year",
    "graduationYear": 2027,
    "degree": "B.Sc. in Computer Science & Engineering",
    "currentCgpa": 3.88,
    "isCgpaVerified": false,
    "company": null,
    "designation": null,
    "skills": [
      "TypeScript",
      "Next.js",
      "React",
      "PostgreSQL",
      "Docker",
      "Go",
      "Node.js",
      "Python"
    ],
    "interests": [
      "Distributed Systems",
      "Cloud Architecture",
      "Database Internals",
      "Open Source"
    ],
    "projects": [
      {
        "id": "proj-1",
        "link": "https://github.com/farhan-ahmed-cloud/raft-kv",
        "title": "Distributed KV Store",
        "techStack": [
          "Go",
          "gRPC",
          "Raft",
          "Docker"
        ],
        "description": "Raft consensus implementation in Go with gRPC streaming replication and persistent disk storage."
      },
      {
        "id": "proj-2",
        "link": "https://github.com/farhan-ahmed-cloud/campus-portal",
        "title": "Next.js Campus Portal",
        "techStack": [
          "Next.js 16",
          "React 19",
          "PostgreSQL",
          "Tailwind CSS"
        ],
        "description": "High-performance collaborative portal featuring live SSR caching and optimistic UI mutations."
      }
    ],
    "experience": [
      {
        "id": "exp-1",
        "role": "Software Engineering Intern",
        "period": "Summer 2025 (3 Months)",
        "company": "Optimizely Hub",
        "description": "Engineered real-time telemetry ingestion pipeline handling 100K events/second with Apache Kafka and Go."
      }
    ],
    "linkedinUrl": "https://linkedin.com/in/farhan-ahmed-dev",
    "githubUrl": "https://github.com/farhan-ahmed-cloud",
    "websiteUrl": "https://farhan-ahmed.dev",
    "phone": null,
    "showEmail": true,
    "isOnboarded": true,
    "createdAt": "2026-11-05T09:07:24.941Z",
    "updatedAt": "2026-11-08T09:07:01.700Z"
  },
  {
    "id": "cmw8zikb6000didr79r3es9u8",
    "userId": "cmw8zik6k000bidr7pthsc98t",
    "headline": "IoT & Embedded Systems Engineer | Robotics & Firmware | JnU EEE",
    "bio": "Building smart campus IoT networks, STM32 firmware, and sensor telemetry systems. President of JnU Robotics & Embedded Club.",
    "department": "Electrical & Electronic Engineering",
    "studentId": "B210307042",
    "academicYear": "4th Year / Senior",
    "graduationYear": 2025,
    "degree": "B.Sc. in Electrical & Electronic Engineering",
    "currentCgpa": 3.65,
    "isCgpaVerified": true,
    "company": null,
    "designation": null,
    "skills": [
      "C/C++",
      "Embedded Systems",
      "STM32",
      "PCB Design",
      "MQTT",
      "Python"
    ],
    "interests": [
      "Edge Computing",
      "Hardware Accelerators",
      "Robotics"
    ],
    "projects": null,
    "experience": null,
    "linkedinUrl": "https://linkedin.com/in/mehedi-hasan-eee",
    "githubUrl": "https://github.com/mehedi-rifat-iot",
    "websiteUrl": null,
    "phone": null,
    "showEmail": true,
    "isOnboarded": true,
    "createdAt": "2026-11-09T08:13:46.962Z",
    "updatedAt": "2026-11-14T15:25:42.679Z"
  },
  {
    "id": "cmw8zikl3000hidr7fbzxal6g",
    "userId": "cmw8zikgj000fidr7huk9whgr",
    "headline": "Data Analyst & Machine Learning Researcher | JnU Statistics",
    "bio": "Leveraging Bayesian inference, Python statistical libraries, and predictive modeling for actionable insights. Published researcher in epidemiological forecasting.",
    "department": "Statistics",
    "studentId": "B220308015",
    "academicYear": "3rd Year / Junior",
    "graduationYear": 2026,
    "degree": "B.Sc. in Statistics & Data Science",
    "currentCgpa": 3.88,
    "isCgpaVerified": true,
    "company": null,
    "designation": null,
    "skills": [
      "Python",
      "R",
      "SQL",
      "Pandas",
      "Scikit-Learn",
      "Tableau",
      "PowerBI"
    ],
    "interests": [
      "Data Analytics",
      "Predictive Modeling",
      "Biostatistics"
    ],
    "projects": null,
    "experience": null,
    "linkedinUrl": "https://linkedin.com/in/anika-tabassum-stat",
    "githubUrl": "https://github.com/anika-tabassum-data",
    "websiteUrl": null,
    "phone": null,
    "showEmail": true,
    "isOnboarded": true,
    "createdAt": "2026-11-09T08:13:47.319Z",
    "updatedAt": "2026-11-14T15:25:42.905Z"
  },
  {
    "id": "cmw8zik1r0009idr7b1cpwjsk",
    "userId": "cmw8zijx70007idr7jaac04lw",
    "headline": "Mobile & Frontend Engineer | React Native, Flutter & UI/UX | JnU SWE",
    "bio": "Creating user-centric mobile applications with clean architecture and delightful micro-interactions. Lead Organizer at JnU Women in Tech.",
    "department": "Software Engineering",
    "studentId": "B220306024",
    "academicYear": "3rd Year / Junior",
    "graduationYear": 2026,
    "degree": "B.Sc. in Software Engineering",
    "currentCgpa": 3.78,
    "isCgpaVerified": true,
    "company": null,
    "designation": null,
    "skills": [
      "React Native",
      "Flutter",
      "TypeScript",
      "Tailwind CSS",
      "Figma",
      "Redux"
    ],
    "interests": [
      "Mobile UX",
      "Cross-Platform Dev",
      "Design Systems"
    ],
    "projects": null,
    "experience": null,
    "linkedinUrl": "https://linkedin.com/in/nusrat-jahan-swe",
    "githubUrl": "https://github.com/nusrat-sneha-swe",
    "websiteUrl": null,
    "phone": null,
    "showEmail": true,
    "isOnboarded": true,
    "createdAt": "2026-11-09T08:13:46.623Z",
    "updatedAt": "2026-11-14T15:25:42.454Z"
  },
  {
    "id": "cmw8ziku0000lidr7zple7np0",
    "userId": "cmw8zikpk000jidr7dmcxnytw",
    "headline": "Frontend Craftsman & Open Source Contributor | JnU CSE '27",
    "bio": "Passionate about building fast, responsive, and accessible web experiences with Next.js, Tailwind CSS, and shadcn/ui. Hackathon enthusiast.",
    "department": "Computer Science & Engineering",
    "studentId": "B230305061",
    "academicYear": "2nd Year / Sophomore",
    "graduationYear": 2027,
    "degree": "B.Sc. in Computer Science & Engineering",
    "currentCgpa": 3.72,
    "isCgpaVerified": true,
    "company": null,
    "designation": null,
    "skills": [
      "React",
      "Next.js",
      "Tailwind CSS",
      "JavaScript",
      "HTML5",
      "CSS3",
      "Git"
    ],
    "interests": [
      "Web Animations",
      "Modern UI/UX",
      "Open Source"
    ],
    "projects": null,
    "experience": null,
    "linkedinUrl": "https://linkedin.com/in/kazi-fahim-muntasir",
    "githubUrl": "https://github.com/kazi-fahim-web",
    "websiteUrl": null,
    "phone": null,
    "showEmail": true,
    "isOnboarded": true,
    "createdAt": "2026-11-09T08:13:47.640Z",
    "updatedAt": "2026-11-14T15:25:43.134Z"
  },
  {
    "id": "cmw8zil30000pidr71qg36ldx",
    "userId": "cmw8zikyh000nidr7dwp2ckzw",
    "headline": "Product Marketing Trainee & Growth Strategist | JnU Business Studies",
    "bio": "Specializing in digital marketing, user acquisition funnels, and product go-to-market strategies for tech startups in Bangladesh.",
    "department": "Marketing",
    "studentId": "B210309033",
    "academicYear": "4th Year / Senior",
    "graduationYear": 2025,
    "degree": "B.B.A. in Marketing",
    "currentCgpa": 3.82,
    "isCgpaVerified": true,
    "company": null,
    "designation": null,
    "skills": [
      "Growth Marketing",
      "SEO/SEM",
      "Content Strategy",
      "Google Analytics",
      "Brand Management"
    ],
    "interests": [
      "FinTech Adoption",
      "Product Growth",
      "Market Research"
    ],
    "projects": null,
    "experience": null,
    "linkedinUrl": "https://linkedin.com/in/ayesha-siddiqua-mkt",
    "githubUrl": null,
    "websiteUrl": null,
    "phone": null,
    "showEmail": true,
    "isOnboarded": true,
    "createdAt": "2026-11-09T08:13:47.964Z",
    "updatedAt": "2026-11-14T15:25:43.360Z"
  },
  {
    "id": "cmw8zilbt000tidr7ha27zb8k",
    "userId": "cmw8zil7f000ridr7rz8k2ftx",
    "headline": "Cloud & DevOps Aspirant | Docker, Linux, CI/CD | JnU SWE",
    "bio": "Learning automated build pipelines, infrastructure as code, and cloud monitoring. Contributor to Linux kernel user-space tools.",
    "department": "Software Engineering",
    "studentId": "B230306019",
    "academicYear": "2nd Year / Sophomore",
    "graduationYear": 2027,
    "degree": "B.Sc. in Software Engineering",
    "currentCgpa": 3.68,
    "isCgpaVerified": true,
    "company": null,
    "designation": null,
    "skills": [
      "Linux",
      "Bash",
      "Docker",
      "GitHub Actions",
      "Python",
      "AWS"
    ],
    "interests": [
      "DevOps",
      "Site Reliability",
      "Cloud Security"
    ],
    "projects": null,
    "experience": null,
    "linkedinUrl": "https://linkedin.com/in/farhan-ishraq-swe",
    "githubUrl": "https://github.com/farhan-ishraq-cloud",
    "websiteUrl": null,
    "phone": null,
    "showEmail": true,
    "isOnboarded": true,
    "createdAt": "2026-11-09T08:13:48.281Z",
    "updatedAt": "2026-11-14T15:25:43.586Z"
  },
  {
    "id": "cmw8zilko000xidr7gecyr2x4",
    "userId": "cmw8zilg9000vidr7nzmteig6",
    "headline": "Senior Software Engineer at bKash | JnU CSE '21 | Distributed Systems Mentor",
    "bio": "Scaling bKash core transaction engine handling millions of daily financial transactions. Passionate about mentoring JnU juniors and hiring campus engineering talent.",
    "department": "Computer Science & Engineering",
    "studentId": "B170305012",
    "academicYear": null,
    "graduationYear": 2021,
    "degree": "B.Sc. in Computer Science & Engineering",
    "currentCgpa": null,
    "isCgpaVerified": false,
    "company": "bKash Limited",
    "designation": "Senior Software Engineer (FinTech Platform)",
    "skills": [
      "Java",
      "Spring Boot",
      "Kafka",
      "PostgreSQL",
      "Oracle",
      "Docker",
      "Microservices"
    ],
    "interests": [
      "Financial Infrastructure",
      "High Concurrency",
      "Mentorship"
    ],
    "projects": null,
    "experience": null,
    "linkedinUrl": "https://linkedin.com/in/tariqul-islam-fintech",
    "githubUrl": "https://github.com/tariqul-bkash",
    "websiteUrl": null,
    "phone": null,
    "showEmail": true,
    "isOnboarded": true,
    "createdAt": "2026-11-09T08:13:48.600Z",
    "updatedAt": "2026-11-14T15:25:43.812Z"
  },
  {
    "id": "cmw8ziltk0011idr76p24999i",
    "userId": "cmw8zilp5000zidr7hfoq6b8j",
    "headline": "Lead Cloud Architect at Brain Station 23 | JnU CSE '22 | AWS Certified Solutions Architect",
    "bio": "Architecting cloud migrations and microservices for international banking and healthcare clients. Passionate about serverless architectures and zero-trust security.",
    "department": "Computer Science & Engineering",
    "studentId": "B180305029",
    "academicYear": null,
    "graduationYear": 2022,
    "degree": "B.Sc. in Computer Science & Engineering",
    "currentCgpa": null,
    "isCgpaVerified": false,
    "company": "Brain Station 23",
    "designation": "Lead Enterprise Cloud Engineer",
    "skills": [
      "AWS",
      "Terraform",
      "Kubernetes",
      "Node.js",
      "C# .NET",
      "Docker"
    ],
    "interests": [
      "Cloud Native",
      "DevOps Culture",
      "Enterprise Architecture"
    ],
    "projects": null,
    "experience": null,
    "linkedinUrl": "https://linkedin.com/in/sadia-afrin-bs23",
    "githubUrl": "https://github.com/sadia-afrin-cloud",
    "websiteUrl": null,
    "phone": null,
    "showEmail": true,
    "isOnboarded": true,
    "createdAt": "2026-11-09T08:13:48.920Z",
    "updatedAt": "2026-11-14T15:25:44.036Z"
  },
  {
    "id": "cmw8zim2g0015idr7d8t8igwt",
    "userId": "cmw8zily10013idr76p7t5rje",
    "headline": "Principal Software Engineer at Therap (BD) | JnU CSE '20 | Java Specialist",
    "bio": "Designing healthcare software for intellectual disability care providers across North America. JnU ACM-ICPC regionalist (2018, 2019).",
    "department": "Computer Science & Engineering",
    "studentId": "B160305008",
    "academicYear": null,
    "graduationYear": 2020,
    "degree": "B.Sc. in Computer Science & Engineering",
    "currentCgpa": null,
    "isCgpaVerified": false,
    "company": "Therap (BD) Ltd.",
    "designation": "Principal Software Engineer",
    "skills": [
      "Java",
      "J2EE",
      "Spring Cloud",
      "PostgreSQL",
      "Database Tuning",
      "System Design"
    ],
    "interests": [
      "Healthcare Tech",
      "Clean Architecture",
      "Competitive Programming"
    ],
    "projects": null,
    "experience": null,
    "linkedinUrl": "https://linkedin.com/in/mahfuzur-rahman-therap",
    "githubUrl": "https://github.com/mahfuz-therap",
    "websiteUrl": null,
    "phone": null,
    "showEmail": true,
    "isOnboarded": true,
    "createdAt": "2026-11-09T08:13:49.240Z",
    "updatedAt": "2026-11-14T15:25:44.260Z"
  },
  {
    "id": "cmw8zimbc0019idr79sf7j6ob",
    "userId": "cmw8zim6y0017idr7urnpaq8d",
    "headline": "Senior Biometrics & Identity Systems Engineer at TigerIT | JnU SWE '21",
    "bio": "Working on national identity and cryptographic verification engines in C++ and high-performance algorithms. Proud JnU alumnus.",
    "department": "Software Engineering",
    "studentId": "B170306014",
    "academicYear": null,
    "graduationYear": 2021,
    "degree": "B.Sc. in Software Engineering",
    "currentCgpa": null,
    "isCgpaVerified": false,
    "company": "TigerIT Bangladesh",
    "designation": "Senior Biometrics Systems Developer",
    "skills": [
      "C++",
      "Computer Vision",
      "OpenCV",
      "Cryptography",
      "Linux Systems"
    ],
    "interests": [
      "Biometrics",
      "Embedded AI",
      "Security"
    ],
    "projects": null,
    "experience": null,
    "linkedinUrl": "https://linkedin.com/in/kazi-nahian-identity",
    "githubUrl": "https://github.com/kazi-nahian-tigerit",
    "websiteUrl": null,
    "phone": null,
    "showEmail": true,
    "isOnboarded": true,
    "createdAt": "2026-11-09T08:13:49.560Z",
    "updatedAt": "2026-11-14T15:25:44.486Z"
  },
  {
    "id": "cmw8zimz5001kidr7j06dl3mb",
    "userId": "cmw8zimxk001jidr7fg35pzjs",
    "headline": null,
    "bio": null,
    "department": "Computer Science & Engineering",
    "studentId": "B220305033",
    "academicYear": "3rd Year / Junior",
    "graduationYear": 2026,
    "degree": null,
    "currentCgpa": null,
    "isCgpaVerified": false,
    "company": null,
    "designation": null,
    "skills": [],
    "interests": [],
    "projects": null,
    "experience": null,
    "linkedinUrl": null,
    "githubUrl": null,
    "websiteUrl": null,
    "phone": null,
    "showEmail": false,
    "isOnboarded": false,
    "createdAt": "2026-11-09T08:13:50.417Z",
    "updatedAt": "2026-11-09T08:13:50.417Z"
  },
  {
    "id": "cmw8zin51001nidr7lkelkort",
    "userId": "cmw8zin3k001midr7y6krarlz",
    "headline": null,
    "bio": null,
    "department": "Software Engineering",
    "studentId": "B230306012",
    "academicYear": "2nd Year / Sophomore",
    "graduationYear": 2027,
    "degree": null,
    "currentCgpa": null,
    "isCgpaVerified": false,
    "company": null,
    "designation": null,
    "skills": [],
    "interests": [],
    "projects": null,
    "experience": null,
    "linkedinUrl": null,
    "githubUrl": null,
    "websiteUrl": null,
    "phone": null,
    "showEmail": false,
    "isOnboarded": false,
    "createdAt": "2026-11-09T08:13:50.629Z",
    "updatedAt": "2026-11-09T08:13:50.629Z"
  },
  {
    "id": "cmw8zinau001qidr7vlgt9wed",
    "userId": "cmw8zin9e001pidr7i8qdy25s",
    "headline": null,
    "bio": null,
    "department": "Electrical & Electronic Engineering",
    "studentId": "B210307028",
    "academicYear": "4th Year / Senior",
    "graduationYear": 2025,
    "degree": null,
    "currentCgpa": null,
    "isCgpaVerified": false,
    "company": null,
    "designation": null,
    "skills": [],
    "interests": [],
    "projects": null,
    "experience": null,
    "linkedinUrl": null,
    "githubUrl": null,
    "websiteUrl": null,
    "phone": null,
    "showEmail": false,
    "isOnboarded": false,
    "createdAt": "2026-11-09T08:13:50.838Z",
    "updatedAt": "2026-11-09T08:13:50.838Z"
  },
  {
    "id": "cmw8zinmq001widr7r9uj2n6o",
    "userId": "cmw8zinl9001vidr7tzkkwaqk",
    "headline": null,
    "bio": null,
    "department": "Pharmacy",
    "studentId": "B220310007",
    "academicYear": "3rd Year / Junior",
    "graduationYear": 2026,
    "degree": null,
    "currentCgpa": null,
    "isCgpaVerified": false,
    "company": null,
    "designation": null,
    "skills": [],
    "interests": [],
    "projects": null,
    "experience": null,
    "linkedinUrl": null,
    "githubUrl": null,
    "websiteUrl": null,
    "phone": null,
    "showEmail": false,
    "isOnboarded": false,
    "createdAt": "2026-11-09T08:13:51.266Z",
    "updatedAt": "2026-11-09T08:13:51.266Z"
  },
  {
    "id": "cmw8zinsl001zidr7okn17q3r",
    "userId": "cmw8zinr5001yidr7mn8oxw3w",
    "headline": null,
    "bio": null,
    "department": "Finance & Banking",
    "studentId": "B210309019",
    "academicYear": "4th Year / Senior",
    "graduationYear": 2025,
    "degree": null,
    "currentCgpa": null,
    "isCgpaVerified": false,
    "company": null,
    "designation": null,
    "skills": [],
    "interests": [],
    "projects": null,
    "experience": null,
    "linkedinUrl": null,
    "githubUrl": null,
    "websiteUrl": null,
    "phone": null,
    "showEmail": false,
    "isOnboarded": false,
    "createdAt": "2026-11-09T08:13:51.477Z",
    "updatedAt": "2026-11-09T08:13:51.477Z"
  },
  {
    "id": "cmw8zimt4001hidr7h9gxmlcn",
    "userId": "cmw8zimoo001fidr7gceqsc6q",
    "headline": "Full-Stack Engineer at Chaldal | JnU CSE '23 | F# & React Developer",
    "bio": "Building micro-frontend checkout experiences and automated warehousing pick-list services with F# and TypeScript.",
    "department": "Computer Science & Engineering",
    "studentId": "B190305016",
    "academicYear": null,
    "graduationYear": 2023,
    "degree": "B.Sc. in Computer Science & Engineering",
    "currentCgpa": null,
    "isCgpaVerified": false,
    "company": "Chaldal Limited",
    "designation": "Full-Stack Software Engineer",
    "skills": [
      "TypeScript",
      "React",
      "F#",
      ".NET",
      "PostgreSQL",
      "Tailwind CSS"
    ],
    "interests": [
      "Functional Programming",
      "Supply Chain Optimization",
      "UI Engineering"
    ],
    "projects": null,
    "experience": null,
    "linkedinUrl": "https://linkedin.com/in/alamin-hossain-chaldal",
    "githubUrl": "https://github.com/alamin-chaldal",
    "websiteUrl": null,
    "phone": null,
    "showEmail": true,
    "isOnboarded": true,
    "createdAt": "2026-11-09T08:13:50.200Z",
    "updatedAt": "2026-11-14T15:25:44.936Z"
  },
  {
    "id": "cmw8zingt001tidr7l5cjzxjf",
    "userId": "cmw8zinfb001sidr756wc25l0",
    "headline": "Senior Software Engineer at Optimizely | JnU SWE '21 | High-Scale Telemetry",
    "bio": "Working on real-time event streaming systems processing billions of daily events with Go, gRPC, and Apache Kafka. Ready to mentor and refer juniors.",
    "department": "Software Engineering",
    "studentId": "B170306003",
    "academicYear": null,
    "graduationYear": 2021,
    "degree": "B.Sc. in Software Engineering",
    "currentCgpa": null,
    "isCgpaVerified": false,
    "company": "Optimizely Bangladesh",
    "designation": "Senior Software Engineer",
    "skills": [
      "Go",
      "Distributed Systems",
      "Docker",
      "gRPC",
      "PostgreSQL",
      "Kafka"
    ],
    "interests": [
      "System Design",
      "Cloud Infrastructure",
      "Mentorship"
    ],
    "projects": null,
    "experience": null,
    "linkedinUrl": "https://linkedin.com/in/sayed-mahmud-optimizely",
    "githubUrl": "https://github.com/sayed-optimizely",
    "websiteUrl": null,
    "phone": null,
    "showEmail": true,
    "isOnboarded": true,
    "createdAt": "2026-11-09T08:13:51.053Z",
    "updatedAt": "2026-11-14T15:25:45.160Z"
  },
  {
    "id": "cmwgk4r6a001h6pr7j57oubd6",
    "userId": "cmwgk4r1r001f6pr7586h1bzs",
    "headline": "Associate Professor & Undergraduate Director @ Dept of CSE, JnU",
    "bio": "20+ years of academic research and industry consulting in computer networks and software architecture. Faculty advisor for ACM Student Chapter.",
    "department": "Computer Science & Engineering",
    "studentId": "FAC-CSE-004",
    "academicYear": null,
    "graduationYear": 2004,
    "degree": "Ph.D. in Computer Science",
    "currentCgpa": null,
    "isCgpaVerified": false,
    "company": "Jagannath University",
    "designation": "Associate Professor & Undergraduate Director",
    "skills": [
      "Academic Mentoring",
      "Computer Networks",
      "Curriculum Development",
      "Software Architecture"
    ],
    "interests": [
      "Research Fellowships",
      "Industry-Academia Collaboration",
      "Student Innovation"
    ],
    "projects": null,
    "experience": null,
    "linkedinUrl": null,
    "githubUrl": null,
    "websiteUrl": null,
    "phone": null,
    "showEmail": true,
    "isOnboarded": true,
    "createdAt": "2026-11-14T15:25:17.842Z",
    "updatedAt": "2026-11-14T15:25:45.871Z"
  },
  {
    "id": "cmwg011et000008l6t3dbcv0j",
    "userId": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "headline": "Competitive Programmer & Full-Stack Developer | JnU CSE '26",
    "bio": "Undergrad at Jagannath University passionate about distributed systems, Next.js, and TypeScript. Active problem solver with 500+ problems on Codeforces & LeetCode.",
    "department": "Computer Science & Engineering",
    "studentId": "B220305009",
    "academicYear": "3rd Year / Junior",
    "graduationYear": 2026,
    "degree": "B.Sc. in Computer Science & Engineering",
    "currentCgpa": 3.84,
    "isCgpaVerified": true,
    "company": null,
    "designation": null,
    "skills": [
      "TypeScript",
      "Next.js",
      "React",
      "Node.js",
      "PostgreSQL",
      "C++",
      "Docker"
    ],
    "interests": [
      "Competitive Programming",
      "Cloud Systems",
      "Web Performance"
    ],
    "projects": null,
    "experience": null,
    "linkedinUrl": "https://linkedin.com/in/sajib-hasan-jnu",
    "githubUrl": "https://github.com/sooooojib",
    "websiteUrl": null,
    "phone": null,
    "showEmail": true,
    "isOnboarded": true,
    "createdAt": "2026-11-14T06:02:32.165Z",
    "updatedAt": "2026-11-14T15:25:42.009Z"
  },
  {
    "id": "cmw98bs0l000008k18oopr4rz",
    "userId": "9eX2XFGRfXneGZFXb37Qdpo0RhAPWzSx",
    "headline": null,
    "bio": null,
    "department": "Computer Science & Engineering",
    "studentId": "B220305010",
    "academicYear": null,
    "graduationYear": null,
    "degree": "Degree in Computer Science & Engineering",
    "currentCgpa": null,
    "isCgpaVerified": false,
    "company": null,
    "designation": null,
    "skills": [],
    "interests": [],
    "projects": null,
    "experience": null,
    "linkedinUrl": null,
    "githubUrl": null,
    "websiteUrl": null,
    "phone": null,
    "showEmail": false,
    "isOnboarded": true,
    "createdAt": "2026-11-09T12:20:26.901Z",
    "updatedAt": "2026-11-09T13:15:15.972Z"
  },
  {
    "id": "cmw94jagr000007jwfommu3kq",
    "userId": "lnCXe6mNhDbNA5kcNrPRCHyIrxn2BLTH",
    "headline": null,
    "bio": null,
    "department": "Computer Science & Engineering",
    "studentId": "B220305011",
    "academicYear": null,
    "graduationYear": null,
    "degree": "Degree in Computer Science & Engineering",
    "currentCgpa": null,
    "isCgpaVerified": false,
    "company": null,
    "designation": null,
    "skills": [],
    "interests": [],
    "projects": null,
    "experience": null,
    "linkedinUrl": null,
    "githubUrl": null,
    "websiteUrl": null,
    "phone": null,
    "showEmail": false,
    "isOnboarded": true,
    "createdAt": "2026-11-09T10:34:18.939Z",
    "updatedAt": "2026-11-09T13:15:24.246Z"
  }
]
```

---

## `departments`

* **Domain:** People and login
* **Description:** Academic departments and faculties
* **Total Rows:** 16

```json
[
  {
    "id": "cmw31ymy40000snr7uxo83i7a",
    "code": "CSE",
    "name": "Computer Science & Engineering",
    "faculty": "Faculty of Science",
    "createdAt": "2026-11-05T04:35:39.052Z",
    "updatedAt": "2026-11-14T15:25:40.918Z"
  },
  {
    "id": "cmw31yncx0002snr7x4yh8fu5",
    "code": "SWE",
    "name": "Software Engineering",
    "faculty": "Faculty of Science",
    "createdAt": "2026-11-05T04:35:39.585Z",
    "updatedAt": "2026-11-14T15:25:40.974Z"
  },
  {
    "id": "cmw31ynbg0001snr7lr61pe2w",
    "code": "EEE",
    "name": "Electrical & Electronic Engineering",
    "faculty": "Faculty of Science",
    "createdAt": "2026-11-05T04:35:39.532Z",
    "updatedAt": "2026-11-14T15:25:41.029Z"
  },
  {
    "id": "cmw31ynfx0004snr7bj2gh8pu",
    "code": "STAT",
    "name": "Statistics",
    "faculty": "Faculty of Science",
    "createdAt": "2026-11-05T04:35:39.693Z",
    "updatedAt": "2026-11-14T15:25:41.083Z"
  },
  {
    "id": "cmw31ynef0003snr78rz0mvck",
    "code": "MATH",
    "name": "Mathematics",
    "faculty": "Faculty of Science",
    "createdAt": "2026-11-05T04:35:39.639Z",
    "updatedAt": "2026-11-14T15:25:41.137Z"
  },
  {
    "id": "cmw31ynhf0005snr7k0cef0u4",
    "code": "PHY",
    "name": "Physics",
    "faculty": "Faculty of Science",
    "createdAt": "2026-11-05T04:35:39.747Z",
    "updatedAt": "2026-11-14T15:25:41.193Z"
  },
  {
    "id": "cmw31ynj20006snr7pmhzm67x",
    "code": "CHEM",
    "name": "Chemistry",
    "faculty": "Faculty of Science",
    "createdAt": "2026-11-05T04:35:39.806Z",
    "updatedAt": "2026-11-14T15:25:41.251Z"
  },
  {
    "id": "cmw31ynkk0007snr73un4xii6",
    "code": "BBA-FIN",
    "name": "Finance & Banking",
    "faculty": "Faculty of Business Studies",
    "createdAt": "2026-11-05T04:35:39.860Z",
    "updatedAt": "2026-11-14T15:25:41.308Z"
  },
  {
    "id": "cmw31ynm30008snr75rt2n20i",
    "code": "BBA-MKT",
    "name": "Marketing",
    "faculty": "Faculty of Business Studies",
    "createdAt": "2026-11-05T04:35:39.915Z",
    "updatedAt": "2026-11-14T15:25:41.365Z"
  },
  {
    "id": "cmw31ynnm0009snr7h3qxausq",
    "code": "BBA-AIS",
    "name": "Accounting & Information Systems",
    "faculty": "Faculty of Business Studies",
    "createdAt": "2026-11-05T04:35:39.970Z",
    "updatedAt": "2026-11-14T15:25:41.422Z"
  },
  {
    "id": "cmw31ynp5000asnr7vf8fvntu",
    "code": "BBA-MGT",
    "name": "Management Studies",
    "faculty": "Faculty of Business Studies",
    "createdAt": "2026-11-05T04:35:40.025Z",
    "updatedAt": "2026-11-14T15:25:41.478Z"
  },
  {
    "id": "cmw31ynqs000bsnr74j7ddirv",
    "code": "ENG",
    "name": "English Language & Literature",
    "faculty": "Faculty of Arts",
    "createdAt": "2026-11-05T04:35:40.084Z",
    "updatedAt": "2026-11-14T15:25:41.533Z"
  },
  {
    "id": "cmw31ynsb000csnr7af2nfwl2",
    "code": "LAW",
    "name": "Law & Justice",
    "faculty": "Faculty of Law",
    "createdAt": "2026-11-05T04:35:40.139Z",
    "updatedAt": "2026-11-14T15:25:41.589Z"
  },
  {
    "id": "cmw31ynvx000dsnr7f5107e7b",
    "code": "ECON",
    "name": "Economics",
    "faculty": "Faculty of Social Sciences",
    "createdAt": "2026-11-05T04:35:40.269Z",
    "updatedAt": "2026-11-14T15:25:41.643Z"
  },
  {
    "id": "cmw31ynyc000esnr7yzzmm30q",
    "code": "PHR",
    "name": "Pharmacy",
    "faculty": "Faculty of Life & Earth Sciences",
    "createdAt": "2026-11-05T04:35:40.356Z",
    "updatedAt": "2026-11-14T15:25:41.699Z"
  },
  {
    "id": "cmw31yo1k000fsnr7drytrhlz",
    "code": "MIC",
    "name": "Microbiology",
    "faculty": "Faculty of Life & Earth Sciences",
    "createdAt": "2026-11-05T04:35:40.472Z",
    "updatedAt": "2026-11-14T15:25:41.755Z"
  }
]
```

---

## `skills`

* **Domain:** People and login
* **Description:** Categorized skills taxonomy
* **Total Rows:** 92

```json
[
  {
    "id": "cmw370aci0003ctr7pkhu51wb",
    "name": "React_1793861812960",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-05T06:56:54.114Z",
    "updatedAt": "2026-11-05T06:56:54.114Z"
  },
  {
    "id": "cmw370bhf0007ctr7bx28k77c",
    "name": "PostgreSQL_1793861812960",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-05T06:56:55.587Z",
    "updatedAt": "2026-11-05T06:56:55.587Z"
  },
  {
    "id": "cmw371dzg0003f3r7q5z15wu2",
    "name": "React_1793861864341",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-05T06:57:45.484Z",
    "updatedAt": "2026-11-05T06:57:45.484Z"
  },
  {
    "id": "cmw371f390007f3r7tw5fzgu1",
    "name": "PostgreSQL_1793861864341",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-05T06:57:46.917Z",
    "updatedAt": "2026-11-05T06:57:46.917Z"
  },
  {
    "id": "cmw3720700003hhr7ro0pi4p7",
    "name": "React_1793861893168",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-05T06:58:14.268Z",
    "updatedAt": "2026-11-05T06:58:14.268Z"
  },
  {
    "id": "cmw3721az0007hhr7c08u4j1g",
    "name": "PostgreSQL_1793861893168",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-05T06:58:15.707Z",
    "updatedAt": "2026-11-05T06:58:15.707Z"
  },
  {
    "id": "cmw372u660003kkr783ccfze1",
    "name": "React_1793861931959",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-05T06:58:53.118Z",
    "updatedAt": "2026-11-05T06:58:53.118Z"
  },
  {
    "id": "cmw372v9l0007kkr7826cpdt0",
    "name": "PostgreSQL_1793861931959",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-05T06:58:54.537Z",
    "updatedAt": "2026-11-05T06:58:54.537Z"
  },
  {
    "id": "cmw373i4e0003mfr7b4xqrk42",
    "name": "React_1793861962999",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-05T06:59:24.158Z",
    "updatedAt": "2026-11-05T06:59:24.158Z"
  },
  {
    "id": "cmw373jbt0007mfr74rar2w0p",
    "name": "PostgreSQL_1793861962999",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-05T06:59:25.721Z",
    "updatedAt": "2026-11-05T06:59:25.721Z"
  },
  {
    "id": "cmw374akc0003ovr76zwkvh8l",
    "name": "React_1793861999960",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-05T07:00:01.020Z",
    "updatedAt": "2026-11-05T07:00:01.020Z"
  },
  {
    "id": "cmw374bpz0007ovr7r61j7v9u",
    "name": "PostgreSQL_1793861999960",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-05T07:00:02.519Z",
    "updatedAt": "2026-11-05T07:00:02.519Z"
  },
  {
    "id": "cmw38hr3000036wr7hmgkl4f8",
    "name": "React_1793864307522",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-05T07:38:28.572Z",
    "updatedAt": "2026-11-05T07:38:28.572Z"
  },
  {
    "id": "cmw38hs6m00076wr71mxc5l7t",
    "name": "PostgreSQL_1793864307522",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-05T07:38:29.998Z",
    "updatedAt": "2026-11-05T07:38:29.998Z"
  },
  {
    "id": "cmw38kzyz0003g9r7ycsh43dy",
    "name": "React_1793864458986",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-05T07:41:00.059Z",
    "updatedAt": "2026-11-05T07:41:00.059Z"
  },
  {
    "id": "cmw38l1410007g9r79yzsb3rl",
    "name": "PostgreSQL_1793864458986",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-05T07:41:01.537Z",
    "updatedAt": "2026-11-05T07:41:01.537Z"
  },
  {
    "id": "cmw38p82k0003r8r7uzky2551",
    "name": "React_1793864656108",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-05T07:44:17.180Z",
    "updatedAt": "2026-11-05T07:44:17.180Z"
  },
  {
    "id": "cmw38p97k0007r8r72keqpct4",
    "name": "PostgreSQL_1793864656108",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-05T07:44:18.656Z",
    "updatedAt": "2026-11-05T07:44:18.656Z"
  },
  {
    "id": "cmw39qhyo0003gxr7t78u33d8",
    "name": "React_1793866395203",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-05T08:13:16.272Z",
    "updatedAt": "2026-11-05T08:13:16.272Z"
  },
  {
    "id": "cmw39qj7z0007gxr70j28gec7",
    "name": "PostgreSQL_1793866395203",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-05T08:13:17.903Z",
    "updatedAt": "2026-11-05T08:13:17.903Z"
  },
  {
    "id": "cmw3av8150003aur7ulln532b",
    "name": "React_1793868294326",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-05T08:44:56.297Z",
    "updatedAt": "2026-11-05T08:44:56.297Z"
  },
  {
    "id": "cmw3ava530007aur7w361xofl",
    "name": "PostgreSQL_1793868294326",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-05T08:44:59.031Z",
    "updatedAt": "2026-11-05T08:44:59.031Z"
  },
  {
    "id": "cmw3c63b90003b2r7iivxfxh5",
    "name": "React_1793870481865",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-05T09:21:23.013Z",
    "updatedAt": "2026-11-05T09:21:23.013Z"
  },
  {
    "id": "cmw3c64fv0007b2r7qn44fd11",
    "name": "PostgreSQL_1793870481865",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-05T09:21:24.475Z",
    "updatedAt": "2026-11-05T09:21:24.475Z"
  },
  {
    "id": "cmw3cpcrl0003sxr7ri062vjx",
    "name": "React_1793871380625",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-05T09:36:21.729Z",
    "updatedAt": "2026-11-05T09:36:21.729Z"
  },
  {
    "id": "cmw3cpdv80007sxr7cqy3s4p9",
    "name": "PostgreSQL_1793871380625",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-05T09:36:23.156Z",
    "updatedAt": "2026-11-05T09:36:23.156Z"
  },
  {
    "id": "cmw3cy7mj0003pyr7byiuirjr",
    "name": "React_1793871793885",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-05T09:43:14.971Z",
    "updatedAt": "2026-11-05T09:43:14.971Z"
  },
  {
    "id": "cmw3cy8vy0007pyr7oda7vvwn",
    "name": "PostgreSQL_1793871793885",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-05T09:43:16.606Z",
    "updatedAt": "2026-11-05T09:43:16.606Z"
  },
  {
    "id": "cmw3e0orm0003blr7aqqgdj95",
    "name": "React_1793873588899",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-05T10:13:10.114Z",
    "updatedAt": "2026-11-05T10:13:10.114Z"
  },
  {
    "id": "cmw3e0pwi0007blr7c7a5i4zb",
    "name": "PostgreSQL_1793873588899",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-05T10:13:11.586Z",
    "updatedAt": "2026-11-05T10:13:11.586Z"
  },
  {
    "id": "cmw6q5x5l0003uer73i2w7m3r",
    "name": "React_1794075387082",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-07T18:16:28.185Z",
    "updatedAt": "2026-11-07T18:16:28.185Z"
  },
  {
    "id": "cmw6q5yb00007uer7urk73kp2",
    "name": "PostgreSQL_1794075387082",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-07T18:16:29.676Z",
    "updatedAt": "2026-11-07T18:16:29.676Z"
  },
  {
    "id": "cmw6q95uw00034or71xioy7ti",
    "name": "React_1794075538376",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-07T18:18:59.432Z",
    "updatedAt": "2026-11-07T18:18:59.432Z"
  },
  {
    "id": "cmw6q96z300074or7ypc7pm0f",
    "name": "PostgreSQL_1794075538376",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-07T18:19:00.879Z",
    "updatedAt": "2026-11-07T18:19:00.879Z"
  },
  {
    "id": "cmw6qb2450003b9r7b1ejw78x",
    "name": "React_1794075626837",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-07T18:20:27.893Z",
    "updatedAt": "2026-11-07T18:20:27.893Z"
  },
  {
    "id": "cmw6qb3820007b9r779mlfnl9",
    "name": "PostgreSQL_1794075626837",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-07T18:20:29.330Z",
    "updatedAt": "2026-11-07T18:20:29.330Z"
  },
  {
    "id": "cmw6qezgd0003pcr7bfctr086",
    "name": "React_1794075809969",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-07T18:23:31.069Z",
    "updatedAt": "2026-11-07T18:23:31.069Z"
  },
  {
    "id": "cmw6qf0li0007pcr7yo65hzj1",
    "name": "PostgreSQL_1794075809969",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-07T18:23:32.551Z",
    "updatedAt": "2026-11-07T18:23:32.551Z"
  },
  {
    "id": "cmw6ry1bk0003udr74uhlosq2",
    "name": "React_1794078378464",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-07T19:06:19.568Z",
    "updatedAt": "2026-11-07T19:06:19.568Z"
  },
  {
    "id": "cmw6ry2fe0007udr7gdxfc8hk",
    "name": "PostgreSQL_1794078378464",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-07T19:06:21.002Z",
    "updatedAt": "2026-11-07T19:06:21.002Z"
  },
  {
    "id": "cmw6t2uue0003t2r7lrs3vzb1",
    "name": "React_1794080282980",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-07T19:38:04.070Z",
    "updatedAt": "2026-11-07T19:38:04.070Z"
  },
  {
    "id": "cmw6t2vxw0007t2r7o3b8qc3m",
    "name": "PostgreSQL_1794080282980",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-07T19:38:05.493Z",
    "updatedAt": "2026-11-07T19:38:05.493Z"
  },
  {
    "id": "cmw7gmxy40003r6r7p5tuseq8",
    "name": "React_1794119851260",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-08T06:37:32.380Z",
    "updatedAt": "2026-11-08T06:37:32.380Z"
  },
  {
    "id": "cmw7gmz3p0007r6r7h52348d6",
    "name": "PostgreSQL_1794119851260",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-08T06:37:33.877Z",
    "updatedAt": "2026-11-08T06:37:33.877Z"
  },
  {
    "id": "cmw7h6u4g0003njr7rquelgei",
    "name": "React_1794120779390",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-08T06:53:00.544Z",
    "updatedAt": "2026-11-08T06:53:00.544Z"
  },
  {
    "id": "cmw7h6v9m0007njr7td3jfb7x",
    "name": "PostgreSQL_1794120779390",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-08T06:53:02.026Z",
    "updatedAt": "2026-11-08T06:53:02.026Z"
  },
  {
    "id": "cmw7hq6ee00033qr7gucx0br1",
    "name": "React_1794121681828",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-08T07:08:02.918Z",
    "updatedAt": "2026-11-08T07:08:02.918Z"
  },
  {
    "id": "cmw7hq7io00073qr7t3tyyffz",
    "name": "PostgreSQL_1794121681828",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-08T07:08:04.368Z",
    "updatedAt": "2026-11-08T07:08:04.368Z"
  },
  {
    "id": "cmw7hzosz0003ohr70vegl3cu",
    "name": "React_1794122125565",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-08T07:15:26.675Z",
    "updatedAt": "2026-11-08T07:15:26.675Z"
  },
  {
    "id": "cmw7hzpyj0007ohr7d89d8tkn",
    "name": "PostgreSQL_1794122125565",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-08T07:15:28.171Z",
    "updatedAt": "2026-11-08T07:15:28.171Z"
  },
  {
    "id": "cmw7jypdo0003zcr7x0bxu5dv",
    "name": "React_1794125438844",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-08T08:10:39.996Z",
    "updatedAt": "2026-11-08T08:10:39.996Z"
  },
  {
    "id": "cmw7jyqmn0007zcr7qj9w1gtr",
    "name": "PostgreSQL_1794125438844",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-08T08:10:41.615Z",
    "updatedAt": "2026-11-08T08:10:41.615Z"
  },
  {
    "id": "cmw7lbiiu0003ier7062r6o2t",
    "name": "React_1794127716129",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-08T08:48:37.254Z",
    "updatedAt": "2026-11-08T08:48:37.254Z"
  },
  {
    "id": "cmw7lbjmy0007ier7ew3xg8tp",
    "name": "PostgreSQL_1794127716129",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-08T08:48:38.698Z",
    "updatedAt": "2026-11-08T08:48:38.698Z"
  },
  {
    "id": "cmw7m365u0003tlr7010rjp6c",
    "name": "React_1794129006445",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-08T09:10:07.602Z",
    "updatedAt": "2026-11-08T09:10:07.602Z"
  },
  {
    "id": "cmw7m37a80007tlr7wchnudvu",
    "name": "PostgreSQL_1794129006445",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-08T09:10:09.056Z",
    "updatedAt": "2026-11-08T09:10:09.056Z"
  },
  {
    "id": "cmw7y0h7e0003cer72v64dd2g",
    "name": "React_1794149036244",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-08T14:43:57.338Z",
    "updatedAt": "2026-11-08T14:43:57.338Z"
  },
  {
    "id": "cmw7y0ic10007cer7kp19tjap",
    "name": "PostgreSQL_1794149036244",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-08T14:43:58.801Z",
    "updatedAt": "2026-11-08T14:43:58.801Z"
  },
  {
    "id": "cmw7y4b4t0003lmr7nbhssk08",
    "name": "React_1794149214955",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-08T14:46:56.093Z",
    "updatedAt": "2026-11-08T14:46:56.093Z"
  },
  {
    "id": "cmw7y4cao0007lmr7xem0ypbu",
    "name": "PostgreSQL_1794149214955",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-08T14:46:57.600Z",
    "updatedAt": "2026-11-08T14:46:57.600Z"
  },
  {
    "id": "cmw7zpcrl0003wdr79l2szxk4",
    "name": "React_1794151876508",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-08T15:31:17.601Z",
    "updatedAt": "2026-11-08T15:31:17.601Z"
  },
  {
    "id": "cmw7zpdwi0007wdr7eaqg64zw",
    "name": "PostgreSQL_1794151876508",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-08T15:31:19.074Z",
    "updatedAt": "2026-11-08T15:31:19.074Z"
  },
  {
    "id": "cmw81em2t0003vfr7vh2inb25",
    "name": "React_1794154734628",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-08T16:18:55.685Z",
    "updatedAt": "2026-11-08T16:18:55.685Z"
  },
  {
    "id": "cmw81en700007vfr7uqelndij",
    "name": "PostgreSQL_1794154734628",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-08T16:18:57.132Z",
    "updatedAt": "2026-11-08T16:18:57.132Z"
  },
  {
    "id": "cmw86802o00030vr730902kg9",
    "name": "React_1794162824215",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-08T18:33:45.312Z",
    "updatedAt": "2026-11-08T18:33:45.312Z"
  },
  {
    "id": "cmw86817c00070vr7mooqbtpm",
    "name": "PostgreSQL_1794162824215",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-08T18:33:46.776Z",
    "updatedAt": "2026-11-08T18:33:46.776Z"
  },
  {
    "id": "cmw8vqsnk00034dr7thgj3bwz",
    "name": "React_1794205691460",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-09T06:28:12.560Z",
    "updatedAt": "2026-11-09T06:28:12.560Z"
  },
  {
    "id": "cmw8vqttq00074dr7k3pr8pea",
    "name": "PostgreSQL_1794205691460",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-09T06:28:14.078Z",
    "updatedAt": "2026-11-09T06:28:14.078Z"
  },
  {
    "id": "cmw8y7pou00031fr7qenw7jy8",
    "name": "React_1794209840006",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-09T07:37:21.102Z",
    "updatedAt": "2026-11-09T07:37:21.102Z"
  },
  {
    "id": "cmw8y7quh00071fr7zvs30lxo",
    "name": "PostgreSQL_1794209840006",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-09T07:37:22.601Z",
    "updatedAt": "2026-11-09T07:37:22.601Z"
  },
  {
    "id": "cmw90p6ef0003mdr7yvv72fb7",
    "name": "React_1794214013995",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-09T08:46:55.143Z",
    "updatedAt": "2026-11-09T08:46:55.143Z"
  },
  {
    "id": "cmw90p7k60007mdr71atb0lef",
    "name": "PostgreSQL_1794214013995",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-09T08:46:56.646Z",
    "updatedAt": "2026-11-09T08:46:56.646Z"
  },
  {
    "id": "cmw91ajnr00030xr7xu9zvvg4",
    "name": "React_1794215010843",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-09T09:03:32.103Z",
    "updatedAt": "2026-11-09T09:03:32.103Z"
  },
  {
    "id": "cmw91aks400070xr7nohe13is",
    "name": "PostgreSQL_1794215010843",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-09T09:03:33.556Z",
    "updatedAt": "2026-11-09T09:03:33.556Z"
  },
  {
    "id": "cmw9265yj0003q9r7z6o3t2g4",
    "name": "React_1794216486295",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-09T09:28:07.339Z",
    "updatedAt": "2026-11-09T09:28:07.339Z"
  },
  {
    "id": "cmw9266kk0006q9r7wgud7n7o",
    "name": "PostgreSQL_1794216486295",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-09T09:28:08.132Z",
    "updatedAt": "2026-11-09T09:28:08.132Z"
  },
  {
    "id": "cmw93e97o00034cr76m0boec0",
    "name": "React_1794218543306",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-09T10:02:24.420Z",
    "updatedAt": "2026-11-09T10:02:24.420Z"
  },
  {
    "id": "cmw93e9u400064cr79povtsyh",
    "name": "PostgreSQL_1794218543306",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-09T10:02:25.228Z",
    "updatedAt": "2026-11-09T10:02:25.228Z"
  },
  {
    "id": "cmw9e0iw60003yhr7maj3adu7",
    "name": "React_1794236378446",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-09T14:59:39.558Z",
    "updatedAt": "2026-11-09T14:59:39.558Z"
  },
  {
    "id": "cmw9e0jjh0006yhr7dgref694",
    "name": "PostgreSQL_1794236378446",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-09T14:59:40.397Z",
    "updatedAt": "2026-11-09T14:59:40.397Z"
  },
  {
    "id": "cmw9g2cws0003y4r7kw578u1t",
    "name": "React_1794239823222",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-09T15:57:04.348Z",
    "updatedAt": "2026-11-09T15:57:04.348Z"
  },
  {
    "id": "cmw9g2dk80006y4r7zj62mk5m",
    "name": "PostgreSQL_1794239823222",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-09T15:57:05.192Z",
    "updatedAt": "2026-11-09T15:57:05.192Z"
  },
  {
    "id": "cmwawv3eb000375r7qude9jo3",
    "name": "React_1794328503947",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-10T16:35:05.075Z",
    "updatedAt": "2026-11-10T16:35:05.075Z"
  },
  {
    "id": "cmwawv41y000675r7rbxizb4b",
    "name": "PostgreSQL_1794328503947",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-10T16:35:05.926Z",
    "updatedAt": "2026-11-10T16:35:05.926Z"
  },
  {
    "id": "cmwfbhz1m0003vor71sxjpjap",
    "name": "React_1794594950772",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-13T18:35:51.850Z",
    "updatedAt": "2026-11-13T18:35:51.850Z"
  },
  {
    "id": "cmwfbhzou0006vor7xqswjzxa",
    "name": "PostgreSQL_1794594950772",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-13T18:35:52.686Z",
    "updatedAt": "2026-11-13T18:35:52.686Z"
  },
  {
    "id": "cmwfdkrxl0003u6r7fqei3mu4",
    "name": "React_1794598440685",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-13T19:34:01.833Z",
    "updatedAt": "2026-11-13T19:34:01.833Z"
  },
  {
    "id": "cmwfdkskm0006u6r7bytbd967",
    "name": "PostgreSQL_1794598440685",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-13T19:34:02.662Z",
    "updatedAt": "2026-11-13T19:34:02.662Z"
  },
  {
    "id": "cmwfzqu5k0003p6r7mymxc7e6",
    "name": "React_1794635675061",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-14T05:54:36.200Z",
    "updatedAt": "2026-11-14T05:54:36.200Z"
  },
  {
    "id": "cmwfzqut40006p6r7wvpxe1c2",
    "name": "PostgreSQL_1794635675061",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-14T05:54:37.048Z",
    "updatedAt": "2026-11-14T05:54:37.048Z"
  },
  {
    "id": "cmwg0z7yo00038lr7aqhvvjyb",
    "name": "React_1794637745792",
    "category": "FRAMEWORK",
    "description": null,
    "createdAt": "2026-11-14T06:29:06.960Z",
    "updatedAt": "2026-11-14T06:29:06.960Z"
  },
  {
    "id": "cmwg0z8mq00068lr7lkj5uhpj",
    "name": "PostgreSQL_1794637745792",
    "category": "DATABASE",
    "description": null,
    "createdAt": "2026-11-14T06:29:07.827Z",
    "updatedAt": "2026-11-14T06:29:07.827Z"
  }
]
```

---

## `academic_records`

* **Domain:** People and login
* **Description:** Semester-by-semester transcripts (1.1, 1.2...)
* **Total Rows:** 23

```json
[
  {
    "id": "cmwkz2dkp0000rer7d2w84g5b",
    "userId": "9eX2XFGRfXneGZFXb37Qdpo0RhAPWzSx",
    "semester": "1.1",
    "gpa": 3.78,
    "credits": 19.5,
    "academicYear": "1st Year",
    "notes": "Structured Programming (C), Discrete Mathematics, Physics",
    "isVerified": true,
    "createdAt": "2026-11-17T17:34:25.849Z",
    "updatedAt": "2026-11-17T17:34:25.849Z"
  },
  {
    "id": "cmwkz2dmo0001rer7brnvgdiz",
    "userId": "9eX2XFGRfXneGZFXb37Qdpo0RhAPWzSx",
    "semester": "1.2",
    "gpa": 3.9,
    "credits": 20,
    "academicYear": "1st Year",
    "notes": "Object Oriented Programming (Java), Data Structures, Digital Logic",
    "isVerified": true,
    "createdAt": "2026-11-17T17:34:25.920Z",
    "updatedAt": "2026-11-17T17:34:25.920Z"
  },
  {
    "id": "cmwkz2do80002rer7x5wb7x86",
    "userId": "9eX2XFGRfXneGZFXb37Qdpo0RhAPWzSx",
    "semester": "2.1",
    "gpa": 3.89,
    "credits": 18.5,
    "academicYear": "2nd Year",
    "notes": "Algorithms, Computer Architecture, Mathematics for CS",
    "isVerified": true,
    "createdAt": "2026-11-17T17:34:25.976Z",
    "updatedAt": "2026-11-17T17:34:25.976Z"
  },
  {
    "id": "cmwkz2dps0003rer7bhm0h7bt",
    "userId": "9eX2XFGRfXneGZFXb37Qdpo0RhAPWzSx",
    "semester": "2.2",
    "gpa": 3.87,
    "credits": 19,
    "academicYear": "2nd Year",
    "notes": "Database Management Systems, Software Engineering, Theory of Computation",
    "isVerified": true,
    "createdAt": "2026-11-17T17:34:26.032Z",
    "updatedAt": "2026-11-17T17:34:26.032Z"
  },
  {
    "id": "cmwkz2drd0004rer7rgk55fel",
    "userId": "9eX2XFGRfXneGZFXb37Qdpo0RhAPWzSx",
    "semester": "3.1",
    "gpa": 3.98,
    "credits": 18,
    "academicYear": "3rd Year",
    "notes": "Operating Systems, Computer Networks, Information Security",
    "isVerified": true,
    "createdAt": "2026-11-17T17:34:26.089Z",
    "updatedAt": "2026-11-17T17:34:26.089Z"
  },
  {
    "id": "cmwkz2dsy0005rer7uj293vcj",
    "userId": "9eX2XFGRfXneGZFXb37Qdpo0RhAPWzSx",
    "semester": "3.2",
    "gpa": 3.84,
    "credits": 19.5,
    "academicYear": "3rd Year",
    "notes": "Artificial Intelligence, Microprocessors & Assembly, Web Technologies",
    "isVerified": true,
    "createdAt": "2026-11-17T17:34:26.146Z",
    "updatedAt": "2026-11-17T17:34:26.146Z"
  },
  {
    "id": "cmwkz2duh0006rer7xunzf8rk",
    "userId": "9eX2XFGRfXneGZFXb37Qdpo0RhAPWzSx",
    "semester": "4.1",
    "gpa": 3.99,
    "credits": 18,
    "academicYear": "4th Year",
    "notes": "Distributed Systems, Machine Learning, Cloud Computing",
    "isVerified": true,
    "createdAt": "2026-11-17T17:34:26.201Z",
    "updatedAt": "2026-11-17T17:34:26.201Z"
  },
  {
    "id": "cmwkz2dw00007rer73zdqiqwo",
    "userId": "9eX2XFGRfXneGZFXb37Qdpo0RhAPWzSx",
    "semester": "4.2",
    "gpa": 3.93,
    "credits": 12,
    "academicYear": "4th Year",
    "notes": "Undergraduate Thesis / Capstone Defense (Dept. of CSE, JnU)",
    "isVerified": true,
    "createdAt": "2026-11-17T17:34:26.257Z",
    "updatedAt": "2026-11-17T17:34:26.257Z"
  },
  {
    "id": "cmwkz2dxl0008rer7njt8mnlp",
    "userId": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "semester": "1.1",
    "gpa": 3.81,
    "credits": 19.5,
    "academicYear": "1st Year",
    "notes": "Structured Programming (C), Discrete Mathematics, Physics",
    "isVerified": true,
    "createdAt": "2026-11-17T17:34:26.313Z",
    "updatedAt": "2026-11-17T17:34:26.313Z"
  },
  {
    "id": "cmwkz2dz60009rer7w3qjl15x",
    "userId": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "semester": "1.2",
    "gpa": 3.93,
    "credits": 20,
    "academicYear": "1st Year",
    "notes": "Object Oriented Programming (Java), Data Structures, Digital Logic",
    "isVerified": true,
    "createdAt": "2026-11-17T17:34:26.370Z",
    "updatedAt": "2026-11-17T17:34:26.370Z"
  },
  {
    "id": "cmwkz2e0p000arer7g55sekyu",
    "userId": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "semester": "2.1",
    "gpa": 3.77,
    "credits": 18.5,
    "academicYear": "2nd Year",
    "notes": "Algorithms, Computer Architecture, Mathematics for CS",
    "isVerified": true,
    "createdAt": "2026-11-17T17:34:26.425Z",
    "updatedAt": "2026-11-17T17:34:26.425Z"
  },
  {
    "id": "cmwkz2e2a000brer7dlfe6po3",
    "userId": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "semester": "2.2",
    "gpa": 3.9,
    "credits": 19,
    "academicYear": "2nd Year",
    "notes": "Database Management Systems, Software Engineering, Theory of Computation",
    "isVerified": true,
    "createdAt": "2026-11-17T17:34:26.482Z",
    "updatedAt": "2026-11-17T17:34:26.482Z"
  },
  {
    "id": "cmwkz2e3t000crer77yvphtm3",
    "userId": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "semester": "3.1",
    "gpa": 3.86,
    "credits": 18,
    "academicYear": "3rd Year",
    "notes": "Operating Systems, Computer Networks, Information Security",
    "isVerified": true,
    "createdAt": "2026-11-17T17:34:26.537Z",
    "updatedAt": "2026-11-17T17:34:26.537Z"
  },
  {
    "id": "cmwkz2e5c000drer71p0axry1",
    "userId": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "semester": "3.2",
    "gpa": 3.87,
    "credits": 19.5,
    "academicYear": "3rd Year",
    "notes": "Artificial Intelligence, Microprocessors & Assembly, Web Technologies",
    "isVerified": true,
    "createdAt": "2026-11-17T17:34:26.592Z",
    "updatedAt": "2026-11-17T17:34:26.592Z"
  },
  {
    "id": "cmwkz2e6v000erer7o433docw",
    "userId": "RIJPFcXMMKdUlnlTRBSMuFZANw97nzSe",
    "semester": "1.1",
    "gpa": 3.84,
    "credits": 19.5,
    "academicYear": "1st Year",
    "notes": "Structured Programming (C), Discrete Mathematics, Physics",
    "isVerified": true,
    "createdAt": "2026-11-17T17:34:26.647Z",
    "updatedAt": "2026-11-17T17:34:26.647Z"
  },
  {
    "id": "cmwkz2e8e000frer7ua1qzs4r",
    "userId": "RIJPFcXMMKdUlnlTRBSMuFZANw97nzSe",
    "semester": "1.2",
    "gpa": 3.96,
    "credits": 20,
    "academicYear": "1st Year",
    "notes": "Object Oriented Programming (Java), Data Structures, Digital Logic",
    "isVerified": true,
    "createdAt": "2026-11-17T17:34:26.702Z",
    "updatedAt": "2026-11-17T17:34:26.702Z"
  },
  {
    "id": "cmwkz2ea0000grer7w65bhlrb",
    "userId": "RIJPFcXMMKdUlnlTRBSMuFZANw97nzSe",
    "semester": "2.1",
    "gpa": 3.8,
    "credits": 18.5,
    "academicYear": "2nd Year",
    "notes": "Algorithms, Computer Architecture, Mathematics for CS",
    "isVerified": true,
    "createdAt": "2026-11-17T17:34:26.760Z",
    "updatedAt": "2026-11-17T17:34:26.760Z"
  },
  {
    "id": "cmwkz2ebj000hrer7erb9pnbw",
    "userId": "RIJPFcXMMKdUlnlTRBSMuFZANw97nzSe",
    "semester": "2.2",
    "gpa": 3.93,
    "credits": 19,
    "academicYear": "2nd Year",
    "notes": "Database Management Systems, Software Engineering, Theory of Computation",
    "isVerified": true,
    "createdAt": "2026-11-17T17:34:26.815Z",
    "updatedAt": "2026-11-17T17:34:26.815Z"
  },
  {
    "id": "cmwkz2ed1000irer7fppin243",
    "userId": "RIJPFcXMMKdUlnlTRBSMuFZANw97nzSe",
    "semester": "3.1",
    "gpa": 3.89,
    "credits": 18,
    "academicYear": "3rd Year",
    "notes": "Operating Systems, Computer Networks, Information Security",
    "isVerified": true,
    "createdAt": "2026-11-17T17:34:26.869Z",
    "updatedAt": "2026-11-17T17:34:26.869Z"
  },
  {
    "id": "cmwkz2eek000jrer725300zrr",
    "userId": "VIbCmTGFv3plionrQgC4QHcQ8VLxIjLg",
    "semester": "1.1",
    "gpa": 3.87,
    "credits": 19.5,
    "academicYear": "1st Year",
    "notes": "Structured Programming (C), Discrete Mathematics, Physics",
    "isVerified": true,
    "createdAt": "2026-11-17T17:34:26.924Z",
    "updatedAt": "2026-11-17T17:34:26.924Z"
  },
  {
    "id": "cmwkz2eg3000krer7fre5yiyj",
    "userId": "VIbCmTGFv3plionrQgC4QHcQ8VLxIjLg",
    "semester": "1.2",
    "gpa": 3.84,
    "credits": 20,
    "academicYear": "1st Year",
    "notes": "Object Oriented Programming (Java), Data Structures, Digital Logic",
    "isVerified": true,
    "createdAt": "2026-11-17T17:34:26.979Z",
    "updatedAt": "2026-11-17T17:34:26.979Z"
  },
  {
    "id": "cmwkz2ejc000lrer7gp3z17bs",
    "userId": "VIbCmTGFv3plionrQgC4QHcQ8VLxIjLg",
    "semester": "2.1",
    "gpa": 3.83,
    "credits": 18.5,
    "academicYear": "2nd Year",
    "notes": "Algorithms, Computer Architecture, Mathematics for CS",
    "isVerified": true,
    "createdAt": "2026-11-17T17:34:27.096Z",
    "updatedAt": "2026-11-17T17:34:27.096Z"
  },
  {
    "id": "cmwkz2eku000mrer7ga2yojvr",
    "userId": "VIbCmTGFv3plionrQgC4QHcQ8VLxIjLg",
    "semester": "2.2",
    "gpa": 3.81,
    "credits": 19,
    "academicYear": "2nd Year",
    "notes": "Database Management Systems, Software Engineering, Theory of Computation",
    "isVerified": true,
    "createdAt": "2026-11-17T17:34:27.150Z",
    "updatedAt": "2026-11-17T17:34:27.150Z"
  }
]
```

---

## `membership_requests`

* **Domain:** People and login
* **Description:** Two-stage verification queue dossiers
* **Total Rows:** 29

```json
[
  {
    "id": "cmw8ziko3000iidr72wsd4bhq",
    "userId": "cmw8zikgj000fidr7huk9whgr",
    "membershipType": "STUDENT",
    "status": "APPROVED",
    "institutionalId": "B220308015",
    "department": "Statistics",
    "academicYear": null,
    "graduationYear": 2026,
    "organization": null,
    "designation": null,
    "workEmail": null,
    "connectionNote": "Verified STUDENT dossier on UniCareer.",
    "proofDetails": null,
    "proofDocumentUrl": null,
    "reviewerId": null,
    "rejectionReason": null,
    "reviewedAt": null,
    "createdAt": "2026-11-09T08:13:47.427Z",
    "updatedAt": "2026-11-09T08:13:47.427Z"
  },
  {
    "id": "cmw8zikx0000midr7qross7zk",
    "userId": "cmw8zikpk000jidr7dmcxnytw",
    "membershipType": "STUDENT",
    "status": "APPROVED",
    "institutionalId": "B230305061",
    "department": "Computer Science & Engineering",
    "academicYear": null,
    "graduationYear": 2027,
    "organization": null,
    "designation": null,
    "workEmail": null,
    "connectionNote": "Verified STUDENT dossier on UniCareer.",
    "proofDetails": null,
    "proofDocumentUrl": null,
    "reviewerId": null,
    "rejectionReason": null,
    "reviewedAt": null,
    "createdAt": "2026-11-09T08:13:47.748Z",
    "updatedAt": "2026-11-09T08:13:47.748Z"
  },
  {
    "id": "cmw8zil5y000qidr7m83p7rya",
    "userId": "cmw8zikyh000nidr7dwp2ckzw",
    "membershipType": "STUDENT",
    "status": "APPROVED",
    "institutionalId": "B210309033",
    "department": "Marketing",
    "academicYear": null,
    "graduationYear": 2025,
    "organization": null,
    "designation": null,
    "workEmail": null,
    "connectionNote": "Verified STUDENT dossier on UniCareer.",
    "proofDetails": null,
    "proofDocumentUrl": null,
    "reviewerId": null,
    "rejectionReason": null,
    "reviewedAt": null,
    "createdAt": "2026-11-09T08:13:48.070Z",
    "updatedAt": "2026-11-09T08:13:48.070Z"
  },
  {
    "id": "cmw8ziles000uidr7z4nkoj6t",
    "userId": "cmw8zil7f000ridr7rz8k2ftx",
    "membershipType": "STUDENT",
    "status": "APPROVED",
    "institutionalId": "B230306019",
    "department": "Software Engineering",
    "academicYear": null,
    "graduationYear": 2027,
    "organization": null,
    "designation": null,
    "workEmail": null,
    "connectionNote": "Verified STUDENT dossier on UniCareer.",
    "proofDetails": null,
    "proofDocumentUrl": null,
    "reviewerId": null,
    "rejectionReason": null,
    "reviewedAt": null,
    "createdAt": "2026-11-09T08:13:48.388Z",
    "updatedAt": "2026-11-09T08:13:48.388Z"
  },
  {
    "id": "cmw8zilno000yidr7kqvwqx7n",
    "userId": "cmw8zilg9000vidr7nzmteig6",
    "membershipType": "ALUMNI",
    "status": "APPROVED",
    "institutionalId": "B170305012",
    "department": "Computer Science & Engineering",
    "academicYear": null,
    "graduationYear": 2021,
    "organization": null,
    "designation": null,
    "workEmail": null,
    "connectionNote": "Verified ALUMNI dossier on UniCareer.",
    "proofDetails": null,
    "proofDocumentUrl": null,
    "reviewerId": null,
    "rejectionReason": null,
    "reviewedAt": null,
    "createdAt": "2026-11-09T08:13:48.708Z",
    "updatedAt": "2026-11-09T08:13:48.708Z"
  },
  {
    "id": "cmw8zilwj0012idr7l34uiteg",
    "userId": "cmw8zilp5000zidr7hfoq6b8j",
    "membershipType": "ALUMNI",
    "status": "APPROVED",
    "institutionalId": "B180305029",
    "department": "Computer Science & Engineering",
    "academicYear": null,
    "graduationYear": 2022,
    "organization": null,
    "designation": null,
    "workEmail": null,
    "connectionNote": "Verified ALUMNI dossier on UniCareer.",
    "proofDetails": null,
    "proofDocumentUrl": null,
    "reviewerId": null,
    "rejectionReason": null,
    "reviewedAt": null,
    "createdAt": "2026-11-09T08:13:49.027Z",
    "updatedAt": "2026-11-09T08:13:49.027Z"
  },
  {
    "id": "cmw8zim5h0016idr7h0vd8u26",
    "userId": "cmw8zily10013idr76p7t5rje",
    "membershipType": "ALUMNI",
    "status": "APPROVED",
    "institutionalId": "B160305008",
    "department": "Computer Science & Engineering",
    "academicYear": null,
    "graduationYear": 2020,
    "organization": null,
    "designation": null,
    "workEmail": null,
    "connectionNote": "Verified ALUMNI dossier on UniCareer.",
    "proofDetails": null,
    "proofDocumentUrl": null,
    "reviewerId": null,
    "rejectionReason": null,
    "reviewedAt": null,
    "createdAt": "2026-11-09T08:13:49.349Z",
    "updatedAt": "2026-11-09T08:13:49.349Z"
  },
  {
    "id": "cmw8zimea001aidr71pov90vf",
    "userId": "cmw8zim6y0017idr7urnpaq8d",
    "membershipType": "ALUMNI",
    "status": "APPROVED",
    "institutionalId": "B170306014",
    "department": "Software Engineering",
    "academicYear": null,
    "graduationYear": 2021,
    "organization": null,
    "designation": null,
    "workEmail": null,
    "connectionNote": "Verified ALUMNI dossier on UniCareer.",
    "proofDetails": null,
    "proofDocumentUrl": null,
    "reviewerId": null,
    "rejectionReason": null,
    "reviewedAt": null,
    "createdAt": "2026-11-09T08:13:49.666Z",
    "updatedAt": "2026-11-09T08:13:49.666Z"
  },
  {
    "id": "cmw8zimn6001eidr7q7e48hb4",
    "userId": "cmw8zimfr001bidr7ny0k72sl",
    "membershipType": "ALUMNI",
    "status": "APPROVED",
    "institutionalId": "B180305041",
    "department": "Computer Science & Engineering",
    "academicYear": null,
    "graduationYear": 2022,
    "organization": null,
    "designation": null,
    "workEmail": null,
    "connectionNote": "Verified ALUMNI dossier on UniCareer.",
    "proofDetails": null,
    "proofDocumentUrl": null,
    "reviewerId": null,
    "rejectionReason": null,
    "reviewedAt": null,
    "createdAt": "2026-11-09T08:13:49.986Z",
    "updatedAt": "2026-11-09T08:13:49.986Z"
  },
  {
    "id": "cmw7lizi5000107l3801w7gx6",
    "userId": "cmw54b6zy0059uar7d57zug0h",
    "membershipType": "STUDENT",
    "status": "APPROVED",
    "institutionalId": "B249873294823",
    "department": "Computer Science & Engineering",
    "academicYear": "3rd Year / Junior",
    "graduationYear": 2027,
    "organization": null,
    "designation": null,
    "workEmail": null,
    "connectionNote": null,
    "proofDetails": "Enrolled student at Department of CSE. Validated via campus registrar roll.",
    "proofDocumentUrl": null,
    "reviewerId": "cmw32x6lo000gx6r7cxbbtlrb",
    "rejectionReason": null,
    "reviewedAt": "2026-11-08T08:56:42.538Z",
    "createdAt": "2026-11-08T08:54:25.853Z",
    "updatedAt": "2026-11-08T08:56:42.546Z"
  },
  {
    "id": "cmw7lmzhc000207jys5a34auh",
    "userId": "cmw54b6zy0059uar7d57zug0h",
    "membershipType": "STUDENT",
    "status": "APPROVED",
    "institutionalId": "B230423049823",
    "department": "Computer Science & Engineering",
    "academicYear": "3rd Year / Junior",
    "graduationYear": 2027,
    "organization": null,
    "designation": null,
    "workEmail": null,
    "connectionNote": null,
    "proofDetails": "Enrolled student at Department of CSE. Validated via campus registrar roll.",
    "proofDocumentUrl": null,
    "reviewerId": "cmw32x6lo000gx6r7cxbbtlrb",
    "rejectionReason": null,
    "reviewedAt": "2026-11-08T08:57:54.297Z",
    "createdAt": "2026-11-08T08:57:32.448Z",
    "updatedAt": "2026-11-08T08:57:54.297Z"
  },
  {
    "id": "cmw8zimw3001iidr7vabx66m0",
    "userId": "cmw8zimoo001fidr7gceqsc6q",
    "membershipType": "ALUMNI",
    "status": "APPROVED",
    "institutionalId": "B190305022",
    "department": "Computer Science & Engineering",
    "academicYear": null,
    "graduationYear": 2023,
    "organization": null,
    "designation": null,
    "workEmail": null,
    "connectionNote": "Verified ALUMNI dossier on UniCareer.",
    "proofDetails": null,
    "proofDocumentUrl": null,
    "reviewerId": null,
    "rejectionReason": null,
    "reviewedAt": null,
    "createdAt": "2026-11-09T08:13:50.307Z",
    "updatedAt": "2026-11-09T08:13:50.307Z"
  },
  {
    "id": "cmw8zin24001lidr7luxa31tv",
    "userId": "cmw8zimxk001jidr7fg35pzjs",
    "membershipType": "STUDENT",
    "status": "PENDING",
    "institutionalId": "B220305033",
    "department": "Computer Science & Engineering",
    "academicYear": "3rd Year / Junior",
    "graduationYear": 2026,
    "organization": null,
    "designation": null,
    "workEmail": null,
    "connectionNote": "Currently enrolled in 5th semester, Department of CSE, Jagannath University.",
    "proofDetails": "JnU Student ID Card scanned and semester fee payment slip attached. Roll: 33.",
    "proofDocumentUrl": null,
    "reviewerId": null,
    "rejectionReason": null,
    "reviewedAt": null,
    "createdAt": "2026-11-09T08:13:50.524Z",
    "updatedAt": "2026-11-09T08:13:50.524Z"
  },
  {
    "id": "cmw8zin7x001oidr70eh9337a",
    "userId": "cmw8zin3k001midr7y6krarlz",
    "membershipType": "STUDENT",
    "status": "PENDING",
    "institutionalId": "B230306012",
    "department": "Software Engineering",
    "academicYear": "2nd Year / Sophomore",
    "graduationYear": 2027,
    "organization": null,
    "designation": null,
    "workEmail": null,
    "connectionNote": "Enrolled in B.Sc. in Software Engineering, Session 2022-23.",
    "proofDetails": "Official Jagannath University RFID Smart Student Identity Card verified by Proctor office.",
    "proofDocumentUrl": null,
    "reviewerId": null,
    "rejectionReason": null,
    "reviewedAt": null,
    "createdAt": "2026-11-09T08:13:50.733Z",
    "updatedAt": "2026-11-09T08:13:50.733Z"
  },
  {
    "id": "cmw8yoq6h000008kzbcn60y6c",
    "userId": "VIbCmTGFv3plionrQgC4QHcQ8VLxIjLg",
    "membershipType": "STUDENT",
    "status": "PENDING",
    "institutionalId": null,
    "department": null,
    "academicYear": null,
    "graduationYear": null,
    "organization": null,
    "designation": null,
    "workEmail": null,
    "connectionNote": "Account email verified. Submitted to Admin Approval Panel for institutional review.",
    "proofDetails": null,
    "proofDocumentUrl": null,
    "reviewerId": null,
    "rejectionReason": null,
    "reviewedAt": null,
    "createdAt": "2026-11-09T07:50:34.889Z",
    "updatedAt": "2026-11-09T07:50:34.889Z"
  },
  {
    "id": "cmw8zijvp0006idr731hz9hc0",
    "userId": "cmw8zijo20003idr7iajyx8sj",
    "membershipType": "STUDENT",
    "status": "APPROVED",
    "institutionalId": "B210305018",
    "department": "Computer Science & Engineering",
    "academicYear": null,
    "graduationYear": 2025,
    "organization": null,
    "designation": null,
    "workEmail": null,
    "connectionNote": "Verified STUDENT dossier on UniCareer.",
    "proofDetails": null,
    "proofDocumentUrl": null,
    "reviewerId": null,
    "rejectionReason": null,
    "reviewedAt": null,
    "createdAt": "2026-11-09T08:13:46.405Z",
    "updatedAt": "2026-11-09T08:13:46.405Z"
  },
  {
    "id": "cmw8zik4z000aidr7dpa6hysb",
    "userId": "cmw8zijx70007idr7jaac04lw",
    "membershipType": "STUDENT",
    "status": "APPROVED",
    "institutionalId": "B220306024",
    "department": "Software Engineering",
    "academicYear": null,
    "graduationYear": 2026,
    "organization": null,
    "designation": null,
    "workEmail": null,
    "connectionNote": "Verified STUDENT dossier on UniCareer.",
    "proofDetails": null,
    "proofDocumentUrl": null,
    "reviewerId": null,
    "rejectionReason": null,
    "reviewedAt": null,
    "createdAt": "2026-11-09T08:13:46.739Z",
    "updatedAt": "2026-11-09T08:13:46.739Z"
  },
  {
    "id": "cmw8zikf0000eidr77c0yfn8q",
    "userId": "cmw8zik6k000bidr7pthsc98t",
    "membershipType": "STUDENT",
    "status": "APPROVED",
    "institutionalId": "B210307042",
    "department": "Electrical & Electronic Engineering",
    "academicYear": null,
    "graduationYear": 2025,
    "organization": null,
    "designation": null,
    "workEmail": null,
    "connectionNote": "Verified STUDENT dossier on UniCareer.",
    "proofDetails": null,
    "proofDocumentUrl": null,
    "reviewerId": null,
    "rejectionReason": null,
    "reviewedAt": null,
    "createdAt": "2026-11-09T08:13:47.100Z",
    "updatedAt": "2026-11-09T08:13:47.100Z"
  },
  {
    "id": "cmw8zinds001ridr7iu2ixr6r",
    "userId": "cmw8zin9e001pidr7i8qdy25s",
    "membershipType": "STUDENT",
    "status": "PENDING",
    "institutionalId": "B210307028",
    "department": "Electrical & Electronic Engineering",
    "academicYear": "4th Year / Senior",
    "graduationYear": 2025,
    "organization": null,
    "designation": null,
    "workEmail": null,
    "connectionNote": "Final year student completing senior design capstone project.",
    "proofDetails": "Semester grade report signed by Department Chairman, Faculty of Science.",
    "proofDocumentUrl": null,
    "reviewerId": null,
    "rejectionReason": null,
    "reviewedAt": null,
    "createdAt": "2026-11-09T08:13:50.944Z",
    "updatedAt": "2026-11-09T08:13:50.944Z"
  },
  {
    "id": "cmw8zinjs001uidr70nvjs79l",
    "userId": "cmw8zinfb001sidr756wc25l0",
    "membershipType": "ALUMNI",
    "status": "PENDING",
    "institutionalId": "B170305044",
    "department": "Computer Science & Engineering",
    "academicYear": null,
    "graduationYear": 2021,
    "organization": "Optimizely Bangladesh",
    "designation": "Senior Software Engineer",
    "workEmail": null,
    "connectionNote": "Alumnus session 2016-17. Offering mentorship and direct referrals for Optimizely engineering roles.",
    "proofDetails": "JnU B.Sc. Degree Certificate Certificate No: JNU-CSE-2021-044 and Optimizely Corporate ID.",
    "proofDocumentUrl": null,
    "reviewerId": null,
    "rejectionReason": null,
    "reviewedAt": null,
    "createdAt": "2026-11-09T08:13:51.160Z",
    "updatedAt": "2026-11-09T08:13:51.160Z"
  },
  {
    "id": "cmw8zinpn001xidr7zq4vbliv",
    "userId": "cmw8zinl9001vidr7tzkkwaqk",
    "membershipType": "STUDENT",
    "status": "PENDING",
    "institutionalId": "B220310007",
    "department": "Pharmacy",
    "academicYear": "3rd Year / Junior",
    "graduationYear": 2026,
    "organization": null,
    "designation": null,
    "workEmail": null,
    "connectionNote": "Seeking pharmaceutical QA/QC internship roles in top domestic firms.",
    "proofDetails": "Clinical trial lab badge and official university registration receipt.",
    "proofDocumentUrl": null,
    "reviewerId": null,
    "rejectionReason": null,
    "reviewedAt": null,
    "createdAt": "2026-11-09T08:13:51.371Z",
    "updatedAt": "2026-11-09T08:13:51.371Z"
  },
  {
    "id": "cmw8zinvl0020idr769zlz811",
    "userId": "cmw8zinr5001yidr7mn8oxw3w",
    "membershipType": "STUDENT",
    "status": "PENDING",
    "institutionalId": "B210309019",
    "department": "Finance & Banking",
    "academicYear": "4th Year / Senior",
    "graduationYear": 2025,
    "organization": null,
    "designation": null,
    "workEmail": null,
    "connectionNote": "Preparing for bank management trainee and fintech quantitative analyst openings.",
    "proofDetails": "Faculty of Business Studies student clearance and seminar registration slip.",
    "proofDocumentUrl": null,
    "reviewerId": null,
    "rejectionReason": null,
    "reviewedAt": null,
    "createdAt": "2026-11-09T08:13:51.585Z",
    "updatedAt": "2026-11-09T08:13:51.585Z"
  },
  {
    "id": "cmw98bsdg000108k1rfgcw2cj",
    "userId": "9eX2XFGRfXneGZFXb37Qdpo0RhAPWzSx",
    "membershipType": "STUDENT",
    "status": "APPROVED",
    "institutionalId": "B220305010",
    "department": "Computer Science & Engineering",
    "academicYear": null,
    "graduationYear": null,
    "organization": null,
    "designation": null,
    "workEmail": null,
    "connectionNote": "Self-registered as STUDENT from Department of Computer Science & Engineering (ID: B220305010). Awaiting verification approval.",
    "proofDetails": null,
    "proofDocumentUrl": null,
    "reviewerId": "cmw32x6lo000gx6r7cxbbtlrb",
    "rejectionReason": null,
    "reviewedAt": "2026-11-09T13:15:15.515Z",
    "createdAt": "2026-11-09T12:20:27.364Z",
    "updatedAt": "2026-11-09T13:15:15.521Z"
  },
  {
    "id": "cmw94jatx000107jwmuva2boc",
    "userId": "lnCXe6mNhDbNA5kcNrPRCHyIrxn2BLTH",
    "membershipType": "STUDENT",
    "status": "APPROVED",
    "institutionalId": "B220305011",
    "department": "Computer Science & Engineering",
    "academicYear": null,
    "graduationYear": null,
    "organization": null,
    "designation": null,
    "workEmail": null,
    "connectionNote": "Self-registered as STUDENT from Department of Computer Science & Engineering (ID: B220305011). Awaiting verification approval.",
    "proofDetails": null,
    "proofDocumentUrl": null,
    "reviewerId": "cmw32x6lo000gx6r7cxbbtlrb",
    "rejectionReason": null,
    "reviewedAt": "2026-11-09T13:15:23.801Z",
    "createdAt": "2026-11-09T10:34:19.413Z",
    "updatedAt": "2026-11-09T13:15:23.801Z"
  },
  {
    "id": "cmw95358n000307jwoa9hz9uu",
    "userId": "l1gQBbGkGyFhqUKNkJFyKAfX7uplfyrM",
    "membershipType": "STUDENT",
    "status": "APPROVED",
    "institutionalId": "B220305005",
    "department": "Computer Science & Engineering",
    "academicYear": null,
    "graduationYear": null,
    "organization": null,
    "designation": null,
    "workEmail": null,
    "connectionNote": "Self-registered as STUDENT from Department of Computer Science & Engineering (ID: B220305005). Awaiting verification approval.",
    "proofDetails": null,
    "proofDocumentUrl": null,
    "reviewerId": "cmw32x6lo000gx6r7cxbbtlrb",
    "rejectionReason": null,
    "reviewedAt": "2026-11-09T13:15:20.093Z",
    "createdAt": "2026-11-09T10:49:45.287Z",
    "updatedAt": "2026-11-09T13:15:20.094Z"
  },
  {
    "id": "cmw908e0q000108jz4swr6hpu",
    "userId": "zw0XJr3KbwTWoM9S18hfFR3WCgilIzLf",
    "membershipType": "STUDENT",
    "status": "APPROVED",
    "institutionalId": "B220305007",
    "department": "Computer Science & Engineering",
    "academicYear": null,
    "graduationYear": null,
    "organization": null,
    "designation": null,
    "workEmail": null,
    "connectionNote": "Self-registered as STUDENT from Department of Computer Science & Engineering (ID: B220305007). Awaiting verification approval.",
    "proofDetails": null,
    "proofDocumentUrl": null,
    "reviewerId": "cmw32x6lo000gx6r7cxbbtlrb",
    "rejectionReason": null,
    "reviewedAt": "2026-11-09T13:14:22.053Z",
    "createdAt": "2026-11-09T08:33:51.866Z",
    "updatedAt": "2026-11-09T13:14:22.055Z"
  },
  {
    "id": "cmwg023w8000008l2vrbu8zxr",
    "userId": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "membershipType": "STUDENT",
    "status": "PENDING",
    "institutionalId": "B220305009",
    "department": "Computer Science & Engineering",
    "academicYear": null,
    "graduationYear": null,
    "organization": null,
    "designation": null,
    "workEmail": null,
    "connectionNote": "Account email verified. Submitted to Admin Approval Panel for institutional review.",
    "proofDetails": null,
    "proofDocumentUrl": null,
    "reviewerId": null,
    "rejectionReason": null,
    "reviewedAt": null,
    "createdAt": "2026-11-14T06:03:22.040Z",
    "updatedAt": "2026-11-14T06:32:55.107Z"
  },
  {
    "id": "cmwgk4r05001e6pr7jjlt3hum",
    "userId": "cmwgk4qsj001b6pr78xfu201h",
    "membershipType": "ALUMNI",
    "status": "APPROVED",
    "institutionalId": "B160309002",
    "department": "Finance & Banking",
    "academicYear": null,
    "graduationYear": 2020,
    "organization": null,
    "designation": null,
    "workEmail": null,
    "connectionNote": "Verified ALUMNI dossier on UniCareer Community.",
    "proofDetails": null,
    "proofDocumentUrl": null,
    "reviewerId": null,
    "rejectionReason": null,
    "reviewedAt": null,
    "createdAt": "2026-11-14T15:25:17.621Z",
    "updatedAt": "2026-11-14T15:25:17.621Z"
  },
  {
    "id": "cmwgk4r9b001i6pr7o3kqai4w",
    "userId": "cmwgk4r1r001f6pr7586h1bzs",
    "membershipType": "ALUMNI",
    "status": "APPROVED",
    "institutionalId": "FAC-CSE-004",
    "department": "Computer Science & Engineering",
    "academicYear": null,
    "graduationYear": 2004,
    "organization": null,
    "designation": null,
    "workEmail": null,
    "connectionNote": "Verified ALUMNI dossier on UniCareer Community.",
    "proofDetails": null,
    "proofDocumentUrl": null,
    "reviewerId": null,
    "rejectionReason": null,
    "reviewedAt": null,
    "createdAt": "2026-11-14T15:25:17.951Z",
    "updatedAt": "2026-11-14T15:25:17.951Z"
  }
]
```

---

## `sessions`

* **Domain:** People and login
* **Description:** Active browser device cookies and tokens
* **Total Rows:** 57

```json
[
  {
    "id": "5a6EUUryQOy6Dz3XlVIMYcVQJyFFOIzU",
    "expiresAt": "2026-11-12T09:57:15.955Z",
    "token": "vCWLNy9CM8eyMGMQufzMvq07rEpAgI2Z",
    "createdAt": "2026-11-05T09:57:15.955Z",
    "updatedAt": "2026-11-05T09:57:15.955Z",
    "ipAddress": "103.151.171.153",
    "userAgent": "curl/8.7.1",
    "userId": "cmw32x6lo000gx6r7cxbbtlrb"
  },
  {
    "id": "5kRTxg9CmDD5S6a80SFsy4ucbngwcHBS",
    "expiresAt": "2026-11-12T09:57:24.920Z",
    "token": "zIGKvOmGM75TPiJ7U4SO9Mqk1YiHzwUk",
    "createdAt": "2026-11-05T09:57:24.921Z",
    "updatedAt": "2026-11-05T09:57:24.921Z",
    "ipAddress": "103.151.171.152",
    "userAgent": "curl/8.7.1",
    "userId": "cmw3bo4ip000j3jr7a4gq18s0"
  },
  {
    "id": "fJ2vcPFu3NIsgbByyn0ZOiNd3auctyFn",
    "expiresAt": "2026-11-10T18:21:32.793Z",
    "token": "rhlXmxO47fOKgBtKE872IV29Jnwxi8ll",
    "createdAt": "2026-11-09T18:21:32.794Z",
    "updatedAt": "2026-11-09T18:21:32.794Z",
    "ipAddress": "103.55.146.25",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36 Edg/157.0.0.0",
    "userId": "cmw32x6lo000gx6r7cxbbtlrb"
  },
  {
    "id": "nlbOFZ7UUbp8g3ZwKJWOLr68uF7LxIFq",
    "expiresAt": "2026-11-12T10:04:24.424Z",
    "token": "xIsRFDo8UQ15FDw9d6ZTgnjaIuN2zstz",
    "createdAt": "2026-11-05T10:04:24.424Z",
    "updatedAt": "2026-11-05T10:04:24.424Z",
    "ipAddress": "103.151.171.153",
    "userAgent": "node",
    "userId": "cmw32x6lo000gx6r7cxbbtlrb"
  },
  {
    "id": "WAYD007RyHIwHwCNA6gs2Pr0YGiRy9Tr",
    "expiresAt": "2026-11-12T10:04:25.518Z",
    "token": "txALxCGcOIRVooPOYaCTcW3Z0CdFCyBc",
    "createdAt": "2026-11-05T10:04:25.518Z",
    "updatedAt": "2026-11-05T10:04:25.518Z",
    "ipAddress": "103.151.171.153",
    "userAgent": "node",
    "userId": "cmw3bo4ip000j3jr7a4gq18s0"
  },
  {
    "id": "yzl3lrEiWLMdhCvHFNejLKd3eEwHmjbI",
    "expiresAt": "2026-11-12T10:04:26.609Z",
    "token": "ghKsHIuNa5bUZkrGBg8rRMv4oz5qsTmu",
    "createdAt": "2026-11-05T10:04:26.609Z",
    "updatedAt": "2026-11-05T10:04:26.609Z",
    "ipAddress": "103.151.171.153",
    "userAgent": "node",
    "userId": "cmw3bo4p1000m3jr79ogndqat"
  },
  {
    "id": "PoQ6C7zSf2ZLVqB4rJ3kcMvzw2Rqlk7j",
    "expiresAt": "2026-11-12T10:04:54.873Z",
    "token": "fVueQl3QSgMI92As95iHyWTwUQTfbNCe",
    "createdAt": "2026-11-05T10:04:54.873Z",
    "updatedAt": "2026-11-05T10:04:54.873Z",
    "ipAddress": "103.151.171.153",
    "userAgent": "node",
    "userId": "cmw3bo4y7000p3jr756dqp21t"
  },
  {
    "id": "RYPijKat0QooUL021HEIdkY530UWMvI4",
    "expiresAt": "2026-11-12T10:04:57.993Z",
    "token": "8cneSi53gFJhOBcp9S4vRvtZGqNrA92u",
    "createdAt": "2026-11-05T10:04:57.993Z",
    "updatedAt": "2026-11-05T10:04:57.993Z",
    "ipAddress": "103.151.171.153",
    "userAgent": "node",
    "userId": "cmw3bo551000s3jr7amz6hxy9"
  },
  {
    "id": "l1ikfOJog99DnoevDsoEdfezbt325k4V",
    "expiresAt": "2026-11-10T05:02:46.434Z",
    "token": "5iikjvSgdavpxLPiXafKvf7jw0yWYyX6",
    "createdAt": "2026-11-09T05:02:46.434Z",
    "updatedAt": "2026-11-09T05:02:46.434Z",
    "ipAddress": "45.248.151.68",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36",
    "userId": "cmw32x6lo000gx6r7cxbbtlrb"
  },
  {
    "id": "CGuiFCVKSVm1Emxt8qkHyDlFSLeOj19G",
    "expiresAt": "2026-11-06T12:03:34.434Z",
    "token": "NW1pg2Jbowu3cpIlfKRUOtYznABnNxwp",
    "createdAt": "2026-11-05T12:03:34.434Z",
    "updatedAt": "2026-11-05T12:03:34.434Z",
    "ipAddress": "45.248.151.70",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36",
    "userId": "cmw3bo4p1000m3jr79ogndqat"
  },
  {
    "id": "rLz5U5l2O3ZiE67IOBcgeGeQxEKxKuCy",
    "expiresAt": "2026-11-07T01:07:10.318Z",
    "token": "ZVZ5whPgWBPXfB2o9Gd6sQfd5bjQVfqa",
    "createdAt": "2026-11-06T01:07:10.319Z",
    "updatedAt": "2026-11-06T01:07:10.319Z",
    "ipAddress": "185.132.134.72",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36",
    "userId": "cmw3bo4y7000p3jr756dqp21t"
  },
  {
    "id": "Jib5YiPmz7Vd5dxjHPTsyo4mAoKnxeai",
    "expiresAt": "2026-11-13T15:07:33.565Z",
    "token": "8obdkoQW39q4oNFyUPTKmwB5Rsql2IIN",
    "createdAt": "2026-11-06T15:07:33.565Z",
    "updatedAt": "2026-11-06T15:07:33.565Z",
    "ipAddress": "103.151.171.153",
    "userAgent": "node",
    "userId": "cmw32x6lo000gx6r7cxbbtlrb"
  },
  {
    "id": "nL56ZDIXfzRNKOSmF1GbhRHTsr7d7fye",
    "expiresAt": "2026-11-13T15:07:34.701Z",
    "token": "4gJ1I0SOSbQVymX97BPq9AThYxa6qXCu",
    "createdAt": "2026-11-06T15:07:34.701Z",
    "updatedAt": "2026-11-06T15:07:34.701Z",
    "ipAddress": "103.151.171.153",
    "userAgent": "node",
    "userId": "cmw3bo4ip000j3jr7a4gq18s0"
  },
  {
    "id": "O3sGRsfGsrN0AbUazhcazh3adQrsFTiT",
    "expiresAt": "2026-11-13T15:07:35.817Z",
    "token": "xZ7xIHmGq45egO2pWf6oFi675KKNB3YQ",
    "createdAt": "2026-11-06T15:07:35.817Z",
    "updatedAt": "2026-11-06T15:07:35.817Z",
    "ipAddress": "103.151.171.153",
    "userAgent": "node",
    "userId": "cmw3bo4p1000m3jr79ogndqat"
  },
  {
    "id": "khw4NvXCqSyJCmE5o5YmzB3EZjMGWg5T",
    "expiresAt": "2026-11-09T07:21:48.886Z",
    "token": "ThzvuuKLDBC0Fk1zUWTWpuJPzgxI3ajz",
    "createdAt": "2026-11-08T07:21:48.886Z",
    "updatedAt": "2026-11-08T07:21:48.886Z",
    "ipAddress": "103.151.171.153",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36",
    "userId": "cmw54b6zy0059uar7d57zug0h"
  },
  {
    "id": "HW72ksctYFzBc2fVJABAtG0hc3aWQX0U",
    "expiresAt": "2026-11-13T15:20:28.996Z",
    "token": "MrhdeVG3uN3siti7agleEqnU0j28Mx4h",
    "createdAt": "2026-11-06T15:20:28.996Z",
    "updatedAt": "2026-11-06T15:20:28.996Z",
    "ipAddress": "103.151.171.154",
    "userAgent": "curl/8.7.1",
    "userId": "cmw32x6lo000gx6r7cxbbtlrb"
  },
  {
    "id": "sbYfLhVVa1NFNdQrWP8m7rFJOJIqB2jK",
    "expiresAt": "2026-11-13T15:20:36.577Z",
    "token": "OaBCcSDTGBmNndQHa03Eki1HrACM8yJz",
    "createdAt": "2026-11-06T15:20:36.578Z",
    "updatedAt": "2026-11-06T15:20:36.578Z",
    "ipAddress": "103.151.171.154",
    "userAgent": "curl/8.7.1",
    "userId": "cmw54b6zy0059uar7d57zug0h"
  },
  {
    "id": "24ywsarbzTKrdOVCAIG8zyKmieacbbrK",
    "expiresAt": "2026-11-07T15:21:06.768Z",
    "token": "zlI3T7WvVdImfmspyZ4l2cxaDACfcA3l",
    "createdAt": "2026-11-06T15:21:06.768Z",
    "updatedAt": "2026-11-06T15:21:06.768Z",
    "ipAddress": "185.185.50.60",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36",
    "userId": "cmw3bo4y7000p3jr756dqp21t"
  },
  {
    "id": "aoAdAS8qbfIy0Ko4B66iXVNf2d0ls4Y8",
    "expiresAt": "2026-11-13T15:22:05.887Z",
    "token": "0GA42Fr6nXRX5N4LB2zuQMfN6gH1zmBS",
    "createdAt": "2026-11-06T15:22:05.887Z",
    "updatedAt": "2026-11-06T15:22:05.887Z",
    "ipAddress": "103.151.171.154",
    "userAgent": "curl/8.7.1",
    "userId": "cmw3bo4ip000j3jr7a4gq18s0"
  },
  {
    "id": "1V5p2hS2wgtEJaXxQpzMDUxV0pn1XMUJ",
    "expiresAt": "2026-11-15T08:25:01.448Z",
    "token": "dsqvBypwdwX6kpYkqVJWAzvnM8sY1NwG",
    "createdAt": "2026-11-08T08:25:01.448Z",
    "updatedAt": "2026-11-08T08:25:01.448Z",
    "ipAddress": "0000:0000:0000:0000:0000:0000:0000:0000",
    "userAgent": "node",
    "userId": "cmw54b6zy0059uar7d57zug0h"
  },
  {
    "id": "Q6bepUFm8cntNAvsRDD8eNrLPvjWIMMY",
    "expiresAt": "2026-11-15T08:25:14.323Z",
    "token": "O3pTzSyxHPQjudvCuW2plV4uHnIltw5w",
    "createdAt": "2026-11-08T08:25:14.323Z",
    "updatedAt": "2026-11-08T08:25:14.323Z",
    "ipAddress": "0000:0000:0000:0000:0000:0000:0000:0000",
    "userAgent": "node",
    "userId": "cmw54b6zy0059uar7d57zug0h"
  },
  {
    "id": "wDjbPjvxMQCA7N4gC8WwlgBcFNvNm0Zx",
    "expiresAt": "2026-11-07T16:09:19.222Z",
    "token": "P1Vr8HkJkvEcUnNUWsUsRXUD7OojxPMX",
    "createdAt": "2026-11-06T16:09:19.222Z",
    "updatedAt": "2026-11-06T16:09:19.222Z",
    "ipAddress": "103.55.146.27",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0",
    "userId": "cmw54b6zy0059uar7d57zug0h"
  },
  {
    "id": "9S7TnpWEkthqThwZ7sPf5jYdqpHeLwqL",
    "expiresAt": "2026-11-12T09:11:18.211Z",
    "token": "tbXSLg0KUPXV31T30sbFXoyws3Y6nbAT",
    "createdAt": "2026-11-05T09:11:18.211Z",
    "updatedAt": "2026-11-05T09:11:18.211Z",
    "ipAddress": "",
    "userAgent": "",
    "userId": "cmw32x6lo000gx6r7cxbbtlrb"
  },
  {
    "id": "pfMUU67UpPIFbWon9BY14Z0c5RuxLebg",
    "expiresAt": "2026-11-12T09:11:42.727Z",
    "token": "ey2OAqWbPv1qthfq66ip63FKRCHfaDOX",
    "createdAt": "2026-11-05T09:11:42.727Z",
    "updatedAt": "2026-11-05T09:11:42.727Z",
    "ipAddress": "",
    "userAgent": "",
    "userId": "cmw3bo4ip000j3jr7a4gq18s0"
  },
  {
    "id": "07tQltvykEqUUuWAwndze1KPMjSs3q6M",
    "expiresAt": "2026-11-07T16:14:10.350Z",
    "token": "w9YIHHsmYvSATHCUTVHgfaksZzNBzE8q",
    "createdAt": "2026-11-06T16:14:10.350Z",
    "updatedAt": "2026-11-06T16:14:10.350Z",
    "ipAddress": "103.132.184.50",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0",
    "userId": "cmw3bo4ip000j3jr7a4gq18s0"
  },
  {
    "id": "CkqptEgPbHLUlRByK0HUfEARYAipCC7M",
    "expiresAt": "2026-11-15T08:25:25.324Z",
    "token": "iBFSz91YR4sncWgYtuzPv8ZECozlWwyD",
    "createdAt": "2026-11-08T08:25:25.324Z",
    "updatedAt": "2026-11-08T08:25:25.324Z",
    "ipAddress": "0000:0000:0000:0000:0000:0000:0000:0000",
    "userAgent": "node",
    "userId": "cmw54b6zy0059uar7d57zug0h"
  },
  {
    "id": "U5E9vQe44jNyyMVVrTRI50myeuEH62Vb",
    "expiresAt": "2026-11-15T08:25:34.197Z",
    "token": "NrcrP9enGn6Huzg4cxgfueLXI8ewaCpI",
    "createdAt": "2026-11-08T08:25:34.197Z",
    "updatedAt": "2026-11-08T08:25:34.197Z",
    "ipAddress": "0000:0000:0000:0000:0000:0000:0000:0000",
    "userAgent": "node",
    "userId": "cmw54b6zy0059uar7d57zug0h"
  },
  {
    "id": "ABMoueyH0IcE3dZqD35ZHd1zcDfLSNwx",
    "expiresAt": "2026-11-12T09:33:27.598Z",
    "token": "r54zRzNSAmyZUsP2qaTzNcLG0deF5XhQ",
    "createdAt": "2026-11-05T09:33:27.598Z",
    "updatedAt": "2026-11-05T09:33:27.598Z",
    "ipAddress": "",
    "userAgent": "",
    "userId": "cmw32x6lo000gx6r7cxbbtlrb"
  },
  {
    "id": "3gAFZ17FAcyWrQN3nOkk6VlHIidjLSSd",
    "expiresAt": "2026-11-12T09:33:51.533Z",
    "token": "PHFTNiA0IRf5CNCjkN7TLWMD4aH2uS9t",
    "createdAt": "2026-11-05T09:33:51.533Z",
    "updatedAt": "2026-11-05T09:33:51.533Z",
    "ipAddress": "",
    "userAgent": "",
    "userId": "cmw32x6lo000gx6r7cxbbtlrb"
  },
  {
    "id": "FlQ7GsPX46ax6nkqTBXM8AVU5tJMsyLs",
    "expiresAt": "2026-11-12T09:34:07.755Z",
    "token": "8l9GBK4koSku3X1bjnqmLxlugGkFhk5C",
    "createdAt": "2026-11-05T09:34:07.755Z",
    "updatedAt": "2026-11-05T09:34:07.755Z",
    "ipAddress": "",
    "userAgent": "",
    "userId": "cmw32x6lo000gx6r7cxbbtlrb"
  },
  {
    "id": "pFaE4SslHt54uLimjb87ygInWrHjSl6F",
    "expiresAt": "2026-11-12T09:35:03.540Z",
    "token": "veWtCvDHs7gj9FCDobCmtb2bjxB7kAP1",
    "createdAt": "2026-11-05T09:35:03.540Z",
    "updatedAt": "2026-11-05T09:35:03.540Z",
    "ipAddress": "",
    "userAgent": "",
    "userId": "cmw32x6lo000gx6r7cxbbtlrb"
  },
  {
    "id": "FseE2AZ6CLZoZFRLZGNj0PKrmfmjCS2g",
    "expiresAt": "2026-11-15T08:29:30.851Z",
    "token": "tZkhmKqjo8oKZEyNQr0njoLmBMAPodvq",
    "createdAt": "2026-11-08T08:29:30.851Z",
    "updatedAt": "2026-11-08T08:29:30.851Z",
    "ipAddress": "0000:0000:0000:0000:0000:0000:0000:0000",
    "userAgent": "node",
    "userId": "cmw54b6zy0059uar7d57zug0h"
  },
  {
    "id": "3NbH7gGQg7KZBMDw0OlJ5PSUEUk8iYSC",
    "expiresAt": "2026-11-15T08:29:41.534Z",
    "token": "QqJTHce9ALrQrbfb7PeOsMzC2iZevpeZ",
    "createdAt": "2026-11-08T08:29:41.534Z",
    "updatedAt": "2026-11-08T08:29:41.534Z",
    "ipAddress": "0000:0000:0000:0000:0000:0000:0000:0000",
    "userAgent": "node",
    "userId": "cmw32x6lo000gx6r7cxbbtlrb"
  },
  {
    "id": "ZXOAnWUiQRfudelVPCFM5QYfUIWP3kxn",
    "expiresAt": "2026-11-15T08:56:21.265Z",
    "token": "qKhEBzfCGDJmHvNHTl8DdweIIkSAdAfW",
    "createdAt": "2026-11-08T08:56:21.265Z",
    "updatedAt": "2026-11-08T08:56:21.265Z",
    "ipAddress": "103.151.171.154",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/27.0.1 Safari/605.1.15",
    "userId": "cmw32x6lo000gx6r7cxbbtlrb"
  },
  {
    "id": "Az2sPYjdCO8ntypglQjrFr9Q9tI2vKfw",
    "expiresAt": "2026-11-09T14:27:27.242Z",
    "token": "er94Zo4HJGeLctcvKwNh6UrNeMJgya4F",
    "createdAt": "2026-11-08T14:27:27.243Z",
    "updatedAt": "2026-11-08T14:27:27.243Z",
    "ipAddress": "103.151.171.153",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:159.0) Gecko/20100101 Firefox/159.0",
    "userId": "cmw32x6lo000gx6r7cxbbtlrb"
  },
  {
    "id": "PNcjsGo1qA40WstSnvgoqgyLywSGZNcf",
    "expiresAt": "2026-11-08T18:34:33.901Z",
    "token": "PrlvExMYM3rhTGAlU1TstbhiznZG2lbT",
    "createdAt": "2026-11-07T18:34:33.902Z",
    "updatedAt": "2026-11-07T18:34:33.902Z",
    "ipAddress": "103.151.171.154",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36",
    "userId": "cmw54b6zy0059uar7d57zug0h"
  },
  {
    "id": "J12UKnLUp62tiB5lvdhwhhecodKxkspA",
    "expiresAt": "2026-11-09T20:09:06.366Z",
    "token": "zpWp84ndCZUgzC9jEmiA7kXVkX4l1A40",
    "createdAt": "2026-11-08T20:09:06.366Z",
    "updatedAt": "2026-11-08T20:09:06.366Z",
    "ipAddress": "103.55.146.27",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36",
    "userId": "cmw54b6zy0059uar7d57zug0h"
  },
  {
    "id": "6hO50jEsFjLpaWwitLj2cvVYEnKU6E3K",
    "expiresAt": "2026-11-10T18:22:47.187Z",
    "token": "WZBxE0yYGlhx8I3GL3pEYXy8wU9skHsE",
    "createdAt": "2026-11-09T18:22:47.187Z",
    "updatedAt": "2026-11-09T18:22:47.187Z",
    "ipAddress": "103.55.146.25",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36",
    "userId": "cmw54b6zy0059uar7d57zug0h"
  },
  {
    "id": "KfzDj97y3hc9Z9JYMGIGHKpukxAw4lXz",
    "expiresAt": "2026-11-11T14:04:46.452Z",
    "token": "IFDBK32SfUIRQEKUsXN7CG7d4kvYZnVb",
    "createdAt": "2026-11-10T14:04:46.453Z",
    "updatedAt": "2026-11-10T14:04:46.453Z",
    "ipAddress": "0000:0000:0000:0000:0000:0000:0000:0000",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36",
    "userId": "cmw54b6zy0059uar7d57zug0h"
  },
  {
    "id": "Qfw7jsg1Hs8qouNWFSlSCateDLiLLISr",
    "expiresAt": "2026-11-15T07:02:20.518Z",
    "token": "5zzQ7TyPsLuOtzI8IZeZxonzUcvUv4jK",
    "createdAt": "2026-11-14T07:02:20.519Z",
    "updatedAt": "2026-11-14T07:02:20.519Z",
    "ipAddress": "103.151.171.153",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36",
    "userId": "cmw32x6lo000gx6r7cxbbtlrb"
  },
  {
    "id": "czVTj7Q4RRy2BCHLxDYEn8yM9Xf324bD",
    "expiresAt": "2026-11-16T03:01:50.993Z",
    "token": "CctcANvv7NQyKPcyOZgYBu6rKbKPHDgq",
    "createdAt": "2026-11-15T03:01:50.993Z",
    "updatedAt": "2026-11-15T03:01:50.993Z",
    "ipAddress": "103.132.184.50",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36",
    "userId": "cmw54b766005cuar7sdkyfuq8"
  },
  {
    "id": "sEEmX3kTqdWqnT61yOxODueMloYhS2Gl",
    "expiresAt": "2026-11-10T10:05:02.179Z",
    "token": "jjjicP3hY28ym6UhNmgFErDkkslciQ1n",
    "createdAt": "2026-11-09T10:05:02.180Z",
    "updatedAt": "2026-11-09T10:05:02.180Z",
    "ipAddress": "103.151.171.152",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/27.0.1 Safari/605.1.15",
    "userId": "cmw54b766005cuar7sdkyfuq8"
  },
  {
    "id": "W1RailSsQqYHANnwxQIzqSIziriT6rlz",
    "expiresAt": "2026-11-10T10:06:12.646Z",
    "token": "9sBAdE1d25RyodNVKY3W8aRk90IvthFu",
    "createdAt": "2026-11-09T10:06:12.647Z",
    "updatedAt": "2026-11-09T10:06:12.647Z",
    "ipAddress": "103.151.171.153",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36",
    "userId": "cmw54b766005cuar7sdkyfuq8"
  },
  {
    "id": "WhIvTkapDOlNcLUiPaJcG1IJbIs751iP",
    "expiresAt": "2026-11-16T10:50:34.129Z",
    "token": "hn3Nobp3aZkTjD3Zq9eCkVRKHvB9JQ3E",
    "createdAt": "2026-11-09T10:50:34.129Z",
    "updatedAt": "2026-11-09T10:50:34.129Z",
    "ipAddress": "27.131.14.69",
    "userAgent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36",
    "userId": "l1gQBbGkGyFhqUKNkJFyKAfX7uplfyrM"
  },
  {
    "id": "uL0TZluier5dibFj0PFeVm5oHgrioX0i",
    "expiresAt": "2026-11-10T10:51:57.710Z",
    "token": "tCAsXPbKEqTVxa3Rbji9NDxUy4xxcDKI",
    "createdAt": "2026-11-09T10:51:57.710Z",
    "updatedAt": "2026-11-09T10:51:57.710Z",
    "ipAddress": "27.131.14.69",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36",
    "userId": "l1gQBbGkGyFhqUKNkJFyKAfX7uplfyrM"
  },
  {
    "id": "L0yRsBflogJJJYYP0mBGM0f0rkRkBIDU",
    "expiresAt": "2026-11-16T06:05:12.488Z",
    "token": "6L6Ua0iorD84juu2BDODEpjzR30Hadby",
    "createdAt": "2026-11-09T06:05:12.488Z",
    "updatedAt": "2026-11-09T06:05:12.488Z",
    "ipAddress": "103.151.171.153",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36",
    "userId": "RIJPFcXMMKdUlnlTRBSMuFZANw97nzSe"
  },
  {
    "id": "HSTAARON4tXqSDg7P1GzI7wSxEKX851j",
    "expiresAt": "2026-11-13T07:54:06.168Z",
    "token": "mnoZhGAjtD0IqothkECDphXUseqVjdOk",
    "createdAt": "2026-11-12T07:54:06.169Z",
    "updatedAt": "2026-11-12T07:54:06.169Z",
    "ipAddress": "103.132.184.50",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/27.0.1 Safari/605.1.15",
    "userId": "cmw54b766005cuar7sdkyfuq8"
  },
  {
    "id": "3WoqWK6qGdoX93OzYCURwu9wpsaDKAiW",
    "expiresAt": "2026-11-14T19:12:11.955Z",
    "token": "biBZHMg97zTpnzKLtXLaJqzjya9D3U4q",
    "createdAt": "2026-11-13T19:12:11.955Z",
    "updatedAt": "2026-11-13T19:12:11.955Z",
    "ipAddress": "103.151.171.152",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36",
    "userId": "cmw54b766005cuar7sdkyfuq8"
  },
  {
    "id": "xO0D8E8WdnDVBMSpFAOU5OCvwFjiHjE2",
    "expiresAt": "2026-11-16T06:39:44.526Z",
    "token": "50atflOJIN6zAoe7lxGDRKMaZfLCbnP7",
    "createdAt": "2026-11-09T06:39:44.526Z",
    "updatedAt": "2026-11-09T06:39:44.526Z",
    "ipAddress": "103.132.184.50",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36",
    "userId": "lInQM5fUHIDxGH2Zgs5qdm0aWZSjVTUr"
  },
  {
    "id": "5CcYtk17UJI8MbZaKew6JjRp3vyVENzv",
    "expiresAt": "2026-11-15T06:50:03.883Z",
    "token": "lRjuD2IWYa7faUPwc7ffKUjlY6hZ4NuE",
    "createdAt": "2026-11-14T06:50:03.883Z",
    "updatedAt": "2026-11-14T06:50:03.883Z",
    "ipAddress": "103.151.171.152",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/27.0.1 Safari/605.1.15",
    "userId": "cmw54b766005cuar7sdkyfuq8"
  },
  {
    "id": "fjzwv7BrFK3arOGOUEqP3Ua5welhi2Fo",
    "expiresAt": "2026-11-15T14:42:21.580Z",
    "token": "pgqXuKOvOQ0Cyt9Rblcv1edspH3mCsDH",
    "createdAt": "2026-11-14T14:42:21.581Z",
    "updatedAt": "2026-11-14T14:42:21.581Z",
    "ipAddress": "103.151.171.153",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36",
    "userId": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1"
  },
  {
    "id": "bHB0H21CHwAekk6wP2AxVjdQnnRpx62N",
    "expiresAt": "2026-11-16T12:08:39.650Z",
    "token": "WNMsxi2j3VOd7Y595BOiXfYGeSUJDtpl",
    "createdAt": "2026-11-15T12:08:39.650Z",
    "updatedAt": "2026-11-15T12:08:39.650Z",
    "ipAddress": "103.132.184.52",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36",
    "userId": "lnCXe6mNhDbNA5kcNrPRCHyIrxn2BLTH"
  },
  {
    "id": "H9TTvnIonIKItLYYH90hwZ2rgWX52MYS",
    "expiresAt": "2026-11-10T12:21:05.323Z",
    "token": "IyNXbC9nNJKukbdEKnx3oAiIKxgRfAal",
    "createdAt": "2026-11-09T12:21:05.323Z",
    "updatedAt": "2026-11-09T12:21:05.323Z",
    "ipAddress": "103.100.234.65",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36",
    "userId": "cmw54b6zy0059uar7d57zug0h"
  },
  {
    "id": "XV1eGoIr3yT11Xg5D6WdkBAegsSwUM1X",
    "expiresAt": "2026-11-16T12:21:09.721Z",
    "token": "qEYWrFbtGo6jS21vtAhhXwcUmTVCu2QY",
    "createdAt": "2026-11-09T12:21:09.721Z",
    "updatedAt": "2026-11-09T12:21:09.721Z",
    "ipAddress": "103.189.159.213",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36",
    "userId": "9eX2XFGRfXneGZFXb37Qdpo0RhAPWzSx"
  },
  {
    "id": "o49p9pWWCzxZ4HzyzysxFQd9CoEnhh2a",
    "expiresAt": "2026-11-18T12:52:32.966Z",
    "token": "PAlqHfr9Z1ahAu02wcSCwY4EkbEybeNm",
    "createdAt": "2026-11-17T12:52:32.966Z",
    "updatedAt": "2026-11-17T12:52:32.966Z",
    "ipAddress": "103.217.111.67",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36",
    "userId": "cmw32x6lo000gx6r7cxbbtlrb"
  },
  {
    "id": "rKul3SvH2UuB8jRWfLYJPPyljm6EGF2M",
    "expiresAt": "2026-11-10T13:11:59.165Z",
    "token": "Mosn7QeHs2GrjrbkEJT3nOWT2warA0Sm",
    "createdAt": "2026-11-09T13:11:59.165Z",
    "updatedAt": "2026-11-09T13:11:59.165Z",
    "ipAddress": "103.151.171.153",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36",
    "userId": "cmw32x6lo000gx6r7cxbbtlrb"
  },
  {
    "id": "J79JlJMgmm7cSMXErrlbm0gz88nYhxkd",
    "expiresAt": "2026-11-10T14:05:13.231Z",
    "token": "PIU9S4Bmks17ZDmM2Ur190plVAuprH9g",
    "createdAt": "2026-11-09T14:05:13.231Z",
    "updatedAt": "2026-11-09T14:05:13.231Z",
    "ipAddress": "103.132.184.53",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36",
    "userId": "lnCXe6mNhDbNA5kcNrPRCHyIrxn2BLTH"
  }
]
```

---

## `accounts`

* **Domain:** People and login
* **Description:** Better Auth credential stores and password hashes
* **Total Rows:** 31

```json
[
  {
    "id": "cmw3bo4s0000n3jr7fx6p5749",
    "accountId": "cmw3bo4p1000m3jr79ogndqat",
    "providerId": "credential",
    "userId": "cmw3bo4p1000m3jr79ogndqat",
    "accessToken": null,
    "refreshToken": null,
    "idToken": null,
    "accessTokenExpiresAt": null,
    "refreshTokenExpiresAt": null,
    "scope": null,
    "password": "•••• [scrypt password hash masked]",
    "createdAt": "2026-11-05T09:07:25.104Z",
    "updatedAt": "2026-11-08T09:07:09.845Z"
  },
  {
    "id": "cmw3bo4f9000h3jr7cs3nu11j",
    "accountId": "cmw32x6lo000gx6r7cxbbtlrb",
    "providerId": "credential",
    "userId": "cmw32x6lo000gx6r7cxbbtlrb",
    "accessToken": null,
    "refreshToken": null,
    "idToken": null,
    "accessTokenExpiresAt": null,
    "refreshTokenExpiresAt": null,
    "scope": null,
    "password": "•••• [scrypt password hash masked]",
    "createdAt": "2026-11-05T09:07:24.645Z",
    "updatedAt": "2026-11-08T09:07:17.648Z"
  },
  {
    "id": "cmw3bo57x000t3jr7iwkvbax2",
    "accountId": "cmw3bo551000s3jr7amz6hxy9",
    "providerId": "credential",
    "userId": "cmw3bo551000s3jr7amz6hxy9",
    "accessToken": null,
    "refreshToken": null,
    "idToken": null,
    "accessTokenExpiresAt": null,
    "refreshTokenExpiresAt": null,
    "scope": null,
    "password": "•••• [scrypt password hash masked]",
    "createdAt": "2026-11-05T09:07:25.677Z",
    "updatedAt": "2026-11-08T09:06:59.366Z"
  },
  {
    "id": "cmw3bo4lw000k3jr75rykczly",
    "accountId": "cmw3bo4ip000j3jr7a4gq18s0",
    "providerId": "credential",
    "userId": "cmw3bo4ip000j3jr7a4gq18s0",
    "accessToken": null,
    "refreshToken": null,
    "idToken": null,
    "accessTokenExpiresAt": null,
    "refreshTokenExpiresAt": null,
    "scope": null,
    "password": "•••• [scrypt password hash masked]",
    "createdAt": "2026-11-05T09:07:24.884Z",
    "updatedAt": "2026-11-08T09:07:01.755Z"
  },
  {
    "id": "cmw3bo51z000q3jr76802xled",
    "accountId": "cmw3bo4y7000p3jr756dqp21t",
    "providerId": "credential",
    "userId": "cmw3bo4y7000p3jr756dqp21t",
    "accessToken": null,
    "refreshToken": null,
    "idToken": null,
    "accessTokenExpiresAt": null,
    "refreshTokenExpiresAt": null,
    "scope": null,
    "password": "•••• [scrypt password hash masked]",
    "createdAt": "2026-11-05T09:07:25.463Z",
    "updatedAt": "2026-11-08T09:07:03.095Z"
  },
  {
    "id": "cmw54b74l005buar7q7p9bjwd",
    "accountId": "cmw54b6zy0059uar7d57zug0h",
    "providerId": "credential",
    "userId": "cmw54b6zy0059uar7d57zug0h",
    "accessToken": null,
    "refreshToken": null,
    "idToken": null,
    "accessTokenExpiresAt": null,
    "refreshTokenExpiresAt": null,
    "scope": null,
    "password": "•••• [scrypt password hash masked]",
    "createdAt": "2026-11-06T15:16:56.661Z",
    "updatedAt": "2026-11-08T09:07:17.867Z"
  },
  {
    "id": "cmw54b7ay005euar74c3pclov",
    "accountId": "cmw54b766005cuar7sdkyfuq8",
    "providerId": "credential",
    "userId": "cmw54b766005cuar7sdkyfuq8",
    "accessToken": null,
    "refreshToken": null,
    "idToken": null,
    "accessTokenExpiresAt": null,
    "refreshTokenExpiresAt": null,
    "scope": null,
    "password": "•••• [scrypt password hash masked]",
    "createdAt": "2026-11-06T15:16:56.890Z",
    "updatedAt": "2026-11-08T09:07:18.086Z"
  },
  {
    "id": "9M3xptAqJGHungdTZRVyflpyAP1lbiSw",
    "accountId": "lInQM5fUHIDxGH2Zgs5qdm0aWZSjVTUr",
    "providerId": "credential",
    "userId": "lInQM5fUHIDxGH2Zgs5qdm0aWZSjVTUr",
    "accessToken": null,
    "refreshToken": null,
    "idToken": null,
    "accessTokenExpiresAt": null,
    "refreshTokenExpiresAt": null,
    "scope": null,
    "password": "•••• [scrypt password hash masked]",
    "createdAt": "2026-11-09T06:39:44.063Z",
    "updatedAt": "2026-11-14T18:00:32.118Z"
  },
  {
    "id": "iFGtoCjofZwGbd3LhVBuElCzVw9g3apj",
    "accountId": "RIJPFcXMMKdUlnlTRBSMuFZANw97nzSe",
    "providerId": "credential",
    "userId": "RIJPFcXMMKdUlnlTRBSMuFZANw97nzSe",
    "accessToken": null,
    "refreshToken": null,
    "idToken": null,
    "accessTokenExpiresAt": null,
    "refreshTokenExpiresAt": null,
    "scope": null,
    "password": "•••• [scrypt password hash masked]",
    "createdAt": "2026-11-09T06:05:12.017Z",
    "updatedAt": "2026-11-09T06:05:12.017Z"
  },
  {
    "id": "lk9yIiq9uXhOkPWOjjEHvEOdUepe1JOq",
    "accountId": "VIbCmTGFv3plionrQgC4QHcQ8VLxIjLg",
    "providerId": "credential",
    "userId": "VIbCmTGFv3plionrQgC4QHcQ8VLxIjLg",
    "accessToken": null,
    "refreshToken": null,
    "idToken": null,
    "accessTokenExpiresAt": null,
    "refreshTokenExpiresAt": null,
    "scope": null,
    "password": "•••• [scrypt password hash masked]",
    "createdAt": "2026-11-09T07:11:18.964Z",
    "updatedAt": "2026-11-09T07:11:18.964Z"
  },
  {
    "id": "cmw8zijr40004idr71k9qb3z9",
    "accountId": "tanvir.ahmed@cse.jnu.ac.bd",
    "providerId": "credential",
    "userId": "cmw8zijo20003idr7iajyx8sj",
    "accessToken": null,
    "refreshToken": null,
    "idToken": null,
    "accessTokenExpiresAt": null,
    "refreshTokenExpiresAt": null,
    "scope": null,
    "password": "•••• [scrypt password hash masked]",
    "createdAt": "2026-11-09T08:13:46.240Z",
    "updatedAt": "2026-11-09T08:13:46.240Z"
  },
  {
    "id": "cmw8zik070008idr7ad3ru5rb",
    "accountId": "nusrat.jahan@swe.jnu.ac.bd",
    "providerId": "credential",
    "userId": "cmw8zijx70007idr7jaac04lw",
    "accessToken": null,
    "refreshToken": null,
    "idToken": null,
    "accessTokenExpiresAt": null,
    "refreshTokenExpiresAt": null,
    "scope": null,
    "password": "•••• [scrypt password hash masked]",
    "createdAt": "2026-11-09T08:13:46.567Z",
    "updatedAt": "2026-11-09T08:13:46.567Z"
  },
  {
    "id": "cmw8zik9j000cidr73vpe6sxd",
    "accountId": "mehedi.rifat@eee.jnu.ac.bd",
    "providerId": "credential",
    "userId": "cmw8zik6k000bidr7pthsc98t",
    "accessToken": null,
    "refreshToken": null,
    "idToken": null,
    "accessTokenExpiresAt": null,
    "refreshTokenExpiresAt": null,
    "scope": null,
    "password": "•••• [scrypt password hash masked]",
    "createdAt": "2026-11-09T08:13:46.903Z",
    "updatedAt": "2026-11-09T08:13:46.903Z"
  },
  {
    "id": "cmw8zikji000gidr74c6xqxuh",
    "accountId": "anika.tabassum@stat.jnu.ac.bd",
    "providerId": "credential",
    "userId": "cmw8zikgj000fidr7huk9whgr",
    "accessToken": null,
    "refreshToken": null,
    "idToken": null,
    "accessTokenExpiresAt": null,
    "refreshTokenExpiresAt": null,
    "scope": null,
    "password": "•••• [scrypt password hash masked]",
    "createdAt": "2026-11-09T08:13:47.262Z",
    "updatedAt": "2026-11-09T08:13:47.262Z"
  },
  {
    "id": "cmw8ziksi000kidr7q2fnmahc",
    "accountId": "kazi.fahim@cse.jnu.ac.bd",
    "providerId": "credential",
    "userId": "cmw8zikpk000jidr7dmcxnytw",
    "accessToken": null,
    "refreshToken": null,
    "idToken": null,
    "accessTokenExpiresAt": null,
    "refreshTokenExpiresAt": null,
    "scope": null,
    "password": "•••• [scrypt password hash masked]",
    "createdAt": "2026-11-09T08:13:47.586Z",
    "updatedAt": "2026-11-09T08:13:47.586Z"
  },
  {
    "id": "cmw8zil1j000oidr7p75t4uz8",
    "accountId": "ayesha.siddiqua@mkt.jnu.ac.bd",
    "providerId": "credential",
    "userId": "cmw8zikyh000nidr7dwp2ckzw",
    "accessToken": null,
    "refreshToken": null,
    "idToken": null,
    "accessTokenExpiresAt": null,
    "refreshTokenExpiresAt": null,
    "scope": null,
    "password": "•••• [scrypt password hash masked]",
    "createdAt": "2026-11-09T08:13:47.911Z",
    "updatedAt": "2026-11-09T08:13:47.911Z"
  },
  {
    "id": "cmw8zilab000sidr7do7b6y4c",
    "accountId": "farhan.ishraq@swe.jnu.ac.bd",
    "providerId": "credential",
    "userId": "cmw8zil7f000ridr7rz8k2ftx",
    "accessToken": null,
    "refreshToken": null,
    "idToken": null,
    "accessTokenExpiresAt": null,
    "refreshTokenExpiresAt": null,
    "scope": null,
    "password": "•••• [scrypt password hash masked]",
    "createdAt": "2026-11-09T08:13:48.227Z",
    "updatedAt": "2026-11-09T08:13:48.227Z"
  },
  {
    "id": "cmw8zilj5000widr7uy9vgk95",
    "accountId": "tariqul.islam.alumni@bkash.com",
    "providerId": "credential",
    "userId": "cmw8zilg9000vidr7nzmteig6",
    "accessToken": null,
    "refreshToken": null,
    "idToken": null,
    "accessTokenExpiresAt": null,
    "refreshTokenExpiresAt": null,
    "scope": null,
    "password": "•••• [scrypt password hash masked]",
    "createdAt": "2026-11-09T08:13:48.545Z",
    "updatedAt": "2026-11-09T08:13:48.545Z"
  },
  {
    "id": "cmw8zils20010idr7vksftxdm",
    "accountId": "sadia.afrin.alumni@brainstation-23.com",
    "providerId": "credential",
    "userId": "cmw8zilp5000zidr7hfoq6b8j",
    "accessToken": null,
    "refreshToken": null,
    "idToken": null,
    "accessTokenExpiresAt": null,
    "refreshTokenExpiresAt": null,
    "scope": null,
    "password": "•••• [scrypt password hash masked]",
    "createdAt": "2026-11-09T08:13:48.866Z",
    "updatedAt": "2026-11-09T08:13:48.866Z"
  },
  {
    "id": "cmw8zim0z0014idr7l1j9itxz",
    "accountId": "mahfuz.rahman.alumni@therapbd.com",
    "providerId": "credential",
    "userId": "cmw8zily10013idr76p7t5rje",
    "accessToken": null,
    "refreshToken": null,
    "idToken": null,
    "accessTokenExpiresAt": null,
    "refreshTokenExpiresAt": null,
    "scope": null,
    "password": "•••• [scrypt password hash masked]",
    "createdAt": "2026-11-09T08:13:49.187Z",
    "updatedAt": "2026-11-09T08:13:49.187Z"
  },
  {
    "id": "cmw8zim9u0018idr7h4tre1id",
    "accountId": "kazi.nahian.alumni@tigerit.com",
    "providerId": "credential",
    "userId": "cmw8zim6y0017idr7urnpaq8d",
    "accessToken": null,
    "refreshToken": null,
    "idToken": null,
    "accessTokenExpiresAt": null,
    "refreshTokenExpiresAt": null,
    "scope": null,
    "password": "•••• [scrypt password hash masked]",
    "createdAt": "2026-11-09T08:13:49.506Z",
    "updatedAt": "2026-11-09T08:13:49.506Z"
  },
  {
    "id": "cmw8zimip001cidr7jftsq78x",
    "accountId": "farhana.yesmin.alumni@samsung.com",
    "providerId": "credential",
    "userId": "cmw8zimfr001bidr7ny0k72sl",
    "accessToken": null,
    "refreshToken": null,
    "idToken": null,
    "accessTokenExpiresAt": null,
    "refreshTokenExpiresAt": null,
    "scope": null,
    "password": "•••• [scrypt password hash masked]",
    "createdAt": "2026-11-09T08:13:49.825Z",
    "updatedAt": "2026-11-09T08:13:49.825Z"
  },
  {
    "id": "cmw8zimrm001gidr7msojxr7c",
    "accountId": "alamin.hossain.alumni@chaldal.com",
    "providerId": "credential",
    "userId": "cmw8zimoo001fidr7gceqsc6q",
    "accessToken": null,
    "refreshToken": null,
    "idToken": null,
    "accessTokenExpiresAt": null,
    "refreshTokenExpiresAt": null,
    "scope": null,
    "password": "•••• [scrypt password hash masked]",
    "createdAt": "2026-11-09T08:13:50.146Z",
    "updatedAt": "2026-11-09T08:13:50.146Z"
  },
  {
    "id": "6yjxsU69iBYjIE0GlKpOoSrVw2Kay8Yy",
    "accountId": "zw0XJr3KbwTWoM9S18hfFR3WCgilIzLf",
    "providerId": "credential",
    "userId": "zw0XJr3KbwTWoM9S18hfFR3WCgilIzLf",
    "accessToken": null,
    "refreshToken": null,
    "idToken": null,
    "accessTokenExpiresAt": null,
    "refreshTokenExpiresAt": null,
    "scope": null,
    "password": "•••• [scrypt password hash masked]",
    "createdAt": "2026-11-09T08:33:49.833Z",
    "updatedAt": "2026-11-09T08:33:49.833Z"
  },
  {
    "id": "c9Sc6FVfXxLT3BZBfmQ2m7R0fMWHUY3m",
    "accountId": "lnCXe6mNhDbNA5kcNrPRCHyIrxn2BLTH",
    "providerId": "credential",
    "userId": "lnCXe6mNhDbNA5kcNrPRCHyIrxn2BLTH",
    "accessToken": null,
    "refreshToken": null,
    "idToken": null,
    "accessTokenExpiresAt": null,
    "refreshTokenExpiresAt": null,
    "scope": null,
    "password": "•••• [scrypt password hash masked]",
    "createdAt": "2026-11-09T10:34:17.015Z",
    "updatedAt": "2026-11-09T10:34:17.015Z"
  },
  {
    "id": "zg3wbH9kVVEdFfxcFNGBrp18bnsTiVb7",
    "accountId": "l1gQBbGkGyFhqUKNkJFyKAfX7uplfyrM",
    "providerId": "credential",
    "userId": "l1gQBbGkGyFhqUKNkJFyKAfX7uplfyrM",
    "accessToken": null,
    "refreshToken": null,
    "idToken": null,
    "accessTokenExpiresAt": null,
    "refreshTokenExpiresAt": null,
    "scope": null,
    "password": "•••• [scrypt password hash masked]",
    "createdAt": "2026-11-09T10:49:43.154Z",
    "updatedAt": "2026-11-09T10:49:43.154Z"
  },
  {
    "id": "c0jw22QoEj53kCQ3iLdvSXeIu1Vx1moq",
    "accountId": "9eX2XFGRfXneGZFXb37Qdpo0RhAPWzSx",
    "providerId": "credential",
    "userId": "9eX2XFGRfXneGZFXb37Qdpo0RhAPWzSx",
    "accessToken": null,
    "refreshToken": null,
    "idToken": null,
    "accessTokenExpiresAt": null,
    "refreshTokenExpiresAt": null,
    "scope": null,
    "password": "•••• [scrypt password hash masked]",
    "createdAt": "2026-11-09T12:20:25.198Z",
    "updatedAt": "2026-11-09T12:20:25.198Z"
  },
  {
    "id": "cmwgk4qnp00196pr7su9xi38t",
    "accountId": "cmw8zinfb001sidr756wc25l0",
    "providerId": "credential",
    "userId": "cmw8zinfb001sidr756wc25l0",
    "accessToken": null,
    "refreshToken": null,
    "idToken": null,
    "accessTokenExpiresAt": null,
    "refreshTokenExpiresAt": null,
    "scope": null,
    "password": "•••• [scrypt password hash masked]",
    "createdAt": "2026-11-14T15:25:17.173Z",
    "updatedAt": "2026-11-14T15:25:17.173Z"
  },
  {
    "id": "M6oRmN0hSPLNR71b2yyuJIQyUkhkT2UV",
    "accountId": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "providerId": "credential",
    "userId": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "accessToken": null,
    "refreshToken": null,
    "idToken": null,
    "accessTokenExpiresAt": null,
    "refreshTokenExpiresAt": null,
    "scope": null,
    "password": "•••• [scrypt password hash masked]",
    "createdAt": "2026-11-14T06:02:30.392Z",
    "updatedAt": "2026-11-14T06:02:30.392Z"
  },
  {
    "id": "cmwgk4qvj001c6pr7txs0jqef",
    "accountId": "cmwgk4qsj001b6pr78xfu201h",
    "providerId": "credential",
    "userId": "cmwgk4qsj001b6pr78xfu201h",
    "accessToken": null,
    "refreshToken": null,
    "idToken": null,
    "accessTokenExpiresAt": null,
    "refreshTokenExpiresAt": null,
    "scope": null,
    "password": "•••• [scrypt password hash masked]",
    "createdAt": "2026-11-14T15:25:17.455Z",
    "updatedAt": "2026-11-14T15:25:17.455Z"
  },
  {
    "id": "cmwgk4r4q001g6pr76oy7fh7c",
    "accountId": "cmwgk4r1r001f6pr7586h1bzs",
    "providerId": "credential",
    "userId": "cmwgk4r1r001f6pr7586h1bzs",
    "accessToken": null,
    "refreshToken": null,
    "idToken": null,
    "accessTokenExpiresAt": null,
    "refreshTokenExpiresAt": null,
    "scope": null,
    "password": "•••• [scrypt password hash masked]",
    "createdAt": "2026-11-14T15:25:17.786Z",
    "updatedAt": "2026-11-14T15:25:17.786Z"
  }
]
```

---

## `verifications`

* **Domain:** People and login
* **Description:** Ephemeral cryptographic email tokens
* **Total Rows:** 8

```json
[
  {
    "id": "verify_unit_test_1794637685106@university.edu",
    "identifier": "unit_test_1794637685106@university.edu",
    "value": "http://localhost:3000/api/auth/verify-email?token=eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InVuaXRfdGVzdF8xNzk0NjM3Njg1MTA2QHVuaXZlcnNpdHkuZWR1IiwidXNlcklkIjoiMXFkOE1uSzM3dDV3Y3RKcTJTdExLZTdlcjFRNERRbkMiLCJpYXQiOjE3OTQ2Mzc2ODYsImV4cCI6MTc5NDY0MTI4Nn0._UAvuiU5YPtT5G36KVwPN1PemaphUzywh9pjX2m5TjA&callbackURL=%2F",
    "expiresAt": "2026-11-15T06:28:06.410Z",
    "createdAt": "2026-11-14T06:28:05.741Z",
    "updatedAt": "2026-11-14T06:28:06.410Z"
  },
  {
    "id": "verify_unit_test_1794594995121@university.edu",
    "identifier": "unit_test_1794594995121@university.edu",
    "value": "http://localhost:3000/api/auth/verify-email?token=eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InVuaXRfdGVzdF8xNzk0NTk0OTk1MTIxQHVuaXZlcnNpdHkuZWR1IiwidXNlcklkIjoiNGl1dDZTTGhUNWxrbnE5ZGJyelJ0cld3SlZSeFZsdWwiLCJpYXQiOjE3OTQ1OTQ5OTYsImV4cCI6MTc5NDU5ODU5Nn0.kl4yFn7sQRypQyqmzooONNJGlXbWHKNxfZCzO3WOZS8&callbackURL=%2F",
    "expiresAt": "2026-11-14T18:36:36.426Z",
    "createdAt": "2026-11-13T18:36:35.770Z",
    "updatedAt": "2026-11-13T18:36:36.426Z"
  },
  {
    "id": "verify_unit_test_1794598487970@university.edu",
    "identifier": "unit_test_1794598487970@university.edu",
    "value": "http://localhost:3000/api/auth/verify-email?token=eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InVuaXRfdGVzdF8xNzk0NTk4NDg3OTcwQHVuaXZlcnNpdHkuZWR1IiwidXNlcklkIjoiN1c3T1MyaVA0ZEMyZXZLcktlc1dmRFZMaDRnTVZnenQiLCJpYXQiOjE3OTQ1OTg0ODksImV4cCI6MTc5NDYwMjA4OX0.SwsMlLm-1feBbCtQfsLZTYy0hTHx-f6AcsI_GpfwXnI&callbackURL=%2F",
    "expiresAt": "2026-11-14T19:34:49.304Z",
    "createdAt": "2026-11-13T19:34:48.633Z",
    "updatedAt": "2026-11-13T19:34:49.304Z"
  },
  {
    "id": "verify_sooooooooojib@gmail.com",
    "identifier": "sooooooooojib@gmail.com",
    "value": "https://jnujobhunting.vercel.app/verify-email?token=test_token_123",
    "expiresAt": "2026-11-15T05:51:38.603Z",
    "createdAt": "2026-11-14T05:51:38.665Z",
    "updatedAt": "2026-11-14T05:51:38.665Z"
  },
  {
    "id": "verify_unit_test_1794635748280@university.edu",
    "identifier": "unit_test_1794635748280@university.edu",
    "value": "http://localhost:3000/api/auth/verify-email?token=eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InVuaXRfdGVzdF8xNzk0NjM1NzQ4MjgwQHVuaXZlcnNpdHkuZWR1IiwidXNlcklkIjoiVEZyeHBGNmh0Z1hDSWFXNG5NYkN0YWkybER5TWl4a2UiLCJpYXQiOjE3OTQ2MzU3NTAsImV4cCI6MTc5NDYzOTM1MH0.BlwdQ1P_3ShLEGdD_R0SYL8GDggEeEGfbt4CIC4BnSQ&callbackURL=%2F",
    "expiresAt": "2026-11-15T05:55:50.104Z",
    "createdAt": "2026-11-14T05:55:49.412Z",
    "updatedAt": "2026-11-14T05:55:50.104Z"
  },
  {
    "id": "verify_b220305009@cse.jnu.ac.bd",
    "identifier": "b220305009@cse.jnu.ac.bd",
    "value": "https://jnujobhunting.vercel.app/api/auth/verify-email?token=eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImIyMjAzMDUwMDlAY3NlLmpudS5hYy5iZCIsInVzZXJJZCI6IkJzcmJDZWJOS1hNblVZRmtmUnRzR1hWNU9TUlRndkoxIiwiaWF0IjoxNzk0NjM2MTUwLCJleHAiOjE3OTQ2Mzk3NTB9.QuT9ZbxVbE4eXkH8jIhPjkjH1iToqTD4G_WJXUIXFio&callbackURL=%2Ffeed",
    "expiresAt": "2026-11-15T06:02:30.621Z",
    "createdAt": "2026-11-14T06:02:30.629Z",
    "updatedAt": "2026-11-14T06:02:30.629Z"
  },
  {
    "id": "verify_unit_test_1794637789034@university.edu",
    "identifier": "unit_test_1794637789034@university.edu",
    "value": "http://localhost:3000/api/auth/verify-email?token=eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InVuaXRfdGVzdF8xNzk0NjM3Nzg5MDM0QHVuaXZlcnNpdHkuZWR1IiwidXNlcklkIjoiOHJ1NUlyU0RpR3dQcWZSejVhQmNPdnZCUURDYXlYZWwiLCJpYXQiOjE3OTQ2Mzc3OTAsImV4cCI6MTc5NDY0MTM5MH0.U-v5WtaCVNNHgsE6mpeVvKIYfcMG2B2eFYHUGHbUJIw&callbackURL=%2F",
    "expiresAt": "2026-11-15T06:29:50.372Z",
    "createdAt": "2026-11-14T06:29:49.697Z",
    "updatedAt": "2026-11-14T06:29:50.372Z"
  },
  {
    "id": "verify_ifratjuthy@gmail.com",
    "identifier": "ifratjuthy@gmail.com",
    "value": "https://jnujobhunting.vercel.app/api/auth/verify-email?token=eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImlmcmF0anV0aHlAZ21haWwuY29tIiwidXNlcklkIjoibEluUU01ZlVISUR4R0gyWmdzNXFkbTBhV1pTalZUVXIiLCJpYXQiOjE3OTQ2NzkzMjYsImV4cCI6MTc5NDY4MjkyNn0.vO882X0B1Mfukrsy_woLK4eoMCA9M3iGP_8JemaxAek&callbackURL=%2Ffeed",
    "expiresAt": "2026-11-15T18:02:06.220Z",
    "createdAt": "2026-11-14T17:53:03.995Z",
    "updatedAt": "2026-11-14T18:02:06.220Z"
  }
]
```

---

## `opportunities`

* **Domain:** Jobs and applications
* **Description:** Job and internship listings
* **Total Rows:** 60

```json
[
  {
    "id": "cmwkp4y3s000008k2dscd2rwo",
    "title": "Software Engineer",
    "description": "should be productinv sjfnjsfjowe jfnjfosijfoewfoefi",
    "companyId": null,
    "companyName": "Google",
    "companyLogo": null,
    "type": "FULL_TIME",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "COMMUNITY_SHARED",
    "status": "APPROVED",
    "minCgpa": 3.5,
    "minAcademicYear": "Honours",
    "requiredSkills": [],
    "targetDepartments": [],
    "openToAllDepartments": true,
    "salaryOrStipend": "BDT 35000/month",
    "location": "Dhaka, Bangladesh",
    "workplaceType": "ON_SITE",
    "applicationMethod": "EXTERNAL",
    "externalUrl": "https://workspace.google.com/products/drive/",
    "contactEmail": null,
    "deadline": "2026-12-17T12:52:00.000Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-17T12:56:29.608Z",
    "updatedAt": "2026-11-17T12:56:29.608Z"
  },
  {
    "id": "cmw32xqrt000oz4r7zcvq6fd1",
    "title": "Enterprise Cloud & AI Solutions Trainee",
    "description": "Brain Station 23 is offering an intensive 6-month traineeship with guaranteed placement for top performers. You will be trained on AWS/Azure architectures, microservices, and Generative AI workflows while contributing to live international client solutions.",
    "companyId": "cmw32xqfl000lz4r7xc606xxg",
    "companyName": "Brain Station 23",
    "companyLogo": null,
    "type": "INTERNSHIP",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "OFFICIAL_EMPLOYER",
    "status": "APPROVED",
    "minCgpa": 3,
    "minAcademicYear": "4th Year",
    "requiredSkills": [
      "Python",
      "Cloud Architecture",
      "Next.js",
      "REST APIs"
    ],
    "targetDepartments": [
      "Computer Science & Engineering",
      "Software Engineering",
      "Mathematics"
    ],
    "openToAllDepartments": false,
    "salaryOrStipend": "BDT 25,000 / month",
    "location": "Mohakhali DOHS, Dhaka",
    "workplaceType": "HYBRID",
    "applicationMethod": "INTERNAL",
    "externalUrl": null,
    "contactEmail": null,
    "deadline": "2026-12-20T05:02:56.685Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T05:02:56.969Z",
    "updatedAt": "2026-11-05T05:02:56.969Z"
  },
  {
    "id": "cmw32xquu000pz4r7kbmmyc8p",
    "title": "Management Trainee — Corporate Banking & Credit Analysis",
    "description": "Exclusive opportunity shared by Jagannath University BBA Alumni Network. Commercial banking cohort with accelerated leadership track across treasury, credit risk management, and SME syndications. Candidates must exhibit outstanding financial modeling skills.",
    "companyId": null,
    "companyName": "BRAC Bank PLC",
    "companyLogo": null,
    "type": "FULL_TIME",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "COMMUNITY_SHARED",
    "status": "APPROVED",
    "minCgpa": 3.2,
    "minAcademicYear": "Graduated",
    "requiredSkills": [
      "Financial Analysis",
      "Credit Risk",
      "Accounting",
      "Excel"
    ],
    "targetDepartments": [
      "Finance & Banking",
      "Accounting & Information Systems",
      "Economics"
    ],
    "openToAllDepartments": false,
    "salaryOrStipend": "BDT 55,000 / month",
    "location": "Motijheel, Dhaka",
    "workplaceType": "ON_SITE",
    "applicationMethod": "EXTERNAL",
    "externalUrl": "https://bracbank.taleo.net/careersection/mto/jobapply",
    "contactEmail": null,
    "deadline": "2026-12-05T05:02:56.685Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T05:02:57.078Z",
    "updatedAt": "2026-11-05T05:02:57.078Z"
  },
  {
    "id": "cmw32xqxv000qz4r7vlpk8rwn",
    "title": "UI/UX & Product Design Trainee",
    "description": "Learn digital product design, user research, wireframing, and interactive design system tokens. Open across all university departments — strong aesthetic sensibility and curiosity required.",
    "companyId": null,
    "companyName": "Augmedix Bangladesh",
    "companyLogo": null,
    "type": "INTERNSHIP",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "COMMUNITY_SHARED",
    "status": "APPROVED",
    "minCgpa": null,
    "minAcademicYear": null,
    "requiredSkills": [
      "Figma",
      "Design Systems",
      "User Research",
      "Wireframing"
    ],
    "targetDepartments": [],
    "openToAllDepartments": true,
    "salaryOrStipend": "BDT 22,000 / month",
    "location": "Panthapath, Dhaka",
    "workplaceType": "REMOTE",
    "applicationMethod": "EXTERNAL",
    "externalUrl": "https://augmedix.com/careers",
    "contactEmail": null,
    "deadline": "2026-12-20T05:02:56.685Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T05:02:57.187Z",
    "updatedAt": "2026-11-05T05:02:57.187Z"
  },
  {
    "id": "cmw32xr10000rz4r7hjp6y1nr",
    "title": "Brand Strategy & Communications Associate",
    "description": "Fast-track rotational role for creative and articulate graduates. Work on nationwide FMCG campaigns, media relations, copy direction, and market research.",
    "companyId": null,
    "companyName": "Unilever Bangladesh",
    "companyLogo": null,
    "type": "FULL_TIME",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "COMMUNITY_SHARED",
    "status": "APPROVED",
    "minCgpa": null,
    "minAcademicYear": null,
    "requiredSkills": [
      "Brand Management",
      "Copywriting",
      "Market Research",
      "Presentation"
    ],
    "targetDepartments": [],
    "openToAllDepartments": true,
    "salaryOrStipend": "Competitive + MNC Benefits",
    "location": "Dhaka, Bangladesh",
    "workplaceType": "HYBRID",
    "applicationMethod": "EXTERNAL",
    "externalUrl": "https://unilever.com/careers/bangladesh",
    "contactEmail": null,
    "deadline": "2026-12-05T05:02:56.685Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T05:02:57.300Z",
    "updatedAt": "2026-11-05T05:02:57.300Z"
  },
  {
    "id": "cmw32xqoq000nz4r7qkmyx2rz",
    "title": "Junior FinTech Backend Engineer",
    "description": "bKash core transactions engineering is recruiting junior backend engineers. You will design and implement resilient, ACID-compliant ledger and payment settlement components with zero downtime tolerance.\n\nWhat We Offer:\n- Competitive salary package with annual festival bonuses and health coverage.\n- Mentorship by senior architects running Bangladesh's largest transaction network.",
    "companyId": "cmw32xq88000kz4r7tpgtvkba",
    "companyName": "bKash Limited",
    "companyLogo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=200&auto=format&fit=crop&q=80",
    "type": "FULL_TIME",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "OFFICIAL_EMPLOYER",
    "status": "EXPIRED",
    "minCgpa": 3.4,
    "minAcademicYear": "4th Year",
    "requiredSkills": [
      "Java",
      "Spring Boot",
      "PostgreSQL",
      "Kafka",
      "Redis"
    ],
    "targetDepartments": [
      "Computer Science & Engineering",
      "Software Engineering",
      "Electrical & Electronic Engineering"
    ],
    "openToAllDepartments": false,
    "salaryOrStipend": "BDT 75,000 - 95,000 / month",
    "location": "Dhaka, Bangladesh",
    "workplaceType": "ON_SITE",
    "applicationMethod": "INTERNAL",
    "externalUrl": null,
    "contactEmail": null,
    "deadline": "2026-11-07T09:10:34.624Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T05:02:56.858Z",
    "updatedAt": "2026-11-07T18:22:45.321Z"
  },
  {
    "id": "cmw3bo6ns001f3jr7djxjplnc",
    "title": "Junior Data Analyst & BI Developer (Pending Review)",
    "description": "Newly submitted posting by an external hiring partner currently undergoing registrar and administrative verification.",
    "companyId": null,
    "companyName": "Apex Footwear Global",
    "companyLogo": null,
    "type": "FULL_TIME",
    "posterId": "cmw3bo551000s3jr7amz6hxy9",
    "sourceType": "COMMUNITY_SHARED",
    "status": "APPROVED",
    "minCgpa": null,
    "minAcademicYear": null,
    "requiredSkills": [
      "SQL",
      "PowerBI",
      "Python",
      "Data Analysis"
    ],
    "targetDepartments": [
      "Statistics",
      "Finance & Banking",
      "Economics"
    ],
    "openToAllDepartments": true,
    "salaryOrStipend": "BDT 45,000 / month",
    "location": "Gulshan-1, Dhaka",
    "workplaceType": "HYBRID",
    "applicationMethod": "EXTERNAL",
    "externalUrl": "https://apexfootwearltd.com/careers",
    "contactEmail": null,
    "deadline": "2026-12-05T09:10:34.624Z",
    "reviewerId": "cmw32x6lo000gx6r7cxbbtlrb",
    "reviewedAt": "2026-11-05T10:42:59.110Z",
    "rejectionReason": null,
    "createdAt": "2026-11-05T09:07:27.544Z",
    "updatedAt": "2026-11-05T10:42:59.118Z"
  },
  {
    "id": "cmw3bo62m00193jr7myshy0i5",
    "title": "Distributed Systems Software Intern",
    "description": "Optimizely is seeking talented computer science and engineering undergraduates for our high-scale telemetry ingestion pipeline team in Dhaka. You will work on real-time event streaming systems processing billions of daily events with Go, gRPC, and Apache Kafka.\n\nQualifications:\n- Strong fundamentals in data structures, algorithms, and concurrency.\n- Hands-on project experience with Go, Docker, and SQL.\n- Excellent problem-solving and communicative skills.",
    "companyId": "cmw32xpsq000iz4r75hqv4nv6",
    "companyName": "Optimizely",
    "companyLogo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&auto=format&fit=crop&q=80",
    "type": "INTERNSHIP",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "OFFICIAL_EMPLOYER",
    "status": "APPROVED",
    "minCgpa": 3.25,
    "minAcademicYear": "3rd Year",
    "requiredSkills": [
      "Go",
      "Distributed Systems",
      "Docker",
      "gRPC",
      "PostgreSQL"
    ],
    "targetDepartments": [
      "Computer Science & Engineering",
      "Software Engineering"
    ],
    "openToAllDepartments": false,
    "salaryOrStipend": "BDT 40,000 / month",
    "location": "Gulshan-2, Dhaka",
    "workplaceType": "HYBRID",
    "applicationMethod": "INTERNAL",
    "externalUrl": null,
    "contactEmail": null,
    "deadline": "2026-12-05T09:10:34.624Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T09:07:26.782Z",
    "updatedAt": "2026-11-05T09:10:34.791Z"
  },
  {
    "id": "cmw3bo68r001a3jr72sghbymg",
    "title": "Enterprise Cloud & Generative AI Solutions Trainee",
    "description": "Brain Station 23 is offering a 6-month structured training cohort with guaranteed full-time absorption for top performers. Master AWS/Azure enterprise architecture, microservices, and LLM-assisted workflows.",
    "companyId": "cmw32xqfl000lz4r7xc606xxg",
    "companyName": "Brain Station 23",
    "companyLogo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80",
    "type": "INTERNSHIP",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "OFFICIAL_EMPLOYER",
    "status": "APPROVED",
    "minCgpa": 3,
    "minAcademicYear": "4th Year",
    "requiredSkills": [
      "Python",
      "FastAPI",
      "Docker",
      "PostgreSQL",
      "REST APIs"
    ],
    "targetDepartments": [
      "Computer Science & Engineering",
      "Software Engineering",
      "Mathematics"
    ],
    "openToAllDepartments": false,
    "salaryOrStipend": "BDT 28,000 / month",
    "location": "Mohakhali DOHS, Dhaka",
    "workplaceType": "HYBRID",
    "applicationMethod": "INTERNAL",
    "externalUrl": null,
    "contactEmail": null,
    "deadline": "2027-01-04T09:10:34.624Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T09:07:27.003Z",
    "updatedAt": "2026-11-05T09:10:35.016Z"
  },
  {
    "id": "cmw3bo6bq001b3jr7j5z8k0cf",
    "title": "Medical Natural Language Processing Research Fellow",
    "description": "Augmedix R&D lab is recruiting student research fellows. Collaborate with physicians and AI scientists to benchmark domain-specific clinical transcription models.",
    "companyId": "cmw3bo5um00163jr72ih86ezy",
    "companyName": "Augmedix Bangladesh",
    "companyLogo": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&auto=format&fit=crop&q=80",
    "type": "CONTRACT",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "OFFICIAL_EMPLOYER",
    "status": "APPROVED",
    "minCgpa": 3.5,
    "minAcademicYear": null,
    "requiredSkills": [
      "Python",
      "Machine Learning",
      "TensorFlow",
      "NLP"
    ],
    "targetDepartments": [
      "Computer Science & Engineering",
      "Software Engineering"
    ],
    "openToAllDepartments": false,
    "salaryOrStipend": "BDT 50,000 / month + Research Grant",
    "location": "Panthapath, Dhaka",
    "workplaceType": "HYBRID",
    "applicationMethod": "INTERNAL",
    "externalUrl": null,
    "contactEmail": null,
    "deadline": "2026-12-20T09:10:34.624Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T09:07:27.110Z",
    "updatedAt": "2026-11-05T09:10:35.126Z"
  },
  {
    "id": "cmw3bo6eq001c3jr7736ibv4w",
    "title": "Databricks Cloud Infrastructure Engineer (Lead Shared by Alumni)",
    "description": "Exclusive community lead shared by Tariqul Islam (Class of '21). Databricks is seeking graduate software engineers for its serverless compute control plane in San Francisco. Alumnus willing to refer qualified candidates.",
    "companyId": null,
    "companyName": "Databricks",
    "companyLogo": null,
    "type": "FULL_TIME",
    "posterId": "cmw3bo4y7000p3jr756dqp21t",
    "sourceType": "COMMUNITY_SHARED",
    "status": "APPROVED",
    "minCgpa": null,
    "minAcademicYear": null,
    "requiredSkills": [
      "Go",
      "Kubernetes",
      "Distributed Systems",
      "Cloud Architecture"
    ],
    "targetDepartments": [
      "Computer Science & Engineering",
      "Software Engineering"
    ],
    "openToAllDepartments": false,
    "salaryOrStipend": "$130,000 - $155,000 / year + Equity",
    "location": "San Francisco, CA / Remote",
    "workplaceType": "REMOTE",
    "applicationMethod": "EXTERNAL",
    "externalUrl": "https://databricks.com/company/careers/open-positions",
    "contactEmail": null,
    "deadline": "2027-01-04T09:10:34.624Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T09:07:27.218Z",
    "updatedAt": "2026-11-05T09:10:35.236Z"
  },
  {
    "id": "cmw3bo6hq001d3jr7cbxb2yqi",
    "title": "Management Trainee — Corporate Banking & Financial Analytics",
    "description": "Shared by Sabrina Rahman (Alumna). Elite rotational program across commercial lending, syndicated credit modeling, and treasury risk management at BRAC Bank.",
    "companyId": null,
    "companyName": "BRAC Bank PLC",
    "companyLogo": null,
    "type": "FULL_TIME",
    "posterId": "cmw3bo551000s3jr7amz6hxy9",
    "sourceType": "COMMUNITY_SHARED",
    "status": "APPROVED",
    "minCgpa": 3.2,
    "minAcademicYear": null,
    "requiredSkills": [
      "Financial Analysis",
      "Credit Risk",
      "Accounting",
      "Excel"
    ],
    "targetDepartments": [
      "Finance & Banking",
      "Accounting & Information Systems",
      "Economics"
    ],
    "openToAllDepartments": false,
    "salaryOrStipend": "BDT 60,000 / month",
    "location": "Motijheel, Dhaka",
    "workplaceType": "ON_SITE",
    "applicationMethod": "EXTERNAL",
    "externalUrl": "https://bracbank.taleo.net/careersection/mto/jobapply",
    "contactEmail": null,
    "deadline": "2026-12-05T09:10:34.624Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T09:07:27.326Z",
    "updatedAt": "2026-11-05T09:10:35.347Z"
  },
  {
    "id": "cmw34e4cv00041sr7otar2pqm",
    "title": "Cloud Infrastructure Systems Intern",
    "description": "Develop cloud monitoring microservices and automated deployment scripts.",
    "companyId": "cmw34e49o00021sr7eobs2iod",
    "companyName": "TechCorp Solutions",
    "companyLogo": null,
    "type": "INTERNSHIP",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "OFFICIAL_EMPLOYER",
    "status": "APPROVED",
    "minCgpa": 3.2,
    "minAcademicYear": null,
    "requiredSkills": [
      "Terraform",
      "Go",
      "Docker",
      "AWS"
    ],
    "targetDepartments": [
      "Computer Science & Engineering",
      "Software Engineering"
    ],
    "openToAllDepartments": false,
    "salaryOrStipend": "BDT 30,000 / month",
    "location": "Dhaka",
    "workplaceType": "HYBRID",
    "applicationMethod": "INTERNAL",
    "externalUrl": null,
    "contactEmail": null,
    "deadline": "2027-01-04T05:43:40.685Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T05:43:40.687Z",
    "updatedAt": "2026-11-09T14:51:32.467Z"
  },
  {
    "id": "cmw34e4ee00051sr7lz026xdo",
    "title": "Junior Product Design Associate",
    "description": "Work on design systems, user journeys, wireframes, and customer interviews.",
    "companyId": null,
    "companyName": "Global FinTech Hub",
    "companyLogo": null,
    "type": "FULL_TIME",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "COMMUNITY_SHARED",
    "status": "APPROVED",
    "minCgpa": null,
    "minAcademicYear": null,
    "requiredSkills": [
      "Figma",
      "Design Systems",
      "Prototyping"
    ],
    "targetDepartments": [],
    "openToAllDepartments": true,
    "salaryOrStipend": "BDT 45,000 / month",
    "location": "Remote",
    "workplaceType": "REMOTE",
    "applicationMethod": "EXTERNAL",
    "externalUrl": "https://fintechhub.com/apply",
    "contactEmail": null,
    "deadline": "2027-01-04T05:43:40.685Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T05:43:40.742Z",
    "updatedAt": "2026-11-09T14:51:32.520Z"
  },
  {
    "id": "cmw3czi8t0004tor7qjm3axgm",
    "title": "Cloud Infrastructure Systems Intern",
    "description": "Develop cloud monitoring microservices and automated deployment scripts.",
    "companyId": "cmw3czi5o0002tor732z55alv",
    "companyName": "TechCorp Solutions",
    "companyLogo": null,
    "type": "INTERNSHIP",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "OFFICIAL_EMPLOYER",
    "status": "APPROVED",
    "minCgpa": 3.2,
    "minAcademicYear": null,
    "requiredSkills": [
      "Terraform",
      "Go",
      "Docker",
      "AWS"
    ],
    "targetDepartments": [
      "Computer Science & Engineering",
      "Software Engineering"
    ],
    "openToAllDepartments": false,
    "salaryOrStipend": "BDT 30,000 / month",
    "location": "Dhaka",
    "workplaceType": "HYBRID",
    "applicationMethod": "INTERNAL",
    "externalUrl": null,
    "contactEmail": null,
    "deadline": "2027-01-04T09:44:15.387Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T09:44:15.389Z",
    "updatedAt": "2026-11-09T14:51:32.626Z"
  },
  {
    "id": "cmw3cziaf0005tor7xxn6n02h",
    "title": "Junior Product Design Associate",
    "description": "Work on design systems, user journeys, wireframes, and customer interviews.",
    "companyId": null,
    "companyName": "Global FinTech Hub",
    "companyLogo": null,
    "type": "FULL_TIME",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "COMMUNITY_SHARED",
    "status": "APPROVED",
    "minCgpa": null,
    "minAcademicYear": null,
    "requiredSkills": [
      "Figma",
      "Design Systems",
      "Prototyping"
    ],
    "targetDepartments": [],
    "openToAllDepartments": true,
    "salaryOrStipend": "BDT 45,000 / month",
    "location": "Remote",
    "workplaceType": "REMOTE",
    "applicationMethod": "EXTERNAL",
    "externalUrl": "https://fintechhub.com/apply",
    "contactEmail": null,
    "deadline": "2027-01-04T09:44:15.387Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T09:44:15.447Z",
    "updatedAt": "2026-11-09T14:51:32.679Z"
  },
  {
    "id": "cmw3e1xlf0004eyr7lw0k8no1",
    "title": "Cloud Infrastructure Systems Intern",
    "description": "Develop cloud monitoring microservices and automated deployment scripts.",
    "companyId": "cmw3e1xi90002eyr7fh7bmbw9",
    "companyName": "TechCorp Solutions",
    "companyLogo": null,
    "type": "INTERNSHIP",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "OFFICIAL_EMPLOYER",
    "status": "APPROVED",
    "minCgpa": 3.2,
    "minAcademicYear": null,
    "requiredSkills": [
      "Terraform",
      "Go",
      "Docker",
      "AWS"
    ],
    "targetDepartments": [
      "Computer Science & Engineering",
      "Software Engineering"
    ],
    "openToAllDepartments": false,
    "salaryOrStipend": "BDT 30,000 / month",
    "location": "Dhaka",
    "workplaceType": "HYBRID",
    "applicationMethod": "INTERNAL",
    "externalUrl": null,
    "contactEmail": null,
    "deadline": "2027-01-04T10:14:08.206Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T10:14:08.211Z",
    "updatedAt": "2026-11-09T14:51:32.732Z"
  },
  {
    "id": "cmw3e1xn20005eyr737585ldz",
    "title": "Junior Product Design Associate",
    "description": "Work on design systems, user journeys, wireframes, and customer interviews.",
    "companyId": null,
    "companyName": "Global FinTech Hub",
    "companyLogo": null,
    "type": "FULL_TIME",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "COMMUNITY_SHARED",
    "status": "APPROVED",
    "minCgpa": null,
    "minAcademicYear": null,
    "requiredSkills": [
      "Figma",
      "Design Systems",
      "Prototyping"
    ],
    "targetDepartments": [],
    "openToAllDepartments": true,
    "salaryOrStipend": "BDT 45,000 / month",
    "location": "Remote",
    "workplaceType": "REMOTE",
    "applicationMethod": "EXTERNAL",
    "externalUrl": "https://fintechhub.com/apply",
    "contactEmail": null,
    "deadline": "2027-01-04T10:14:08.206Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T10:14:08.270Z",
    "updatedAt": "2026-11-09T14:51:32.787Z"
  },
  {
    "id": "cmwg1yms1000008l5q2v9h1pr",
    "title": "Junior Backend Engineer",
    "description": "TypeScript, Node.js, PostgreSQL, REST APIs, Git, Docker",
    "companyId": null,
    "companyName": "bKash Limited",
    "companyLogo": null,
    "type": "FULL_TIME",
    "posterId": "cmw54b766005cuar7sdkyfuq8",
    "sourceType": "COMMUNITY_SHARED",
    "status": "APPROVED",
    "minCgpa": null,
    "minAcademicYear": null,
    "requiredSkills": [],
    "targetDepartments": [],
    "openToAllDepartments": true,
    "salaryOrStipend": "BDT 55,000 – 75,000",
    "location": "Dhaka, Bangladesh",
    "workplaceType": "HYBRID",
    "applicationMethod": "EXTERNAL",
    "externalUrl": "https://corporate.bkash.com/careers/junior-backend-engineer",
    "contactEmail": "sajibhasanbd2345@gmail.com",
    "deadline": "2026-12-24T06:53:00.000Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-14T06:56:39.121Z",
    "updatedAt": "2026-11-14T06:56:39.121Z"
  },
  {
    "id": "cmw32xqlm000mz4r7zz8n7cf6",
    "title": "Distributed Systems Software Intern (Fall 2026)",
    "description": "Join Optimizely's high-scale distributed systems team. You will work on real-time event ingestion pipelines processing billions of telemetry events daily using Go, gRPC, and Apache Kafka. Open to 3rd and 4th year undergraduate students in computing disciplines.\n\nKey Responsibilities:\n- Implement microservices in Go and gRPC.\n- Write unit and integration tests with >85% coverage.\n- Collaborate with senior engineers on Kubernetes cluster deployments.\n- Participate in bi-weekly sprint planning and code reviews.",
    "companyId": "cmw32xpsq000iz4r75hqv4nv6",
    "companyName": "Optimizely",
    "companyLogo": null,
    "type": "INTERNSHIP",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "OFFICIAL_EMPLOYER",
    "status": "APPROVED",
    "minCgpa": 3.25,
    "minAcademicYear": "3rd Year",
    "requiredSkills": [
      "Go",
      "Distributed Systems",
      "Docker",
      "gRPC",
      "PostgreSQL"
    ],
    "targetDepartments": [
      "Computer Science & Engineering",
      "Software Engineering"
    ],
    "openToAllDepartments": false,
    "salaryOrStipend": "BDT 35,000 / month",
    "location": "Gulshan-2, Dhaka",
    "workplaceType": "HYBRID",
    "applicationMethod": "INTERNAL",
    "externalUrl": null,
    "contactEmail": null,
    "deadline": "2026-12-05T05:02:56.685Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T05:02:56.746Z",
    "updatedAt": "2026-11-07T17:47:59.836Z"
  },
  {
    "id": "cmw34ajpr0004s7r76431cm8u",
    "title": "Cloud Infrastructure Systems Intern",
    "description": "Develop cloud monitoring microservices and automated deployment scripts.",
    "companyId": "cmw34ajmr0002s7r7472je1ng",
    "companyName": "TechCorp Solutions",
    "companyLogo": null,
    "type": "INTERNSHIP",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "OFFICIAL_EMPLOYER",
    "status": "APPROVED",
    "minCgpa": 3.2,
    "minAcademicYear": null,
    "requiredSkills": [
      "Terraform",
      "Go",
      "Docker",
      "AWS"
    ],
    "targetDepartments": [
      "Computer Science & Engineering",
      "Software Engineering"
    ],
    "openToAllDepartments": false,
    "salaryOrStipend": "BDT 30,000 / month",
    "location": "Dhaka",
    "workplaceType": "HYBRID",
    "applicationMethod": "INTERNAL",
    "externalUrl": null,
    "contactEmail": null,
    "deadline": "2027-01-04T05:40:53.966Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T05:40:53.967Z",
    "updatedAt": "2026-11-09T14:51:33.219Z"
  },
  {
    "id": "cmw34ajra0005s7r7pds35jcx",
    "title": "Junior Product Design Associate",
    "description": "Work on design systems, user journeys, wireframes, and customer interviews.",
    "companyId": null,
    "companyName": "Global FinTech Hub",
    "companyLogo": null,
    "type": "FULL_TIME",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "COMMUNITY_SHARED",
    "status": "APPROVED",
    "minCgpa": null,
    "minAcademicYear": null,
    "requiredSkills": [
      "Figma",
      "Design Systems",
      "Prototyping"
    ],
    "targetDepartments": [],
    "openToAllDepartments": true,
    "salaryOrStipend": "BDT 45,000 / month",
    "location": "Remote",
    "workplaceType": "REMOTE",
    "applicationMethod": "EXTERNAL",
    "externalUrl": "https://fintechhub.com/apply",
    "contactEmail": null,
    "deadline": "2027-01-04T05:40:53.966Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T05:40:54.022Z",
    "updatedAt": "2026-11-09T14:51:33.273Z"
  },
  {
    "id": "cmw338xi70004xnr7iivmuqyt",
    "title": "Cloud Infrastructure Systems Intern",
    "description": "Develop cloud monitoring microservices and automated deployment scripts.",
    "companyId": "cmw338xf60002xnr7t7khu6mo",
    "companyName": "TechCorp Solutions",
    "companyLogo": null,
    "type": "INTERNSHIP",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "OFFICIAL_EMPLOYER",
    "status": "APPROVED",
    "minCgpa": 3.2,
    "minAcademicYear": null,
    "requiredSkills": [
      "Terraform",
      "Go",
      "Docker",
      "AWS"
    ],
    "targetDepartments": [
      "Computer Science & Engineering",
      "Software Engineering"
    ],
    "openToAllDepartments": false,
    "salaryOrStipend": "BDT 30,000 / month",
    "location": "Dhaka",
    "workplaceType": "HYBRID",
    "applicationMethod": "INTERNAL",
    "externalUrl": null,
    "contactEmail": null,
    "deadline": "2027-01-04T05:11:38.909Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T05:11:38.911Z",
    "updatedAt": "2026-11-09T14:51:33.488Z"
  },
  {
    "id": "cmw338xjs0005xnr77yuoqbvq",
    "title": "Junior Product Design Associate",
    "description": "Work on design systems, user journeys, wireframes, and customer interviews.",
    "companyId": null,
    "companyName": "Global FinTech Hub",
    "companyLogo": null,
    "type": "FULL_TIME",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "COMMUNITY_SHARED",
    "status": "APPROVED",
    "minCgpa": null,
    "minAcademicYear": null,
    "requiredSkills": [
      "Figma",
      "Design Systems",
      "Prototyping"
    ],
    "targetDepartments": [],
    "openToAllDepartments": true,
    "salaryOrStipend": "BDT 45,000 / month",
    "location": "Remote",
    "workplaceType": "REMOTE",
    "applicationMethod": "EXTERNAL",
    "externalUrl": "https://fintechhub.com/apply",
    "contactEmail": null,
    "deadline": "2027-01-04T05:11:38.909Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T05:11:38.968Z",
    "updatedAt": "2026-11-09T14:51:33.541Z"
  },
  {
    "id": "cmw33e8fh0004f2r7whpb95sf",
    "title": "Cloud Infrastructure Systems Intern",
    "description": "Develop cloud monitoring microservices and automated deployment scripts.",
    "companyId": "cmw33e8ca0002f2r7d36xqd1x",
    "companyName": "TechCorp Solutions",
    "companyLogo": null,
    "type": "INTERNSHIP",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "OFFICIAL_EMPLOYER",
    "status": "APPROVED",
    "minCgpa": 3.2,
    "minAcademicYear": null,
    "requiredSkills": [
      "Terraform",
      "Go",
      "Docker",
      "AWS"
    ],
    "targetDepartments": [
      "Computer Science & Engineering",
      "Software Engineering"
    ],
    "openToAllDepartments": false,
    "salaryOrStipend": "BDT 30,000 / month",
    "location": "Dhaka",
    "workplaceType": "HYBRID",
    "applicationMethod": "INTERNAL",
    "externalUrl": null,
    "contactEmail": null,
    "deadline": "2027-01-04T05:15:46.345Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T05:15:46.349Z",
    "updatedAt": "2026-11-09T14:51:33.595Z"
  },
  {
    "id": "cmw33e8h40005f2r744fp8zz5",
    "title": "Junior Product Design Associate",
    "description": "Work on design systems, user journeys, wireframes, and customer interviews.",
    "companyId": null,
    "companyName": "Global FinTech Hub",
    "companyLogo": null,
    "type": "FULL_TIME",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "COMMUNITY_SHARED",
    "status": "APPROVED",
    "minCgpa": null,
    "minAcademicYear": null,
    "requiredSkills": [
      "Figma",
      "Design Systems",
      "Prototyping"
    ],
    "targetDepartments": [],
    "openToAllDepartments": true,
    "salaryOrStipend": "BDT 45,000 / month",
    "location": "Remote",
    "workplaceType": "REMOTE",
    "applicationMethod": "EXTERNAL",
    "externalUrl": "https://fintechhub.com/apply",
    "contactEmail": null,
    "deadline": "2027-01-04T05:15:46.345Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T05:15:46.408Z",
    "updatedAt": "2026-11-09T14:51:33.649Z"
  },
  {
    "id": "cmw37573d0004s8r7hyx6w0o8",
    "title": "Cloud Infrastructure Systems Intern",
    "description": "Develop cloud monitoring microservices and automated deployment scripts.",
    "companyId": "cmw37570b0002s8r72yll6ai4",
    "companyName": "TechCorp Solutions",
    "companyLogo": null,
    "type": "INTERNSHIP",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "OFFICIAL_EMPLOYER",
    "status": "APPROVED",
    "minCgpa": 3.2,
    "minAcademicYear": null,
    "requiredSkills": [
      "Terraform",
      "Go",
      "Docker",
      "AWS"
    ],
    "targetDepartments": [
      "Computer Science & Engineering",
      "Software Engineering"
    ],
    "openToAllDepartments": false,
    "salaryOrStipend": "BDT 30,000 / month",
    "location": "Dhaka",
    "workplaceType": "HYBRID",
    "applicationMethod": "INTERNAL",
    "externalUrl": null,
    "contactEmail": null,
    "deadline": "2027-01-04T07:00:43.175Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T07:00:43.177Z",
    "updatedAt": "2026-11-09T14:51:34.246Z"
  },
  {
    "id": "cmw3757590005s8r7ff3jm23f",
    "title": "Junior Product Design Associate",
    "description": "Work on design systems, user journeys, wireframes, and customer interviews.",
    "companyId": null,
    "companyName": "Global FinTech Hub",
    "companyLogo": null,
    "type": "FULL_TIME",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "COMMUNITY_SHARED",
    "status": "APPROVED",
    "minCgpa": null,
    "minAcademicYear": null,
    "requiredSkills": [
      "Figma",
      "Design Systems",
      "Prototyping"
    ],
    "targetDepartments": [],
    "openToAllDepartments": true,
    "salaryOrStipend": "BDT 45,000 / month",
    "location": "Remote",
    "workplaceType": "REMOTE",
    "applicationMethod": "EXTERNAL",
    "externalUrl": "https://fintechhub.com/apply",
    "contactEmail": null,
    "deadline": "2027-01-04T07:00:43.175Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T07:00:43.245Z",
    "updatedAt": "2026-11-09T14:51:34.301Z"
  },
  {
    "id": "cmw357rk30005zvr7korzt0ml",
    "title": "Junior Product Design Associate",
    "description": "Work on design systems, user journeys, wireframes, and customer interviews.",
    "companyId": null,
    "companyName": "Global FinTech Hub",
    "companyLogo": null,
    "type": "FULL_TIME",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "COMMUNITY_SHARED",
    "status": "APPROVED",
    "minCgpa": null,
    "minAcademicYear": null,
    "requiredSkills": [
      "Figma",
      "Design Systems",
      "Prototyping"
    ],
    "targetDepartments": [],
    "openToAllDepartments": true,
    "salaryOrStipend": "BDT 45,000 / month",
    "location": "Remote",
    "workplaceType": "REMOTE",
    "applicationMethod": "EXTERNAL",
    "externalUrl": "https://fintechhub.com/apply",
    "contactEmail": null,
    "deadline": "2027-01-04T06:06:43.721Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T06:06:43.779Z",
    "updatedAt": "2026-11-09T14:51:34.838Z"
  },
  {
    "id": "cmw35ay8l00059xr78mc8t66f",
    "title": "Junior Product Design Associate",
    "description": "Work on design systems, user journeys, wireframes, and customer interviews.",
    "companyId": null,
    "companyName": "Global FinTech Hub",
    "companyLogo": null,
    "type": "FULL_TIME",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "COMMUNITY_SHARED",
    "status": "APPROVED",
    "minCgpa": null,
    "minAcademicYear": null,
    "requiredSkills": [
      "Figma",
      "Design Systems",
      "Prototyping"
    ],
    "targetDepartments": [],
    "openToAllDepartments": true,
    "salaryOrStipend": "BDT 45,000 / month",
    "location": "Remote",
    "workplaceType": "REMOTE",
    "applicationMethod": "EXTERNAL",
    "externalUrl": "https://fintechhub.com/apply",
    "contactEmail": null,
    "deadline": "2027-01-04T06:09:12.345Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T06:09:12.405Z",
    "updatedAt": "2026-11-09T14:51:35.178Z"
  },
  {
    "id": "cmw3cqje40004war7304slgcs",
    "title": "Cloud Infrastructure Systems Intern",
    "description": "Develop cloud monitoring microservices and automated deployment scripts.",
    "companyId": "cmw3cqjb20002war7d4uojlcr",
    "companyName": "TechCorp Solutions",
    "companyLogo": null,
    "type": "INTERNSHIP",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "OFFICIAL_EMPLOYER",
    "status": "APPROVED",
    "minCgpa": 3.2,
    "minAcademicYear": null,
    "requiredSkills": [
      "Terraform",
      "Go",
      "Docker",
      "AWS"
    ],
    "targetDepartments": [
      "Computer Science & Engineering",
      "Software Engineering"
    ],
    "openToAllDepartments": false,
    "salaryOrStipend": "BDT 30,000 / month",
    "location": "Dhaka",
    "workplaceType": "HYBRID",
    "applicationMethod": "INTERNAL",
    "externalUrl": null,
    "contactEmail": null,
    "deadline": "2027-01-04T09:37:16.970Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T09:37:16.972Z",
    "updatedAt": "2026-11-09T14:51:35.309Z"
  },
  {
    "id": "cmw3cqjfq0005war70nbispzg",
    "title": "Junior Product Design Associate",
    "description": "Work on design systems, user journeys, wireframes, and customer interviews.",
    "companyId": null,
    "companyName": "Global FinTech Hub",
    "companyLogo": null,
    "type": "FULL_TIME",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "COMMUNITY_SHARED",
    "status": "APPROVED",
    "minCgpa": null,
    "minAcademicYear": null,
    "requiredSkills": [
      "Figma",
      "Design Systems",
      "Prototyping"
    ],
    "targetDepartments": [],
    "openToAllDepartments": true,
    "salaryOrStipend": "BDT 45,000 / month",
    "location": "Remote",
    "workplaceType": "REMOTE",
    "applicationMethod": "EXTERNAL",
    "externalUrl": "https://fintechhub.com/apply",
    "contactEmail": null,
    "deadline": "2027-01-04T09:37:16.970Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T09:37:17.030Z",
    "updatedAt": "2026-11-09T14:51:35.364Z"
  },
  {
    "id": "cmw366vyj0004chr7r1ly6yif",
    "title": "Cloud Infrastructure Systems Intern",
    "description": "Develop cloud monitoring microservices and automated deployment scripts.",
    "companyId": "cmw366vvi0002chr78zj66wz1",
    "companyName": "TechCorp Solutions",
    "companyLogo": null,
    "type": "INTERNSHIP",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "OFFICIAL_EMPLOYER",
    "status": "APPROVED",
    "minCgpa": 3.2,
    "minAcademicYear": null,
    "requiredSkills": [
      "Terraform",
      "Go",
      "Docker",
      "AWS"
    ],
    "targetDepartments": [
      "Computer Science & Engineering",
      "Software Engineering"
    ],
    "openToAllDepartments": false,
    "salaryOrStipend": "BDT 30,000 / month",
    "location": "Dhaka",
    "workplaceType": "HYBRID",
    "applicationMethod": "INTERNAL",
    "externalUrl": null,
    "contactEmail": null,
    "deadline": "2027-01-04T06:34:02.442Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T06:34:02.443Z",
    "updatedAt": "2026-11-09T14:51:35.633Z"
  },
  {
    "id": "cmw366w030005chr78rqns7bv",
    "title": "Junior Product Design Associate",
    "description": "Work on design systems, user journeys, wireframes, and customer interviews.",
    "companyId": null,
    "companyName": "Global FinTech Hub",
    "companyLogo": null,
    "type": "FULL_TIME",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "COMMUNITY_SHARED",
    "status": "APPROVED",
    "minCgpa": null,
    "minAcademicYear": null,
    "requiredSkills": [
      "Figma",
      "Design Systems",
      "Prototyping"
    ],
    "targetDepartments": [],
    "openToAllDepartments": true,
    "salaryOrStipend": "BDT 45,000 / month",
    "location": "Remote",
    "workplaceType": "REMOTE",
    "applicationMethod": "EXTERNAL",
    "externalUrl": "https://fintechhub.com/apply",
    "contactEmail": null,
    "deadline": "2027-01-04T06:34:02.442Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T06:34:02.499Z",
    "updatedAt": "2026-11-09T14:51:35.687Z"
  },
  {
    "id": "cmw38is51000497r7t8dne05l",
    "title": "Cloud Infrastructure Systems Intern",
    "description": "Develop cloud monitoring microservices and automated deployment scripts.",
    "companyId": "cmw38is21000297r7ybso0r66",
    "companyName": "TechCorp Solutions",
    "companyLogo": null,
    "type": "INTERNSHIP",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "OFFICIAL_EMPLOYER",
    "status": "APPROVED",
    "minCgpa": 3.2,
    "minAcademicYear": null,
    "requiredSkills": [
      "Terraform",
      "Go",
      "Docker",
      "AWS"
    ],
    "targetDepartments": [
      "Computer Science & Engineering",
      "Software Engineering"
    ],
    "openToAllDepartments": false,
    "salaryOrStipend": "BDT 30,000 / month",
    "location": "Dhaka",
    "workplaceType": "HYBRID",
    "applicationMethod": "INTERNAL",
    "externalUrl": null,
    "contactEmail": null,
    "deadline": "2027-01-04T07:39:16.596Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T07:39:16.597Z",
    "updatedAt": "2026-11-09T14:51:35.740Z"
  },
  {
    "id": "cmw38is6l000597r7qq774hia",
    "title": "Junior Product Design Associate",
    "description": "Work on design systems, user journeys, wireframes, and customer interviews.",
    "companyId": null,
    "companyName": "Global FinTech Hub",
    "companyLogo": null,
    "type": "FULL_TIME",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "COMMUNITY_SHARED",
    "status": "APPROVED",
    "minCgpa": null,
    "minAcademicYear": null,
    "requiredSkills": [
      "Figma",
      "Design Systems",
      "Prototyping"
    ],
    "targetDepartments": [],
    "openToAllDepartments": true,
    "salaryOrStipend": "BDT 45,000 / month",
    "location": "Remote",
    "workplaceType": "REMOTE",
    "applicationMethod": "EXTERNAL",
    "externalUrl": "https://fintechhub.com/apply",
    "contactEmail": null,
    "deadline": "2027-01-04T07:39:16.596Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T07:39:16.653Z",
    "updatedAt": "2026-11-09T14:51:35.795Z"
  },
  {
    "id": "cmw3c7aol0004dzr7arclpqk0",
    "title": "Cloud Infrastructure Systems Intern",
    "description": "Develop cloud monitoring microservices and automated deployment scripts.",
    "companyId": "cmw3c7ali0002dzr7r4m085c7",
    "companyName": "TechCorp Solutions",
    "companyLogo": null,
    "type": "INTERNSHIP",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "OFFICIAL_EMPLOYER",
    "status": "APPROVED",
    "minCgpa": 3.2,
    "minAcademicYear": null,
    "requiredSkills": [
      "Terraform",
      "Go",
      "Docker",
      "AWS"
    ],
    "targetDepartments": [
      "Computer Science & Engineering",
      "Software Engineering"
    ],
    "openToAllDepartments": false,
    "salaryOrStipend": "BDT 30,000 / month",
    "location": "Dhaka",
    "workplaceType": "HYBRID",
    "applicationMethod": "INTERNAL",
    "externalUrl": null,
    "contactEmail": null,
    "deadline": "2027-01-04T09:22:19.219Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T09:22:19.222Z",
    "updatedAt": "2026-11-09T14:51:36.013Z"
  },
  {
    "id": "cmw3c7aq60005dzr735u4t9gh",
    "title": "Junior Product Design Associate",
    "description": "Work on design systems, user journeys, wireframes, and customer interviews.",
    "companyId": null,
    "companyName": "Global FinTech Hub",
    "companyLogo": null,
    "type": "FULL_TIME",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "COMMUNITY_SHARED",
    "status": "APPROVED",
    "minCgpa": null,
    "minAcademicYear": null,
    "requiredSkills": [
      "Figma",
      "Design Systems",
      "Prototyping"
    ],
    "targetDepartments": [],
    "openToAllDepartments": true,
    "salaryOrStipend": "BDT 45,000 / month",
    "location": "Remote",
    "workplaceType": "REMOTE",
    "applicationMethod": "EXTERNAL",
    "externalUrl": "https://fintechhub.com/apply",
    "contactEmail": null,
    "deadline": "2027-01-04T09:22:19.219Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T09:22:19.278Z",
    "updatedAt": "2026-11-09T14:51:36.123Z"
  },
  {
    "id": "cmw38m0y00005i6r79ce7cs89",
    "title": "Junior Product Design Associate",
    "description": "Work on design systems, user journeys, wireframes, and customer interviews.",
    "companyId": null,
    "companyName": "Global FinTech Hub",
    "companyLogo": null,
    "type": "FULL_TIME",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "COMMUNITY_SHARED",
    "status": "APPROVED",
    "minCgpa": null,
    "minAcademicYear": null,
    "requiredSkills": [
      "Figma",
      "Design Systems",
      "Prototyping"
    ],
    "targetDepartments": [],
    "openToAllDepartments": true,
    "salaryOrStipend": "BDT 45,000 / month",
    "location": "Remote",
    "workplaceType": "REMOTE",
    "applicationMethod": "EXTERNAL",
    "externalUrl": "https://fintechhub.com/apply",
    "contactEmail": null,
    "deadline": "2027-01-04T07:41:47.919Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T07:41:47.976Z",
    "updatedAt": "2026-11-09T14:51:36.288Z"
  },
  {
    "id": "cmw38q9il0004syr70xzfb7qf",
    "title": "Cloud Infrastructure Systems Intern",
    "description": "Develop cloud monitoring microservices and automated deployment scripts.",
    "companyId": "cmw38q9fi0002syr7z5i7m83t",
    "companyName": "TechCorp Solutions",
    "companyLogo": null,
    "type": "INTERNSHIP",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "OFFICIAL_EMPLOYER",
    "status": "APPROVED",
    "minCgpa": 3.2,
    "minAcademicYear": null,
    "requiredSkills": [
      "Terraform",
      "Go",
      "Docker",
      "AWS"
    ],
    "targetDepartments": [
      "Computer Science & Engineering",
      "Software Engineering"
    ],
    "openToAllDepartments": false,
    "salaryOrStipend": "BDT 30,000 / month",
    "location": "Dhaka",
    "workplaceType": "HYBRID",
    "applicationMethod": "INTERNAL",
    "externalUrl": null,
    "contactEmail": null,
    "deadline": "2027-01-04T07:45:05.707Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T07:45:05.709Z",
    "updatedAt": "2026-11-09T14:51:36.341Z"
  },
  {
    "id": "cmw38q9k50005syr7n5mfx06b",
    "title": "Junior Product Design Associate",
    "description": "Work on design systems, user journeys, wireframes, and customer interviews.",
    "companyId": null,
    "companyName": "Global FinTech Hub",
    "companyLogo": null,
    "type": "FULL_TIME",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "COMMUNITY_SHARED",
    "status": "APPROVED",
    "minCgpa": null,
    "minAcademicYear": null,
    "requiredSkills": [
      "Figma",
      "Design Systems",
      "Prototyping"
    ],
    "targetDepartments": [],
    "openToAllDepartments": true,
    "salaryOrStipend": "BDT 45,000 / month",
    "location": "Remote",
    "workplaceType": "REMOTE",
    "applicationMethod": "EXTERNAL",
    "externalUrl": "https://fintechhub.com/apply",
    "contactEmail": null,
    "deadline": "2027-01-04T07:45:05.707Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T07:45:05.765Z",
    "updatedAt": "2026-11-09T14:51:36.396Z"
  },
  {
    "id": "cmw39rofi0004kor7k207ikxn",
    "title": "Cloud Infrastructure Systems Intern",
    "description": "Develop cloud monitoring microservices and automated deployment scripts.",
    "companyId": "cmw39rocd0002kor7z0j46hue",
    "companyName": "TechCorp Solutions",
    "companyLogo": null,
    "type": "INTERNSHIP",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "OFFICIAL_EMPLOYER",
    "status": "APPROVED",
    "minCgpa": 3.2,
    "minAcademicYear": null,
    "requiredSkills": [
      "Terraform",
      "Go",
      "Docker",
      "AWS"
    ],
    "targetDepartments": [
      "Computer Science & Engineering",
      "Software Engineering"
    ],
    "openToAllDepartments": false,
    "salaryOrStipend": "BDT 30,000 / month",
    "location": "Dhaka",
    "workplaceType": "HYBRID",
    "applicationMethod": "INTERNAL",
    "externalUrl": null,
    "contactEmail": null,
    "deadline": "2027-01-04T08:14:11.309Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T08:14:11.310Z",
    "updatedAt": "2026-11-09T14:51:36.668Z"
  },
  {
    "id": "cmw39roh30005kor782ow9zls",
    "title": "Junior Product Design Associate",
    "description": "Work on design systems, user journeys, wireframes, and customer interviews.",
    "companyId": null,
    "companyName": "Global FinTech Hub",
    "companyLogo": null,
    "type": "FULL_TIME",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "COMMUNITY_SHARED",
    "status": "APPROVED",
    "minCgpa": null,
    "minAcademicYear": null,
    "requiredSkills": [
      "Figma",
      "Design Systems",
      "Prototyping"
    ],
    "targetDepartments": [],
    "openToAllDepartments": true,
    "salaryOrStipend": "BDT 45,000 / month",
    "location": "Remote",
    "workplaceType": "REMOTE",
    "applicationMethod": "EXTERNAL",
    "externalUrl": "https://fintechhub.com/apply",
    "contactEmail": null,
    "deadline": "2027-01-04T08:14:11.309Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T08:14:11.367Z",
    "updatedAt": "2026-11-09T14:51:36.722Z"
  },
  {
    "id": "cmw3awizz0004e2r7rmohtaqz",
    "title": "Cloud Infrastructure Systems Intern",
    "description": "Develop cloud monitoring microservices and automated deployment scripts.",
    "companyId": "cmw3awiwz0002e2r7lt0w1t7l",
    "companyName": "TechCorp Solutions",
    "companyLogo": null,
    "type": "INTERNSHIP",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "OFFICIAL_EMPLOYER",
    "status": "APPROVED",
    "minCgpa": 3.2,
    "minAcademicYear": null,
    "requiredSkills": [
      "Terraform",
      "Go",
      "Docker",
      "AWS"
    ],
    "targetDepartments": [
      "Computer Science & Engineering",
      "Software Engineering"
    ],
    "openToAllDepartments": false,
    "salaryOrStipend": "BDT 30,000 / month",
    "location": "Dhaka",
    "workplaceType": "HYBRID",
    "applicationMethod": "INTERNAL",
    "externalUrl": null,
    "contactEmail": null,
    "deadline": "2027-01-04T08:45:57.165Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T08:45:57.167Z",
    "updatedAt": "2026-11-09T14:51:37.159Z"
  },
  {
    "id": "cmw3awj1i0005e2r78s4jy9pg",
    "title": "Junior Product Design Associate",
    "description": "Work on design systems, user journeys, wireframes, and customer interviews.",
    "companyId": null,
    "companyName": "Global FinTech Hub",
    "companyLogo": null,
    "type": "FULL_TIME",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "COMMUNITY_SHARED",
    "status": "APPROVED",
    "minCgpa": null,
    "minAcademicYear": null,
    "requiredSkills": [
      "Figma",
      "Design Systems",
      "Prototyping"
    ],
    "targetDepartments": [],
    "openToAllDepartments": true,
    "salaryOrStipend": "BDT 45,000 / month",
    "location": "Remote",
    "workplaceType": "REMOTE",
    "applicationMethod": "EXTERNAL",
    "externalUrl": "https://fintechhub.com/apply",
    "contactEmail": null,
    "deadline": "2027-01-04T08:45:57.165Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T08:45:57.222Z",
    "updatedAt": "2026-11-09T14:51:37.213Z"
  },
  {
    "id": "cmw3bo5zj00183jr75l0pisqb",
    "title": "Frontend Engineering Intern (Summer 2027)",
    "description": "Join Vercel's Core Framework & Dashboard engineering team. You will build user interfaces with Next.js App Router, React 19, and Tailwind CSS while collaborating with world-class engineers.\n\nKey Responsibilities:\n- Build accessible, responsive frontend components for developer telemetry.\n- Optimize core web vitals and client-side performance.\n- Contribute to open-source UI libraries and component design systems.",
    "companyId": "cmw3bo5my00113jr76m6pt4om",
    "companyName": "Vercel",
    "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
    "type": "INTERNSHIP",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "OFFICIAL_EMPLOYER",
    "status": "APPROVED",
    "minCgpa": 3.3,
    "minAcademicYear": "3rd Year",
    "requiredSkills": [
      "TypeScript",
      "Next.js",
      "React",
      "Tailwind CSS"
    ],
    "targetDepartments": [
      "Computer Science & Engineering",
      "Software Engineering"
    ],
    "openToAllDepartments": false,
    "salaryOrStipend": "$45 / hour + Remote Tech Stipend",
    "location": "San Francisco, CA / Remote",
    "workplaceType": "REMOTE",
    "applicationMethod": "INTERNAL",
    "externalUrl": null,
    "contactEmail": null,
    "deadline": "2026-12-20T09:10:34.624Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T09:07:26.671Z",
    "updatedAt": "2026-11-07T17:47:59.836Z"
  },
  {
    "id": "cmw3bo6qr001g3jr7u6yd11n0",
    "title": "Systems Reliability Engineering Fellowship (Closed Cohort)",
    "description": "Previous term's systems reliability fellowship with completed candidate roster for archiving and reporting.",
    "companyId": "cmw3bo5my00113jr76m6pt4om",
    "companyName": "Vercel",
    "companyLogo": null,
    "type": "CONTRACT",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "OFFICIAL_EMPLOYER",
    "status": "CLOSED",
    "minCgpa": null,
    "minAcademicYear": null,
    "requiredSkills": [
      "Go",
      "Docker",
      "Next.js"
    ],
    "targetDepartments": [],
    "openToAllDepartments": true,
    "salaryOrStipend": "$40 / hr",
    "location": "Remote",
    "workplaceType": "REMOTE",
    "applicationMethod": "INTERNAL",
    "externalUrl": null,
    "contactEmail": null,
    "deadline": "2026-10-31T09:10:34.624Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T09:07:27.651Z",
    "updatedAt": "2026-11-07T17:47:59.836Z"
  },
  {
    "id": "cmw3bo6kr001e3jr7qvffg6oq",
    "title": "Undergraduate Computer Architecture Lab Assistant",
    "description": "Department of CSE is recruiting 2 student teaching and lab assistants for CSE 3201 (Computer Architecture & Microprocessors) for the upcoming term.",
    "companyId": null,
    "companyName": "University Department of CSE",
    "companyLogo": null,
    "type": "PART_TIME",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "OFFICIAL_EMPLOYER",
    "status": "EXPIRED",
    "minCgpa": 3.6,
    "minAcademicYear": "4th Year",
    "requiredSkills": [
      "C++",
      "Assembly",
      "Computer Networks",
      "Teaching"
    ],
    "targetDepartments": [
      "Computer Science & Engineering"
    ],
    "openToAllDepartments": false,
    "salaryOrStipend": "BDT 15,000 / month (10 hrs/week)",
    "location": "Science Campus Lab 304",
    "workplaceType": "ON_SITE",
    "applicationMethod": "INTERNAL",
    "externalUrl": null,
    "contactEmail": null,
    "deadline": "2026-11-07T09:10:34.624Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T09:07:27.435Z",
    "updatedAt": "2026-11-07T18:22:45.321Z"
  },
  {
    "id": "cmw357rii0004zvr746n04irv",
    "title": "Cloud Infrastructure Systems Intern",
    "description": "Develop cloud monitoring microservices and automated deployment scripts.",
    "companyId": "cmw357rff0002zvr7m61o9yyg",
    "companyName": "TechCorp Solutions",
    "companyLogo": null,
    "type": "INTERNSHIP",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "OFFICIAL_EMPLOYER",
    "status": "APPROVED",
    "minCgpa": 3.2,
    "minAcademicYear": null,
    "requiredSkills": [
      "Terraform",
      "Go",
      "Docker",
      "AWS"
    ],
    "targetDepartments": [
      "Computer Science & Engineering",
      "Software Engineering"
    ],
    "openToAllDepartments": false,
    "salaryOrStipend": "BDT 30,000 / month",
    "location": "Dhaka",
    "workplaceType": "HYBRID",
    "applicationMethod": "INTERNAL",
    "externalUrl": null,
    "contactEmail": null,
    "deadline": "2027-01-04T06:06:43.721Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T06:06:43.722Z",
    "updatedAt": "2026-11-09T14:51:33.004Z"
  },
  {
    "id": "cmwgk4rtb001u6pr7o0vr7j69",
    "title": "Junior Backend Engineer (Core Transaction Engine)",
    "description": "bKash core transactions engineering is recruiting junior backend engineers. You will design and implement resilient, ACID-compliant ledger and payment settlement components with zero downtime tolerance.\n\nKey Responsibilities:\n- Build high-throughput event processing services using Java, Spring Boot, and Apache Kafka.\n- Optimize database queries and schema designs for PostgreSQL and Oracle DB.\n- Collaborate with security specialists on cryptographic encryption and tamper-evident auditing.\n\nMentorship & Referral:\nShared by Tariqul Islam (Class of '21). Open to candidate inquiries and internal referral recommendations for qualified JnU graduates!",
    "companyId": "cmw32xq88000kz4r7tpgtvkba",
    "companyName": "bKash Limited",
    "companyLogo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=200&auto=format&fit=crop&q=80",
    "type": "FULL_TIME",
    "posterId": "cmw8zilg9000vidr7nzmteig6",
    "sourceType": "COMMUNITY_SHARED",
    "status": "APPROVED",
    "minCgpa": 3.4,
    "minAcademicYear": "4th Year",
    "requiredSkills": [
      "Java",
      "Spring Boot",
      "PostgreSQL",
      "Kafka",
      "Redis"
    ],
    "targetDepartments": [
      "Computer Science & Engineering",
      "Software Engineering"
    ],
    "openToAllDepartments": false,
    "salaryOrStipend": "BDT 80,000 - 100,000 / month",
    "location": "Dhaka, Bangladesh",
    "workplaceType": "ON_SITE",
    "applicationMethod": "EXTERNAL",
    "externalUrl": "https://www.bkash.com/career",
    "contactEmail": "tariqul.islam.alumni@bkash.com",
    "deadline": "2026-12-14T15:25:18.614Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-14T15:25:18.671Z",
    "updatedAt": "2026-11-14T15:25:18.671Z"
  },
  {
    "id": "cmw35ay7000049xr7cud1s6x4",
    "title": "Cloud Infrastructure Systems Intern",
    "description": "Develop cloud monitoring microservices and automated deployment scripts.",
    "companyId": "cmw35ay3x00029xr77y5zohiq",
    "companyName": "TechCorp Solutions",
    "companyLogo": null,
    "type": "INTERNSHIP",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "OFFICIAL_EMPLOYER",
    "status": "APPROVED",
    "minCgpa": 3.2,
    "minAcademicYear": null,
    "requiredSkills": [
      "Terraform",
      "Go",
      "Docker",
      "AWS"
    ],
    "targetDepartments": [
      "Computer Science & Engineering",
      "Software Engineering"
    ],
    "openToAllDepartments": false,
    "salaryOrStipend": "BDT 30,000 / month",
    "location": "Dhaka",
    "workplaceType": "HYBRID",
    "applicationMethod": "INTERNAL",
    "externalUrl": null,
    "contactEmail": null,
    "deadline": "2027-01-04T06:09:12.345Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T06:09:12.348Z",
    "updatedAt": "2026-11-09T14:51:35.100Z"
  },
  {
    "id": "cmw38m0wg0004i6r7pq5q8s5i",
    "title": "Cloud Infrastructure Systems Intern",
    "description": "Develop cloud monitoring microservices and automated deployment scripts.",
    "companyId": "cmw38m0tf0002i6r7sd5kbxpd",
    "companyName": "TechCorp Solutions",
    "companyLogo": null,
    "type": "INTERNSHIP",
    "posterId": "cmw32x6lo000gx6r7cxbbtlrb",
    "sourceType": "OFFICIAL_EMPLOYER",
    "status": "APPROVED",
    "minCgpa": 3.2,
    "minAcademicYear": null,
    "requiredSkills": [
      "Terraform",
      "Go",
      "Docker",
      "AWS"
    ],
    "targetDepartments": [
      "Computer Science & Engineering",
      "Software Engineering"
    ],
    "openToAllDepartments": false,
    "salaryOrStipend": "BDT 30,000 / month",
    "location": "Dhaka",
    "workplaceType": "HYBRID",
    "applicationMethod": "INTERNAL",
    "externalUrl": null,
    "contactEmail": null,
    "deadline": "2027-01-04T07:41:47.919Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-05T07:41:47.920Z",
    "updatedAt": "2026-11-09T14:51:36.230Z"
  },
  {
    "id": "cmwgk4rwi001v6pr71f29f6bm",
    "title": "Enterprise Cloud & Generative AI Solutions Trainee",
    "description": "Brain Station 23 is offering a 6-month structured training cohort with guaranteed full-time absorption for top performers. Master AWS/Azure enterprise architecture, microservices, and LLM-assisted workflows.\n\nHighlights:\n- Work directly with certified AWS Solutions Architects.\n- Build serverless workflows, cloud monitoring, and automated test pipelines.\n- Hands-on experience with Retrieval-Augmented Generation (RAG) applications.\n\nShared by Sadia Afrin (Class of '22, Lead Cloud Architect). Contact for internal referral!",
    "companyId": "cmw32xqfl000lz4r7xc606xxg",
    "companyName": "Brain Station 23",
    "companyLogo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80",
    "type": "INTERNSHIP",
    "posterId": "cmw8zilp5000zidr7hfoq6b8j",
    "sourceType": "COMMUNITY_SHARED",
    "status": "APPROVED",
    "minCgpa": 3.2,
    "minAcademicYear": "3rd Year",
    "requiredSkills": [
      "AWS",
      "Python",
      "FastAPI",
      "Docker",
      "PostgreSQL",
      "REST APIs"
    ],
    "targetDepartments": [
      "Computer Science & Engineering",
      "Software Engineering",
      "Mathematics"
    ],
    "openToAllDepartments": false,
    "salaryOrStipend": "BDT 30,000 / month (Paid Internship)",
    "location": "Mohakhali DOHS, Dhaka",
    "workplaceType": "HYBRID",
    "applicationMethod": "EXTERNAL",
    "externalUrl": "https://brainstation-23.com/career/",
    "contactEmail": "sadia.afrin.alumni@brainstation-23.com",
    "deadline": "2026-12-29T15:25:18.730Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-14T15:25:18.786Z",
    "updatedAt": "2026-11-14T15:25:18.786Z"
  },
  {
    "id": "cmwgk4rzm001w6pr7rc5j7vps",
    "title": "Associate Software Engineer (Healthcare Java Specialist)",
    "description": "Therap (BD) Ltd. is hiring Associate Software Engineers for its healthcare technology platform. We provide comprehensive documentation software for thousands of disability care agencies across the United States.\n\nRequirements:\n- Strong grasp of Data Structures, Algorithms, and Object-Oriented Programming in Java.\n- Solid understanding of relational database normalization and indexing in PostgreSQL.\n- Dedication to writing clean, maintainable, production-ready code.\n\nShared by Mahfuzur Rahman (Principal Software Engineer). Email for application tips and internal referral!",
    "companyId": "cmwgk4rdx001l6pr7p6l8034t",
    "companyName": "Therap (BD) Ltd.",
    "companyLogo": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&auto=format&fit=crop&q=80",
    "type": "FULL_TIME",
    "posterId": "cmw8zily10013idr76p7t5rje",
    "sourceType": "COMMUNITY_SHARED",
    "status": "APPROVED",
    "minCgpa": 3.3,
    "minAcademicYear": "4th Year",
    "requiredSkills": [
      "Java",
      "J2EE",
      "PostgreSQL",
      "Algorithms",
      "Object-Oriented Design"
    ],
    "targetDepartments": [
      "Computer Science & Engineering",
      "Software Engineering"
    ],
    "openToAllDepartments": false,
    "salaryOrStipend": "BDT 75,000 - 95,000 / month + Annual Bonus",
    "location": "Banani, Dhaka",
    "workplaceType": "ON_SITE",
    "applicationMethod": "EXTERNAL",
    "externalUrl": "https://therapbd.com/careers/",
    "contactEmail": "mahfuz.rahman.alumni@therapbd.com",
    "deadline": "2026-12-19T15:25:18.841Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-14T15:25:18.898Z",
    "updatedAt": "2026-11-14T15:25:18.898Z"
  },
  {
    "id": "cmwgk4s2n001x6pr7xg4qy0ry",
    "title": "Biometrics & Computer Vision Research Intern",
    "description": "TigerIT R&D is inviting passionate engineering undergraduates for a specialized internship in computer vision, image processing, and fingerprint / facial biometric matching engines.\n\nWhat You Will Do:\n- Experiment with biometric image enhancement, segmentation, and feature extraction.\n- Benchmark C++ algorithm implementations against high-volume identity datasets.\n- Collaborate with senior cryptography and systems engineers.\n\nShared by Kazi Nahian (JnU SWE '21). Open to candidate inquiries!",
    "companyId": "cmwgk4rfk001m6pr73tgw99c4",
    "companyName": "TigerIT Bangladesh",
    "companyLogo": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&auto=format&fit=crop&q=80",
    "type": "INTERNSHIP",
    "posterId": "cmw8zim6y0017idr7urnpaq8d",
    "sourceType": "COMMUNITY_SHARED",
    "status": "APPROVED",
    "minCgpa": 3.5,
    "minAcademicYear": "3rd Year",
    "requiredSkills": [
      "C++",
      "Python",
      "OpenCV",
      "Linear Algebra",
      "Linux"
    ],
    "targetDepartments": [
      "Computer Science & Engineering",
      "Software Engineering",
      "Electrical & Electronic Engineering"
    ],
    "openToAllDepartments": false,
    "salaryOrStipend": "BDT 35,000 / month",
    "location": "Uttara, Dhaka",
    "workplaceType": "ON_SITE",
    "applicationMethod": "EXTERNAL",
    "externalUrl": "https://tigerit.com/careers/",
    "contactEmail": "kazi.nahian.alumni@tigerit.com",
    "deadline": "2026-12-24T15:25:18.953Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-14T15:25:19.007Z",
    "updatedAt": "2026-11-14T15:25:19.007Z"
  },
  {
    "id": "cmwgk4s5p001y6pr7a0b73qks",
    "title": "On-Device Deep Learning & Mobile AI Engineer",
    "description": "Samsung R&D Institute Bangladesh is hiring talented fresh graduates for the Mobile Intelligence and Camera AI divisions.\n\nKey Responsibilities:\n- Quantize, prune, and optimize deep neural networks for deployment on Samsung Galaxy smartphone chips.\n- Develop embedded C++ inference modules leveraging Neural Processing Units (NPUs).\n- Work on cutting-edge generative photo editing, computational photography, and on-device natural language understanding.\n\nShared by Farhana Yesmin (JnU CSE '22). Feel free to mail me for referral guidance!",
    "companyId": "cmwgk4rh2001n6pr796bbvjh5",
    "companyName": "Samsung R&D Institute Bangladesh",
    "companyLogo": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200&auto=format&fit=crop&q=80",
    "type": "FULL_TIME",
    "posterId": "cmw8zimfr001bidr7ny0k72sl",
    "sourceType": "COMMUNITY_SHARED",
    "status": "APPROVED",
    "minCgpa": 3.5,
    "minAcademicYear": "4th Year",
    "requiredSkills": [
      "C++",
      "Python",
      "TensorFlow Lite",
      "PyTorch",
      "Algorithms"
    ],
    "targetDepartments": [
      "Computer Science & Engineering",
      "Software Engineering"
    ],
    "openToAllDepartments": false,
    "salaryOrStipend": "BDT 90,000 - 115,000 / month",
    "location": "Bir Uttam Mir Shawkat Sarak, Dhaka",
    "workplaceType": "ON_SITE",
    "applicationMethod": "EXTERNAL",
    "externalUrl": "https://research.samsung.com/srbd",
    "contactEmail": "farhana.yesmin.alumni@samsung.com",
    "deadline": "2027-01-03T15:25:19.063Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-14T15:25:19.118Z",
    "updatedAt": "2026-11-14T15:25:19.118Z"
  },
  {
    "id": "cmwgk4s8s001z6pr7xvjek2iq",
    "title": "Full-Stack Software Engineer (Functional Microservices)",
    "description": "Join Chaldal's core engineering team building the software engines that power grocery delivery across Bangladesh in under 1 hour.\n\nTechnologies:\n- Functional backend services in F# and .NET Core.\n- Dynamic web micro-frontends in React and TypeScript.\n- High-efficiency warehouse automation pick algorithms.\n\nShared by Al-Amin Hossain (JnU CSE '23). Contact for direct referral code!",
    "companyId": "cmwgk4ril001o6pr7x2m0sb63",
    "companyName": "Chaldal Limited",
    "companyLogo": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80",
    "type": "FULL_TIME",
    "posterId": "cmw8zimoo001fidr7gceqsc6q",
    "sourceType": "COMMUNITY_SHARED",
    "status": "APPROVED",
    "minCgpa": 3.2,
    "minAcademicYear": "4th Year",
    "requiredSkills": [
      "TypeScript",
      "React",
      "F#",
      ".NET",
      "PostgreSQL"
    ],
    "targetDepartments": [
      "Computer Science & Engineering",
      "Software Engineering"
    ],
    "openToAllDepartments": false,
    "salaryOrStipend": "BDT 70,000 - 90,000 / month",
    "location": "Jashimuddin, Dhaka",
    "workplaceType": "HYBRID",
    "applicationMethod": "EXTERNAL",
    "externalUrl": "https://chaldal.com/careers",
    "contactEmail": "alamin.hossain.alumni@chaldal.com",
    "deadline": "2026-12-09T15:25:19.173Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-14T15:25:19.229Z",
    "updatedAt": "2026-11-14T15:25:19.229Z"
  },
  {
    "id": "cmwgk4sbv00206pr7n1ks90aj",
    "title": "Distributed Telemetry Systems Intern (Go & Kafka)",
    "description": "Optimizely is seeking talented computer science and engineering undergraduates for our high-scale telemetry ingestion pipeline team in Dhaka. You will work on real-time event streaming systems processing billions of daily events with Go, gRPC, and Apache Kafka.\n\nShared by Sayed Mahmud Hasan (JnU SWE '21). Open to candidate inquiries!",
    "companyId": "cmwgk4rkc001p6pr703ygljd6",
    "companyName": "Optimizely Bangladesh",
    "companyLogo": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&auto=format&fit=crop&q=80",
    "type": "INTERNSHIP",
    "posterId": "cmw8zinfb001sidr756wc25l0",
    "sourceType": "COMMUNITY_SHARED",
    "status": "APPROVED",
    "minCgpa": 3.3,
    "minAcademicYear": "3rd Year",
    "requiredSkills": [
      "Go",
      "Distributed Systems",
      "Docker",
      "gRPC",
      "PostgreSQL"
    ],
    "targetDepartments": [
      "Computer Science & Engineering",
      "Software Engineering"
    ],
    "openToAllDepartments": false,
    "salaryOrStipend": "BDT 40,000 / month (Paid Internship)",
    "location": "Gulshan-2, Dhaka",
    "workplaceType": "HYBRID",
    "applicationMethod": "EXTERNAL",
    "externalUrl": "https://www.optimizely.com/careers/",
    "contactEmail": "sayed.hasan.alumni@optimizely.com",
    "deadline": "2026-12-14T15:25:19.283Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-14T15:25:19.339Z",
    "updatedAt": "2026-11-14T15:25:19.339Z"
  },
  {
    "id": "cmwgk4sfe00216pr710b5py25",
    "title": "Management Trainee — Corporate Banking & Credit Risk",
    "description": "Elite rotational management program across commercial lending, syndicated credit modeling, and treasury risk management at BRAC Bank PLC.\n\nShared by Sabrina Rahman (Alumna). Reach out for alumni referral support!",
    "companyId": "cmwgk4rot001s6pr7mfnqgd5x",
    "companyName": "BRAC Bank PLC",
    "companyLogo": "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=200&auto=format&fit=crop&q=80",
    "type": "FULL_TIME",
    "posterId": "cmwgk4qsj001b6pr78xfu201h",
    "sourceType": "COMMUNITY_SHARED",
    "status": "APPROVED",
    "minCgpa": 3.3,
    "minAcademicYear": "4th Year",
    "requiredSkills": [
      "Financial Analysis",
      "Credit Risk",
      "Accounting",
      "Excel"
    ],
    "targetDepartments": [
      "Finance & Banking",
      "Accounting & Information Systems",
      "Economics"
    ],
    "openToAllDepartments": false,
    "salaryOrStipend": "BDT 65,000 / month",
    "location": "Motijheel, Dhaka",
    "workplaceType": "ON_SITE",
    "applicationMethod": "EXTERNAL",
    "externalUrl": "https://www.bracbank.com/en/career",
    "contactEmail": "sabrina.rahman.alumni@bkash.com",
    "deadline": "2026-12-19T15:25:19.393Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-14T15:25:19.466Z",
    "updatedAt": "2026-11-14T15:25:19.466Z"
  },
  {
    "id": "cmwgk4sik00226pr7tgyuaqho",
    "title": "Undergraduate Teaching Assistant (Data Structures & Algorithms)",
    "description": "Department of CSE is recruiting 3 undergraduate teaching assistants for CSE 2101 (Data Structures) and CSE 2201 (Algorithms Lab) for the upcoming semester.\n\nShared by Dr. Mahbubur Rahman. Apply directly or contact faculty coordinator!",
    "companyId": "cmw32xqfl000lz4r7xc606xxg",
    "companyName": "Jagannath University Dept of CSE",
    "companyLogo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80",
    "type": "PART_TIME",
    "posterId": "cmwgk4r1r001f6pr7586h1bzs",
    "sourceType": "COMMUNITY_SHARED",
    "status": "APPROVED",
    "minCgpa": 3.7,
    "minAcademicYear": "4th Year",
    "requiredSkills": [
      "C++",
      "Data Structures",
      "Algorithms",
      "Teaching"
    ],
    "targetDepartments": [
      "Computer Science & Engineering"
    ],
    "openToAllDepartments": false,
    "salaryOrStipend": "BDT 15,000 / month (10 hrs/week)",
    "location": "Science Building, Jagannath University",
    "workplaceType": "ON_SITE",
    "applicationMethod": "EXTERNAL",
    "externalUrl": "https://cse.jnu.ac.bd",
    "contactEmail": "mahbub.faculty@unicareer.edu",
    "deadline": "2026-12-04T15:25:19.526Z",
    "reviewerId": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-11-14T15:25:19.580Z",
    "updatedAt": "2026-11-14T15:25:19.580Z"
  }
]
```

---

## `companies`

* **Domain:** Jobs and applications
* **Description:** Partner employer directory
* **Total Rows:** 32

```json
[
  {
    "id": "cmw32xq88000kz4r7tpgtvkba",
    "name": "bKash Limited",
    "slug": "bkash-limited",
    "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=200&auto=format&fit=crop&q=80",
    "description": "The largest mobile financial service provider in Bangladesh, serving over 70 million customers with resilient, high-volume transactional infrastructure.",
    "website": "https://bkash.com",
    "industry": "Financial Technology",
    "location": "Dhaka, Bangladesh",
    "isVerified": true,
    "isSuspended": false,
    "createdById": "cmw32x6lo000gx6r7cxbbtlrb",
    "createdAt": "2026-11-05T05:02:56.264Z",
    "updatedAt": "2026-11-14T15:25:45.985Z"
  },
  {
    "id": "cmw34e49o00021sr7eobs2iod",
    "name": "TechCorp Solutions",
    "slug": "techcorp-1793857420044",
    "logo": null,
    "description": null,
    "website": null,
    "industry": "Information Technology",
    "location": "Dhaka",
    "isVerified": false,
    "isSuspended": false,
    "createdById": "cmw32x6lo000gx6r7cxbbtlrb",
    "createdAt": "2026-11-05T05:43:40.572Z",
    "updatedAt": "2026-11-09T14:51:40.648Z"
  },
  {
    "id": "cmw32xpsq000iz4r75hqv4nv6",
    "name": "Optimizely",
    "slug": "optimizely",
    "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&auto=format&fit=crop&q=80",
    "description": "Leading digital experience and experimentation software company with core high-scale engineering hubs across Dhaka, Austin, and Stockholm.",
    "website": "https://optimizely.com",
    "industry": "Software & Cloud Services",
    "location": "Gulshan-2, Dhaka",
    "isVerified": true,
    "isSuspended": false,
    "createdById": "cmw32x6lo000gx6r7cxbbtlrb",
    "createdAt": "2026-11-05T05:02:55.706Z",
    "updatedAt": "2026-11-05T09:10:34.294Z"
  },
  {
    "id": "cmw38q9fi0002syr7z5i7m83t",
    "name": "TechCorp Solutions",
    "slug": "techcorp-1793864705086",
    "logo": null,
    "description": null,
    "website": null,
    "industry": "Information Technology",
    "location": "Dhaka",
    "isVerified": false,
    "isSuspended": false,
    "createdById": "cmw32x6lo000gx6r7cxbbtlrb",
    "createdAt": "2026-11-05T07:45:05.598Z",
    "updatedAt": "2026-11-09T14:51:40.753Z"
  },
  {
    "id": "cmw3bo5q600133jr78f73fim1",
    "name": "Databricks",
    "slug": "databricks",
    "logo": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&auto=format&fit=crop&q=80",
    "description": "The data and AI company. More than 10,000 organizations worldwide rely on the Databricks Data Intelligence Platform to unify data, analytics, and AI.",
    "website": "https://databricks.com",
    "industry": "Big Data & AI",
    "location": "San Francisco, CA / Remote",
    "isVerified": true,
    "isSuspended": false,
    "createdById": "cmw32x6lo000gx6r7cxbbtlrb",
    "createdAt": "2026-11-05T09:07:26.334Z",
    "updatedAt": "2026-11-05T09:10:34.350Z"
  },
  {
    "id": "cmw32xqfl000lz4r7xc606xxg",
    "name": "Brain Station 23",
    "slug": "brain-station-23",
    "logo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80",
    "description": "Premier enterprise software and cloud exporter from Bangladesh, building fintech, healthcare, and enterprise cloud solutions for Europe and North America.",
    "website": "https://brainstation-23.com",
    "industry": "Enterprise Software & Cloud",
    "location": "Mohakhali DOHS, Dhaka",
    "isVerified": true,
    "isSuspended": false,
    "createdById": "cmw32x6lo000gx6r7cxbbtlrb",
    "createdAt": "2026-11-05T05:02:56.529Z",
    "updatedAt": "2026-11-14T15:25:46.040Z"
  },
  {
    "id": "cmw3bo5um00163jr72ih86ezy",
    "name": "Augmedix Bangladesh",
    "slug": "augmedix-bangladesh",
    "logo": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&auto=format&fit=crop&q=80",
    "description": "HealthTech pioneer transforming ambient clinician-patient conversations into structured medical records with NLP and generative AI.",
    "website": "https://augmedix.com",
    "industry": "HealthTech & AI",
    "location": "Panthapath, Dhaka",
    "isVerified": true,
    "isSuspended": false,
    "createdById": "cmw32x6lo000gx6r7cxbbtlrb",
    "createdAt": "2026-11-05T09:07:26.494Z",
    "updatedAt": "2026-11-05T09:10:34.515Z"
  },
  {
    "id": "cmw3bo5my00113jr76m6pt4om",
    "name": "Vercel",
    "slug": "vercel",
    "logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
    "description": "Frontend cloud platform and creator of Next.js, empowering developers to build fast, resilient global web applications.",
    "website": "https://vercel.com",
    "industry": "Cloud & DevTools",
    "location": "San Francisco, CA / Remote",
    "isVerified": true,
    "isSuspended": false,
    "createdById": "cmw32x6lo000gx6r7cxbbtlrb",
    "createdAt": "2026-11-05T09:07:26.218Z",
    "updatedAt": "2026-11-07T17:50:15.967Z"
  },
  {
    "id": "cmw338xf60002xnr7t7khu6mo",
    "name": "TechCorp Solutions",
    "slug": "techcorp-1793855498296",
    "logo": null,
    "description": null,
    "website": null,
    "industry": "Information Technology",
    "location": "Dhaka",
    "isVerified": false,
    "isSuspended": false,
    "createdById": "cmw32x6lo000gx6r7cxbbtlrb",
    "createdAt": "2026-11-05T05:11:38.802Z",
    "updatedAt": "2026-11-09T14:51:42.168Z"
  },
  {
    "id": "cmw33e8ca0002f2r7d36xqd1x",
    "name": "TechCorp Solutions",
    "slug": "techcorp-1793855745714",
    "logo": null,
    "description": null,
    "website": null,
    "industry": "Information Technology",
    "location": "Dhaka",
    "isVerified": false,
    "isSuspended": false,
    "createdById": "cmw32x6lo000gx6r7cxbbtlrb",
    "createdAt": "2026-11-05T05:15:46.234Z",
    "updatedAt": "2026-11-09T14:51:42.221Z"
  },
  {
    "id": "cmw34ajmr0002s7r7472je1ng",
    "name": "TechCorp Solutions",
    "slug": "techcorp-1793857253356",
    "logo": null,
    "description": null,
    "website": null,
    "industry": "Information Technology",
    "location": "Dhaka",
    "isVerified": false,
    "isSuspended": false,
    "createdById": "cmw32x6lo000gx6r7cxbbtlrb",
    "createdAt": "2026-11-05T05:40:53.859Z",
    "updatedAt": "2026-11-09T14:51:42.435Z"
  },
  {
    "id": "cmw357rff0002zvr7m61o9yyg",
    "name": "TechCorp Solutions",
    "slug": "techcorp-1793858803056",
    "logo": null,
    "description": null,
    "website": null,
    "industry": "Information Technology",
    "location": "Dhaka",
    "isVerified": false,
    "isSuspended": false,
    "createdById": "cmw32x6lo000gx6r7cxbbtlrb",
    "createdAt": "2026-11-05T06:06:43.611Z",
    "updatedAt": "2026-11-09T14:51:42.488Z"
  },
  {
    "id": "cmw35ay3x00029xr77y5zohiq",
    "name": "TechCorp Solutions",
    "slug": "techcorp-1793858951700",
    "logo": null,
    "description": null,
    "website": null,
    "industry": "Information Technology",
    "location": "Dhaka",
    "isVerified": false,
    "isSuspended": false,
    "createdById": "cmw32x6lo000gx6r7cxbbtlrb",
    "createdAt": "2026-11-05T06:09:12.237Z",
    "updatedAt": "2026-11-09T14:51:42.596Z"
  },
  {
    "id": "cmw366vvi0002chr78zj66wz1",
    "name": "TechCorp Solutions",
    "slug": "techcorp-1793860441807",
    "logo": null,
    "description": null,
    "website": null,
    "industry": "Information Technology",
    "location": "Dhaka",
    "isVerified": false,
    "isSuspended": false,
    "createdById": "cmw32x6lo000gx6r7cxbbtlrb",
    "createdAt": "2026-11-05T06:34:02.334Z",
    "updatedAt": "2026-11-09T14:51:42.704Z"
  },
  {
    "id": "cmw39rocd0002kor7z0j46hue",
    "name": "TechCorp Solutions",
    "slug": "techcorp-1793866450676",
    "logo": null,
    "description": null,
    "website": null,
    "industry": "Information Technology",
    "location": "Dhaka",
    "isVerified": false,
    "isSuspended": false,
    "createdById": "cmw32x6lo000gx6r7cxbbtlrb",
    "createdAt": "2026-11-05T08:14:11.197Z",
    "updatedAt": "2026-11-09T14:51:42.811Z"
  },
  {
    "id": "cmw37570b0002s8r72yll6ai4",
    "name": "TechCorp Solutions",
    "slug": "techcorp-1793862042536",
    "logo": null,
    "description": null,
    "website": null,
    "industry": "Information Technology",
    "location": "Dhaka",
    "isVerified": false,
    "isSuspended": false,
    "createdById": "cmw32x6lo000gx6r7cxbbtlrb",
    "createdAt": "2026-11-05T07:00:43.067Z",
    "updatedAt": "2026-11-09T14:51:42.919Z"
  },
  {
    "id": "cmw38is21000297r7ybso0r66",
    "name": "TechCorp Solutions",
    "slug": "techcorp-1793864355979",
    "logo": null,
    "description": null,
    "website": null,
    "industry": "Information Technology",
    "location": "Dhaka",
    "isVerified": false,
    "isSuspended": false,
    "createdById": "cmw32x6lo000gx6r7cxbbtlrb",
    "createdAt": "2026-11-05T07:39:16.489Z",
    "updatedAt": "2026-11-09T14:51:43.027Z"
  },
  {
    "id": "cmw38m0tf0002i6r7sd5kbxpd",
    "name": "TechCorp Solutions",
    "slug": "techcorp-1793864507295",
    "logo": null,
    "description": null,
    "website": null,
    "industry": "Information Technology",
    "location": "Dhaka",
    "isVerified": false,
    "isSuspended": false,
    "createdById": "cmw32x6lo000gx6r7cxbbtlrb",
    "createdAt": "2026-11-05T07:41:47.811Z",
    "updatedAt": "2026-11-09T14:51:43.192Z"
  },
  {
    "id": "cmw3awiwz0002e2r7lt0w1t7l",
    "name": "TechCorp Solutions",
    "slug": "techcorp-1793868356509",
    "logo": null,
    "description": null,
    "website": null,
    "industry": "Information Technology",
    "location": "Dhaka",
    "isVerified": false,
    "isSuspended": false,
    "createdById": "cmw32x6lo000gx6r7cxbbtlrb",
    "createdAt": "2026-11-05T08:45:57.059Z",
    "updatedAt": "2026-11-09T14:51:43.356Z"
  },
  {
    "id": "cmwgk4rdx001l6pr7p6l8034t",
    "name": "Therap (BD) Ltd.",
    "slug": "therap-bd",
    "logo": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&auto=format&fit=crop&q=80",
    "description": "Global leader in electronic health record documentation for developmental and intellectual disability service providers across the US and Canada.",
    "website": "https://therapbd.com",
    "industry": "Healthcare Technology",
    "location": "Banani, Dhaka",
    "isVerified": true,
    "isSuspended": false,
    "createdById": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "createdAt": "2026-11-14T15:25:18.117Z",
    "updatedAt": "2026-11-14T15:25:46.095Z"
  },
  {
    "id": "cmwgk4rfk001m6pr73tgw99c4",
    "name": "TigerIT Bangladesh",
    "slug": "tigerit-bangladesh",
    "logo": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&auto=format&fit=crop&q=80",
    "description": "Pioneering biometric identity management, AFIS solutions, and large-scale government digitization platforms across Asia and Africa.",
    "website": "https://tigerit.com",
    "industry": "Biometrics & Identity Systems",
    "location": "Uttara, Dhaka",
    "isVerified": true,
    "isSuspended": false,
    "createdById": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "createdAt": "2026-11-14T15:25:18.177Z",
    "updatedAt": "2026-11-14T15:25:46.153Z"
  },
  {
    "id": "cmw3c7ali0002dzr7r4m085c7",
    "name": "TechCorp Solutions",
    "slug": "techcorp-1793870538551",
    "logo": null,
    "description": null,
    "website": null,
    "industry": "Information Technology",
    "location": "Dhaka",
    "isVerified": false,
    "isSuspended": false,
    "createdById": "cmw32x6lo000gx6r7cxbbtlrb",
    "createdAt": "2026-11-05T09:22:19.110Z",
    "updatedAt": "2026-11-09T14:51:44.040Z"
  },
  {
    "id": "cmw3cqjb20002war7d4uojlcr",
    "name": "TechCorp Solutions",
    "slug": "techcorp-1793871436289",
    "logo": null,
    "description": null,
    "website": null,
    "industry": "Information Technology",
    "location": "Dhaka",
    "isVerified": false,
    "isSuspended": false,
    "createdById": "cmw32x6lo000gx6r7cxbbtlrb",
    "createdAt": "2026-11-05T09:37:16.862Z",
    "updatedAt": "2026-11-09T14:51:44.151Z"
  },
  {
    "id": "cmw3czi5o0002tor732z55alv",
    "name": "TechCorp Solutions",
    "slug": "techcorp-1793871854726",
    "logo": null,
    "description": null,
    "website": null,
    "industry": "Information Technology",
    "location": "Dhaka",
    "isVerified": false,
    "isSuspended": false,
    "createdById": "cmw32x6lo000gx6r7cxbbtlrb",
    "createdAt": "2026-11-05T09:44:15.276Z",
    "updatedAt": "2026-11-09T14:51:44.258Z"
  },
  {
    "id": "cmw3e1xi90002eyr7fh7bmbw9",
    "name": "TechCorp Solutions",
    "slug": "techcorp-1793873647445",
    "logo": null,
    "description": null,
    "website": null,
    "industry": "Information Technology",
    "location": "Dhaka",
    "isVerified": false,
    "isSuspended": false,
    "createdById": "cmw32x6lo000gx6r7cxbbtlrb",
    "createdAt": "2026-11-05T10:14:08.097Z",
    "updatedAt": "2026-11-09T14:51:44.366Z"
  },
  {
    "id": "cmwgk4rh2001n6pr796bbvjh5",
    "name": "Samsung R&D Institute Bangladesh",
    "slug": "samsung-rnd-bangladesh",
    "logo": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200&auto=format&fit=crop&q=80",
    "description": "Advanced global research hub for Samsung Electronics, driving on-device AI, mobile camera algorithms, and next-generation Android operating systems.",
    "website": "https://research.samsung.com/srbd",
    "industry": "Mobile Systems & Artificial Intelligence",
    "location": "Bir Uttam Mir Shawkat Sarak, Dhaka",
    "isVerified": true,
    "isSuspended": false,
    "createdById": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "createdAt": "2026-11-14T15:25:18.230Z",
    "updatedAt": "2026-11-14T15:25:46.209Z"
  },
  {
    "id": "cmwgk4ril001o6pr7x2m0sb63",
    "name": "Chaldal Limited",
    "slug": "chaldal-limited",
    "logo": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80",
    "description": "Bangladesh's leading grocery e-commerce and automated dark-store micro-fulfillment tech platform running on functional reactive architecture.",
    "website": "https://chaldal.com",
    "industry": "E-Commerce & Supply Chain",
    "location": "Jashimuddin, Dhaka",
    "isVerified": true,
    "isSuspended": false,
    "createdById": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "createdAt": "2026-11-14T15:25:18.285Z",
    "updatedAt": "2026-11-14T15:25:46.265Z"
  },
  {
    "id": "cmwgk4rkc001p6pr703ygljd6",
    "name": "Optimizely Bangladesh",
    "slug": "optimizely-bangladesh",
    "logo": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&auto=format&fit=crop&q=80",
    "description": "World's leading digital experimentation and customer experience platform with deep telemetry engineering and distributed systems hubs in Dhaka.",
    "website": "https://optimizely.com",
    "industry": "Digital Experimentation & SaaS",
    "location": "Gulshan-2, Dhaka",
    "isVerified": true,
    "isSuspended": false,
    "createdById": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "createdAt": "2026-11-14T15:25:18.348Z",
    "updatedAt": "2026-11-14T15:25:46.320Z"
  },
  {
    "id": "cmwgk4rlt001q6pr7c8xrhkap",
    "name": "ShopUp",
    "slug": "shopup-bangladesh",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=200&auto=format&fit=crop&q=80",
    "description": "Full-stack B2B commerce platform connecting micro-retailers in Bangladesh with mills, manufacturers, and working capital finance.",
    "website": "https://shopup.org",
    "industry": "B2B Commerce & FinTech",
    "location": "Tejgaon Industrial Area, Dhaka",
    "isVerified": true,
    "isSuspended": false,
    "createdById": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "createdAt": "2026-11-14T15:25:18.401Z",
    "updatedAt": "2026-11-14T15:25:46.376Z"
  },
  {
    "id": "cmwgk4rnc001r6pr7wy31ydi8",
    "name": "Pathao",
    "slug": "pathao",
    "logo": "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=200&auto=format&fit=crop&q=80",
    "description": "The digital platform driving consumer logistics, on-demand ride sharing, food delivery, and payments across urban Bangladesh.",
    "website": "https://pathao.com",
    "industry": "On-Demand Mobility & FinTech",
    "location": "Gulshan-1, Dhaka",
    "isVerified": true,
    "isSuspended": false,
    "createdById": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "createdAt": "2026-11-14T15:25:18.456Z",
    "updatedAt": "2026-11-14T15:25:46.432Z"
  },
  {
    "id": "cmwgk4rot001s6pr7mfnqgd5x",
    "name": "BRAC Bank PLC",
    "slug": "brac-bank-plc",
    "logo": "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=200&auto=format&fit=crop&q=80",
    "description": "A fast-growing commercial bank in Bangladesh with an intense focus on SME financing, digital banking transformation, and young leadership.",
    "website": "https://bracbank.com",
    "industry": "Banking & Financial Services",
    "location": "Motijheel, Dhaka",
    "isVerified": true,
    "isSuspended": false,
    "createdById": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "createdAt": "2026-11-14T15:25:18.509Z",
    "updatedAt": "2026-11-14T15:25:46.487Z"
  },
  {
    "id": "cmwgk4rqa001t6pr7rzli9iat",
    "name": "Grameenphone",
    "slug": "grameenphone",
    "logo": "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=200&auto=format&fit=crop&q=80",
    "description": "Leading telecommunications network in Bangladesh, powering 82+ million subscribers and pioneering IoT, 5G testbeds, and enterprise cloud infrastructure.",
    "website": "https://grameenphone.com",
    "industry": "Telecommunications & Cloud",
    "location": "GHouse, Bashundhara, Dhaka",
    "isVerified": true,
    "isSuspended": false,
    "createdById": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "createdAt": "2026-11-14T15:25:18.562Z",
    "updatedAt": "2026-11-14T15:25:46.542Z"
  }
]
```

---

## `applications`

* **Domain:** Jobs and applications
* **Description:** Student application tracker records
* **Total Rows:** 13

```json
[
  {
    "id": "cmwh905oe000008jy2pfd9jj6",
    "opportunityId": "cmwgk4rtb001u6pr7o0vr7j69",
    "applicantId": "cmw32x6lo000gx6r7cxbbtlrb",
    "resumeId": null,
    "coverLetter": null,
    "method": "EXTERNAL",
    "status": "SUBMITTED",
    "externalAppliedAt": "2026-11-15T03:01:33.739Z",
    "externalNotes": null,
    "employerNotes": null,
    "reviewedById": null,
    "reviewedAt": null,
    "submittedAt": "2026-11-15T03:01:33.739Z",
    "updatedAt": "2026-11-15T03:01:33.758Z"
  },
  {
    "id": "cmwhynj3d000008jrloy566o8",
    "opportunityId": "cmwgk4sik00226pr7tgyuaqho",
    "applicantId": "lnCXe6mNhDbNA5kcNrPRCHyIrxn2BLTH",
    "resumeId": null,
    "coverLetter": null,
    "method": "EXTERNAL",
    "status": "SUBMITTED",
    "externalAppliedAt": "2026-11-15T14:59:34.627Z",
    "externalNotes": null,
    "employerNotes": null,
    "reviewedById": null,
    "reviewedAt": null,
    "submittedAt": "2026-11-15T14:59:34.627Z",
    "updatedAt": "2026-11-15T14:59:34.633Z"
  },
  {
    "id": "cmwitvpjo000008jg3afkg7z3",
    "opportunityId": "cmwgk4sfe00216pr710b5py25",
    "applicantId": "zw0XJr3KbwTWoM9S18hfFR3WCgilIzLf",
    "resumeId": null,
    "coverLetter": null,
    "method": "EXTERNAL",
    "status": "SUBMITTED",
    "externalAppliedAt": "2026-11-16T05:33:44.326Z",
    "externalNotes": null,
    "employerNotes": null,
    "reviewedById": null,
    "reviewedAt": null,
    "submittedAt": "2026-11-16T05:33:44.326Z",
    "updatedAt": "2026-11-16T05:33:44.340Z"
  },
  {
    "id": "cmwiuzef2000007jsyuzojb1u",
    "opportunityId": "cmwgk4sbv00206pr7n1ks90aj",
    "applicantId": "zw0XJr3KbwTWoM9S18hfFR3WCgilIzLf",
    "resumeId": null,
    "coverLetter": null,
    "method": "EXTERNAL",
    "status": "SUBMITTED",
    "externalAppliedAt": "2026-11-16T06:04:36.151Z",
    "externalNotes": null,
    "employerNotes": null,
    "reviewedById": null,
    "reviewedAt": null,
    "submittedAt": "2026-11-16T06:04:36.151Z",
    "updatedAt": "2026-11-16T06:04:36.159Z"
  },
  {
    "id": "cmwkpctll000108k2zpi8dh88",
    "opportunityId": "cmwgk4sik00226pr7tgyuaqho",
    "applicantId": "cmw32x6lo000gx6r7cxbbtlrb",
    "resumeId": null,
    "coverLetter": null,
    "method": "EXTERNAL",
    "status": "SUBMITTED",
    "externalAppliedAt": "2026-11-17T13:02:37.015Z",
    "externalNotes": null,
    "employerNotes": null,
    "reviewedById": null,
    "reviewedAt": null,
    "submittedAt": "2026-11-17T13:02:37.015Z",
    "updatedAt": "2026-11-17T13:02:37.017Z"
  },
  {
    "id": "cmw3bo7aw001l3jr7wc9twwmp",
    "opportunityId": "cmw3bo62m00193jr7myshy0i5",
    "applicantId": "cmw3bo4ip000j3jr7a4gq18s0",
    "resumeId": "cmw3bo6vd001h3jr7it569nfk",
    "coverLetter": "My recent project implementing Raft consensus in Go directly aligns with Optimizely's distributed event streaming infrastructure.",
    "method": "INTERNAL",
    "status": "UNDER_REVIEW",
    "externalAppliedAt": null,
    "externalNotes": null,
    "employerNotes": "Reviewing Raft consensus KV-store implementation in Go.",
    "reviewedById": null,
    "reviewedAt": null,
    "submittedAt": "2026-11-05T09:07:28.376Z",
    "updatedAt": "2026-11-05T09:10:36.385Z"
  },
  {
    "id": "cmwh912sp000008kzfc2kbvhg",
    "opportunityId": "cmwgk4sik00226pr7tgyuaqho",
    "applicantId": "cmw54b766005cuar7sdkyfuq8",
    "resumeId": null,
    "coverLetter": null,
    "method": "EXTERNAL",
    "status": "SUBMITTED",
    "externalAppliedAt": "2026-11-15T03:02:16.673Z",
    "externalNotes": null,
    "employerNotes": null,
    "reviewedById": null,
    "reviewedAt": null,
    "submittedAt": "2026-11-15T03:02:16.673Z",
    "updatedAt": "2026-11-15T03:02:16.681Z"
  },
  {
    "id": "cmw3br5u100149gr7tfh8v30d",
    "opportunityId": "cmw32xqoq000nz4r7qkmyx2rz",
    "applicantId": "cmw3bo4ip000j3jr7a4gq18s0",
    "resumeId": "cmw3bo6vd001h3jr7it569nfk",
    "coverLetter": "Passionate about high-concurrency ACID transactions and distributed databases. Seeking to contribute to national fintech rail.",
    "method": "INTERNAL",
    "status": "INTERVIEW",
    "externalAppliedAt": null,
    "externalNotes": null,
    "employerNotes": "Technical architecture panel scheduled for next Tuesday at 3:00 PM.",
    "reviewedById": "cmw32x6lo000gx6r7cxbbtlrb",
    "reviewedAt": "2026-11-05T09:10:36.438Z",
    "submittedAt": "2026-11-05T09:09:46.441Z",
    "updatedAt": "2026-11-05T09:10:36.439Z"
  },
  {
    "id": "cmw3br5x400169gr7kj8md6rg",
    "opportunityId": "cmw3bo68r001a3jr72sghbymg",
    "applicantId": "cmw3bo4p1000m3jr79ogndqat",
    "resumeId": "cmw3bo72p001i3jr79ht3d13o",
    "coverLetter": "Excited about deploying production transformers and microservices for international enterprise clients.",
    "method": "INTERNAL",
    "status": "SUBMITTED",
    "externalAppliedAt": null,
    "externalNotes": null,
    "employerNotes": null,
    "reviewedById": null,
    "reviewedAt": null,
    "submittedAt": "2026-11-05T09:09:46.552Z",
    "updatedAt": "2026-11-05T09:10:36.547Z"
  },
  {
    "id": "cmwiv4lt1000307jshj7c978s",
    "opportunityId": "cmwgk4s2n001x6pr7xg4qy0ry",
    "applicantId": "zw0XJr3KbwTWoM9S18hfFR3WCgilIzLf",
    "resumeId": null,
    "coverLetter": null,
    "method": "EXTERNAL",
    "status": "SUBMITTED",
    "externalAppliedAt": "2026-11-16T06:08:39.013Z",
    "externalNotes": null,
    "employerNotes": null,
    "reviewedById": null,
    "reviewedAt": null,
    "submittedAt": "2026-11-16T06:08:39.013Z",
    "updatedAt": "2026-11-16T06:08:39.013Z"
  },
  {
    "id": "cmw5618u8000808l4n420vygh",
    "opportunityId": "cmw3e1xn20005eyr737585ldz",
    "applicantId": "cmw54b6zy0059uar7d57zug0h",
    "resumeId": null,
    "coverLetter": null,
    "method": "EXTERNAL",
    "status": "SUBMITTED",
    "externalAppliedAt": "2026-11-06T16:05:11.550Z",
    "externalNotes": null,
    "employerNotes": null,
    "reviewedById": null,
    "reviewedAt": null,
    "submittedAt": "2026-11-06T16:05:11.550Z",
    "updatedAt": "2026-11-06T16:05:11.552Z"
  },
  {
    "id": "cmw3bo774001j3jr7hhn3czx5",
    "opportunityId": "cmw3bo5zj00183jr75l0pisqb",
    "applicantId": "cmw3bo4ip000j3jr7a4gq18s0",
    "resumeId": "cmw3bo6vd001h3jr7it569nfk",
    "coverLetter": "I have been building full-stack applications with Next.js and React Server Components for two years. I would be honored to contribute to Vercel's mission.",
    "method": "INTERNAL",
    "status": "SHORTLISTED",
    "externalAppliedAt": null,
    "externalNotes": null,
    "employerNotes": "Outstanding Next.js portfolio and clean GitHub projects. Invited for round 1 technical interview.",
    "reviewedById": null,
    "reviewedAt": "2026-11-05T09:10:36.274Z",
    "submittedAt": "2026-11-05T09:07:28.240Z",
    "updatedAt": "2026-11-05T09:10:36.275Z"
  },
  {
    "id": "cmwg232df000108l5bzwciiz3",
    "opportunityId": "cmwg1yms1000008l5q2v9h1pr",
    "applicantId": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "resumeId": null,
    "coverLetter": null,
    "method": "EXTERNAL",
    "status": "SUBMITTED",
    "externalAppliedAt": "2026-11-14T07:00:05.952Z",
    "externalNotes": null,
    "employerNotes": null,
    "reviewedById": null,
    "reviewedAt": null,
    "submittedAt": "2026-11-14T07:00:05.952Z",
    "updatedAt": "2026-11-14T07:00:05.955Z"
  }
]
```

---

## `application_status_history`

* **Domain:** Jobs and applications
* **Description:** Status audit history timeline
* **Total Rows:** 11

```json
[
  {
    "id": "cmwh9066x000108jyg16dz3bp",
    "applicationId": "cmwh905oe000008jy2pfd9jj6",
    "status": "SUBMITTED",
    "note": "External application recorded by member.",
    "changedById": "cmw32x6lo000gx6r7cxbbtlrb",
    "createdAt": "2026-11-15T03:01:34.426Z"
  },
  {
    "id": "cmwhynjmd000108jrbwvyrekd",
    "applicationId": "cmwhynj3d000008jrloy566o8",
    "status": "SUBMITTED",
    "note": "External application recorded by member.",
    "changedById": "lnCXe6mNhDbNA5kcNrPRCHyIrxn2BLTH",
    "createdAt": "2026-11-15T14:59:35.317Z"
  },
  {
    "id": "cmwitvq1z000108jggeopj1p3",
    "applicationId": "cmwitvpjo000008jg3afkg7z3",
    "status": "SUBMITTED",
    "note": "External application recorded by member.",
    "changedById": "zw0XJr3KbwTWoM9S18hfFR3WCgilIzLf",
    "createdAt": "2026-11-16T05:33:44.999Z"
  },
  {
    "id": "cmwiuzey6000107js85s26nlp",
    "applicationId": "cmwiuzef2000007jsyuzojb1u",
    "status": "SUBMITTED",
    "note": "External application recorded by member.",
    "changedById": "zw0XJr3KbwTWoM9S18hfFR3WCgilIzLf",
    "createdAt": "2026-11-16T06:04:36.846Z"
  },
  {
    "id": "cmwkpcu4g000208k20x7zbmtf",
    "applicationId": "cmwkpctll000108k2zpi8dh88",
    "status": "SUBMITTED",
    "note": "External application recorded by member.",
    "changedById": "cmw32x6lo000gx6r7cxbbtlrb",
    "createdAt": "2026-11-17T13:02:37.696Z"
  },
  {
    "id": "cmwh913ag000108kz1kzsg8oc",
    "applicationId": "cmwh912sp000008kzfc2kbvhg",
    "status": "SUBMITTED",
    "note": "External application recorded by member.",
    "changedById": "cmw54b766005cuar7sdkyfuq8",
    "createdAt": "2026-11-15T03:02:17.320Z"
  },
  {
    "id": "cmwiv4mbm000407js02fjwkgp",
    "applicationId": "cmwiv4lt1000307jshj7c978s",
    "status": "SUBMITTED",
    "note": "External application recorded by member.",
    "changedById": "zw0XJr3KbwTWoM9S18hfFR3WCgilIzLf",
    "createdAt": "2026-11-16T06:08:39.682Z"
  },
  {
    "id": "cmw3br5vl00159gr7psm8erfd",
    "applicationId": "cmw3br5u100149gr7tfh8v30d",
    "status": "INTERVIEW",
    "note": "System design round scheduled with core engineering panel.",
    "changedById": "cmw32x6lo000gx6r7cxbbtlrb",
    "createdAt": "2026-11-05T09:09:46.497Z"
  },
  {
    "id": "cmw3bs8gd0015d6r7i4far65d",
    "applicationId": "cmw3br5u100149gr7tfh8v30d",
    "status": "INTERVIEW",
    "note": "System design round scheduled with core engineering panel.",
    "changedById": "cmw32x6lo000gx6r7cxbbtlrb",
    "createdAt": "2026-11-05T09:10:36.493Z"
  },
  {
    "id": "cmw5619cm000908l4mi3yk83t",
    "applicationId": "cmw5618u8000808l4n420vygh",
    "status": "SUBMITTED",
    "note": "External application recorded by member.",
    "changedById": "cmw54b6zy0059uar7d57zug0h",
    "createdAt": "2026-11-06T16:05:12.214Z"
  },
  {
    "id": "cmwg232wb000208l57f05sg9f",
    "applicationId": "cmwg232df000108l5bzwciiz3",
    "status": "SUBMITTED",
    "note": "External application recorded by member.",
    "changedById": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "createdAt": "2026-11-14T07:00:06.635Z"
  }
]
```

---

## `opportunity_bookmarks`

* **Domain:** Jobs and applications
* **Description:** Saved job opportunities
* **Total Rows:** 8

```json
[
  {
    "id": "cmwkz2g7j001jrer7otiawowo",
    "userId": "9eX2XFGRfXneGZFXb37Qdpo0RhAPWzSx",
    "opportunityId": "cmw32xqlm000mz4r7zz8n7cf6",
    "createdAt": "2026-11-17T17:34:29.263Z"
  },
  {
    "id": "cmwkz2g9d001krer7rcy8vxr1",
    "userId": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "opportunityId": "cmw32xqoq000nz4r7qkmyx2rz",
    "createdAt": "2026-11-17T17:34:29.329Z"
  },
  {
    "id": "cmwkz2gax001lrer7w3ky4i0q",
    "userId": "RIJPFcXMMKdUlnlTRBSMuFZANw97nzSe",
    "opportunityId": "cmw32xqrt000oz4r7zcvq6fd1",
    "createdAt": "2026-11-17T17:34:29.385Z"
  },
  {
    "id": "cmwkz2gcg001mrer77x6e1c0m",
    "userId": "VIbCmTGFv3plionrQgC4QHcQ8VLxIjLg",
    "opportunityId": "cmw32xquu000pz4r7kbmmyc8p",
    "createdAt": "2026-11-17T17:34:29.440Z"
  },
  {
    "id": "cmwkz2gdy001nrer76hg9ks0r",
    "userId": "cmw3bo4ip000j3jr7a4gq18s0",
    "opportunityId": "cmw32xqxv000qz4r7vlpk8rwn",
    "createdAt": "2026-11-17T17:34:29.494Z"
  },
  {
    "id": "cmwkz2gfh001orer7sfvh97y2",
    "userId": "cmw3bo4p1000m3jr79ogndqat",
    "opportunityId": "cmw32xr10000rz4r7hjp6y1nr",
    "createdAt": "2026-11-17T17:34:29.549Z"
  },
  {
    "id": "cmwkz2gh0001prer7ebk0koxo",
    "userId": "cmw54b6zy0059uar7d57zug0h",
    "opportunityId": "cmw338xi70004xnr7iivmuqyt",
    "createdAt": "2026-11-17T17:34:29.604Z"
  },
  {
    "id": "cmwkz2gna001qrer7nb881mkk",
    "userId": "cmw8zijo20003idr7iajyx8sj",
    "opportunityId": "cmw338xjs0005xnr77yuoqbvq",
    "createdAt": "2026-11-17T17:34:29.830Z"
  }
]
```

---

## `opportunity_comments`

* **Domain:** Jobs and applications
* **Description:** Public questions and answers under jobs
* **Total Rows:** 8

```json
[
  {
    "id": "cmwkz2f1p000vrer7frl2lwse",
    "opportunityId": "cmw32xqlm000mz4r7zz8n7cf6",
    "authorId": "9eX2XFGRfXneGZFXb37Qdpo0RhAPWzSx",
    "content": "Is this opening eligible for 2026 graduating batch students from JnU CSE?",
    "createdAt": "2026-11-16T09:34:27.756Z",
    "updatedAt": "2026-11-17T17:34:27.757Z"
  },
  {
    "id": "cmwkz2f3a000wrer77h9mziwd",
    "opportunityId": "cmw32xqoq000nz4r7qkmyx2rz",
    "authorId": "cmw3bo551000s3jr7amz6hxy9",
    "content": "Yes! Final-year undergraduate students with CGPA >= 3.50 are welcome to apply.",
    "createdAt": "2026-11-16T13:34:27.813Z",
    "updatedAt": "2026-11-17T17:34:27.814Z"
  },
  {
    "id": "cmwkz2f4s000xrer7vruw1t3i",
    "opportunityId": "cmw32xqrt000oz4r7zcvq6fd1",
    "authorId": "RIJPFcXMMKdUlnlTRBSMuFZANw97nzSe",
    "content": "Does this position support hybrid work during university semester final examination periods?",
    "createdAt": "2026-11-16T17:34:27.867Z",
    "updatedAt": "2026-11-17T17:34:27.868Z"
  },
  {
    "id": "cmwkz2f6a000yrer72fsf8kja",
    "opportunityId": "cmw32xquu000pz4r7kbmmyc8p",
    "authorId": "cmw8zilg9000vidr7nzmteig6",
    "content": "Yes, flexible hybrid arrangements are supported during semester finals.",
    "createdAt": "2026-11-16T21:34:27.921Z",
    "updatedAt": "2026-11-17T17:34:27.922Z"
  },
  {
    "id": "cmwkz2f7s000zrer7eymh9tur",
    "opportunityId": "cmw32xqxv000qz4r7vlpk8rwn",
    "authorId": "cmw3bo4ip000j3jr7a4gq18s0",
    "content": "What tech stack will the engineering team primarily focus on during the initial 6 months?",
    "createdAt": "2026-11-17T01:34:27.976Z",
    "updatedAt": "2026-11-17T17:34:27.976Z"
  },
  {
    "id": "cmwkz2f9c0010rer7blout9c2",
    "opportunityId": "cmw32xr10000rz4r7hjp6y1nr",
    "authorId": "cmw8zily10013idr76p7t5rje",
    "content": "The core stack is Next.js 15, TypeScript, PostgreSQL, Docker, and Apache Kafka for event pipelines.",
    "createdAt": "2026-11-17T05:34:28.031Z",
    "updatedAt": "2026-11-17T17:34:28.032Z"
  },
  {
    "id": "cmwkz2faw0011rer718fq2kc7",
    "opportunityId": "cmw338xi70004xnr7iivmuqyt",
    "authorId": "cmw54b6zy0059uar7d57zug0h",
    "content": "Is there an online coding assessment before the technical interview?",
    "createdAt": "2026-11-17T09:34:28.087Z",
    "updatedAt": "2026-11-17T17:34:28.088Z"
  },
  {
    "id": "cmwkz2fcg0012rer7lxn403nu",
    "opportunityId": "cmw338xjs0005xnr77yuoqbvq",
    "authorId": "cmw8zimfr001bidr7ny0k72sl",
    "content": "Yes, an 80-minute online assessment covering Data Structures, Algorithms, and SQL queries.",
    "createdAt": "2026-11-17T13:34:28.144Z",
    "updatedAt": "2026-11-17T17:34:28.144Z"
  }
]
```

---

## `manual_applications`

* **Domain:** Jobs and applications
* **Description:** Student tracker for external off-campus jobs
* **Total Rows:** 8

```json
[
  {
    "id": "cmwkz2eny000nrer7v81nl42i",
    "userId": "9eX2XFGRfXneGZFXb37Qdpo0RhAPWzSx",
    "companyName": "Google",
    "roleTitle": "Software Engineering Intern - Cloud",
    "location": "Bangalore / Remote",
    "jobUrl": null,
    "notes": "Technical screen passed. System design round scheduled.",
    "status": "INTERVIEWING",
    "appliedDate": "2026-11-11T17:34:27.260Z",
    "createdAt": "2026-11-17T17:34:27.262Z",
    "updatedAt": "2026-11-17T17:34:27.262Z"
  },
  {
    "id": "cmwkz2eph000orer7awh9zq19",
    "userId": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "companyName": "Therap BD",
    "roleTitle": "Software Engineer (Java Track)",
    "location": "Dhaka, Bangladesh",
    "jobUrl": null,
    "notes": "Applied via Therap career portal. Waiting for written exam schedule.",
    "status": "APPLIED",
    "appliedDate": "2026-11-08T17:34:27.317Z",
    "createdAt": "2026-11-17T17:34:27.317Z",
    "updatedAt": "2026-11-17T17:34:27.317Z"
  },
  {
    "id": "cmwkz2er0000prer76mgyvume",
    "userId": "RIJPFcXMMKdUlnlTRBSMuFZANw97nzSe",
    "companyName": "Brain Station 23",
    "roleTitle": "Junior Full-Stack Engineer",
    "location": "Mohakhali, Dhaka",
    "jobUrl": null,
    "notes": "Formal offer letter received! 45,000 BDT/month + health insurance.",
    "status": "OFFERED",
    "appliedDate": "2026-11-05T17:34:27.372Z",
    "createdAt": "2026-11-17T17:34:27.372Z",
    "updatedAt": "2026-11-17T17:34:27.372Z"
  },
  {
    "id": "cmwkz2esj000qrer7ewuhqphk",
    "userId": "VIbCmTGFv3plionrQgC4QHcQ8VLxIjLg",
    "companyName": "TigerIT Bangladesh",
    "roleTitle": "Associate Software Engineer",
    "location": "Banani, Dhaka",
    "jobUrl": null,
    "notes": "Technical round 2 on Algorithms & Concurrency.",
    "status": "INTERVIEWING",
    "appliedDate": "2026-11-02T17:34:27.427Z",
    "createdAt": "2026-11-17T17:34:27.427Z",
    "updatedAt": "2026-11-17T17:34:27.427Z"
  },
  {
    "id": "cmwkz2eu4000rrer7g0p5516w",
    "userId": "cmw3bo4ip000j3jr7a4gq18s0",
    "companyName": "Samsung R&D Institute BD",
    "roleTitle": "Software Engineer Trainee",
    "location": "Dhaka",
    "jobUrl": null,
    "notes": "Coding test cleared (Advanced level); waiting for panel interview.",
    "status": "APPLIED",
    "appliedDate": "2026-10-30T17:34:27.484Z",
    "createdAt": "2026-11-17T17:34:27.484Z",
    "updatedAt": "2026-11-17T17:34:27.484Z"
  },
  {
    "id": "cmwkz2evm000srer7onwm37kv",
    "userId": "cmw3bo4p1000m3jr79ogndqat",
    "companyName": "Optimizely",
    "roleTitle": "Graduate Software Engineer",
    "location": "Gulshan, Dhaka",
    "jobUrl": null,
    "notes": "Behavioral interview and live coding assessment.",
    "status": "INTERVIEWING",
    "appliedDate": "2026-10-27T17:34:27.538Z",
    "createdAt": "2026-11-17T17:34:27.538Z",
    "updatedAt": "2026-11-17T17:34:27.538Z"
  },
  {
    "id": "cmwkz2ex6000trer74y128boh",
    "userId": "cmw54b6zy0059uar7d57zug0h",
    "companyName": "Chaldal Tech",
    "roleTitle": "Software Development Engineer",
    "location": "Jashore / Dhaka",
    "jobUrl": null,
    "notes": "Applied directly on Chaldal Tech careers board.",
    "status": "APPLIED",
    "appliedDate": "2026-10-24T17:34:27.593Z",
    "createdAt": "2026-11-17T17:34:27.594Z",
    "updatedAt": "2026-11-17T17:34:27.594Z"
  },
  {
    "id": "cmwkz2eyo000urer766vvxde5",
    "userId": "cmw8zijo20003idr7iajyx8sj",
    "companyName": "bKash Limited",
    "roleTitle": "Junior DevOps & SRE Engineer",
    "location": "Dhaka",
    "jobUrl": null,
    "notes": "Selected for Core Platform Infrastructure team.",
    "status": "OFFERED",
    "appliedDate": "2026-10-21T17:34:27.648Z",
    "createdAt": "2026-11-17T17:34:27.648Z",
    "updatedAt": "2026-11-17T17:34:27.648Z"
  }
]
```

---

## `company_members`

* **Domain:** Left over (Legacy)
* **Description:** Company member associations
* **Total Rows:** 6

```json
[
  {
    "id": "cmwkz2ffj0013rer7x3zwsjox",
    "companyId": "cmw32xpsq000iz4r75hqv4nv6",
    "userId": "cmw3bo4y7000p3jr756dqp21t",
    "role": "ADMIN",
    "canPostOpportunities": true,
    "canManageCompany": false,
    "title": null,
    "createdAt": "2026-11-17T17:34:28.255Z",
    "updatedAt": "2026-11-17T17:34:28.255Z"
  },
  {
    "id": "cmwkz2fha0014rer75iy38sj3",
    "companyId": "cmw32xq88000kz4r7tpgtvkba",
    "userId": "cmw3bo551000s3jr7amz6hxy9",
    "role": "ADMIN",
    "canPostOpportunities": true,
    "canManageCompany": false,
    "title": null,
    "createdAt": "2026-11-17T17:34:28.318Z",
    "updatedAt": "2026-11-17T17:34:28.318Z"
  },
  {
    "id": "cmwkz2fiw0015rer7lspdmjps",
    "companyId": "cmw32xqfl000lz4r7xc606xxg",
    "userId": "cmw54b766005cuar7sdkyfuq8",
    "role": "MEMBER",
    "canPostOpportunities": true,
    "canManageCompany": false,
    "title": null,
    "createdAt": "2026-11-17T17:34:28.376Z",
    "updatedAt": "2026-11-17T17:34:28.376Z"
  },
  {
    "id": "cmwkz2fkg0016rer7vazgj36e",
    "companyId": "cmw338xf60002xnr7t7khu6mo",
    "userId": "cmw8zilg9000vidr7nzmteig6",
    "role": "MEMBER",
    "canPostOpportunities": true,
    "canManageCompany": false,
    "title": null,
    "createdAt": "2026-11-17T17:34:28.432Z",
    "updatedAt": "2026-11-17T17:34:28.432Z"
  },
  {
    "id": "cmwkz2flz0017rer7ehnvwk6q",
    "companyId": "cmw33e8ca0002f2r7d36xqd1x",
    "userId": "cmw8zilp5000zidr7hfoq6b8j",
    "role": "MEMBER",
    "canPostOpportunities": true,
    "canManageCompany": false,
    "title": null,
    "createdAt": "2026-11-17T17:34:28.488Z",
    "updatedAt": "2026-11-17T17:34:28.488Z"
  },
  {
    "id": "cmwkz2fni0018rer7rq44xcw5",
    "companyId": "cmw34ajmr0002s7r7472je1ng",
    "userId": "cmw8zily10013idr76p7t5rje",
    "role": "MEMBER",
    "canPostOpportunities": true,
    "canManageCompany": false,
    "title": null,
    "createdAt": "2026-11-17T17:34:28.542Z",
    "updatedAt": "2026-11-17T17:34:28.542Z"
  }
]
```

---

## `resumes`

* **Domain:** Left over (Legacy)
* **Description:** Student uploaded resume metadata
* **Total Rows:** 7

```json
[
  {
    "id": "cmwkz2h81001zrer719uih967",
    "userId": "9eX2XFGRfXneGZFXb37Qdpo0RhAPWzSx",
    "fileName": "Farhan_Ahmed_SWE_CV_2026.pdf",
    "fileSize": 245760,
    "mimeType": "application/pdf",
    "storageKey": "resumes/farhan_swe_2026.pdf",
    "isDefault": true,
    "createdAt": "2026-11-17T17:34:30.577Z",
    "updatedAt": "2026-11-17T17:34:30.577Z"
  },
  {
    "id": "cmwkz2hfn0020rer7yfw92dzh",
    "userId": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "fileName": "Nusrat_Jahan_Frontend_Resume.pdf",
    "fileSize": 184320,
    "mimeType": "application/pdf",
    "storageKey": "resumes/nusrat_frontend_2026.pdf",
    "isDefault": true,
    "createdAt": "2026-11-17T17:34:30.851Z",
    "updatedAt": "2026-11-17T17:34:30.851Z"
  },
  {
    "id": "cmwkz2hmx0021rer7ur79x0yh",
    "userId": "RIJPFcXMMKdUlnlTRBSMuFZANw97nzSe",
    "fileName": "Tanvir_Hossain_FullStack_Resume.pdf",
    "fileSize": 312000,
    "mimeType": "application/pdf",
    "storageKey": "resumes/tanvir_fullstack_2026.pdf",
    "isDefault": true,
    "createdAt": "2026-11-17T17:34:31.113Z",
    "updatedAt": "2026-11-17T17:34:31.113Z"
  },
  {
    "id": "cmwkz2hub0022rer7rct0nwsc",
    "userId": "VIbCmTGFv3plionrQgC4QHcQ8VLxIjLg",
    "fileName": "Fariha_Yasmeen_DataEngineer_Resume.pdf",
    "fileSize": 220100,
    "mimeType": "application/pdf",
    "storageKey": "resumes/fariha_data_2026.pdf",
    "isDefault": true,
    "createdAt": "2026-11-17T17:34:31.379Z",
    "updatedAt": "2026-11-17T17:34:31.379Z"
  },
  {
    "id": "cmwkz2i1n0023rer7f81t4eqm",
    "userId": "cmw3bo4ip000j3jr7a4gq18s0",
    "fileName": "Sajib_Hasan_Software_Engineer_CV.pdf",
    "fileSize": 285400,
    "mimeType": "application/pdf",
    "storageKey": "resumes/sajib_swe_2026.pdf",
    "isDefault": true,
    "createdAt": "2026-11-17T17:34:31.643Z",
    "updatedAt": "2026-11-17T17:34:31.643Z"
  },
  {
    "id": "cmw3bo6vd001h3jr7it569nfk",
    "userId": "cmw3bo4ip000j3jr7a4gq18s0",
    "fileName": "Farhan_Ahmed_SWE_Resume.pdf",
    "fileSize": 184520,
    "mimeType": "application/pdf",
    "storageKey": "resumes/cmw3bo4ip000j3jr7a4gq18s0/Farhan_Ahmed_SWE_Resume.pdf",
    "isDefault": true,
    "createdAt": "2026-11-05T09:07:27.817Z",
    "updatedAt": "2026-11-05T09:07:27.817Z"
  },
  {
    "id": "cmw3bo72p001i3jr79ht3d13o",
    "userId": "cmw3bo4p1000m3jr79ogndqat",
    "fileName": "Nusrat_Jahan_AI_Resume.pdf",
    "fileSize": 215400,
    "mimeType": "application/pdf",
    "storageKey": "resumes/cmw3bo4p1000m3jr79ogndqat/Nusrat_Jahan_AI_Resume.pdf",
    "isDefault": true,
    "createdAt": "2026-11-05T09:07:28.081Z",
    "updatedAt": "2026-11-05T09:07:28.081Z"
  }
]
```

---

## `posts`

* **Domain:** Community and referrals
* **Description:** Community discussion feed posts
* **Total Rows:** 31

```json
[
  {
    "id": "cmw3br68r00199gr751u9lxut",
    "authorId": "cmw3bo4y7000p3jr756dqp21t",
    "title": "How to Prepare for High-Scale Systems & Cloud Interviews",
    "content": "Having interviewed over 50 campus candidates at Databricks and previously in cloud tech, here is the #1 gap fresh graduates have: knowing *why* a particular data store or queue was chosen.\n\nDon't just say 'I used Kafka'. Explain the throughput expectations, partitioning key strategy, and failure recovery semantics. If you want a mock review of your system design portfolio, comment below or send a connection request!",
    "postType": "GENERAL_DISCUSSION",
    "visibility": "PUBLIC",
    "status": "ACTIVE",
    "isPinned": false,
    "attachedOpportunityId": null,
    "viewsCount": 0,
    "likesCount": 2,
    "commentsCount": 4,
    "createdAt": "2026-11-05T09:09:46.971Z",
    "updatedAt": "2026-11-05T14:15:04.910Z"
  },
  {
    "id": "cmw3br6ea001c9gr78j69mrkq",
    "authorId": "cmw3bo4p1000m3jr79ogndqat",
    "title": "Seeking Alumni Referral / Advice for bKash FinTech Junior Roles",
    "content": "Hello alumni! I am a 3rd year Software Engineering student specializing in machine learning and backend algorithms (CGPA 3.72). I am preparing to apply for the Junior FinTech Backend role at bKash. Would any alumni currently at bKash be open to reviewing my resume or sharing insights on the interview panel?",
    "postType": "REFERRAL_REQUEST",
    "visibility": "PUBLIC",
    "status": "ACTIVE",
    "isPinned": false,
    "attachedOpportunityId": null,
    "viewsCount": 0,
    "likesCount": 1,
    "commentsCount": 2,
    "createdAt": "2026-11-05T09:09:47.170Z",
    "updatedAt": "2026-11-05T10:38:39.512Z"
  },
  {
    "id": "cmw3bs8x5001bd6r7bgtjyr8m",
    "authorId": "cmw3bo4p1000m3jr79ogndqat",
    "title": "Seeking Alumni Referral / Advice for bKash FinTech Junior Roles",
    "content": "Hello alumni! I am a 3rd year Software Engineering student specializing in machine learning and backend algorithms (CGPA 3.72). I am preparing to apply for the Junior FinTech Backend role at bKash. Would any alumni currently at bKash be open to reviewing my resume or sharing insights on the interview panel?",
    "postType": "REFERRAL_REQUEST",
    "visibility": "PUBLIC",
    "status": "ACTIVE",
    "isPinned": false,
    "attachedOpportunityId": null,
    "viewsCount": 0,
    "likesCount": 14,
    "commentsCount": 2,
    "createdAt": "2026-11-05T09:10:37.097Z",
    "updatedAt": "2026-11-05T09:10:37.097Z"
  },
  {
    "id": "cmw3br6g0001d9gr7rqgmegiu",
    "authorId": "cmw3bo4p1000m3jr79ogndqat",
    "title": "BUY CHEAP CRYPTO & ESSAY WRITING SERVICES 100% PASS GUARANTEED",
    "content": "Contact me on telegram @cheat_exams for instant homework solutions, paid papers, and crypto investments. 100% legit no scam.",
    "postType": "GENERAL_DISCUSSION",
    "visibility": "PUBLIC",
    "status": "ACTIVE",
    "isPinned": false,
    "attachedOpportunityId": null,
    "viewsCount": 0,
    "likesCount": 1,
    "commentsCount": 0,
    "createdAt": "2026-11-05T09:09:47.232Z",
    "updatedAt": "2026-11-05T10:00:27.058Z"
  },
  {
    "id": "cmw3bs8yn001cd6r74fj3bccq",
    "authorId": "cmw3bo4p1000m3jr79ogndqat",
    "title": "BUY CHEAP CRYPTO & ESSAY WRITING SERVICES 100% PASS GUARANTEED",
    "content": "Contact me on telegram @cheat_exams for instant homework solutions, paid papers, and crypto investments. 100% legit no scam.",
    "postType": "GENERAL_DISCUSSION",
    "visibility": "PUBLIC",
    "status": "REMOVED",
    "isPinned": false,
    "attachedOpportunityId": null,
    "viewsCount": 0,
    "likesCount": 0,
    "commentsCount": 1,
    "createdAt": "2026-11-05T09:10:37.151Z",
    "updatedAt": "2026-11-06T16:17:15.927Z"
  },
  {
    "id": "cmw3br6ai001a9gr7k6pbtrzr",
    "authorId": "cmw32x6lo000gx6r7cxbbtlrb",
    "title": "Vercel Summer 2027 Engineering Internship is Officially Open!",
    "content": "We are thrilled to launch our 2027 university engineering internship openings! Check the opportunities tab for 'Frontend Engineering Intern'. We are looking for students passionate about React 19, web performance, and developer experience. Applications submitted through the UniCareer portal receive direct review from our university talent team.",
    "postType": "JOB_ANNOUNCEMENT",
    "visibility": "PUBLIC",
    "status": "ACTIVE",
    "isPinned": false,
    "attachedOpportunityId": "cmw3bo5zj00183jr75l0pisqb",
    "viewsCount": 0,
    "likesCount": 2,
    "commentsCount": 5,
    "createdAt": "2026-11-05T09:09:47.034Z",
    "updatedAt": "2026-11-07T17:47:59.970Z"
  },
  {
    "id": "cmw54ub0p000008l4nbvpp851",
    "authorId": "cmw54b6zy0059uar7d57zug0h",
    "title": null,
    "content": "hghghghgjhgjhggjhgjgutgjhbjhgjgjhfgj",
    "postType": "JOB_ANNOUNCEMENT",
    "visibility": "PUBLIC",
    "status": "ACTIVE",
    "isPinned": false,
    "attachedOpportunityId": null,
    "viewsCount": 0,
    "likesCount": 1,
    "commentsCount": 1,
    "createdAt": "2026-11-06T15:31:48.169Z",
    "updatedAt": "2026-11-06T15:32:01.977Z"
  },
  {
    "id": "cmw54xbxr000007jnie8ktppf",
    "authorId": "cmw54b6zy0059uar7d57zug0h",
    "title": "gfgfgfg",
    "content": "jhgfhfhgfhg",
    "postType": "JOB_ANNOUNCEMENT",
    "visibility": "PUBLIC",
    "status": "ACTIVE",
    "isPinned": false,
    "attachedOpportunityId": null,
    "viewsCount": 0,
    "likesCount": 0,
    "commentsCount": 0,
    "createdAt": "2026-11-06T15:34:09.327Z",
    "updatedAt": "2026-11-06T15:34:09.327Z"
  },
  {
    "id": "cmw3bs8u10019d6r777zxlo3w",
    "authorId": "cmw32x6lo000gx6r7cxbbtlrb",
    "title": "Vercel Summer 2027 Engineering Internship is Officially Open!",
    "content": "We are thrilled to launch our 2027 university engineering internship openings! Check the opportunities tab for 'Frontend Engineering Intern'. We are looking for students passionate about React 19, web performance, and developer experience. Applications submitted through the UniCareer portal receive direct review from our university talent team.",
    "postType": "JOB_ANNOUNCEMENT",
    "visibility": "PUBLIC",
    "status": "ACTIVE",
    "isPinned": false,
    "attachedOpportunityId": "cmw3bo5zj00183jr75l0pisqb",
    "viewsCount": 0,
    "likesCount": 42,
    "commentsCount": 5,
    "createdAt": "2026-11-05T09:10:36.985Z",
    "updatedAt": "2026-11-07T17:47:59.970Z"
  },
  {
    "id": "cmw3bs8si0018d6r74u97jksb",
    "authorId": "cmw3bo4y7000p3jr756dqp21t",
    "title": "How to Prepare for High-Scale Systems & Cloud Interviews",
    "content": "Having interviewed over 50 campus candidates at Databricks and previously in cloud tech, here is the #1 gap fresh graduates have: knowing *why* a particular data store or queue was chosen.\n\nDon't just say 'I used Kafka'. Explain the throughput expectations, partitioning key strategy, and failure recovery semantics. If you want a mock review of your system design portfolio, comment below or send a connection request!",
    "postType": "GENERAL_DISCUSSION",
    "visibility": "PUBLIC",
    "status": "ACTIVE",
    "isPinned": false,
    "attachedOpportunityId": null,
    "viewsCount": 0,
    "likesCount": 2,
    "commentsCount": 4,
    "createdAt": "2026-11-05T09:10:36.930Z",
    "updatedAt": "2026-11-05T10:38:37.875Z"
  },
  {
    "id": "cmw3bs8qz0017d6r7bh5r274y",
    "authorId": "cmw32x6lo000gx6r7cxbbtlrb",
    "title": "Welcome to Fall 2026 Campus Recruiting Season — A Note from Faculty",
    "content": "Welcome scholars, alumni, and industry partners to the new recruitment cycle! Over 35 partner companies are participating this year. To our graduating seniors: focus on demonstrating authentic project ownership, clean architectural tradeoffs, and communicative clarity. Feel free to connect with our verified alumni in the directory for referral guidance.",
    "postType": "GENERAL_DISCUSSION",
    "visibility": "PUBLIC",
    "status": "ACTIVE",
    "isPinned": true,
    "attachedOpportunityId": null,
    "viewsCount": 0,
    "likesCount": 3,
    "commentsCount": 5,
    "createdAt": "2026-11-05T09:10:36.875Z",
    "updatedAt": "2026-11-12T08:00:17.762Z"
  },
  {
    "id": "cmw3ex1wm000008jvz6db7457",
    "authorId": "cmw3bo4ip000j3jr7a4gq18s0",
    "title": null,
    "content": "sadjhasfkjsdhf",
    "postType": "GENERAL_DISCUSSION",
    "visibility": "PUBLIC",
    "status": "ACTIVE",
    "isPinned": false,
    "attachedOpportunityId": null,
    "viewsCount": 0,
    "likesCount": 2,
    "commentsCount": 0,
    "createdAt": "2026-11-05T10:38:20.134Z",
    "updatedAt": "2026-11-08T20:17:50.656Z"
  },
  {
    "id": "cmw3br66l00189gr7qwcvkmt1",
    "authorId": "cmw32x6lo000gx6r7cxbbtlrb",
    "title": "Welcome to Fall 2026 Campus Recruiting Season — A Note from Faculty",
    "content": "Welcome scholars, alumni, and industry partners to the new recruitment cycle! Over 35 partner companies are participating this year. To our graduating seniors: focus on demonstrating authentic project ownership, clean architectural tradeoffs, and communicative clarity. Feel free to connect with our verified alumni in the directory for referral guidance.",
    "postType": "GENERAL_DISCUSSION",
    "visibility": "PUBLIC",
    "status": "ACTIVE",
    "isPinned": true,
    "attachedOpportunityId": null,
    "viewsCount": 0,
    "likesCount": 3,
    "commentsCount": 6,
    "createdAt": "2026-11-05T09:09:46.893Z",
    "updatedAt": "2026-11-12T07:57:11.761Z"
  },
  {
    "id": "cmw3br6c8001b9gr7536v9ejv",
    "authorId": "cmw3bo4ip000j3jr7a4gq18s0",
    "title": "Raft Consensus KV-Store in Go — Open Sourced My Capstone Project!",
    "content": "Excited to share my undergraduate capstone project: a distributed Key-Value store implementing the Raft distributed consensus protocol in Go from scratch. Handles leader election, log replication, and partition healing with 100% test coverage under chaos testing.\n\nCheck out the repo on GitHub: https://github.com/farhan-ahmed-cloud/raft-kv. Would love feedback from fellow peers and systems engineers!",
    "postType": "ACHIEVEMENT",
    "visibility": "PUBLIC",
    "status": "ACTIVE",
    "isPinned": false,
    "attachedOpportunityId": null,
    "viewsCount": 0,
    "likesCount": 2,
    "commentsCount": 4,
    "createdAt": "2026-11-05T09:09:47.096Z",
    "updatedAt": "2026-11-08T16:30:16.230Z"
  },
  {
    "id": "cmw8ziowb002cidr709ckr3b7",
    "authorId": "cmw8zijo20003idr7iajyx8sj",
    "title": "Seeking Alumni Referral / Advice for Backend Engineering at Chaldal / ShopUp",
    "content": "Hello respected alumni! I am a graduating senior from JnU CSE (CGPA 3.91). \n\nI have built distributed systems in Go, designed Kafka event-streaming pipelines, and placed in the top 10% in national hackathons. I am preparing to apply for backend engineering roles at Chaldal and ShopUp.\n\nWould any alumni currently at Chaldal or ShopUp be open to a 10-minute resume review or offering a referral? My profile and projects are fully updated on UniCareer. Thank you!",
    "postType": "REFERRAL_REQUEST",
    "visibility": "PUBLIC",
    "status": "ACTIVE",
    "isPinned": false,
    "attachedOpportunityId": null,
    "viewsCount": 190,
    "likesCount": 15,
    "commentsCount": 2,
    "createdAt": "2026-11-09T08:13:52.907Z",
    "updatedAt": "2026-11-09T08:13:52.907Z"
  },
  {
    "id": "cmw3bs8vm001ad6r7rqhi0ax2",
    "authorId": "cmw3bo4ip000j3jr7a4gq18s0",
    "title": "Raft Consensus KV-Store in Go — Open Sourced My Capstone Project!",
    "content": "Excited to share my undergraduate capstone project: a distributed Key-Value store implementing the Raft distributed consensus protocol in Go from scratch. Handles leader election, log replication, and partition healing with 100% test coverage under chaos testing.\n\nCheck out the repo on GitHub: https://github.com/farhan-ahmed-cloud/raft-kv. Would love feedback from fellow peers and systems engineers!",
    "postType": "ACHIEVEMENT",
    "visibility": "PUBLIC",
    "status": "ACTIVE",
    "isPinned": false,
    "attachedOpportunityId": null,
    "viewsCount": 0,
    "likesCount": 2,
    "commentsCount": 3,
    "createdAt": "2026-11-05T09:10:37.042Z",
    "updatedAt": "2026-11-07T19:27:19.662Z"
  },
  {
    "id": "cmw8zip5a002fidr7yrtj92q7",
    "authorId": "cmw8zimfr001bidr7ny0k72sl",
    "title": "Samsung R&D Coding Test 3-Hour Breakdown (Advanced Algorithms & Graphs)",
    "content": "For juniors preparing for Samsung R&D Institute Bangladesh (SRBD) campus recruitments:\n\nThe SRBD coding test is strictly 3 hours for 1 problem, but with a massive test suite (50 test cases, tight time & memory constraints). \n\nCommon archetypes:\n• **BFS / DFS with State Bitmasks** (e.g. collecting gems in a grid with obstacles)\n• **Branch and Bound / Pruning Recursion**\n• **Topological Sorting with Cycle Detection**\n\n*Key tip*: You cannot use STL in the official on-site test! You must know how to implement your own Queue, Stack, and Graph adjacency lists in standard C++. Practice writing them from scratch!",
    "postType": "GENERAL_DISCUSSION",
    "visibility": "PUBLIC",
    "status": "ACTIVE",
    "isPinned": false,
    "attachedOpportunityId": null,
    "viewsCount": 190,
    "likesCount": 15,
    "commentsCount": 2,
    "createdAt": "2026-11-09T08:13:53.230Z",
    "updatedAt": "2026-11-09T08:13:53.230Z"
  },
  {
    "id": "cmw8zipeb002iidr7za85g8p6",
    "authorId": "cmw8zikpk000jidr7dmcxnytw",
    "title": "Organizing JnU Web Dev Hackathon & Showcase — Looking for Project Entries!",
    "content": "Hey fellow students! The JnU Computer Club is organizing an intra-campus Web & Mobile Innovation Sprint next month!\n\nCategories:\n1. Campus Productivity & Academic Utilities\n2. AI-Powered Educational Tools\n3. FinTech & Micro-Merchant Solutions\n\nPrizes will be sponsored by alumni tech networks with interview fast-tracks for the winning teams. Drop a comment below if you are looking for team members or mentors!",
    "postType": "GENERAL_DISCUSSION",
    "visibility": "PUBLIC",
    "status": "ACTIVE",
    "isPinned": false,
    "attachedOpportunityId": null,
    "viewsCount": 155,
    "likesCount": 11,
    "commentsCount": 1,
    "createdAt": "2026-11-09T08:13:53.555Z",
    "updatedAt": "2026-11-09T08:13:53.555Z"
  },
  {
    "id": "cmw8zipk9002kidr7d0isfe85",
    "authorId": "cmw8zikgj000fidr7huk9whgr",
    "title": "Research Paper Accepted at IEEE International Conference on Big Data!",
    "content": "Delighted to share that our research paper titled 'Predictive Modeling of Urban Traffic Congestion Using Spatial-Temporal Graph Neural Networks' has been accepted for oral presentation at IEEE BigData 2026!\n\nSpecial gratitude to our department professors and alumni mentors who guided our feature engineering and baseline benchmarking. \n\nIf any 1st or 2nd year students want to get started with machine learning research at JnU, feel free to reach out — happy to share dataset resources and reading lists!",
    "postType": "ACHIEVEMENT",
    "visibility": "PUBLIC",
    "status": "ACTIVE",
    "isPinned": false,
    "attachedOpportunityId": null,
    "viewsCount": 190,
    "likesCount": 15,
    "commentsCount": 2,
    "createdAt": "2026-11-09T08:13:53.769Z",
    "updatedAt": "2026-11-09T08:13:53.769Z"
  },
  {
    "id": "cmw8zipt1002nidr7xle7yu15",
    "authorId": "cmw8zim6y0017idr7urnpaq8d",
    "title": "Why Low-Level Systems Programming (C/C++) is Becoming a Superpower in 2026",
    "content": "While most junior developers are rushing into generic Python wrappers, high-performance computing in Dhaka is facing a massive shortage of C++ and systems developers.\n\nAt TigerIT and across biometrics/security firms, we build engines that process millions of high-resolution biometric templates in milliseconds. You need to understand:\n• Cache locality and memory alignment\n• SIMD vectorization (AVX2/AVX-512)\n• Virtual memory paging and avoiding heap fragmentation\n\nDon't neglect your OS and Computer Architecture courses at JnU — they pay off tenfold in your senior engineering career!",
    "postType": "GENERAL_DISCUSSION",
    "visibility": "PUBLIC",
    "status": "ACTIVE",
    "isPinned": false,
    "attachedOpportunityId": null,
    "viewsCount": 155,
    "likesCount": 11,
    "commentsCount": 1,
    "createdAt": "2026-11-09T08:13:54.085Z",
    "updatedAt": "2026-11-09T08:13:54.085Z"
  },
  {
    "id": "cmw8zinyl0021idr7stkp4mj4",
    "authorId": "cmw8zilg9000vidr7nzmteig6",
    "title": "bKash FinTech Engineering: Interview Breakdown & Tips from a Senior Engineer",
    "content": "Assalamu Alaikum juniors! Seeing a lot of applications for bKash FinTech openings on UniCareer. Having been on the technical interview panel for 2+ years, here is what we truly evaluate:\n\n1. **Concurrency & Thread Safety**: Can you prevent double-spending in a simulated transaction engine? Be ready to write thread-safe Java code using ConcurrentHashMap, ReentrantLocks, and atomic variables.\n2. **Database Isolation Levels**: You must clearly understand Read Committed vs Repeatable Read, phantom reads, and optimistic vs pessimistic locking.\n3. **Kafka & Event-Driven Architecture**: How do you guarantee idempotency when processing payment webhooks?\n\nIf you have questions or want a mock feedback session on your system design resume, leave a comment below!",
    "postType": "GENERAL_DISCUSSION",
    "visibility": "PUBLIC",
    "status": "ACTIVE",
    "isPinned": false,
    "attachedOpportunityId": null,
    "viewsCount": 225,
    "likesCount": 19,
    "commentsCount": 3,
    "createdAt": "2026-11-09T08:13:51.693Z",
    "updatedAt": "2026-11-09T08:13:51.693Z"
  },
  {
    "id": "cmw8zion90029idr7lxg2samf",
    "authorId": "cmw8zilp5000zidr7hfoq6b8j",
    "title": "Brain Station 23 is Hiring Trainee Software Engineers — Direct Alumni Referrals",
    "content": "Hello JnU engineers! Brain Station 23 is actively hiring for the upcoming Trainee Software Engineer batch across:\n• **.NET & Enterprise Cloud**\n• **Node.js / React Full-Stack**\n• **Python & GenAI Solutions**\n\n**Eligibility**: 2024 / 2025 graduates from CSE/SWE with a strong foundation in OOP, SQL, and clean code principles. CGPA >= 3.25.\n\nIf you have a live GitHub portfolio and your UniCareer profile is verified, drop a comment or connect with me. I will directly refer qualified candidates to our HR talent acquisition team!",
    "postType": "JOB_ANNOUNCEMENT",
    "visibility": "PUBLIC",
    "status": "ACTIVE",
    "isPinned": false,
    "attachedOpportunityId": null,
    "viewsCount": 190,
    "likesCount": 15,
    "commentsCount": 2,
    "createdAt": "2026-11-09T08:13:52.581Z",
    "updatedAt": "2026-11-09T08:13:52.581Z"
  },
  {
    "id": "cmw8zipyz002pidr7r3n088yp",
    "authorId": "cmw8zikyh000nidr7dwp2ckzw",
    "title": "Tech Product Management: A Bridge for Business & Engineering Students at JnU",
    "content": "A lot of students ask whether business graduates can thrive in Dhaka's tech startup ecosystem. Absolutely!\n\nAs Product Managers and Growth Analysts, tech companies in Bangladesh need people who can:\n• Translate user pain points into clear PRDs (Product Requirement Documents)\n• Understand basic API request-response contracts without writing code\n• Run A/B tests with statistical confidence intervals\n\nTo CSE students: learn basic product empathy. To BBA students: don't fear SQL and database schemas. The bridge between both is where high-growth careers happen!",
    "postType": "GENERAL_DISCUSSION",
    "visibility": "PUBLIC",
    "status": "ACTIVE",
    "isPinned": false,
    "attachedOpportunityId": null,
    "viewsCount": 155,
    "likesCount": 11,
    "commentsCount": 1,
    "createdAt": "2026-11-09T08:13:54.299Z",
    "updatedAt": "2026-11-09T08:13:54.299Z"
  },
  {
    "id": "cmw8ziq4x002ridr71xmtq81u",
    "authorId": "cmw8zil7f000ridr7rz8k2ftx",
    "title": "Dockerized Our Campus Student Portal: CI/CD Pipeline Case Study",
    "content": "Wanted to share a mini DevOps case study! In our Software Engineering lab, we converted our monolithic team project into a multi-container Docker Compose setup with GitHub Actions automated testing.\n\nKey improvements:\n• Reduced developer onboarding time from 2 hours to 1 command ('docker compose up')\n• Unit tests run on every Pull Request with PostgreSQL test containers\n• Automatic preview deployments on Vercel\n\nCheck out the workflow template on my GitHub: https://github.com/farhan-ishraq-cloud/jnu-ci-cd-starter",
    "postType": "GENERAL_DISCUSSION",
    "visibility": "PUBLIC",
    "status": "ACTIVE",
    "isPinned": false,
    "attachedOpportunityId": null,
    "viewsCount": 155,
    "likesCount": 11,
    "commentsCount": 1,
    "createdAt": "2026-11-09T08:13:54.514Z",
    "updatedAt": "2026-11-09T08:13:54.514Z"
  },
  {
    "id": "cmw8ziqav002tidr7ujm1ch65",
    "authorId": "cmw8zijx70007idr7jaac04lw",
    "title": "Seeking Mock Technical Interviewer for Mobile Frontend (React Native)",
    "content": "Hello alumni community! I have an upcoming technical screening for a Mobile Application Developer role. \n\nTopics include React Native performance optimization, Redux Toolkit state persistence, and native bridging with Android.\n\nWould any alumni experienced in mobile engineering be willing to spare 30 minutes for a mock interview this weekend? Deeply grateful for any guidance!",
    "postType": "REFERRAL_REQUEST",
    "visibility": "PUBLIC",
    "status": "ACTIVE",
    "isPinned": false,
    "attachedOpportunityId": null,
    "viewsCount": 190,
    "likesCount": 15,
    "commentsCount": 3,
    "createdAt": "2026-11-09T08:13:54.727Z",
    "updatedAt": "2026-11-09T18:25:21.208Z"
  },
  {
    "id": "cmwg1oow2000008jt1vqsuwjm",
    "authorId": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "title": null,
    "content": "Best software engineering tips and tricks you wish you knew earlier?",
    "postType": "GENERAL_DISCUSSION",
    "visibility": "PUBLIC",
    "status": "ACTIVE",
    "isPinned": false,
    "attachedOpportunityId": null,
    "viewsCount": 0,
    "likesCount": 1,
    "commentsCount": 2,
    "createdAt": "2026-11-14T06:48:55.299Z",
    "updatedAt": "2026-11-14T06:51:00.011Z"
  },
  {
    "id": "cmwgim01v000008jhzrn94s03",
    "authorId": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "title": null,
    "content": "lkjrlwkjrasmdlaskjrldmasljdkwqleoijdaslkdjasdasdad",
    "postType": "REFERRAL_REQUEST",
    "visibility": "PUBLIC",
    "status": "ACTIVE",
    "isPinned": false,
    "attachedOpportunityId": null,
    "viewsCount": 0,
    "likesCount": 0,
    "commentsCount": 0,
    "createdAt": "2026-11-14T14:42:43.267Z",
    "updatedAt": "2026-11-14T14:42:43.267Z"
  },
  {
    "id": "cmwgk5dsk001p9zr7n4o1253g",
    "authorId": "cmw8zily10013idr76p7t5rje",
    "title": "Therap (BD) Associate Software Engineer Hiring: How to Prepare Your Algorithms & Java Fundamentals",
    "content": "Hello JnU engineers!\n\nEvery semester I receive messages from junior students asking about what Therap BD looks for during technical interview rounds. Here are 4 key areas you should focus on:\n\n1. OOP & Design Patterns: Don't just memorize definitions. Understand why we use Factory, Strategy, or Observer patterns in production Java.\n2. Database Normalization & Indexing: We evaluate how you design multi-tenant schemas. Know the difference between B-Tree and Hash indexing in PostgreSQL.\n3. Problem Solving: Practice 100-150 medium problems on LeetCode/Codeforces. We test clean code, edge-case analysis, and complexity trade-offs.\n4. Concurrency: Thread safety, synchronized blocks, and Executors.\n\nIf anyone is applying for the open role, feel free to submit a referral request on my profile or email me directly with your resume!",
    "postType": "GENERAL_DISCUSSION",
    "visibility": "PUBLIC",
    "status": "ACTIVE",
    "isPinned": false,
    "attachedOpportunityId": null,
    "viewsCount": 270,
    "likesCount": 27,
    "commentsCount": 3,
    "createdAt": "2026-11-14T15:25:47.156Z",
    "updatedAt": "2026-11-14T15:25:47.156Z"
  },
  {
    "id": "cmwgk5e50001t9zr75ib9wz64",
    "authorId": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "title": "Built an In-Memory Raft Consensus Key-Value Store in Go — Looking for Code Review & Feedback",
    "content": "Hi everyone,\n\nOver the semester break, I built a distributed key-value store implementing the Raft consensus algorithm in Go. It includes:\n- Leader election with randomized heartbeat timers.\n- Log replication across 3 and 5-node clusters.\n- Persistent state snapshots to local disk.\n- gRPC bidirectional streaming for RPC transport.\n\nHere is the GitHub repository: https://github.com/sooooojib/raft-kv\n\nWould love if senior alumni working on distributed systems (Tariqul Bhai, Sayed Bhai) could glance at the log compaction logic and give some feedback!",
    "postType": "GENERAL_DISCUSSION",
    "visibility": "PUBLIC",
    "status": "ACTIVE",
    "isPinned": false,
    "attachedOpportunityId": null,
    "viewsCount": 230,
    "likesCount": 22,
    "commentsCount": 2,
    "createdAt": "2026-11-14T15:25:47.604Z",
    "updatedAt": "2026-11-14T15:25:47.604Z"
  },
  {
    "id": "cmwgk5ee6001w9zr74gtcr12m",
    "authorId": "cmw8zilp5000zidr7hfoq6b8j",
    "title": "Brain Station 23 Enterprise Cloud Cohort 2026: 5 Paid Internship Openings for JnU Students",
    "content": "Excited to announce that Brain Station 23 is officially opening applications for our Summer Cloud & GenAI Trainee Cohort!\n\nWe have 5 dedicated slots for Jagannath University students across CSE, SWE, and Mathematics.\n- Monthly Stipend: BDT 30,000 / month\n- Duration: 6 Months (Hybrid in Mohakhali DOHS)\n- Absorption rate: Over 80% of trainees transition to permanent Associate Cloud Engineers.\n\nI posted the full opportunity on our portal. You can also use the new 'Mail Me for Referral' button on my profile to send your CV directly to my work inbox!",
    "postType": "JOB_ANNOUNCEMENT",
    "visibility": "PUBLIC",
    "status": "ACTIVE",
    "isPinned": false,
    "attachedOpportunityId": null,
    "viewsCount": 230,
    "likesCount": 22,
    "commentsCount": 2,
    "createdAt": "2026-11-14T15:25:47.934Z",
    "updatedAt": "2026-11-14T15:25:47.934Z"
  },
  {
    "id": "cmwhyr5k6000208jriq31e1lk",
    "authorId": "lnCXe6mNhDbNA5kcNrPRCHyIrxn2BLTH",
    "title": null,
    "content": "No,question....",
    "postType": "GENERAL_DISCUSSION",
    "visibility": "PUBLIC",
    "status": "ACTIVE",
    "isPinned": false,
    "attachedOpportunityId": null,
    "viewsCount": 0,
    "likesCount": 0,
    "commentsCount": 0,
    "createdAt": "2026-11-15T15:02:23.718Z",
    "updatedAt": "2026-11-15T15:02:23.718Z"
  }
]
```

---

## `comments`

* **Domain:** Community and referrals
* **Description:** Threaded comment replies
* **Total Rows:** 37

```json
[
  {
    "id": "cmw81t6ja000908jp65ofkrk2",
    "postId": "cmw3br6c8001b9gr7536v9ejv",
    "authorId": "cmw54b766005cuar7sdkyfuq8",
    "parentId": null,
    "content": "eewdqw",
    "status": "ACTIVE",
    "likesCount": 0,
    "createdAt": "2026-11-08T16:30:15.382Z",
    "updatedAt": "2026-11-08T16:30:15.382Z"
  },
  {
    "id": "cmw9lamq4000008l2njllz8sa",
    "postId": "cmw3br66l00189gr7qwcvkmt1",
    "authorId": "cmw54b6zy0059uar7d57zug0h",
    "parentId": null,
    "content": "hio",
    "status": "ACTIVE",
    "likesCount": 0,
    "createdAt": "2026-11-09T18:23:28.396Z",
    "updatedAt": "2026-11-09T18:23:28.396Z"
  },
  {
    "id": "cmw9ld13l000308l2k2wla8ag",
    "postId": "cmw8ziqav002tidr7ujm1ch65",
    "authorId": "cmw54b6zy0059uar7d57zug0h",
    "parentId": "cmw8ziqjg002uidr7e65c0o1t",
    "content": "kmo",
    "status": "ACTIVE",
    "likesCount": 0,
    "createdAt": "2026-11-09T18:25:20.337Z",
    "updatedAt": "2026-11-09T18:25:20.337Z"
  },
  {
    "id": "cmwd98ie6000007lbm1fuf9i7",
    "postId": "cmw3bs8qz0017d6r7bh5r274y",
    "authorId": "cmw54b766005cuar7sdkyfuq8",
    "parentId": null,
    "content": "I am excited",
    "status": "ACTIVE",
    "likesCount": 0,
    "createdAt": "2026-11-12T07:56:58.782Z",
    "updatedAt": "2026-11-12T07:56:58.782Z"
  },
  {
    "id": "cmwd98rql000008jviz8gzobk",
    "postId": "cmw3br66l00189gr7qwcvkmt1",
    "authorId": "cmw54b766005cuar7sdkyfuq8",
    "parentId": null,
    "content": "jhghjgf",
    "status": "ACTIVE",
    "likesCount": 0,
    "createdAt": "2026-11-12T07:57:10.893Z",
    "updatedAt": "2026-11-12T07:57:10.893Z"
  },
  {
    "id": "cmwg1rcgu000008lbxcojbvrc",
    "postId": "cmwg1oow2000008jt1vqsuwjm",
    "authorId": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "parentId": "cmwg1qrqs000208jtnr77uhau",
    "content": "Thanks",
    "status": "ACTIVE",
    "likesCount": 0,
    "createdAt": "2026-11-14T06:50:59.166Z",
    "updatedAt": "2026-11-14T06:50:59.166Z"
  },
  {
    "id": "cmwgk5dvq001q9zr7zjlovrks",
    "postId": "cmwgk5dsk001p9zr7n4o1253g",
    "authorId": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "parentId": null,
    "content": "Thank you so much Mahfuz Bhai! This breakdown is extremely valuable. I have been preparing LeetCode graphs and DP problems. Will submit my portfolio for your review!",
    "status": "ACTIVE",
    "likesCount": 4,
    "createdAt": "2026-11-14T15:25:47.270Z",
    "updatedAt": "2026-11-14T15:25:47.270Z"
  },
  {
    "id": "cmwgk5dyv001r9zr7nibq4oh7",
    "postId": "cmwgk5dsk001p9zr7n4o1253g",
    "authorId": "cmw8zijo20003idr7iajyx8sj",
    "parentId": null,
    "content": "Spot on about the database indexing part. When I interviewed for my internship, query performance on large tables was a major discussion point.",
    "status": "ACTIVE",
    "likesCount": 4,
    "createdAt": "2026-11-14T15:25:47.383Z",
    "updatedAt": "2026-11-14T15:25:47.383Z"
  },
  {
    "id": "cmwgk5e1x001s9zr77c37bx35",
    "postId": "cmwgk5dsk001p9zr7n4o1253g",
    "authorId": "cmw8zilp5000zidr7hfoq6b8j",
    "parentId": null,
    "content": "Great advice Mahfuz! The same principles apply for Brain Station 23 cloud roles as well. Strong fundamentals always win.",
    "status": "ACTIVE",
    "likesCount": 4,
    "createdAt": "2026-11-14T15:25:47.493Z",
    "updatedAt": "2026-11-14T15:25:47.493Z"
  },
  {
    "id": "cmwgk5e80001u9zr76pt6tmye",
    "postId": "cmwgk5e50001t9zr75ib9wz64",
    "authorId": "cmw8zilg9000vidr7nzmteig6",
    "parentId": null,
    "content": "Very impressive work for a 3rd year student, Sajib! Building Raft from scratch is the gold standard for backend systems. I'll clone it tonight and leave a PR review on your repo.",
    "status": "ACTIVE",
    "likesCount": 4,
    "createdAt": "2026-11-14T15:25:47.712Z",
    "updatedAt": "2026-11-14T15:25:47.712Z"
  },
  {
    "id": "cmwgk5eb2001v9zr7oor74dfa",
    "postId": "cmwgk5e50001t9zr75ib9wz64",
    "authorId": "cmw8zinfb001sidr756wc25l0",
    "parentId": null,
    "content": "Checking this out now! Take a look at etcd's raft implementation for how they handle snapshot memory overhead. Excellent portfolio piece.",
    "status": "ACTIVE",
    "likesCount": 4,
    "createdAt": "2026-11-14T15:25:47.822Z",
    "updatedAt": "2026-11-14T15:25:47.822Z"
  },
  {
    "id": "cmwgk5eh9001x9zr793kf97nh",
    "postId": "cmwgk5ee6001w9zr74gtcr12m",
    "authorId": "cmw8zijx70007idr7jaac04lw",
    "parentId": null,
    "content": "Sent my application through the portal and just emailed my CV to your inbox, Apu! Thank you for supporting JnU students!",
    "status": "ACTIVE",
    "likesCount": 4,
    "createdAt": "2026-11-14T15:25:48.045Z",
    "updatedAt": "2026-11-14T15:25:48.045Z"
  },
  {
    "id": "cmwgk5ekh001y9zr72ubmqg35",
    "postId": "cmwgk5ee6001w9zr74gtcr12m",
    "authorId": "cmw8zil7f000ridr7rz8k2ftx",
    "parentId": null,
    "content": "Been studying Docker and AWS fundamentals all year for this opportunity. Applying right away!",
    "status": "ACTIVE",
    "likesCount": 4,
    "createdAt": "2026-11-14T15:25:48.161Z",
    "updatedAt": "2026-11-14T15:25:48.161Z"
  },
  {
    "id": "cmw8ziqmd002vidr70r2f3u9h",
    "postId": "cmw8ziqav002tidr7ujm1ch65",
    "authorId": "cmw8zijx70007idr7jaac04lw",
    "parentId": null,
    "content": "Thank you so much Al-Amin bhaiya! Sending connection request right away.",
    "status": "ACTIVE",
    "likesCount": 3,
    "createdAt": "2026-11-09T08:13:55.141Z",
    "updatedAt": "2026-11-09T08:13:55.141Z"
  },
  {
    "id": "cmw8zio4s0023idr7gxatbhx0",
    "postId": "cmw8zinyl0021idr7stkp4mj4",
    "authorId": "cmw8zilg9000vidr7nzmteig6",
    "parentId": null,
    "content": "Great question Sajib! First 15 minutes is pure concepts (deadlock avoidance, memory model). Then we ask you to live-code a small thread-safe bounded buffer or wallet debit service.",
    "status": "ACTIVE",
    "likesCount": 3,
    "createdAt": "2026-11-09T08:13:51.916Z",
    "updatedAt": "2026-11-09T08:13:51.916Z"
  },
  {
    "id": "cmw8zio7q0024idr7btlnt2zf",
    "postId": "cmw8zinyl0021idr7stkp4mj4",
    "authorId": "cmw8zijo20003idr7iajyx8sj",
    "parentId": null,
    "content": "Bookmarking this! The idempotency tip with Kafka is crucial — definitely worth emphasizing unique transaction reference IDs.",
    "status": "ACTIVE",
    "likesCount": 3,
    "createdAt": "2026-11-09T08:13:52.022Z",
    "updatedAt": "2026-11-09T08:13:52.022Z"
  },
  {
    "id": "cmw3br6l7001f9gr768gvdcjf",
    "postId": "cmw3br68r00199gr751u9lxut",
    "authorId": "cmw3bo4ip000j3jr7a4gq18s0",
    "parentId": null,
    "content": "This advice is gold, Tariqul vai! When designing my Raft project, handling split-brain leader elections was the hardest part. Would love to connect and get your thoughts on partition recovery.",
    "status": "ACTIVE",
    "likesCount": 0,
    "createdAt": "2026-11-05T09:09:47.419Z",
    "updatedAt": "2026-11-05T09:09:47.419Z"
  },
  {
    "id": "cmw3br6n3001g9gr76agg59nx",
    "postId": "cmw3br68r00199gr751u9lxut",
    "authorId": "cmw3bo4y7000p3jr756dqp21t",
    "parentId": "cmw3br6l7001f9gr768gvdcjf",
    "content": "Excellent work Farhan! I saw your GitHub repo — the chaos testing setup is top notch. Just accepted your connection request.",
    "status": "ACTIVE",
    "likesCount": 0,
    "createdAt": "2026-11-05T09:09:47.487Z",
    "updatedAt": "2026-11-05T09:09:47.487Z"
  },
  {
    "id": "cmw8zioq7002aidr727n46qfd",
    "postId": "cmw8zion90029idr7lxg2samf",
    "authorId": "cmw8zijo20003idr7iajyx8sj",
    "parentId": null,
    "content": "Apu, I have sent a connection request with my portfolio link. My focus is on backend microservices with Go & PostgreSQL. Would love an opportunity to interview!",
    "status": "ACTIVE",
    "likesCount": 3,
    "createdAt": "2026-11-09T08:13:52.687Z",
    "updatedAt": "2026-11-09T08:13:52.687Z"
  },
  {
    "id": "cmw8ziot5002bidr7bcf7yl5s",
    "postId": "cmw8zion90029idr7lxg2samf",
    "authorId": "cmw8zilp5000zidr7hfoq6b8j",
    "parentId": null,
    "content": "Reviewed your profile Tanvir — your distributed Raft project is exceptional! Submitted your referral internally just now.",
    "status": "ACTIVE",
    "likesCount": 3,
    "createdAt": "2026-11-09T08:13:52.793Z",
    "updatedAt": "2026-11-09T08:13:52.793Z"
  },
  {
    "id": "cmw8zioz9002didr7ogmhm6bu",
    "postId": "cmw8ziowb002cidr709ckr3b7",
    "authorId": "cmw8zimoo001fidr7gceqsc6q",
    "parentId": null,
    "content": "Hey Tanvir! I am at Chaldal engineering. Send me your resume link via connection request — our team is currently expanding our backend microservices fleet.",
    "status": "ACTIVE",
    "likesCount": 3,
    "createdAt": "2026-11-09T08:13:53.013Z",
    "updatedAt": "2026-11-09T08:13:53.013Z"
  },
  {
    "id": "cmw8zip26002eidr7hi2xra4l",
    "postId": "cmw8ziowb002cidr709ckr3b7",
    "authorId": "cmw8zijo20003idr7iajyx8sj",
    "parentId": null,
    "content": "Thank you so much Al-Amin bhaiya! Sending it right away.",
    "status": "ACTIVE",
    "likesCount": 3,
    "createdAt": "2026-11-09T08:13:53.118Z",
    "updatedAt": "2026-11-09T08:13:53.118Z"
  },
  {
    "id": "cmw8zipb5002hidr7t2naw3yl",
    "postId": "cmw8zip5a002fidr7yrtj92q7",
    "authorId": "cmw8zimfr001bidr7ny0k72sl",
    "parentId": null,
    "content": "Exactly Sajib! Keep templates of your custom array-based queue and stack handy and practice writing them in under 3 minutes.",
    "status": "ACTIVE",
    "likesCount": 3,
    "createdAt": "2026-11-09T08:13:53.441Z",
    "updatedAt": "2026-11-09T08:13:53.441Z"
  },
  {
    "id": "cmw8ziph8002jidr7a9qu3isw",
    "postId": "cmw8zipeb002iidr7za85g8p6",
    "authorId": "cmw8zijx70007idr7jaac04lw",
    "parentId": null,
    "content": "Count the Software Engineering department in! We have 3 capstone teams ready to showcase our healthcare and campus navigation apps.",
    "status": "ACTIVE",
    "likesCount": 3,
    "createdAt": "2026-11-09T08:13:53.660Z",
    "updatedAt": "2026-11-09T08:13:53.660Z"
  },
  {
    "id": "cmw8zipq2002midr72pn3vv1r",
    "postId": "cmw8zipk9002kidr7d0isfe85",
    "authorId": "cmw8zilp5000zidr7hfoq6b8j",
    "parentId": null,
    "content": "Outstanding work! Getting published in IEEE BigData as an undergrad is a testament to rigorous dedication.",
    "status": "ACTIVE",
    "likesCount": 3,
    "createdAt": "2026-11-09T08:13:53.978Z",
    "updatedAt": "2026-11-09T08:13:53.978Z"
  },
  {
    "id": "cmw8zipvy002oidr7antpbd89",
    "postId": "cmw8zipt1002nidr7xle7yu15",
    "authorId": "cmw8zik6k000bidr7pthsc98t",
    "parentId": null,
    "content": "This hits right home! In EEE, we work closely with low-level hardware memory registers, and seeing it applied to biometric security is fascinating.",
    "status": "ACTIVE",
    "likesCount": 3,
    "createdAt": "2026-11-09T08:13:54.190Z",
    "updatedAt": "2026-11-09T08:13:54.190Z"
  },
  {
    "id": "cmw8ziq1x002qidr7hbi20k67",
    "postId": "cmw8zipyz002pidr7r3n088yp",
    "authorId": "cmw8zijx70007idr7jaac04lw",
    "parentId": null,
    "content": "100% agreed! In our SWE software engineering lifecycle course, writing clear user stories and acceptance criteria saved us hundreds of hours of rework.",
    "status": "ACTIVE",
    "likesCount": 3,
    "createdAt": "2026-11-09T08:13:54.405Z",
    "updatedAt": "2026-11-09T08:13:54.405Z"
  },
  {
    "id": "cmw8ziqjg002uidr7e65c0o1t",
    "postId": "cmw8ziqav002tidr7ujm1ch65",
    "authorId": "cmw8zimoo001fidr7gceqsc6q",
    "parentId": null,
    "content": "Hey Nusrat! I can do a mock session this Saturday evening. We can focus on list virtualization, memory leaks, and bridge serialization. Connect with me on UniCareer!",
    "status": "ACTIVE",
    "likesCount": 3,
    "createdAt": "2026-11-09T08:13:55.036Z",
    "updatedAt": "2026-11-09T08:13:55.036Z"
  },
  {
    "id": "cmw3br6on001h9gr72i33fujb",
    "postId": "cmw3br6ea001c9gr78j69mrkq",
    "authorId": "cmw3bo551000s3jr7amz6hxy9",
    "parentId": null,
    "content": "Hi Nusrat! I lead Product at bKash. Our engineering hiring panel values strong algorithmic fundamentals and transactional safety. Send me a referral request through the platform and I'll route it to our engineering recruiter.",
    "status": "ACTIVE",
    "likesCount": 0,
    "createdAt": "2026-11-05T09:09:47.543Z",
    "updatedAt": "2026-11-05T09:09:47.543Z"
  },
  {
    "id": "cmw3bs91p001ed6r7wcew0c6p",
    "postId": "cmw3bs8si0018d6r74u97jksb",
    "authorId": "cmw3bo4ip000j3jr7a4gq18s0",
    "parentId": null,
    "content": "This advice is gold, Tariqul vai! When designing my Raft project, handling split-brain leader elections was the hardest part. Would love to connect and get your thoughts on partition recovery.",
    "status": "ACTIVE",
    "likesCount": 0,
    "createdAt": "2026-11-05T09:10:37.261Z",
    "updatedAt": "2026-11-05T09:10:37.261Z"
  },
  {
    "id": "cmw3bs938001fd6r71j2b55xe",
    "postId": "cmw3bs8si0018d6r74u97jksb",
    "authorId": "cmw3bo4y7000p3jr756dqp21t",
    "parentId": "cmw3bs91p001ed6r7wcew0c6p",
    "content": "Excellent work Farhan! I saw your GitHub repo — the chaos testing setup is top notch. Just accepted your connection request.",
    "status": "ACTIVE",
    "likesCount": 0,
    "createdAt": "2026-11-05T09:10:37.316Z",
    "updatedAt": "2026-11-05T09:10:37.316Z"
  },
  {
    "id": "cmw3bs94q001gd6r7hs99tprh",
    "postId": "cmw3bs8x5001bd6r7bgtjyr8m",
    "authorId": "cmw3bo551000s3jr7amz6hxy9",
    "parentId": null,
    "content": "Hi Nusrat! I lead Product at bKash. Our engineering hiring panel values strong algorithmic fundamentals and transactional safety. Send me a referral request through the platform and I'll route it to our engineering recruiter.",
    "status": "ACTIVE",
    "likesCount": 0,
    "createdAt": "2026-11-05T09:10:37.370Z",
    "updatedAt": "2026-11-05T09:10:37.370Z"
  },
  {
    "id": "cmwg1qrqs000208jtnr77uhau",
    "postId": "cmwg1oow2000008jt1vqsuwjm",
    "authorId": "cmw54b766005cuar7sdkyfuq8",
    "parentId": null,
    "content": "\"Learn how to use database indexes properly and never run queries inside a loop (the N+1 problem). That alone fixes 80% of backend performance bottlenecks in production.\"",
    "status": "ACTIVE",
    "likesCount": 0,
    "createdAt": "2026-11-14T06:50:32.308Z",
    "updatedAt": "2026-11-14T06:50:32.308Z"
  },
  {
    "id": "cmw9lax1v000208l2f9fkhhdr",
    "postId": "cmw3br66l00189gr7qwcvkmt1",
    "authorId": "cmw54b6zy0059uar7d57zug0h",
    "parentId": "cmw9lamq4000008l2njllz8sa",
    "content": "lkj",
    "status": "ACTIVE",
    "likesCount": 0,
    "createdAt": "2026-11-09T18:23:41.780Z",
    "updatedAt": "2026-11-09T18:23:41.780Z"
  },
  {
    "id": "cmw54ukxd000308l45rhrd3kp",
    "postId": "cmw54ub0p000008l4nbvpp851",
    "authorId": "cmw54b6zy0059uar7d57zug0h",
    "parentId": null,
    "content": "hgjhgjhgjhj",
    "status": "ACTIVE",
    "likesCount": 0,
    "createdAt": "2026-11-06T15:32:01.009Z",
    "updatedAt": "2026-11-06T15:32:01.009Z"
  },
  {
    "id": "cmw54v0of000408l4bn5jctuj",
    "postId": "cmw3bs8yn001cd6r74fj3bccq",
    "authorId": "cmw54b6zy0059uar7d57zug0h",
    "parentId": null,
    "content": "fake fake",
    "status": "ACTIVE",
    "likesCount": 0,
    "createdAt": "2026-11-06T15:32:21.423Z",
    "updatedAt": "2026-11-06T15:32:21.423Z"
  },
  {
    "id": "cmwd9cr9h000007jp1efw1pnk",
    "postId": "cmw3bs8qz0017d6r7bh5r274y",
    "authorId": "cmw54b766005cuar7sdkyfuq8",
    "parentId": "cmwd98ie6000007lbm1fuf9i7",
    "content": "hghytrtyfr",
    "status": "ACTIVE",
    "likesCount": 0,
    "createdAt": "2026-11-12T08:00:16.901Z",
    "updatedAt": "2026-11-12T08:00:16.901Z"
  }
]
```

---

## `post_reactions`

* **Domain:** Community and referrals
* **Description:** Atomic post likes and reactions
* **Total Rows:** 24

```json
[
  {
    "id": "cmw3excg4000508jsulm18w57",
    "postId": "cmw3br66l00189gr7qwcvkmt1",
    "userId": "cmw3bo4ip000j3jr7a4gq18s0",
    "type": "CELEBRATE",
    "createdAt": "2026-11-05T10:38:33.796Z"
  },
  {
    "id": "cmw3exf95000608jsg3yiut72",
    "postId": "cmw3bs8si0018d6r74u97jksb",
    "userId": "cmw3bo4ip000j3jr7a4gq18s0",
    "type": "CELEBRATE",
    "createdAt": "2026-11-05T10:38:37.433Z"
  },
  {
    "id": "cmw3exgi8000708js89ev0i7c",
    "postId": "cmw3br6ea001c9gr78j69mrkq",
    "userId": "cmw3bo4ip000j3jr7a4gq18s0",
    "type": "CELEBRATE",
    "createdAt": "2026-11-05T10:38:39.056Z"
  },
  {
    "id": "cmw3i12d7000007kx2k3sgkrj",
    "postId": "cmw3bs8qz0017d6r7bh5r274y",
    "userId": "cmw3bo4p1000m3jr79ogndqat",
    "type": "LIKE",
    "createdAt": "2026-11-05T12:05:26.203Z"
  },
  {
    "id": "cmw3lmun4000208l0lf9uw6u0",
    "postId": "cmw3bs8qz0017d6r7bh5r274y",
    "userId": "cmw3bo4ip000j3jr7a4gq18s0",
    "type": "LIKE",
    "createdAt": "2026-11-05T13:46:21.472Z"
  },
  {
    "id": "cmw3mnqwt000408l8sopc056e",
    "postId": "cmw3br6ai001a9gr7k6pbtrzr",
    "userId": "cmw3bo4ip000j3jr7a4gq18s0",
    "type": "LIKE",
    "createdAt": "2026-11-05T14:15:02.909Z"
  },
  {
    "id": "cmw3mns3m000508l8pyqyuevk",
    "postId": "cmw3br68r00199gr751u9lxut",
    "userId": "cmw3bo4ip000j3jr7a4gq18s0",
    "type": "LIKE",
    "createdAt": "2026-11-05T14:15:04.450Z"
  },
  {
    "id": "cmw54ugtm000208l4vugoiqgz",
    "postId": "cmw54ub0p000008l4nbvpp851",
    "userId": "cmw54b6zy0059uar7d57zug0h",
    "type": "CELEBRATE",
    "createdAt": "2026-11-06T15:31:55.690Z"
  },
  {
    "id": "cmw957rsx000407jwy228k784",
    "postId": "cmw3bs8qz0017d6r7bh5r274y",
    "userId": "l1gQBbGkGyFhqUKNkJFyKAfX7uplfyrM",
    "type": "LIKE",
    "createdAt": "2026-11-09T10:53:21.153Z"
  },
  {
    "id": "cmw6sp19l000308kxfij2uhu1",
    "postId": "cmw3bs8vm001ad6r7rqhi0ax2",
    "userId": "cmw3bo4p1000m3jr79ogndqat",
    "type": "SUPPORT",
    "createdAt": "2026-11-07T19:27:19.209Z"
  },
  {
    "id": "cmw3br6q8001j9gr7kfxjb12u",
    "postId": "cmw3br66l00189gr7qwcvkmt1",
    "userId": "cmw3bo4p1000m3jr79ogndqat",
    "type": "LIKE",
    "createdAt": "2026-11-05T09:09:47.600Z"
  },
  {
    "id": "cmw3br6q8001l9gr767hnnq5p",
    "postId": "cmw3br68r00199gr751u9lxut",
    "userId": "cmw3bo4p1000m3jr79ogndqat",
    "type": "SUPPORT",
    "createdAt": "2026-11-05T09:09:47.600Z"
  },
  {
    "id": "cmw3br6q8001n9gr7ngnljgld",
    "postId": "cmw3br6ai001a9gr7k6pbtrzr",
    "userId": "cmw3bo4p1000m3jr79ogndqat",
    "type": "LIKE",
    "createdAt": "2026-11-05T09:09:47.600Z"
  },
  {
    "id": "cmw3br6q8001o9gr7oqfclmyq",
    "postId": "cmw3br6c8001b9gr7536v9ejv",
    "userId": "cmw3bo4y7000p3jr756dqp21t",
    "type": "INSIGHTFUL",
    "createdAt": "2026-11-05T09:09:47.600Z"
  },
  {
    "id": "cmw3bs96a001kd6r7cqlj5ct2",
    "postId": "cmw3bs8si0018d6r74u97jksb",
    "userId": "cmw3bo4p1000m3jr79ogndqat",
    "type": "SUPPORT",
    "createdAt": "2026-11-05T09:10:37.426Z"
  },
  {
    "id": "cmw3bs96a001ld6r7p5a06q0q",
    "postId": "cmw3bs8u10019d6r777zxlo3w",
    "userId": "cmw3bo4ip000j3jr7a4gq18s0",
    "type": "CELEBRATE",
    "createdAt": "2026-11-05T09:10:37.426Z"
  },
  {
    "id": "cmw3bs96a001md6r7cc7cr3kg",
    "postId": "cmw3bs8u10019d6r777zxlo3w",
    "userId": "cmw3bo4p1000m3jr79ogndqat",
    "type": "LIKE",
    "createdAt": "2026-11-05T09:10:37.426Z"
  },
  {
    "id": "cmw3bs96a001nd6r7y8nsd6ui",
    "postId": "cmw3bs8vm001ad6r7rqhi0ax2",
    "userId": "cmw3bo4y7000p3jr756dqp21t",
    "type": "INSIGHTFUL",
    "createdAt": "2026-11-05T09:10:37.426Z"
  },
  {
    "id": "cmw81t1za000808jpb5wzsfkx",
    "postId": "cmw3br6c8001b9gr7536v9ejv",
    "userId": "cmw54b766005cuar7sdkyfuq8",
    "type": "CELEBRATE",
    "createdAt": "2026-11-08T16:30:09.478Z"
  },
  {
    "id": "cmw6sputb000j08kxl7qgjhbm",
    "postId": "cmw3br66l00189gr7qwcvkmt1",
    "userId": "cmw54b6zy0059uar7d57zug0h",
    "type": "LIKE",
    "createdAt": "2026-11-07T19:27:57.503Z"
  },
  {
    "id": "cmw3dkbnd000008jpptc3piz8",
    "postId": "cmw3br6g0001d9gr7rqgmegiu",
    "userId": "cmw32x6lo000gx6r7cxbbtlrb",
    "type": "CELEBRATE",
    "createdAt": "2026-11-05T10:00:26.617Z"
  },
  {
    "id": "cmw3ex834000008jss90udf59",
    "postId": "cmw3ex1wm000008jvz6db7457",
    "userId": "cmw3bo4ip000j3jr7a4gq18s0",
    "type": "LIKE",
    "createdAt": "2026-11-05T10:38:28.144Z"
  },
  {
    "id": "cmw89xuoq000208jgwask73re",
    "postId": "cmw3ex1wm000008jvz6db7457",
    "userId": "cmw54b6zy0059uar7d57zug0h",
    "type": "SUPPORT",
    "createdAt": "2026-11-08T20:17:50.234Z"
  },
  {
    "id": "cmwg1p6y4000108jtrwl7km1j",
    "postId": "cmwg1oow2000008jt1vqsuwjm",
    "userId": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "type": "LIKE",
    "createdAt": "2026-11-14T06:49:18.700Z"
  }
]
```

---

## `post_bookmarks`

* **Domain:** Community and referrals
* **Description:** Saved community posts
* **Total Rows:** 8

```json
[
  {
    "id": "cmwkz2gqa001rrer7c91lx0dd",
    "postId": "cmw3br66l00189gr7qwcvkmt1",
    "userId": "9eX2XFGRfXneGZFXb37Qdpo0RhAPWzSx",
    "createdAt": "2026-11-17T17:34:29.938Z"
  },
  {
    "id": "cmwkz2grw001srer74mf5q889",
    "postId": "cmw3br68r00199gr751u9lxut",
    "userId": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "createdAt": "2026-11-17T17:34:29.996Z"
  },
  {
    "id": "cmwkz2gtf001trer7htzos316",
    "postId": "cmw3br6ai001a9gr7k6pbtrzr",
    "userId": "RIJPFcXMMKdUlnlTRBSMuFZANw97nzSe",
    "createdAt": "2026-11-17T17:34:30.051Z"
  },
  {
    "id": "cmwkz2gux001urer701jb36lh",
    "postId": "cmw3br6c8001b9gr7536v9ejv",
    "userId": "VIbCmTGFv3plionrQgC4QHcQ8VLxIjLg",
    "createdAt": "2026-11-17T17:34:30.105Z"
  },
  {
    "id": "cmwkz2gwe001vrer7x2esc4vh",
    "postId": "cmw3br6ea001c9gr78j69mrkq",
    "userId": "cmw3bo4ip000j3jr7a4gq18s0",
    "createdAt": "2026-11-17T17:34:30.158Z"
  },
  {
    "id": "cmwkz2gxx001wrer7q7mjxagj",
    "postId": "cmw3br6g0001d9gr7rqgmegiu",
    "userId": "cmw3bo4p1000m3jr79ogndqat",
    "createdAt": "2026-11-17T17:34:30.213Z"
  },
  {
    "id": "cmwkz2gzh001xrer796w43e6v",
    "postId": "cmw3bs8qz0017d6r7bh5r274y",
    "userId": "cmw54b6zy0059uar7d57zug0h",
    "createdAt": "2026-11-17T17:34:30.269Z"
  },
  {
    "id": "cmwkz2h11001yrer7jsce723z",
    "postId": "cmw3bs8si0018d6r74u97jksb",
    "userId": "cmw8zijo20003idr7iajyx8sj",
    "createdAt": "2026-11-17T17:34:30.325Z"
  }
]
```

---

## `content_reports`

* **Domain:** Community and referrals
* **Description:** Moderation reports against posts and comments
* **Total Rows:** 9

```json
[
  {
    "id": "cmw3br6hm001e9gr7k5el34qt",
    "reporterId": "cmw3bo4ip000j3jr7a4gq18s0",
    "targetType": "POST",
    "postId": "cmw3br6g0001d9gr7rqgmegiu",
    "commentId": null,
    "reason": "SPAM",
    "description": "Blatant academic dishonesty and commercial spam violating university code of conduct.",
    "status": "DISMISSED",
    "reviewedById": "cmw32x6lo000gx6r7cxbbtlrb",
    "reviewNotes": "jj",
    "reviewedAt": "2026-11-08T18:17:47.458Z",
    "createdAt": "2026-11-05T09:09:47.290Z",
    "updatedAt": "2026-11-08T18:17:47.462Z"
  },
  {
    "id": "cmw3bs906001dd6r7spons5wg",
    "reporterId": "cmw3bo4ip000j3jr7a4gq18s0",
    "targetType": "POST",
    "postId": "cmw3bs8yn001cd6r74fj3bccq",
    "commentId": null,
    "reason": "SPAM",
    "description": "Blatant academic dishonesty and commercial spam violating university code of conduct.",
    "status": "RESOLVED",
    "reviewedById": "cmw32x6lo000gx6r7cxbbtlrb",
    "reviewNotes": "hh",
    "reviewedAt": "2026-11-06T16:17:15.691Z",
    "createdAt": "2026-11-05T09:10:37.206Z",
    "updatedAt": "2026-11-06T16:17:15.694Z"
  },
  {
    "id": "cmwkz2i650024rer76w8uq491",
    "reporterId": "9eX2XFGRfXneGZFXb37Qdpo0RhAPWzSx",
    "targetType": "POST",
    "postId": "cmw3br66l00189gr7qwcvkmt1",
    "commentId": null,
    "reason": "SPAM",
    "description": "Repeated promotional link for external unofficial WhatsApp group.",
    "status": "PENDING",
    "reviewedById": null,
    "reviewNotes": null,
    "reviewedAt": null,
    "createdAt": "2026-11-17T17:34:31.805Z",
    "updatedAt": "2026-11-17T17:34:31.805Z"
  },
  {
    "id": "cmwkz2i7w0025rer7qb4yfsbx",
    "reporterId": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "targetType": "POST",
    "postId": "cmw3br68r00199gr751u9lxut",
    "commentId": null,
    "reason": "MISINFORMATION",
    "description": "Outdated deadline and incorrect stipend figure for government scholarship opening.",
    "status": "PENDING",
    "reviewedById": null,
    "reviewNotes": null,
    "reviewedAt": null,
    "createdAt": "2026-11-17T17:34:31.868Z",
    "updatedAt": "2026-11-17T17:34:31.868Z"
  },
  {
    "id": "cmwkz2i9f0026rer7ekcrw18r",
    "reporterId": "RIJPFcXMMKdUlnlTRBSMuFZANw97nzSe",
    "targetType": "COMMENT",
    "postId": null,
    "commentId": null,
    "reason": "INAPPROPRIATE",
    "description": "Off-topic aggressive argument under an alumni career advice post.",
    "status": "PENDING",
    "reviewedById": null,
    "reviewNotes": null,
    "reviewedAt": null,
    "createdAt": "2026-11-17T17:34:31.923Z",
    "updatedAt": "2026-11-17T17:34:31.923Z"
  },
  {
    "id": "cmwkz2ibp0027rer7nmt5rkya",
    "reporterId": "VIbCmTGFv3plionrQgC4QHcQ8VLxIjLg",
    "targetType": "POST",
    "postId": "cmw3br6c8001b9gr7536v9ejv",
    "commentId": null,
    "reason": "SPAM",
    "description": "Duplicate copy-paste of a previous question already answered in the forum.",
    "status": "RESOLVED",
    "reviewedById": "cmw3bo4y7000p3jr756dqp21t",
    "reviewNotes": "Reviewed by moderation team. Handled per community guidelines.",
    "reviewedAt": "2026-11-17T17:34:32.003Z",
    "createdAt": "2026-11-17T17:34:32.005Z",
    "updatedAt": "2026-11-17T17:34:32.005Z"
  },
  {
    "id": "cmwkz2idb0028rer769uhr573",
    "reporterId": "cmw3bo4ip000j3jr7a4gq18s0",
    "targetType": "COMMENT",
    "postId": null,
    "commentId": null,
    "reason": "OTHER",
    "description": "Requesting personal phone numbers in public comments section.",
    "status": "RESOLVED",
    "reviewedById": "cmw3bo4y7000p3jr756dqp21t",
    "reviewNotes": "Reviewed by moderation team. Handled per community guidelines.",
    "reviewedAt": "2026-11-17T17:34:32.061Z",
    "createdAt": "2026-11-17T17:34:32.063Z",
    "updatedAt": "2026-11-17T17:34:32.063Z"
  },
  {
    "id": "cmwkz2iew0029rer761evoynt",
    "reporterId": "cmw3bo4p1000m3jr79ogndqat",
    "targetType": "POST",
    "postId": "cmw3br6g0001d9gr7rqgmegiu",
    "commentId": null,
    "reason": "INAPPROPRIATE",
    "description": "Solicitation of academic assignment solutions.",
    "status": "RESOLVED",
    "reviewedById": "cmw3bo4y7000p3jr756dqp21t",
    "reviewNotes": "Reviewed by moderation team. Handled per community guidelines.",
    "reviewedAt": "2026-11-17T17:34:32.118Z",
    "createdAt": "2026-11-17T17:34:32.120Z",
    "updatedAt": "2026-11-17T17:34:32.120Z"
  },
  {
    "id": "cmw89wsqc000108jggq1at0n7",
    "reporterId": "cmw54b6zy0059uar7d57zug0h",
    "targetType": "POST",
    "postId": "cmw3bs8qz0017d6r7bh5r274y",
    "commentId": null,
    "reason": "INAPPROPRIATE",
    "description": "ok",
    "status": "PENDING",
    "reviewedById": null,
    "reviewNotes": null,
    "reviewedAt": null,
    "createdAt": "2026-11-08T20:17:01.044Z",
    "updatedAt": "2026-11-08T20:17:01.044Z"
  }
]
```

---

## `connections`

* **Domain:** Community and referrals
* **Description:** Peer-to-peer student & alumni network connections
* **Total Rows:** 9

```json
[
  {
    "id": "cmwgk5evd00229zr72uqe0iay",
    "senderId": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "receiverId": "cmw8zilg9000vidr7nzmteig6",
    "status": "ACCEPTED",
    "createdAt": "2026-11-14T15:25:48.553Z",
    "updatedAt": "2026-11-14T15:25:48.553Z"
  },
  {
    "id": "cmwgk5ewx00239zr7wcn95ivj",
    "senderId": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "receiverId": "cmw8zilp5000zidr7hfoq6b8j",
    "status": "ACCEPTED",
    "createdAt": "2026-11-14T15:25:48.609Z",
    "updatedAt": "2026-11-14T15:25:48.609Z"
  },
  {
    "id": "cmwgk5f9a00249zr77spzql58",
    "senderId": "cmw8zijo20003idr7iajyx8sj",
    "receiverId": "cmw8zily10013idr76p7t5rje",
    "status": "ACCEPTED",
    "createdAt": "2026-11-14T15:25:49.054Z",
    "updatedAt": "2026-11-14T15:25:49.054Z"
  },
  {
    "id": "cmw3i3b33000107kxuplgm9on",
    "senderId": "cmw3bo4p1000m3jr79ogndqat",
    "receiverId": "cmw3bo4ip000j3jr7a4gq18s0",
    "status": "PENDING",
    "createdAt": "2026-11-05T12:07:10.815Z",
    "updatedAt": "2026-11-05T12:07:10.815Z"
  },
  {
    "id": "cmwhxcrat000008jpcnj67x31",
    "senderId": "lnCXe6mNhDbNA5kcNrPRCHyIrxn2BLTH",
    "receiverId": "lInQM5fUHIDxGH2Zgs5qdm0aWZSjVTUr",
    "status": "PENDING",
    "createdAt": "2026-11-15T14:23:12.437Z",
    "updatedAt": "2026-11-15T14:23:12.437Z"
  },
  {
    "id": "cmw3br6rx001q9gr766mpjtgx",
    "senderId": "cmw3bo4ip000j3jr7a4gq18s0",
    "receiverId": "cmw3bo4y7000p3jr756dqp21t",
    "status": "ACCEPTED",
    "createdAt": "2026-11-05T09:09:47.661Z",
    "updatedAt": "2026-11-05T09:10:37.481Z"
  },
  {
    "id": "cmw3br6v7001s9gr78tisbvty",
    "senderId": "cmw3bo4p1000m3jr79ogndqat",
    "receiverId": "cmw3bo551000s3jr7amz6hxy9",
    "status": "PENDING",
    "createdAt": "2026-11-05T09:09:47.779Z",
    "updatedAt": "2026-11-05T09:10:37.590Z"
  },
  {
    "id": "cmw98dtp0000007l5njcgqacm",
    "senderId": "9eX2XFGRfXneGZFXb37Qdpo0RhAPWzSx",
    "receiverId": "zw0XJr3KbwTWoM9S18hfFR3WCgilIzLf",
    "status": "PENDING",
    "createdAt": "2026-11-09T12:22:02.389Z",
    "updatedAt": "2026-11-09T12:22:02.389Z"
  },
  {
    "id": "cmwawdsk70000z4w6mqqqo2zr",
    "senderId": "cmw54b6zy0059uar7d57zug0h",
    "receiverId": "lInQM5fUHIDxGH2Zgs5qdm0aWZSjVTUr",
    "status": "PENDING",
    "createdAt": "2026-11-10T16:21:37.879Z",
    "updatedAt": "2026-11-10T16:21:37.879Z"
  }
]
```

---

## `referral_requests`

* **Domain:** Community and referrals
* **Description:** Direct pitches to alumni for internal company referrals
* **Total Rows:** 7

```json
[
  {
    "id": "cmw3br6wp001t9gr71z3z5yhx",
    "requesterId": "cmw3bo4ip000j3jr7a4gq18s0",
    "recipientId": "cmw3bo4y7000p3jr756dqp21t",
    "companyId": "cmw3bo5q600133jr78f73fim1",
    "companyName": "Databricks",
    "roleTitle": "Cloud Infrastructure Engineer",
    "opportunityId": null,
    "message": "Hi Tariqul vai, I saw your post regarding distributed systems at Databricks. Having completed my Raft consensus project and maintaining a 3.88 CGPA, I would be grateful if you could refer me for the graduate cloud infrastructure opening.",
    "resumeUrl": "https://farhan-ahmed.dev/resume.pdf",
    "status": "ACCEPTED",
    "responseNote": "Reviewed Farhan's portfolio and GitHub repository. Exceptional systems depth and code clarity for an undergraduate. Forwarded directly to our infrastructure talent team.",
    "respondedAt": "2026-11-05T09:09:47.833Z",
    "createdAt": "2026-11-05T09:09:47.833Z",
    "updatedAt": "2026-11-05T09:09:47.833Z"
  },
  {
    "id": "cmw3br6yf001u9gr7st3c85jc",
    "requesterId": "cmw3bo4p1000m3jr79ogndqat",
    "recipientId": "cmw3bo551000s3jr7amz6hxy9",
    "companyId": "cmw32xq88000kz4r7tpgtvkba",
    "companyName": "bKash Limited",
    "roleTitle": "Junior FinTech Backend Engineer",
    "opportunityId": null,
    "message": "Dear Sabrina apu, as discussed on your community thread, I would love an introduction to the bKash engineering talent team. My competitive programming background and 3.72 CGPA reflect my dedication to high-scale algorithmic development.",
    "resumeUrl": "https://nusrat-jahan.dev/resume.pdf",
    "status": "PENDING",
    "responseNote": null,
    "respondedAt": null,
    "createdAt": "2026-11-05T09:09:47.895Z",
    "updatedAt": "2026-11-05T09:09:47.895Z"
  },
  {
    "id": "cmw3bs9cd001sd6r7749kt2bv",
    "requesterId": "cmw3bo4ip000j3jr7a4gq18s0",
    "recipientId": "cmw3bo4y7000p3jr756dqp21t",
    "companyId": "cmw3bo5q600133jr78f73fim1",
    "companyName": "Databricks",
    "roleTitle": "Cloud Infrastructure Engineer",
    "opportunityId": null,
    "message": "Hi Tariqul vai, I saw your post regarding distributed systems at Databricks. Having completed my Raft consensus project and maintaining a 3.88 CGPA, I would be grateful if you could refer me for the graduate cloud infrastructure opening.",
    "resumeUrl": "https://farhan-ahmed.dev/resume.pdf",
    "status": "ACCEPTED",
    "responseNote": "Reviewed Farhan's portfolio and GitHub repository. Exceptional systems depth and code clarity for an undergraduate. Forwarded directly to our infrastructure talent team.",
    "respondedAt": "2026-11-05T09:10:37.644Z",
    "createdAt": "2026-11-05T09:10:37.645Z",
    "updatedAt": "2026-11-05T09:10:37.645Z"
  },
  {
    "id": "cmw3bs9dv001td6r7h04qzqfl",
    "requesterId": "cmw3bo4p1000m3jr79ogndqat",
    "recipientId": "cmw3bo551000s3jr7amz6hxy9",
    "companyId": "cmw32xq88000kz4r7tpgtvkba",
    "companyName": "bKash Limited",
    "roleTitle": "Junior FinTech Backend Engineer",
    "opportunityId": null,
    "message": "Dear Sabrina apu, as discussed on your community thread, I would love an introduction to the bKash engineering talent team. My competitive programming background and 3.72 CGPA reflect my dedication to high-scale algorithmic development.",
    "resumeUrl": "https://nusrat-jahan.dev/resume.pdf",
    "status": "PENDING",
    "responseNote": null,
    "respondedAt": null,
    "createdAt": "2026-11-05T09:10:37.699Z",
    "updatedAt": "2026-11-05T09:10:37.699Z"
  },
  {
    "id": "cmwgk5enm001z9zr7bpgpvwby",
    "requesterId": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "recipientId": "cmw8zilg9000vidr7nzmteig6",
    "companyId": null,
    "companyName": "bKash Limited",
    "roleTitle": "Junior Backend Engineer (Core Transactions)",
    "opportunityId": null,
    "message": "Salam Tariqul Bhai! I am Sajib (JnU CSE '26). I have been working on distributed Go & Java services, and I noticed the Junior Backend Engineer opening on your team. I would love if you could review my portfolio and consider referring me!",
    "resumeUrl": "https://github.com/sooooojib",
    "status": "ACCEPTED",
    "responseNote": "Reviewed your Raft implementation on GitHub Sajib — very solid understanding of concurrency. I have submitted your referral code under REQ-BK-9182. Watch your email!",
    "respondedAt": "2026-11-14T15:25:48.272Z",
    "createdAt": "2026-11-14T15:25:48.274Z",
    "updatedAt": "2026-11-14T15:25:48.274Z"
  },
  {
    "id": "cmwgk5eqn00209zr7a5i3js6w",
    "requesterId": "cmw8zijo20003idr7iajyx8sj",
    "recipientId": "cmw8zily10013idr76p7t5rje",
    "companyId": null,
    "companyName": "Therap (BD) Ltd.",
    "roleTitle": "Associate Software Engineer (Java)",
    "opportunityId": null,
    "message": "Salam Mahfuz Bhai! I am Tanvir (JnU CSE '25). I have solved 600+ problems on Codeforces and have hands-on experience in Java & Spring. I would be honored to be considered for a referral at Therap.",
    "resumeUrl": "https://github.com/tanvir-ahmed-dev",
    "status": "PENDING",
    "responseNote": null,
    "respondedAt": null,
    "createdAt": "2026-11-14T15:25:48.383Z",
    "updatedAt": "2026-11-14T15:25:48.383Z"
  },
  {
    "id": "cmwgk5etq00219zr726mxc9mk",
    "requesterId": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "recipientId": "cmw8zilp5000zidr7hfoq6b8j",
    "companyId": null,
    "companyName": "Brain Station 23",
    "roleTitle": "Enterprise Cloud & AI Solutions Trainee",
    "opportunityId": null,
    "message": "Salam Sadia Apu! I am preparing for cloud architecture certifications and saw the BS23 Cloud cohort. Would appreciate your mentorship and guidance!",
    "resumeUrl": "https://github.com/sooooojib",
    "status": "COMPLETED",
    "responseNote": "Referred through Brain Station 23 internal portal. HR will contact you for the technical evaluation round.",
    "respondedAt": "2026-11-14T15:25:48.492Z",
    "createdAt": "2026-11-14T15:25:48.494Z",
    "updatedAt": "2026-11-14T15:25:48.494Z"
  }
]
```

---

## `notifications`

* **Domain:** Alerts and calendar
* **Description:** In-app notification alerts
* **Total Rows:** 42

```json
[
  {
    "id": "cmw3bs9wy0025d6r7isilm638",
    "recipientId": "cmw3bo4ip000j3jr7a4gq18s0",
    "type": "APPLICATION_SHORTLISTED",
    "title": "Application Shortlisted!",
    "message": "Congratulations! Your application for Frontend Engineering Intern at Vercel has been shortlisted for technical review.",
    "relatedEntityType": null,
    "relatedEntityId": null,
    "actionUrl": "/applications",
    "isRead": false,
    "readAt": null,
    "createdAt": "2026-11-05T09:10:38.386Z",
    "updatedAt": "2026-11-05T09:10:38.386Z"
  },
  {
    "id": "cmw3bs9yr0026d6r7c9c3nt59",
    "recipientId": "cmw3bo4ip000j3jr7a4gq18s0",
    "type": "REFERRAL_RESPONSE",
    "title": "Career Referral Accepted",
    "message": "Tariqul Islam (Databricks) accepted your referral request for Cloud Infrastructure Engineer.",
    "relatedEntityType": null,
    "relatedEntityId": null,
    "actionUrl": "/referrals",
    "isRead": true,
    "readAt": "2026-11-05T09:10:38.385Z",
    "createdAt": "2026-11-05T09:10:38.451Z",
    "updatedAt": "2026-11-05T09:10:38.451Z"
  },
  {
    "id": "cmw3bsa0g0027d6r7sxul9wpt",
    "recipientId": "cmw3bo4ip000j3jr7a4gq18s0",
    "type": "MEMBERSHIP_APPROVED",
    "title": "University Membership Verified",
    "message": "Your STUDENT membership verification dossier has been approved by the Office of the Registrar.",
    "relatedEntityType": null,
    "relatedEntityId": null,
    "actionUrl": "/profile/me",
    "isRead": true,
    "readAt": "2026-11-05T09:10:38.385Z",
    "createdAt": "2026-11-05T09:10:38.512Z",
    "updatedAt": "2026-11-05T09:10:38.512Z"
  },
  {
    "id": "cmw3bsa3u0028d6r79rsxfxos",
    "recipientId": "cmw3bo4y7000p3jr756dqp21t",
    "type": "CONNECTION_REQUEST",
    "title": "New Network Connection",
    "message": "Farhan Ahmed (Senior CS Student) connected with you on the university network.",
    "relatedEntityType": null,
    "relatedEntityId": null,
    "actionUrl": "/profile/cmw3bo4ip000j3jr7a4gq18s0",
    "isRead": true,
    "readAt": "2026-11-05T09:10:38.385Z",
    "createdAt": "2026-11-05T09:10:38.634Z",
    "updatedAt": "2026-11-05T09:10:38.634Z"
  },
  {
    "id": "cmw3bsa5k0029d6r74a9v3n9i",
    "recipientId": "cmw3bo551000s3jr7amz6hxy9",
    "type": "REFERRAL_REQUEST",
    "title": "New Career Referral Request",
    "message": "Nusrat Jahan requested a referral for Junior FinTech Backend Engineer at bKash.",
    "relatedEntityType": null,
    "relatedEntityId": null,
    "actionUrl": "/referrals",
    "isRead": false,
    "readAt": null,
    "createdAt": "2026-11-05T09:10:38.696Z",
    "updatedAt": "2026-11-05T09:10:38.696Z"
  },
  {
    "id": "cmw3bsa73002ad6r70r51a58g",
    "recipientId": "cmw32x6lo000gx6r7cxbbtlrb",
    "type": "SYSTEM_ANNOUNCEMENT",
    "title": "New Content Moderation Report",
    "message": "A community post was reported for spam: 'BUY CHEAP CRYPTO & ESSAY WRITING SERVICES'.",
    "relatedEntityType": null,
    "relatedEntityId": null,
    "actionUrl": "/admin",
    "isRead": false,
    "readAt": null,
    "createdAt": "2026-11-05T09:10:38.751Z",
    "updatedAt": "2026-11-05T09:10:38.751Z"
  },
  {
    "id": "cmw6slz0i000208kxtot1lvut",
    "recipientId": "cmw54b6zy0059uar7d57zug0h",
    "type": "APPLICATION_SUBMITTED",
    "title": "Application Submitted Successfully",
    "message": "Your application for Junior Product Design Associate 1794078437393 at Global FinTech Hub has been recorded.",
    "relatedEntityType": "APPLICATION",
    "relatedEntityId": "cmw6slxpr000008kxbhbw5dnv",
    "actionUrl": "/applications",
    "isRead": true,
    "readAt": "2026-11-07T20:04:02.333Z",
    "createdAt": "2026-11-07T19:24:56.322Z",
    "updatedAt": "2026-11-07T20:04:02.339Z"
  },
  {
    "id": "cmw3f330w000107kx8y6gzcc5",
    "recipientId": "cmw3bo551000s3jr7amz6hxy9",
    "type": "OPPORTUNITY_APPROVED",
    "title": "Opportunity Approved: Junior Data Analyst & BI Developer (Pending Review)",
    "message": "Your opportunity has been approved and is now visible to verified members.",
    "relatedEntityType": "OPPORTUNITY",
    "relatedEntityId": "cmw3bo6ns001f3jr7djxjplnc",
    "actionUrl": "/opportunities/cmw3bo6ns001f3jr7djxjplnc",
    "isRead": false,
    "readAt": null,
    "createdAt": "2026-11-05T10:43:01.520Z",
    "updatedAt": "2026-11-05T10:43:01.520Z"
  },
  {
    "id": "cmw3i3ux0000207kxon60b1ft",
    "recipientId": "cmw3bo4ip000j3jr7a4gq18s0",
    "type": "CONNECTION_REQUEST",
    "title": "New Connection Request",
    "message": "Nusrat Jahan sent you a university network connection request.",
    "relatedEntityType": "CONNECTION",
    "relatedEntityId": "cmw3i3b33000107kxuplgm9on",
    "actionUrl": "/profile/cmw3bo4p1000m3jr79ogndqat",
    "isRead": false,
    "readAt": null,
    "createdAt": "2026-11-05T12:07:36.516Z",
    "updatedAt": "2026-11-05T12:07:36.516Z"
  },
  {
    "id": "cmwh90ejx000208jyolmrk1yz",
    "recipientId": "cmw32x6lo000gx6r7cxbbtlrb",
    "type": "APPLICATION_SUBMITTED",
    "title": "Application Submitted Successfully",
    "message": "Your application for Junior Backend Engineer (Core Transaction Engine) at bKash Limited has been recorded.",
    "relatedEntityType": "APPLICATION",
    "relatedEntityId": "cmwh905oe000008jy2pfd9jj6",
    "actionUrl": "/applications",
    "isRead": false,
    "readAt": null,
    "createdAt": "2026-11-15T03:01:45.261Z",
    "updatedAt": "2026-11-15T03:01:45.261Z"
  },
  {
    "id": "cmwh916qq000208kz9j9136r9",
    "recipientId": "cmw54b766005cuar7sdkyfuq8",
    "type": "APPLICATION_SUBMITTED",
    "title": "Application Submitted Successfully",
    "message": "Your application for Undergraduate Teaching Assistant (Data Structures & Algorithms) at Jagannath University Dept of CSE has been recorded.",
    "relatedEntityType": "APPLICATION",
    "relatedEntityId": "cmwh912sp000008kzfc2kbvhg",
    "actionUrl": "/applications",
    "isRead": false,
    "readAt": null,
    "createdAt": "2026-11-15T03:02:21.794Z",
    "updatedAt": "2026-11-15T03:02:21.794Z"
  },
  {
    "id": "cmwhxcyye000108jplcawq3ew",
    "recipientId": "lInQM5fUHIDxGH2Zgs5qdm0aWZSjVTUr",
    "type": "CONNECTION_REQUEST",
    "title": "New Connection Request",
    "message": "maufiya khatun sent you a university network connection request.",
    "relatedEntityType": "CONNECTION",
    "relatedEntityId": "cmwhxcrat000008jpcnj67x31",
    "actionUrl": "/profile/lnCXe6mNhDbNA5kcNrPRCHyIrxn2BLTH",
    "isRead": false,
    "readAt": null,
    "createdAt": "2026-11-15T14:23:22.358Z",
    "updatedAt": "2026-11-15T14:23:22.358Z"
  },
  {
    "id": "cmwitvwe6000208jg48u8zcxy",
    "recipientId": "zw0XJr3KbwTWoM9S18hfFR3WCgilIzLf",
    "type": "APPLICATION_SUBMITTED",
    "title": "Application Submitted Successfully",
    "message": "Your application for Management Trainee — Corporate Banking & Credit Risk at BRAC Bank PLC has been recorded.",
    "relatedEntityType": "APPLICATION",
    "relatedEntityId": "cmwitvpjo000008jg3afkg7z3",
    "actionUrl": "/applications",
    "isRead": false,
    "readAt": null,
    "createdAt": "2026-11-16T05:33:53.214Z",
    "updatedAt": "2026-11-16T05:33:53.214Z"
  },
  {
    "id": "cmwiuzux1000207js1vbr3yai",
    "recipientId": "zw0XJr3KbwTWoM9S18hfFR3WCgilIzLf",
    "type": "APPLICATION_SUBMITTED",
    "title": "Application Submitted Successfully",
    "message": "Your application for Distributed Telemetry Systems Intern (Go & Kafka) at Optimizely Bangladesh has been recorded.",
    "relatedEntityType": "APPLICATION",
    "relatedEntityId": "cmwiuzef2000007jsyuzojb1u",
    "actionUrl": "/applications",
    "isRead": false,
    "readAt": null,
    "createdAt": "2026-11-16T06:04:57.541Z",
    "updatedAt": "2026-11-16T06:04:57.541Z"
  },
  {
    "id": "cmwkpdcyr000308k2ps3qwmww",
    "recipientId": "cmw32x6lo000gx6r7cxbbtlrb",
    "type": "APPLICATION_SUBMITTED",
    "title": "Application Submitted Successfully",
    "message": "Your application for Undergraduate Teaching Assistant (Data Structures & Algorithms) at Jagannath University Dept of CSE has been recorded.",
    "relatedEntityType": "APPLICATION",
    "relatedEntityId": "cmwkpctll000108k2zpi8dh88",
    "actionUrl": "/applications",
    "isRead": false,
    "readAt": null,
    "createdAt": "2026-11-17T13:03:02.115Z",
    "updatedAt": "2026-11-17T13:03:02.115Z"
  },
  {
    "id": "cmw3c74t90010cur7tqerkh1q",
    "recipientId": "cmw3bo4ip000j3jr7a4gq18s0",
    "type": "OPPORTUNITY_DEADLINE_APPROACHING",
    "title": "Deadline Closing: Junior FinTech Backend Engineer",
    "message": "The application deadline for Junior FinTech Backend Engineer at bKash Limited closes in ~48 hours (Nov 7, 2026).",
    "relatedEntityType": "OPPORTUNITY",
    "relatedEntityId": "cmw32xqoq000nz4r7qkmyx2rz",
    "actionUrl": "/opportunities/cmw32xqoq000nz4r7qkmyx2rz",
    "isRead": false,
    "readAt": null,
    "createdAt": "2026-11-05T09:22:11.613Z",
    "updatedAt": "2026-11-05T09:22:11.613Z"
  },
  {
    "id": "cmw54v21s000508l4f2vvauma",
    "recipientId": "cmw3bo4p1000m3jr79ogndqat",
    "type": "POST_COMMENT",
    "title": "New Comment on Your Post",
    "message": "Standard Student commented on your community post.",
    "relatedEntityType": "POST",
    "relatedEntityId": "cmw3bs8yn001cd6r74fj3bccq",
    "actionUrl": "/feed?post=cmw3bs8yn001cd6r74fj3bccq",
    "isRead": false,
    "readAt": null,
    "createdAt": "2026-11-06T15:32:23.200Z",
    "updatedAt": "2026-11-06T15:32:23.200Z"
  },
  {
    "id": "cmw7lm3e6000007jyyzlf49cu",
    "recipientId": "cmw54b6zy0059uar7d57zug0h",
    "type": "MEMBERSHIP_APPROVED",
    "title": "University Membership Verified",
    "message": "Your STUDENT membership verification has been approved. You now have full access to university platform tools.",
    "relatedEntityType": "MEMBERSHIP",
    "relatedEntityId": "cmw7lizi5000107l3801w7gx6",
    "actionUrl": "/profile/me",
    "isRead": false,
    "readAt": null,
    "createdAt": "2026-11-08T08:56:50.862Z",
    "updatedAt": "2026-11-08T08:56:50.862Z"
  },
  {
    "id": "cmw561e2y000a08l4sopt5pu2",
    "recipientId": "cmw54b6zy0059uar7d57zug0h",
    "type": "APPLICATION_SUBMITTED",
    "title": "Application Submitted Successfully",
    "message": "Your application for Junior Product Design Associate 1793873647445 at Global FinTech Hub has been recorded.",
    "relatedEntityType": "APPLICATION",
    "relatedEntityId": "cmw5618u8000808l4n420vygh",
    "actionUrl": "/applications",
    "isRead": true,
    "readAt": "2026-11-07T20:04:02.333Z",
    "createdAt": "2026-11-06T16:05:18.346Z",
    "updatedAt": "2026-11-07T20:04:02.339Z"
  },
  {
    "id": "cmw81kl3d000208jpw476r02s",
    "recipientId": "cmw54b766005cuar7sdkyfuq8",
    "type": "APPLICATION_SUBMITTED",
    "title": "Application Submitted Successfully",
    "message": "Your application for Junior Product Design Associate 1794154788531 at Global FinTech Hub has been recorded.",
    "relatedEntityType": "APPLICATION",
    "relatedEntityId": "cmw81kg42000008jpkdysq752",
    "actionUrl": "/applications",
    "isRead": false,
    "readAt": null,
    "createdAt": "2026-11-08T16:23:34.345Z",
    "updatedAt": "2026-11-08T16:23:34.345Z"
  },
  {
    "id": "cmw81t7v1000a08jp9lml1qrl",
    "recipientId": "cmw3bo4ip000j3jr7a4gq18s0",
    "type": "POST_COMMENT",
    "title": "New Comment on Your Post",
    "message": "Standard Alumni commented on your community post.",
    "relatedEntityType": "POST",
    "relatedEntityId": "cmw3br6c8001b9gr7536v9ejv",
    "actionUrl": "/feed?post=cmw3br6c8001b9gr7536v9ejv",
    "isRead": false,
    "readAt": null,
    "createdAt": "2026-11-08T16:30:17.101Z",
    "updatedAt": "2026-11-08T16:30:17.101Z"
  },
  {
    "id": "cmw92cnxo000208iiias96qhi",
    "recipientId": "cmw54b766005cuar7sdkyfuq8",
    "type": "APPLICATION_SUBMITTED",
    "title": "Application Submitted Successfully",
    "message": "Your application for Junior Product Design Associate 1794216539127 at Global FinTech Hub has been recorded.",
    "relatedEntityType": "APPLICATION",
    "relatedEntityId": "cmw92cjvs000008iilh2jq4wx",
    "actionUrl": "/applications",
    "isRead": false,
    "readAt": null,
    "createdAt": "2026-11-09T09:33:10.572Z",
    "updatedAt": "2026-11-09T09:33:10.572Z"
  },
  {
    "id": "cmw9ld2g9000408l2j87xcnyt",
    "recipientId": "cmw8zimoo001fidr7gceqsc6q",
    "type": "COMMENT_REPLY",
    "title": "New Reply to Your Comment",
    "message": "Standard Student replied to your comment on a community discussion.",
    "relatedEntityType": "COMMENT",
    "relatedEntityId": "cmw9ld13l000308l2k2wla8ag",
    "actionUrl": "/feed?post=cmw8ziqav002tidr7ujm1ch65",
    "isRead": false,
    "readAt": null,
    "createdAt": "2026-11-09T18:25:22.089Z",
    "updatedAt": "2026-11-09T18:25:22.089Z"
  },
  {
    "id": "cmwawdss80001z4w65obq89jp",
    "recipientId": "lInQM5fUHIDxGH2Zgs5qdm0aWZSjVTUr",
    "type": "CONNECTION_REQUEST",
    "title": "New Connection Request",
    "message": "Standard Student sent you a university network connection request.",
    "relatedEntityType": "CONNECTION",
    "relatedEntityId": "cmwawdsk70000z4w6mqqqo2zr",
    "actionUrl": "/profile/cmw54b6zy0059uar7d57zug0h",
    "isRead": false,
    "readAt": null,
    "createdAt": "2026-11-10T16:21:38.168Z",
    "updatedAt": "2026-11-10T16:21:38.168Z"
  },
  {
    "id": "cmw95dj4j000607jwsasf8453",
    "recipientId": "zw0XJr3KbwTWoM9S18hfFR3WCgilIzLf",
    "type": "CONNECTION_REQUEST",
    "title": "New Connection Request",
    "message": "Jannatun Nahar Jui sent you a university network connection request.",
    "relatedEntityType": "CONNECTION",
    "relatedEntityId": "cmw95di9j000507jwwrg872ig",
    "actionUrl": "/profile/l1gQBbGkGyFhqUKNkJFyKAfX7uplfyrM",
    "isRead": false,
    "readAt": null,
    "createdAt": "2026-11-09T10:57:49.843Z",
    "updatedAt": "2026-11-09T10:57:49.843Z"
  },
  {
    "id": "cmw98dufz000107l5wpb6q17i",
    "recipientId": "zw0XJr3KbwTWoM9S18hfFR3WCgilIzLf",
    "type": "CONNECTION_REQUEST",
    "title": "New Connection Request",
    "message": "Naima marjan Jerin sent you a university network connection request.",
    "relatedEntityType": "CONNECTION",
    "relatedEntityId": "cmw98dtp0000007l5njcgqacm",
    "actionUrl": "/profile/9eX2XFGRfXneGZFXb37Qdpo0RhAPWzSx",
    "isRead": false,
    "readAt": null,
    "createdAt": "2026-11-09T12:22:03.359Z",
    "updatedAt": "2026-11-09T12:22:03.359Z"
  },
  {
    "id": "cmw9a7np0000108jqwx0whflv",
    "recipientId": "9eX2XFGRfXneGZFXb37Qdpo0RhAPWzSx",
    "type": "SYSTEM_ANNOUNCEMENT",
    "title": "University Membership Verified",
    "message": "Your university membership verification has been approved by campus administrators.",
    "relatedEntityType": "SYSTEM",
    "relatedEntityId": null,
    "actionUrl": null,
    "isRead": false,
    "readAt": null,
    "createdAt": "2026-11-09T13:13:13.908Z",
    "updatedAt": "2026-11-09T13:13:13.908Z"
  },
  {
    "id": "cmw9a7udy000308jqlag0zzca",
    "recipientId": "lnCXe6mNhDbNA5kcNrPRCHyIrxn2BLTH",
    "type": "SYSTEM_ANNOUNCEMENT",
    "title": "University Membership Verified",
    "message": "Your university membership verification has been approved by campus administrators.",
    "relatedEntityType": "SYSTEM",
    "relatedEntityId": null,
    "actionUrl": null,
    "isRead": false,
    "readAt": null,
    "createdAt": "2026-11-09T13:13:22.582Z",
    "updatedAt": "2026-11-09T13:13:22.582Z"
  },
  {
    "id": "cmw9a7y3g000508jq7phmzz4z",
    "recipientId": "l1gQBbGkGyFhqUKNkJFyKAfX7uplfyrM",
    "type": "SYSTEM_ANNOUNCEMENT",
    "title": "University Membership Verified",
    "message": "Your university membership verification has been approved by campus administrators.",
    "relatedEntityType": "SYSTEM",
    "relatedEntityId": null,
    "actionUrl": null,
    "isRead": false,
    "readAt": null,
    "createdAt": "2026-11-09T13:13:27.388Z",
    "updatedAt": "2026-11-09T13:13:27.388Z"
  },
  {
    "id": "cmw9a81yq000708jq9ekk781w",
    "recipientId": "zw0XJr3KbwTWoM9S18hfFR3WCgilIzLf",
    "type": "SYSTEM_ANNOUNCEMENT",
    "title": "University Membership Verified",
    "message": "Your university membership verification has been approved by campus administrators.",
    "relatedEntityType": "SYSTEM",
    "relatedEntityId": null,
    "actionUrl": null,
    "isRead": false,
    "readAt": null,
    "createdAt": "2026-11-09T13:13:32.402Z",
    "updatedAt": "2026-11-09T13:13:32.402Z"
  },
  {
    "id": "cmwd98k4p000107lbszfixzz3",
    "recipientId": "cmw32x6lo000gx6r7cxbbtlrb",
    "type": "POST_COMMENT",
    "title": "New Comment on Your Post",
    "message": "Standard Alumni commented on your community post.",
    "relatedEntityType": "POST",
    "relatedEntityId": "cmw3bs8qz0017d6r7bh5r274y",
    "actionUrl": "/feed?post=cmw3bs8qz0017d6r7bh5r274y",
    "isRead": false,
    "readAt": null,
    "createdAt": "2026-11-12T07:57:01.033Z",
    "updatedAt": "2026-11-12T08:00:19.057Z"
  },
  {
    "id": "cmw9a8d42000908jq98p017nr",
    "recipientId": "zw0XJr3KbwTWoM9S18hfFR3WCgilIzLf",
    "type": "SYSTEM_ANNOUNCEMENT",
    "title": "Academic CGPA Verified",
    "message": "Your academic CGPA (3.59) has been officially authenticated by campus administration.",
    "relatedEntityType": "SYSTEM",
    "relatedEntityId": null,
    "actionUrl": null,
    "isRead": false,
    "readAt": null,
    "createdAt": "2026-11-09T13:13:46.850Z",
    "updatedAt": "2026-11-09T13:13:46.850Z"
  },
  {
    "id": "cmw9aakr5000508k1syv3tfpz",
    "recipientId": "lnCXe6mNhDbNA5kcNrPRCHyIrxn2BLTH",
    "type": "MEMBERSHIP_APPROVED",
    "title": "University Membership Verified",
    "message": "Your STUDENT membership verification has been approved. You now have full access to university platform tools.",
    "relatedEntityType": "MEMBERSHIP",
    "relatedEntityId": "cmw94jatx000107jwmuva2boc",
    "actionUrl": "/profile/me",
    "isRead": true,
    "readAt": "2026-11-09T14:05:47.207Z",
    "createdAt": "2026-11-09T13:15:30.065Z",
    "updatedAt": "2026-11-09T14:05:47.213Z"
  },
  {
    "id": "cmw9lap4w000108l26yogta4w",
    "recipientId": "cmw32x6lo000gx6r7cxbbtlrb",
    "type": "POST_COMMENT",
    "title": "New Comment on Your Post",
    "message": "Standard Alumni commented on your community post.",
    "relatedEntityType": "POST",
    "relatedEntityId": "cmw3br66l00189gr7qwcvkmt1",
    "actionUrl": "/feed?post=cmw3br66l00189gr7qwcvkmt1",
    "isRead": false,
    "readAt": null,
    "createdAt": "2026-11-09T18:23:31.520Z",
    "updatedAt": "2026-11-12T07:57:12.888Z"
  },
  {
    "id": "cmw9aacdu000108k1lrp03ojs",
    "recipientId": "9eX2XFGRfXneGZFXb37Qdpo0RhAPWzSx",
    "type": "MEMBERSHIP_APPROVED",
    "title": "University Membership Verified",
    "message": "Your STUDENT membership verification has been approved. You now have full access to university platform tools.",
    "relatedEntityType": "MEMBERSHIP",
    "relatedEntityId": "cmw98bsdg000108k1rfgcw2cj",
    "actionUrl": "/profile/me",
    "isRead": false,
    "readAt": null,
    "createdAt": "2026-11-09T13:15:19.218Z",
    "updatedAt": "2026-11-09T13:15:19.218Z"
  },
  {
    "id": "cmw9aaf8g000308k1wb93n9ph",
    "recipientId": "l1gQBbGkGyFhqUKNkJFyKAfX7uplfyrM",
    "type": "MEMBERSHIP_APPROVED",
    "title": "University Membership Verified",
    "message": "Your STUDENT membership verification has been approved. You now have full access to university platform tools.",
    "relatedEntityType": "MEMBERSHIP",
    "relatedEntityId": "cmw95358n000307jwoa9hz9uu",
    "actionUrl": "/profile/me",
    "isRead": false,
    "readAt": null,
    "createdAt": "2026-11-09T13:15:22.912Z",
    "updatedAt": "2026-11-09T13:15:22.912Z"
  },
  {
    "id": "cmwg054vu000108l41l7ubg2c",
    "recipientId": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "type": "SYSTEM_ANNOUNCEMENT",
    "title": "University Membership Verified",
    "message": "Your university membership verification has been approved by campus administrators.",
    "relatedEntityType": "SYSTEM",
    "relatedEntityId": null,
    "actionUrl": null,
    "isRead": false,
    "readAt": null,
    "createdAt": "2026-11-14T06:05:43.290Z",
    "updatedAt": "2026-11-14T06:05:43.290Z"
  },
  {
    "id": "cmwg0j75s000308l4ixa3ul3r",
    "recipientId": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "type": "SYSTEM_ANNOUNCEMENT",
    "title": "Verification Status Updated",
    "message": "Your verification status has been set to PENDING. Note: Verification revoked by administrator.",
    "relatedEntityType": "SYSTEM",
    "relatedEntityId": null,
    "actionUrl": null,
    "isRead": false,
    "readAt": null,
    "createdAt": "2026-11-14T06:16:39.424Z",
    "updatedAt": "2026-11-14T06:16:39.424Z"
  },
  {
    "id": "cmwg189vk000107jpv88nmg1x",
    "recipientId": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "type": "SYSTEM_ANNOUNCEMENT",
    "title": "University Membership Verified",
    "message": "Your university membership verification has been approved by campus administrators.",
    "relatedEntityType": "SYSTEM",
    "relatedEntityId": null,
    "actionUrl": null,
    "isRead": false,
    "readAt": null,
    "createdAt": "2026-11-14T06:36:09.344Z",
    "updatedAt": "2026-11-14T06:36:09.344Z"
  },
  {
    "id": "cmwg1qtkw000308jt11s1iz6f",
    "recipientId": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "type": "POST_COMMENT",
    "title": "New Comment on Your Post",
    "message": "Standard Alumni commented on your community post.",
    "relatedEntityType": "POST",
    "relatedEntityId": "cmwg1oow2000008jt1vqsuwjm",
    "actionUrl": "/feed?post=cmwg1oow2000008jt1vqsuwjm",
    "isRead": false,
    "readAt": null,
    "createdAt": "2026-11-14T06:50:34.688Z",
    "updatedAt": "2026-11-14T06:50:34.688Z"
  },
  {
    "id": "cmwg1rery000108lb0maacu0i",
    "recipientId": "cmw54b766005cuar7sdkyfuq8",
    "type": "COMMENT_REPLY",
    "title": "New Reply to Your Comment",
    "message": "S.M Sajib Al Hasan replied to your comment on a community discussion.",
    "relatedEntityType": "COMMENT",
    "relatedEntityId": "cmwg1rcgu000008lbxcojbvrc",
    "actionUrl": "/feed?post=cmwg1oow2000008jt1vqsuwjm",
    "isRead": false,
    "readAt": null,
    "createdAt": "2026-11-14T06:51:02.158Z",
    "updatedAt": "2026-11-14T06:51:02.158Z"
  },
  {
    "id": "cmwg237xp000308l5w52ubuup",
    "recipientId": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "type": "APPLICATION_SUBMITTED",
    "title": "Application Submitted Successfully",
    "message": "Your application for Junior Backend Engineer at bKash Limited has been recorded.",
    "relatedEntityType": "APPLICATION",
    "relatedEntityId": "cmwg232df000108l5bzwciiz3",
    "actionUrl": "/applications",
    "isRead": false,
    "readAt": null,
    "createdAt": "2026-11-14T07:00:13.165Z",
    "updatedAt": "2026-11-14T07:00:13.165Z"
  }
]
```

---

## `notification_preferences`

* **Domain:** Alerts and calendar
* **Description:** User notification toggle preferences
* **Total Rows:** 10

```json
[
  {
    "id": "cmwkz2fql0019rer7pwrat1vo",
    "userId": "9eX2XFGRfXneGZFXb37Qdpo0RhAPWzSx",
    "opportunitiesInApp": true,
    "applicationsInApp": true,
    "communityInApp": true,
    "membershipInApp": true,
    "remindersInApp": true,
    "opportunitiesEmail": true,
    "applicationsEmail": true,
    "communityEmail": true,
    "membershipEmail": true,
    "remindersEmail": true,
    "createdAt": "2026-11-17T17:34:28.653Z",
    "updatedAt": "2026-11-17T17:34:28.653Z"
  },
  {
    "id": "cmwkz2fs5001arer7fw7a5nnu",
    "userId": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "opportunitiesInApp": true,
    "applicationsInApp": true,
    "communityInApp": true,
    "membershipInApp": true,
    "remindersInApp": true,
    "opportunitiesEmail": true,
    "applicationsEmail": true,
    "communityEmail": false,
    "membershipEmail": true,
    "remindersEmail": true,
    "createdAt": "2026-11-17T17:34:28.709Z",
    "updatedAt": "2026-11-17T17:34:28.709Z"
  },
  {
    "id": "cmwkz2ftm001brer7fv7unmpu",
    "userId": "RIJPFcXMMKdUlnlTRBSMuFZANw97nzSe",
    "opportunitiesInApp": true,
    "applicationsInApp": true,
    "communityInApp": true,
    "membershipInApp": true,
    "remindersInApp": true,
    "opportunitiesEmail": true,
    "applicationsEmail": true,
    "communityEmail": true,
    "membershipEmail": true,
    "remindersEmail": true,
    "createdAt": "2026-11-17T17:34:28.762Z",
    "updatedAt": "2026-11-17T17:34:28.762Z"
  },
  {
    "id": "cmwkz2fv6001crer7geiy75fm",
    "userId": "VIbCmTGFv3plionrQgC4QHcQ8VLxIjLg",
    "opportunitiesInApp": true,
    "applicationsInApp": true,
    "communityInApp": true,
    "membershipInApp": true,
    "remindersInApp": true,
    "opportunitiesEmail": true,
    "applicationsEmail": true,
    "communityEmail": false,
    "membershipEmail": true,
    "remindersEmail": true,
    "createdAt": "2026-11-17T17:34:28.818Z",
    "updatedAt": "2026-11-17T17:34:28.818Z"
  },
  {
    "id": "cmwkz2fwp001drer7y9qrnj9r",
    "userId": "cmw3bo4ip000j3jr7a4gq18s0",
    "opportunitiesInApp": true,
    "applicationsInApp": true,
    "communityInApp": true,
    "membershipInApp": true,
    "remindersInApp": true,
    "opportunitiesEmail": true,
    "applicationsEmail": true,
    "communityEmail": true,
    "membershipEmail": true,
    "remindersEmail": true,
    "createdAt": "2026-11-17T17:34:28.873Z",
    "updatedAt": "2026-11-17T17:34:28.873Z"
  },
  {
    "id": "cmwkz2fy8001erer79hy7j37b",
    "userId": "cmw3bo4p1000m3jr79ogndqat",
    "opportunitiesInApp": true,
    "applicationsInApp": true,
    "communityInApp": true,
    "membershipInApp": true,
    "remindersInApp": true,
    "opportunitiesEmail": true,
    "applicationsEmail": true,
    "communityEmail": false,
    "membershipEmail": true,
    "remindersEmail": true,
    "createdAt": "2026-11-17T17:34:28.928Z",
    "updatedAt": "2026-11-17T17:34:28.928Z"
  },
  {
    "id": "cmwkz2fzr001frer74rzg006a",
    "userId": "cmw54b6zy0059uar7d57zug0h",
    "opportunitiesInApp": true,
    "applicationsInApp": true,
    "communityInApp": true,
    "membershipInApp": true,
    "remindersInApp": true,
    "opportunitiesEmail": true,
    "applicationsEmail": true,
    "communityEmail": true,
    "membershipEmail": true,
    "remindersEmail": true,
    "createdAt": "2026-11-17T17:34:28.983Z",
    "updatedAt": "2026-11-17T17:34:28.983Z"
  },
  {
    "id": "cmwkz2g1a001grer7bfw8cqfg",
    "userId": "cmw8zijo20003idr7iajyx8sj",
    "opportunitiesInApp": true,
    "applicationsInApp": true,
    "communityInApp": true,
    "membershipInApp": true,
    "remindersInApp": true,
    "opportunitiesEmail": true,
    "applicationsEmail": true,
    "communityEmail": false,
    "membershipEmail": true,
    "remindersEmail": true,
    "createdAt": "2026-11-17T17:34:29.038Z",
    "updatedAt": "2026-11-17T17:34:29.038Z"
  },
  {
    "id": "cmwkz2g2u001hrer7hj86t5jd",
    "userId": "cmw8zijx70007idr7jaac04lw",
    "opportunitiesInApp": true,
    "applicationsInApp": true,
    "communityInApp": true,
    "membershipInApp": true,
    "remindersInApp": true,
    "opportunitiesEmail": true,
    "applicationsEmail": true,
    "communityEmail": true,
    "membershipEmail": true,
    "remindersEmail": true,
    "createdAt": "2026-11-17T17:34:29.094Z",
    "updatedAt": "2026-11-17T17:34:29.094Z"
  },
  {
    "id": "cmwkz2g4d001irer73lh9jais",
    "userId": "cmw8zik6k000bidr7pthsc98t",
    "opportunitiesInApp": true,
    "applicationsInApp": true,
    "communityInApp": true,
    "membershipInApp": true,
    "remindersInApp": true,
    "opportunitiesEmail": true,
    "applicationsEmail": true,
    "communityEmail": false,
    "membershipEmail": true,
    "remindersEmail": true,
    "createdAt": "2026-11-17T17:34:29.149Z",
    "updatedAt": "2026-11-17T17:34:29.149Z"
  }
]
```

---

## `career_calendar_events`

* **Domain:** Alerts and calendar
* **Description:** Application and job deadline events
* **Total Rows:** 5

```json
[
  {
    "id": "cmw3ksmug000007i9d4gjade5",
    "userId": "cmw3bo4p1000m3jr79ogndqat",
    "title": "Presentation",
    "description": null,
    "eventType": "REMINDER",
    "startDate": "2026-11-16T03:00:00.000Z",
    "endDate": null,
    "location": null,
    "isAllDay": true,
    "relatedOpportunityId": null,
    "relatedApplicationId": null,
    "createdAt": "2026-11-05T13:22:51.688Z",
    "updatedAt": "2026-11-05T13:22:51.688Z"
  },
  {
    "id": "cmw3bs9q20021d6r70wpenls9",
    "userId": "cmw3bo4ip000j3jr7a4gq18s0",
    "title": "Vercel Round 1 Technical Interview",
    "description": "Live coding and architectural discussion on Next.js Server Components with Sarah Jenkins and lead engineer.",
    "eventType": "INTERVIEW",
    "startDate": "2026-11-09T09:10:38.138Z",
    "endDate": null,
    "location": null,
    "isAllDay": false,
    "relatedOpportunityId": null,
    "relatedApplicationId": null,
    "createdAt": "2026-11-05T09:10:38.138Z",
    "updatedAt": "2026-11-05T09:10:38.138Z"
  },
  {
    "id": "cmw3bs9s30022d6r7l3z9dnrf",
    "userId": "cmw3bo4ip000j3jr7a4gq18s0",
    "title": "bKash Technical Panel Deadline",
    "description": "Submit written take-home concurrency design assessment for core transactions platform.",
    "eventType": "APPLICATION_DEADLINE",
    "startDate": "2026-11-07T09:10:38.138Z",
    "endDate": null,
    "location": null,
    "isAllDay": true,
    "relatedOpportunityId": null,
    "relatedApplicationId": null,
    "createdAt": "2026-11-05T09:10:38.211Z",
    "updatedAt": "2026-11-05T09:10:38.211Z"
  },
  {
    "id": "cmw3bs9tm0023d6r738f8m7s8",
    "userId": "cmw3bo4ip000j3jr7a4gq18s0",
    "title": "Annual University Tech Career Fair 2026",
    "description": "University auditorium: meet recruiters from Google, Vercel, Optimizely, and bKash.",
    "eventType": "CAREER_FAIR",
    "startDate": "2026-11-19T09:10:38.138Z",
    "endDate": null,
    "location": null,
    "isAllDay": true,
    "relatedOpportunityId": null,
    "relatedApplicationId": null,
    "createdAt": "2026-11-05T09:10:38.266Z",
    "updatedAt": "2026-11-05T09:10:38.266Z"
  },
  {
    "id": "cmw3bs9v80024d6r77cnrgunf",
    "userId": "cmw3bo4p1000m3jr79ogndqat",
    "title": "Brain Station 23 AI Screening Assessment",
    "description": "Online coding test covering Python data structures and machine learning fundamentals.",
    "eventType": "INTERVIEW",
    "startDate": "2026-11-11T09:10:38.138Z",
    "endDate": null,
    "location": null,
    "isAllDay": false,
    "relatedOpportunityId": null,
    "relatedApplicationId": null,
    "createdAt": "2026-11-05T09:10:38.324Z",
    "updatedAt": "2026-11-05T09:10:38.324Z"
  }
]
```

---

## `deadline_reminder_logs`

* **Domain:** Alerts and calendar
* **Description:** Automated cron reminder dispatch logs
* **Total Rows:** 7

```json
[
  {
    "id": "cmw3c74og000zcur7lcg46tsb",
    "userId": "cmw3bo4ip000j3jr7a4gq18s0",
    "opportunityId": "cmw32xqoq000nz4r7qkmyx2rz",
    "applicationId": null,
    "reminderType": "DEADLINE_72_HOURS",
    "channel": "IN_APP",
    "sentAt": "2026-11-05T09:22:11.440Z"
  },
  {
    "id": "cmwkz2ijg002arer79gocqt4z",
    "userId": "9eX2XFGRfXneGZFXb37Qdpo0RhAPWzSx",
    "opportunityId": "cmw32xqlm000mz4r7zz8n7cf6",
    "applicationId": null,
    "reminderType": "DEADLINE_24_HOURS",
    "channel": "IN_APP",
    "sentAt": "2026-11-17T11:34:32.174Z"
  },
  {
    "id": "cmwkz2iqx002brer7gcx593nn",
    "userId": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "opportunityId": "cmw32xqoq000nz4r7qkmyx2rz",
    "applicationId": null,
    "reminderType": "DEADLINE_3_DAYS",
    "channel": "IN_APP",
    "sentAt": "2026-11-17T05:34:32.446Z"
  },
  {
    "id": "cmwkz2iyb002crer7em3957hx",
    "userId": "RIJPFcXMMKdUlnlTRBSMuFZANw97nzSe",
    "opportunityId": "cmw32xqrt000oz4r7zcvq6fd1",
    "applicationId": null,
    "reminderType": "DEADLINE_24_HOURS",
    "channel": "IN_APP",
    "sentAt": "2026-11-16T23:34:32.713Z"
  },
  {
    "id": "cmwkz2j5p002drer7kctqzyfm",
    "userId": "VIbCmTGFv3plionrQgC4QHcQ8VLxIjLg",
    "opportunityId": "cmw32xquu000pz4r7kbmmyc8p",
    "applicationId": null,
    "reminderType": "DEADLINE_3_DAYS",
    "channel": "IN_APP",
    "sentAt": "2026-11-16T17:34:32.977Z"
  },
  {
    "id": "cmwkz2jd2002erer75ybk7xcp",
    "userId": "cmw3bo4ip000j3jr7a4gq18s0",
    "opportunityId": "cmw32xqxv000qz4r7vlpk8rwn",
    "applicationId": null,
    "reminderType": "DEADLINE_24_HOURS",
    "channel": "IN_APP",
    "sentAt": "2026-11-16T11:34:33.244Z"
  },
  {
    "id": "cmwkz2jkh002frer7i2mopj3b",
    "userId": "cmw3bo4p1000m3jr79ogndqat",
    "opportunityId": "cmw32xr10000rz4r7hjp6y1nr",
    "applicationId": null,
    "reminderType": "DEADLINE_3_DAYS",
    "channel": "IN_APP",
    "sentAt": "2026-11-16T05:34:33.509Z"
  }
]
```

---

## `admin_audit_logs`

* **Domain:** Admin
* **Description:** Immutable administrative governance audit logs
* **Total Rows:** 182

```json
[
  {
    "id": "cmw3cosrm000wq2r7t74osnnt",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw3cosck000vq2r743oo9slu",
    "targetLabel": "Frontend Engineering Associate",
    "reason": null,
    "details": {
      "posterId": "cmw3cor1b000pq2r7vakryoqi",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T09:35:55.810Z"
  },
  {
    "id": "cmw6rxvnz000wsyr7johxy5h9",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw6rxv8m000vsyr7w6yn54a3",
    "targetLabel": "Frontend Engineering Associate",
    "reason": null,
    "details": {
      "posterId": "cmw6rxtyx000psyr7lw1thn9c",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-07T19:06:12.239Z"
  },
  {
    "id": "cmw6rxy21001asyr7qo4tjr6d",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_CLOSED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw6rxxpu0017syr76faoi2vt",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw34duhv00000nr702nxvgo1",
      "newStatus": "CLOSED",
      "previousStatus": "APPROVED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-07T19:06:15.337Z"
  },
  {
    "id": "cmw7lb5fu000whnr7ys9509qq",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw7lb50s000vhnr7vk4kw3pi",
    "targetLabel": "Frontend Engineering Associate",
    "reason": null,
    "details": {
      "posterId": "cmw7lb3xn000phnr7dql865os",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T08:48:20.298Z"
  },
  {
    "id": "cmw6t2pj8000ws3r7acrmrbqq",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw6t2p3z000vs3r764pq4dn8",
    "targetLabel": "Frontend Engineering Associate",
    "reason": null,
    "details": {
      "posterId": "cmw6t2o0u000ps3r7ae48piwp",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-07T19:37:57.188Z"
  },
  {
    "id": "cmw6t2smd001is3r77d8xmpnh",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_RESTORED",
    "targetType": "USER",
    "targetId": "cmw6t2scu001gs3r7h8r9wgj3",
    "targetLabel": "Suspended Account",
    "reason": "Review completed; student warned.",
    "details": {
      "newStatus": "ACTIVE",
      "userEmail": "wf_1794080267268_violation_user@university.edu",
      "previousStatus": "SUSPENDED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-07T19:38:01.189Z"
  },
  {
    "id": "cmw7lb7rr001ahnr79gb1kupy",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_CLOSED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw7lb7fh0016hnr7b3e7bbhd",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw7i03j10000pwr7gb0q460u",
      "newStatus": "CLOSED",
      "previousStatus": "APPROVED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T08:48:23.319Z"
  },
  {
    "id": "cmw7lb85p001ehnr7xlocr27k",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "POST_REMOVED",
    "targetType": "POST",
    "targetId": "cmw7lb7we001bhnr7daa2sewr",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": null,
    "ipAddress": null,
    "createdAt": "2026-11-08T08:48:23.821Z"
  },
  {
    "id": "cmw3e0mkm001jaur7ri70k94n",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_RESTORED",
    "targetType": "USER",
    "targetId": "cmw3e0mbn001haur7lf4vmn7t",
    "targetLabel": "Suspended Account",
    "reason": "Review completed; student warned.",
    "details": {
      "newStatus": "ACTIVE",
      "userEmail": "wf_1793873573410_violation_user@university.edu",
      "previousStatus": "SUSPENDED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T10:13:07.270Z"
  },
  {
    "id": "cmw7lb879001fhnr745xttsvg",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "CONTENT_REPORT_RESOLVED",
    "targetType": "REPORT",
    "targetId": "cmw7lb7xx001dhnr7p3ddqj6t",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": {
      "decision": "REMOVE_CONTENT",
      "targetId": "cmw7lb7we001bhnr7daa2sewr",
      "targetType": "POST"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T08:48:23.877Z"
  },
  {
    "id": "cmw7lb8f6001hhnr7rnj96tbo",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_SUSPENDED",
    "targetType": "USER",
    "targetId": "cmw7lb8ae001ghnr7nv9tdhhw",
    "targetLabel": "Suspended Account",
    "reason": "Severe policy breach under review.",
    "details": {
      "newStatus": "SUSPENDED",
      "userEmail": "wf_1794127689846_violation_user@university.edu",
      "previousStatus": "ACTIVE"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T08:48:24.162Z"
  },
  {
    "id": "cmw7m32yl001cskr72ixdapwr",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw7m32se001bskr7ksloajss",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw34dunu00020nr7ue5elwel",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T09:10:03.453Z"
  },
  {
    "id": "cmw7m334q001eskr71okbjbdg",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_CLOSED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw7m32se001bskr7ksloajss",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw34dunu00020nr7ue5elwel",
      "newStatus": "CLOSED",
      "previousStatus": "APPROVED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T09:10:03.674Z"
  },
  {
    "id": "cmw7m33ij001iskr7ljj6jeg5",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "POST_REMOVED",
    "targetType": "POST",
    "targetId": "cmw7m339a001fskr7mcru8krd",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": null,
    "ipAddress": null,
    "createdAt": "2026-11-08T09:10:04.171Z"
  },
  {
    "id": "cmw7m33k4001jskr7a3y1mey4",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "CONTENT_REPORT_RESOLVED",
    "targetType": "REPORT",
    "targetId": "cmw7m33at001hskr7goaaxfra",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": {
      "decision": "REMOVE_CONTENT",
      "targetId": "cmw7m339a001fskr7mcru8krd",
      "targetType": "POST"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T09:10:04.228Z"
  },
  {
    "id": "cmw7m33s4001lskr7jgih5yag",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_SUSPENDED",
    "targetType": "USER",
    "targetId": "cmw7m33nb001kskr76rym0inc",
    "targetLabel": "Suspended Account",
    "reason": "Severe policy breach under review.",
    "details": {
      "newStatus": "SUSPENDED",
      "userEmail": "wf_1794128990239_violation_user@university.edu",
      "previousStatus": "ACTIVE"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T09:10:04.516Z"
  },
  {
    "id": "cmw6qazyr001jahr7nquwonqy",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_RESTORED",
    "targetType": "USER",
    "targetId": "cmw6qazpe001hahr7lk0q5itr",
    "targetLabel": "Suspended Account",
    "reason": "Review completed; student warned.",
    "details": {
      "newStatus": "ACTIVE",
      "userEmail": "wf_1794075611188_violation_user@university.edu",
      "previousStatus": "SUSPENDED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-07T18:20:25.107Z"
  },
  {
    "id": "cmw7y03rc000zb2r79vh60jrx",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw7y03c6000yb2r7cpu7y7dk",
    "targetLabel": "Frontend Engineering Associate",
    "reason": null,
    "details": {
      "posterId": "cmw7y0278000rb2r7jkrusl6w",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T14:43:39.912Z"
  },
  {
    "id": "cmw7gmu9p0017ntr78mv3n3t6",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw7gmu3e0016ntr7zywd3usz",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw34duhv00000nr702nxvgo1",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T06:37:27.613Z"
  },
  {
    "id": "cmw7gmufv001antr7engbtzhv",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_CLOSED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw7gmu3e0016ntr7zywd3usz",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw34duhv00000nr702nxvgo1",
      "newStatus": "CLOSED",
      "previousStatus": "APPROVED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T06:37:27.835Z"
  },
  {
    "id": "cmw7y0605001cb2r7jb4gq4me",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw7y05u6001bb2r78jom0ymp",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw34dunu00020nr7ue5elwel",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T14:43:42.821Z"
  },
  {
    "id": "cmw7y06k6001ib2r7p4g0aczz",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "POST_REMOVED",
    "targetType": "POST",
    "targetId": "cmw7y06ax001fb2r7pth1t3qa",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": null,
    "ipAddress": null,
    "createdAt": "2026-11-08T14:43:43.542Z"
  },
  {
    "id": "cmw7y06lp001jb2r7rlnjgz1o",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "CONTENT_REPORT_RESOLVED",
    "targetType": "REPORT",
    "targetId": "cmw7y06ci001hb2r7uz5wppll",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": {
      "decision": "REMOVE_CONTENT",
      "targetId": "cmw7y06ax001fb2r7pth1t3qa",
      "targetType": "POST"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T14:43:43.597Z"
  },
  {
    "id": "cmw7h6ou9000wl9r7o2sd4ujo",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw7h6ofg000vl9r7yc9vngfd",
    "targetLabel": "Frontend Engineering Associate",
    "reason": null,
    "details": {
      "posterId": "cmw7h6n7i000pl9r7boog5arz",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T06:52:53.697Z"
  },
  {
    "id": "cmw7h6qwt0018l9r7t8i4gai2",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw7h6qqo0017l9r7krxgappg",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw34duhv00000nr702nxvgo1",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T06:52:56.381Z"
  },
  {
    "id": "cmw7h6r2z001al9r76azum1eq",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_CLOSED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw7h6qqo0017l9r7krxgappg",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw34duhv00000nr702nxvgo1",
      "newStatus": "CLOSED",
      "previousStatus": "APPROVED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T06:52:56.603Z"
  },
  {
    "id": "cmw6qeu3r000wour7slfj2ngc",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw6qetow000vour7z5xrjgkt",
    "targetLabel": "Frontend Engineering Associate",
    "reason": null,
    "details": {
      "posterId": "cmw6qesm8000pour7lnxryc8x",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-07T18:23:24.135Z"
  },
  {
    "id": "cmw6qewgh001bour7595hrt7g",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_CLOSED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw6qew430018our7d8m69cp9",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw38q92r0000syr7v3ysfij3",
      "newStatus": "CLOSED",
      "previousStatus": "APPROVED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-07T18:23:27.185Z"
  },
  {
    "id": "cmw6qewua001four7go6v4j82",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "POST_REMOVED",
    "targetType": "POST",
    "targetId": "cmw6qewl1001cour7ivhx8o4u",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": null,
    "ipAddress": null,
    "createdAt": "2026-11-07T18:23:27.682Z"
  },
  {
    "id": "cmw6qewvt001gour7cueuu3g5",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "CONTENT_REPORT_RESOLVED",
    "targetType": "REPORT",
    "targetId": "cmw6qewmn001eour7vktrtazo",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": {
      "decision": "REMOVE_CONTENT",
      "targetId": "cmw6qewl1001cour7ivhx8o4u",
      "targetType": "POST"
    },
    "ipAddress": null,
    "createdAt": "2026-11-07T18:23:27.738Z"
  },
  {
    "id": "cmw7y06td001lb2r7ft4hepqe",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_SUSPENDED",
    "targetType": "USER",
    "targetId": "cmw7y06oq001kb2r7sfx7iczj",
    "targetLabel": "Suspended Account",
    "reason": "Severe policy breach under review.",
    "details": {
      "newStatus": "SUSPENDED",
      "userEmail": "wf_1794149010083_violation_user@university.edu",
      "previousStatus": "ACTIVE"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T14:43:43.873Z"
  },
  {
    "id": "cmw3cov6x0019q2r7bkbjcp6i",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw3cov0s0018q2r7snxq2fxj",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw38q92r0000syr7v3ysfij3",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T09:35:58.953Z"
  },
  {
    "id": "cmw3covr3001fq2r7fzoafkkf",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "POST_REMOVED",
    "targetType": "POST",
    "targetId": "cmw3covhq001cq2r77k0ffazl",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": null,
    "ipAddress": null,
    "createdAt": "2026-11-05T09:35:59.679Z"
  },
  {
    "id": "cmw3aegii000f4ar7y3xfwtg4",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw3aegci000e4ar7cbq6pb4s",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw38q92r0000syr7v3ysfij3",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:31:54.138Z"
  },
  {
    "id": "cmw3aegoq000h4ar7nastcdv1",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_CLOSED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw3aegci000e4ar7cbq6pb4s",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw38q92r0000syr7v3ysfij3",
      "newStatus": "CLOSED",
      "previousStatus": "APPROVED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:31:54.362Z"
  },
  {
    "id": "cmw3aegzk000l4ar7ymxcwq5c",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_SUSPENDED",
    "targetType": "USER",
    "targetId": "cmw3aegv1000k4ar7htln5nyu",
    "targetLabel": "Suspended Account",
    "reason": "Severe policy breach under review.",
    "details": {
      "newStatus": "SUSPENDED",
      "userEmail": "wf_1793867509307_violation_user@university.edu",
      "previousStatus": "ACTIVE"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:31:54.752Z"
  },
  {
    "id": "cmw3aeh45000m4ar7wk4x83ui",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_RESTORED",
    "targetType": "USER",
    "targetId": "cmw3aegv1000k4ar7htln5nyu",
    "targetLabel": "Suspended Account",
    "reason": "Review completed; student warned.",
    "details": {
      "newStatus": "ACTIVE",
      "userEmail": "wf_1793867509307_violation_user@university.edu",
      "previousStatus": "SUSPENDED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:31:54.917Z"
  },
  {
    "id": "cmw3alnra000vler7uen3bc7d",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw3alnl6000uler7i4mv0mgy",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw38q92r0000syr7v3ysfij3",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:37:30.118Z"
  },
  {
    "id": "cmw3alnxw000xler7opkande1",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_CLOSED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw3alnl6000uler7i4mv0mgy",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw38q92r0000syr7v3ysfij3",
      "newStatus": "CLOSED",
      "previousStatus": "APPROVED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:37:30.356Z"
  },
  {
    "id": "cmw3alobv0011ler76tyn1gct",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "POST_REMOVED",
    "targetType": "POST",
    "targetId": "cmw3alo2b000yler7lj7x4k2g",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": null,
    "ipAddress": null,
    "createdAt": "2026-11-05T08:37:30.859Z"
  },
  {
    "id": "cmw3alodd0012ler718jx3coh",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "CONTENT_REPORT_RESOLVED",
    "targetType": "REPORT",
    "targetId": "cmw3alo410010ler7rr2mq283",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": {
      "decision": "REMOVE_CONTENT",
      "targetId": "cmw3alo2b000yler7lj7x4k2g",
      "targetType": "POST"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:37:30.913Z"
  },
  {
    "id": "cmw3alol10014ler7r5zuxgko",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_SUSPENDED",
    "targetType": "USER",
    "targetId": "cmw3alogf0013ler72g57uryi",
    "targetLabel": "Suspended Account",
    "reason": "Severe policy breach under review.",
    "details": {
      "newStatus": "SUSPENDED",
      "userEmail": "wf_1793867841401_violation_user@university.edu",
      "previousStatus": "ACTIVE"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:37:31.189Z"
  },
  {
    "id": "cmw3alopn0015ler78fc431a7",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_RESTORED",
    "targetType": "USER",
    "targetId": "cmw3alogf0013ler72g57uryi",
    "targetLabel": "Suspended Account",
    "reason": "Review completed; student warned.",
    "details": {
      "newStatus": "ACTIVE",
      "userEmail": "wf_1793867841401_violation_user@university.edu",
      "previousStatus": "SUSPENDED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:37:31.355Z"
  },
  {
    "id": "cmw3ap8i8000vusr7cy8a7t9y",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw3ap824000uusr7dklu2bj8",
    "targetLabel": "Frontend Engineering Associate",
    "reason": null,
    "details": {
      "posterId": "cmw3ap6z4000ousr70voih5cj",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:40:16.976Z"
  },
  {
    "id": "cmw3ap9hb0011usr7x7wlvo9v",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw3ap9b90010usr7k08gj2w9",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw38q92r0000syr7v3ysfij3",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:40:18.239Z"
  },
  {
    "id": "cmw3ap9v00013usr74a4nlxjp",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_CLOSED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw3ap9b90010usr7k08gj2w9",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw38q92r0000syr7v3ysfij3",
      "newStatus": "CLOSED",
      "previousStatus": "APPROVED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:40:18.732Z"
  },
  {
    "id": "cmw3apa8h0017usr74umnk75k",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "POST_REMOVED",
    "targetType": "POST",
    "targetId": "cmw3ap9zf0014usr7dymhuvy6",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": null,
    "ipAddress": null,
    "createdAt": "2026-11-05T08:40:19.217Z"
  },
  {
    "id": "cmw3apa9z0018usr7mdegblvs",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "CONTENT_REPORT_RESOLVED",
    "targetType": "REPORT",
    "targetId": "cmw3apa0w0016usr7l1zntble",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": {
      "decision": "REMOVE_CONTENT",
      "targetId": "cmw3ap9zf0014usr7dymhuvy6",
      "targetType": "POST"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:40:19.271Z"
  },
  {
    "id": "cmw3apahm001ausr7c3zfl0u0",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_SUSPENDED",
    "targetType": "USER",
    "targetId": "cmw3apad20019usr74ckr1q2d",
    "targetLabel": "Suspended Account",
    "reason": "Severe policy breach under review.",
    "details": {
      "newStatus": "SUSPENDED",
      "userEmail": "wf_1793868007575_violation_user@university.edu",
      "previousStatus": "ACTIVE"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:40:19.546Z"
  },
  {
    "id": "cmw3apam6001busr79b5bjzxl",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_RESTORED",
    "targetType": "USER",
    "targetId": "cmw3apad20019usr74ckr1q2d",
    "targetLabel": "Suspended Account",
    "reason": "Review completed; student warned.",
    "details": {
      "newStatus": "ACTIVE",
      "userEmail": "wf_1793868007575_violation_user@university.edu",
      "previousStatus": "SUSPENDED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:40:19.710Z"
  },
  {
    "id": "cmw3arp5g000w15r7ydabhc2r",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw3aroqj000v15r756291lan",
    "targetLabel": "Frontend Engineering Associate",
    "reason": null,
    "details": {
      "posterId": "cmw3arnoa000p15r782p92bbo",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:42:11.860Z"
  },
  {
    "id": "cmw3arqy2001615r741rpyt51",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw3arqs0001515r7uaphamga",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw38q92r0000syr7v3ysfij3",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:42:14.186Z"
  },
  {
    "id": "cmw3arr49001915r7y0g33syd",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_CLOSED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw3arqs0001515r7uaphamga",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw38q92r0000syr7v3ysfij3",
      "newStatus": "CLOSED",
      "previousStatus": "APPROVED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:42:14.409Z"
  },
  {
    "id": "cmw3arrhr001d15r7pesh1koy",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "POST_REMOVED",
    "targetType": "POST",
    "targetId": "cmw3arr8o001a15r74jw2iu8d",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": null,
    "ipAddress": null,
    "createdAt": "2026-11-05T08:42:14.895Z"
  },
  {
    "id": "cmw3arrja001e15r7d28t1dc3",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "CONTENT_REPORT_RESOLVED",
    "targetType": "REPORT",
    "targetId": "cmw3arra7001c15r7slan7j5g",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": {
      "decision": "REMOVE_CONTENT",
      "targetId": "cmw3arr8o001a15r74jw2iu8d",
      "targetType": "POST"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:42:14.950Z"
  },
  {
    "id": "cmw3arrrr001g15r7yy7v27ce",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_SUSPENDED",
    "targetType": "USER",
    "targetId": "cmw3arrn2001f15r7ro7zxnbe",
    "targetLabel": "Suspended Account",
    "reason": "Severe policy breach under review.",
    "details": {
      "newStatus": "SUSPENDED",
      "userEmail": "wf_1793868122651_violation_user@university.edu",
      "previousStatus": "ACTIVE"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:42:15.255Z"
  },
  {
    "id": "cmw3arrwd001h15r7sh4tha8f",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_RESTORED",
    "targetType": "USER",
    "targetId": "cmw3arrn2001f15r7ro7zxnbe",
    "targetLabel": "Suspended Account",
    "reason": "Review completed; student warned.",
    "details": {
      "newStatus": "ACTIVE",
      "userEmail": "wf_1793868122651_violation_user@university.edu",
      "previousStatus": "SUSPENDED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:42:15.421Z"
  },
  {
    "id": "cmw3asfbt000w39r77wwnhk3i",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw3asewn000v39r77erhujhj",
    "targetLabel": "Frontend Engineering Associate",
    "reason": null,
    "details": {
      "posterId": "cmw3asdub000p39r74bu3ogs4",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:42:45.785Z"
  },
  {
    "id": "cmw3ash45001739r71g679up0",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw3asgy4001639r75v14yt9w",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw38q92r0000syr7v3ysfij3",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:42:48.102Z"
  },
  {
    "id": "cmw3asha4001939r7tt6ks7cz",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_CLOSED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw3asgy4001639r75v14yt9w",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw38q92r0000syr7v3ysfij3",
      "newStatus": "CLOSED",
      "previousStatus": "APPROVED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:42:48.316Z"
  },
  {
    "id": "cmw3ashnb001d39r7lgzh416r",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "POST_REMOVED",
    "targetType": "POST",
    "targetId": "cmw3asheg001a39r7m5aw7pjz",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": null,
    "ipAddress": null,
    "createdAt": "2026-11-05T08:42:48.791Z"
  },
  {
    "id": "cmw3covsl001gq2r7of0ja4sc",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "CONTENT_REPORT_RESOLVED",
    "targetType": "REPORT",
    "targetId": "cmw3covj9001eq2r77q7s3tld",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": {
      "decision": "REMOVE_CONTENT",
      "targetId": "cmw3covhq001cq2r77k0ffazl",
      "targetType": "POST"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T09:35:59.733Z"
  },
  {
    "id": "cmw3ashow001e39r7yy9ramts",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "CONTENT_REPORT_RESOLVED",
    "targetType": "REPORT",
    "targetId": "cmw3ashfx001c39r7mj6yf266",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": {
      "decision": "REMOVE_CONTENT",
      "targetId": "cmw3asheg001a39r7m5aw7pjz",
      "targetType": "POST"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:42:48.848Z"
  },
  {
    "id": "cmw3asig9001g39r70uomcus3",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_SUSPENDED",
    "targetType": "USER",
    "targetId": "cmw3asibq001f39r76d9xsf2s",
    "targetLabel": "Suspended Account",
    "reason": "Severe policy breach under review.",
    "details": {
      "newStatus": "SUSPENDED",
      "userEmail": "wf_1793868156220_violation_user@university.edu",
      "previousStatus": "ACTIVE"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:42:49.833Z"
  },
  {
    "id": "cmw3au17l000w6xr74iamxwxz",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw3au0n7000v6xr7umurnyri",
    "targetLabel": "Frontend Engineering Associate",
    "reason": null,
    "details": {
      "posterId": "cmw3atzkw000p6xr7t8a6ho34",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:44:00.801Z"
  },
  {
    "id": "cmw3au3e000196xr7bonei4nk",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw3au37z00186xr7dfvi1xbe",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw38q92r0000syr7v3ysfij3",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:44:03.624Z"
  },
  {
    "id": "cmw3au3xe001f6xr7246er9us",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "POST_REMOVED",
    "targetType": "POST",
    "targetId": "cmw3au3of001b6xr784zc26qp",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": null,
    "ipAddress": null,
    "createdAt": "2026-11-05T08:44:04.322Z"
  },
  {
    "id": "cmw3au3yy001g6xr7tncm2e9v",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "CONTENT_REPORT_RESOLVED",
    "targetType": "REPORT",
    "targetId": "cmw3au3px001d6xr7qes4fyls",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": {
      "decision": "REMOVE_CONTENT",
      "targetId": "cmw3au3of001b6xr784zc26qp",
      "targetType": "POST"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:44:04.378Z"
  },
  {
    "id": "cmw3au46i001i6xr7ig0rcrkf",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_SUSPENDED",
    "targetType": "USER",
    "targetId": "cmw3au41z001h6xr705f8de6f",
    "targetLabel": "Suspended Account",
    "reason": "Severe policy breach under review.",
    "details": {
      "newStatus": "SUSPENDED",
      "userEmail": "wf_1793868231127_violation_user@university.edu",
      "previousStatus": "ACTIVE"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:44:04.650Z"
  },
  {
    "id": "cmw3covd6001bq2r7qrn5c7gj",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_CLOSED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw3cov0s0018q2r7snxq2fxj",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw38q92r0000syr7v3ysfij3",
      "newStatus": "CLOSED",
      "previousStatus": "APPROVED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T09:35:59.178Z"
  },
  {
    "id": "cmw3cowdn001jq2r7rfuc2p2s",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_RESTORED",
    "targetType": "USER",
    "targetId": "cmw3covvx001hq2r74y5ksjlx",
    "targetLabel": "Suspended Account",
    "reason": "Review completed; student warned.",
    "details": {
      "newStatus": "ACTIVE",
      "userEmail": "wf_1793871345472_violation_user@university.edu",
      "previousStatus": "SUSPENDED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T09:36:00.491Z"
  },
  {
    "id": "cmw6rxxw00018syr77fdhsf9z",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw6rxxpu0017syr76faoi2vt",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw34duhv00000nr702nxvgo1",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-07T19:06:15.120Z"
  },
  {
    "id": "cmw6rxymy001esyr71r6l2mpl",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "POST_REMOVED",
    "targetType": "POST",
    "targetId": "cmw6rxy6g001bsyr73piesd5z",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": null,
    "ipAddress": null,
    "createdAt": "2026-11-07T19:06:16.090Z"
  },
  {
    "id": "cmw6rxyoh001fsyr7edc97kt4",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "CONTENT_REPORT_RESOLVED",
    "targetType": "REPORT",
    "targetId": "cmw6rxyf8001dsyr7cvpzind4",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": {
      "decision": "REMOVE_CONTENT",
      "targetId": "cmw6rxy6g001bsyr73piesd5z",
      "targetType": "POST"
    },
    "ipAddress": null,
    "createdAt": "2026-11-07T19:06:16.145Z"
  },
  {
    "id": "cmw6rxyw6001hsyr7f6ow050f",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_SUSPENDED",
    "targetType": "USER",
    "targetId": "cmw6rxyrk001gsyr7rd354in3",
    "targetLabel": "Suspended Account",
    "reason": "Severe policy breach under review.",
    "details": {
      "newStatus": "SUSPENDED",
      "userEmail": "wf_1794078361783_violation_user@university.edu",
      "previousStatus": "ACTIVE"
    },
    "ipAddress": null,
    "createdAt": "2026-11-07T19:06:16.422Z"
  },
  {
    "id": "cmw3cy27c000wnnr75bzk30jl",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw3cy1se000vnnr7zoeaixyk",
    "targetLabel": "Frontend Engineering Associate",
    "reason": null,
    "details": {
      "posterId": "cmw3cy0ps000pnnr7tty40qv2",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T09:43:07.944Z"
  },
  {
    "id": "cmw3cy4cn0019nnr7dvvsl2mv",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw3cy46j0018nnr7soz826pl",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw38q92r0000syr7v3ysfij3",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T09:43:10.727Z"
  },
  {
    "id": "cmw3cy4is001bnnr7bzqsh21o",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_CLOSED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw3cy46j0018nnr7soz826pl",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw38q92r0000syr7v3ysfij3",
      "newStatus": "CLOSED",
      "previousStatus": "APPROVED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T09:43:10.948Z"
  },
  {
    "id": "cmw3cy4wc001fnnr7fqrund03",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "POST_REMOVED",
    "targetType": "POST",
    "targetId": "cmw3cy4n9001cnnr7fxdq458r",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": null,
    "ipAddress": null,
    "createdAt": "2026-11-05T09:43:11.436Z"
  },
  {
    "id": "cmw3cy4xz001gnnr7sa2ko7de",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "CONTENT_REPORT_RESOLVED",
    "targetType": "REPORT",
    "targetId": "cmw3cy4os001ennr7weqk0qh3",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": {
      "decision": "REMOVE_CONTENT",
      "targetId": "cmw3cy4n9001cnnr7fxdq458r",
      "targetType": "POST"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T09:43:11.495Z"
  },
  {
    "id": "cmw3cy55j001innr7b2ehrzev",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_SUSPENDED",
    "targetType": "USER",
    "targetId": "cmw3cy510001hnnr7n08bb3dw",
    "targetLabel": "Suspended Account",
    "reason": "Severe policy breach under review.",
    "details": {
      "newStatus": "SUSPENDED",
      "userEmail": "wf_1793871778325_violation_user@university.edu",
      "previousStatus": "ACTIVE"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T09:43:11.767Z"
  },
  {
    "id": "cmw3e0jbx000waur79dr33rgq",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw3e0ix2000vaur7dm85plip",
    "targetLabel": "Frontend Engineering Associate",
    "reason": null,
    "details": {
      "posterId": "cmw3e0hue000paur7u5gdgjdy",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T10:13:03.069Z"
  },
  {
    "id": "cmw3e0m74001faur7m25tbjem",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "POST_REMOVED",
    "targetType": "POST",
    "targetId": "cmw3e0ly7001caur7autejkpe",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": null,
    "ipAddress": null,
    "createdAt": "2026-11-05T10:13:06.784Z"
  },
  {
    "id": "cmw3e0m8n001gaur79ugl1dkd",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "CONTENT_REPORT_RESOLVED",
    "targetType": "REPORT",
    "targetId": "cmw3e0lzp001eaur7j404ijrj",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": {
      "decision": "REMOVE_CONTENT",
      "targetId": "cmw3e0ly7001caur7autejkpe",
      "targetType": "POST"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T10:13:06.839Z"
  },
  {
    "id": "cmw3e0mg6001iaur7mv68a0ww",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_SUSPENDED",
    "targetType": "USER",
    "targetId": "cmw3e0mbn001haur7lf4vmn7t",
    "targetLabel": "Suspended Account",
    "reason": "Severe policy breach under review.",
    "details": {
      "newStatus": "SUSPENDED",
      "userEmail": "wf_1793873573410_violation_user@university.edu",
      "previousStatus": "ACTIVE"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T10:13:07.110Z"
  },
  {
    "id": "cmw6t2rno0018s3r72a7pzj75",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw6t2rhi0017s3r78ygfykfz",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw34duhv00000nr702nxvgo1",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-07T19:37:59.940Z"
  },
  {
    "id": "cmw6t2rtx001as3r7eb6qzeew",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_CLOSED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw6t2rhi0017s3r78ygfykfz",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw34duhv00000nr702nxvgo1",
      "newStatus": "CLOSED",
      "previousStatus": "APPROVED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-07T19:38:00.165Z"
  },
  {
    "id": "cmw6t2s7u001es3r7yf3q61hq",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "POST_REMOVED",
    "targetType": "POST",
    "targetId": "cmw6t2ryh001cs3r7qj31ivsy",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": null,
    "ipAddress": null,
    "createdAt": "2026-11-07T19:38:00.666Z"
  },
  {
    "id": "cmw56gry6000107ifwk52562p",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "POST_REMOVED",
    "targetType": "POST",
    "targetId": "cmw3bs8yn001cd6r74fj3bccq",
    "targetLabel": null,
    "reason": "hh",
    "details": null,
    "ipAddress": null,
    "createdAt": "2026-11-06T16:17:16.158Z"
  },
  {
    "id": "cmw6q5rg8000wtlr76szocjny",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw6q5r0y000vtlr79aop9gsd",
    "targetLabel": "Frontend Engineering Associate",
    "reason": null,
    "details": {
      "posterId": "cmw6q5pwt000ptlr7fh7cn7v7",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-07T18:16:20.792Z"
  },
  {
    "id": "cmw6q5trw0019tlr7vbdybtnf",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw6q5tlm0018tlr7ruod3l05",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw38q92r0000syr7v3ysfij3",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-07T18:16:23.804Z"
  },
  {
    "id": "cmw6q5u5l001btlr7504qlx5r",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_CLOSED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw6q5tlm0018tlr7ruod3l05",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw38q92r0000syr7v3ysfij3",
      "newStatus": "CLOSED",
      "previousStatus": "APPROVED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-07T18:16:24.297Z"
  },
  {
    "id": "cmw6qayzw0019ahr7xkl48ooy",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw6qaytk0018ahr7d1alrlmw",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw38q92r0000syr7v3ysfij3",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-07T18:20:23.852Z"
  },
  {
    "id": "cmw3asikt001h39r7rqlx6vap",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_RESTORED",
    "targetType": "USER",
    "targetId": "cmw3asibq001f39r76d9xsf2s",
    "targetLabel": "Suspended Account",
    "reason": "Review completed; student warned.",
    "details": {
      "newStatus": "ACTIVE",
      "userEmail": "wf_1793868156220_violation_user@university.edu",
      "previousStatus": "SUSPENDED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:42:49.997Z"
  },
  {
    "id": "cmw3au3jz001a6xr7orvgbchy",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_CLOSED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw3au37z00186xr7dfvi1xbe",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw38q92r0000syr7v3ysfij3",
      "newStatus": "CLOSED",
      "previousStatus": "APPROVED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:44:03.839Z"
  },
  {
    "id": "cmw3au4b4001j6xr7d6dz6j5r",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_RESTORED",
    "targetType": "USER",
    "targetId": "cmw3au41z001h6xr705f8de6f",
    "targetLabel": "Suspended Account",
    "reason": "Review completed; student warned.",
    "details": {
      "newStatus": "ACTIVE",
      "userEmail": "wf_1793868231127_violation_user@university.edu",
      "previousStatus": "SUSPENDED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:44:04.816Z"
  },
  {
    "id": "cmw3av24n000w9vr7fpqaqokb",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw3av1ld000v9vr7jqlbqpnm",
    "targetLabel": "Frontend Engineering Associate",
    "reason": null,
    "details": {
      "posterId": "cmw3av06i000p9vr7lelvgvn7",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:44:48.647Z"
  },
  {
    "id": "cmw3av49g00189vr715ii8j9t",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw3av43e00179vr755sia66t",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw38q92r0000syr7v3ysfij3",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:44:51.412Z"
  },
  {
    "id": "cmw3av4fe001b9vr7n8zgz1fq",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_CLOSED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw3av43e00179vr755sia66t",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw38q92r0000syr7v3ysfij3",
      "newStatus": "CLOSED",
      "previousStatus": "APPROVED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:44:51.626Z"
  },
  {
    "id": "cmw3av4sw001f9vr7vr7lcob0",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "POST_REMOVED",
    "targetType": "POST",
    "targetId": "cmw3av4jx001c9vr7xyn11z30",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": null,
    "ipAddress": null,
    "createdAt": "2026-11-05T08:44:52.112Z"
  },
  {
    "id": "cmw3av4uh001g9vr7mvlkstzn",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "CONTENT_REPORT_RESOLVED",
    "targetType": "REPORT",
    "targetId": "cmw3av4le001e9vr7tu1w10vm",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": {
      "decision": "REMOVE_CONTENT",
      "targetId": "cmw3av4jx001c9vr7xyn11z30",
      "targetType": "POST"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:44:52.169Z"
  },
  {
    "id": "cmw3av523001i9vr7ai2cok3t",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_SUSPENDED",
    "targetType": "USER",
    "targetId": "cmw3av4xj001h9vr7lmq4udxm",
    "targetLabel": "Suspended Account",
    "reason": "Severe policy breach under review.",
    "details": {
      "newStatus": "SUSPENDED",
      "userEmail": "wf_1793868274048_violation_user@university.edu",
      "previousStatus": "ACTIVE"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:44:52.443Z"
  },
  {
    "id": "cmw3av56n001j9vr7fvaiyh5g",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_RESTORED",
    "targetType": "USER",
    "targetId": "cmw3av4xj001h9vr7lmq4udxm",
    "targetLabel": "Suspended Account",
    "reason": "Review completed; student warned.",
    "details": {
      "newStatus": "ACTIVE",
      "userEmail": "wf_1793868274048_violation_user@university.edu",
      "previousStatus": "SUSPENDED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T08:44:52.607Z"
  },
  {
    "id": "cmw3cow1b001iq2r7jmp7wpsa",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_SUSPENDED",
    "targetType": "USER",
    "targetId": "cmw3covvx001hq2r74y5ksjlx",
    "targetLabel": "Suspended Account",
    "reason": "Severe policy breach under review.",
    "details": {
      "newStatus": "SUSPENDED",
      "userEmail": "wf_1793871345472_violation_user@university.edu",
      "previousStatus": "ACTIVE"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T09:36:00.047Z"
  },
  {
    "id": "cmw6rxz0t001isyr7g9ovzicn",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_RESTORED",
    "targetType": "USER",
    "targetId": "cmw6rxyrk001gsyr7rd354in3",
    "targetLabel": "Suspended Account",
    "reason": "Review completed; student warned.",
    "details": {
      "newStatus": "ACTIVE",
      "userEmail": "wf_1794078361783_violation_user@university.edu",
      "previousStatus": "SUSPENDED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-07T19:06:16.589Z"
  },
  {
    "id": "cmw3cy5hm001jnnr7liiuacci",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_RESTORED",
    "targetType": "USER",
    "targetId": "cmw3cy510001hnnr7n08bb3dw",
    "targetLabel": "Suspended Account",
    "reason": "Review completed; student warned.",
    "details": {
      "newStatus": "ACTIVE",
      "userEmail": "wf_1793871778325_violation_user@university.edu",
      "previousStatus": "SUSPENDED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T09:43:12.202Z"
  },
  {
    "id": "cmw3bsa8m002bd6r7tmfxvlhi",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "MEMBER_VERIFIED",
    "targetType": "USER",
    "targetId": "cmw3bo4ip000j3jr7a4gq18s0",
    "targetLabel": "Farhan Ahmed (STUDENT)",
    "reason": "Verified against university registrar database records for 2023 cohort.",
    "details": null,
    "ipAddress": "127.0.0.1",
    "createdAt": "2026-11-05T09:10:38.806Z"
  },
  {
    "id": "cmw3bsaaq002cd6r7gcpxhp74",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw3bo5zj00183jr75l0pisqb",
    "targetLabel": "Frontend Engineering Intern (Vercel)",
    "reason": "Verified compensation transparency and institutional eligibility criteria.",
    "details": null,
    "ipAddress": "127.0.0.1",
    "createdAt": "2026-11-05T09:10:38.882Z"
  },
  {
    "id": "cmw3bsaca002dd6r7mkjrlk8f",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "COMPANY_VERIFIED",
    "targetType": "COMPANY",
    "targetId": "cmw3bo5my00113jr76m6pt4om",
    "targetLabel": "Vercel",
    "reason": "Verified corporate identity and authorized recruiter roster.",
    "details": null,
    "ipAddress": "127.0.0.1",
    "createdAt": "2026-11-05T09:10:38.938Z"
  },
  {
    "id": "cmw3e0lnq0019aur70b1lhyfq",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw3e0lhl0018aur7vv0cpka1",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw38q92r0000syr7v3ysfij3",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T10:13:06.086Z"
  },
  {
    "id": "cmw3e0lts001baur71qtkgm98",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_CLOSED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw3e0lhl0018aur7vv0cpka1",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw38q92r0000syr7v3ysfij3",
      "newStatus": "CLOSED",
      "previousStatus": "APPROVED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-05T10:13:06.304Z"
  },
  {
    "id": "cmw3f31cj000007kx8hpgcwtv",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw3bo6ns001f3jr7djxjplnc",
    "targetLabel": "Junior Data Analyst & BI Developer (Pending Review)",
    "reason": null,
    "details": {
      "posterId": "cmw3bo551000s3jr7amz6hxy9",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": "103.151.171.153",
    "createdAt": "2026-11-05T10:42:59.347Z"
  },
  {
    "id": "cmw56gs4o000207ifn12ado3g",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "CONTENT_REPORT_RESOLVED",
    "targetType": "REPORT",
    "targetId": "cmw3bs906001dd6r7spons5wg",
    "targetLabel": null,
    "reason": "hh",
    "details": {
      "decision": "REMOVE_CONTENT",
      "targetId": "cmw3bs8yn001cd6r74fj3bccq",
      "targetType": "POST"
    },
    "ipAddress": "103.151.171.154",
    "createdAt": "2026-11-06T16:17:16.392Z"
  },
  {
    "id": "cmw6q5ujo001ftlr7c145yxgj",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "POST_REMOVED",
    "targetType": "POST",
    "targetId": "cmw6q5ua8001ctlr7rlwk9b0t",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": null,
    "ipAddress": null,
    "createdAt": "2026-11-07T18:16:24.804Z"
  },
  {
    "id": "cmw6q5ul7001gtlr7jf2wgazw",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "CONTENT_REPORT_RESOLVED",
    "targetType": "REPORT",
    "targetId": "cmw6q5ubq001etlr7hcdlu77u",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": {
      "decision": "REMOVE_CONTENT",
      "targetId": "cmw6q5ua8001ctlr7rlwk9b0t",
      "targetType": "POST"
    },
    "ipAddress": null,
    "createdAt": "2026-11-07T18:16:24.859Z"
  },
  {
    "id": "cmw6q5ust001itlr7ktqdylsu",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_SUSPENDED",
    "targetType": "USER",
    "targetId": "cmw6q5uo8001htlr7iyhw1rxg",
    "targetLabel": "Suspended Account",
    "reason": "Severe policy breach under review.",
    "details": {
      "newStatus": "SUSPENDED",
      "userEmail": "wf_1794075371053_violation_user@university.edu",
      "previousStatus": "ACTIVE"
    },
    "ipAddress": null,
    "createdAt": "2026-11-07T18:16:25.133Z"
  },
  {
    "id": "cmw6q5uxg001jtlr74e241n5o",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_RESTORED",
    "targetType": "USER",
    "targetId": "cmw6q5uo8001htlr7iyhw1rxg",
    "targetLabel": "Suspended Account",
    "reason": "Review completed; student warned.",
    "details": {
      "newStatus": "ACTIVE",
      "userEmail": "wf_1794075371053_violation_user@university.edu",
      "previousStatus": "SUSPENDED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-07T18:16:25.300Z"
  },
  {
    "id": "cmw6qaws7000wahr7c7a22ur0",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw6qawcz000vahr7tqdtht6q",
    "targetLabel": "Frontend Engineering Associate",
    "reason": null,
    "details": {
      "posterId": "cmw6qav9h000pahr7ga1ia49x",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-07T18:20:20.983Z"
  },
  {
    "id": "cmw6qaz6l001bahr7npwf6c5a",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_CLOSED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw6qaytk0018ahr7d1alrlmw",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw38q92r0000syr7v3ysfij3",
      "newStatus": "CLOSED",
      "previousStatus": "APPROVED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-07T18:20:24.093Z"
  },
  {
    "id": "cmw6qazkm001fahr76oc5etln",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "POST_REMOVED",
    "targetType": "POST",
    "targetId": "cmw6qazb8001cahr7kz3oq8b2",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": null,
    "ipAddress": null,
    "createdAt": "2026-11-07T18:20:24.598Z"
  },
  {
    "id": "cmw6qazm8001gahr7453gvkid",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "CONTENT_REPORT_RESOLVED",
    "targetType": "REPORT",
    "targetId": "cmw6qazcs001eahr7422097zh",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": {
      "decision": "REMOVE_CONTENT",
      "targetId": "cmw6qazb8001cahr7kz3oq8b2",
      "targetType": "POST"
    },
    "ipAddress": null,
    "createdAt": "2026-11-07T18:20:24.656Z"
  },
  {
    "id": "cmw6qazu3001iahr7qgrxvvvq",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_SUSPENDED",
    "targetType": "USER",
    "targetId": "cmw6qazpe001hahr7lk0q5itr",
    "targetLabel": "Suspended Account",
    "reason": "Severe policy breach under review.",
    "details": {
      "newStatus": "SUSPENDED",
      "userEmail": "wf_1794075611188_violation_user@university.edu",
      "previousStatus": "ACTIVE"
    },
    "ipAddress": null,
    "createdAt": "2026-11-07T18:20:24.939Z"
  },
  {
    "id": "cmw6qewaa0019our72wffouxg",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw6qew430018our7d8m69cp9",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw38q92r0000syr7v3ysfij3",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-07T18:23:26.962Z"
  },
  {
    "id": "cmw6qex3g001iour75m3fyaho",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_SUSPENDED",
    "targetType": "USER",
    "targetId": "cmw6qewyv001hour7ol13zpdh",
    "targetLabel": "Suspended Account",
    "reason": "Severe policy breach under review.",
    "details": {
      "newStatus": "SUSPENDED",
      "userEmail": "wf_1794075794585_violation_user@university.edu",
      "previousStatus": "ACTIVE"
    },
    "ipAddress": null,
    "createdAt": "2026-11-07T18:23:28.012Z"
  },
  {
    "id": "cmw6qex7y001jour7emacpg3h",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_RESTORED",
    "targetType": "USER",
    "targetId": "cmw6qewyv001hour7ol13zpdh",
    "targetLabel": "Suspended Account",
    "reason": "Review completed; student warned.",
    "details": {
      "newStatus": "ACTIVE",
      "userEmail": "wf_1794075794585_violation_user@university.edu",
      "previousStatus": "SUSPENDED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-07T18:23:28.174Z"
  },
  {
    "id": "cmw7lb7lm0017hnr7hwedz9fd",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw7lb7fh0016hnr7b3e7bbhd",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw7i03j10000pwr7gb0q460u",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T08:48:23.099Z"
  },
  {
    "id": "cmw7lb8jr001ihnr7l6azwf0x",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_RESTORED",
    "targetType": "USER",
    "targetId": "cmw7lb8ae001ghnr7nv9tdhhw",
    "targetLabel": "Suspended Account",
    "reason": "Review completed; student warned.",
    "details": {
      "newStatus": "ACTIVE",
      "userEmail": "wf_1794127689846_violation_user@university.edu",
      "previousStatus": "SUSPENDED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T08:48:24.327Z"
  },
  {
    "id": "cmw85nh65000008l2djb60jz9",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "CONTENT_REPORT_DISMISSED",
    "targetType": "REPORT",
    "targetId": "cmw3br6hm001e9gr7k5el34qt",
    "targetLabel": null,
    "reason": "jj",
    "details": {
      "decision": "DISMISS",
      "targetId": "cmw3br6g0001d9gr7rqgmegiu",
      "targetType": "POST"
    },
    "ipAddress": "103.151.171.153",
    "createdAt": "2026-11-08T18:17:47.693Z"
  },
  {
    "id": "cmw7y066b001eb2r7cecc1cam",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_CLOSED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw7y05u6001bb2r78jom0ymp",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw34dunu00020nr7ue5elwel",
      "newStatus": "CLOSED",
      "previousStatus": "APPROVED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T14:43:43.043Z"
  },
  {
    "id": "cmw6t2s9e001fs3r71y52rv5b",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "CONTENT_REPORT_RESOLVED",
    "targetType": "REPORT",
    "targetId": "cmw6t2s05001ds3r7ylr15bw6",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": {
      "decision": "REMOVE_CONTENT",
      "targetId": "cmw6t2ryh001cs3r7qj31ivsy",
      "targetType": "POST"
    },
    "ipAddress": null,
    "createdAt": "2026-11-07T19:38:00.722Z"
  },
  {
    "id": "cmw6t2shf001hs3r7k9y2u5xw",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_SUSPENDED",
    "targetType": "USER",
    "targetId": "cmw6t2scu001gs3r7h8r9wgj3",
    "targetLabel": "Suspended Account",
    "reason": "Severe policy breach under review.",
    "details": {
      "newStatus": "SUSPENDED",
      "userEmail": "wf_1794080267268_violation_user@university.edu",
      "previousStatus": "ACTIVE"
    },
    "ipAddress": null,
    "createdAt": "2026-11-07T19:38:01.011Z"
  },
  {
    "id": "cmw7y06xx001mb2r73w3dnqop",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_RESTORED",
    "targetType": "USER",
    "targetId": "cmw7y06oq001kb2r7sfx7iczj",
    "targetLabel": "Suspended Account",
    "reason": "Review completed; student warned.",
    "details": {
      "newStatus": "ACTIVE",
      "userEmail": "wf_1794149010083_violation_user@university.edu",
      "previousStatus": "SUSPENDED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T14:43:44.037Z"
  },
  {
    "id": "cmw7gms6n000wntr7l6926y95",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw7gmrry000vntr7l73n2oqq",
    "targetLabel": "Frontend Engineering Associate",
    "reason": null,
    "details": {
      "posterId": "cmw7gmqoz000pntr76vy5lckq",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T06:37:24.911Z"
  },
  {
    "id": "cmw7gmval001entr7ybez6z2k",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "POST_REMOVED",
    "targetType": "POST",
    "targetId": "cmw7gmuko001bntr7c08wxvyz",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": null,
    "ipAddress": null,
    "createdAt": "2026-11-08T06:37:28.941Z"
  },
  {
    "id": "cmw7gmvc4001fntr7cudqc6ms",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "CONTENT_REPORT_RESOLVED",
    "targetType": "REPORT",
    "targetId": "cmw7gmun1001dntr7xfjs05qr",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": {
      "decision": "REMOVE_CONTENT",
      "targetId": "cmw7gmuko001bntr7c08wxvyz",
      "targetType": "POST"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T06:37:28.996Z"
  },
  {
    "id": "cmw7gmvjy001hntr7mmhufqlh",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_SUSPENDED",
    "targetType": "USER",
    "targetId": "cmw7gmvf9001gntr7s6cyd3vg",
    "targetLabel": "Suspended Account",
    "reason": "Severe policy breach under review.",
    "details": {
      "newStatus": "SUSPENDED",
      "userEmail": "wf_1794119835487_violation_user@university.edu",
      "previousStatus": "ACTIVE"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T06:37:29.278Z"
  },
  {
    "id": "cmw7gmvol001intr7q0drebys",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_RESTORED",
    "targetType": "USER",
    "targetId": "cmw7gmvf9001gntr7s6cyd3vg",
    "targetLabel": "Suspended Account",
    "reason": "Review completed; student warned.",
    "details": {
      "newStatus": "ACTIVE",
      "userEmail": "wf_1794119835487_violation_user@university.edu",
      "previousStatus": "SUSPENDED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T06:37:29.445Z"
  },
  {
    "id": "cmw8uh9wm000008l0nol4hgk2",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_SUSPENDED",
    "targetType": "USER",
    "targetId": "C28HHaIkzA2HybIthrsNYIy5EVt7ASUr",
    "targetLabel": "hasan",
    "reason": "Account deleted by administrator.",
    "details": {
      "actionType": "USER_DELETED",
      "membershipType": "STUDENT",
      "deletedUserEmail": "sajibhasanbd235@gmail.com"
    },
    "ipAddress": "103.151.171.153",
    "createdAt": "2026-11-09T05:52:48.743Z"
  },
  {
    "id": "cmw8uhfhn000108l07b2hvlyk",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_SUSPENDED",
    "targetType": "USER",
    "targetId": "XWnyCCO7RsMIRLlBlzrpUTQo0Ldvh04z",
    "targetLabel": "S.M Sajib Al Hasan",
    "reason": "Account deleted by administrator.",
    "details": {
      "actionType": "USER_DELETED",
      "membershipType": "STUDENT",
      "deletedUserEmail": "sajibhasanbd2345@gmail.com"
    },
    "ipAddress": "103.151.171.153",
    "createdAt": "2026-11-09T05:52:55.979Z"
  },
  {
    "id": "cmw7zp72t000zvir7xc61x2cw",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw7zp6g0000yvir747bijd1h",
    "targetLabel": "Frontend Engineering Associate",
    "reason": null,
    "details": {
      "posterId": "cmw7zp53h000rvir7fp1kq33z",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T15:31:10.229Z"
  },
  {
    "id": "cmw7zpaeb001mvir77keokpuy",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_RESTORED",
    "targetType": "USER",
    "targetId": "cmw7zpa4w001kvir7czefn5fx",
    "targetLabel": "Suspended Account",
    "reason": "Review completed; student warned.",
    "details": {
      "newStatus": "ACTIVE",
      "userEmail": "wf_1794151860127_violation_user@university.edu",
      "previousStatus": "SUSPENDED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T15:31:14.531Z"
  },
  {
    "id": "cmw7h6rgz001el9r7rk1q46fr",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "POST_REMOVED",
    "targetType": "POST",
    "targetId": "cmw7h6r7h001bl9r75jis315s",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": null,
    "ipAddress": null,
    "createdAt": "2026-11-08T06:52:57.107Z"
  },
  {
    "id": "cmw7h6rij001fl9r7yg4obclc",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "CONTENT_REPORT_RESOLVED",
    "targetType": "REPORT",
    "targetId": "cmw7h6r95001dl9r7t87egwrk",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": {
      "decision": "REMOVE_CONTENT",
      "targetId": "cmw7h6r7h001bl9r75jis315s",
      "targetType": "POST"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T06:52:57.163Z"
  },
  {
    "id": "cmw7h6rq7001hl9r7g6aykjd2",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_SUSPENDED",
    "targetType": "USER",
    "targetId": "cmw7h6rll001gl9r7w3my7g6r",
    "targetLabel": "Suspended Account",
    "reason": "Severe policy breach under review.",
    "details": {
      "newStatus": "SUSPENDED",
      "userEmail": "wf_1794120763737_violation_user@university.edu",
      "previousStatus": "ACTIVE"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T06:52:57.439Z"
  },
  {
    "id": "cmw7hq0s7000w2sr7pzk5gako",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw7hq0d5000v2sr7kdaj4b97",
    "targetLabel": "Frontend Engineering Associate",
    "reason": null,
    "details": {
      "posterId": "cmw7hpz9d000p2sr77svshbhz",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T07:07:55.639Z"
  },
  {
    "id": "cmw7hq3dn001a2sr778yy8inz",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_CLOSED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw7hq31800162sr7xp5qci9u",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw34duhv00000nr702nxvgo1",
      "newStatus": "CLOSED",
      "previousStatus": "APPROVED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T07:07:59.004Z"
  },
  {
    "id": "cmwg189gt000007jpc8ceoeig",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "MEMBER_VERIFIED",
    "targetType": "USER",
    "targetId": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "targetLabel": "S.M Sajib Al Hasan",
    "reason": "Approved by administrator via Member Network.",
    "details": {
      "userEmail": "b220305009@cse.jnu.ac.bd",
      "newVerificationStatus": "VERIFIED",
      "previousVerificationStatus": "PENDING"
    },
    "ipAddress": "103.151.171.155",
    "createdAt": "2026-11-14T06:36:08.813Z"
  },
  {
    "id": "cmw7zp98s001bvir74ec9n0sz",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw7zp92j001avir7sg6cpi6t",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw34dunu00020nr7ue5elwel",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T15:31:13.036Z"
  },
  {
    "id": "cmw7zp9f1001evir7le11b2ex",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_CLOSED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw7zp92j001avir7sg6cpi6t",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw34dunu00020nr7ue5elwel",
      "newStatus": "CLOSED",
      "previousStatus": "APPROVED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T15:31:13.261Z"
  },
  {
    "id": "cmw7zp9sr001ivir75e6y7gp4",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "POST_REMOVED",
    "targetType": "POST",
    "targetId": "cmw7zp9jj001fvir7yk0igepi",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": null,
    "ipAddress": null,
    "createdAt": "2026-11-08T15:31:13.755Z"
  },
  {
    "id": "cmw7zp9u9001jvir7yvunq74h",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "CONTENT_REPORT_RESOLVED",
    "targetType": "REPORT",
    "targetId": "cmw7zp9l3001hvir7hxvr2tlb",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": {
      "decision": "REMOVE_CONTENT",
      "targetId": "cmw7zp9jj001fvir7yk0igepi",
      "targetType": "POST"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T15:31:13.809Z"
  },
  {
    "id": "cmw7zpa9n001lvir7ayaidu46",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_SUSPENDED",
    "targetType": "USER",
    "targetId": "cmw7zpa4w001kvir7czefn5fx",
    "targetLabel": "Suspended Account",
    "reason": "Severe policy breach under review.",
    "details": {
      "newStatus": "SUSPENDED",
      "userEmail": "wf_1794151860127_violation_user@university.edu",
      "previousStatus": "ACTIVE"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T15:31:14.363Z"
  },
  {
    "id": "cmw7h6rux001il9r74molcjdp",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_RESTORED",
    "targetType": "USER",
    "targetId": "cmw7h6rll001gl9r7w3my7g6r",
    "targetLabel": "Suspended Account",
    "reason": "Review completed; student warned.",
    "details": {
      "newStatus": "ACTIVE",
      "userEmail": "wf_1794120763737_violation_user@university.edu",
      "previousStatus": "SUSPENDED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T06:52:57.609Z"
  },
  {
    "id": "cmw7hq37f00172sr7jynzqvfg",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw7hq31800162sr7xp5qci9u",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw34duhv00000nr702nxvgo1",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T07:07:58.779Z"
  },
  {
    "id": "cmw7hq3rs001e2sr7f591eb93",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "POST_REMOVED",
    "targetType": "POST",
    "targetId": "cmw7hq3if001b2sr78i12nso8",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": null,
    "ipAddress": null,
    "createdAt": "2026-11-08T07:07:59.512Z"
  },
  {
    "id": "cmw7hq3td001f2sr7ywmb7cyp",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "CONTENT_REPORT_RESOLVED",
    "targetType": "REPORT",
    "targetId": "cmw7hq3jz001d2sr7er1xv7yi",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": {
      "decision": "REMOVE_CONTENT",
      "targetId": "cmw7hq3if001b2sr78i12nso8",
      "targetType": "POST"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T07:07:59.569Z"
  },
  {
    "id": "cmw7hq410001h2sr7tnvd3djl",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_SUSPENDED",
    "targetType": "USER",
    "targetId": "cmw7hq3wi001g2sr70xef5g2h",
    "targetLabel": "Suspended Account",
    "reason": "Severe policy breach under review.",
    "details": {
      "newStatus": "SUSPENDED",
      "userEmail": "wf_1794121666204_violation_user@university.edu",
      "previousStatus": "ACTIVE"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T07:07:59.844Z"
  },
  {
    "id": "cmw7hq45k001i2sr7ebh40i8a",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_RESTORED",
    "targetType": "USER",
    "targetId": "cmw7hq3wi001g2sr70xef5g2h",
    "targetLabel": "Suspended Account",
    "reason": "Review completed; student warned.",
    "details": {
      "newStatus": "ACTIVE",
      "userEmail": "wf_1794121666204_violation_user@university.edu",
      "previousStatus": "SUSPENDED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T07:08:00.008Z"
  },
  {
    "id": "cmw7hzc3k000wnpr7e9kahfsj",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw7hzbok000vnpr70oi16pko",
    "targetLabel": "Frontend Engineering Associate",
    "reason": null,
    "details": {
      "posterId": "cmw7hzaln000pnpr7lvd32itl",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T07:15:10.208Z"
  },
  {
    "id": "cmw7hze6z0018npr748m8e158",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw7hze0s0017npr71ttqhb0w",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw34duhv00000nr702nxvgo1",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T07:15:12.923Z"
  },
  {
    "id": "cmw7hzedb001anpr7bep2nazj",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_CLOSED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw7hze0s0017npr71ttqhb0w",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw34duhv00000nr702nxvgo1",
      "newStatus": "CLOSED",
      "previousStatus": "APPROVED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T07:15:13.151Z"
  },
  {
    "id": "cmw7hzer8001enpr78n5i5cmb",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "POST_REMOVED",
    "targetType": "POST",
    "targetId": "cmw7hzehx001bnpr7v4pc45vj",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": null,
    "ipAddress": null,
    "createdAt": "2026-11-08T07:15:13.652Z"
  },
  {
    "id": "cmw7hzest001fnpr7u2k36i8b",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "CONTENT_REPORT_RESOLVED",
    "targetType": "REPORT",
    "targetId": "cmw7hzejg001dnpr7jnb7kof0",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": {
      "decision": "REMOVE_CONTENT",
      "targetId": "cmw7hzehx001bnpr7v4pc45vj",
      "targetType": "POST"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T07:15:13.709Z"
  },
  {
    "id": "cmw7hzf0l001hnpr7tla55414",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_SUSPENDED",
    "targetType": "USER",
    "targetId": "cmw7hzevx001gnpr7fb32dc9w",
    "targetLabel": "Suspended Account",
    "reason": "Severe policy breach under review.",
    "details": {
      "newStatus": "SUSPENDED",
      "userEmail": "wf_1794122100543_violation_user@university.edu",
      "previousStatus": "ACTIVE"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T07:15:13.989Z"
  },
  {
    "id": "cmw7hzf51001inpr7ai5su8ip",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_RESTORED",
    "targetType": "USER",
    "targetId": "cmw7hzevx001gnpr7fb32dc9w",
    "targetLabel": "Suspended Account",
    "reason": "Review completed; student warned.",
    "details": {
      "newStatus": "ACTIVE",
      "userEmail": "wf_1794122100543_violation_user@university.edu",
      "previousStatus": "SUSPENDED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T07:15:14.149Z"
  },
  {
    "id": "cmw7jyk0i000wywr76a5ht2sz",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw7jyjk4000vywr7izox1p3s",
    "targetLabel": "Frontend Engineering Associate",
    "reason": null,
    "details": {
      "posterId": "cmw7jyifv000pywr70vtva787",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T08:10:33.042Z"
  },
  {
    "id": "cmw7jym4s0018ywr7o6lwbqsz",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw7jylyn0017ywr7c9ebfm8h",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw7i03j10000pwr7gb0q460u",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T08:10:35.788Z"
  },
  {
    "id": "cmw7jymb3001aywr74t8j3975",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_CLOSED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw7jylyn0017ywr7c9ebfm8h",
    "targetLabel": "Temporary Review Opportunity",
    "reason": null,
    "details": {
      "posterId": "cmw7i03j10000pwr7gb0q460u",
      "newStatus": "CLOSED",
      "previousStatus": "APPROVED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T08:10:36.015Z"
  },
  {
    "id": "cmw7jympd001eywr734lu7g3e",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "POST_REMOVED",
    "targetType": "POST",
    "targetId": "cmw7jymft001bywr7j3cb4nj7",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": null,
    "ipAddress": null,
    "createdAt": "2026-11-08T08:10:36.529Z"
  },
  {
    "id": "cmw7jymqy001fywr7dwogxf6n",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "CONTENT_REPORT_RESOLVED",
    "targetType": "REPORT",
    "targetId": "cmw7jymhf001dywr70go61y86",
    "targetLabel": null,
    "reason": "Confirmed unauthorized commercial promotion.",
    "details": {
      "decision": "REMOVE_CONTENT",
      "targetId": "cmw7jymft001bywr7j3cb4nj7",
      "targetType": "POST"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T08:10:36.586Z"
  },
  {
    "id": "cmw7jymyx001hywr7gj8wfe1t",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_SUSPENDED",
    "targetType": "USER",
    "targetId": "cmw7jymu2001gywr7hyj0pxdh",
    "targetLabel": "Suspended Account",
    "reason": "Severe policy breach under review.",
    "details": {
      "newStatus": "SUSPENDED",
      "userEmail": "wf_1794125421649_violation_user@university.edu",
      "previousStatus": "ACTIVE"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T08:10:36.873Z"
  },
  {
    "id": "cmw7jyn3n001iywr7nfr96wwk",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_RESTORED",
    "targetType": "USER",
    "targetId": "cmw7jymu2001gywr7hyj0pxdh",
    "targetLabel": "Suspended Account",
    "reason": "Review completed; student warned.",
    "details": {
      "newStatus": "ACTIVE",
      "userEmail": "wf_1794125421649_violation_user@university.edu",
      "previousStatus": "SUSPENDED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T08:10:37.043Z"
  },
  {
    "id": "cmw7m30rk000zskr7wc7cv2kr",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "OPPORTUNITY_APPROVED",
    "targetType": "OPPORTUNITY",
    "targetId": "cmw7m30cd000yskr7898ellxe",
    "targetLabel": "Frontend Engineering Associate",
    "reason": null,
    "details": {
      "posterId": "cmw7m2z77000rskr7c74gfq0k",
      "newStatus": "APPROVED",
      "previousStatus": "PENDING"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T09:10:00.608Z"
  },
  {
    "id": "cmw7m33ww001mskr7yfusx1ru",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_RESTORED",
    "targetType": "USER",
    "targetId": "cmw7m33nb001kskr76rym0inc",
    "targetLabel": "Suspended Account",
    "reason": "Review completed; student warned.",
    "details": {
      "newStatus": "ACTIVE",
      "userEmail": "wf_1794128990239_violation_user@university.edu",
      "previousStatus": "SUSPENDED"
    },
    "ipAddress": null,
    "createdAt": "2026-11-08T09:10:04.688Z"
  },
  {
    "id": "cmw9a7m7b000008jqempc598o",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "MEMBER_VERIFIED",
    "targetType": "USER",
    "targetId": "9eX2XFGRfXneGZFXb37Qdpo0RhAPWzSx",
    "targetLabel": "Naima marjan Jerin",
    "reason": "Approved by administrator via Member Network.",
    "details": {
      "userEmail": "naimamarjanjerin@gmail.com",
      "newVerificationStatus": "VERIFIED",
      "previousVerificationStatus": "PENDING"
    },
    "ipAddress": "103.151.171.153",
    "createdAt": "2026-11-09T13:13:11.975Z"
  },
  {
    "id": "cmw9a7tz4000208jqk73xwqlw",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "MEMBER_VERIFIED",
    "targetType": "USER",
    "targetId": "lnCXe6mNhDbNA5kcNrPRCHyIrxn2BLTH",
    "targetLabel": "maufiya khatun",
    "reason": "Approved by administrator via Member Network.",
    "details": {
      "userEmail": "maufiyakhatun99@gmail.com",
      "newVerificationStatus": "VERIFIED",
      "previousVerificationStatus": "PENDING"
    },
    "ipAddress": "103.151.171.153",
    "createdAt": "2026-11-09T13:13:22.048Z"
  },
  {
    "id": "cmw9a7xmi000408jqlkmsi2ff",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "MEMBER_VERIFIED",
    "targetType": "USER",
    "targetId": "l1gQBbGkGyFhqUKNkJFyKAfX7uplfyrM",
    "targetLabel": "Jannatun Nahar Jui",
    "reason": "Approved by administrator via Member Network.",
    "details": {
      "userEmail": "jannatunnaharjui872@gmail.com",
      "newVerificationStatus": "VERIFIED",
      "previousVerificationStatus": "PENDING"
    },
    "ipAddress": "103.151.171.153",
    "createdAt": "2026-11-09T13:13:26.778Z"
  },
  {
    "id": "cmw9a81kb000608jqg5ufo1e7",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "MEMBER_VERIFIED",
    "targetType": "USER",
    "targetId": "zw0XJr3KbwTWoM9S18hfFR3WCgilIzLf",
    "targetLabel": "Fariha Yasmeen",
    "reason": "Approved by administrator via Member Network.",
    "details": {
      "userEmail": "farihayasmeen0612@gmail.com",
      "newVerificationStatus": "VERIFIED",
      "previousVerificationStatus": "PENDING"
    },
    "ipAddress": "103.151.171.153",
    "createdAt": "2026-11-09T13:13:31.883Z"
  },
  {
    "id": "cmw9a8cmk000808jqpqr4yzi7",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "MEMBER_VERIFIED",
    "targetType": "USER",
    "targetId": "zw0XJr3KbwTWoM9S18hfFR3WCgilIzLf",
    "targetLabel": "Fariha Yasmeen (CGPA)",
    "reason": "Academic CGPA validated by administrator.",
    "details": {
      "userEmail": "farihayasmeen0612@gmail.com",
      "actionType": "CGPA_VERIFIED",
      "currentCgpa": 3.59
    },
    "ipAddress": "103.151.171.153",
    "createdAt": "2026-11-09T13:13:46.221Z"
  },
  {
    "id": "cmwfzs537000008l5xiwi9fzw",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_SUSPENDED",
    "targetType": "USER",
    "targetId": "XyU8TL17Uh4ErfRLvyPzl3oVhWqqvdF5",
    "targetLabel": "Sajib Hasan",
    "reason": "Account deleted by administrator.",
    "details": {
      "actionType": "USER_DELETED",
      "membershipType": "STUDENT",
      "deletedUserEmail": "b220305009@cse.jnu.ac.bd"
    },
    "ipAddress": "103.151.171.152",
    "createdAt": "2026-11-14T05:55:37.027Z"
  },
  {
    "id": "cmwg03nfs000008l4fy6y319o",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "MEMBER_VERIFIED",
    "targetType": "USER",
    "targetId": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "targetLabel": "S.M Sajib Al Hasan",
    "reason": "Approved by administrator via Member Network.",
    "details": {
      "userEmail": "b220305009@cse.jnu.ac.bd",
      "newVerificationStatus": "VERIFIED",
      "previousVerificationStatus": "PENDING"
    },
    "ipAddress": "103.151.171.152",
    "createdAt": "2026-11-14T06:04:34.025Z"
  },
  {
    "id": "cmwg0j6qo000208l4a8p06tcf",
    "adminId": "cmw32x6lo000gx6r7cxbbtlrb",
    "action": "ACCOUNT_SUSPENDED",
    "targetType": "USER",
    "targetId": "BsrbCebNKXMnUYFkfRtsGXV5OSRTgvJ1",
    "targetLabel": "S.M Sajib Al Hasan",
    "reason": "Verification revoked by administrator.",
    "details": {
      "userEmail": "b220305009@cse.jnu.ac.bd",
      "newVerificationStatus": "PENDING",
      "previousVerificationStatus": "VERIFIED"
    },
    "ipAddress": "103.151.171.152",
    "createdAt": "2026-11-14T06:16:38.880Z"
  }
]
```

---

