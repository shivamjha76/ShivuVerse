/**
 * ShivuVerse Skills & Technologies Data Source
 * Centralized data for all skills physically hanging from the ancient Knowledge Tree.
 * Easily extensible: add any new skill here and the Knowledge Tree will automatically hang it!
 */

export type SkillCategory =
  | "Core CS"
  | "Programming"
  | "Web Development"
  | "Backend"
  | "Database"
  | "Tools"
  | "Security";

export type TreeBranchId =
  | "roots"
  | "core-cs"
  | "programming"
  | "web"
  | "backend"
  | "database"
  | "tools";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  branch: TreeBranchId;
  description: string;
  accentColor: string;
}

export const SKILLS: Skill[] = [
  // 1. Core Computer Science Fundamentals
  {
    id: "dsa",
    name: "DSA",
    category: "Core CS",
    branch: "core-cs",
    description:
      "Data Structures & Algorithms for optimal time and space complexity problem-solving.",
    accentColor: "#38bdf8", // Sky blue
  },
  {
    id: "dbms",
    name: "DBMS",
    category: "Core CS",
    branch: "core-cs",
    description:
      "Database Management Systems, relational design, normalization, and ACID transactions.",
    accentColor: "#38bdf8",
  },
  {
    id: "sql",
    name: "SQL",
    category: "Core CS",
    branch: "core-cs",
    description:
      "Structured Query Language for complex joins, aggregations, and schema definitions.",
    accentColor: "#38bdf8",
  },
  {
    id: "os",
    name: "Operating Systems",
    category: "Core CS",
    branch: "core-cs",
    description:
      "Process management, threads, concurrency, deadlocks, and virtual memory.",
    accentColor: "#38bdf8",
  },
  {
    id: "cn",
    name: "Computer Networks",
    category: "Core CS",
    branch: "core-cs",
    description:
      "OSI & TCP/IP models, routing protocols, DNS, HTTP/HTTPS, and socket communication.",
    accentColor: "#38bdf8",
  },

  // 2. Programming Languages
  {
    id: "c",
    name: "C",
    category: "Programming",
    branch: "programming",
    description:
      "Foundational systems programming, manual memory management, pointers, and structures.",
    accentColor: "#fb923c", // Warm orange
  },
  {
    id: "cpp",
    name: "C++",
    category: "Programming",
    branch: "programming",
    description:
      "Object-oriented programming, STL containers, templates, and competitive programming.",
    accentColor: "#fb923c",
  },

  // 3. Web Development
  {
    id: "html",
    name: "HTML",
    category: "Web Development",
    branch: "web",
    description:
      "Semantic HTML5 structuring, web accessibility standards, and document architecture.",
    accentColor: "#f472b6", // Rose
  },
  {
    id: "css",
    name: "CSS",
    category: "Web Development",
    branch: "web",
    description:
      "Modern responsive design, Flexbox, CSS Grid, media queries, and transitions.",
    accentColor: "#f472b6",
  },
  {
    id: "javascript",
    name: "JavaScript",
    category: "Web Development",
    branch: "web",
    description:
      "Modern ES6+, asynchronous promises, event loop, closures, and DOM manipulation.",
    accentColor: "#f472b6",
  },
  {
    id: "react",
    name: "React",
    category: "Web Development",
    branch: "web",
    description:
      "Component-based architecture, state hooks, lifecycle management, and virtual DOM rendering.",
    accentColor: "#f472b6",
  },

  // 4. Backend Engineering & APIs
  {
    id: "fastapi",
    name: "FastAPI",
    category: "Backend",
    branch: "backend",
    description:
      "High-performance asynchronous Python REST APIs with automatic OpenAPI docs.",
    accentColor: "#34d399", // Emerald
  },
  {
    id: "rest-apis",
    name: "REST APIs",
    category: "Backend",
    branch: "backend",
    description:
      "Stateless API design, HTTP verbs, status codes, JSON serialization, and endpoints.",
    accentColor: "#34d399",
  },
  {
    id: "jwt",
    name: "JWT Auth",
    category: "Security",
    branch: "backend",
    description:
      "JSON Web Tokens for secure stateless user authentication and role-based access.",
    accentColor: "#34d399",
  },

  // 5. Database & ORMs
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "Database",
    branch: "database",
    description:
      "Advanced open-source relational database, indexing, foreign keys, and query optimization.",
    accentColor: "#a78bfa", // Purple/violet
  },
  {
    id: "sqlalchemy",
    name: "SQLAlchemy",
    category: "Database",
    branch: "database",
    description:
      "Enterprise Python SQL toolkit and Object Relational Mapper for database abstraction.",
    accentColor: "#a78bfa",
  },
  {
    id: "alembic",
    name: "Alembic",
    category: "Database",
    branch: "database",
    description:
      "Database schema migration management and version control for SQLAlchemy.",
    accentColor: "#a78bfa",
  },

  // 6. Tools & Workflows
  {
    id: "git",
    name: "Git",
    category: "Tools",
    branch: "tools",
    description:
      "Distributed version control, branching strategies, rebasing, and merge resolution.",
    accentColor: "#facc15", // Gold
  },
  {
    id: "github",
    name: "GitHub",
    category: "Tools",
    branch: "tools",
    description:
      "Git remote repositories, collaborative pull requests, issue tracking, and CI/CD.",
    accentColor: "#facc15",
  },
];
