export interface UserProfile {
    id?: string;
    name: string;
    github: string;
    role: "Frontend" | "Backend" | "Fullstack" | "Designer" | "DevOps" | "Product";
    skills: string[];
    style: "Builder" | "Designer" | "Thinker" | "Hustler";
    company?: string;      // Current company (e.g. "Google", "Vercel")
    canRefer?: boolean;    // Whether they can provide referrals
    avatar?: string;
}

export interface MatchResult {
    user: UserProfile;
    score: number;
    reasons: string[];
    dna: {
        type: string;
        strength: string;
    };
    radar: {
        technical: number;
        complementary: number;
        experience: number;
        style: number;
        velocity: number;
    };
}

export function calculateMatch(current: UserProfile, target: UserProfile): MatchResult {
    let score = 0;
    const reasons: string[] = [];

    // 1. Target Company / Referral Alignment (35%)
    let referralScore = 0;
    if (target.canRefer && target.company) {
        referralScore = 35;
        reasons.push(`Can refer you at ${target.company}`);
    } else if (target.company) {
        referralScore = 20;
        reasons.push(`Works at target company: ${target.company}`);
    } else {
        referralScore = 10;
    }
    score += referralScore;

    // 2. Technical Skill Synergy (35%)
    const overlap = current.skills.filter(s => target.skills.includes(s));
    const skillScore = Math.min((overlap.length / Math.max(current.skills.length, 1)) * 35, 35);
    if (overlap.length > 0) {
        reasons.push(`Shared tech DNA: ${overlap.slice(0, 2).join(", ")}`);
    } else {
        reasons.push(`Complementary tech stacks`);
    }
    score += skillScore;

    // 3. Role Complementarity (30%)
    let roleScore = 0;
    const complementaryRoles: Record<string, string[]> = {
        "Frontend": ["Backend", "Designer", "Product"],
        "Backend": ["Frontend", "DevOps", "Fullstack"],
        "Fullstack": ["Frontend", "Backend", "Product"],
        "Designer": ["Frontend", "Fullstack"],
        "DevOps": ["Backend", "Fullstack"],
        "Product": ["Fullstack", "Designer"]
    };

    if (complementaryRoles[current.role]?.includes(target.role)) {
        roleScore = 30;
        reasons.push(`Great role complementarity (${current.role} + ${target.role})`);
    } else if (current.role === target.role) {
        roleScore = 15;
        reasons.push(`Shared ${current.role} specialization for peer advice`);
    } else {
        roleScore = 20;
    }
    score += roleScore;

    // DNA Inference
    const dnaType = target.canRefer ? "Referrer Catalyst" : "Industry Peer";
    const dnaStrength = target.skills.length > 3 ? "Multi-Disciplinary" : "Specialized Focus";

    return {
        user: target,
        score: Math.round(score),
        reasons,
        dna: {
            type: dnaType,
            strength: dnaStrength
        },
        radar: {
            technical: Math.round((skillScore / 35) * 100),
            complementary: Math.round((roleScore / 30) * 100),
            experience: 80 + Math.floor(Math.random() * 20),
            style: target.canRefer ? 95 : 75,
            velocity: 85
        }
    };
}

export const MOCK_USERS: UserProfile[] = [
    {
        id: "user-1",
        name: "Alex River",
        github: "ariver_dev",
        role: "Backend",
        skills: ["Node.js", "Python", "PostgreSQL", "Redis"],
        style: "Builder",
        company: "Google",
        canRefer: true,
        avatar: "A"
    },
    {
        id: "user-2",
        name: "Sarah Chen",
        github: "schen_design",
        role: "Designer",
        skills: ["Figma", "React", "TailwindCSS", "Framer Motion"],
        style: "Designer",
        company: "Meta",
        canRefer: true,
        avatar: "S"
    },
    {
        id: "user-3",
        name: "Marcus Thorne",
        github: "mthorne_lead",
        role: "Fullstack",
        skills: ["React", "Go", "Kubernetes", "AWS"],
        style: "Thinker",
        company: "Vercel",
        canRefer: false,
        avatar: "M"
    },
    {
        id: "user-4",
        name: "Jasmine Lee",
        github: "jlee_hustle",
        role: "Product",
        skills: ["Strategy", "Market Analysis", "User Research", "Agile"],
        style: "Hustler",
        company: "Netflix",
        canRefer: true,
        avatar: "J"
    },
    {
        id: "user-5",
        name: "Rahul Verma",
        github: "rahulv_code",
        role: "Backend",
        skills: ["Go", "Docker", "AWS", "MongoDB"],
        style: "Builder",
        company: "Microsoft",
        canRefer: false,
        avatar: "R"
    },
    {
        id: "user-6",
        name: "Priya Nair",
        github: "priya_ml",
        role: "Fullstack",
        skills: ["Python", "TensorFlow", "React", "FastAPI"],
        style: "Thinker",
        company: "Google",
        canRefer: false,
        avatar: "P"
    }
];
