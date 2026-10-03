import { THEMES } from "../lib/themes";
import type { Theme } from "../types";

/** The pattern, marked like a highlighter swipe with its icon. */
export default function ThemeTag({ theme, short = false }: { theme: Theme; short?: boolean }) {
  const t = THEMES[theme];
  return (
    <span className="theme-tag" style={{ "--tag": t.color } as React.CSSProperties}>
      <t.Icon size={14} strokeWidth={2.2} aria-hidden="true" />
      {short ? t.short : t.label}
    </span>
  );
}
