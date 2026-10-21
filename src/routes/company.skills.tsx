import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Lock } from "lucide-react";
import { memo, useMemo, useState } from "react";

import { CompanyLogo } from "@/components/CompanyLogo";
import { PageSkeleton } from "@/components/PageSkeleton";
import { COLLEGE_SHORT } from "@/config/college";
import { useRequireCompany } from "@/hooks/use-require-company";
import { proficiencyToBloom, type BloomLevel, type Criticality, type DashboardSkill } from "@/lib/companyData";
import { getCompanySkills } from "@/lib/companyRepository";
import { BLOOM_META, CRITICALITY_META, DIFFICULTY_STYLES } from "@/lib/styleMaps";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/company/skills")({
  head: () => ({
    meta: [
      { title: `Skill Intelligence — ${COLLEGE_SHORT} Placement Intelligence Hub` },
      {
        name: "description",
        content: "Skills a recruiter expects, mapped to Bloom levels with a 10-level learning roadmap for each.",
      },
      { property: "og:title", content: `Skill Intelligence — ${COLLEGE_SHORT}` },
      { property: "og:description", content: "Required skills, criticality and 10-level roadmaps." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SkillIntelligence,
});

const BLOOMS: BloomLevel[] = ["CU", "AP", "AS", "EV", "CR"];
const CRITS: Criticality[] = ["Critical", "Important", "Baseline"];

function BloomBadge({ level }: { level: BloomLevel }) {
  const m = BLOOM_META[level];
  return (
    <span className={cn("rounded-md border px-1.5 py-0.5 text-[11px] font-bold tracking-wide", m.tint, m.text, m.border)}>
      {level}
    </span>
  );
}

const SkillCard = memo(function SkillCard({ skill }: { skill: DashboardSkill }) {
  const [open, setOpen] = useState(false);
  const bloom = BLOOM_META[skill.bloom];
  const crit = CRITICALITY_META[skill.criticality];

  return (
    <article className="rounded-xl border bg-card shadow-card">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full p-4 text-left sm:p-5"
      >
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[15px] font-semibold text-foreground">{skill.name}</h3>
              <BloomBadge level={skill.bloom} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {skill.proficiency} ·{" "}
              <span className={cn("rounded px-1 py-px text-[10px] font-semibold", DIFFICULTY_STYLES[skill.difficulty])}>
                {skill.difficulty}
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="font-heading text-xl font-semibold tabular-nums text-foreground">
              {skill.requiredLevel}
              <span className="text-sm font-normal text-muted-foreground">/10</span>
            </p>
          </div>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
          <div className={cn("h-full rounded-full", bloom.bar)} style={{ width: `${skill.requiredLevel * 10}%` }} />
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", crit.tint, crit.text)}>
            {skill.criticality}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-link">
            {open ? "Hide roadmap" : "View 10-level roadmap"}
            <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
          </span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <ol className="space-y-1.5 border-t px-4 py-4 sm:px-5">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((lvl) => {
                const topic = skill.topics.find((t) => t.level === lvl)?.topic ?? `Level ${lvl}`;
                const locked = lvl > skill.requiredLevel;
                const lb = BLOOM_META[proficiencyToBloom(lvl)];
                return (
                  <li
                    key={lvl}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border px-3 py-2",
                      locked ? "border-dashed bg-secondary/50" : cn(lb.tint, lb.border),
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums",
                        locked ? "bg-card text-muted-foreground" : cn(lb.bar, "text-primary-foreground"),
                      )}
                    >
                      {lvl}
                    </span>
                    <span className={cn("min-w-0 flex-1 text-[13px]", locked ? "text-muted-foreground" : "text-foreground")}>
                      {topic}
                    </span>
                    {locked ? (
                      <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-muted-foreground">
                        <Lock className="h-3.5 w-3.5" />
                        Beyond scope
                      </span>
                    ) : (
                      <span className={cn("shrink-0 text-[11px] font-bold", lb.text)}>{proficiencyToBloom(lvl)}</span>
                    )}
                  </li>
                );
              })}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
});

function SkillIntelligence() {
  const { ready, company } = useRequireCompany();
  const skills = useMemo(() => (company ? getCompanySkills(company.id) : []), [company]);

  if (!ready || !company) return <PageSkeleton />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
      <header className="flex items-center gap-3 border-b pb-5">
        <CompanyLogo name={company.name} logoUrl={company.logoUrl} websiteUrl={company.websiteUrl} size="lg" />
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-foreground sm:text-2xl">{company.shortName} Skill Intelligence</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {skills.length} skills · sorted by required proficiency
          </p>
        </div>
      </header>

      <section className="mt-5">
        <h2 className="text-sm font-semibold text-foreground">Bloom's taxonomy levels</h2>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {BLOOMS.map((b) => {
            const m = BLOOM_META[b];
            return (
              <div key={b} className={cn("rounded-lg border p-3", m.tint, m.border)}>
                <p className={cn("font-heading text-lg font-bold", m.text)}>{b}</p>
                <p className="text-xs font-medium text-foreground">{m.label}</p>
                <p className="text-[11px] text-muted-foreground">{m.range}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-4">
        <h2 className="text-sm font-semibold text-foreground">Criticality</h2>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {CRITS.map((c) => {
            const m = CRITICALITY_META[c];
            return (
              <div key={c} className="rounded-lg border bg-card p-3">
                <div className="flex items-center justify-between">
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", m.tint, m.text)}>{c}</span>
                  <span className="text-[11px] text-muted-foreground">{m.range}</span>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">{m.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {skills.map((s) => (
          <SkillCard key={s.id} skill={s} />
        ))}
      </section>
    </div>
  );
}
