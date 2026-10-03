import { setFollowedThrough, type Entry } from "../lib/journal";

/** Closes the loop: did last week's practical step actually happen? */
export default function FollowThrough({ entry }: { entry: Entry }) {
  const options: { value: boolean; label: string }[] = [
    { value: true, label: "Done" },
    { value: false, label: "Not yet" },
  ];
  return (
    <div className="follow" role="group" aria-label="Did you take this step?">
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
  );
}
