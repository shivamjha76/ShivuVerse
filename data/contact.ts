/**
 * ShivuVerse Contact & Conclusion Data Source
 * Centralized configuration for the Final Contact Viewpoint and concluding message.
 */

export interface ContactAction {
  id: "email" | "linkedin" | "github";
  label: string;
  value: string; // url or mailto link
  displayValue: string;
  icon: "email" | "linkedin" | "github";
  accentColor: string;
  description: string;
  isExternal: boolean;
}

export const CONTACT_DATA = {
  heading: "Let's build something together.",
  subtext:
    "Have an idea, opportunity, or project in mind? I'd love to hear from you.",
  signoff: {
    message: "Thanks for exploring ShivuVerse.",
    author: "— Shivu",
  },
  actions: [
    {
      id: "email",
      label: "Email Me",
      value: "mailto:shivu.dev.placeholder@gmail.com", // Replace with your actual email
      displayValue: "shivu.dev@example.com",
      icon: "email",
      accentColor: "#38bdf8", // Cyan
      description: "Direct inquiries, collaborations & opportunities",
      isExternal: false,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      value: "https://linkedin.com/in/shivu-cs", // Replace with your actual profile
      displayValue: "in/shivu-cs",
      icon: "linkedin",
      accentColor: "#818cf8", // Indigo
      description: "Connect on LinkedIn for professional networking",
      isExternal: true,
    },
    {
      id: "github",
      label: "GitHub",
      value: "https://github.com/shivu-dev", // Replace with your actual profile
      displayValue: "@shivu-dev",
      icon: "github",
      accentColor: "#fbbf24", // Amber
      description: "Explore my source code and personal repositories",
      isExternal: true,
    },
  ] as ContactAction[],
};
