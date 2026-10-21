import { memo, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface CompanyLogoProps {
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: "h-8 w-8 text-sm",
  md: "h-11 w-11 text-base",
  lg: "h-14 w-14 text-xl",
};

function domainFrom(url?: string) {
  if (!url) return "";
  try {
    return new URL(url.startsWith("http") ? url : `https://${url}`).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/** Logo.dev (if key set) → seed logo_url → initial-letter circle. */
export const CompanyLogo = memo(function CompanyLogo({
  name,
  logoUrl,
  websiteUrl,
  size = "md",
  className,
}: CompanyLogoProps) {
  const sources = useMemo(() => {
    const list: string[] = [];
    const key = import.meta.env.VITE_LOGO_DEV_PUBLISHABLE_KEY as string | undefined;
    const domain = domainFrom(websiteUrl);
    if (key && domain) list.push(`https://img.logo.dev/${domain}?token=${key}&size=128&format=png`);
    if (logoUrl) list.push(logoUrl);
    return list;
  }, [logoUrl, websiteUrl]);

  const [index, setIndex] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const src = sources[index];

  useEffect(() => setIndex(0), [sources]);

  // Catch images that failed before hydration attached onError.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setIndex((i) => i + 1);
  }, [src]);

  const box = cn(
    "flex shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-card",
    SIZES[size],
    className,
  );

  if (!src) {
    return (
      <div className={cn(box, "bg-link-soft font-heading font-semibold text-link")} aria-label={name}>
        {name.trim().charAt(0).toUpperCase() || "?"}
      </div>
    );
  }

  return (
    <div className={cn(box, "p-1.5")}>
      <img
        ref={imgRef}
        src={src}
        alt={`${name} logo`}
        loading="lazy"
        className="h-full w-full object-contain"
        onError={() => setIndex((i) => i + 1)}
      />
    </div>
  );
});
