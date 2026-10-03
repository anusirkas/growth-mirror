import { href, useJournal } from "../lib/hooks";
import { byWeek, isoWeek, journalStats, weekLabel } from "../lib/journal";
import { THEMES } from "../lib/themes";
import type { Theme } from "../types";

export default function ProgressPage() {
  const journal = useJournal();
  const entries = byWeek(journal);
  const oldestFirst = [...entries].reverse();
  const stats = journalStats(entries);

  if (entries.length === 0) {
    return (
      <div className="progress">
        <div className="write-intro">
          <h1>Progress</h1>
        </div>
        <p className="empty">
          Your progress appears after your first reflection. <a href={href({ page: "write" })}>Start this week →</a>
        </p>
      </div>
    );
  }

  const top = stats.mostCommon ? THEMES[stats.mostCommon] : null;

  return (
    <div className="progress">
      <div className="write-intro">
        <h1>Progress</h1>
        <p>Patterns across your weeks, and how often you followed through on the step you chose.</p>
      </div>

      <dl className="stats">
        <div>
          <dt>Weeks reflected</dt>
          <dd>{stats.weeks}</dd>
        </div>
        <div>
          <dt>Steps followed through</dt>
          <dd>
            {stats.followThrough === null ? "–" : `${Math.round(stats.followThrough * 100)}%`}
            {stats.answered > 0 && <small> of {stats.answered} answered</small>}
          </dd>
        </div>
        <div>
          <dt>Most common pattern</dt>
          <dd>{top ? top.label : "–"}</dd>
        </div>
      </dl>

      <section className="panel">
        <h2>Patterns</h2>
        <div className="pattern-bar" role="img" aria-label={(Object.keys(THEMES) as Theme[]).map((t) => `${THEMES[t].label}: ${stats.themeCounts[t]}`).join(", ")}>
          {(Object.keys(THEMES) as Theme[])
            .filter((t) => stats.themeCounts[t] > 0)
            .map((t) => (
              <span key={t} style={{ flexGrow: stats.themeCounts[t], background: THEMES[t].color }} />
            ))}
        </div>
        <ul className="legend">
          {(Object.keys(THEMES) as Theme[]).map((t) => (
            <li key={t}>
              <span className="dot" style={{ background: THEMES[t].color }} aria-hidden="true" />
              {THEMES[t].label} <span className="muted">{stats.themeCounts[t]}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h2>Timeline</h2>
        <ol className="timeline">
          {oldestFirst.map((e) => {
            const theme = THEMES[e.response.result.theme];
            return (
              <li key={e.id} style={{ "--tag": theme.color } as React.CSSProperties}>
                <a href={href({ page: "history", id: e.id })}>
                  <span className="tl-week">W{isoWeek(e.weekStart)}</span>
                  <span className="tl-body">
                    <span className="tl-head">
                      <strong>{theme.label}</strong>
                      <span className="muted">{weekLabel(e.weekStart).split(" · ")[1]}</span>
                    </span>
                    <span className="tl-step">{e.response.result.practicalNextStep}</span>
                  </span>
                  <span className={`entry-done done-${String(e.followedThrough)}`}>
                    {e.followedThrough === null ? "–" : e.followedThrough ? "Done" : "Not yet"}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
