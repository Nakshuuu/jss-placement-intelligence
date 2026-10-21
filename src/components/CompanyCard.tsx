import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, MapPin, TrendingDown, TrendingUp, Users } from "lucide-react";
import { memo, useCallback } from "react";

import { CompanyLogo } from "@/components/CompanyLogo";
import { useCompany, writeStoredCompany } from "@/context/CompanyContext";
import { isNullish, type CompanySummary } from "@/lib/companyData";
import { CATEGORY_STYLES } from "@/lib/styleMaps";
import { cn } from "@/lib/utils";

function MetaValue({ value }: { value: string }) {
  if (isNullish(value)) return <span className="italic text-muted-foreground">not publicly available</span>;
  return <span className="truncate">{value}</span>;
}

export const CompanyCard = memo(function CompanyCard({ company }: { company: CompanySummary }) {
  const navigate = useNavigate();
  const { selectCompany } = useCompany();
  const negative = company.yoyGrowthRate.trim().startsWith("-");
  const Trend = negative ? TrendingDown : TrendingUp;

  const open = useCallback(() => {
    writeStoredCompany(company); // persist first so refresh survives
    selectCompany(company);
    navigate({ to: "/company/intelligence" });
  }, [company, navigate, selectCompany]);

  return (
    <button
      type="button"
      onClick={open}
      className="group relative flex h-full flex-col rounded-xl border bg-card p-4 text-left shadow-card transition-all hover:-translate-y-0.5 hover:border-link/40 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-3">
        <CompanyLogo name={company.name} logoUrl={company.logoUrl} websiteUrl={company.websiteUrl} />
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 text-xs font-medium",
            CATEGORY_STYLES[company.companyType].badge,
          )}
        >
          {company.companyType}
        </span>
      </div>

      <h3 className="mt-4 text-base font-semibold leading-snug text-foreground">{company.name}</h3>
      <p className="text-sm text-muted-foreground">{company.shortName}</p>

      <dl className="mt-4 space-y-2 text-sm text-foreground/80">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
          <MetaValue value={company.headquarters} />
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
          <MetaValue value={company.employeeSize} />
        </div>
        <div className="flex items-center gap-2">
          <Trend className={cn("h-4 w-4 shrink-0", negative ? "text-danger" : "text-success")} />
          {isNullish(company.yoyGrowthRate) ? (
            <MetaValue value="" />
          ) : (
            <span className={cn("font-medium", negative ? "text-danger" : "text-success")}>
              {company.yoyGrowthRate} YoY
            </span>
          )}
        </div>
      </dl>

      <div className="mt-auto flex justify-end pt-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors group-hover:bg-link-soft group-hover:text-link">
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </button>
  );
});
