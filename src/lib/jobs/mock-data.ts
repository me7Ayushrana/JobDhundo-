import { UnifiedJob } from "./types";

export const HIGH_FIDELITY_FALLBACK_JOBS: UnifiedJob[] = [
  {
    id: "dm-mock-1",
    title: "Senior Full Stack Engineer (Next.js & Go)",
    company: "Vercel",
    companyLogo: "https://assets.vercel.com/image/upload/v1588863977/brand/vercel-logo-black.png",
    location: "Remote",
    jobType: "full-time",
    experienceLevel: "senior",
    salaryMin: 120000,
    salaryMax: 160000,
    salaryCurrency: "USD",
    salaryPeriod: "yearly",
    description: "We are looking for a Senior Full Stack Engineer to lead components of our dashboard platform. You will work on optimizing build feedback loops, creating beautiful interactive experiences, and enhancing core cloud interfaces using Next.js and Go.",
    requirements: [
      "5+ years of experience with React, Next.js, and modern TypeScript development.",
      "Proficient in Go, Node.js, or similar backend systems.",
      "Passion for performance, layout design, and user experience.",
      "Experience with Kubernetes, AWS, or serverless architectures."
    ],
    skills: ["React", "Next.js", "TypeScript", "Go", "AWS", "Tailwind CSS"],
    postedDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://vercel.com/careers",
    source: "cached",
    sourceAttribution: "via DevMatch Curated"
  },
  {
    id: "dm-mock-2",
    title: "Lead Java Developer (Platform Systems)",
    company: "Google",
    companyLogo: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
    location: "Bangalore, India",
    jobType: "full-time",
    experienceLevel: "lead",
    salaryMin: 3500000,
    salaryMax: 5000000,
    salaryCurrency: "INR",
    salaryPeriod: "yearly",
    description: "Join the Google Cloud core team in Bangalore. You will architect high-throughput distributed message processing and backend services using Java, Spring Boot, and Apache Kafka. This role requires collaboration across international geographies.",
    requirements: [
      "8+ years of production experience in backend software development.",
      "Deep expertise in Java, JVM tuning, and Spring Boot framework.",
      "Hands-on experience with Kafka, gRPC, and large-scale SQL/NoSQL databases.",
      "B.Tech/M.Tech in Computer Science or equivalent practical experience."
    ],
    skills: ["Java", "Spring Boot", "Kafka", "PostgreSQL", "Docker"],
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://careers.google.com",
    source: "cached",
    sourceAttribution: "via DevMatch Curated"
  },
  // --- Internshala Internships ---
  {
    id: "dm-internshala-1",
    title: "Web Development Intern (React & Node.js)",
    company: "Razorpay",
    companyLogo: "https://razorpay.com/assets/razorpay-glyph.svg",
    location: "Remote (India)",
    jobType: "internship",
    experienceLevel: "entry",
    salaryMin: 15000,
    salaryMax: 25000,
    salaryCurrency: "INR",
    salaryPeriod: "monthly",
    description: " razorpay is hiring a Web Development Intern. You will work on expanding core payment interfaces, writing modular React components, and integrating RESTful APIs. This is a 6-month full-time internship with a potential pre-placement offer (PPO).",
    requirements: [
      "Familiarity with React, JavaScript, and CSS layout engines.",
      "Basic understanding of RESTful API consumption and state management.",
      "Available to start the internship immediately and commit for 6 months.",
      "Strong debugging and logical reasoning skills."
    ],
    skills: ["React", "JavaScript", "Node.js", "Tailwind CSS"],
    postedDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    applyUrl: "https://internshala.com/internship/detail/razorpay-web-development-internship",
    source: "internshala",
    sourceAttribution: "via Internshala"
  },
  {
    id: "dm-internshala-2",
    title: "UI/UX Design Internship",
    company: "Zomato",
    location: "Gurugram, India",
    jobType: "internship",
    experienceLevel: "entry",
    salaryMin: 20000,
    salaryMax: 30000,
    salaryCurrency: "INR",
    salaryPeriod: "monthly",
    description: "Zomato is looking for a creative UI/UX Design Intern. You will collaborate with product designers to design mobile flows, craft beautiful micro-interactions, and conduct user research. Requires a portfolio showing web or mobile prototypes.",
    requirements: [
      "Proficient in Figma, wireframing, and component libraries.",
      "Strong understanding of user empathy, typography, and visual hierarchies.",
      "Available for an in-office internship in Gurugram.",
      "Ability to present and defend design decisions."
    ],
    skills: ["Figma", "Tailwind CSS", "Framer Motion"],
    postedDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://internshala.com/internship/detail/zomato-uiux-design-internship",
    source: "internshala",
    sourceAttribution: "via Internshala"
  },
  // --- Naukri Jobs ---
  {
    id: "dm-naukri-1",
    title: "Software Engineer (TypeScript & Next.js)",
    company: "TCS (Tata Consultancy Services)",
    location: "Pune, India",
    jobType: "full-time",
    experienceLevel: "mid",
    salaryMin: 800000,
    salaryMax: 1400000,
    salaryCurrency: "INR",
    salaryPeriod: "yearly",
    description: "Naukri.com Hot Job: TCS is recruiting a Software Engineer for modern front-end platforms. You will work on client-facing financial portals using TypeScript, Next.js, and Tailwind CSS. The role involves optimizing page loads and setting up CI/CD workflows.",
    requirements: [
      "2-4 years of experience with Next.js, React, and TypeScript.",
      "Good understanding of server-side rendering and web performance metrics.",
      "Experience writing test cases using Jest or Cypress.",
      "Collaborate with agile backend teams to consume REST/GraphQL APIs."
    ],
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Git"],
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://www.naukri.com/job-listings-tcs-software-engineer-nextjs",
    source: "naukri",
    sourceAttribution: "via Naukri.com"
  },
  {
    id: "dm-naukri-2",
    title: "Java Backend Developer - Spring Boot",
    company: "Infosys",
    location: "Bangalore, India",
    jobType: "full-time",
    experienceLevel: "senior",
    salaryMin: 1200000,
    salaryMax: 2200000,
    salaryCurrency: "INR",
    salaryPeriod: "yearly",
    description: "Infosys is looking for a Senior Backend Developer specializing in Java and Spring Boot. You will lead database modeling, write scalable microservices, manage Redis caching systems, and containerize systems using Docker.",
    requirements: [
      "4-7 years of backend engineering experience with Java.",
      "Expertise in Spring Boot, Spring Data JPA, and Hibernate.",
      "Experience with PostgreSQL or Oracle SQL databases.",
      "Familiarity with container orchestrations (Docker, Kubernetes)."
    ],
    skills: ["Java", "Spring Boot", "PostgreSQL", "Docker", "Redis"],
    postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://www.naukri.com/job-listings-infosys-java-backend-spring-boot",
    source: "naukri",
    sourceAttribution: "via Naukri.com"
  },
  {
    id: "dm-naukri-3",
    title: "DevOps & Cloud Infrastructure Engineer",
    company: "Wipro",
    location: "Hyderabad, India",
    jobType: "full-time",
    experienceLevel: "mid",
    salaryMin: 900000,
    salaryMax: 1600000,
    salaryCurrency: "INR",
    salaryPeriod: "yearly",
    description: "Wipro is seeking a DevOps Engineer to join our cloud operations team. You will write Terraform scripts, set up automated CI/CD deployments via GitHub Actions, and support Kubernetes clusters on AWS.",
    requirements: [
      "3+ years of experience in Cloud Infrastructure / SRE roles.",
      "Highly skilled with AWS core services, IAM, and VPCs.",
      "Proficient in Docker containerization and Kubernetes management.",
      "Automate scripting using Python or Bash."
    ],
    skills: ["Docker", "Kubernetes", "DevOps", "Terraform", "AWS", "Python", "CI/CD"],
    postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://www.naukri.com/job-listings-wipro-devops-cloud-engineer",
    source: "naukri",
    sourceAttribution: "via Naukri.com"
  }
];
