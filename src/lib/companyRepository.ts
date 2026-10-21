/**
 * Data access layer. Phase 1 reads the hardcoded seed; Phase 2 swaps the
 * bodies below for database queries returning the same raw JSON shapes.
 */
import { queryOptions } from "@tanstack/react-query";

import { SEED_COMPANIES, type SeedCompany } from "@/data/seedCompanies";
import { SKILL_TOPICS } from "@/data/skillTopics";
import {
  normalizeCompanyProfile,
  normalizeCompanySummary,
  normalizeDashboardSkills,
  type CompanyProfile,
  type CompanySummary,
  type DashboardSkill,
} from "@/lib/companyData";

export function findSeedCompany(id: number): SeedCompany | undefined {
  return SEED_COMPANIES.find((c) => c.company_id === id);
}

export function getCompanySummaries(): CompanySummary[] {
  return SEED_COMPANIES.map((c) => normalizeCompanySummary(c.short_json, c.company_id));
}

export function getCompanyProfile(id: number): CompanyProfile | undefined {
  const c = findSeedCompany(id);
  return c ? normalizeCompanyProfile(c.full_json, c.short_json, c.company_id) : undefined;
}

export function getCompanySkills(id: number): DashboardSkill[] {
  const c = findSeedCompany(id);
  return c ? normalizeDashboardSkills(c.skill_levels, SKILL_TOPICS) : [];
}

export const companiesQueryOptions = queryOptions({
  queryKey: ["companies"],
  queryFn: async () => getCompanySummaries(),
});
