import { prisma } from "../lib/prisma";
import { hashPassword } from "better-auth/crypto";

// =========================================================================
// 1. CANONICAL DEPARTMENTS
// =========================================================================
const CANONICAL_DEPARTMENTS = [
  { code: "CSE", name: "Computer Science & Engineering", faculty: "Faculty of Science" },
  { code: "EEE", name: "Electrical & Electronic Engineering", faculty: "Faculty of Science" },
  { code: "SWE", name: "Software Engineering", faculty: "Faculty of Science" },
  { code: "MATH", name: "Mathematics", faculty: "Faculty of Science" },
  { code: "STAT", name: "Statistics", faculty: "Faculty of Science" },
  { code: "PHY", name: "Physics", faculty: "Faculty of Science" },
  { code: "CHEM", name: "Chemistry", faculty: "Faculty of Science" },
  { code: "BBA-FIN", name: "Finance & Banking", faculty: "Faculty of Business Studies" },
  { code: "BBA-MKT", name: "Marketing", faculty: "Faculty of Business Studies" },
  { code: "BBA-AIS", name: "Accounting & Information Systems", faculty: "Faculty of Business Studies" },
  { code: "BBA-MGT", name: "Management Studies", faculty: "Faculty of Business Studies" },
  { code: "ENG", name: "English Language & Literature", faculty: "Faculty of Arts" },
  { code: "LAW", name: "Law & Justice", faculty: "Faculty of Law" },
  { code: "ECON", name: "Economics", faculty: "Faculty of Social Sciences" },
  { code: "PHR", name: "Pharmacy", faculty: "Faculty of Life & Earth Sciences" },
  { code: "MIC", name: "Microbiology", faculty: "Faculty of Life & Earth Sciences" },
];

async function main() {
  console.log("🌱 Starting UniCareer Master Platform Database Seeding...");

  // 1. Seed Departments
  for (const dept of CANONICAL_DEPARTMENTS) {
    await prisma.department.upsert({
      where: { code: dept.code },
      update: { name: dept.name, faculty: dept.faculty },
      create: dept,
    });
  }
  console.log(`✅ Seeded ${CANONICAL_DEPARTMENTS.length} canonical university departments.`);

  // Common password for all seeded test accounts
  const COMMON_PASSWORD = "Password123!";
  const passwordHash = await hashPassword(COMMON_PASSWORD);

  // Helper to upsert a user + account + profile
  async function seedAccount({
    email,
    name,
    membershipType,
    systemRole = "MEMBER" as const,
    canPostOpportunities = false,
    canReviewApplicants = false,
    image,
    profileData,
  }: {
    email: string;
    name: string;
    membershipType: "STUDENT" | "ALUMNI" | "FACULTY" | "STAFF" | "EMPLOYER" | "EXTERNAL_CONNECTION";
    systemRole?: "MEMBER" | "ADMIN";
    canPostOpportunities?: boolean;
    canReviewApplicants?: boolean;
    image?: string;
    profileData: any;
  }) {
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name,
        membershipType,
        systemRole,
        accountStatus: "ACTIVE",
        verificationStatus: "VERIFIED",
        emailVerified: true,
        canPostOpportunities,
        canReviewApplicants,
        verifiedAt: new Date(),
        image: image || null,
      },
      create: {
        email,
        name,
        membershipType,
        systemRole,
        accountStatus: "ACTIVE",
        verificationStatus: "VERIFIED",
        emailVerified: true,
        canPostOpportunities,
        canReviewApplicants,
        verifiedAt: new Date(),
        image: image || null,
      },
    });

    // Upsert Better Auth credential account
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
          accountId: user.id,
          providerId: "credential",
          userId: user.id,
          password: passwordHash,
        },
      });
    }

    // Upsert Profile
    await prisma.profile.upsert({
      where: { userId: user.id },
      update: profileData,
      create: {
        userId: user.id,
        ...profileData,
      },
    });

    return user;
  }

  // =========================================================================
  // 2. SEED THE 7 CORE ACCOUNTS
  // =========================================================================
  console.log("👤 Seeding 7 primary persona accounts (1 Admin + 6 Members)...");

  // Account 1: Platform Admin
  const adminUser = await seedAccount({
    email: "admin@unicareer.edu",
    name: "Dean Arthur Vance",
    membershipType: "STAFF",
    systemRole: "ADMIN",
    canPostOpportunities: true,
    canReviewApplicants: true,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    profileData: {
      headline: "Dean of Academic Career Services & University Relations",
      bio: "Dedicated to building high-trust career pathways between university scholars, research laboratories, and industry partners.",
      department: "Computer Science & Engineering",
      designation: "Dean of Student Affairs & Career Services",
      company: "University Career Services",
      skills: ["Academic Leadership", "Higher Education Policy", "Career Counseling", "Institutional Partnerships"],
      interests: ["Higher Ed Tech", "Industry Mentorship", "Career Readiness"],
      showEmail: true,
    },
  });

  // Account 2: Student 1 (Senior CS, High CGPA, Aspiring Cloud/Full-Stack)
  const student1 = await seedAccount({
    email: "farhan.student@unicareer.edu",
    name: "Farhan Ahmed",
    membershipType: "STUDENT",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
    profileData: {
      headline: "Senior CS Scholar | Distributed Systems & Full-Stack Cloud Engineer",
      bio: "Undergraduate senior with extensive experience in Next.js, Go, and PostgreSQL. Dean's Honor Roll recipient. Passionate about high-throughput microservices and cloud infrastructure.",
      department: "Computer Science & Engineering",
      studentId: "STU-2023-0142",
      academicYear: "4th Year",
      degree: "B.Sc. in Computer Science & Engineering",
      graduationYear: 2027,
      currentCgpa: 3.88,
      skills: ["TypeScript", "Next.js", "React", "PostgreSQL", "Docker", "Go", "Node.js", "Python"],
      interests: ["Distributed Systems", "Cloud Architecture", "Database Internals", "Open Source"],
      linkedinUrl: "https://linkedin.com/in/farhan-ahmed-dev",
      githubUrl: "https://github.com/farhan-ahmed-cloud",
      websiteUrl: "https://farhan-ahmed.dev",
      showEmail: true,
      projects: [
        {
          id: "proj-1",
          title: "Distributed KV Store",
          description: "Raft consensus implementation in Go with gRPC streaming replication and persistent disk storage.",
          link: "https://github.com/farhan-ahmed-cloud/raft-kv",
          techStack: ["Go", "gRPC", "Raft", "Docker"],
        },
        {
          id: "proj-2",
          title: "Next.js Campus Portal",
          description: "High-performance collaborative portal featuring live SSR caching and optimistic UI mutations.",
          link: "https://github.com/farhan-ahmed-cloud/campus-portal",
          techStack: ["Next.js 16", "React 19", "PostgreSQL", "Tailwind CSS"],
        },
      ],
      experience: [
        {
          id: "exp-1",
          company: "Optimizely Hub",
          role: "Software Engineering Intern",
          period: "Summer 2025 (3 Months)",
          description: "Engineered real-time telemetry ingestion pipeline handling 100K events/second with Apache Kafka and Go.",
        },
      ],
    },
  });

  // Account 3: Student 2 (Junior Software Engineering, Machine Learning & Algorithms)
  const student2 = await seedAccount({
    email: "nusrat.student@unicareer.edu",
    name: "Nusrat Jahan",
    membershipType: "STUDENT",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
    profileData: {
      headline: "Junior SWE Student | Applied AI & Competitive Programmer",
      bio: "Software Engineering 3rd year undergraduate. Top 5% in National Collegiate Programming Contest. Active researcher in natural language processing and computer vision.",
      department: "Software Engineering",
      studentId: "STU-2024-0891",
      academicYear: "3rd Year",
      degree: "B.Sc. in Software Engineering",
      graduationYear: 2028,
      currentCgpa: 3.72,
      skills: ["Python", "Machine Learning", "TensorFlow", "C++", "Data Structures", "FastAPI", "Git", "SQL"],
      interests: ["Deep Learning", "Competitive Programming", "Robotics", "Algorithm Design"],
      linkedinUrl: "https://linkedin.com/in/nusrat-jahan-ai",
      githubUrl: "https://github.com/nusrat-jahan-swe",
      showEmail: true,
      projects: [
        {
          id: "proj-3",
          title: "Bengali NLP Semantic Classifier",
          description: "Fine-tuned transformer model classifying complex linguistic sentiment in Bengali literature.",
          link: "https://github.com/nusrat-jahan-swe/bengali-nlp",
          techStack: ["Python", "PyTorch", "Transformers", "FastAPI"],
        },
      ],
    },
  });

  // Account 4: Alumni 1 (Senior Software Engineer at Databricks)
  const alumni1 = await seedAccount({
    email: "tariqul.alumni@unicareer.edu",
    name: "Tariqul Islam",
    membershipType: "ALUMNI",
    canPostOpportunities: true,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    profileData: {
      headline: "Senior Software Engineer @ Databricks | Distributed Cloud Runtimes",
      bio: "Proud alumnus (Class of 2021). Leading serverless compute infrastructure at Databricks. Always happy to mentor university juniors, review code, and provide internal job referrals.",
      department: "Computer Science & Engineering",
      graduationYear: 2021,
      degree: "B.Sc. in Computer Science & Engineering",
      company: "Databricks",
      designation: "Senior Software Engineer",
      skills: ["Go", "Kubernetes", "Distributed Systems", "Apache Kafka", "Cloud Architecture", "PostgreSQL"],
      interests: ["System Design", "Mentorship", "Alumni Networking", "Cloud Infrastructure"],
      linkedinUrl: "https://linkedin.com/in/tariqul-islam-cloud",
      githubUrl: "https://github.com/tariqul-databricks",
      showEmail: true,
    },
  });

  // Account 5: Alumni 2 (Lead Product Manager at bKash)
  const alumni2 = await seedAccount({
    email: "sabrina.alumni@unicareer.edu",
    name: "Sabrina Rahman",
    membershipType: "ALUMNI",
    canPostOpportunities: true,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    profileData: {
      headline: "Lead Product Manager @ bKash Limited | FinTech Innovation",
      bio: "BBA Finance Alumna (Class of 2020). Leading merchant payment experience and QR ecosystem serving millions. Passionate about empowering women in product management and fintech.",
      department: "Finance & Banking",
      graduationYear: 2020,
      degree: "BBA in Finance & Banking",
      company: "bKash Limited",
      designation: "Lead Product Manager",
      skills: ["Product Management", "Financial Analysis", "FinTech", "SQL", "Agile Leadership", "User Research"],
      interests: ["Product Strategy", "FinTech Disruptions", "Career Mentoring"],
      linkedinUrl: "https://linkedin.com/in/sabrina-rahman-fintech",
      showEmail: true,
    },
  });

  // Account 6: Employer / Recruiter (Vercel Platform Recruiting Lead)
  const employerUser = await seedAccount({
    email: "sarah.recruiter@vercel.com",
    name: "Sarah Jenkins",
    membershipType: "EMPLOYER",
    canPostOpportunities: true,
    canReviewApplicants: true,
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
    profileData: {
      headline: "Global University Recruiting Lead @ Vercel",
      bio: "Passionate about finding exceptional engineering and product talent globally. Partnering with elite university computer science programs for summer internships and graduate rotations.",
      company: "Vercel",
      designation: "Global University Recruiting Lead",
      skills: ["Technical Recruiting", "Talent Acquisition", "University Partnerships", "Career Strategy"],
      interests: ["Frontend Engineering Talent", "Campus Recruiting", "Diversity in Tech"],
      linkedinUrl: "https://linkedin.com/in/sarah-jenkins-talent",
      showEmail: true,
    },
  });

  // Account 7: Faculty / Academic Advisor
  const facultyUser = await seedAccount({
    email: "mahbub.faculty@unicareer.edu",
    name: "Dr. Mahbubur Rahman",
    membershipType: "FACULTY",
    canPostOpportunities: true,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    profileData: {
      headline: "Associate Professor & Undergraduate Program Director @ Dept of CSE",
      bio: "20+ years of academic research and industry consulting in computer networks and software architecture. Faculty advisor for ACM Student Chapter and University Career Liaison.",
      department: "Computer Science & Engineering",
      designation: "Associate Professor & Director of Undergraduate Studies",
      company: "University Academic Faculty",
      skills: ["Academic Mentoring", "Computer Networks", "Curriculum Development", "Software Architecture"],
      interests: ["Research Fellowships", "Industry-Academia Collaboration", "Student Innovation"],
      showEmail: true,
    },
  });

  console.log("✅ Seeded 7 primary accounts with login credentials: (Password: Password123!)");

  // =========================================================================
  // 3. SEED COMPANIES
  // =========================================================================
  console.log("🏢 Seeding industry corporate profiles...");

  const companiesData = [
    {
      name: "Vercel",
      slug: "vercel",
      description: "Frontend cloud platform and creator of Next.js, empowering developers to build fast, resilient global web applications.",
      website: "https://vercel.com",
      industry: "Cloud & DevTools",
      location: "San Francisco, CA / Remote",
      logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
      createdById: employerUser.id,
      isVerified: true,
    },
    {
      name: "Optimizely",
      slug: "optimizely",
      description: "Leading digital experience and experimentation software company with core high-scale engineering hubs across Dhaka, Austin, and Stockholm.",
      website: "https://optimizely.com",
      industry: "Software & Cloud Services",
      location: "Gulshan-2, Dhaka",
      logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&auto=format&fit=crop&q=80",
      createdById: adminUser.id,
      isVerified: true,
    },
    {
      name: "Databricks",
      slug: "databricks",
      description: "The data and AI company. More than 10,000 organizations worldwide rely on the Databricks Data Intelligence Platform to unify data, analytics, and AI.",
      website: "https://databricks.com",
      industry: "Big Data & AI",
      location: "San Francisco, CA / Remote",
      logo: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&auto=format&fit=crop&q=80",
      createdById: adminUser.id,
      isVerified: true,
    },
    {
      name: "bKash Limited",
      slug: "bkash-limited",
      description: "The largest mobile financial service provider in Bangladesh, serving over 70 million customers with resilient, high-volume transactional infrastructure.",
      website: "https://bkash.com",
      industry: "Financial Technology",
      location: "Dhaka, Bangladesh",
      logo: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=200&auto=format&fit=crop&q=80",
      createdById: adminUser.id,
      isVerified: true,
    },
    {
      name: "Brain Station 23",
      slug: "brain-station-23",
      description: "Premier enterprise software and cloud exporter from Bangladesh, building fintech, healthcare, and enterprise cloud solutions for Europe and North America.",
      website: "https://brainstation-23.com",
      industry: "Enterprise Software",
      location: "Mohakhali DOHS, Dhaka",
      logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80",
      createdById: adminUser.id,
      isVerified: true,
    },
    {
      name: "Augmedix Bangladesh",
      slug: "augmedix-bangladesh",
      description: "HealthTech pioneer transforming ambient clinician-patient conversations into structured medical records with NLP and generative AI.",
      website: "https://augmedix.com",
      industry: "HealthTech & AI",
      location: "Panthapath, Dhaka",
      logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&auto=format&fit=crop&q=80",
      createdById: adminUser.id,
      isVerified: true,
    },
  ];

  const companies: Record<string, any> = {};
  for (const c of companiesData) {
    const comp = await prisma.company.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
    companies[c.slug] = comp;
  }

  // Associate Sarah Jenkins as OWNER of Vercel
  await prisma.companyMember.upsert({
    where: {
      companyId_userId: {
        companyId: companies["vercel"].id,
        userId: employerUser.id,
      },
    },
    update: { role: "OWNER", canPostOpportunities: true, canManageCompany: true },
    create: {
      companyId: companies["vercel"].id,
      userId: employerUser.id,
      role: "OWNER",
      canPostOpportunities: true,
      canManageCompany: true,
    },
  });

  console.log(`✅ Seeded ${companiesData.length} corporate company profiles.`);

  // =========================================================================
  // 4. SEED OPPORTUNITIES (Official & Community-Shared)
  // =========================================================================
  console.log("💼 Seeding rich catalog of verified opportunities...");

  const thirtyDaysAhead = new Date(Date.now() + 30 * 86400000);
  const fortyFiveDaysAhead = new Date(Date.now() + 45 * 86400000);
  const sixtyDaysAhead = new Date(Date.now() + 60 * 86400000);
  const twoDaysAhead = new Date(Date.now() + 2 * 86400000); // Urgent deadline
  const pastDeadline = new Date(Date.now() - 5 * 86400000); // Closed

  const SEED_OPPORTUNITIES = [
    {
      title: "Frontend Engineering Intern (Summer 2027)",
      description:
        "Join Vercel's Core Framework & Dashboard engineering team. You will build user interfaces with Next.js App Router, React 19, and Tailwind CSS while collaborating with world-class engineers.\n\nKey Responsibilities:\n- Build accessible, responsive frontend components for developer telemetry.\n- Optimize core web vitals and client-side performance.\n- Contribute to open-source UI libraries and component design systems.",
      companyId: companies["vercel"].id,
      companyName: "Vercel",
      companyLogo: companies["vercel"].logo,
      type: "INTERNSHIP" as const,
      sourceType: "OFFICIAL_EMPLOYER" as const,
      status: "APPROVED" as const,
      posterId: employerUser.id,
      minCgpa: 3.3,
      minAcademicYear: "3rd Year",
      requiredSkills: ["TypeScript", "Next.js", "React", "Tailwind CSS"],
      targetDepartments: ["Computer Science & Engineering", "Software Engineering"],
      openToAllDepartments: false,
      salaryOrStipend: "$45 / hour + Remote Tech Stipend",
      location: "San Francisco, CA / Remote",
      workplaceType: "REMOTE" as const,
      applicationMethod: "INTERNAL" as const,
      deadline: fortyFiveDaysAhead,
    },
    {
      title: "Distributed Systems Software Intern",
      description:
        "Optimizely is seeking talented computer science and engineering undergraduates for our high-scale telemetry ingestion pipeline team in Dhaka. You will work on real-time event streaming systems processing billions of daily events with Go, gRPC, and Apache Kafka.\n\nQualifications:\n- Strong fundamentals in data structures, algorithms, and concurrency.\n- Hands-on project experience with Go, Docker, and SQL.\n- Excellent problem-solving and communicative skills.",
      companyId: companies["optimizely"].id,
      companyName: "Optimizely",
      companyLogo: companies["optimizely"].logo,
      type: "INTERNSHIP" as const,
      sourceType: "OFFICIAL_EMPLOYER" as const,
      status: "APPROVED" as const,
      posterId: adminUser.id,
      minCgpa: 3.25,
      minAcademicYear: "3rd Year",
      requiredSkills: ["Go", "Distributed Systems", "Docker", "gRPC", "PostgreSQL"],
      targetDepartments: ["Computer Science & Engineering", "Software Engineering"],
      openToAllDepartments: false,
      salaryOrStipend: "BDT 40,000 / month",
      location: "Gulshan-2, Dhaka",
      workplaceType: "HYBRID" as const,
      applicationMethod: "INTERNAL" as const,
      deadline: thirtyDaysAhead,
    },
    {
      title: "Junior FinTech Backend Engineer",
      description:
        "bKash core transactions engineering is recruiting junior backend engineers. You will design and implement resilient, ACID-compliant ledger and payment settlement components with zero downtime tolerance.\n\nWhat We Offer:\n- Competitive salary package with annual festival bonuses and health coverage.\n- Mentorship by senior architects running Bangladesh's largest transaction network.",
      companyId: companies["bkash-limited"].id,
      companyName: "bKash Limited",
      companyLogo: companies["bkash-limited"].logo,
      type: "FULL_TIME" as const,
      sourceType: "OFFICIAL_EMPLOYER" as const,
      status: "APPROVED" as const,
      posterId: adminUser.id,
      minCgpa: 3.4,
      minAcademicYear: "4th Year",
      requiredSkills: ["Java", "Spring Boot", "PostgreSQL", "Kafka", "Redis"],
      targetDepartments: ["Computer Science & Engineering", "Software Engineering", "Electrical & Electronic Engineering"],
      openToAllDepartments: false,
      salaryOrStipend: "BDT 75,000 - 95,000 / month",
      location: "Dhaka, Bangladesh",
      workplaceType: "ON_SITE" as const,
      applicationMethod: "INTERNAL" as const,
      deadline: twoDaysAhead, // Closing soon!
    },
    {
      title: "Enterprise Cloud & Generative AI Solutions Trainee",
      description:
        "Brain Station 23 is offering a 6-month structured training cohort with guaranteed full-time absorption for top performers. Master AWS/Azure enterprise architecture, microservices, and LLM-assisted workflows.",
      companyId: companies["brain-station-23"].id,
      companyName: "Brain Station 23",
      companyLogo: companies["brain-station-23"].logo,
      type: "INTERNSHIP" as const,
      sourceType: "OFFICIAL_EMPLOYER" as const,
      status: "APPROVED" as const,
      posterId: adminUser.id,
      minCgpa: 3.0,
      minAcademicYear: "4th Year",
      requiredSkills: ["Python", "FastAPI", "Docker", "PostgreSQL", "REST APIs"],
      targetDepartments: ["Computer Science & Engineering", "Software Engineering", "Mathematics"],
      openToAllDepartments: false,
      salaryOrStipend: "BDT 28,000 / month",
      location: "Mohakhali DOHS, Dhaka",
      workplaceType: "HYBRID" as const,
      applicationMethod: "INTERNAL" as const,
      deadline: sixtyDaysAhead,
    },
    {
      title: "Medical Natural Language Processing Research Fellow",
      description:
        "Augmedix R&D lab is recruiting student research fellows. Collaborate with physicians and AI scientists to benchmark domain-specific clinical transcription models.",
      companyId: companies["augmedix-bangladesh"].id,
      companyName: "Augmedix Bangladesh",
      companyLogo: companies["augmedix-bangladesh"].logo,
      type: "CONTRACT" as const,
      sourceType: "OFFICIAL_EMPLOYER" as const,
      status: "APPROVED" as const,
      posterId: adminUser.id,
      minCgpa: 3.5,
      requiredSkills: ["Python", "Machine Learning", "TensorFlow", "NLP"],
      targetDepartments: ["Computer Science & Engineering", "Software Engineering"],
      openToAllDepartments: false,
      salaryOrStipend: "BDT 50,000 / month + Research Grant",
      location: "Panthapath, Dhaka",
      workplaceType: "HYBRID" as const,
      applicationMethod: "INTERNAL" as const,
      deadline: fortyFiveDaysAhead,
    },
    {
      title: "Databricks Cloud Infrastructure Engineer (Lead Shared by Alumni)",
      description:
        "Exclusive community lead shared by Tariqul Islam (Class of '21). Databricks is seeking graduate software engineers for its serverless compute control plane in San Francisco. Alumnus willing to refer qualified candidates.",
      companyName: "Databricks",
      type: "FULL_TIME" as const,
      sourceType: "COMMUNITY_SHARED" as const,
      status: "APPROVED" as const,
      posterId: alumni1.id,
      requiredSkills: ["Go", "Kubernetes", "Distributed Systems", "Cloud Architecture"],
      targetDepartments: ["Computer Science & Engineering", "Software Engineering"],
      openToAllDepartments: false,
      salaryOrStipend: "$130,000 - $155,000 / year + Equity",
      location: "San Francisco, CA / Remote",
      workplaceType: "REMOTE" as const,
      applicationMethod: "EXTERNAL" as const,
      externalUrl: "https://databricks.com/company/careers/open-positions",
      deadline: sixtyDaysAhead,
    },
    {
      title: "Management Trainee — Corporate Banking & Financial Analytics",
      description:
        "Shared by Sabrina Rahman (Alumna). Elite rotational program across commercial lending, syndicated credit modeling, and treasury risk management at BRAC Bank.",
      companyName: "BRAC Bank PLC",
      type: "FULL_TIME" as const,
      sourceType: "COMMUNITY_SHARED" as const,
      status: "APPROVED" as const,
      posterId: alumni2.id,
      minCgpa: 3.2,
      requiredSkills: ["Financial Analysis", "Credit Risk", "Accounting", "Excel"],
      targetDepartments: ["Finance & Banking", "Accounting & Information Systems", "Economics"],
      openToAllDepartments: false,
      salaryOrStipend: "BDT 60,000 / month",
      location: "Motijheel, Dhaka",
      workplaceType: "ON_SITE" as const,
      applicationMethod: "EXTERNAL" as const,
      externalUrl: "https://bracbank.taleo.net/careersection/mto/jobapply",
      deadline: thirtyDaysAhead,
    },
    {
      title: "Undergraduate Computer Architecture Lab Assistant",
      description:
        "Department of CSE is recruiting 2 student teaching and lab assistants for CSE 3201 (Computer Architecture & Microprocessors) for the upcoming term.",
      companyName: "University Department of CSE",
      type: "PART_TIME" as const,
      sourceType: "OFFICIAL_EMPLOYER" as const,
      status: "APPROVED" as const,
      posterId: facultyUser.id,
      minCgpa: 3.6,
      minAcademicYear: "4th Year",
      requiredSkills: ["C++", "Assembly", "Computer Networks", "Teaching"],
      targetDepartments: ["Computer Science & Engineering"],
      openToAllDepartments: false,
      salaryOrStipend: "BDT 15,000 / month (10 hrs/week)",
      location: "Science Campus Lab 304",
      workplaceType: "ON_SITE" as const,
      applicationMethod: "INTERNAL" as const,
      deadline: twoDaysAhead,
    },
    {
      title: "Junior Data Analyst & BI Developer (Pending Review)",
      description:
        "Newly submitted posting by an external hiring partner currently undergoing registrar and administrative verification.",
      companyName: "Apex Footwear Global",
      type: "FULL_TIME" as const,
      sourceType: "COMMUNITY_SHARED" as const,
      status: "PENDING" as const, // For admin review queue!
      posterId: alumni2.id,
      requiredSkills: ["SQL", "PowerBI", "Python", "Data Analysis"],
      targetDepartments: ["Statistics", "Finance & Banking", "Economics"],
      openToAllDepartments: true,
      salaryOrStipend: "BDT 45,000 / month",
      location: "Gulshan-1, Dhaka",
      workplaceType: "HYBRID" as const,
      applicationMethod: "EXTERNAL" as const,
      externalUrl: "https://apexfootwearltd.com/careers",
      deadline: thirtyDaysAhead,
    },
    {
      title: "Systems Reliability Engineering Fellowship (Closed Cohort)",
      description:
        "Previous term's systems reliability fellowship with completed candidate roster for archiving and reporting.",
      companyId: companies["vercel"].id,
      companyName: "Vercel",
      type: "CONTRACT" as const,
      sourceType: "OFFICIAL_EMPLOYER" as const,
      status: "CLOSED" as const, // Archived / Closed
      posterId: employerUser.id,
      requiredSkills: ["Go", "Docker", "Next.js"],
      openToAllDepartments: true,
      salaryOrStipend: "$40 / hr",
      location: "Remote",
      workplaceType: "REMOTE" as const,
      applicationMethod: "INTERNAL" as const,
      deadline: pastDeadline,
    },
  ];

  const seededOpps: any[] = [];
  for (const opp of SEED_OPPORTUNITIES) {
    const existing = await prisma.opportunity.findFirst({
      where: { title: opp.title, companyName: opp.companyName },
    });

    if (existing) {
      const updated = await prisma.opportunity.update({
        where: { id: existing.id },
        data: opp,
      });
      seededOpps.push(updated);
    } else {
      const created = await prisma.opportunity.create({
        data: opp,
      });
      seededOpps.push(created);
    }
  }

  console.log(`✅ Seeded ${SEED_OPPORTUNITIES.length} diverse active, urgent, and pending opportunities.`);

  // Find key opportunities for applications
  const vercelInternOpp = seededOpps.find((o) => o.title.includes("Frontend Engineering Intern"));
  const optimizelyOpp = seededOpps.find((o) => o.title.includes("Distributed Systems Software Intern"));
  const bkashOpp = seededOpps.find((o) => o.title.includes("Junior FinTech Backend"));
  const brainStationOpp = seededOpps.find((o) => o.title.includes("Enterprise Cloud"));

  // =========================================================================
  // 5. SEED RESUMES & APPLICATIONS
  // =========================================================================
  console.log("📄 Seeding student resumes and active application pipelines...");

  // Farhan Ahmed's Resume
  const farhanResume = await prisma.resume.upsert({
    where: { storageKey: `resumes/${student1.id}/Farhan_Ahmed_SWE_Resume.pdf` },
    update: {},
    create: {
      userId: student1.id,
      fileName: "Farhan_Ahmed_SWE_Resume.pdf",
      fileSize: 184520, // 180 KB
      mimeType: "application/pdf",
      storageKey: `resumes/${student1.id}/Farhan_Ahmed_SWE_Resume.pdf`,
      isDefault: true,
    },
  });

  // Nusrat Jahan's Resume
  const nusratResume = await prisma.resume.upsert({
    where: { storageKey: `resumes/${student2.id}/Nusrat_Jahan_AI_Resume.pdf` },
    update: {},
    create: {
      userId: student2.id,
      fileName: "Nusrat_Jahan_AI_Resume.pdf",
      fileSize: 215400, // 210 KB
      mimeType: "application/pdf",
      storageKey: `resumes/${student2.id}/Nusrat_Jahan_AI_Resume.pdf`,
      isDefault: true,
    },
  });

  // Application 1: Farhan -> Vercel Frontend Intern (SHORTLISTED)
  if (vercelInternOpp) {
    const app1 = await prisma.application.upsert({
      where: {
        opportunityId_applicantId: {
          opportunityId: vercelInternOpp.id,
          applicantId: student1.id,
        },
      },
      update: {
        status: "SHORTLISTED",
        employerNotes: "Outstanding Next.js portfolio and clean GitHub projects. Invited for round 1 technical interview.",
        reviewedById: employerUser.id,
        reviewedAt: new Date(),
      },
      create: {
        opportunityId: vercelInternOpp.id,
        applicantId: student1.id,
        resumeId: farhanResume.id,
        resumeFileName: farhanResume.fileName,
        coverLetter: "I have been building full-stack applications with Next.js and React Server Components for two years. I would be honored to contribute to Vercel's mission.",
        method: "INTERNAL",
        status: "SHORTLISTED",
        employerNotes: "Outstanding Next.js portfolio and clean GitHub projects. Invited for round 1 technical interview.",
        reviewedById: employerUser.id,
        reviewedAt: new Date(),
      },
    });

    await prisma.applicationStatusHistory.create({
      data: {
        applicationId: app1.id,
        status: "SHORTLISTED",
        note: "Candidate moved to technical screen after portfolio evaluation.",
        changedById: employerUser.id,
      },
    });
  }

  // Application 2: Farhan -> Optimizely Distributed Systems (UNDER_REVIEW)
  if (optimizelyOpp) {
    await prisma.application.upsert({
      where: {
        opportunityId_applicantId: {
          opportunityId: optimizelyOpp.id,
          applicantId: student1.id,
        },
      },
      update: {
        status: "UNDER_REVIEW",
        employerNotes: "Reviewing Raft consensus KV-store implementation in Go.",
      },
      create: {
        opportunityId: optimizelyOpp.id,
        applicantId: student1.id,
        resumeId: farhanResume.id,
        resumeFileName: farhanResume.fileName,
        coverLetter: "My recent project implementing Raft consensus in Go directly aligns with Optimizely's distributed event streaming infrastructure.",
        method: "INTERNAL",
        status: "UNDER_REVIEW",
      },
    });
  }

  // Application 3: Farhan -> bKash Backend Engineer (INTERVIEW)
  if (bkashOpp) {
    const app3 = await prisma.application.upsert({
      where: {
        opportunityId_applicantId: {
          opportunityId: bkashOpp.id,
          applicantId: student1.id,
        },
      },
      update: {
        status: "INTERVIEW",
        employerNotes: "Technical architecture panel scheduled for next Tuesday at 3:00 PM.",
        reviewedById: adminUser.id,
        reviewedAt: new Date(),
      },
      create: {
        opportunityId: bkashOpp.id,
        applicantId: student1.id,
        resumeId: farhanResume.id,
        resumeFileName: farhanResume.fileName,
        coverLetter: "Passionate about high-concurrency ACID transactions and distributed databases. Seeking to contribute to national fintech rail.",
        method: "INTERNAL",
        status: "INTERVIEW",
        employerNotes: "Technical architecture panel scheduled for next Tuesday at 3:00 PM.",
        reviewedById: adminUser.id,
        reviewedAt: new Date(),
      },
    });

    await prisma.applicationStatusHistory.create({
      data: {
        applicationId: app3.id,
        status: "INTERVIEW",
        note: "System design round scheduled with core engineering panel.",
        changedById: adminUser.id,
      },
    });
  }

  // Application 4: Nusrat -> Brain Station 23 AI Trainee (SUBMITTED)
  if (brainStationOpp) {
    await prisma.application.upsert({
      where: {
        opportunityId_applicantId: {
          opportunityId: brainStationOpp.id,
          applicantId: student2.id,
        },
      },
      update: {
        status: "SUBMITTED",
      },
      create: {
        opportunityId: brainStationOpp.id,
        applicantId: student2.id,
        resumeId: nusratResume.id,
        resumeFileName: nusratResume.fileName,
        coverLetter: "Excited about deploying production transformers and microservices for international enterprise clients.",
        method: "INTERNAL",
        status: "SUBMITTED",
      },
    });
  }

  // Bookmarks for Farhan
  if (vercelInternOpp) {
    await prisma.opportunityBookmark.upsert({
      where: {
        userId_opportunityId: {
          userId: student1.id,
          opportunityId: vercelInternOpp.id,
        },
      },
      update: {},
      create: {
        userId: student1.id,
        opportunityId: vercelInternOpp.id,
      },
    });
  }

  console.log("✅ Seeded resumes, multi-stage application pipeline, and bookmarks.");

  // =========================================================================
  // 6. SEED COMMUNITY POSTS, COMMENTS & REACTIONS
  // =========================================================================
  console.log("💬 Seeding university professional community feed...");

  const post1 = await prisma.post.create({
    data: {
      authorId: facultyUser.id,
      title: "Welcome to Fall 2026 Campus Recruiting Season — A Note from Faculty",
      content:
        "Welcome scholars, alumni, and industry partners to the new recruitment cycle! Over 35 partner companies are participating this year. To our graduating seniors: focus on demonstrating authentic project ownership, clean architectural tradeoffs, and communicative clarity. Feel free to connect with our verified alumni in the directory for referral guidance.",
      postType: "CAREER_ADVICE",
      visibility: "PUBLIC",
      isPinned: true,
      tags: ["CareerAdvice", "CampusRecruitment", "CSE", "DeanMessage"],
      likesCount: 18,
      commentsCount: 3,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      authorId: alumni1.id,
      title: "How to Prepare for High-Scale Systems & Cloud Interviews",
      content:
        "Having interviewed over 50 campus candidates at Databricks and previously in cloud tech, here is the #1 gap fresh graduates have: knowing *why* a particular data store or queue was chosen.\n\nDon't just say 'I used Kafka'. Explain the throughput expectations, partitioning key strategy, and failure recovery semantics. If you want a mock review of your system design portfolio, comment below or send a connection request!",
      postType: "CAREER_ADVICE",
      visibility: "PUBLIC",
      tags: ["DistributedSystems", "SystemDesign", "InterviewTips", "Databricks"],
      likesCount: 29,
      commentsCount: 4,
    },
  });

  const post3 = await prisma.post.create({
    data: {
      authorId: employerUser.id,
      title: "Vercel Summer 2027 Engineering Internship is Officially Open!",
      content:
        "We are thrilled to launch our 2027 university engineering internship openings! Check the opportunities tab for 'Frontend Engineering Intern'. We are looking for students passionate about React 19, web performance, and developer experience. Applications submitted through the UniCareer portal receive direct review from our university talent team.",
      postType: "JOB_ANNOUNCEMENT",
      visibility: "PUBLIC",
      attachedOpportunityId: vercelInternOpp?.id || null,
      tags: ["Vercel", "Nextjs", "Frontend", "Hiring"],
      likesCount: 42,
      commentsCount: 5,
    },
  });

  const post4 = await prisma.post.create({
    data: {
      authorId: student1.id,
      title: "Raft Consensus KV-Store in Go — Open Sourced My Capstone Project!",
      content:
        "Excited to share my undergraduate capstone project: a distributed Key-Value store implementing the Raft distributed consensus protocol in Go from scratch. Handles leader election, log replication, and partition healing with 100% test coverage under chaos testing.\n\nCheck out the repo on GitHub: https://github.com/farhan-ahmed-cloud/raft-kv. Would love feedback from fellow peers and systems engineers!",
      postType: "ACHIEVEMENT",
      visibility: "PUBLIC",
      tags: ["Go", "Raft", "DistributedSystems", "OpenSource"],
      likesCount: 34,
      commentsCount: 3,
    },
  });

  const post5 = await prisma.post.create({
    data: {
      authorId: student2.id,
      title: "Seeking Alumni Referral / Advice for bKash FinTech Junior Roles",
      content:
        "Hello alumni! I am a 3rd year Software Engineering student specializing in machine learning and backend algorithms (CGPA 3.72). I am preparing to apply for the Junior FinTech Backend role at bKash. Would any alumni currently at bKash be open to reviewing my resume or sharing insights on the interview panel?",
      postType: "REFERRAL_REQUEST",
      visibility: "PUBLIC",
      tags: ["bKash", "FinTech", "ReferralRequest", "SWE"],
      likesCount: 14,
      commentsCount: 2,
    },
  });

  // Spam post for Admin Content Moderation Queue test case
  const spamPost = await prisma.post.create({
    data: {
      authorId: student2.id,
      title: "BUY CHEAP CRYPTO & ESSAY WRITING SERVICES 100% PASS GUARANTEED",
      content:
        "Contact me on telegram @cheat_exams for instant homework solutions, paid papers, and crypto investments. 100% legit no scam.",
      postType: "GENERAL_DISCUSSION",
      visibility: "PUBLIC",
      status: "ACTIVE", // Active so admin can moderate it!
      tags: ["Promo", "Spam"],
    },
  });

  // Create a ContentReport on the spam post so Admin Reports Queue is populated!
  await prisma.contentReport.create({
    data: {
      reporterId: student1.id,
      targetType: "POST",
      postId: spamPost.id,
      reason: "SPAM",
      description: "Blatant academic dishonesty and commercial spam violating university code of conduct.",
      status: "PENDING",
    },
  });

  // Comments on Post 2 (Alumni Tariqul's advice)
  const comment1 = await prisma.comment.create({
    data: {
      postId: post2.id,
      authorId: student1.id,
      content: "This advice is gold, Tariqul vai! When designing my Raft project, handling split-brain leader elections was the hardest part. Would love to connect and get your thoughts on partition recovery.",
    },
  });

  await prisma.comment.create({
    data: {
      postId: post2.id,
      authorId: alumni1.id,
      parentId: comment1.id,
      content: "Excellent work Farhan! I saw your GitHub repo — the chaos testing setup is top notch. Just accepted your connection request.",
    },
  });

  // Comments on Post 5 (Nusrat's referral request)
  await prisma.comment.create({
    data: {
      postId: post5.id,
      authorId: alumni2.id,
      content: "Hi Nusrat! I lead Product at bKash. Our engineering hiring panel values strong algorithmic fundamentals and transactional safety. Send me a referral request through the platform and I'll route it to our engineering recruiter.",
    },
  });

  // Reactions
  await prisma.postReaction.createMany({
    data: [
      { postId: post1.id, userId: student1.id, type: "INSIGHTFUL" },
      { postId: post1.id, userId: student2.id, type: "LIKE" },
      { postId: post2.id, userId: student1.id, type: "INSIGHTFUL" },
      { postId: post2.id, userId: student2.id, type: "SUPPORT" },
      { postId: post3.id, userId: student1.id, type: "CELEBRATE" },
      { postId: post3.id, userId: student2.id, type: "LIKE" },
      { postId: post4.id, userId: alumni1.id, type: "INSIGHTFUL" },
      { postId: post4.id, userId: facultyUser.id, type: "CELEBRATE" },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seeded community discussions, threaded comments, reactions, and an active moderation report.");

  // =========================================================================
  // 7. SEED NETWORKING CONNECTIONS & REFERRAL REQUESTS
  // =========================================================================
  console.log("🤝 Seeding networking connections and career referrals...");

  // Connection: Farhan <-> Tariqul (ACCEPTED)
  await prisma.connection.upsert({
    where: {
      senderId_receiverId: {
        senderId: student1.id,
        receiverId: alumni1.id,
      },
    },
    update: { status: "ACCEPTED" },
    create: {
      senderId: student1.id,
      receiverId: alumni1.id,
      status: "ACCEPTED",
    },
  });

  // Connection: Farhan <-> Sarah Jenkins (ACCEPTED)
  await prisma.connection.upsert({
    where: {
      senderId_receiverId: {
        senderId: student1.id,
        receiverId: employerUser.id,
      },
    },
    update: { status: "ACCEPTED" },
    create: {
      senderId: student1.id,
      receiverId: employerUser.id,
      status: "ACCEPTED",
    },
  });

  // Connection: Nusrat -> Sabrina (PENDING)
  await prisma.connection.upsert({
    where: {
      senderId_receiverId: {
        senderId: student2.id,
        receiverId: alumni2.id,
      },
    },
    update: { status: "PENDING" },
    create: {
      senderId: student2.id,
      receiverId: alumni2.id,
      status: "PENDING",
    },
  });

  // Referral Request 1: Farhan -> Tariqul for Databricks (ACCEPTED)
  await prisma.referralRequest.create({
    data: {
      requesterId: student1.id,
      recipientId: alumni1.id,
      companyId: companies["databricks"].id,
      companyName: "Databricks",
      roleTitle: "Cloud Infrastructure Engineer",
      message:
        "Hi Tariqul vai, I saw your post regarding distributed systems at Databricks. Having completed my Raft consensus project and maintaining a 3.88 CGPA, I would be grateful if you could refer me for the graduate cloud infrastructure opening.",
      resumeUrl: "https://farhan-ahmed.dev/resume.pdf",
      status: "ACCEPTED",
      responseNote:
        "Reviewed Farhan's portfolio and GitHub repository. Exceptional systems depth and code clarity for an undergraduate. Forwarded directly to our infrastructure talent team.",
      respondedAt: new Date(),
    },
  });

  // Referral Request 2: Nusrat -> Sabrina for bKash (PENDING)
  await prisma.referralRequest.create({
    data: {
      requesterId: student2.id,
      recipientId: alumni2.id,
      companyId: companies["bkash-limited"].id,
      companyName: "bKash Limited",
      roleTitle: "Junior FinTech Backend Engineer",
      message:
        "Dear Sabrina apu, as discussed on your community thread, I would love an introduction to the bKash engineering talent team. My competitive programming background and 3.72 CGPA reflect my dedication to high-scale algorithmic development.",
      resumeUrl: "https://nusrat-jahan.dev/resume.pdf",
      status: "PENDING",
    },
  });

  console.log("✅ Seeded active professional network connections and referral dossiers.");

  // =========================================================================
  // 8. SEED ACADEMIC RECORDS & CGPA TRANSCRIPTS
  // =========================================================================
  console.log("🎓 Seeding confidential academic semester transcripts...");

  // Farhan's Semesters (CGPA 3.88)
  const farhanSemesters = [
    { semester: "Fall 2023", gpa: 3.90, credits: 16.5, academicYear: "1st Year", notes: "Dean's List Honors" },
    { semester: "Spring 2024", gpa: 3.85, credits: 18.0, academicYear: "1st Year", notes: "Top marks in Data Structures & OOP" },
    { semester: "Fall 2024", gpa: 3.88, credits: 17.5, academicYear: "2nd Year", notes: "Algorithms & Discrete Mathematics" },
    { semester: "Spring 2025", gpa: 3.92, credits: 18.0, academicYear: "2nd Year", notes: "Database Systems & Operating Systems" },
  ];

  for (const s of farhanSemesters) {
    await prisma.academicRecord.upsert({
      where: {
        userId_semester: {
          userId: student1.id,
          semester: s.semester,
        },
      },
      update: s,
      create: {
        userId: student1.id,
        ...s,
        isVerified: true,
      },
    });
  }

  // Nusrat's Semesters (CGPA 3.72)
  const nusratSemesters = [
    { semester: "Fall 2023", gpa: 3.70, credits: 16.0, academicYear: "1st Year", notes: "Introduction to Programming" },
    { semester: "Spring 2024", gpa: 3.65, credits: 17.5, academicYear: "1st Year", notes: "Digital Logic & Computer Systems" },
    { semester: "Fall 2024", gpa: 3.80, credits: 18.0, academicYear: "2nd Year", notes: "Object-Oriented Design & Automata" },
  ];

  for (const s of nusratSemesters) {
    await prisma.academicRecord.upsert({
      where: {
        userId_semester: {
          userId: student2.id,
          semester: s.semester,
        },
      },
      update: s,
      create: {
        userId: student2.id,
        ...s,
        isVerified: true,
      },
    });
  }

  console.log("✅ Seeded semester transcript vault with weighted CGPAs.");

  // =========================================================================
  // 9. SEED PERSONAL CAREER CALENDAR EVENTS
  // =========================================================================
  console.log("📅 Seeding personal career calendar milestones...");

  const calendarEvents = [
    {
      userId: student1.id,
      title: "Vercel Round 1 Technical Interview",
      description: "Live coding and architectural discussion on Next.js Server Components with Sarah Jenkins and lead engineer.",
      startDate: new Date(Date.now() + 4 * 86400000),
      eventType: "INTERVIEW" as const,
      isAllDay: false,
    },
    {
      userId: student1.id,
      title: "bKash Technical Panel Deadline",
      description: "Submit written take-home concurrency design assessment for core transactions platform.",
      startDate: new Date(Date.now() + 2 * 86400000),
      eventType: "APPLICATION_DEADLINE" as const,
      isAllDay: true,
    },
    {
      userId: student1.id,
      title: "Annual University Tech Career Fair 2026",
      description: "University auditorium: meet recruiters from Google, Vercel, Optimizely, and bKash.",
      startDate: new Date(Date.now() + 14 * 86400000),
      eventType: "CAREER_FAIR" as const,
      isAllDay: true,
    },
    {
      userId: student2.id,
      title: "Brain Station 23 AI Screening Assessment",
      description: "Online coding test covering Python data structures and machine learning fundamentals.",
      startDate: new Date(Date.now() + 6 * 86400000),
      eventType: "INTERVIEW" as const,
      isAllDay: false,
    },
  ];

  for (const ev of calendarEvents) {
    await prisma.careerCalendarEvent.create({
      data: ev,
    });
  }

  console.log("✅ Seeded career calendar events and interview milestones.");

  // =========================================================================
  // 10. SEED IN-APP NOTIFICATIONS
  // =========================================================================
  console.log("🔔 Seeding real in-app activity notifications...");

  const notifications = [
    {
      recipientId: student1.id,
      type: "APPLICATION_SHORTLISTED" as const,
      title: "Application Shortlisted!",
      message: "Congratulations! Your application for Frontend Engineering Intern at Vercel has been shortlisted for technical review.",
      actionUrl: "/applications",
      isRead: false,
    },
    {
      recipientId: student1.id,
      type: "REFERRAL_RESPONSE" as const,
      title: "Career Referral Accepted",
      message: "Tariqul Islam (Databricks) accepted your referral request for Cloud Infrastructure Engineer.",
      actionUrl: "/referrals",
      isRead: true,
      readAt: new Date(),
    },
    {
      recipientId: student1.id,
      type: "MEMBERSHIP_APPROVED" as const,
      title: "University Membership Verified",
      message: "Your STUDENT membership verification dossier has been approved by the Office of the Registrar.",
      actionUrl: "/profile/me",
      isRead: true,
      readAt: new Date(),
    },
    {
      recipientId: alumni1.id,
      type: "CONNECTION_REQUEST" as const,
      title: "New Network Connection",
      message: "Farhan Ahmed (Senior CS Student) connected with you on the university network.",
      actionUrl: `/profile/${student1.id}`,
      isRead: true,
      readAt: new Date(),
    },
    {
      recipientId: alumni2.id,
      type: "REFERRAL_REQUEST" as const,
      title: "New Career Referral Request",
      message: "Nusrat Jahan requested a referral for Junior FinTech Backend Engineer at bKash.",
      actionUrl: "/referrals",
      isRead: false,
    },
    {
      recipientId: adminUser.id,
      type: "SYSTEM_ANNOUNCEMENT" as const,
      title: "New Content Moderation Report",
      message: "A community post was reported for spam: 'BUY CHEAP CRYPTO & ESSAY WRITING SERVICES'.",
      actionUrl: "/admin",
      isRead: false,
    },
  ];

  for (const n of notifications) {
    await prisma.notification.create({
      data: n,
    });
  }

  console.log("✅ Seeded real notification stream across all persona dashboards.");

  // =========================================================================
  // 11. SEED ADMINISTRATIVE AUDIT LOGS
  // =========================================================================
  console.log("🛡️ Seeding administrative governance audit trail...");

  const auditLogs = [
    {
      adminId: adminUser.id,
      action: "MEMBER_VERIFIED" as const,
      targetType: "USER" as const,
      targetId: student1.id,
      targetLabel: "Farhan Ahmed (STUDENT)",
      reason: "Verified against university registrar database records for 2023 cohort.",
      ipAddress: "127.0.0.1",
    },
    {
      adminId: adminUser.id,
      action: "OPPORTUNITY_APPROVED" as const,
      targetType: "OPPORTUNITY" as const,
      targetId: vercelInternOpp?.id || "opp-1",
      targetLabel: "Frontend Engineering Intern (Vercel)",
      reason: "Verified compensation transparency and institutional eligibility criteria.",
      ipAddress: "127.0.0.1",
    },
    {
      adminId: adminUser.id,
      action: "COMPANY_VERIFIED" as const,
      targetType: "COMPANY" as const,
      targetId: companies["vercel"].id,
      targetLabel: "Vercel",
      reason: "Verified corporate identity and authorized recruiter roster.",
      ipAddress: "127.0.0.1",
    },
  ];

  for (const log of auditLogs) {
    await prisma.adminAuditLog.create({
      data: log,
    });
  }

  console.log("✅ Seeded immutable administrative audit logs.");
  console.log("\n========================================================");
  console.log("🎉 MASTER DATABASE SEED COMPLETED SUCCESSFULLY!");
  console.log("========================================================");
  console.log("🔑 ALL 7 SEEDED ACCOUNTS (Password: Password123!):");
  console.log("1. Admin:     admin@unicareer.edu (Dean Arthur Vance - Platform Admin)");
  console.log("2. Student 1: farhan.student@unicareer.edu (Farhan Ahmed - Senior CS, CGPA 3.88)");
  console.log("3. Student 2: nusrat.student@unicareer.edu (Nusrat Jahan - Junior SWE, CGPA 3.72)");
  console.log("4. Alumni 1:  tariqul.alumni@unicareer.edu (Tariqul Islam - Senior SWE @ Databricks)");
  console.log("5. Alumni 2:  sabrina.alumni@unicareer.edu (Sabrina Rahman - Lead PM @ bKash)");
  console.log("6. Employer:  sarah.recruiter@vercel.com (Sarah Jenkins - University Recruiting @ Vercel)");
  console.log("7. Faculty:   mahbub.faculty@unicareer.edu (Dr. Mahbubur Rahman - Assoc Prof @ CSE)");
  console.log("========================================================\n");
}

main()
  .catch((e) => {
    console.error("❌ Seeding Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
