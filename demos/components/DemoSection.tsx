import type React from "react";

interface DemoSectionProps {
  id: string;
  title: string;
  description: React.ReactNode;
  controls?: React.ReactNode;
  // extra class for the stage, e.g. to change its height
  stageClassName?: string;
  children: React.ReactNode;
}

// One demo: a heading, an explanation, the carousel on a stage, and controls.
export default function DemoSection({
  id,
  title,
  description,
  controls,
  stageClassName,
  children,
}: DemoSectionProps) {
  return (
    <section id={id} className="demo">
      <header>
        <h2>{title}</h2>
        <p>{description}</p>
      </header>
      <div className={["demo-stage", stageClassName].filter(Boolean).join(" ")}>
        {children}
      </div>
      {controls && <div className="demo-controls">{controls}</div>}
    </section>
  );
}
