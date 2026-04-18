import { useState } from "react";
import type { ReflectionInput } from "../types";

type ReflectionFormProps = {
  onSubmit: (data: ReflectionInput) => void;
  isLoading: boolean;
};

const initialState: ReflectionInput = {
  workedOn: "",
  learned: "",
  difficult: "",
  avoided: "",
  improve: "",
};

export default function ReflectionForm({
  onSubmit,
  isLoading,
}: ReflectionFormProps) {
  const [form, setForm] = useState<ReflectionInput>(initialState);

  function handleChange(
    e: React.ChangeEvent<HTMLTextAreaElement>
  ): void {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <h1>Growth Mirror</h1>
      <p className="subtitle">
        Reflect on your week and get a clearer next step.
      </p>

      <label>
        What did I work on this week?
        <textarea
          name="workedOn"
          value={form.workedOn}
          onChange={handleChange}
          placeholder="Projects, coding, design work, problem-solving..."
          rows={4}
          required
        />
      </label>

      <label>
        What did I learn this week?
        <textarea
          name="learned"
          value={form.learned}
          onChange={handleChange}
          placeholder="Concepts, tools, mistakes, insights..."
          rows={4}
          required
        />
      </label>

      <label>
        What felt difficult?
        <textarea
          name="difficult"
          value={form.difficult}
          onChange={handleChange}
          placeholder="Confusion, blockers, frustration..."
          rows={4}
          required
        />
      </label>

      <label>
        What did I avoid or postpone?
        <textarea
          name="avoided"
          value={form.avoided}
          onChange={handleChange}
          placeholder="Things that matter but kept slipping..."
          rows={4}
          required
        />
      </label>

      <label>
        What do I want to improve next?
        <textarea
          name="improve"
          value={form.improve}
          onChange={handleChange}
          placeholder="Skill, habit, confidence, consistency..."
          rows={4}
          required
        />
      </label>

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Reflecting..." : "Reflect My Growth"}
      </button>
    </form>
  );
}