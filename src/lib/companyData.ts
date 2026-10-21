/**
 * Pure normalizers. Inputs are the raw JSON shapes (short_json / full_json /
 * skill-level rows) so the Phase 2 database rows can be piped in untouched.
 */

export type CompanyType = "Super Dream" | "Dream" | "Standard" | "Regular";
export const COMPANY_TYPES: CompanyType[] = ["Super Dream", "Dream", "Standard", "Regular"];

export type BloomLevel = "CU" | "AP" | "AS" | "EV" | "CR";
export type Criticality = "Critical" | "Important" | "Baseline";
export type Difficulty = "EXPERT" | "ADVANCED" | "PRO" | "BEGINNER";

export interface CompanySummary {
  id: number;
  name: string;
  shortName: string;
  logoUrl: string;
  category: string;
  companyType: CompanyType;
  incorporationYear: string;
  employeeSize: string;
  headquarters: string;
  operatingCountries: string;
  officeLocations: string;
  yoyGrowthRate: string;
  websiteUrl: string;
}

/** Every profile field (keys of full_json) the portal knows about. */
export const PROFILE_FIELD_KEYS = [
  // identity & overview
  "name", "short_name", "category", "incorporation_year", "nature_of_company", "overview_text",
  "headquarters_address", "operating_countries", "office_count", "office_locations", "employee_size",
  "vision_statement", "mission_statement", "core_values", "history_timeline", "recent_news",
  // digital presence
  "website_url", "linkedin_url", "twitter_handle", "facebook_url", "instagram_url",
  "primary_contact_email", "primary_phone_number",
  // risk & compliance
  "regulatory_status", "legal_issues", "esg_ratings", "supply_chain_dependencies",
  "geopolitical_risks", "macro_risks", "carbon_footprint", "ethical_sourcing",
  // brand & ratings
  "marketing_video_url", "customer_testimonials", "website_quality", "website_rating",
  "website_traffic_rank", "social_media_followers", "glassdoor_rating", "indeed_rating",
  "google_rating", "awards_recognitions", "brand_sentiment_score", "event_participation",
  // products & market
  "pain_points_addressed", "focus_sectors", "offerings_description", "top_customers",
  "core_value_proposition", "unique_differentiators", "competitive_advantages", "weaknesses_gaps",
  "key_challenges_needs", "key_competitors", "market_share_percentage", "sales_motion",
  "customer_concentration_risk", "exit_strategy_history", "benchmark_vs_peers",
  "future_projections", "strategic_priorities", "industry_associations", "case_studies",
  "go_to_market_strategy", "innovation_roadmap", "product_pipeline", "tam", "sam", "som",
  // culture & benefits
  "leave_policy", "health_support", "fixed_vs_variable_pay", "bonus_predictability",
  "esops_incentives", "family_health_insurance", "relocation_support", "lifestyle_benefits",
  "hiring_velocity", "employee_turnover", "avg_retention_tenure", "diversity_metrics",
  "work_culture_summary", "manager_quality", "psychological_safety", "feedback_culture",
  "diversity_inclusion_score", "ethical_standards", "burnout_risk", "layoff_history",
  "mission_clarity", "sustainability_csr", "crisis_behavior",
  // funding & financials
  "annual_revenue", "annual_profit", "revenue_mix", "valuation", "yoy_growth_rate",
  "profitability_status", "key_investors", "recent_funding_rounds", "total_capital_raised",
  "customer_acquisition_cost", "customer_lifetime_value", "cac_ltv_ratio", "churn_rate",
  "net_promoter_score", "burn_rate", "runway_months", "burn_multiplier",
  // work location & safety
  "remote_policy_details", "typical_hours", "overtime_expectations", "weekend_work",
  "flexibility_level", "location_centrality", "public_transport_access", "cab_policy",
  "airport_commute_time", "office_zone_type", "area_safety", "safety_policies",
  "infrastructure_safety", "emergency_preparedness",
  // leadership & contact
  "ceo_name", "ceo_linkedin_url", "key_leaders", "warm_intro_pathways", "decision_maker_access",
  "contact_person_name", "contact_person_title", "contact_person_email", "contact_person_phone",
  "board_members",
  // career growth
  "training_spend", "onboarding_quality", "learning_culture", "exposure_quality",
  "mentorship_availability", "internal_mobility", "promotion_clarity", "tools_access",
  "role_clarity", "early_ownership", "work_impact", "execution_thinking_balance",
  "automation_level", "cross_functional_exposure", "company_maturity", "brand_value",
  "client_quality", "exit_opportunities", "skill_relevance", "external_recognition",
  "network_strength", "global_exposure",
  // tech
  "technology_partners", "intellectual_property", "r_and_d_investment", "ai_ml_adoption_level",
  "tech_stack", "cybersecurity_posture", "partnership_ecosystem", "tech_adoption_rating",
  // from short_json
  "logo_url", "company_type",
] as const;

export type ProfileFieldKey = (typeof PROFILE_FIELD_KEYS)[number];

/** Fields that must never be displayed anywhere in the portal. */
export const FORBIDDEN_FIELD_PATTERN = /(ctc|stipend|selection[_\s-]?ratio)/i;

export interface CompanyProfile {
  id: number;
  summary: CompanySummary;
  fields: Record<ProfileFieldKey, string>;
}

export interface DashboardSkill {
  id: number;
  name: string;
  requiredLevel: number;
  proficiency: string;
  bloom: BloomLevel;
  criticality: Criticality;
  difficulty: Difficulty;
  topics: { level: number; topic: string }[];
}

/* ------------------------------------------------------------------ helpers */

export function asString(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(asString).filter(Boolean).join("; ");
  return "";
}

export function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }
  return {};
}

/** Split free text into items on newlines, sentence periods, semicolons and bullets. */
export function splitItems(value: string): string[] {
  return value
    .split(/\r?\n|;|•|·|\u2022|\.\s+(?=[A-Z])/)
    .map((s) => s.replace(/^[\s\-*–]+/, "").replace(/\.$/, "").trim())
    .filter(Boolean);
}

export function titleCaseFromCode(code: string): string {
  const acronyms: Record<string, string> = {
    ceo: "CEO", tam: "TAM", sam: "SAM", som: "SOM", esg: "ESG", csr: "CSR", ai: "AI",
    ml: "ML", url: "URL", cac: "CAC", ltv: "LTV", yoy: "YoY", esops: "ESOPs", r: "R",
    d: "D", it: "IT", opd: "OPD",
  };
  return code
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((w) => acronyms[w.toLowerCase()] ?? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ")
    .replace(/\bR And D\b/, "R&D")
    .replace(/\bAnd\b/g, "&")
    .replace(/\bVs\b/g, "vs");
}

const NULLISH = new Set(["", "na", "n/a", "none", "-", "null", "undefined", "nil"]);
export function isNullish(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  return NULLISH.has(asString(value).toLowerCase());
}

export function scoreToDifficulty(score: number): Difficulty {
  if (score >= 8) return "EXPERT";
  if (score >= 6) return "ADVANCED";
  if (score >= 4) return "PRO";
  return "BEGINNER";
}

export function proficiencyToBloom(level: number): BloomLevel {
  if (level <= 2) return "CU";
  if (level <= 4) return "AP";
  if (level <= 6) return "AS";
  if (level <= 8) return "EV";
  return "CR";
}

export function scoreToCriticality(score: number): Criticality {
  if (score >= 7) return "Critical";
  if (score >= 5) return "Important";
  return "Baseline";
}

export function normalizeCompanyType(value: unknown): CompanyType {
  const v = asString(value).toLowerCase().replace(/[_-]/g, " ").trim();
  if (v === "super dream" || v === "superdream") return "Super Dream";
  if (v === "dream") return "Dream";
  if (v === "standard") return "Standard";
  return "Regular";
}

/* -------------------------------------------------------------- normalizers */

export function normalizeCompanySummary(shortJson: unknown, id = 0): CompanySummary {
  const s = asRecord(shortJson);
  const name = asString(s.name);
  return {
    id: Number(s.company_id ?? id) || id,
    name,
    shortName: asString(s.short_name) || name,
    logoUrl: asString(s.logo_url),
    category: asString(s.category),
    companyType: normalizeCompanyType(s.company_type),
    incorporationYear: asString(s.incorporation_year),
    employeeSize: asString(s.employee_size),
    headquarters: asString(s.headquarters_address),
    operatingCountries: asString(s.operating_countries),
    officeLocations: asString(s.office_locations),
    yoyGrowthRate: asString(s.yoy_growth_rate),
    websiteUrl: asString(s.website_url),
  };
}

export function normalizeCompanyProfile(
  fullJson: unknown,
  shortJson: unknown,
  id = 0,
): CompanyProfile {
  const full = asRecord(fullJson);
  const short = asRecord(shortJson);
  const fields = {} as Record<ProfileFieldKey, string>;
  for (const key of PROFILE_FIELD_KEYS) {
    fields[key] = asString(full[key] ?? short[key]);
  }
  return { id, summary: normalizeCompanySummary(short, id), fields };
}

export function normalizeDashboardSkills(
  skillLevels: unknown[],
  topicsBySkill: Record<number, { level_number: number; topic: string }[]> = {},
): DashboardSkill[] {
  return (Array.isArray(skillLevels) ? skillLevels : [])
    .map((raw) => {
      const r = asRecord(raw);
      const id = Number(r.skill_set_id) || 0;
      const level = Math.max(0, Math.min(10, Number(r.required_level) || 0));
      const topics = (topicsBySkill[id] ?? [])
        .map((t) => ({ level: Number(t.level_number), topic: asString(t.topic) }))
        .sort((a, b) => a.level - b.level);
      return {
        id,
        name: asString(r.skill_set_name) || titleCaseFromCode(asString(r.skill_set_code)),
        requiredLevel: level,
        proficiency: asString(r.required_proficiency),
        bloom: proficiencyToBloom(level),
        criticality: scoreToCriticality(level),
        difficulty: scoreToDifficulty(level),
        topics,
      };
    })
    .sort((a, b) => b.requiredLevel - a.requiredLevel || a.name.localeCompare(b.name));
}
