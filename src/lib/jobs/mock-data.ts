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
  {
    id: "dm-mock-3",
    title: "React Frontend Engineer",
    company: "Netflix",
    companyLogo: "https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.png",
    location: "Remote (India)",
    jobType: "full-time",
    experienceLevel: "mid",
    salaryMin: 1800000,
    salaryMax: 2600000,
    salaryCurrency: "INR",
    salaryPeriod: "yearly",
    description: "We are seeking a React Developer who loves micro-interactions, responsive CSS layouts, and animations. You will collaborate with designers to build premium content management engines and high-fidelity video interfaces.",
    requirements: [
      "3+ years of experience building scalable visual web applications.",
      "Highly proficient in modern CSS, Tailwind, and Framer Motion.",
      "Good understanding of web performance, Core Web Vitals, and accessibility.",
      "Experience with state management tools (Zustand, Redux) and REST APIs."
    ],
    skills: ["React", "JavaScript", "TypeScript", "Tailwind CSS", "Framer Motion", "Figma"],
    postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://jobs.netflix.com",
    source: "cached",
    sourceAttribution: "via DevMatch Curated"
  },
  {
    id: "dm-mock-4",
    title: "DevOps & Infrastructure Architect",
    company: "Microsoft",
    location: "Hyderabad, India",
    jobType: "full-time",
    experienceLevel: "senior",
    salaryMin: 2800000,
    salaryMax: 4200000,
    salaryCurrency: "INR",
    salaryPeriod: "yearly",
    description: "Manage and secure our massive scale hosting arrays. Lead Kubernetes orchestrations, design infrastructure deployments with Terraform, and configure automated GitHub Actions pipelines to deploy worldwide.",
    requirements: [
      "5+ years specializing in Cloud Engineering and Site Reliability.",
      "Strong coding abilities in Python, Shell, or Go.",
      "Expertise in Docker, Kubernetes, Helm, and Terraform.",
      "Deep understanding of CI/CD pipeline automation and Git workflows."
    ],
    skills: ["Docker", "Kubernetes", "DevOps", "Terraform", "CI/CD", "AWS", "Python"],
    postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://careers.microsoft.com",
    source: "cached",
    sourceAttribution: "via DevMatch Curated"
  },
  {
    id: "dm-mock-5",
    title: "Junior Python Backend Developer",
    company: "Django Stars",
    location: "Remote",
    jobType: "internship",
    experienceLevel: "entry",
    salaryMin: 40000,
    salaryMax: 60000,
    salaryCurrency: "USD",
    salaryPeriod: "yearly",
    description: "Kickstart your career as a Junior Python Developer. You will support the team in writing REST APIs using Django and FastAPI, writing tests, and collaborating on feature implementations.",
    requirements: [
      "Basic understanding of Python and Django/FastAPI frameworks.",
      "Familiarity with SQL databases and Git version control.",
      "Eager to learn and collaborate in an agile startup team.",
      "Contributions to open source or personal side projects are a plus."
    ],
    skills: ["Python", "Django", "FastAPI", "PostgreSQL", "Git"],
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://djangostars.com/careers",
    source: "cached",
    sourceAttribution: "via DevMatch Curated"
  }
];
