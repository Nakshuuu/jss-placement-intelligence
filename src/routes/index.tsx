import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Building2, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { CompanyCard } from "@/components/CompanyCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { COLLEGE_SHORT, PORTAL_TITLE } from "@/config/college";
import { COMPANY_TYPES, type CompanyType } from "@/lib/companyData";
import { companiesQueryOptions } from "@/lib/companyRepository";
import { CATEGORY_STYLES } from "@/lib/styleMaps";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${COLLEGE_SHORT} Placement Intelligence Hub — Companies Research Portal` },
      {
        name: "description",
        content: `${PORTAL_TITLE}. Research recruiting companies and the skills they expect.`,
      },
      { property: "og:title", content: `${COLLEGE_SHORT} Placement Intelligence Hub` },
      { property: "og:description", content: "Your strategic edge for campus placements." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(companiesQueryOptions),
  pendingComponent: IndexSkeleton,
  component: Index,
});

type Filter = "All" | CompanyType;

function useDebounced<T>(value: T, delay = 200) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

function Hero({ query, setQuery }: { query: string; setQuery: (q: string) => void }) {
  return (
    <header className="border-b bg-surface">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        <span className="inline-flex items-center rounded-full border border-link/20 bg-link-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-link">
          {COLLEGE_SHORT} · Intelligence Platform
        </span>
        <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
          {PORTAL_TITLE}
        </h1>
        <p className="mt-3 text-base text-muted-foreground">Your strategic edge for campus placements</p>

        <div className="relative mt-6 max-w-2xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search companies, headquarters, category…"
            aria-label="Search companies"
            className="h-12 w-full rounded-full border bg-card pl-12 pr-12 text-sm text-foreground shadow-card outline-none transition placeholder:text-muted-foreground focus:border-link focus:ring-4 focus:ring-link/10 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex justify-between">
        <Skeleton className="h-11 w-11 rounded-lg" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-4 w-3/4" />
      <Skeleton className="mt-2 h-3 w-1/3" />
      <div className="mt-4 space-y-2">
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  );
}

function IndexSkeleton() {
  return (
    <div className="min-h-screen bg-surface">
      <Hero query="" setQuery={() => {}} />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </main>
    </div>
  );
}

function Index() {
  const { data: companies } = useSuspenseQuery(companiesQueryOptions);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const debounced = useDebounced(query.trim().toLowerCase(), 200);

  const searched = useMemo(() => {
    if (!debounced) return companies;
    return companies.filter((c) =>
      [c.name, c.shortName, c.headquarters, c.category, c.companyType]
        .join(" ")
        .toLowerCase()
        .includes(debounced),
    );
  }, [companies, debounced]);

  const counts = useMemo(() => {
    const map: Record<Filter, number> = { All: searched.length, "Super Dream": 0, Dream: 0, Standard: 0, Regular: 0 };
    for (const c of searched) map[c.companyType] += 1;
    return map;
  }, [searched]);

  const visible = filter === "All" ? searched : searched.filter((c) => c.companyType === filter);

  const reset = () => {
    setQuery("");
    setFilter("All");
  };

  return (
    <div className="min-h-screen bg-surface">
      <Hero query={query} setQuery={setQuery} />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:px-0">
          {(["All", ...COMPANY_TYPES] as Filter[]).map((f) => {
            const active = filter === f;
            const styles = f === "All" ? null : CATEGORY_STYLES[f];
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={active}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  f === "All"
                    ? active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-secondary"
                    : active
                      ? styles!.pillActive
                      : cn("bg-card", styles!.pillIdle),
                )}
              >
                {f}
                <span
                  className={cn(
                    "rounded-full px-1.5 text-xs tabular-nums",
                    active ? "bg-card/25" : "bg-secondary text-muted-foreground",
                  )}
                >
                  {counts[f]}
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-5 text-sm text-muted-foreground">
          {visible.length} {visible.length === 1 ? "company" : "companies"}
        </p>

        {visible.length === 0 ? (
          <div className="mt-6 flex flex-col items-center rounded-xl border border-dashed bg-card px-6 py-16 text-center">
            <Building2 className="h-10 w-10 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-semibold text-foreground">No companies match</h2>
            <p className="mt-1 text-sm text-muted-foreground">Try a different search term or category.</p>
            <Button variant="outline" className="mt-5" onClick={reset}>
              Reset filters
            </Button>
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(i, 8) * 0.03 }}
              >
                <CompanyCard company={c} />
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
