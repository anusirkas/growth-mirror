import type { ReactNode } from "react";

type SectionProps = {
  title: string;
  icon?: string;
  children: ReactNode;
};

export default function Section({ title, icon, children }: SectionProps) {
  return (
    <section className="section">
      <div className="section-heading">
        {icon ? <span className="section-icon">{icon}</span> : null}
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}