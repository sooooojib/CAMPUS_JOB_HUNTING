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
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
