export const personalInfo = {
  name: "Vignesh Suvarna",
  fullName: "Vignesh S Suvarna",
  role: "B.E. Computer Science & Engineering",
  university: "Atria Institute of Technology",
  shortBio: "Full-stack software architect & applied AI builder focused on backend scalability, asynchronous processing, and low-latency systems.",
  profilePicture: "/profile.jpg",
  email: "1at24cs251@atria.edu",
  githubHandle: "VigneshSSuvarna",
  codeforcesHandle: "VigneshSSuvarna",
  resumePath: "/resume.pdf",
  initialVisitorCount: 198,
  cfBaselineDate: new Date(2025, 10, 20).getTime(), // Nov 20, 2025
  cfFallbackRating: 581
};

// ... keep the rest of the file (VALID_PAGES, PAGE_TITLES, projectsData, etc.) exactly as is

export const VALID_PAGES = [
  'home',
  'projects',
  'sama-foundation',
  'cit-hearingaid',
  'project-ai-chatbox',
  'project-hiresphere',
  'project-hermes',
  'project-kalki'
];

export const PAGE_TITLES = {
  'home': 'Vignesh Suvarna | Software Architect & Applied AI Builder',
  'projects': 'Projects | Vignesh Suvarna',
  'sama-foundation': 'Nayi Disha Platform — Case Study | Vignesh Suvarna',
  'cit-hearingaid': 'HearingAid Pro — Case Study | Vignesh Suvarna',
  'project-ai-chatbox': 'AI-PDF-CHATBOX — Case Study | Vignesh Suvarna',
  'project-hiresphere': 'HireSphere & PlaceOS — Case Study | Vignesh Suvarna',
  'project-hermes': 'HERMES — Case Study | Vignesh Suvarna',
  'project-kalki': 'Kalki — Case Study | Vignesh Suvarna'
};

export const projectsData = [
  {
    id: 1,
    title: "Nayi Disha Platform",
    category: "Full-Stack Web App",
    description: "Full-stack web application with user authentication and database integration.",
    techStack: ["Node.js", "Express", "PostgreSQL", "React"],
    github: "https://github.com/Nayi-Disha-Org/Nayi-Disha.git",
    demo: "https://nayi-disha-web.vercel.app",
    pageKey: "sama-foundation"
  },
  {
    id: 2,
    title: "AI-PDF-CHATBOX",
    category: "Applied AI",
    description: "High-performance RAG system designed to eliminate LLM hallucinations by grounding responses in private local documents.",
    techStack: ["Python", "LangChain", "PyPDF", "FastAPI", "ChromaDB"],
    github: "https://github.com/VigneshSSuvarna/AI-PDF-CHATBOX.git",
    demo: "https://ai-pdf-chatboxgit-bbhsv8xdll7e3vz498pf6n.streamlit.app/",
    pageKey: "project-ai-chatbox"
  },
  {
    id: 3,
    title: "HireSphere & PlaceOS",
    category: "Full-Stack Web App",
    description: "Full-stack platforms modernizing university placements, providing a unified workspace for students and administrators.",
    techStack: ["TypeScript", "React", "Express"],
    github: "https://github.com/VigneshSSuvarna/HireSphere.git",
    demo: "#",
    pageKey: "project-hiresphere"
  },
  {
    id: 4,
    title: "HERMES",
    category: "Applied AI",
    description: "An asynchronous, voice-activated personal AI companion and desktop automation engine.",
    techStack: ["Python", "asyncio"],
    github: "https://github.com/VigneshSSuvarna/HERMES.git",
    demo: "#",
    pageKey: "project-hermes"
  },
  {
    id: 5,
    title: "HearingAid",
    category: "Android App",
    description: "A Kotlin-based Android assistive audio application designed to amplify real-time sound and improve hearing accessibility.",
    techStack: ["Kotlin", "Android"],
    github: "https://github.com/VigneshSSuvarna/HearingAid.git",
    demo: "#",
    pageKey: "cit-hearingaid"
  },
  
  {
  id: 6,
  title: "Kalki",
  category: "Systems & AIOps",
  description: "Two-tier, zero-raw-egress fleet telemetry and AIOps platform with edge secret scrubbing, durable disk WAL, SHA-256 egress proofs, and a real-time SSE operations console.",
  techStack: ["Go", "React", "TypeScript", "PostgreSQL", "SSE", "Recharts"],
  github: "https://github.com/VigneshSSuvarna/kalki",
  demo: "https://kalki-systems.vercel.app/",
  pageKey: "project-kalki"
}
  
];

export const experienceData = [
  {
    id: 1,
    organization: "Sama Foundation",
    role: "Full-Stack Developer",
    description: "Developing full-stack web applications and digital infrastructure to support community outreach and NGO management operations.",
    projectTitle: "Nayi Disha Care & Support Platform",
    pageKey: "sama-foundation"
  },
  {
    id: 2,
    organization: "Dr. S. R. Chandrasekhar Institute of Speech and Hearing",
    role: "Project Team Lead",
    description: "Leading the development team building assistive audio applications and institutional software to improve hearing accessibility.",
    projectTitle: "HearingAid Pro",
    pageKey: "cit-hearingaid"
  }
];

export const achievementsData = [
  {
    id: 1,
    title: "Project Team Lead — HearingAid Pro Initiative",
    subtitle: "Dr. S. R. Chandrasekhar Institute of Speech and Hearing",
    description: "Leading a student engineering team developing a low-latency Android assistive audio application with custom digital signal processing."
  },
  {
    id: 2,
    title: "Full-Stack Developer — Nayi Disha Care Platform",
    subtitle: "Sama Foundation NGO",
    description: "Architecting role-based web portals and real-time hardware telemetry integrations to support special needs care networks."
  },
  {
    id: 3,
    title: "Competitive Programming",
    subtitle: "Atria Institute of Technology",
    description: "Active algorithmic problem solver on Codeforces, practicing data structures, greedy algorithms, and optimization in C++ and Python."
  }
];

export const skillsData = [
  {
    category: "Languages",
    items: ["Python", "JavaScript", "TypeScript", "C++", "C", "Java", "Kotlin", "SQL"]
  },
  {
    category: "Frontend",
    items: ["React.js", "Vite", "Tailwind CSS", "HTML5", "CSS3", "Streamlit"]
  },
  {
    category: "Backend & APIs",
    items: ["Node.js", "Express.js", "REST APIs", "Python asyncio", "JDBC"]
  },
  {
    category: "Databases",
    items: ["PostgreSQL", "MySQL", "phpMyAdmin"]
  },
  {
    category: "AI & Data",
    items: ["RAG Architecture", "LangChain", "LLMs", "PyPDF", "Pandas"]
  },
  {
    category: "Cloud & Tools",
    items: ["Git", "GitHub", "Vercel", "Render", "Postman", "VS Code", "Android"]
  }
];

export const INITIAL_CF_SUBMISSIONS = {
  "2025-11-20": 2,
  "2026-03-31": 1,
  "2026-04-03": 2,
  "2026-04-04": 2,
  "2026-05-13": 2,
  "2026-05-18": 2
};

export const INITIAL_CF_RATING_HISTORY = [
  {
    contestId: 1,
    contestName: "Codeforces Round (Div. 4)",
    dateStr: "2025-11-20",
    timestamp: new Date(2025, 10, 20).getTime(),
    oldRating: 0,
    newRating: 385
  },
  {
    contestId: 2,
    contestName: "Codeforces Round (Div. 3)",
    dateStr: "2026-04-04",
    timestamp: new Date(2026, 3, 4).getTime(),
    oldRating: 385,
    newRating: 581
  }
];