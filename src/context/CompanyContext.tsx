import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { findSeedCompany } from "@/lib/companyRepository";
import { normalizeCompanySummary, type CompanySummary } from "@/lib/companyData";

export const SELECTED_COMPANY_KEY = "selected-company";

export interface SelectedCompany {
  companyId: number;
  companyName: string;
  logoUrl: string;
}

interface CompanyContextValue {
  /** True once localStorage has been read on the client. */
  ready: boolean;
  selected: SelectedCompany | null;
  company: CompanySummary | null;
  selectCompany: (company: CompanySummary) => void;
  clearCompany: () => void;
}

const CompanyContext = createContext<CompanyContextValue | null>(null);

export function readStoredCompany(): SelectedCompany | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SELECTED_COMPANY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SelectedCompany>;
    const id = Number(parsed.companyId);
    if (!id || !findSeedCompany(id)) return null;
    return {
      companyId: id,
      companyName: String(parsed.companyName ?? ""),
      logoUrl: String(parsed.logoUrl ?? ""),
    };
  } catch {
    return null;
  }
}

export function writeStoredCompany(company: CompanySummary): SelectedCompany {
  const value: SelectedCompany = {
    companyId: company.id,
    companyName: company.name,
    logoUrl: company.logoUrl,
  };
  try {
    window.localStorage.setItem(SELECTED_COMPANY_KEY, JSON.stringify(value));
  } catch {
    /* storage unavailable — context still updates */
  }
  return value;
}

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<SelectedCompany | null>(null);

  useEffect(() => {
    setSelected(readStoredCompany());
    setReady(true);
  }, []);

  const selectCompany = useCallback((company: CompanySummary) => {
    setSelected(writeStoredCompany(company));
  }, []);

  const clearCompany = useCallback(() => {
    try {
      window.localStorage.removeItem(SELECTED_COMPANY_KEY);
    } catch {
      /* ignore */
    }
    setSelected(null);
  }, []);

  const company = useMemo(() => {
    if (!selected) return null;
    const seed = findSeedCompany(selected.companyId);
    return seed ? normalizeCompanySummary(seed.short_json, seed.company_id) : null;
  }, [selected]);

  const value = useMemo(
    () => ({ ready, selected, company, selectCompany, clearCompany }),
    [ready, selected, company, selectCompany, clearCompany],
  );

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

export function useCompany() {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompany must be used inside CompanyProvider");
  return ctx;
}
