// Script content. "[click: ...]" marks a click cue. Paragraph breaks = array items.
module.exports = [
{
  part: "Problem", speaker: 1, slides: "1–7",
  items: [
    { n: "1", t: "Cover", say: [
      "Good morning everyone. We are Group-1, and today we present UniCareer Community: a website where Jagannath University students and alumni share trusted jobs and help each other with referrals.",
      "These three cards show what it does. Trusted jobs, shared only by verified JnU members. Alumni referrals, which you can ask for in the app or by email. And no missed deadlines, because saved jobs go on your calendar.",
      "Our talk has six parts: the problem, the requirements, the UML diagrams, the app itself, the database, and finally reports and closing. Seven of us will present." ] },
    { n: "2", t: "Meet Group-1", say: [
      "Here is our team: Ifrat Jahan Juthy, Jannatun Nahar Jui, Fariha Yasmeen, Nazmul Hasan Riyan, S.M Sajib Al Hasan, Naima Marjan and Maufiya Khatun. Each of us will present one part." ] },
    { n: "3", t: "Why job hunting at JnU is hard today", say: [
      "Let's start with why this matters. The BBS Labour Force Survey 2024 shows that 13.5 percent of graduates are unemployed, and one in three waits up to two years for a job.",
      "We built the system around three example people. Tanvir is a student: he can't tell which jobs are real. Al-Amin is an alumnus working at Chaldal: he wants to help juniors, but has no trusted place to do it. And Arif is the admin: his job is to keep fake accounts out.",
      "On the left is job hunting today: an \"urgent hiring\" post from an unknown page, asking you to send your CV to the inbox. No real poster, no deadline, and your CV goes to a stranger.",
      "On the right is the same search on UniCareer: a real job, Junior Backend Engineer at bKash, posted by a verified member. The deadline is shown, you apply on the company's own site, and you get a reminder before it closes." ] },
    { n: "4", t: "What goes wrong, and how we fix it", say: [
      "Here are the five problems, and how we fix each one.",
      "Fake job posts: only approved members can post. Unknown posters: every job page shows who posted it. Fake accounts: we check the email and student ID before anyone gets in. CVs sent to strangers: students apply on the company's own website. And missed deadlines: students save jobs and get reminders." ] },
    { n: "5", t: "How it works in three stages", say: [
      "The whole app works in three stages.",
      "First, get in: you sign up, confirm your email, and an admin approves you. Second, find and apply: you browse jobs, save the ones you like, and apply on the company's site. Third, keep track: you track your applications, ask an alumnus for a referral, and get reminders before deadlines." ] },
    { n: "6", t: "What students can do", say: [
      "We wrote our needs as user stories. For a student:",
      "I want to find trusted jobs, so that I avoid fake offers. I want to track my applications, so that nothing gets lost. I want to ask an alumnus for a referral, so that I get noticed. And I want deadline reminders, so that I never miss one." ] },
    { n: "7", t: "What alumni and admins can do", say: [
      "For an alumnus: I want to share job openings, so juniors hear early. And I want to answer referral requests in the app or by email, so I help people I trust.",
      "For the admin: I want to approve new members, so only real JnU people join. And I want to remove fake job posts, so students stay safe." ] },
  ],
  handoff: "Now [Speaker 2] will turn these stories into requirements.",
  tips: [
    "Tanvir, Al-Amin and Arif are example personas, not real people. The scam post on slide 3 is an illustration.",
    "13.5% is a BBS-based figure for 2024; “1 in 3 wait up to 2 years” is from the Labour Force Survey 2024.",
  ],
},
{
  part: "Requirements", speaker: 2, slides: "8–12",
  items: [
    { n: "8", t: "One goal shapes many features", say: [
      "Thank you. Before the list, one idea: a single quality goal can shape many features.",
      "Our main non-functional goal is: only real JnU people get in, and their data stays private. That one goal created four features: an email check before login, admin approval for every member, phone and student ID hidden from others, and applying on the company's own site. So a quality requirement directly created functional requirements." ] },
    { n: "9", t: "What the system must do (1/2)", say: [
      "These are the functional requirements: what the system must do.",
      "FR-1, sign up: with your email, student ID and department, and a password of at least 8 characters. FR-2, email check: you click the email link, then wait for admin approval. FR-3, member approval: the admin approves or rejects, and an email tells you which.",
      "FR-4, post a job: only approved students and alumni can post, and the job goes live right away. FR-5, find jobs: search and filter by job type, office or remote, and department. FR-6, apply and track: you apply on the company site, and the app keeps one record per job." ] },
    { n: "10", t: "What the system must do (2/2)", say: [
      "FR-7, community feed: members can post, like, comment and save. Posts are 10 to 5,000 characters. FR-8, report posts: a post reported 3 times is flagged for the admins. FR-9, referrals: ask an alumnus in the app or by email.",
      "FR-10, reminders: alerts before a saved job's deadline. FR-11, admin tools: approve members, verify CGPA, suspend accounts and handle reports. And FR-12, activity log: every admin action is saved, with who, what, why and when." ] },
    { n: "11", t: "How well it must work", say: [
      "Now the non-functional requirements: how well it must work. They are in three groups.",
      "Product: it is safe, because private data is hidden from other members; reliable, with 194 automated tests; and easy to use on both phone and laptop.",
      "Organisation: we used standard tools, Next.js and PostgreSQL. We wrote a report for every build stage. And the app is online at jnujobhunting.vercel.app.",
      "Outside rules: student ID and phone are never shown publicly, only JnU members can join, and real emails are sent through Gmail." ] },
    { n: "12", t: "UniCareer vs. other job sources", say: [
      "Finally, how we compare with other job sources. This is our team's view of how each platform generally works, not a formal audit.",
      "Only UniCareer limits members to approved JnU people. LinkedIn and Bdjobs show who posted a job; Facebook groups often don't. Asking alumni for a referral is built into UniCareer; on LinkedIn and Facebook it happens only partly, through personal messages. Our admins remove fake posts; elsewhere that happens partly or rarely. And all of them are free for students.",
      "So our advantage is trust, and the JnU alumni network." ] },
  ],
  handoff: "Next, [Speaker 3] will show how we designed the system with UML.",
  tips: [
    "Exact password rule: at least 8 characters, with an uppercase letter, a number and a symbol.",
    "194 tests in 16 files, all passing (run of 14 Nov 2026).",
    "“Only JnU members”: this is enforced by the admin approval step. The sign-up form itself accepts any email address.",
  ],
},
{
  part: "UML: Use case and Sequence", speaker: 3, slides: "13–19",
  items: [
    { n: "13", t: "Our system in four UML views", say: [
      "Thank you. We describe the system with four UML views.",
      "Use case shows who does what. Sequence shows what happens, step by step, when you apply. Activity shows a job's journey. And Class shows how the data fits together. Each one has an overview slide, then zoomed detail slides. I'll cover the first two." ] },
    { n: "14", t: "Use case diagram: overview", say: [
      "This is the use case diagram. The big box is our system.",
      "On the left are the members. Student and Alumnus both inherit from Member; that's the arrow with the hollow head. So anything a member can do, both can do: register, log in, search and save jobs, get reminders, apply, post jobs and use the feed. Request Referral is only for students, and Respond to Referral is only for alumni.",
      "On the right is the Admin, who reviews members, verifies CGPA, moderates job posts, resolves reports, suspends accounts and views the audit log." ] },
    { n: "15", t: "Use cases: students and alumni", say: [
      "Let's zoom in on the member side. Two arrow types matter here.",
      "«include» means it always happens: registering always sends a verification email, verifying always puts you in the approval queue, and applying always records the application.",
      "«extend» means it happens only sometimes: you may report a post while using the feed, or email an alumnus instead of using the in-app form.",
      "On the right are two outside actors: the Email Service, which sends the emails, and the Scheduler, which starts the deadline reminders." ] },
    { n: "16", t: "Use cases: admin", say: [
      "Now the admin side. Every admin change includes Write Audit Log, so every change is recorded.",
      "Some actions also include Notify Member. For example, when a membership or a job post is rejected, the member always gets the reason. And an admin can't suspend their own account." ] },
    { n: "17", t: "Sequence diagram: applying for a job", say: [
      "Now the sequence diagram for applying to a job. Read it from top to bottom: lower means later. Solid arrows are calls, and dashed arrows are replies.",
      "The student clicks Continue, which opens the company's site. After applying there, they click Save. The job page sends the request to our Applications API. The \"ref\" box points to the checks, which are shown in detail 1. Then the service looks up the job.",
      "The \"alt\" box shows three outcomes. If the job isn't open, we return an error. If it's already recorded, we return an error. Otherwise, we save the application and its history, send a notification, and show a confirmation." ] },
    { n: "18", t: "Sequence: checks before saving", say: [
      "Detail 1 is the checks before saving. Notice it takes two clicks: open the company site, then save.",
      "The API first checks that you are logged in. Then the rate limiter counts your saves. Over 30 in one hour, you are blocked with \"too many requests\". Otherwise it continues to detail 2." ] },
    { n: "19", t: "Sequence: saving and confirming", say: [
      "Detail 2 is saving and confirming. Only open jobs can be tracked.",
      "Each student can have only one record per job. The database itself enforces this, so even two quick clicks make only one record. The application and its first history row are saved together, and then the student gets a confirmation alert." ] },
  ],
  handoff: "Now [Speaker 4] continues with the activity and class diagrams.",
  tips: [
    "The rate limit is kept in server memory. On Vercel each server instance counts separately; a shared store like Redis would make it exact.",
    "Not logged in → the API answers 401 before the rate check. Too many → 429.",
  ],
},
{
  part: "UML: Activity and Class", speaker: 4, slides: "20–26",
  items: [
    { n: "20", t: "Activity diagram: a job's journey", say: [
      "Thank you. This activity diagram shows a job's journey. Each column, called a swimlane, shows who does the step: the poster, the student, the system and the admin.",
      "The black dot is the start and the bullseye is the end. Rounded boxes are actions, and diamonds are decisions.",
      "A poster fills in the job form and submits it, and the system publishes it right away. Then two things happen at the same time; this thick bar is called a fork. Students can browse and apply, while the admin reviews the live post. If it's misleading, the admin closes or rejects it, and the poster is notified." ] },
    { n: "21", t: "Activity: posting and moderation", say: [
      "Detail 1 is posting and moderation. First the system checks the poster. If you're not a verified member, you see \"not allowed\". If you are, the job goes live instantly.",
      "Then the admin reviews it. If it's fine, nothing changes. If it's misleading, the admin closes or rejects it with a reason, and the poster is notified." ] },
    { n: "22", t: "Activity: applying and tracking", say: [
      "Detail 2 is applying and tracking. The student browses jobs and applies on the company site.",
      "The system checks the hourly limit: over 30, try again later. Then it checks for a duplicate: if the job is already tracked, you see that message. If it's new, the application is saved. Then two things happen together: it's added to your list, and you get an alert." ] },
    { n: "23", t: "Class diagram: overview", say: [
      "Now the class diagram, which shows the static structure. It has 14 of our 30 database models: the ones behind the main features.",
      "Each box has three parts: the class name, its attributes and its operations. Minus means private, plus means public. The lines show links with numbers: 1 means exactly one, and 0..* means zero or many. A filled diamond means composition: the part can't exist without the whole.",
      "User is in the middle, linked to almost everything." ] },
    { n: "24", t: "Classes: people and accounts", say: [
      "Detail 1: people and accounts. Each user has one profile. This is composition, so the profile is deleted with the user.",
      "A user can submit membership requests, receive many notifications, and send or receive referral requests. Admins write audit log entries. And the User class has canPostJob, which decides who may post." ] },
    { n: "25", t: "Classes: jobs and applications", say: [
      "Detail 2: jobs and applications. A user posts many opportunities, and an opportunity can belong to a company.",
      "Bookmark and Application both link a user to a job, and a student can apply only once per job. Jobs expire on their own when the deadline passes, and posters or admins can close them." ] },
    { n: "26", t: "Classes: community feed", say: [
      "Detail 3: the community feed. A user writes many posts. A post owns its comments and likes, so if the post is deleted, they go too.",
      "A comment can reply to another comment, so replies are threaded. And when a post gets 3 reports, it is flagged for the admin." ] },
  ],
  handoff: "That's the design. Now [Speaker 5] will show you the real app.",
  tips: [
    "Posting is instant (status Live); admins moderate afterwards, not before.",
    "The class diagram leaves out 16 models (login tables, logs, left-over tables) to keep it readable; all 30 are in the ER diagram.",
  ],
},
{
  part: "App UI", speaker: 5, slides: "27–33",
  items: [
    { n: "27", t: "Create your account", say: [
      "Thank you. Now let's see the app working. Every slide has the same layout: what you enter on the left, and what you get on the right.",
      "First, creating an account. [click: sign-up form] You choose student or alumnus, then enter your name, email, student ID, department and a strong password.",
      "[click: verification email] You then get this real verification email, sent through Gmail, and you click the link.",
      "[click: pending member] The result: your request now waits in the admin's member list as pending." ] },
    { n: "28", t: "Log in to your dashboard", say: [
      "Next, logging in. [click: login page] Login only works after the admin has approved you.",
      "[click: dashboard] After login, you land on your home feed, with jobs, people and posts." ] },
    { n: "29", t: "Share in the community feed", say: [
      "In the community feed, members share with each other. [click: write a post] You write a post and choose its type: a discussion, a referral request, or an achievement.",
      "[click: post with comments] Others can then like it, comment and reply." ] },
    { n: "30", t: "Share a job", say: [
      "Now sharing a job. [click: job form] An approved member fills in this form: company, job title, type, location, deadline, description, and the official link to apply. There's also a live preview of the card.",
      "[click: live job post] After submitting, the job is live immediately, and the poster can close or remove it later." ] },
    { n: "31", t: "Find, apply and track", say: [
      "This is what a student uses most. [click: find a job] They search and filter jobs by type, workplace, department and CGPA.",
      "[click: apply on company site] Opening a job, they click Continue to apply on the company's own careers site, here bKash, and then \"Save to My Applications\".",
      "[click: calendar] The deadline then shows up on their career calendar." ] },
    { n: "32", t: "Ask an alumnus for a referral", say: [
      "Asking for a referral. [click: referral post] A student can post a referral request in the feed. Here, an alumnus who works at Chaldal replies in the comments.",
      "[click: request referral] Or the student can open the alumnus's profile and ask directly: with a ready-made email, or through the in-app form, which is logged so it can be tracked." ] },
    { n: "33", t: "Admin: keep it safe", say: [
      "Finally, the admin side. [click: admin overview] The admin center shows live counts and alerts, like pending verification requests and content reports.",
      "[click: content reports] In content reports, the admin reviews a reported post and acts on it. Every action is logged." ] },
  ],
  handoff: "Behind all these screens is our database, which [Speaker 6] will explain.",
  tips: [
    "Each slide has zoom clicks; keep clicking until the next slide title appears.",
    "Don't read the numbers on the admin screenshot aloud; they are older than the Reports data.",
    "Before approval, login shows “Awaiting Administrator Approval”.",
  ],
},
{
  part: "Database", speaker: 6, slides: "34–45",
  items: [
    { n: "34", t: "30 tables, 6 groups", say: [
      "Thank you. Our database has 30 tables, in 6 groups.",
      "People and login has 9 tables. The users table is the centre, and every group links back to it. Jobs and applications has 7, community and referrals has 7, alerts and calendar has 4, and admin has one: the audit log. Two tables are left over from features we removed: CV upload and company accounts." ] },
    { n: "35", t: "The full ER diagram", say: [
      "This is the full ER diagram, in crow's-foot notation. It shows all 30 tables and 48 relationships.",
      "The coloured zones are the same 6 groups: jobs on the left, community on the right, admin and left-over tables at the top, alerts at the bottom, and people and login in the middle, with users at the centre.",
      "At the end of each line, two bars mean exactly one, a circle means optional, and the crow's foot means many.",
      "Now let's zoom into each group. [click: 1 / 6 People and login] People and login: users is in the centre, and every table here links to it. [click: 2 / 6 Jobs and applications] Jobs and applications: the job post, with its applications, bookmarks and comments.",
      "[click: 3 / 6 Community and referrals] Community and referrals: posts, comments, likes, reports and referral requests. [click: 4 / 6 Alerts and calendar] Alerts and calendar: four tables that all belong to one member.",
      "[click: 5 / 6 Admin] Admin: the audit log, one row for every admin action. [click: 6 / 6 Left over] And the two left-over tables, shown dashed in grey. [click: zoom out] And back to the full picture." ] },
    { n: "36", t: "People and login", say: [
      "Now each group, with its key columns. PK is the primary key, FK is a link to another table, and UQ means unique.",
      "The users table holds the account and its status. Profiles is one-to-one with users. Membership requests links to users twice: once for the member, and once for the admin who reviewed it. Sessions, accounts and verifications handle login, and the password is stored only as a hash.",
      "You can click any table to see real rows from our database." ] },
    { n: "37", t: "Jobs and applications", say: [
      "Jobs and applications. Opportunities is the job post: posterId is the member who shared it, and externalUrl is the company's apply page.",
      "Applications is unique on job plus applicant, so there is one record per job. Application status history keeps the timeline you see in My Applications. Bookmarks are saved jobs, and manual applications let a member track jobs they found outside the app." ] },
    { n: "38", t: "Community and referrals", say: [
      "Community and referrals. Posts are the feed posts. Post reactions are unique per post, user and type, so a like can't be counted twice.",
      "Comments have a parentId that points to another comment, which gives threaded replies. Content reports can point to a post or a comment. And referral requests link a student to an alumnus." ] },
    { n: "39", t: "Alerts and calendar", say: [
      "Alerts and calendar. All four tables belong to one member.",
      "Notifications are the in-app alerts. Notification preferences store each member's on and off switches. Calendar events hold deadlines and events. And deadline reminder logs remember which reminders were sent, so none goes out twice." ] },
    { n: "40", t: "Admin and left-over tables", say: [
      "The admin audit log has one row for every admin action: who did it, what, to which record, why, and from where. Rows are only added, never changed.",
      "The two grey tables, resumes and company members, are still in the database, but nothing writes to them any more. They can be removed in a later clean-up." ] },
    { n: "41", t: "Life of a member", say: [
      "Now, how the tables change over time. This is one member's life.",
      "Step 1: they fill in the form. The email is not confirmed yet, the status is pending, there's no join request yet, and they can't log in. Step 2: they click the email link. The email is confirmed and a join request is created as pending, but they still can't log in.",
      "Step 3: the admin approves. The status becomes verified, the request is approved, and now they can log in. Step 4: if needed, the admin suspends them, and they can't log in.",
      "If the admin rejects, both become rejected with a reason, and the member can send a new request." ] },
    { n: "42", t: "Life of a job post", say: [
      "The life of a job post. Save as Draft, and only you see it. Submit, and it's live right away. Admins check posts after they're live.",
      "From live, three things can happen: the deadline passes and it expires automatically; the poster or an admin closes it; or an admin rejects it with a reason." ] },
    { n: "43", t: "One click, step by step", say: [
      "What happens in one click on \"Save to My Applications\"? Three checks, in order. Not too many, at most 30 an hour? Is the job live? Was it saved before?",
      "If all pass, it's saved to applications and its history, and it shows in My Applications. The last check is done by the database itself, so even if two clicks arrive at once, only one record is kept." ] },
    { n: "44", t: "The reminder robot", say: [
      "The reminder robot runs on a schedule. One: it finds jobs with a deadline in the next 72 hours. Two: it finds members who saved or applied to them. Three: it checks the log, and if someone was already reminded, it skips them. Four: it sends the alert and records it.",
      "Each job gets two reminders, 72 hours before and 24 hours before, and never the same one twice." ] },
    { n: "45", t: "Keeping data safe", say: [
      "Finally, keeping data safe. Passwords are scrambled: they're stored only as a hash. Student ID and phone are hidden from other members. The database refuses duplicates with 8 unique rules. And every admin action is logged.",
      "We chose PostgreSQL because links and unique rules are enforced by the database itself, not just by our code." ] },
  ],
  handoff: "Now [Speaker 7] will show what the data tells us.",
  tips: [
    "Hidden data slides: click a table on slides 36–40 to show real rows, then the link to come back. Skip them if time is short.",
    "Passwords are hashed with scrypt (by Better Auth).",
    "The reminder robot is an API route that needs an outside scheduler (cron) to call it.",
    "application_status_history is not left over: it is written when you apply or withdraw.",
  ],
},
{
  part: "Reports and Closing", speaker: 7, slides: "46–52 + Thank you",
  items: [
    { n: "46", t: "What our database holds today", say: [
      "Thank you. First, what our database holds today: 36 accounts, 59 job posts, 32 companies, 30 community posts and 7 referral requests.",
      "These come from our live database, exported read-only on 14 November. For the demo, we filled it with realistic JnU students, alumni, companies and posts.",
      "On the right is how a report is made: the app saves rows, a summary query counts and groups them, and the result appears on the admin dashboard." ] },
    { n: "47", t: "Who is on UniCareer right now", say: [
      "Who is on UniCareer right now? 35 members: 23 students and 12 alumni. 27 are approved and 8 are waiting for approval.",
      "The charts show members by department, job posts by type, mostly full-time and internships, and where the jobs are: hybrid, remote or on-site." ] },
    { n: "48", t: "Degrees don't guarantee jobs", say: [
      "Now the bigger picture in Bangladesh. Graduate unemployment rose from 11.2 percent in 2016-17 to 13.5 percent in 2024. The number of graduates without a job more than doubled, from about 4 lakh to about 9 lakh in 2023. And one in three graduates waited up to two years for a job.",
      "So JnU students need a direct path to real jobs, shared by their own alumni." ] },
    { n: "49", t: "How people in Bangladesh find jobs", say: [
      "How do people find jobs? The Labour Force Survey 2024 says 35.8 percent of unemployed people look for work through relatives and friends. That's more than one in three, and the most common way. Newspaper ads are 25.8 percent, and applying directly is 9.7 percent.",
      "So knowing the right person still matters most, and students without contacts are left out. UniCareer makes JnU alumni that contact." ] },
    { n: "50", t: "Fake job offers in Bangladesh", say: [
      "Fake job offers are a real problem here. These are police cases reported in the news. In 2022, fake government job letters took over 2 crore Taka from about 90 job seekers. In 2023, fake \"Amazon jobs\" ads took about 100 crore Taka. One woman lost 3.4 lakh Taka to a fake online job. And in 2026, a fake jewellery company on Telegram took 94 lakh Taka.",
      "There are no national statistics, but the pattern is the same every time. Our answer: only approved members can post, every post shows who shared it, and you apply on the company's own website, never by paying anyone." ] },
    { n: "51", t: "From problem to answer", say: [
      "This slide ties it all together. Graduates can't find work, so we give them job leads shared by JnU alumni. Jobs come through people, so we built referrals. And there are fake job offers, so only approved members can post, and you apply on the real company site." ] },
    { n: "52", t: "Tanvir's journey, start to finish", say: [
      "To close, let's go back to Tanvir. Before, he faced fake posts, no referrals and missed deadlines.",
      "With UniCareer: one, he joins and gets approved. Two, he finds a trusted job. Three, he asks an alumnus for a referral. Four, he applies on the company site. And five, the deadline is saved on his calendar. He applied on time, and it's tracked.",
      "Our next steps are real-browser tests and a load test." ] },
    { n: "—", t: "Thank you", say: [
      "Thank you for listening. UniCareer Community is live at jnujobhunting.vercel.app. We're happy to take your questions, or to show a live demo." ] },
  ],
  handoff: null,
  tips: [
    "Report numbers are seeded demo data, not months of real use. Say this if asked.",
    "Sources: BBS Labour Force Surveys 2016-17 to 2024; police cases reported by The Daily Star, TBS News, bdnews24.com.",
  ],
},
];
