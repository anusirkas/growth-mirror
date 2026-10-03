import { setFollowedThrough, type Entry } from "../lib/journal";
import Stamp from "./Stamp";

/** Closes the loop: did last week's practical step actually happen? Answering stamps the note. */
export default function FollowThrough({ entry }: { entry: Entry }) {
  const options: { value: boolean; label: string }[] = [
    { value: true, label: "Done" },
    { value: false, label: "Not yet" },
  ];
  return (
    <div className="follow">
      <div className="follow-row" role="group" aria-label="Did you take this step?">
        <span className="follow-q">Did you do it?</span>
        {options.map((o) => (
          <button
            key={o.label}
            type="button"
            className="follow-btn"
            aria-pressed={entry.followedThrough === o.value}
            onClick={() => setFollowedThrough(entry.id, entry.followedThrough === o.value ? null : o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
      {entry.followedThrough !== null && (
        // keyed so the stamp animates again whenever the answer changes
        <span key={String(entry.followedThrough)} className="follow-stamp">
          <Stamp done={entry.followedThrough} size="large" />
        </span>
      )}
    </div>
  );
}
