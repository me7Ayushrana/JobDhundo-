const fs = require("fs");
const path = require("path");

const mockPath = path.join(__dirname, "../src/lib/jobs/mock-data.ts");
const providersPath = path.join(__dirname, "../src/lib/jobs/connectors/providers.ts");

console.log("Fixing mock and fallback URLs...");

// 1. Update mock-data.ts
try {
  let content = fs.readFileSync(mockPath, "utf-8");
  
  const replacements = {
    "https://internshala.com/internship/detail/razorpay-web-development-internship": "https://razorpay.com/jobs/",
    "https://internshala.com/internship/detail/zomato-uiux-design-internship": "https://www.zomato.com/careers",
    "https://internshala.com/internship/detail/paytm-flutter-developer": "https://www.paytm.com/about-us/careers",
    "https://internshala.com/internship/detail/swiggy-python-django": "https://careers.swiggy.com",
    "https://internshala.com/internship/detail/cred-data-analyst": "https://cred.club/careers",
    "https://internshala.com/internship/detail/groww-frontend-nextjs": "https://groww.in/careers",
    "https://internshala.com/internship/detail/ola-nodejs-api": "https://www.olacabs.com/careers",
    "https://internshala.com/internship/detail/freshworks-devops": "https://www.freshworks.com/company/careers/",
    "https://internshala.com/internship/detail/meesho-android-kotlin": "https://www.meesho.io/careers",
    "https://internshala.com/internship/detail/wipro-ml-intern": "https://careers.wipro.com/careers",
    
    "https://www.naukri.com/job-listings-tcs-software-engineer-nextjs": "https://www.tcs.com/careers",
    "https://www.naukri.com/job-listings-infosys-java-backend-spring-boot": "https://www.infosys.com/careers.html",
    "https://www.naukri.com/job-listings-wipro-devops-cloud-engineer": "https://careers.wipro.com/careers",
    "https://www.naukri.com/job-listings-hcl-nodejs-senior": "https://www.hcltech.com/careers",
    "https://www.naukri.com/job-listings-cognizant-react-native": "https://careers.cognizant.com",
    "https://www.naukri.com/job-listings-techmahindra-python-data": "https://careers.techmahindra.com",
    "https://www.naukri.com/job-listings-lt-ml-engineer": "https://careers.accenture.com/in-en",
    "https://www.naukri.com/job-listings-capgemini-senior-qa": "https://www.capgemini.com/careers/",
    "https://www.naukri.com/job-listings-mindtree-angular": "https://www.capgemini.com/careers/",
    "https://www.naukri.com/job-listings-accenture-java-architect": "https://www.accenture.com/in-en/careers",
    
    "https://www.linkedin.com/jobs/view/vercel-frontend-engineer": "https://vercel.com/careers",
    "https://www.indeed.com/viewjob?jk=stripe-full-stack": "https://stripe.com/jobs",
    "https://wellfound.com/jobs/cognitive-labs-founding-engineer": "https://wellfound.com/jobs",
    "https://www.glassdoor.co.in/job-listing/deloitte-qa-automation-lead": "https://www2.deloitte.com/in/en/careers/careers.html",
    "https://www.foundit.in/job/cognizant-cloud-infrastructure": "https://careers.cognizant.com",
    "https://www.shine.com/jobs/capgemini-react-web-developer": "https://www.capgemini.com/careers/",
    "https://unstop.com/internships/hdfc-hackathon-trainee": "https://www.hdfcbank.com/personal/about-us/careers",
    "http://www.twenty19.com/internship/zepto-fullstack-intern": "https://www.zepto.co.in",
    "https://www.hellointern.com/internship/blinkit-uiux-design": "https://blinkit.com/careers",
    "https://www.freshersworld.com/jobs/techmahindra-associate": "https://careers.techmahindra.com",
    "https://www.hackerearth.com/challenges/hiring/ibm-nodejs-developer": "https://www.ibm.com/careers",
    "https://cutshort.io/job/razorpay-tech-lead": "https://razorpay.com/jobs/",
    "https://www.hirect.in/jobs/khatabook-nodejs-backend": "https://khatabook.com/careers",
    "https://internship.aicte-india.org/internship/detail/smart-india": "https://internship.aicte-india.org",
    "https://www.mygov.in/internship/nic-developer": "https://www.mygov.in",
    "https://careers.google.com/jobs/results/google-swe-iii": "https://careers.google.com",
    "https://careers.microsoft.com/us/en/job/microsoft-architect": "https://careers.microsoft.com",
    "https://apna.co/jobs/teleperformance-tech-support": "https://apna.co/jobs",
    "https://www.workindia.in/jobs/prime-database-operator": "https://www.workindia.in",
    "https://www.upwork.com/jobs/react-typescript-consultant": "https://www.upwork.com",
    "https://www.fiverr.com/gigs/wordpress-builder": "https://www.fiverr.com"
  };

  for (const [mockUrl, realUrl] of Object.entries(replacements)) {
    content = content.split(mockUrl).join(realUrl);
  }
  
  fs.writeFileSync(mockPath, content, "utf-8");
  console.log("Mock data URLs fixed successfully.");
} catch (e) {
  console.error("Failed fixing mock-data.ts URLs:", e);
}

// 2. Update providers.ts fallback URLs
try {
  let content = fs.readFileSync(providersPath, "utf-8");
  
  const providerReplacements = {
    "https://www.linkedin.com/jobs/1": "https://www.linkedin.com/jobs/",
    "https://www.indeed.com/jobs/1": "https://in.indeed.com",
    "https://www.internshala.com/jobs/1": "https://internshala.com/internships",
    "https://www.naukri.com/jobs/1": "https://www.naukri.com",
    "https://www.foundit.com/jobs/1": "https://www.foundit.in",
    "https://www.shine.com/jobs/1": "https://www.shine.com",
    "https://www.freshersworld.com/jobs/1": "https://www.freshersworld.com",
    "https://www.apna.com/jobs/1": "https://apna.co/jobs",
    "https://www.placementindia.com/jobs/1": "https://www.placementindia.com",
    "https://www.simplyhired.com/jobs/1": "https://www.simplyhired.co.in",
    "https://www.grabjobs.com/jobs/1": "https://grabjobs.co/india/jobs",
    "https://www.talent.com/jobs/1": "https://in.talent.com"
  };
  
  for (const [mockUrl, realUrl] of Object.entries(providerReplacements)) {
    content = content.split(mockUrl).join(realUrl);
  }
  
  fs.writeFileSync(providersPath, content, "utf-8");
  console.log("Connector providers fallback URLs fixed successfully.");
} catch (e) {
  console.error("Failed fixing providers.ts fallback URLs:", e);
}
