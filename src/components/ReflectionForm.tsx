import { useState } from "react";
import { MAX_FIELD_LENGTH } from "../lib/validate";
import type { ReflectionInput } from "../types";

type ReflectionFormProps = {
  weekLabel: string;
  onSubmit: (data: ReflectionInput) => void;
  isLoading: boolean;
  error: string | null;
};

const initialState: ReflectionInput = {
  workedOn: "",
  learned: "",
  difficult: "",
  avoided: "",
  improve: "",
};

/** A realistic week so visitors can see the result without writing their own. */
const EXAMPLE: ReflectionInput = {
  workedOn:
    "Shipped the product filter on our e-commerce site and fixed two checkout bugs. Spent most afternoons in meetings or answering Slack.",
  learned: "How URL search params can hold filter state, and that our webhook retries if we don't return 200 fast enough.",
  difficult: "Debugging a race condition in the cart. I kept second-guessing whether I was even looking in the right place.",
  avoided: "Writing tests for the filter, and asking a senior colleague for a code review because I didn't want to look slow.",
  improve: "Feel more confident asking for help early, and get better at testing async code.",
};

const QUESTIONS: { name: keyof ReflectionInput; label: string; placeholder: string }[] = [
  { name: "workedOn", label: "What did I work on this week?", placeholder: "Projects, tickets, design work, problems you solved…" },
  { name: "learned", label: "What did I learn?", placeholder: "Concepts, tools, mistakes, insights…" },
  { name: "difficult", label: "What felt difficult?", placeholder: "Confusion, blockers, frustration…" },
  { name: "avoided", label: "What did I avoid or postpone?", placeholder: "Things that matter but kept slipping…" },
  { name: "improve", label: "What do I want to improve next?", placeholder: "A skill, a habit, confidence, consistency…" },
];

export default function ReflectionForm({ weekLabel, onSubmit, isLoading, error }: ReflectionFormProps) {
  const [form, setForm] = useState<ReflectionInput>(initialState);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form className="page" onSubmit={handleSubmit}>
      <header className="page-head">
        <p className="label">{weekLabel}</p>
        <button type="button" className="link-button" onClick={() => setForm(EXAMPLE)}>
          Fill in an example week
        </button>
      </header>

      {QUESTIONS.map((q, i) => (
        <label key={q.name} className="prompt">
          <span className="prompt-q">
            <span className="prompt-n">{String(i + 1).padStart(2, "0")}</span>
            {q.label}
          </span>
          <textarea
            name={q.name}
            value={form[q.name]}
            onChange={handleChange}
            placeholder={q.placeholder}
            rows={3}
            maxLength={MAX_FIELD_LENGTH}
            required
          />
        </label>
      ))}

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="primary" disabled={isLoading}>
        {isLoading ? "Reading your week…" : "Reflect on my week →"}
      </button>

      <p className="fine-print">
        Your answers go to Google Gemini to write the reflection; your journal is saved only in this browser. Google may use
        free-tier requests to improve its models, so leave out names and anything private.
      </p>
    </form>
  );
}
