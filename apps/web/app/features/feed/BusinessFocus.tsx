import { READING } from "@aihot/industry/reading";
import { Link } from "react-router";

/** Shortcuts describe a business concern and open its selected items across all categories. */
export function BusinessFocus({ tag }: { tag: string | null }) {
  return (
    <nav aria-label="业务关注快捷筛选" className="mb-5 rounded-panel border border-line bg-surface p-3 lg:p-4">
      <h2 className="mb-2.5 text-[13px] font-semibold text-ink-2">先看我关心的事</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
        {READING.focus.map((focus) => {
          const active = tag === focus.tag;
          const to = active ? "/" : `/?${new URLSearchParams({ tag: focus.tag })}`;
          return (
            <Link
              key={focus.tag}
              to={to}
              aria-current={active ? "page" : undefined}
              className={`rounded-control border px-3 py-2.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${active ? "border-accent bg-accent-soft text-accent" : "border-line-soft bg-bg hover:border-line-strong hover:bg-bg-sunk"}`}
            >
              <span className="block text-[13px] font-semibold">{focus.label}</span>
              <span className={`mt-1 block text-[11.5px] leading-relaxed ${active ? "text-accent-ink" : "text-ink-4"}`}>{focus.note}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
