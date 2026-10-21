import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { useCompany } from "@/context/CompanyContext";

/**
 * Route guard for company pages: once localStorage has been read, send the
 * visitor back to "/" if no company is selected. Never renders NotFound.
 */
export function useRequireCompany() {
  const ctx = useCompany();
  const navigate = useNavigate();

  useEffect(() => {
    if (ctx.ready && !ctx.company) {
      navigate({ to: "/", replace: true });
    }
  }, [ctx.ready, ctx.company, navigate]);

  return ctx;
}
