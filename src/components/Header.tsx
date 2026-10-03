import { ScanEye } from "lucide-react";
import { href, type Route } from "../lib/hooks";
import ThemeToggle from "./ThemeToggle";

const TABS: { route: Route; label: string }[] = [
  { route: { page: "write" }, label: "This week" },
  { route: { page: "history" }, label: "Journal" },
  { route: { page: "progress" }, label: "Progress" },
];

export default function Header({ current }: { current: Route["page"] }) {
  return (
    <header className="site-header">
      <a href="#/" className="wordmark">
        <span className="logo-mark" aria-hidden="true">
          <ScanEye size={18} strokeWidth={2.2} />
        </span>
        Growth Mirror
      </a>
      <nav aria-label="Main">
        {TABS.map((t) => (
          <a key={t.label} href={href(t.route)} aria-current={current === t.route.page ? "page" : undefined}>
            {t.label}
          </a>
        ))}
        <ThemeToggle />
      </nav>
    </header>
  );
}
