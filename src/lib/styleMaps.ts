import type { BloomLevel, CompanyType, Criticality, Difficulty } from "@/lib/companyData";

/** Literal class names so Tailwind keeps them. */
export const CATEGORY_STYLES: Record<
  CompanyType,
  { badge: string; pillActive: string; pillIdle: string; dot: string }
> = {
  "Super Dream": {
    badge: "bg-super-dream/10 text-super-dream border-super-dream/25",
    pillActive: "bg-super-dream text-primary-foreground border-super-dream",
    pillIdle: "text-super-dream border-super-dream/30 hover:bg-super-dream/10",
    dot: "bg-super-dream",
  },
  Dream: {
    badge: "bg-dream/10 text-dream border-dream/25",
    pillActive: "bg-dream text-primary-foreground border-dream",
    pillIdle: "text-dream border-dream/30 hover:bg-dream/10",
    dot: "bg-dream",
  },
  Standard: {
    badge: "bg-standard/10 text-standard border-standard/25",
    pillActive: "bg-standard text-primary-foreground border-standard",
    pillIdle: "text-standard border-standard/30 hover:bg-standard/10",
    dot: "bg-standard",
  },
  Regular: {
    badge: "bg-regular/10 text-regular border-regular/25",
    pillActive: "bg-regular text-primary-foreground border-regular",
    pillIdle: "text-regular border-regular/30 hover:bg-regular/10",
    dot: "bg-regular",
  },
};

export const BLOOM_META: Record<
  BloomLevel,
  { label: string; range: string; text: string; tint: string; bar: string; border: string }
> = {
  CU: { label: "Comprehend & Understand", range: "Levels 1–2", text: "text-bloom-cu", tint: "bg-bloom-cu/10", bar: "bg-bloom-cu", border: "border-bloom-cu/30" },
  AP: { label: "Apply", range: "Levels 3–4", text: "text-bloom-ap", tint: "bg-bloom-ap/10", bar: "bg-bloom-ap", border: "border-bloom-ap/30" },
  AS: { label: "Analyse & Synthesise", range: "Levels 5–6", text: "text-bloom-as", tint: "bg-bloom-as/10", bar: "bg-bloom-as", border: "border-bloom-as/30" },
  EV: { label: "Evaluate", range: "Levels 7–8", text: "text-bloom-ev", tint: "bg-bloom-ev/10", bar: "bg-bloom-ev", border: "border-bloom-ev/30" },
  CR: { label: "Create", range: "Levels 9–10", text: "text-bloom-cr", tint: "bg-bloom-cr/10", bar: "bg-bloom-cr", border: "border-bloom-cr/30" },
};

export const CRITICALITY_META: Record<Criticality, { range: string; description: string; text: string; tint: string }> = {
  Critical: { range: "Score ≥ 7", description: "Must be interview-ready; tested in every round.", text: "text-expert", tint: "bg-expert/10" },
  Important: { range: "Score 5–6", description: "Expected working knowledge; often probed.", text: "text-regular", tint: "bg-regular/10" },
  Baseline: { range: "Score < 5", description: "Foundational awareness is sufficient.", text: "text-beginner", tint: "bg-beginner/10" },
};

export const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  EXPERT: "bg-expert/10 text-expert",
  ADVANCED: "bg-advanced/10 text-advanced",
  PRO: "bg-pro/10 text-pro",
  BEGINNER: "bg-beginner/10 text-beginner",
};
