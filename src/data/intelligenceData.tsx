import {
  Award,
  BadgeCheck,
  Banknote,
  Briefcase,
  Building2,
  Contact,
  Cpu,
  Eye,
  Globe2,
  GraduationCap,
  Handshake,
  HeartPulse,
  Leaf,
  MapPinned,
  Newspaper,
  Package,
  PieChart,
  ShieldAlert,
  Smile,
  Swords,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";

import {
  FORBIDDEN_FIELD_PATTERN,
  titleCaseFromCode,
  type CompanyProfile,
  type ProfileFieldKey,
} from "@/lib/companyData";

export type FieldType = "auto" | "url" | "video" | "rating" | "list" | "paragraph";

export interface IntelligenceField {
  key: ProfileFieldKey;
  label: string;
  type: FieldType;
  value?: string;
}

export interface IntelligenceSection {
  id: string;
  title: string;
  icon: LucideIcon;
  fields: IntelligenceField[];
}

type FieldSpec = ProfileFieldKey | [ProfileFieldKey, FieldType] | [ProfileFieldKey, FieldType, string];

const SCHEMA: { id: string; title: string; icon: LucideIcon; fields: FieldSpec[] }[] = [
  {
    id: "identity",
    title: "Company Identity",
    icon: Building2,
    fields: [
      ["name", "auto", "Legal Name"],
      "short_name",
      "category",
      ["company_type", "auto", "Placement Category"],
      "nature_of_company",
      "incorporation_year",
      "employee_size",
      ["headquarters_address", "auto", "Headquarters"],
      "company_maturity",
    ],
  },
  {
    id: "overview",
    title: "Overview & Vision",
    icon: Eye,
    fields: [
      ["overview_text", "paragraph", "Overview"],
      ["vision_statement", "paragraph", "Vision"],
      ["mission_statement", "paragraph", "Mission"],
      ["core_values", "list"],
      "mission_clarity",
      ["strategic_priorities", "list"],
    ],
  },
  {
    id: "leadership",
    title: "Leadership",
    icon: Users,
    fields: [
      ["ceo_name", "auto", "CEO"],
      ["ceo_linkedin_url", "url", "CEO LinkedIn"],
      ["key_leaders", "list"],
      ["board_members", "list"],
      "decision_maker_access",
      ["warm_intro_pathways", "list"],
    ],
  },
  {
    id: "financials",
    title: "Funding & Financials",
    icon: Banknote,
    fields: [
      "annual_revenue",
      "annual_profit",
      ["revenue_mix", "list"],
      "valuation",
      ["yoy_growth_rate", "auto", "YoY Growth Rate"],
      "profitability_status",
      ["key_investors", "list"],
      "recent_funding_rounds",
      "total_capital_raised",
      "burn_rate",
      ["runway_months", "auto", "Runway (Months)"],
      "burn_multiplier",
      ["exit_strategy_history", "list"],
      "future_projections",
    ],
  },
  {
    id: "global",
    title: "Global Presence",
    icon: Globe2,
    fields: [
      ["operating_countries", "list"],
      "office_count",
      ["office_locations", "list"],
      ["global_exposure", "list"],
    ],
  },
  {
    id: "products",
    title: "Products & Services",
    icon: Package,
    fields: [
      ["offerings_description", "list", "Offerings"],
      ["focus_sectors", "list"],
      ["pain_points_addressed", "list"],
      ["top_customers", "list"],
      ["case_studies", "list"],
      ["product_pipeline", "list"],
      ["innovation_roadmap", "list"],
    ],
  },
  {
    id: "tech",
    title: "Technology Stack",
    icon: Cpu,
    fields: [
      ["tech_stack", "list"],
      ["ai_ml_adoption_level", "auto", "AI / ML Adoption"],
      "tech_adoption_rating",
      ["r_and_d_investment", "auto", "R&D Investment"],
      ["intellectual_property", "list"],
      ["cybersecurity_posture", "list"],
      "automation_level",
      ["tools_access", "list"],
    ],
  },
  {
    id: "partnerships",
    title: "Partnerships & Ecosystem",
    icon: Handshake,
    fields: [
      ["technology_partners", "list"],
      ["partnership_ecosystem", "list"],
      ["industry_associations", "list"],
      ["event_participation", "list"],
    ],
  },
  {
    id: "competition",
    title: "Competitive Landscape",
    icon: Swords,
    fields: [
      ["key_competitors", "list"],
      ["competitive_advantages", "list"],
      ["unique_differentiators", "list"],
      ["weaknesses_gaps", "list", "Weaknesses & Gaps"],
      ["benchmark_vs_peers", "list"],
      ["market_share_percentage", "auto", "Market Share"],
    ],
  },
  {
    id: "market",
    title: "Market Opportunity",
    icon: PieChart,
    fields: [
      ["tam", "auto", "TAM (Total Addressable Market)"],
      ["sam", "auto", "SAM (Serviceable Market)"],
      ["som", "auto", "SOM (Obtainable Market)"],
      ["key_challenges_needs", "list", "Key Challenges & Needs"],
      ["go_to_market_strategy", "list"],
    ],
  },
  {
    id: "value-esg",
    title: "Core Value Proposition & ESG",
    icon: Leaf,
    fields: [
      ["core_value_proposition", "list"],
      ["esg_ratings", "list", "ESG Ratings"],
      ["sustainability_csr", "list", "Sustainability & CSR"],
      "carbon_footprint",
      ["ethical_sourcing", "list"],
      ["ethical_standards", "list"],
    ],
  },
  {
    id: "culture",
    title: "Culture & Work Life",
    icon: Smile,
    fields: [
      ["work_culture_summary", "list", "Work Culture"],
      "manager_quality",
      "psychological_safety",
      ["feedback_culture", "list"],
      ["diversity_metrics", "list"],
      ["diversity_inclusion_score", "list", "Diversity & Inclusion"],
      "burnout_risk",
      "crisis_behavior",
      "employee_turnover",
      ["avg_retention_tenure", "auto", "Average Retention Tenure"],
      "layoff_history",
      ["hiring_velocity", "list"],
    ],
  },
  {
    id: "news",
    title: "Recent News & Milestones",
    icon: Newspaper,
    fields: [
      ["recent_news", "list"],
      ["history_timeline", "list", "Milestones"],
    ],
  },
  {
    id: "sales",
    title: "Sales & Customer Metrics",
    icon: Target,
    fields: [
      "sales_motion",
      ["customer_acquisition_cost", "auto", "Customer Acquisition Cost (CAC)"],
      ["customer_lifetime_value", "auto", "Customer Lifetime Value (LTV)"],
      ["cac_ltv_ratio", "auto", "CAC : LTV Ratio"],
      "churn_rate",
      ["net_promoter_score", "auto", "Net Promoter Score (NPS)"],
      "customer_concentration_risk",
      ["customer_testimonials", "list"],
    ],
  },
  {
    id: "risk",
    title: "Risk & Compliance",
    icon: ShieldAlert,
    fields: [
      ["regulatory_status", "list"],
      ["legal_issues", "list"],
      ["supply_chain_dependencies", "list"],
      ["geopolitical_risks", "list"],
      ["macro_risks", "list", "Macro Risks"],
    ],
  },
  {
    id: "location",
    title: "Work Location & Commute",
    icon: MapPinned,
    fields: [
      ["remote_policy_details", "auto", "Remote Policy"],
      "typical_hours",
      "overtime_expectations",
      "weekend_work",
      ["flexibility_level", "list"],
      "location_centrality",
      ["public_transport_access", "list"],
      ["cab_policy", "list"],
      "airport_commute_time",
      "office_zone_type",
    ],
  },
  {
    id: "safety",
    title: "Safety & Wellbeing",
    icon: HeartPulse,
    fields: [
      ["area_safety", "list"],
      ["safety_policies", "list"],
      ["infrastructure_safety", "list"],
      ["emergency_preparedness", "list"],
      ["health_support", "list"],
    ],
  },
  {
    id: "career",
    title: "Career Growth & Learning",
    icon: GraduationCap,
    fields: [
      "training_spend",
      "onboarding_quality",
      ["learning_culture", "list"],
      "exposure_quality",
      ["mentorship_availability", "list"],
      "internal_mobility",
      ["promotion_clarity", "list"],
      "role_clarity",
      "early_ownership",
      ["work_impact", "list"],
      ["execution_thinking_balance", "auto", "Execution vs Thinking Balance"],
      ["cross_functional_exposure", "list"],
      "skill_relevance",
      ["exit_opportunities", "list"],
      ["network_strength", "list"],
    ],
  },
  {
    id: "brand",
    title: "Brand & Reputation",
    icon: Award,
    fields: [
      "brand_value",
      "brand_sentiment_score",
      ["awards_recognitions", "list", "Awards & Recognitions"],
      "external_recognition",
      ["client_quality", "list"],
      ["marketing_video_url", "video", "Marketing Video"],
    ],
  },
  {
    id: "benefits",
    title: "Compensation & Benefits",
    icon: Briefcase,
    fields: [
      ["fixed_vs_variable_pay", "auto", "Fixed vs Variable Pay"],
      "bonus_predictability",
      ["esops_incentives", "list", "ESOPs & Incentives"],
      ["family_health_insurance", "list"],
      ["relocation_support", "list"],
      ["lifestyle_benefits", "list"],
      ["leave_policy", "list"],
    ],
  },
  {
    id: "digital",
    title: "Digital Presence & Ratings",
    icon: BadgeCheck,
    fields: [
      ["website_url", "url", "Website"],
      "website_quality",
      ["website_rating", "rating"],
      ["website_traffic_rank", "list"],
      "social_media_followers",
      ["glassdoor_rating", "rating"],
      ["indeed_rating", "rating"],
      ["google_rating", "rating"],
      ["linkedin_url", "url", "LinkedIn"],
      ["twitter_handle", "auto", "X / Twitter"],
      ["facebook_url", "url", "Facebook"],
      ["instagram_url", "url", "Instagram"],
    ],
  },
  {
    id: "contact",
    title: "Contact Information",
    icon: Contact,
    fields: [
      ["primary_contact_email", "auto", "Primary Email"],
      ["primary_phone_number", "auto", "Primary Phone"],
      "contact_person_name",
      "contact_person_title",
      "contact_person_email",
      "contact_person_phone",
    ],
  },
];

export function buildIntelligenceSections(profile?: CompanyProfile): IntelligenceSection[] {
  return SCHEMA.map((section) => ({
    id: section.id,
    title: section.title,
    icon: section.icon,
    fields: section.fields
      .map((spec): IntelligenceField => {
        const [key, type = "auto", label] = Array.isArray(spec) ? spec : [spec];
        return {
          key,
          type,
          label: label ?? titleCaseFromCode(key),
          ...(profile ? { value: profile.fields[key] ?? "" } : {}),
        };
      })
      .filter((f) => !FORBIDDEN_FIELD_PATTERN.test(f.key) && !FORBIDDEN_FIELD_PATTERN.test(f.label)),
  }));
}
