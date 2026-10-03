import FollowThrough from "../components/FollowThrough";
import ResultCard from "../components/ResultCard";
import { href, useJournal } from "../lib/hooks";
import { byWeek, removeEntry, replaceJournal, weekLabel } from "../lib/journal";
import { THEMES } from "../lib/themes";
import type { ReflectionInput } from "../types";

const QUESTIONS: [keyof ReflectionInput, string][] = [
  ["workedOn", "Worked on"],
  ["learned", "Learned"],
  ["difficult", "Difficult"],
  ["avoided", "Avoided"],
  ["improve", "Want to improve"],
];

export default function HistoryPage({ id }: { id?: string }) {
  const journal = useJournal();
  const entries = byWeek(journal);
  const hasExamples = journal.some((e) => e.example);
  const selected = id ? journal.find((e) => e.id === id) : undefined;

  if (selected) {
    return (
      <div className="history-detail">
        <a href={href({ page: "history" })} className="back">← All weeks</a>
        <h1>{weekLabel(selected.weekStart)}</h1>
        {selected.example && <p className="example-flag">Example entry</p>}
        <div className="spread">
          <div className="page answers">
            {QUESTIONS.map(([key, label]) => (
              <section key={key}>
                <p className="label">{label}</p>
                <p className="handwriting">{selected.input[key]}</p>
              </section>
            ))}
          </div>
          <div className="spread-right">
            <ResultCard response={selected.response} footer={<FollowThrough entry={selected} />} />
            <button
              type="button"
              className="link-button danger"
              onClick={() => {
                removeEntry(selected.id);
                window.location.hash = href({ page: "history" });
              }}
            >
              Delete this week
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="history">
      <div className="write-intro">
        <h1>Journal</h1>
        <p>Every week you've reflected on, newest first. Saved only in this browser.</p>
      </div>

      {hasExamples && (
        <p className="example-banner">
          These are example weeks so you can see how the journal grows.{" "}
          <button type="button" className="link-button" onClick={() => replaceJournal(journal.filter((e) => !e.example))}>
            Remove examples
          </button>
        </p>
      )}

      {entries.length === 0 ? (
        <p className="empty">
          No weeks yet. <a href={href({ page: "write" })}>Write your first reflection →</a>
        </p>
      ) : (
        <ol className="entries">
          {entries.map((e) => {
            const theme = THEMES[e.response.result.theme];
            return (
              <li key={e.id}>
                <a href={href({ page: "history", id: e.id })} className="entry">
                  <span className="entry-week">{weekLabel(e.weekStart)}</span>
                  <span className="theme-tag" style={{ "--tag": theme.color } as React.CSSProperties}>
                    {theme.short}
                  </span>
                  <span className="entry-step">{e.response.result.practicalNextStep}</span>
                  <span className={`entry-done done-${String(e.followedThrough)}`}>
                    {e.followedThrough === null ? "–" : e.followedThrough ? "Done" : "Not yet"}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
