type Props = { done: boolean | null; size?: "small" | "large" };

/** A rubber stamp for the follow-through answer: red DONE, blue NOT YET. */
export default function Stamp({ done, size = "small" }: Props) {
  if (done === null) return <span className="stamp-empty" aria-label="Not answered yet">–</span>;
  return (
    <span className={`stamp stamp-${size} ${done ? "stamp-done" : "stamp-notyet"}`} role="img" aria-label={done ? "Done" : "Not yet"}>
      {done ? "Done" : "Not yet"}
    </span>
  );
}
