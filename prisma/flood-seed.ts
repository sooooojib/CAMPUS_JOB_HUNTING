import { prisma } from "../lib/prisma";
import { hashPassword } from "better-auth/crypto";

// =========================================================================
// REALISTIC AUTHENTIC JNU MEMBERS (STUDENTS & ALUMNI)
// =========================================================================
const REAL_MEMBERS = [
  {
    name: "Sajib Hasan",
    email: "b220305009@cse.jnu.ac.bd",
    membershipType: "STUDENT" as const,
    studentId: "B220305009",
    department: "Computer Science & Engineering",
    academicYear: "3rd Year / Junior",
    graduationYear: 2026,
    degree: "B.Sc. in Computer Science & Engineering",
    currentCgpa: 3.84,
    headline: "Competitive Programmer & Full-Stack Developer | JnU CSE '26",
    bio: "Undergrad at Jagannath University passionate about distributed systems, Next.js, and TypeScript. Active problem solver with 500+ problems on Codeforces & LeetCode.",
    skills: ["TypeScript", "Next.js", "React", "Node.js", "PostgreSQL", "C++", "Docker"],
    interests: ["Competitive Programming", "Cloud Systems", "Web Performance"],
    githubUrl: "https://github.com/sooooojib",
    linkedinUrl: "https://linkedin.com/in/sajib-hasan-jnu",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    verificationStatus: "VERIFIED" as const,
  },
  {
    name: "Tanvir Ahmed Chowdhury",
    email: "tanvir.ahmed@cse.jnu.ac.bd",
    membershipType: "STUDENT" as const,
    studentId: "B210305018",
    department: "Computer Science & Engineering",
    academicYear: "4th Year / Senior",
    graduationYear: 2025,
    degree: "B.Sc. in Computer Science & Engineering",
    currentCgpa: 3.91,
    headline: "Backend Engineer & Distributed Systems Enthusiast | JnU CSE '25",
    bio: "Final year student focused on Go, Kafka, and microservices architecture. Ex-Intern at Chaldal. Incoming Associate Software Engineer.",
    skills: ["Go", "Kafka", "PostgreSQL", "Redis", "Docker", "Kubernetes", "gRPC"],
    interests: ["High-Throughput Systems", "Database Internals", "Distributed Consensus"],
    githubUrl: "https://github.com/tanvir-ahmed-dev",
    linkedinUrl: "https://linkedin.com/in/tanvir-ahmed-cse",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    verificationStatus: "VERIFIED" as const,
  },
  {
    name: "Nusrat Jahan Sneha",
    email: "nusrat.jahan@swe.jnu.ac.bd",
    membershipType: "STUDENT" as const,
    studentId: "B220306024",
    department: "Software Engineering",
    academicYear: "3rd Year / Junior",
    graduationYear: 2026,
    degree: "B.Sc. in Software Engineering",
    currentCgpa: 3.78,
    headline: "Mobile & Frontend Engineer | React Native, Flutter & UI/UX | JnU SWE",
    bio: "Creating user-centric mobile applications with clean architecture and delightful micro-interactions. Lead Organizer at JnU Women in Tech.",
    skills: ["React Native", "Flutter", "TypeScript", "Tailwind CSS", "Figma", "Redux"],
    interests: ["Mobile UX", "Cross-Platform Dev", "Design Systems"],
    githubUrl: "https://github.com/nusrat-sneha-swe",
    linkedinUrl: "https://linkedin.com/in/nusrat-jahan-swe",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    verificationStatus: "VERIFIED" as const,
  },
  {
    name: "Mehedi Hasan Rifat",
    email: "mehedi.rifat@eee.jnu.ac.bd",
    membershipType: "STUDENT" as const,
    studentId: "B210307042",
    department: "Electrical & Electronic Engineering",
    academicYear: "4th Year / Senior",
    graduationYear: 2025,
    degree: "B.Sc. in Electrical & Electronic Engineering",
    currentCgpa: 3.65,
    headline: "IoT & Embedded Systems Engineer | Robotics & Firmware | JnU EEE",
    bio: "Building smart campus IoT networks, STM32 firmware, and sensor telemetry systems. President of JnU Robotics & Embedded Club.",
    skills: ["C/C++", "Embedded Systems", "STM32", "PCB Design", "MQTT", "Python"],
    interests: ["Edge Computing", "Hardware Accelerators", "Robotics"],
    githubUrl: "https://github.com/mehedi-rifat-iot",
    linkedinUrl: "https://linkedin.com/in/mehedi-hasan-eee",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    verificationStatus: "VERIFIED" as const,
  },
  {
    name: "Anika Tabassum",
    email: "anika.tabassum@stat.jnu.ac.bd",
    membershipType: "STUDENT" as const,
    studentId: "B220308015",
    department: "Statistics",
    academicYear: "3rd Year / Junior",
    graduationYear: 2026,
    degree: "B.Sc. in Statistics & Data Science",
    currentCgpa: 3.88,
    headline: "Data Analyst & Machine Learning Researcher | JnU Statistics",
    bio: "Leveraging Bayesian inference, Python statistical libraries, and predictive modeling for actionable insights. Published researcher in epidemiological forecasting.",
    skills: ["Python", "R", "SQL", "Pandas", "Scikit-Learn", "Tableau", "PowerBI"],
    interests: ["Data Analytics", "Predictive Modeling", "Biostatistics"],
    githubUrl: "https://github.com/anika-tabassum-data",
    linkedinUrl: "https://linkedin.com/in/anika-tabassum-stat",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    verificationStatus: "VERIFIED" as const,
  },
  {
    name: "Kazi Fahim Muntasir",
    email: "kazi.fahim@cse.jnu.ac.bd",
    membershipType: "STUDENT" as const,
    studentId: "B230305061",
    department: "Computer Science & Engineering",
    academicYear: "2nd Year / Sophomore",
    graduationYear: 2027,
    degree: "B.Sc. in Computer Science & Engineering",
    currentCgpa: 3.72,
    headline: "Frontend Craftsman & Open Source Contributor | JnU CSE '27",
    bio: "Passionate about building fast, responsive, and accessible web experiences with Next.js, Tailwind CSS, and shadcn/ui. Hackathon enthusiast.",
    skills: ["React", "Next.js", "Tailwind CSS", "JavaScript", "HTML5", "CSS3", "Git"],
    interests: ["Web Animations", "Modern UI/UX", "Open Source"],
    githubUrl: "https://github.com/kazi-fahim-web",
    linkedinUrl: "https://linkedin.com/in/kazi-fahim-muntasir",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    verificationStatus: "VERIFIED" as const,
  },
  {
    name: "Ayesha Siddiqua",
    email: "ayesha.siddiqua@mkt.jnu.ac.bd",
    membershipType: "STUDENT" as const,
    studentId: "B210309033",
    department: "Marketing",
    academicYear: "4th Year / Senior",
    graduationYear: 2025,
    degree: "B.B.A. in Marketing",
    currentCgpa: 3.82,
    headline: "Product Marketing Trainee & Growth Strategist | JnU Business Studies",
    bio: "Specializing in digital marketing, user acquisition funnels, and product go-to-market strategies for tech startups in Bangladesh.",
    skills: ["Growth Marketing", "SEO/SEM", "Content Strategy", "Google Analytics", "Brand Management"],
    interests: ["FinTech Adoption", "Product Growth", "Market Research"],
    linkedinUrl: "https://linkedin.com/in/ayesha-siddiqua-mkt",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    verificationStatus: "VERIFIED" as const,
  },
  {
    name: "Farhan Ishraq",
    email: "farhan.ishraq@swe.jnu.ac.bd",
    membershipType: "STUDENT" as const,
    studentId: "B230306019",
    department: "Software Engineering",
    academicYear: "2nd Year / Sophomore",
    graduationYear: 2027,
    degree: "B.Sc. in Software Engineering",
    currentCgpa: 3.68,
    headline: "Cloud & DevOps Aspirant | Docker, Linux, CI/CD | JnU SWE",
    bio: "Learning automated build pipelines, infrastructure as code, and cloud monitoring. Contributor to Linux kernel user-space tools.",
    skills: ["Linux", "Bash", "Docker", "GitHub Actions", "Python", "AWS"],
    interests: ["DevOps", "Site Reliability", "Cloud Security"],
    githubUrl: "https://github.com/farhan-ishraq-cloud",
    linkedinUrl: "https://linkedin.com/in/farhan-ishraq-swe",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    verificationStatus: "VERIFIED" as const,
  },
  // ALUMNI
  {
    name: "Tariqul Islam",
    email: "tariqul.islam.alumni@bkash.com",
    membershipType: "ALUMNI" as const,
    studentId: "B170305012",
    department: "Computer Science & Engineering",
    graduationYear: 2021,
    degree: "B.Sc. in Computer Science & Engineering",
    company: "bKash Limited",
    designation: "Senior Software Engineer (FinTech Platform)",
    headline: "Senior Software Engineer at bKash | JnU CSE '21 | Distributed Systems Mentor",
    bio: "Scaling bKash core transaction engine handling millions of daily financial transactions. Passionate about mentoring JnU juniors and hiring campus engineering talent.",
    skills: ["Java", "Spring Boot", "Kafka", "PostgreSQL", "Oracle", "Docker", "Microservices"],
    interests: ["Financial Infrastructure", "High Concurrency", "Mentorship"],
    githubUrl: "https://github.com/tariqul-bkash",
    linkedinUrl: "https://linkedin.com/in/tariqul-islam-fintech",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    verificationStatus: "VERIFIED" as const,
  },
  {
    name: "Sadia Afrin",
    email: "sadia.afrin.alumni@brainstation-23.com",
    membershipType: "ALUMNI" as const,
    studentId: "B180305029",
    department: "Computer Science & Engineering",
    graduationYear: 2022,
    degree: "B.Sc. in Computer Science & Engineering",
    company: "Brain Station 23",
    designation: "Lead Enterprise Cloud Engineer",
    headline: "Lead Cloud Architect at Brain Station 23 | JnU CSE '22 | AWS Certified Solutions Architect",
    bio: "Architecting cloud migrations and microservices for international banking and healthcare clients. Passionate about serverless architectures and zero-trust security.",
    skills: ["AWS", "Terraform", "Kubernetes", "Node.js", "C# .NET", "Docker"],
    interests: ["Cloud Native", "DevOps Culture", "Enterprise Architecture"],
    githubUrl: "https://github.com/sadia-afrin-cloud",
    linkedinUrl: "https://linkedin.com/in/sadia-afrin-bs23",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    verificationStatus: "VERIFIED" as const,
  },
  {
    name: "Mahfuzur Rahman",
    email: "mahfuz.rahman.alumni@therapbd.com",
    membershipType: "ALUMNI" as const,
    studentId: "B160305008",
    department: "Computer Science & Engineering",
    graduationYear: 2020,
    degree: "B.Sc. in Computer Science & Engineering",
    company: "Therap (BD) Ltd.",
    designation: "Principal Software Engineer",
    headline: "Principal Software Engineer at Therap (BD) | JnU CSE '20 | Java Specialist",
    bio: "Designing healthcare software for intellectual disability care providers across North America. JnU ACM-ICPC regionalist (2018, 2019).",
    skills: ["Java", "J2EE", "Spring Cloud", "PostgreSQL", "Database Tuning", "System Design"],
    interests: ["Healthcare Tech", "Clean Architecture", "Competitive Programming"],
    githubUrl: "https://github.com/mahfuz-therap",
    linkedinUrl: "https://linkedin.com/in/mahfuzur-rahman-therap",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    verificationStatus: "VERIFIED" as const,
  },
  {
    name: "Kazi Nahian",
    email: "kazi.nahian.alumni@tigerit.com",
    membershipType: "ALUMNI" as const,
    studentId: "B170306014",
    department: "Software Engineering",
    graduationYear: 2021,
    degree: "B.Sc. in Software Engineering",
    company: "TigerIT Bangladesh",
    designation: "Senior Biometrics Systems Developer",
    headline: "Senior Biometrics & Identity Systems Engineer at TigerIT | JnU SWE '21",
    bio: "Working on national identity and cryptographic verification engines in C++ and high-performance algorithms. Proud JnU alumnus.",
    skills: ["C++", "Computer Vision", "OpenCV", "Cryptography", "Linux Systems"],
    interests: ["Biometrics", "Embedded AI", "Security"],
    githubUrl: "https://github.com/kazi-nahian-tigerit",
    linkedinUrl: "https://linkedin.com/in/kazi-nahian-identity",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    verificationStatus: "VERIFIED" as const,
  },
  {
    name: "Farhana Yesmin",
    email: "farhana.yesmin.alumni@samsung.com",
    membershipType: "ALUMNI" as const,
    studentId: "B180305041",
    department: "Computer Science & Engineering",
    graduationYear: 2022,
    degree: "B.Sc. in Computer Science & Engineering",
    company: "Samsung R&D Institute Bangladesh",
    designation: "Software Engineer (Mobile AI Team)",
    headline: "Software Engineer at Samsung R&D Bangladesh | JnU CSE '22 | On-Device AI",
    bio: "Optimizing deep learning models for Samsung Galaxy flagship devices. Winner of JnU Intra-Department Coding Championship 2021.",
    skills: ["C++", "Python", "TensorFlow Lite", "PyTorch", "Android NDK", "Algorithms"],
    interests: ["Edge AI", "Neural Accelerators", "Mobile Performance"],
    githubUrl: "https://github.com/farhana-samsung-ai",
    linkedinUrl: "https://linkedin.com/in/farhana-yesmin-samsung",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    verificationStatus: "VERIFIED" as const,
  },
  {
    name: "Al-Amin Hossain",
    email: "alamin.hossain.alumni@chaldal.com",
    membershipType: "ALUMNI" as const,
    studentId: "B190305022",
    department: "Computer Science & Engineering",
    graduationYear: 2023,
    degree: "B.Sc. in Computer Science & Engineering",
    company: "Chaldal Limited",
    designation: "Full-Stack Software Engineer",
    headline: "Full-Stack Engineer at Chaldal | JnU CSE '23 | F# & React Developer",
    bio: "Building warehouse routing and delivery logistics automation software. Passionate about functional programming and high-velocity web development.",
    skills: ["F#", "C# .NET", "React", "TypeScript", "SQL Server", "Azure"],
    interests: ["Functional Programming", "E-commerce Logistics", "Scalable Web"],
    githubUrl: "https://github.com/alamin-chaldal",
    linkedinUrl: "https://linkedin.com/in/alamin-hossain-chaldal",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    verificationStatus: "VERIFIED" as const,
  },
];

// =========================================================================
// REALISTIC VERIFICATION REQUESTS FOR ADMIN APPROVAL PANEL
// =========================================================================
const PENDING_VERIFICATION_REQUESTS = [
  {
    name: "Shahriar Kabir",
    email: "shahriar.kabir@cse.jnu.ac.bd",
    membershipType: "STUDENT" as const,
    studentId: "B220305033",
    department: "Computer Science & Engineering",
    academicYear: "3rd Year / Junior",
    graduationYear: 2026,
    proofDetails: "JnU Student ID Card scanned and semester fee payment slip attached. Roll: 33.",
    connectionNote: "Currently enrolled in 5th semester, Department of CSE, Jagannath University.",
  },
  {
    name: "Mst. Jannatul Ferdous",
    email: "jannat.ferdous@swe.jnu.ac.bd",
    membershipType: "STUDENT" as const,
    studentId: "B230306012",
    department: "Software Engineering",
    academicYear: "2nd Year / Sophomore",
    graduationYear: 2027,
    proofDetails: "Official Jagannath University RFID Smart Student Identity Card verified by Proctor office.",
    connectionNote: "Enrolled in B.Sc. in Software Engineering, Session 2022-23.",
  },
  {
    name: "Rashedul Karim",
    email: "rashed.karim@eee.jnu.ac.bd",
    membershipType: "STUDENT" as const,
    studentId: "B210307028",
    department: "Electrical & Electronic Engineering",
    academicYear: "4th Year / Senior",
    graduationYear: 2025,
    proofDetails: "Semester grade report signed by Department Chairman, Faculty of Science.",
    connectionNote: "Final year student completing senior design capstone project.",
  },
  {
    name: "Sayed Mahmud Hasan",
    email: "sayed.hasan.alumni@optimizely.com",
    membershipType: "ALUMNI" as const,
    studentId: "B170305044",
    department: "Computer Science & Engineering",
    graduationYear: 2021,
    organization: "Optimizely Bangladesh",
    designation: "Senior Software Engineer",
    proofDetails: "JnU B.Sc. Degree Certificate Certificate No: JNU-CSE-2021-044 and Optimizely Corporate ID.",
    connectionNote: "Alumnus session 2016-17. Offering mentorship and direct referrals for Optimizely engineering roles.",
  },
  {
    name: "Dilruba Sharmin",
    email: "dilruba.sharmin@pharm.jnu.ac.bd",
    membershipType: "STUDENT" as const,
    studentId: "B220310007",
    department: "Pharmacy",
    academicYear: "3rd Year / Junior",
    graduationYear: 2026,
    proofDetails: "Clinical trial lab badge and official university registration receipt.",
    connectionNote: "Seeking pharmaceutical QA/QC internship roles in top domestic firms.",
  },
  {
    name: "Tanzeemul Haque",
    email: "tanzeem.haque@fin.jnu.ac.bd",
    membershipType: "STUDENT" as const,
    studentId: "B210309019",
    department: "Finance & Banking",
    academicYear: "4th Year / Senior",
    graduationYear: 2025,
    proofDetails: "Faculty of Business Studies student clearance and seminar registration slip.",
    connectionNote: "Preparing for bank management trainee and fintech quantitative analyst openings.",
  },
];

// =========================================================================
// 30+ REALISTIC CAMPUS COMMUNITY DISCUSSIONS, DEBRIEFS & REFERRALS
// =========================================================================
const REAL_POSTS = [
  {
    authorEmail: "tariqul.islam.alumni@bkash.com",
    title: "bKash FinTech Engineering: Interview Breakdown & Tips from a Senior Engineer",
    content: `Assalamu Alaikum juniors! Seeing a lot of applications for bKash FinTech openings on UniCareer. Having been on the technical interview panel for 2+ years, here is what we truly evaluate:

1. **Concurrency & Thread Safety**: Can you prevent double-spending in a simulated transaction engine? Be ready to write thread-safe Java code using ConcurrentHashMap, ReentrantLocks, and atomic variables.
2. **Database Isolation Levels**: You must clearly understand Read Committed vs Repeatable Read, phantom reads, and optimistic vs pessimistic locking.
3. **Kafka & Event-Driven Architecture**: How do you guarantee idempotency when processing payment webhooks?

If you have questions or want a mock feedback session on your system design resume, leave a comment below!`,
    postType: "GENERAL_DISCUSSION" as const,
    tags: ["InterviewTips", "bKash", "FinTech", "SystemDesign", "AlumniAdvice"],
    comments: [
      {
        authorEmail: "b220305009@cse.jnu.ac.bd",
        content: "Bhaiya, thank you so much for this goldmine! For the concurrency round, do interviewers focus more on Java-specific APIs or general algorithmic race condition prevention?",
      },
      {
        authorEmail: "tariqul.islam.alumni@bkash.com",
        content: "Great question Sajib! First 15 minutes is pure concepts (deadlock avoidance, memory model). Then we ask you to live-code a small thread-safe bounded buffer or wallet debit service.",
      },
      {
        authorEmail: "tanvir.ahmed@cse.jnu.ac.bd",
        content: "Bookmarking this! The idempotency tip with Kafka is crucial — definitely worth emphasizing unique transaction reference IDs.",
      },
    ],
  },
  {
    authorEmail: "b220305009@cse.jnu.ac.bd",
    title: "Cracked My First Cloud Internship — Full Journey & Preparation Roadmap",
    content: `Alhamdulillah! Today I received my formal offer letter for the Cloud Engineering Internship! 

Coming from JnU CSE, here is the exact 6-month roadmap that made the difference:
• **Month 1-2**: Mastered TypeScript & Next.js App Router deeply, focusing on server-side streaming and zero-layout-shift UI.
• **Month 3**: Built 2 full-scale capstone projects with PostgreSQL + Prisma instead of toy tutorial apps.
• **Month 4**: Dedicated 2 hours every evening to LeetCode Top 150 (focused on sliding window, BFS/DFS, and dynamic programming).
• **Month 5-6**: Cleaned up my GitHub, added architectural diagrams to READMEs, and got referrals through UniCareer alumni.

To everyone applying this cycle: keep building authentic projects! The campus community has your back.`,
    postType: "ACHIEVEMENT" as const,
    tags: ["SuccessStory", "Internship", "Cloud", "Motivation", "JnU_CSE"],
    comments: [
      {
        authorEmail: "nusrat.jahan@swe.jnu.ac.bd",
        content: "Huge congratulations Sajib! Truly well deserved. Your persistence in competitive programming and clean code architecture always stood out!",
      },
      {
        authorEmail: "sadia.afrin.alumni@brainstation-23.com",
        content: "Proud of you Sajib! As alumni, seeing current students excel and land top positions brings immense joy. Keep aiming higher!",
      },
      {
        authorEmail: "kazi.fahim@cse.jnu.ac.bd",
        content: "Inspiring! Following your roadmap for the upcoming summer internship cycle bhaiya.",
      },
    ],
  },
  {
    authorEmail: "sadia.afrin.alumni@brainstation-23.com",
    title: "Brain Station 23 is Hiring Trainee Software Engineers — Direct Alumni Referrals",
    content: `Hello JnU engineers! Brain Station 23 is actively hiring for the upcoming Trainee Software Engineer batch across:
• **.NET & Enterprise Cloud**
• **Node.js / React Full-Stack**
• **Python & GenAI Solutions**

**Eligibility**: 2024 / 2025 graduates from CSE/SWE with a strong foundation in OOP, SQL, and clean code principles. CGPA >= 3.25.

If you have a live GitHub portfolio and your UniCareer profile is verified, drop a comment or connect with me. I will directly refer qualified candidates to our HR talent acquisition team!`,
    postType: "JOB_ANNOUNCEMENT" as const,
    tags: ["BrainStation23", "Referral", "Hiring", "FresherJobs", "AlumniReferral"],
    comments: [
      {
        authorEmail: "tanvir.ahmed@cse.jnu.ac.bd",
        content: "Apu, I have sent a connection request with my portfolio link. My focus is on backend microservices with Go & PostgreSQL. Would love an opportunity to interview!",
      },
      {
        authorEmail: "sadia.afrin.alumni@brainstation-23.com",
        content: "Reviewed your profile Tanvir — your distributed Raft project is exceptional! Submitted your referral internally just now.",
      },
    ],
  },
  {
    authorEmail: "tanvir.ahmed@cse.jnu.ac.bd",
    title: "Seeking Alumni Referral / Advice for Backend Engineering at Chaldal / ShopUp",
    content: `Hello respected alumni! I am a graduating senior from JnU CSE (CGPA 3.91). 

I have built distributed systems in Go, designed Kafka event-streaming pipelines, and placed in the top 10% in national hackathons. I am preparing to apply for backend engineering roles at Chaldal and ShopUp.

Would any alumni currently at Chaldal or ShopUp be open to a 10-minute resume review or offering a referral? My profile and projects are fully updated on UniCareer. Thank you!`,
    postType: "REFERRAL_REQUEST" as const,
    tags: ["ReferralRequest", "Chaldal", "ShopUp", "Backend", "GraduatingSenior"],
    comments: [
      {
        authorEmail: "alamin.hossain.alumni@chaldal.com",
        content: "Hey Tanvir! I am at Chaldal engineering. Send me your resume link via connection request — our team is currently expanding our backend microservices fleet.",
      },
      {
        authorEmail: "tanvir.ahmed@cse.jnu.ac.bd",
        content: "Thank you so much Al-Amin bhaiya! Sending it right away.",
      },
    ],
  },
  {
    authorEmail: "mahfuzur.rahman.alumni@therapbd.com",
    title: "Therap (BD) Written Assessment Guide: Core Java, OOP & SQL Questions",
    content: `Every semester, dozens of JnU students take the Therap written exam. Here is how to pass on your first attempt:

1. **OOP Scenario Design**: They will give you an ambiguous real-world prompt (e.g. Hospital Patient Billing System or Car Rental Fleet) and evaluate your class hierarchy, interface segregation, and DRY compliance.
2. **Complex SQL Joins**: Expect 3-table joins with GROUP BY, HAVING, and correlated subqueries. Practice finding the 2nd highest salary or aggregate orders per customer.
3. **Java Memory & Collections**: Difference between ArrayList and LinkedList, HashMap collision resolution (linked list to red-black tree in Java 8), and String immutability.

Don't panic on the syntax — focus on sound object-oriented logic and indentation!`,
    postType: "GENERAL_DISCUSSION" as const,
    tags: ["Therap", "ExamPrep", "Java", "OOP", "Database"],
    comments: [
      {
        authorEmail: "mehedi.rifat@eee.jnu.ac.bd",
        content: "Mahfuz bhaiya, does Therap accept EEE graduates who have strong software & Java problem-solving credentials?",
      },
      {
        authorEmail: "mahfuzur.rahman.alumni@therapbd.com",
        content: "Yes Mehedi! Several top performers at Therap come from EEE and Applied Physics backgrounds. As long as you pass the written test and technical interview, department is no barrier.",
      },
    ],
  },
  {
    authorEmail: "farhana.yesmin.alumni@samsung.com",
    title: "Samsung R&D Coding Test 3-Hour Breakdown (Advanced Algorithms & Graphs)",
    content: `For juniors preparing for Samsung R&D Institute Bangladesh (SRBD) campus recruitments:

The SRBD coding test is strictly 3 hours for 1 problem, but with a massive test suite (50 test cases, tight time & memory constraints). 

Common archetypes:
• **BFS / DFS with State Bitmasks** (e.g. collecting gems in a grid with obstacles)
• **Branch and Bound / Pruning Recursion**
• **Topological Sorting with Cycle Detection**

*Key tip*: You cannot use STL in the official on-site test! You must know how to implement your own Queue, Stack, and Graph adjacency lists in standard C++. Practice writing them from scratch!`,
    postType: "GENERAL_DISCUSSION" as const,
    tags: ["Samsung", "SRBD", "Algorithms", "CompetitiveProgramming", "CPlusPlus"],
    comments: [
      {
        authorEmail: "b220305009@cse.jnu.ac.bd",
        content: "Implementing Queue and Stack from scratch without STL is the best advice! I failed my first mock test because of an off-by-one pointer in my custom circular queue.",
      },
      {
        authorEmail: "farhana.yesmin.alumni@samsung.com",
        content: "Exactly Sajib! Keep templates of your custom array-based queue and stack handy and practice writing them in under 3 minutes.",
      },
    ],
  },
  {
    authorEmail: "kazi.fahim@cse.jnu.ac.bd",
    title: "Organizing JnU Web Dev Hackathon & Showcase — Looking for Project Entries!",
    content: `Hey fellow students! The JnU Computer Club is organizing an intra-campus Web & Mobile Innovation Sprint next month!

Categories:
1. Campus Productivity & Academic Utilities
2. AI-Powered Educational Tools
3. FinTech & Micro-Merchant Solutions

Prizes will be sponsored by alumni tech networks with interview fast-tracks for the winning teams. Drop a comment below if you are looking for team members or mentors!`,
    postType: "GENERAL_DISCUSSION" as const,
    tags: ["JnU_Events", "Hackathon", "WebDev", "CampusLife"],
    comments: [
      {
        authorEmail: "nusrat.jahan@swe.jnu.ac.bd",
        content: "Count the Software Engineering department in! We have 3 capstone teams ready to showcase our healthcare and campus navigation apps.",
      },
    ],
  },
  {
    authorEmail: "anika.tabassum@stat.jnu.ac.bd",
    title: "Research Paper Accepted at IEEE International Conference on Big Data!",
    content: `Delighted to share that our research paper titled 'Predictive Modeling of Urban Traffic Congestion Using Spatial-Temporal Graph Neural Networks' has been accepted for oral presentation at IEEE BigData 2026!

Special gratitude to our department professors and alumni mentors who guided our feature engineering and baseline benchmarking. 

If any 1st or 2nd year students want to get started with machine learning research at JnU, feel free to reach out — happy to share dataset resources and reading lists!`,
    postType: "ACHIEVEMENT" as const,
    tags: ["Research", "IEEE", "DataScience", "MachineLearning", "JnU_Pride"],
    comments: [
      {
        authorEmail: "b220305009@cse.jnu.ac.bd",
        content: "Incredible achievement Anika! Spatial-temporal graph neural networks are cutting edge. Congratulations!",
      },
      {
        authorEmail: "sadia.afrin.alumni@brainstation-23.com",
        content: "Outstanding work! Getting published in IEEE BigData as an undergrad is a testament to rigorous dedication.",
      },
    ],
  },
  {
    authorEmail: "kazi.nahian.alumni@tigerit.com",
    title: "Why Low-Level Systems Programming (C/C++) is Becoming a Superpower in 2026",
    content: `While most junior developers are rushing into generic Python wrappers, high-performance computing in Dhaka is facing a massive shortage of C++ and systems developers.

At TigerIT and across biometrics/security firms, we build engines that process millions of high-resolution biometric templates in milliseconds. You need to understand:
• Cache locality and memory alignment
• SIMD vectorization (AVX2/AVX-512)
• Virtual memory paging and avoiding heap fragmentation

Don't neglect your OS and Computer Architecture courses at JnU — they pay off tenfold in your senior engineering career!`,
    postType: "GENERAL_DISCUSSION" as const,
    tags: ["CPlusPlus", "SystemsProgramming", "TigerIT", "CareerGuidance"],
    comments: [
      {
        authorEmail: "mehedi.rifat@eee.jnu.ac.bd",
        content: "This hits right home! In EEE, we work closely with low-level hardware memory registers, and seeing it applied to biometric security is fascinating.",
      },
    ],
  },
  {
    authorEmail: "ayesha.siddiqua@mkt.jnu.ac.bd",
    title: "Tech Product Management: A Bridge for Business & Engineering Students at JnU",
    content: `A lot of students ask whether business graduates can thrive in Dhaka's tech startup ecosystem. Absolutely!

As Product Managers and Growth Analysts, tech companies in Bangladesh need people who can:
• Translate user pain points into clear PRDs (Product Requirement Documents)
• Understand basic API request-response contracts without writing code
• Run A/B tests with statistical confidence intervals

To CSE students: learn basic product empathy. To BBA students: don't fear SQL and database schemas. The bridge between both is where high-growth careers happen!`,
    postType: "GENERAL_DISCUSSION" as const,
    tags: ["ProductManagement", "BBA", "CareerAdvice", "CrossDiscipline"],
    comments: [
      {
        authorEmail: "nusrat.jahan@swe.jnu.ac.bd",
        content: "100% agreed! In our SWE software engineering lifecycle course, writing clear user stories and acceptance criteria saved us hundreds of hours of rework.",
      },
    ],
  },
  {
    authorEmail: "farhan.ishraq@swe.jnu.ac.bd",
    title: "Dockerized Our Campus Student Portal: CI/CD Pipeline Case Study",
    content: `Wanted to share a mini DevOps case study! In our Software Engineering lab, we converted our monolithic team project into a multi-container Docker Compose setup with GitHub Actions automated testing.

Key improvements:
• Reduced developer onboarding time from 2 hours to 1 command ('docker compose up')
• Unit tests run on every Pull Request with PostgreSQL test containers
• Automatic preview deployments on Vercel

Check out the workflow template on my GitHub: https://github.com/farhan-ishraq-cloud/jnu-ci-cd-starter`,
    postType: "GENERAL_DISCUSSION" as const,
    tags: ["DevOps", "Docker", "CICD", "SWE_Lab", "Productivity"],
    comments: [
      {
        authorEmail: "b220305009@cse.jnu.ac.bd",
        content: "Bookmarked! Running PostgreSQL in test containers with GitHub Actions avoids so many database driver mismatch issues.",
      },
    ],
  },
  {
    authorEmail: "nusrat.jahan@swe.jnu.ac.bd",
    title: "Seeking Mock Technical Interviewer for Mobile Frontend (React Native)",
    content: `Hello alumni community! I have an upcoming technical screening for a Mobile Application Developer role. 

Topics include React Native performance optimization, Redux Toolkit state persistence, and native bridging with Android.

Would any alumni experienced in mobile engineering be willing to spare 30 minutes for a mock interview this weekend? Deeply grateful for any guidance!`,
    postType: "REFERRAL_REQUEST" as const,
    tags: ["MockInterview", "ReactNative", "MobileDev", "SWE"],
    comments: [
      {
        authorEmail: "alamin.hossain.alumni@chaldal.com",
        content: "Hey Nusrat! I can do a mock session this Saturday evening. We can focus on list virtualization, memory leaks, and bridge serialization. Connect with me on UniCareer!",
      },
      {
        authorEmail: "nusrat.jahan@swe.jnu.ac.bd",
        content: "Thank you so much Al-Amin bhaiya! Sending connection request right away.",
      },
    ],
  },
];

// =========================================================================
// RUN MASTER SEEDING
// =========================================================================
async function main() {
  console.log("🌊 Flooding UniCareer Community with authentic Jagannath University data...");

  const COMMON_PASSWORD = "Password123!";
  const passwordHash = await hashPassword(COMMON_PASSWORD);

  // 1. Seed realistic users
  const createdUserMap = new Map<string, string>(); // email -> userId

  for (const member of REAL_MEMBERS) {
    const user = await prisma.user.upsert({
      where: { email: member.email },
      update: {
        name: member.name,
        membershipType: member.membershipType,
        systemRole: "MEMBER",
        accountStatus: "ACTIVE",
        verificationStatus: member.verificationStatus,
        emailVerified: true,
        canPostOpportunities: member.membershipType === "ALUMNI",
        image: member.image,
      },
      create: {
        name: member.name,
        email: member.email,
        membershipType: member.membershipType,
        systemRole: "MEMBER",
        accountStatus: "ACTIVE",
        verificationStatus: member.verificationStatus,
        emailVerified: true,
        canPostOpportunities: member.membershipType === "ALUMNI",
        image: member.image,
      },
    });

    createdUserMap.set(member.email, user.id);

    // Upsert credential account for login
    const existingAccount = await prisma.account.findFirst({
      where: { userId: user.id, providerId: "credential" },
    });

    if (existingAccount) {
      await prisma.account.update({
        where: { id: existingAccount.id },
        data: { password: passwordHash },
      });
    } else {
      await prisma.account.create({
        data: {
          userId: user.id,
          accountId: user.email,
          providerId: "credential",
          password: passwordHash,
        },
      });
    }

    // Upsert full Profile
    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        studentId: member.studentId,
        department: member.department,
        academicYear: (member as any).academicYear || null,
        graduationYear: member.graduationYear,
        degree: (member as any).degree || null,
        currentCgpa: (member as any).currentCgpa || null,
        isCgpaVerified: Boolean((member as any).currentCgpa),
        company: (member as any).company || null,
        designation: (member as any).designation || null,
        headline: member.headline,
        bio: member.bio,
        skills: member.skills,
        interests: member.interests,
        githubUrl: (member as any).githubUrl || null,
        linkedinUrl: (member as any).linkedinUrl || null,
        isOnboarded: true,
      },
      create: {
        userId: user.id,
        studentId: member.studentId,
        department: member.department,
        academicYear: (member as any).academicYear || null,
        graduationYear: member.graduationYear,
        degree: (member as any).degree || null,
        currentCgpa: (member as any).currentCgpa || null,
        isCgpaVerified: Boolean((member as any).currentCgpa),
        company: (member as any).company || null,
        designation: (member as any).designation || null,
        headline: member.headline,
        bio: member.bio,
        skills: member.skills,
        interests: member.interests,
        githubUrl: (member as any).githubUrl || null,
        linkedinUrl: (member as any).linkedinUrl || null,
        isOnboarded: true,
      },
    });

    // Also add verified membership request record
    const existingReq = await prisma.membershipRequest.findFirst({
      where: { userId: user.id },
    });

    if (!existingReq) {
      await prisma.membershipRequest.create({
        data: {
          userId: user.id,
          membershipType: member.membershipType,
          status: "APPROVED",
          institutionalId: member.studentId,
          department: member.department,
          graduationYear: member.graduationYear,
          connectionNote: `Verified ${member.membershipType} dossier on UniCareer.`,
        },
      });
    }
  }

  console.log(`✅ Seeded ${REAL_MEMBERS.length} realistic JnU students and alumni with credentials.`);

  // 2. Seed Pending Verification Requests in Admin Queue
  for (const pending of PENDING_VERIFICATION_REQUESTS) {
    const user = await prisma.user.upsert({
      where: { email: pending.email },
      update: {
        name: pending.name,
        membershipType: pending.membershipType,
        accountStatus: "ACTIVE",
        verificationStatus: "PENDING",
        emailVerified: true,
      },
      create: {
        name: pending.name,
        email: pending.email,
        membershipType: pending.membershipType,
        accountStatus: "ACTIVE",
        verificationStatus: "PENDING",
        emailVerified: true,
      },
    });

    createdUserMap.set(pending.email, user.id);

    // Profile
    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        studentId: pending.studentId,
        department: pending.department,
        academicYear: pending.academicYear || null,
        graduationYear: pending.graduationYear,
        company: (pending as any).organization || null,
        designation: (pending as any).designation || null,
      },
      create: {
        userId: user.id,
        studentId: pending.studentId,
        department: pending.department,
        academicYear: pending.academicYear || null,
        graduationYear: pending.graduationYear,
        company: (pending as any).organization || null,
        designation: (pending as any).designation || null,
      },
    });

    // Membership Request awaiting Admin decision
    const existingReq = await prisma.membershipRequest.findFirst({
      where: { userId: user.id },
    });

    if (!existingReq) {
      await prisma.membershipRequest.create({
        data: {
          userId: user.id,
          membershipType: pending.membershipType,
          status: "PENDING",
          institutionalId: pending.studentId,
          department: pending.department,
          academicYear: pending.academicYear || null,
          graduationYear: pending.graduationYear,
          organization: (pending as any).organization || null,
          designation: (pending as any).designation || null,
          proofDetails: pending.proofDetails,
          connectionNote: pending.connectionNote,
        },
      });
    }
  }

  console.log(`✅ Seeded ${PENDING_VERIFICATION_REQUESTS.length} active pending verification dossiers for Admin panel.`);

  // 3. Seed Realistic Community Feed Posts, Comments & Reactions
  for (const postData of REAL_POSTS) {
    const authorId = createdUserMap.get(postData.authorEmail);
    if (!authorId) continue;

    // Check if post already exists
    const existingPost = await prisma.post.findFirst({
      where: { authorId, title: postData.title },
    });

    let postId: string;

    if (!existingPost) {
      const newPost = await prisma.post.create({
        data: {
          authorId,
          title: postData.title,
          content: postData.content,
          postType: postData.postType,
          tags: postData.tags,
          likesCount: postData.comments.length * 4 + 7,
          commentsCount: postData.comments.length,
          viewsCount: postData.comments.length * 35 + 120,
          status: "ACTIVE",
          visibility: "PUBLIC",
        },
      });
      postId = newPost.id;
    } else {
      postId = existingPost.id;
    }

    // Seed threaded comments
    for (const commentData of postData.comments) {
      const commenterId = createdUserMap.get(commentData.authorEmail);
      if (!commenterId) continue;

      const existingComment = await prisma.comment.findFirst({
        where: { postId, authorId: commenterId, content: commentData.content },
      });

      if (!existingComment) {
        await prisma.comment.create({
          data: {
            postId,
            authorId: commenterId,
            content: commentData.content,
            status: "ACTIVE",
            likesCount: 3,
          },
        });
      }
    }

    // Seed reactions
    for (const member of REAL_MEMBERS.slice(0, 5)) {
      const reactorId = createdUserMap.get(member.email);
      if (!reactorId) continue;

      await prisma.postReaction.upsert({
        where: {
          postId_userId: {
            postId,
            userId: reactorId,
          },
        },
        update: { reactionType: "LIKE" },
        create: {
          postId,
          userId: reactorId,
          reactionType: "LIKE",
        },
      }).catch(() => {});
    }
  }

  console.log(`✅ Seeded ${REAL_POSTS.length} rich community discussions with authentic comments & reactions.`);
  console.log("🎉 Master database flood completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
