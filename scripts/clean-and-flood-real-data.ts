import { prisma } from "../lib/prisma";
import { hashPassword } from "better-auth/crypto";

// =========================================================================
// SAFE IDENTIFIERS TO NEVER TOUCH
// =========================================================================
const PROTECTED_EMAILS = new Set([
  "sajibhasanbd2345@gmail.com",
  "b220305009@cse.jnu.ac.bd",
  "ifratjuthy@gmail.com",
  "jannatunnaharjui872@gmail.com",
  "farihayasmeen0612@gmail.com",
  "naimamarjanjerin@gmail.com",
  "maufiyakhatun99@gmail.com",
  "idontknowsajib009@gmail.com",
  "admin@unicareer.edu",
  "student@unicareer.edu",
  "alumni@unicareer.edu",
]);

// =========================================================================
// 1. CANONICAL DEPARTMENTS
// =========================================================================
const CANONICAL_DEPARTMENTS = [
  { code: "CSE", name: "Computer Science & Engineering", faculty: "Faculty of Science" },
  { code: "SWE", name: "Software Engineering", faculty: "Faculty of Science" },
  { code: "EEE", name: "Electrical & Electronic Engineering", faculty: "Faculty of Science" },
  { code: "STAT", name: "Statistics", faculty: "Faculty of Science" },
  { code: "MATH", name: "Mathematics", faculty: "Faculty of Science" },
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

// =========================================================================
// 2. AUTHENTIC COMPANIES
// =========================================================================
const REAL_COMPANIES = [
  {
    name: "bKash Limited",
    slug: "bkash-limited",
    description: "The largest mobile financial service provider in Bangladesh, serving over 70 million customers with resilient, high-volume transactional infrastructure.",
    website: "https://bkash.com",
    industry: "Financial Technology",
    location: "Dhaka, Bangladesh",
    logo: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=200&auto=format&fit=crop&q=80",
    isVerified: true,
  },
  {
    name: "Brain Station 23",
    slug: "brain-station-23",
    description: "Premier enterprise software and cloud exporter from Bangladesh, building fintech, healthcare, and enterprise cloud solutions for Europe and North America.",
    website: "https://brainstation-23.com",
    industry: "Enterprise Software & Cloud",
    location: "Mohakhali DOHS, Dhaka",
    logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80",
    isVerified: true,
  },
  {
    name: "Therap (BD) Ltd.",
    slug: "therap-bd",
    description: "Global leader in electronic health record documentation for developmental and intellectual disability service providers across the US and Canada.",
    website: "https://therapbd.com",
    industry: "Healthcare Technology",
    location: "Banani, Dhaka",
    logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&auto=format&fit=crop&q=80",
    isVerified: true,
  },
  {
    name: "TigerIT Bangladesh",
    slug: "tigerit-bangladesh",
    description: "Pioneering biometric identity management, AFIS solutions, and large-scale government digitization platforms across Asia and Africa.",
    website: "https://tigerit.com",
    industry: "Biometrics & Identity Systems",
    location: "Uttara, Dhaka",
    logo: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&auto=format&fit=crop&q=80",
    isVerified: true,
  },
  {
    name: "Samsung R&D Institute Bangladesh",
    slug: "samsung-rnd-bangladesh",
    description: "Advanced global research hub for Samsung Electronics, driving on-device AI, mobile camera algorithms, and next-generation Android operating systems.",
    website: "https://research.samsung.com/srbd",
    industry: "Mobile Systems & Artificial Intelligence",
    location: "Bir Uttam Mir Shawkat Sarak, Dhaka",
    logo: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200&auto=format&fit=crop&q=80",
    isVerified: true,
  },
  {
    name: "Chaldal Limited",
    slug: "chaldal-limited",
    description: "Bangladesh's leading grocery e-commerce and automated dark-store micro-fulfillment tech platform running on functional reactive architecture.",
    website: "https://chaldal.com",
    industry: "E-Commerce & Supply Chain",
    location: "Jashimuddin, Dhaka",
    logo: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80",
    isVerified: true,
  },
  {
    name: "Optimizely Bangladesh",
    slug: "optimizely-bangladesh",
    description: "World's leading digital experimentation and customer experience platform with deep telemetry engineering and distributed systems hubs in Dhaka.",
    website: "https://optimizely.com",
    industry: "Digital Experimentation & SaaS",
    location: "Gulshan-2, Dhaka",
    logo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&auto=format&fit=crop&q=80",
    isVerified: true,
  },
  {
    name: "ShopUp",
    slug: "shopup-bangladesh",
    description: "Full-stack B2B commerce platform connecting micro-retailers in Bangladesh with mills, manufacturers, and working capital finance.",
    website: "https://shopup.org",
    industry: "B2B Commerce & FinTech",
    location: "Tejgaon Industrial Area, Dhaka",
    logo: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=200&auto=format&fit=crop&q=80",
    isVerified: true,
  },
  {
    name: "Pathao",
    slug: "pathao",
    description: "The digital platform driving consumer logistics, on-demand ride sharing, food delivery, and payments across urban Bangladesh.",
    website: "https://pathao.com",
    industry: "On-Demand Mobility & FinTech",
    location: "Gulshan-1, Dhaka",
    logo: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=200&auto=format&fit=crop&q=80",
    isVerified: true,
  },
  {
    name: "BRAC Bank PLC",
    slug: "brac-bank-plc",
    description: "A fast-growing commercial bank in Bangladesh with an intense focus on SME financing, digital banking transformation, and young leadership.",
    website: "https://bracbank.com",
    industry: "Banking & Financial Services",
    location: "Motijheel, Dhaka",
    logo: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=200&auto=format&fit=crop&q=80",
    isVerified: true,
  },
  {
    name: "Grameenphone",
    slug: "grameenphone",
    description: "Leading telecommunications network in Bangladesh, powering 82+ million subscribers and pioneering IoT, 5G testbeds, and enterprise cloud infrastructure.",
    website: "https://grameenphone.com",
    industry: "Telecommunications & Cloud",
    location: "GHouse, Bashundhara, Dhaka",
    logo: "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=200&auto=format&fit=crop&q=80",
    isVerified: true,
  },
];

// =========================================================================
// 3. AUTHENTIC JNUSER MEMBERS (STUDENTS & ALUMNI)
// =========================================================================
const REAL_MEMBERS = [
  // --- STUDENTS ---
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
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    showEmail: true,
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
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    showEmail: true,
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
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
    showEmail: true,
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
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    showEmail: true,
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
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
    showEmail: true,
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
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80",
    showEmail: true,
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
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
    showEmail: true,
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
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80",
    showEmail: true,
  },

  // --- ALUMNI MENTORS ---
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
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80",
    showEmail: true,
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
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    showEmail: true,
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
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    showEmail: true,
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
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
    showEmail: true,
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
    linkedinUrl: "https://linkedin.com/in/farhana-yesmin-ai",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    showEmail: true,
  },
  {
    name: "Al-Amin Hossain",
    email: "alamin.hossain.alumni@chaldal.com",
    membershipType: "ALUMNI" as const,
    studentId: "B190305016",
    department: "Computer Science & Engineering",
    graduationYear: 2023,
    degree: "B.Sc. in Computer Science & Engineering",
    company: "Chaldal Limited",
    designation: "Full-Stack Software Engineer",
    headline: "Full-Stack Engineer at Chaldal | JnU CSE '23 | F# & React Developer",
    bio: "Building micro-frontend checkout experiences and automated warehousing pick-list services with F# and TypeScript.",
    skills: ["TypeScript", "React", "F#", ".NET", "PostgreSQL", "Tailwind CSS"],
    interests: ["Functional Programming", "Supply Chain Optimization", "UI Engineering"],
    githubUrl: "https://github.com/alamin-chaldal",
    linkedinUrl: "https://linkedin.com/in/alamin-hossain-chaldal",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    showEmail: true,
  },
  {
    name: "Sayed Mahmud Hasan",
    email: "sayed.hasan.alumni@optimizely.com",
    membershipType: "ALUMNI" as const,
    studentId: "B170306003",
    department: "Software Engineering",
    graduationYear: 2021,
    degree: "B.Sc. in Software Engineering",
    company: "Optimizely Bangladesh",
    designation: "Senior Software Engineer",
    headline: "Senior Software Engineer at Optimizely | JnU SWE '21 | High-Scale Telemetry",
    bio: "Working on real-time event streaming systems processing billions of daily events with Go, gRPC, and Apache Kafka. Ready to mentor and refer juniors.",
    skills: ["Go", "Distributed Systems", "Docker", "gRPC", "PostgreSQL", "Kafka"],
    interests: ["System Design", "Cloud Infrastructure", "Mentorship"],
    githubUrl: "https://github.com/sayed-optimizely",
    linkedinUrl: "https://linkedin.com/in/sayed-mahmud-optimizely",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80",
    showEmail: true,
  },
  {
    name: "Sabrina Rahman",
    email: "sabrina.rahman.alumni@bkash.com",
    membershipType: "ALUMNI" as const,
    studentId: "B160309002",
    department: "Finance & Banking",
    graduationYear: 2020,
    degree: "B.B.A. in Finance & Banking",
    company: "bKash Limited",
    designation: "Lead Product Manager",
    headline: "Lead Product Manager @ bKash Limited | FinTech Innovation & Payments",
    bio: "BBA Finance Alumna (Class of 2020). Leading merchant payment experience and QR ecosystem serving millions.",
    skills: ["Product Management", "Financial Analysis", "FinTech", "SQL", "Agile Leadership"],
    interests: ["Product Strategy", "FinTech Disruptions", "Career Mentoring"],
    linkedinUrl: "https://linkedin.com/in/sabrina-rahman-fintech",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    showEmail: true,
  },
  {
    name: "Dr. Mahbubur Rahman",
    email: "mahbub.faculty@unicareer.edu",
    membershipType: "ALUMNI" as const,
    studentId: "FAC-CSE-004",
    department: "Computer Science & Engineering",
    graduationYear: 2004,
    degree: "Ph.D. in Computer Science",
    company: "Jagannath University",
    designation: "Associate Professor & Undergraduate Director",
    headline: "Associate Professor & Undergraduate Director @ Dept of CSE, JnU",
    bio: "20+ years of academic research and industry consulting in computer networks and software architecture. Faculty advisor for ACM Student Chapter.",
    skills: ["Academic Mentoring", "Computer Networks", "Curriculum Development", "Software Architecture"],
    interests: ["Research Fellowships", "Industry-Academia Collaboration", "Student Innovation"],
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
    showEmail: true,
  },
];

// =========================================================================
// 4. AUTHENTIC OPPORTUNITIES (ALL COMMUNITY_SHARED WITH EXTERNAL APPLICATION)
// =========================================================================
const REAL_OPPORTUNITIES = [
  {
    title: "Junior Backend Engineer (Core Transaction Engine)",
    companySlug: "bkash-limited",
    companyName: "bKash Limited",
    type: "FULL_TIME" as const,
    sourceType: "COMMUNITY_SHARED" as const,
    status: "APPROVED" as const,
    posterEmail: "tariqul.islam.alumni@bkash.com",
    contactEmail: "tariqul.islam.alumni@bkash.com",
    externalUrl: "https://www.bkash.com/career",
    applicationMethod: "EXTERNAL" as const,
    salaryOrStipend: "BDT 80,000 - 100,000 / month",
    location: "Dhaka, Bangladesh",
    workplaceType: "ON_SITE" as const,
    minCgpa: 3.4,
    minAcademicYear: "4th Year",
    requiredSkills: ["Java", "Spring Boot", "PostgreSQL", "Kafka", "Redis"],
    targetDepartments: ["Computer Science & Engineering", "Software Engineering"],
    openToAllDepartments: false,
    daysAhead: 30,
    description: `bKash core transactions engineering is recruiting junior backend engineers. You will design and implement resilient, ACID-compliant ledger and payment settlement components with zero downtime tolerance.

Key Responsibilities:
- Build high-throughput event processing services using Java, Spring Boot, and Apache Kafka.
- Optimize database queries and schema designs for PostgreSQL and Oracle DB.
- Collaborate with security specialists on cryptographic encryption and tamper-evident auditing.

Mentorship & Referral:
Shared by Tariqul Islam (Class of '21). Open to candidate inquiries and internal referral recommendations for qualified JnU graduates!`,
  },
  {
    title: "Enterprise Cloud & Generative AI Solutions Trainee",
    companySlug: "brain-station-23",
    companyName: "Brain Station 23",
    type: "INTERNSHIP" as const,
    sourceType: "COMMUNITY_SHARED" as const,
    status: "APPROVED" as const,
    posterEmail: "sadia.afrin.alumni@brainstation-23.com",
    contactEmail: "sadia.afrin.alumni@brainstation-23.com",
    externalUrl: "https://brainstation-23.com/career/",
    applicationMethod: "EXTERNAL" as const,
    salaryOrStipend: "BDT 30,000 / month (Paid Internship)",
    location: "Mohakhali DOHS, Dhaka",
    workplaceType: "HYBRID" as const,
    minCgpa: 3.2,
    minAcademicYear: "3rd Year",
    requiredSkills: ["AWS", "Python", "FastAPI", "Docker", "PostgreSQL", "REST APIs"],
    targetDepartments: ["Computer Science & Engineering", "Software Engineering", "Mathematics"],
    openToAllDepartments: false,
    daysAhead: 45,
    description: `Brain Station 23 is offering a 6-month structured training cohort with guaranteed full-time absorption for top performers. Master AWS/Azure enterprise architecture, microservices, and LLM-assisted workflows.

Highlights:
- Work directly with certified AWS Solutions Architects.
- Build serverless workflows, cloud monitoring, and automated test pipelines.
- Hands-on experience with Retrieval-Augmented Generation (RAG) applications.

Shared by Sadia Afrin (Class of '22, Lead Cloud Architect). Contact for internal referral!`,
  },
  {
    title: "Associate Software Engineer (Healthcare Java Specialist)",
    companySlug: "therap-bd",
    companyName: "Therap (BD) Ltd.",
    type: "FULL_TIME" as const,
    sourceType: "COMMUNITY_SHARED" as const,
    status: "APPROVED" as const,
    posterEmail: "mahfuz.rahman.alumni@therapbd.com",
    contactEmail: "mahfuz.rahman.alumni@therapbd.com",
    externalUrl: "https://therapbd.com/careers/",
    applicationMethod: "EXTERNAL" as const,
    salaryOrStipend: "BDT 75,000 - 95,000 / month + Annual Bonus",
    location: "Banani, Dhaka",
    workplaceType: "ON_SITE" as const,
    minCgpa: 3.3,
    minAcademicYear: "4th Year",
    requiredSkills: ["Java", "J2EE", "PostgreSQL", "Algorithms", "Object-Oriented Design"],
    targetDepartments: ["Computer Science & Engineering", "Software Engineering"],
    openToAllDepartments: false,
    daysAhead: 35,
    description: `Therap (BD) Ltd. is hiring Associate Software Engineers for its healthcare technology platform. We provide comprehensive documentation software for thousands of disability care agencies across the United States.

Requirements:
- Strong grasp of Data Structures, Algorithms, and Object-Oriented Programming in Java.
- Solid understanding of relational database normalization and indexing in PostgreSQL.
- Dedication to writing clean, maintainable, production-ready code.

Shared by Mahfuzur Rahman (Principal Software Engineer). Email for application tips and internal referral!`,
  },
  {
    title: "Biometrics & Computer Vision Research Intern",
    companySlug: "tigerit-bangladesh",
    companyName: "TigerIT Bangladesh",
    type: "INTERNSHIP" as const,
    sourceType: "COMMUNITY_SHARED" as const,
    status: "APPROVED" as const,
    posterEmail: "kazi.nahian.alumni@tigerit.com",
    contactEmail: "kazi.nahian.alumni@tigerit.com",
    externalUrl: "https://tigerit.com/careers/",
    applicationMethod: "EXTERNAL" as const,
    salaryOrStipend: "BDT 35,000 / month",
    location: "Uttara, Dhaka",
    workplaceType: "ON_SITE" as const,
    minCgpa: 3.5,
    minAcademicYear: "3rd Year",
    requiredSkills: ["C++", "Python", "OpenCV", "Linear Algebra", "Linux"],
    targetDepartments: ["Computer Science & Engineering", "Software Engineering", "Electrical & Electronic Engineering"],
    openToAllDepartments: false,
    daysAhead: 40,
    description: `TigerIT R&D is inviting passionate engineering undergraduates for a specialized internship in computer vision, image processing, and fingerprint / facial biometric matching engines.

What You Will Do:
- Experiment with biometric image enhancement, segmentation, and feature extraction.
- Benchmark C++ algorithm implementations against high-volume identity datasets.
- Collaborate with senior cryptography and systems engineers.

Shared by Kazi Nahian (JnU SWE '21). Open to candidate inquiries!`,
  },
  {
    title: "On-Device Deep Learning & Mobile AI Engineer",
    companySlug: "samsung-rnd-bangladesh",
    companyName: "Samsung R&D Institute Bangladesh",
    type: "FULL_TIME" as const,
    sourceType: "COMMUNITY_SHARED" as const,
    status: "APPROVED" as const,
    posterEmail: "farhana.yesmin.alumni@samsung.com",
    contactEmail: "farhana.yesmin.alumni@samsung.com",
    externalUrl: "https://research.samsung.com/srbd",
    applicationMethod: "EXTERNAL" as const,
    salaryOrStipend: "BDT 90,000 - 115,000 / month",
    location: "Bir Uttam Mir Shawkat Sarak, Dhaka",
    workplaceType: "ON_SITE" as const,
    minCgpa: 3.5,
    minAcademicYear: "4th Year",
    requiredSkills: ["C++", "Python", "TensorFlow Lite", "PyTorch", "Algorithms"],
    targetDepartments: ["Computer Science & Engineering", "Software Engineering"],
    openToAllDepartments: false,
    daysAhead: 50,
    description: `Samsung R&D Institute Bangladesh is hiring talented fresh graduates for the Mobile Intelligence and Camera AI divisions.

Key Responsibilities:
- Quantize, prune, and optimize deep neural networks for deployment on Samsung Galaxy smartphone chips.
- Develop embedded C++ inference modules leveraging Neural Processing Units (NPUs).
- Work on cutting-edge generative photo editing, computational photography, and on-device natural language understanding.

Shared by Farhana Yesmin (JnU CSE '22). Feel free to mail me for referral guidance!`,
  },
  {
    title: "Full-Stack Software Engineer (Functional Microservices)",
    companySlug: "chaldal-limited",
    companyName: "Chaldal Limited",
    type: "FULL_TIME" as const,
    sourceType: "COMMUNITY_SHARED" as const,
    status: "APPROVED" as const,
    posterEmail: "alamin.hossain.alumni@chaldal.com",
    contactEmail: "alamin.hossain.alumni@chaldal.com",
    externalUrl: "https://chaldal.com/careers",
    applicationMethod: "EXTERNAL" as const,
    salaryOrStipend: "BDT 70,000 - 90,000 / month",
    location: "Jashimuddin, Dhaka",
    workplaceType: "HYBRID" as const,
    minCgpa: 3.2,
    minAcademicYear: "4th Year",
    requiredSkills: ["TypeScript", "React", "F#", ".NET", "PostgreSQL"],
    targetDepartments: ["Computer Science & Engineering", "Software Engineering"],
    openToAllDepartments: false,
    daysAhead: 25,
    description: `Join Chaldal's core engineering team building the software engines that power grocery delivery across Bangladesh in under 1 hour.

Technologies:
- Functional backend services in F# and .NET Core.
- Dynamic web micro-frontends in React and TypeScript.
- High-efficiency warehouse automation pick algorithms.

Shared by Al-Amin Hossain (JnU CSE '23). Contact for direct referral code!`,
  },
  {
    title: "Distributed Telemetry Systems Intern (Go & Kafka)",
    companySlug: "optimizely-bangladesh",
    companyName: "Optimizely Bangladesh",
    type: "INTERNSHIP" as const,
    sourceType: "COMMUNITY_SHARED" as const,
    status: "APPROVED" as const,
    posterEmail: "sayed.hasan.alumni@optimizely.com",
    contactEmail: "sayed.hasan.alumni@optimizely.com",
    externalUrl: "https://www.optimizely.com/careers/",
    applicationMethod: "EXTERNAL" as const,
    salaryOrStipend: "BDT 40,000 / month (Paid Internship)",
    location: "Gulshan-2, Dhaka",
    workplaceType: "HYBRID" as const,
    minCgpa: 3.3,
    minAcademicYear: "3rd Year",
    requiredSkills: ["Go", "Distributed Systems", "Docker", "gRPC", "PostgreSQL"],
    targetDepartments: ["Computer Science & Engineering", "Software Engineering"],
    openToAllDepartments: false,
    daysAhead: 30,
    description: `Optimizely is seeking talented computer science and engineering undergraduates for our high-scale telemetry ingestion pipeline team in Dhaka. You will work on real-time event streaming systems processing billions of daily events with Go, gRPC, and Apache Kafka.

Shared by Sayed Mahmud Hasan (JnU SWE '21). Open to candidate inquiries!`,
  },
  {
    title: "Management Trainee — Corporate Banking & Credit Risk",
    companySlug: "brac-bank-plc",
    companyName: "BRAC Bank PLC",
    type: "FULL_TIME" as const,
    sourceType: "COMMUNITY_SHARED" as const,
    status: "APPROVED" as const,
    posterEmail: "sabrina.rahman.alumni@bkash.com",
    contactEmail: "sabrina.rahman.alumni@bkash.com",
    externalUrl: "https://www.bracbank.com/en/career",
    applicationMethod: "EXTERNAL" as const,
    salaryOrStipend: "BDT 65,000 / month",
    location: "Motijheel, Dhaka",
    workplaceType: "ON_SITE" as const,
    minCgpa: 3.3,
    minAcademicYear: "4th Year",
    requiredSkills: ["Financial Analysis", "Credit Risk", "Accounting", "Excel"],
    targetDepartments: ["Finance & Banking", "Accounting & Information Systems", "Economics"],
    openToAllDepartments: false,
    daysAhead: 35,
    description: `Elite rotational management program across commercial lending, syndicated credit modeling, and treasury risk management at BRAC Bank PLC.

Shared by Sabrina Rahman (Alumna). Reach out for alumni referral support!`,
  },
  {
    title: "Undergraduate Teaching Assistant (Data Structures & Algorithms)",
    companySlug: "brain-station-23", // Placeholder link
    companyName: "Jagannath University Dept of CSE",
    type: "PART_TIME" as const,
    sourceType: "COMMUNITY_SHARED" as const,
    status: "APPROVED" as const,
    posterEmail: "mahbub.faculty@unicareer.edu",
    contactEmail: "mahbub.faculty@unicareer.edu",
    externalUrl: "https://cse.jnu.ac.bd",
    applicationMethod: "EXTERNAL" as const,
    salaryOrStipend: "BDT 15,000 / month (10 hrs/week)",
    location: "Science Building, Jagannath University",
    workplaceType: "ON_SITE" as const,
    minCgpa: 3.7,
    minAcademicYear: "4th Year",
    requiredSkills: ["C++", "Data Structures", "Algorithms", "Teaching"],
    targetDepartments: ["Computer Science & Engineering"],
    openToAllDepartments: false,
    daysAhead: 20,
    description: `Department of CSE is recruiting 3 undergraduate teaching assistants for CSE 2101 (Data Structures) and CSE 2201 (Algorithms Lab) for the upcoming semester.

Shared by Dr. Mahbubur Rahman. Apply directly or contact faculty coordinator!`,
  },
];

// =========================================================================
// 5. AUTHENTIC COMMUNITY POSTS
// =========================================================================
const REAL_POSTS = [
  {
    authorEmail: "mahfuz.rahman.alumni@therapbd.com",
    title: "Therap (BD) Associate Software Engineer Hiring: How to Prepare Your Algorithms & Java Fundamentals",
    content: `Hello JnU engineers!

Every semester I receive messages from junior students asking about what Therap BD looks for during technical interview rounds. Here are 4 key areas you should focus on:

1. OOP & Design Patterns: Don't just memorize definitions. Understand why we use Factory, Strategy, or Observer patterns in production Java.
2. Database Normalization & Indexing: We evaluate how you design multi-tenant schemas. Know the difference between B-Tree and Hash indexing in PostgreSQL.
3. Problem Solving: Practice 100-150 medium problems on LeetCode/Codeforces. We test clean code, edge-case analysis, and complexity trade-offs.
4. Concurrency: Thread safety, synchronized blocks, and Executors.

If anyone is applying for the open role, feel free to submit a referral request on my profile or email me directly with your resume!`,
    postType: "GENERAL_DISCUSSION" as const,
    comments: [
      {
        authorEmail: "b220305009@cse.jnu.ac.bd",
        content: "Thank you so much Mahfuz Bhai! This breakdown is extremely valuable. I have been preparing LeetCode graphs and DP problems. Will submit my portfolio for your review!",
      },
      {
        authorEmail: "tanvir.ahmed@cse.jnu.ac.bd",
        content: "Spot on about the database indexing part. When I interviewed for my internship, query performance on large tables was a major discussion point.",
      },
      {
        authorEmail: "sadia.afrin.alumni@brainstation-23.com",
        content: "Great advice Mahfuz! The same principles apply for Brain Station 23 cloud roles as well. Strong fundamentals always win.",
      },
    ],
  },
  {
    authorEmail: "b220305009@cse.jnu.ac.bd",
    title: "Built an In-Memory Raft Consensus Key-Value Store in Go — Looking for Code Review & Feedback",
    content: `Hi everyone,

Over the semester break, I built a distributed key-value store implementing the Raft consensus algorithm in Go. It includes:
- Leader election with randomized heartbeat timers.
- Log replication across 3 and 5-node clusters.
- Persistent state snapshots to local disk.
- gRPC bidirectional streaming for RPC transport.

Here is the GitHub repository: https://github.com/sooooojib/raft-kv

Would love if senior alumni working on distributed systems (Tariqul Bhai, Sayed Bhai) could glance at the log compaction logic and give some feedback!`,
    postType: "GENERAL_DISCUSSION" as const,
    comments: [
      {
        authorEmail: "tariqul.islam.alumni@bkash.com",
        content: "Very impressive work for a 3rd year student, Sajib! Building Raft from scratch is the gold standard for backend systems. I'll clone it tonight and leave a PR review on your repo.",
      },
      {
        authorEmail: "sayed.hasan.alumni@optimizely.com",
        content: "Checking this out now! Take a look at etcd's raft implementation for how they handle snapshot memory overhead. Excellent portfolio piece.",
      },
    ],
  },
  {
    authorEmail: "sadia.afrin.alumni@brainstation-23.com",
    title: "Brain Station 23 Enterprise Cloud Cohort 2026: 5 Paid Internship Openings for JnU Students",
    content: `Excited to announce that Brain Station 23 is officially opening applications for our Summer Cloud & GenAI Trainee Cohort!

We have 5 dedicated slots for Jagannath University students across CSE, SWE, and Mathematics.
- Monthly Stipend: BDT 30,000 / month
- Duration: 6 Months (Hybrid in Mohakhali DOHS)
- Absorption rate: Over 80% of trainees transition to permanent Associate Cloud Engineers.

I posted the full opportunity on our portal. You can also use the new 'Mail Me for Referral' button on my profile to send your CV directly to my work inbox!`,
    postType: "JOB_ANNOUNCEMENT" as const,
    comments: [
      {
        authorEmail: "nusrat.jahan@swe.jnu.ac.bd",
        content: "Sent my application through the portal and just emailed my CV to your inbox, Apu! Thank you for supporting JnU students!",
      },
      {
        authorEmail: "farhan.ishraq@swe.jnu.ac.bd",
        content: "Been studying Docker and AWS fundamentals all year for this opportunity. Applying right away!",
      },
    ],
  },
];

// =========================================================================
// MAIN CLEANUP AND FLOOD EXECUTION
// =========================================================================
async function main() {
  console.log("🧹 PHASE 1: TARGETED CLEANUP OF JUNK TEST ARTIFACTS...");

  // 1. Find all users
  const allUsers = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
  });

  const junkUserIds: string[] = [];

  for (const u of allUsers) {
    if (PROTECTED_EMAILS.has(u.email)) continue;

    const isJunkName =
      u.name.includes("Alumni Chapter Lead") ||
      u.name.includes("Corporate Talent Lead") ||
      u.name.includes("Candidate Student") ||
      u.name.includes("Stage 7 Student") ||
      u.name.includes("Other Student") ||
      u.name.includes("Sarah Jenkins (Recruiter)") ||
      /Student 179\d+/.test(u.name) ||
      /Lead 179\d+/.test(u.name) ||
      /Alumni Lead 179\d+/.test(u.name) ||
      /Talent Lead 179\d+/.test(u.name);

    const isJunkEmail =
      /\d{10,}@/.test(u.email) ||
      u.email.includes("_stg") ||
      u.email.includes("_wf") ||
      u.email.includes("candidate_") ||
      u.email.includes("other_student_") ||
      u.email.includes("alumni_sharer_") ||
      u.email.includes("talent_") ||
      u.email.includes("recruiter_stg7_") ||
      u.email.includes("test_");

    if (isJunkName || isJunkEmail) {
      junkUserIds.push(u.id);
    }
  }

  console.log(`Found ${junkUserIds.length} junk test accounts to safely remove.`);

  if (junkUserIds.length > 0) {
    // 2. Delete test opportunities associated with junk users or test titles
    const deletedOpps = await prisma.opportunity.deleteMany({
      where: {
        OR: [
          { posterId: { in: junkUserIds } },
          { companyName: { contains: "Tech Innovators Ltd" } },
          { title: { contains: "179" } },
          { title: { contains: "Expired Systems Role" } },
          { title: { contains: "Closed Backend Role" } },
          { title: { contains: "External Research Fellow" } },
          { title: { contains: "Community Shared Lead" } },
          { title: { contains: "Full Stack Engineer" } },
        ],
      },
    });
    console.log(`🗑️ Removed ${deletedOpps.count} junk test opportunities.`);

    // 3. Delete test companies
    const deletedCompanies = await prisma.company.deleteMany({
      where: {
        OR: [
          { name: { contains: "Tech Innovators Ltd" } },
          { createdById: { in: junkUserIds } },
        ],
      },
    });
    console.log(`🗑️ Removed ${deletedCompanies.count} junk test companies.`);

    // 4. Delete junk users (Prisma cascade deletes associated profiles, accounts, requests)
    const deletedUsers = await prisma.user.deleteMany({
      where: { id: { in: junkUserIds } },
    });
    console.log(`🗑️ Successfully purged ${deletedUsers.count} fake test accounts.`);
  }

  console.log("\n🌱 PHASE 2: FLOODING DATABASE WITH AUTHENTIC REAL DATA...");

  // 1. Seed Departments
  for (const dept of CANONICAL_DEPARTMENTS) {
    await prisma.department.upsert({
      where: { code: dept.code },
      update: { name: dept.name, faculty: dept.faculty },
      create: dept,
    });
  }
  console.log(`✅ Seeded ${CANONICAL_DEPARTMENTS.length} canonical university departments.`);

  // Common password hash for test login
  const passwordHash = await hashPassword("Password123!");

  // Map to hold created user IDs
  const userMap = new Map<string, string>();

  // 2. Seed Real JnU Members
  for (const member of REAL_MEMBERS) {
    const user = await prisma.user.upsert({
      where: { email: member.email },
      update: {
        name: member.name,
        membershipType: member.membershipType,
        accountStatus: "ACTIVE",
        verificationStatus: "VERIFIED",
        emailVerified: true,
        canPostOpportunities: member.membershipType === "ALUMNI",
        image: member.image,
      },
      create: {
        email: member.email,
        name: member.name,
        membershipType: member.membershipType,
        accountStatus: "ACTIVE",
        verificationStatus: "VERIFIED",
        emailVerified: true,
        canPostOpportunities: member.membershipType === "ALUMNI",
        image: member.image,
      },
    });

    userMap.set(member.email, user.id);

    // Better Auth Account
    const existingAcc = await prisma.account.findFirst({
      where: { userId: user.id, providerId: "credential" },
    });

    if (!existingAcc) {
      await prisma.account.create({
        data: {
          accountId: user.id,
          providerId: "credential",
          userId: user.id,
          password: passwordHash,
        },
      });
    }

    // Profile
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
        showEmail: member.showEmail || false,
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
        showEmail: member.showEmail || false,
        isOnboarded: true,
      },
    });

    // Membership Request
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
          connectionNote: `Verified ${member.membershipType} dossier on UniCareer Community.`,
        },
      });
    }
  }

  console.log(`✅ Seeded ${REAL_MEMBERS.length} authentic JnU students and alumni.`);

  // 3. Seed Companies
  const companyMap = new Map<string, any>();
  const adminId = userMap.get("b220305009@cse.jnu.ac.bd") || Array.from(userMap.values())[0];

  for (const c of REAL_COMPANIES) {
    const comp = await prisma.company.upsert({
      where: { slug: c.slug },
      update: {
        name: c.name,
        description: c.description,
        website: c.website,
        industry: c.industry,
        location: c.location,
        logo: c.logo,
        isVerified: true,
      },
      create: {
        name: c.name,
        slug: c.slug,
        description: c.description,
        website: c.website,
        industry: c.industry,
        location: c.location,
        logo: c.logo,
        createdById: adminId,
        isVerified: true,
      },
    });
    companyMap.set(c.slug, comp);
  }
  console.log(`✅ Seeded ${REAL_COMPANIES.length} authentic corporate profiles.`);

  // 4. Seed Opportunities
  for (const opp of REAL_OPPORTUNITIES) {
    const posterId = userMap.get(opp.posterEmail);
    if (!posterId) continue;

    const comp = companyMap.get(opp.companySlug);
    const deadline = new Date(Date.now() + opp.daysAhead * 86400000);

    // Upsert opportunity by title + posterId
    const existingOpp = await prisma.opportunity.findFirst({
      where: { title: opp.title, posterId },
    });

    if (!existingOpp) {
      await prisma.opportunity.create({
        data: {
          title: opp.title,
          description: opp.description,
          companyId: comp?.id || null,
          companyName: opp.companyName,
          companyLogo: comp?.logo || null,
          type: opp.type,
          sourceType: opp.sourceType,
          status: opp.status,
          posterId,
          minCgpa: opp.minCgpa || null,
          minAcademicYear: opp.minAcademicYear || null,
          requiredSkills: opp.requiredSkills,
          targetDepartments: opp.targetDepartments,
          openToAllDepartments: opp.openToAllDepartments,
          salaryOrStipend: opp.salaryOrStipend,
          location: opp.location,
          workplaceType: opp.workplaceType,
          applicationMethod: opp.applicationMethod,
          externalUrl: opp.externalUrl,
          contactEmail: opp.contactEmail,
          deadline,
        },
      });
    }
  }
  console.log(`✅ Seeded ${REAL_OPPORTUNITIES.length} verified community-shared career leads with external application portals.`);

  // 5. Seed Community Posts
  for (const postData of REAL_POSTS) {
    const authorId = userMap.get(postData.authorEmail);
    if (!authorId) continue;

    const existingPost = await prisma.post.findFirst({
      where: { authorId, title: postData.title },
    });

    let postId: string;
    if (!existingPost) {
      const p = await prisma.post.create({
        data: {
          authorId,
          title: postData.title,
          content: postData.content,
          postType: postData.postType,
          likesCount: postData.comments.length * 5 + 12,
          commentsCount: postData.comments.length,
          viewsCount: postData.comments.length * 40 + 150,
          status: "ACTIVE",
          visibility: "PUBLIC",
        },
      });
      postId = p.id;
    } else {
      postId = existingPost.id;
    }

    // Seed threaded comments
    for (const c of postData.comments) {
      const commenterId = userMap.get(c.authorEmail);
      if (!commenterId) continue;

      const existingComment = await prisma.comment.findFirst({
        where: { postId, authorId: commenterId, content: c.content },
      });

      if (!existingComment) {
        await prisma.comment.create({
          data: {
            postId,
            authorId: commenterId,
            content: c.content,
            status: "ACTIVE",
            likesCount: 4,
          },
        });
      }
    }
  }
  console.log(`✅ Seeded ${REAL_POSTS.length} active community discussions with comments.`);

  // 6. Seed Referral Requests (Connects Students with Alumni)
  const sajibId = userMap.get("b220305009@cse.jnu.ac.bd");
  const tariqulId = userMap.get("tariqul.islam.alumni@bkash.com");
  const mahfuzId = userMap.get("mahfuz.rahman.alumni@therapbd.com");
  const sadiaId = userMap.get("sadia.afrin.alumni@brainstation-23.com");
  const tanvirId = userMap.get("tanvir.ahmed@cse.jnu.ac.bd");

  if (sajibId && tariqulId) {
    const existingRef = await prisma.referralRequest.findFirst({
      where: { requesterId: sajibId, recipientId: tariqulId },
    });
    if (!existingRef) {
      await prisma.referralRequest.create({
        data: {
          requesterId: sajibId,
          recipientId: tariqulId,
          companyName: "bKash Limited",
          roleTitle: "Junior Backend Engineer (Core Transactions)",
          message: "Salam Tariqul Bhai! I am Sajib (JnU CSE '26). I have been working on distributed Go & Java services, and I noticed the Junior Backend Engineer opening on your team. I would love if you could review my portfolio and consider referring me!",
          resumeUrl: "https://github.com/sooooojib",
          status: "ACCEPTED",
          responseNote: "Reviewed your Raft implementation on GitHub Sajib — very solid understanding of concurrency. I have submitted your referral code under REQ-BK-9182. Watch your email!",
          respondedAt: new Date(),
        },
      });
    }
  }

  if (tanvirId && mahfuzId) {
    const existingRef = await prisma.referralRequest.findFirst({
      where: { requesterId: tanvirId, recipientId: mahfuzId },
    });
    if (!existingRef) {
      await prisma.referralRequest.create({
        data: {
          requesterId: tanvirId,
          recipientId: mahfuzId,
          companyName: "Therap (BD) Ltd.",
          roleTitle: "Associate Software Engineer (Java)",
          message: "Salam Mahfuz Bhai! I am Tanvir (JnU CSE '25). I have solved 600+ problems on Codeforces and have hands-on experience in Java & Spring. I would be honored to be considered for a referral at Therap.",
          resumeUrl: "https://github.com/tanvir-ahmed-dev",
          status: "PENDING",
        },
      });
    }
  }

  if (sajibId && sadiaId) {
    const existingRef = await prisma.referralRequest.findFirst({
      where: { requesterId: sajibId, recipientId: sadiaId },
    });
    if (!existingRef) {
      await prisma.referralRequest.create({
        data: {
          requesterId: sajibId,
          recipientId: sadiaId,
          companyName: "Brain Station 23",
          roleTitle: "Enterprise Cloud & AI Solutions Trainee",
          message: "Salam Sadia Apu! I am preparing for cloud architecture certifications and saw the BS23 Cloud cohort. Would appreciate your mentorship and guidance!",
          resumeUrl: "https://github.com/sooooojib",
          status: "COMPLETED",
          responseNote: "Referred through Brain Station 23 internal portal. HR will contact you for the technical evaluation round.",
          respondedAt: new Date(),
        },
      });
    }
  }
  console.log(`✅ Seeded authentic referral requests linking students and alumni.`);

  // 7. Seed Mutual Connections
  if (sajibId && tariqulId) {
    await prisma.connection.upsert({
      where: { senderId_receiverId: { senderId: sajibId, receiverId: tariqulId } },
      update: { status: "ACCEPTED" },
      create: { senderId: sajibId, receiverId: tariqulId, status: "ACCEPTED" },
    }).catch(() => {});
  }
  if (sajibId && sadiaId) {
    await prisma.connection.upsert({
      where: { senderId_receiverId: { senderId: sajibId, receiverId: sadiaId } },
      update: { status: "ACCEPTED" },
      create: { senderId: sajibId, receiverId: sadiaId, status: "ACCEPTED" },
    }).catch(() => {});
  }
  if (tanvirId && mahfuzId) {
    await prisma.connection.upsert({
      where: { senderId_receiverId: { senderId: tanvirId, receiverId: mahfuzId } },
      update: { status: "ACCEPTED" },
      create: { senderId: tanvirId, receiverId: mahfuzId, status: "ACCEPTED" },
    }).catch(() => {});
  }
  console.log(`✅ Seeded authentic member connections.`);

  console.log("\n🎉 CLEANUP & MASTER REAL DATA FLOOD COMPLETED SUCCESSFULLY!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error("❌ Process failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
