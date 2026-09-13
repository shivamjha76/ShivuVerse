/**
 * ShivuVerse About Data Source
 * Centralized biographical content for the About Me sanctuary.
 */

export interface AboutContent {
  name: string;
  role: string;
  shortBio: string;
  philosophy: string;
  focusAreas: string[];
}

export const ABOUT_DATA: AboutContent = {
  name: "Shivu",
  role: "Computer Science Student & Developer",
  shortBio:
    "I'm a Computer Science student focused on building strong foundations in software development, problem solving and modern web technologies.",
  philosophy:
    "I enjoy turning ideas into real products, exploring new technologies and learning by building.",
  focusAreas: [
    "Full-Stack Web Development",
    "Data Structures & Algorithmic Foundations",
    "Scalable Backend Architectures & RESTful APIs",
    "Interactive 3D Web & Modern UI Systems",
  ],
};
