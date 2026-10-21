import { ExternalLink, Mail, PlayCircle, Star } from "lucide-react";

import type { FieldType } from "@/data/intelligenceData";
import { isNullish, splitItems } from "@/lib/companyData";

const URL_RE = /^https?:\/\/\S+$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATING_RE = /^(\d+(?:\.\d+)?)\s*\/\s*(\d+)$/;

function NotAvailable() {
  return (
    <span className="inline-flex rounded-full border border-dashed bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
      Not Available
    </span>
  );
}

function Pills({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item, i) => (
        <li key={`${item}-${i}`} className="rounded-md border bg-secondary/60 px-2 py-0.5 text-[13px] text-foreground">
          {item}
        </li>
      ))}
    </ul>
  );
}

function prettyUrl(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

function UrlValue({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex max-w-full items-center gap-1.5 break-all font-medium text-link hover:underline"
    >
      {prettyUrl(url)}
      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
    </a>
  );
}

function VideoValue({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 rounded-lg border bg-card px-3 py-2 transition-colors hover:border-link/40 hover:bg-link-soft"
    >
      <PlayCircle className="h-6 w-6 text-danger" />
      <span className="min-w-0">
        <span className="block text-sm font-medium text-foreground">Watch video</span>
        <span className="block truncate text-xs text-muted-foreground">{prettyUrl(url)}</span>
      </span>
    </a>
  );
}

function RatingValue({ value }: { value: string }) {
  const m = value.match(RATING_RE);
  if (!m) return <span>{value}</span>;
  const score = Number(m[1]);
  const max = Number(m[2]);
  const stars = Math.round((score / max) * 5 * 2) / 2;
  return (
    <span className="inline-flex items-center gap-2">
      <span className="flex" aria-hidden>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={
              i + 1 <= stars
                ? "h-4 w-4 fill-regular text-regular"
                : i + 0.5 === stars
                  ? "h-4 w-4 fill-regular/50 text-regular"
                  : "h-4 w-4 text-border"
            }
          />
        ))}
      </span>
      <span className="font-semibold text-foreground">{score}</span>
      <span className="text-muted-foreground">/ {max}</span>
    </span>
  );
}

export function renderValue(raw: string | undefined, type: FieldType = "auto") {
  const value = (raw ?? "").trim();
  if (isNullish(value)) return <NotAvailable />;

  if (type === "video" && URL_RE.test(value)) return <VideoValue url={value} />;
  if (type === "url" || URL_RE.test(value)) return URL_RE.test(value) ? <UrlValue url={value} /> : <span>{value}</span>;
  if (EMAIL_RE.test(value)) {
    return (
      <a href={`mailto:${value}`} className="inline-flex items-center gap-1.5 break-all font-medium text-link hover:underline">
        <Mail className="h-3.5 w-3.5 shrink-0" />
        {value}
      </a>
    );
  }
  if (type === "rating" || RATING_RE.test(value)) return <RatingValue value={value} />;
  if (type === "paragraph") return <p className="leading-relaxed text-foreground">{value}</p>;

  if (/^\d{5,}$/.test(value)) {
    return (
      <span className="font-medium">
        {new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(Number(value))}
      </span>
    );
  }

  if (type === "list") {
    const items = splitItems(value);
    return items.length > 1 ? <Pills items={items} /> : <span>{value}</span>;
  }

  // auto: pill detection on ";" then ","
  if (value.includes(";")) {
    const items = splitItems(value);
    if (items.length > 1) return <Pills items={items} />;
  }
  const commaParts = value.split(/,\s+/).map((s) => s.trim()).filter(Boolean);
  if (commaParts.length >= 3 && commaParts.every((p) => p.length <= 40)) return <Pills items={commaParts} />;

  return <span className="leading-relaxed">{value}</span>;
}

export function FieldRow({ label, value, type }: { label: string; value?: string; type: FieldType }) {
  return (
    <div className="flex flex-col gap-1.5 border-b py-3 last:border-b-0 sm:flex-row sm:gap-4">
      <dt className="text-sm font-medium text-muted-foreground sm:w-1/3 sm:shrink-0">{label}</dt>
      <dd className="min-w-0 text-sm text-foreground sm:w-2/3">{renderValue(value, type)}</dd>
    </div>
  );
}
