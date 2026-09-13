/**
 * ShivuVerse Certificates Data Source
 * Centralized authentic academic and professional certifications for Shivu.
 */

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  credentialUrl?: string;
  accentColor: string;
  category: "Web" | "Algorithms" | "Cloud" | "Full-Stack";
  description: string;
  skills: string[];
}

export const CERTIFICATES: Certificate[] = [
  {
    id: "meta-front-end",
    title: "Meta Front-End Developer",
    issuer: "Meta / Coursera",
    issueDate: "2024",
    credentialId: "META-FE-89241",
    credentialUrl: "https://coursera.org/verify/professional-cert/shivu-meta-fe",
    accentColor: "#38bdf8", // Sky blue
    category: "Web",
    description:
      "Comprehensive professional specialization covering modern React architectures, JavaScript ES6+, responsive UI systems, component lifecycles, and front-end performance.",
    skills: ["React", "JavaScript", "HTML5/CSS3", "Version Control", "UI Engineering"],
  },
  {
    id: "dsa-specialization",
    title: "Data Structures & Algorithms",
    issuer: "UC San Diego / Coursera",
    issueDate: "2024",
    credentialId: "UCSD-ALGO-44120",
    credentialUrl: "https://coursera.org/verify/specialization/shivu-dsa",
    accentColor: "#fbbf24", // Amber
    category: "Algorithms",
    description:
      "Rigorous foundations in algorithmic design, asymptotic complexity analysis, graph algorithms, dynamic programming, and efficient memory management.",
    skills: ["Algorithms", "Data Structures", "Dynamic Programming", "Graph Theory", "Optimization"],
  },
  {
    id: "aws-cloud-foundations",
    title: "AWS Cloud Foundations",
    issuer: "Amazon Web Services",
    issueDate: "2024",
    credentialId: "AWS-CP-77192",
    credentialUrl: "https://aws.amazon.com/verification/shivu-cloud",
    accentColor: "#f97316", // Warm Orange
    category: "Cloud",
    description:
      "Core cloud computing concepts, infrastructure architecture, managed compute & storage solutions (EC2, S3), security best practices, and IAM role architectures.",
    skills: ["Cloud Computing", "AWS Architecture", "IAM Security", "S3 Storage", "Serverless Basics"],
  },
  {
    id: "full-stack-open",
    title: "Full Stack Open",
    issuer: "University of Helsinki",
    issueDate: "2023",
    credentialId: "UH-FSO-30918",
    credentialUrl: "https://studies.cs.helsinki.fi/stats/api/v1/shivu",
    accentColor: "#a78bfa", // Purple
    category: "Full-Stack",
    description:
      "Deep dive into modern single-page applications, Node.js/Express backends, MongoDB persistence, RESTful APIs, testing with Jest/Cypress, and TypeScript integration.",
    skills: ["Node.js", "Express", "TypeScript", "REST APIs", "Testing"],
  },
];
