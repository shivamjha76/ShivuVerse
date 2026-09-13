/**
 * ShivuVerse Projects Data Source
 * Centralized data for all interactive project displays in the Project Workshop.
 */

export interface Project {
  id: string;
  title: string;
  category: string;
  shortDescription: string;
  technologies: string[];
  status: "In Development" | "Hackathon Project" | "Project";
  link: string | null; // Placeholder: real URL or null
  github: string | null; // Optional source link
  image: string | null; // Architecture prepared for public/projects/<id>.png
  accentColor: string;
  // Local offset [x, z] relative to the workshop center
  offset: [number, number];
  rotationY: number; // Face angle toward the workshop entrance
}

export const PROJECTS: Project[] = [
  {
    id: "hacksphere",
    title: "HackSphere",
    category: "Full Stack / Hackathon Platform",
    shortDescription:
      "An organization-based online hackathon platform designed to manage hackathons, participants, organizers, judges and the complete hackathon lifecycle.",
    technologies: [
      "FastAPI",
      "PostgreSQL",
      "SQLAlchemy",
      "Alembic",
      "JWT",
      "React",
    ],
    status: "In Development",
    link: null, // Placeholder: URL can be added when live
    github: null,
    image: null,
    accentColor: "#38bdf8", // Sky cyan
    offset: [-2.0, 1.2],
    rotationY: 0.35,
  },
  {
    id: "wearwise",
    title: "WearWise",
    category: "Web / AI-assisted Fashion Platform",
    shortDescription:
      "A smart wardrobe and fashion experience designed around clothing organization, styling and an AI-assisted chat experience.",
    technologies: ["React", "JavaScript", "modern web technologies"],
    status: "In Development",
    link: null, // Placeholder: URL can be added when live
    github: null,
    image: null,
    accentColor: "#f472b6", // Rose pink
    offset: [-1.8, -1.3],
    rotationY: 0.65,
  },
  {
    id: "yojanasetu",
    title: "YojanaSetu",
    category: "Citizen-Centric Welfare Discovery",
    shortDescription:
      "A citizen-centric welfare discovery platform that helps users understand which government schemes they may qualify for, why they qualify, and what to do next.",
    technologies: ["Next.js", "Python", "FastAPI", "Tailwind CSS", "Govt Scheme API"],
    status: "Hackathon Project",
    link: null, // Placeholder: URL can be added when live
    github: null,
    image: null,
    accentColor: "#fbbf24", // Warm amber
    offset: [1.8, -1.3],
    rotationY: -0.65,
  },
  {
    id: "jnu-chatbot",
    title: "JNU Chatbot",
    category: "College Information Chatbot",
    shortDescription:
      "A college information chatbot that provides students with quick answers using a structured university knowledge base and FastAPI backend.",
    technologies: ["FastAPI", "JSON knowledge base"],
    status: "Project",
    link: null, // Placeholder: URL can be added when live
    github: null,
    image: null,
    accentColor: "#34d399", // Emerald
    offset: [2.0, 1.2],
    rotationY: -0.35,
  },
];
