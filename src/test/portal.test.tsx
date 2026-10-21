import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { buildIntelligenceSections } from "@/data/intelligenceData";
import { SEED_COMPANIES } from "@/data/seedCompanies";
import { SKILL_TOPICS } from "@/data/skillTopics";
import {
  isNullish,
  normalizeCompanyProfile,
  normalizeDashboardSkills,
  proficiencyToBloom,
  scoreToCriticality,
  scoreToDifficulty,
} from "@/lib/companyData";
import { routeTree } from "@/routeTree.gen";

const makeRouter = () => createRouter({ routeTree, context: { queryClient: new QueryClient() } });

describe("routing", () => {
  it("serves /company/intelligence and /company/skills", () => {
    const router = makeRouter();
    expect(router.matchRoutes("/company/intelligence").at(-1)?.routeId).toBe("/company/intelligence");
    expect(router.matchRoutes("/company/skills").at(-1)?.routeId).toBe("/company/skills");
  });

  it("has no /login or /dashboard page", () => {
    const router = makeRouter();
    for (const path of ["/login", "/dashboard"]) {
      expect(router.matchRoutes(path).at(-1)?.routeId).toBe(rootRouteId);
    }
  });
});

describe("skill rules", () => {
  it("maps proficiency to Bloom levels", () => {
    expect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(proficiencyToBloom)).toEqual([
      "CU", "CU", "AP", "AP", "AS", "AS", "EV", "EV", "CR", "CR",
    ]);
  });

  it("maps score to criticality (>=7 Critical, >=5 Important, else Baseline)", () => {
    expect(scoreToCriticality(7)).toBe("Critical");
    expect(scoreToCriticality(6)).toBe("Important");
    expect(scoreToCriticality(5)).toBe("Important");
    expect(scoreToCriticality(4)).toBe("Baseline");
  });

  it("maps score to difficulty (>=8 EXPERT, >=6 ADVANCED, >=4 PRO)", () => {
    expect(scoreToDifficulty(8)).toBe("EXPERT");
    expect(scoreToDifficulty(6)).toBe("ADVANCED");
    expect(scoreToDifficulty(4)).toBe("PRO");
    expect(scoreToDifficulty(3)).toBe("BEGINNER");
  });
});

describe("seed data", () => {
  const seed = SEED_COMPANIES[0];

  it("builds 22 intelligence sections with no CTC / stipend / selection ratio fields", () => {
    const profile = normalizeCompanyProfile(seed.full_json, seed.short_json, seed.company_id);
    const sections = buildIntelligenceSections(profile);
    expect(sections).toHaveLength(22);
    const labels = sections.flatMap((s) => s.fields.map((f) => `${f.key} ${f.label}`)).join(" ");
    expect(labels).not.toMatch(/ctc|stipend|selection.?ratio/i);
  });

  it("gives all 12 skills a 10-level roadmap, sorted by level descending", () => {
    const skills = normalizeDashboardSkills(seed.skill_levels, SKILL_TOPICS);
    expect(skills).toHaveLength(12);
    expect(skills[0].name).toBe("Data Structures & Algorithms");
    for (const s of skills) expect(s.topics).toHaveLength(10);
  });

  it("treats NA-style values as not available", () => {
    for (const v of ["NA", "n/a", "none", "-", "null", "undefined", ""]) expect(isNullish(v)).toBe(true);
    expect(isNullish("4.1/5")).toBe(false);
  });
});
