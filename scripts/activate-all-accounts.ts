import { prisma } from "../lib/prisma";
import { hashPassword } from "better-auth/crypto";

async function main() {
  console.log("🚀 Starting comprehensive account activation and credential provisioning...");

  const COMMON_PASSWORD = "Password123!";
  const passwordHash = await hashPassword(COMMON_PASSWORD);

  // 1. Fetch all users in database
  const allUsers = await prisma.user.findMany({
    include: {
      accounts: true,
      profile: true,
    },
  });

  console.log(`Found ${allUsers.length} total users in database.`);

  // 2. Activate, verify, and provision credentials for every existing user
  let updatedUsersCount = 0;
  let createdAccountsCount = 0;
  let updatedProfilesCount = 0;

  for (const user of allUsers) {
    // Determine permissions based on role
    const isEmployer = user.membershipType === "EMPLOYER" || user.membershipType === "EXTERNAL_CONNECTION";
    const isAdmin = user.systemRole === "ADMIN";
    const isFacultyStaff = user.membershipType === "FACULTY" || user.membershipType === "STAFF";

    await prisma.user.update({
      where: { id: user.id },
      data: {
        accountStatus: "ACTIVE",
        verificationStatus: "VERIFIED",
        emailVerified: true,
        verifiedAt: user.verifiedAt || new Date(),
        canPostOpportunities: isEmployer || isAdmin || isFacultyStaff,
        canReviewApplicants: isEmployer || isAdmin,
      },
    });
    updatedUsersCount++;

    // Ensure Profile exists and is marked onboarded
    if (user.profile) {
      await prisma.profile.update({
        where: { id: user.profile.id },
        data: {
          isOnboarded: true,
        },
      });
      updatedProfilesCount++;
    } else {
      await prisma.profile.create({
        data: {
          userId: user.id,
          headline: `${user.name} • ${user.membershipType.replace("_", " ")}`,
          bio: `Verified member of the UniCareer university community network.`,
          isOnboarded: true,
          showEmail: true,
        },
      });
      updatedProfilesCount++;
    }

    // Ensure credential Account exists with password
    const credentialAccount = user.accounts.find((a) => a.providerId === "credential");
    if (credentialAccount) {
      await prisma.account.update({
        where: { id: credentialAccount.id },
        data: {
          password: passwordHash,
        },
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
      createdAccountsCount++;
    }
  }

  console.log(`✅ Updated ${updatedUsersCount} users to ACTIVE & VERIFIED.`);
  console.log(`✅ Updated/created ${updatedProfilesCount} profiles to isOnboarded: true.`);
  console.log(`✅ Provisioned credentials for ${createdAccountsCount} accounts (All users now have password: Password123!).`);

  // 3. Ensure clean persona alias accounts exist
  const aliases = [
    {
      email: "student@unicareer.edu",
      name: "Standard Student",
      membershipType: "STUDENT" as const,
      systemRole: "MEMBER" as const,
      headline: "Enrolled Student | Computer Science & Engineering",
    },
    {
      email: "alumni@unicareer.edu",
      name: "Standard Alumni",
      membershipType: "ALUMNI" as const,
      systemRole: "MEMBER" as const,
      headline: "University Alumnus | Industry Professional",
      company: "Tech Global Inc",
      designation: "Software Engineer",
    },
    {
      email: "employer@unicareer.edu",
      name: "Standard Employer",
      membershipType: "EMPLOYER" as const,
      systemRole: "MEMBER" as const,
      headline: "Corporate Recruiter | Talent Partner",
      company: "Apex Technologies",
      designation: "Campus Recruiting Specialist",
    },
    {
      email: "faculty@unicareer.edu",
      name: "Standard Faculty",
      membershipType: "FACULTY" as const,
      systemRole: "MEMBER" as const,
      headline: "Academic Faculty Member | Department Advisor",
      department: "Computer Science & Engineering",
      designation: "Assistant Professor",
    },
    {
      email: "external@unicareer.edu",
      name: "Standard External Connection",
      membershipType: "EXTERNAL_CONNECTION" as const,
      systemRole: "MEMBER" as const,
      headline: "Approved External Affiliate | Industry Mentor",
      company: "Silicon Bridge Ventures",
      designation: "Principal Advisor",
    },
  ];

  for (const alias of aliases) {
    const isEmployer = alias.membershipType === "EMPLOYER" || alias.membershipType === "EXTERNAL_CONNECTION";
    const user = await prisma.user.upsert({
      where: { email: alias.email },
      update: {
        name: alias.name,
        membershipType: alias.membershipType,
        systemRole: alias.systemRole,
        accountStatus: "ACTIVE",
        verificationStatus: "VERIFIED",
        emailVerified: true,
        canPostOpportunities: isEmployer,
        canReviewApplicants: isEmployer,
      },
      create: {
        email: alias.email,
        name: alias.name,
        membershipType: alias.membershipType,
        systemRole: alias.systemRole,
        accountStatus: "ACTIVE",
        verificationStatus: "VERIFIED",
        emailVerified: true,
        canPostOpportunities: isEmployer,
        canReviewApplicants: isEmployer,
      },
    });

    // Profile
    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        headline: alias.headline,
        company: (alias as any).company || null,
        designation: (alias as any).designation || null,
        department: (alias as any).department || null,
        isOnboarded: true,
        showEmail: true,
      },
      create: {
        userId: user.id,
        headline: alias.headline,
        company: (alias as any).company || null,
        designation: (alias as any).designation || null,
        department: (alias as any).department || null,
        isOnboarded: true,
        showEmail: true,
      },
    });

    // Account password
    const acc = await prisma.account.findFirst({
      where: { userId: user.id, providerId: "credential" },
    });
    if (acc) {
      await prisma.account.update({
        where: { id: acc.id },
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
  }

  console.log(`✅ Ensured 5 standard role aliases (student@, alumni@, employer@, faculty@, external@) are provisioned and active.`);
  console.log("🎉 ALL ACCOUNTS ARE NOW FULLY ACTIVE, VERIFIED, ONBOARDED, AND RUNNING!");
}

main()
  .catch((e) => {
    console.error("❌ Error activating accounts:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
