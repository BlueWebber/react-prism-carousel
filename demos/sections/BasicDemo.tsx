import React from "react";
import Carousel from "../../src/Carousel";
import Face from "../Face";
import DemoSection from "../components/DemoSection";
import { Stepper } from "../components/Controls";
import { EMPTY, HUES } from "../data";

// The basics: a closed horizontal prism driven by an unbounded currentFace,
// plus keyboard control wired up through the root props passthrough.
export default function BasicDemo() {
  const [face, setFace] = React.useState(0);

  return (
    <DemoSection
      id="basic"
      title="Horizontal prism"
      description={
        <>
          Six faces, driven by <code>currentFace</code>. The value is never
          wrapped, so going from the last face to the first keeps turning the
          same way. Click the carousel and use the arrow keys: the{" "}
          <code>onKeyDown</code> and <code>tabIndex</code> go straight to the
          root element.
        </>
      }
      controls={<Stepper value={face} onChange={setFace} />}
    >
      <Carousel
        orientation="horizontal"
        aria-label="Basic horizontal carousel"
        noChildrenElem={EMPTY}
        currentFace={face}
        transition="transform 0.6s ease"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") setFace((f) => f + 1);
          if (e.key === "ArrowLeft") setFace((f) => f - 1);
        }}
      >
        {HUES.slice(0, 6).map((hue, i) => (
          <Face key={i} hue={hue}>
            {i + 1}
          </Face>
        ))}
      </Carousel>
    </DemoSection>
  );
}
