import { createFileRoute } from "@tanstack/react-router";
import { Globe, Linkedin } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { CompanyLogo } from "@/components/CompanyLogo";
import { FieldRow } from "@/components/intelligence/FieldValue";
import { PageSkeleton } from "@/components/PageSkeleton";
import { Button } from "@/components/ui/button";
import { COLLEGE_SHORT } from "@/config/college";
import { buildIntelligenceSections, type IntelligenceSection } from "@/data/intelligenceData";
import { useRequireCompany } from "@/hooks/use-require-company";
import { isNullish } from "@/lib/companyData";
import { getCompanyProfile } from "@/lib/companyRepository";
import { CATEGORY_STYLES } from "@/lib/styleMaps";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/company/intelligence")({
  head: () => ({
    meta: [
      { title: `Company Intelligence — ${COLLEGE_SHORT} Placement Intelligence Hub` },
      {
        name: "description",
        content: "22-section research profile of a recruiting company: leadership, financials, tech, culture and more.",
      },
      { property: "og:title", content: `Company Intelligence — ${COLLEGE_SHORT}` },
      { property: "og:description", content: "Deep research profile of a campus recruiter." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CompanyIntelligence,
});

const SectionCard = memo(function SectionCard({ section, index }: { section: IntelligenceSection; index: number }) {
  const Icon = section.icon;
  const filled = section.fields.filter((f) => !isNullish(f.value)).length;
  return (
    <section
      id={`section-${section.id}`}
      data-section-index={index}
      className="scroll-mt-40 rounded-xl border bg-card shadow-card"
    >
      <div className="flex items-center gap-3 border-b px-4 py-3 sm:px-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-link-soft text-link">
          <Icon className="h-4 w-4" />
        </span>
        <h2 className="flex-1 text-base font-semibold text-foreground">{section.title}</h2>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
          {filled}/{section.fields.length}
        </span>
      </div>
      <dl className="px-4 sm:px-5">
        {section.fields.map((f) => (
          <FieldRow key={f.key} label={f.label} value={f.value} type={f.type} />
        ))}
      </dl>
    </section>
  );
});

function CompanyIntelligence() {
  const { ready, company } = useRequireCompany();
  const profile = useMemo(() => (company ? getCompanyProfile(company.id) : undefined), [company]);
  const sections = useMemo(() => buildIntelligenceSections(profile), [profile]);

  const [active, setActive] = useState(0);
  const isScrollingRef = useRef(false);
  const scrollTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const stickyRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const offset = () => 56 + (stickyRef.current?.offsetHeight ?? 0) + 8;

  const scrollToSection = useCallback((idx: number) => {
    const el = document.querySelector<HTMLElement>(`[data-section-index="${idx}"]`);
    if (!el) return;
    isScrollingRef.current = true;
    setActive(idx);
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset(), behavior: "smooth" });
    clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 900);
  }, []);

  // Scroll-spy
  useEffect(() => {
    if (!profile) return;
    let frame = 0;
    const onScroll = () => {
      if (isScrollingRef.current) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const els = document.querySelectorAll<HTMLElement>("[data-section-index]");
        const line = offset() + 24;
        let current = 0;
        els.forEach((el, i) => {
          if (el.getBoundingClientRect().top <= line) current = i;
        });
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
          current = els.length - 1;
        }
        setActive(current);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [profile]);

  // Auto-center active tab
  useEffect(() => {
    const bar = tabsRef.current;
    const tab = bar?.querySelector<HTMLElement>(`[data-tab-index="${active}"]`);
    if (!bar || !tab) return;
    bar.scrollTo({ left: tab.offsetLeft - bar.clientWidth / 2 + tab.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  useEffect(() => () => clearTimeout(scrollTimer.current), []);

  if (!ready || !company || !profile) return <PageSkeleton />;

  const linkedin = profile.fields.linkedin_url;
  const website = profile.fields.website_url || company.websiteUrl;

  return (
    <div>
      <div ref={stickyRef} className="sticky top-14 z-20 border-b bg-surface">
        <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
          <CompanyLogo name={company.name} logoUrl={company.logoUrl} websiteUrl={company.websiteUrl} />
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-semibold text-foreground sm:text-xl">{company.name}</h1>
            <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
              {!isNullish(company.category) && (
                <span className="rounded-full border bg-secondary px-2 py-0.5 text-xs font-medium text-foreground">
                  {company.category}
                </span>
              )}
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-xs font-medium",
                  CATEGORY_STYLES[company.companyType].badge,
                )}
              >
                {company.companyType}
              </span>
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            {!isNullish(website) && (
              <Button asChild variant="outline" size="sm">
                <a href={website} target="_blank" rel="noopener noreferrer" aria-label="Website">
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">Website</span>
                </a>
              </Button>
            )}
            {!isNullish(linkedin) && (
              <Button asChild variant="outline" size="sm">
                <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                  <span className="hidden sm:inline">LinkedIn</span>
                </a>
              </Button>
            )}
          </div>
        </div>

        <div ref={tabsRef} className="flex gap-1 overflow-x-auto px-3 pb-2 scrollbar-none sm:px-5" role="tablist">
          {sections.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={active === i}
              data-tab-index={i}
              onClick={() => scrollToSection(i)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors",
                active === i
                  ? "bg-link-soft text-link"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-4 px-4 py-5 sm:px-6">
        {sections.map((s, i) => (
          <SectionCard key={s.id} section={s} index={i} />
        ))}
      </div>
    </div>
  );
}
