import React from "react";
import Carousel from "../../src/Carousel";
import Face from "../Face";
import DemoSection from "../components/DemoSection";
import { Stepper } from "../components/Controls";
import { EMPTY, HUES } from "../data";

// The same prism turned on its side: rotation around X, sized with cqh.
export default function VerticalDemo() {
  const [face, setFace] = React.useState(0);

  return (
    <DemoSection
      id="vertical"
      title="Vertical prism"
      description={
        <>
          <code>orientation="vertical"</code> rotates around the X axis and
          measures the carousel's height instead of its width. Eight faces here.
        </>
      }
      controls={<Stepper value={face} onChange={setFace} />}
    >
      <Carousel
        orientation="vertical"
        aria-label="Vertical carousel"
        noChildrenElem={EMPTY}
        currentFace={face}
        transition="transform 0.6s ease"
      >
        {HUES.slice(0, 8).map((hue, i) => (
          <Face key={i} hue={hue}>
            {i + 1}
          </Face>
        ))}
      </Carousel>
    </DemoSection>
  );
}
