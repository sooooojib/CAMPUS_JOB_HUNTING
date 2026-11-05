import { prisma } from "../lib/prisma";

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
  console.log("🌱 Starting canonical university department seed...");

  for (const dept of CANONICAL_DEPARTMENTS) {
    await prisma.department.upsert({
      where: { code: dept.code },
      update: { name: dept.name, faculty: dept.faculty },
      create: dept,
    });
  }
  console.log(`✅ Seeded ${CANONICAL_DEPARTMENTS.length} canonical university departments.`);

  // Create or update platform admin
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@unicareer.edu" },
    update: {
      systemRole: "ADMIN",
      verificationStatus: "VERIFIED",
      canPostOpportunities: true,
      canReviewApplicants: true,
      emailVerified: true,
    },
    create: {
      name: "University Career Services",
      email: "admin@unicareer.edu",
      systemRole: "ADMIN",
      membershipType: "STAFF",
      verificationStatus: "VERIFIED",
      canPostOpportunities: true,
      canReviewApplicants: true,
      emailVerified: true,
    },
  });

  // Create or update partner employer user
  const employerUser = await prisma.user.upsert({
    where: { email: "talent@optimizely.com" },
    update: {
      verificationStatus: "VERIFIED",
      canPostOpportunities: true,
      canReviewApplicants: true,
      emailVerified: true,
    },
    create: {
      name: "Optimizely Talent Acquisition",
      email: "talent@optimizely.com",
      membershipType: "EMPLOYER",
      verificationStatus: "VERIFIED",
      canPostOpportunities: true,
      canReviewApplicants: true,
      emailVerified: true,
    },
  });

  // Seed Partner Companies
  const optimizely = await prisma.company.upsert({
    where: { slug: "optimizely" },
    update: {},
    create: {
      name: "Optimizely",
      slug: "optimizely",
      description: "Leading digital experience platform and experimentation software company with core engineering hubs in Dhaka, Austin, and Stockholm.",
      website: "https://www.optimizely.com",
      industry: "Software & Cloud Services",
      location: "Gulshan-2, Dhaka",
      createdById: employerUser.id,
    },
  });

  await prisma.companyMember.upsert({
    where: {
      companyId_userId: {
        companyId: optimizely.id,
        userId: employerUser.id,
      },
    },
    update: {},
    create: {
      companyId: optimizely.id,
      userId: employerUser.id,
      role: "OWNER",
      canPostOpportunities: true,
      canManageCompany: true,
    },
  });

  const bkash = await prisma.company.upsert({
    where: { slug: "bkash-limited" },
    update: {},
    create: {
      name: "bKash Limited",
      slug: "bkash-limited",
      description: "The largest mobile financial service provider in Bangladesh, serving over 70 million customers with fintech infrastructure.",
      website: "https://www.bkash.com",
      industry: "Financial Technology",
      location: "Dhaka, Bangladesh",
      createdById: adminUser.id,
    },
  });

  const brainStation = await prisma.company.upsert({
    where: { slug: "brain-station-23" },
    update: {},
    create: {
      name: "Brain Station 23",
      slug: "brain-station-23",
      description: "One of the largest enterprise software development exporters in Bangladesh, building cloud and AI solutions globally.",
      website: "https://brainstation-23.com",
      industry: "Enterprise Software",
      location: "Mohakhali DOHS, Dhaka",
      createdById: adminUser.id,
    },
  });

  // Future deadlines: 30 days and 60 days ahead
  const thirtyDaysAhead = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const fortyFiveDaysAhead = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000);
  const twoDaysAhead = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // For urgency indicator

  const SEED_OPPORTUNITIES = [
    {
      title: "Distributed Systems Software Intern (Fall 2026)",
      description:
        "Join Optimizely's high-scale distributed systems team. You will work on real-time event ingestion pipelines processing billions of telemetry events daily using Go, gRPC, and Apache Kafka. Open to 3rd and 4th year undergraduate students in computing disciplines.\n\nKey Responsibilities:\n- Implement microservices in Go and gRPC.\n- Write unit and integration tests with >85% coverage.\n- Collaborate with senior engineers on Kubernetes cluster deployments.\n- Participate in bi-weekly sprint planning and code reviews.",
      companyId: optimizely.id,
      companyName: "Optimizely",
      type: "INTERNSHIP" as const,
      sourceType: "OFFICIAL_EMPLOYER" as const,
      status: "APPROVED" as const,
      posterId: employerUser.id,
      minCgpa: 3.25,
      minAcademicYear: "3rd Year",
      requiredSkills: ["Go", "Distributed Systems", "Docker", "gRPC", "PostgreSQL"],
      targetDepartments: ["Computer Science & Engineering", "Software Engineering"],
      openToAllDepartments: false,
      salaryOrStipend: "BDT 35,000 / month",
      location: "Gulshan-2, Dhaka",
      workplaceType: "HYBRID" as const,
      applicationMethod: "INTERNAL" as const,
      deadline: thirtyDaysAhead,
    },
    {
      title: "Junior FinTech Backend Engineer",
      description:
        "bKash is looking for talented, analytically sharp software engineers to join our core transactions platform team. You will build high-throughput, ACID-compliant ledger components with zero downtime tolerance.\n\nRequirements:\n- Strong foundation in data structures, algorithms, and concurrency.\n- Hands-on experience with Java/Spring Boot or Node.js.\n- Understanding of database indexing and query optimization.",
      companyId: bkash.id,
      companyName: "bKash Limited",
      type: "FULL_TIME" as const,
      sourceType: "OFFICIAL_EMPLOYER" as const,
      status: "APPROVED" as const,
      posterId: adminUser.id,
      minCgpa: 3.3,
      minAcademicYear: "Graduating Senior",
      requiredSkills: ["Java", "Spring Boot", "PostgreSQL", "Kafka", "Redis"],
      targetDepartments: ["Computer Science & Engineering", "Software Engineering", "Electrical & Electronic Engineering"],
      openToAllDepartments: false,
      salaryOrStipend: "BDT 65,000 - 85,000 / month",
      location: "Dhaka, Bangladesh",
      workplaceType: "ON_SITE" as const,
      applicationMethod: "INTERNAL" as const,
      deadline: twoDaysAhead, // Urgent deadline
    },
    {
      title: "Enterprise Cloud & AI Solutions Trainee",
      description:
        "Brain Station 23 is offering an intensive 6-month traineeship with guaranteed placement for top performers. You will be trained on AWS/Azure architectures, microservices, and Generative AI workflows while contributing to live international client solutions.",
      companyId: brainStation.id,
      companyName: "Brain Station 23",
      type: "INTERNSHIP" as const,
      sourceType: "OFFICIAL_EMPLOYER" as const,
      status: "APPROVED" as const,
      posterId: adminUser.id,
      minCgpa: 3.0,
      minAcademicYear: "4th Year",
      requiredSkills: ["Python", "Cloud Architecture", "Next.js", "REST APIs"],
      targetDepartments: ["Computer Science & Engineering", "Software Engineering", "Mathematics"],
      openToAllDepartments: false,
      salaryOrStipend: "BDT 25,000 / month",
      location: "Mohakhali DOHS, Dhaka",
      workplaceType: "HYBRID" as const,
      applicationMethod: "INTERNAL" as const,
      deadline: fortyFiveDaysAhead,
    },
    {
      title: "Management Trainee — Corporate Banking & Credit Analysis",
      description:
        "Exclusive opportunity shared by Jagannath University BBA Alumni Network. Commercial banking cohort with accelerated leadership track across treasury, credit risk management, and SME syndications. Candidates must exhibit outstanding financial modeling skills.",
      companyName: "BRAC Bank PLC",
      type: "FULL_TIME" as const,
      sourceType: "COMMUNITY_SHARED" as const,
      status: "APPROVED" as const,
      posterId: adminUser.id,
      minCgpa: 3.2,
      minAcademicYear: "Graduated",
      requiredSkills: ["Financial Analysis", "Credit Risk", "Accounting", "Excel"],
      targetDepartments: ["Finance & Banking", "Accounting & Information Systems", "Economics"],
      openToAllDepartments: false,
      salaryOrStipend: "BDT 55,000 / month",
      location: "Motijheel, Dhaka",
      workplaceType: "ON_SITE" as const,
      applicationMethod: "EXTERNAL" as const,
      externalUrl: "https://bracbank.taleo.net/careersection/mto/jobapply",
      deadline: thirtyDaysAhead,
    },
    {
      title: "UI/UX & Product Design Trainee",
      description:
        "Learn digital product design, user research, wireframing, and interactive design system tokens. Open across all university departments — strong aesthetic sensibility and curiosity required.",
      companyName: "Augmedix Bangladesh",
      type: "INTERNSHIP" as const,
      sourceType: "COMMUNITY_SHARED" as const,
      status: "APPROVED" as const,
      posterId: adminUser.id,
      openToAllDepartments: true,
      requiredSkills: ["Figma", "Design Systems", "User Research", "Wireframing"],
      salaryOrStipend: "BDT 22,000 / month",
      location: "Panthapath, Dhaka",
      workplaceType: "REMOTE" as const,
      applicationMethod: "EXTERNAL" as const,
      externalUrl: "https://augmedix.com/careers",
      deadline: fortyFiveDaysAhead,
    },
    {
      title: "Brand Strategy & Communications Associate",
      description:
        "Fast-track rotational role for creative and articulate graduates. Work on nationwide FMCG campaigns, media relations, copy direction, and market research.",
      companyName: "Unilever Bangladesh",
      type: "FULL_TIME" as const,
      sourceType: "COMMUNITY_SHARED" as const,
      status: "APPROVED" as const,
      posterId: adminUser.id,
      openToAllDepartments: true,
      requiredSkills: ["Brand Management", "Copywriting", "Market Research", "Presentation"],
      salaryOrStipend: "Competitive + MNC Benefits",
      location: "Dhaka, Bangladesh",
      workplaceType: "HYBRID" as const,
      applicationMethod: "EXTERNAL" as const,
      externalUrl: "https://unilever.com/careers/bangladesh",
      deadline: thirtyDaysAhead,
    },
  ];

  for (const opp of SEED_OPPORTUNITIES) {
    const existing = await prisma.opportunity.findFirst({
      where: {
        title: opp.title,
        companyName: opp.companyName,
      },
    });

    if (!existing) {
      await prisma.opportunity.create({
        data: opp,
      });
    }
  }

  console.log(`✅ Seeded ${SEED_OPPORTUNITIES.length} authentic university opportunities.`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
