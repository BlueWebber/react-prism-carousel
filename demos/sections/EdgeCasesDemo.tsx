import React from "react";
import Carousel from "../../src/Carousel";
import Face from "../Face";
import DemoSection from "../components/DemoSection";
import { Stepper } from "../components/Controls";
import { EMPTY, HUES } from "../data";

// 0, 1 and 2 faces, side by side.
export default function EdgeCasesDemo() {
  const [face, setFace] = React.useState(0);

  return (
    <DemoSection
      id="edge-cases"
      title="0, 1 and 2 faces"
      description={
        <>
          With no children, <code>noChildrenElem</code> is shown flat. One face
          has no prism to draw (<code>data-flat</code>), so it fills the
          carousel and doesn't rotate. Two faces sit back to back with zero
          depth, like a card that flips; the faces hide their backs, so only one
          side shows at a time. The buttons drive all three.
        </>
      }
      controls={<Stepper value={face} onChange={setFace} />}
      stageClassName="demo-stage--grid"
    >
      <Carousel
        orientation="horizontal"
        aria-label="Carousel with no slides"
        noChildrenElem={EMPTY}
        currentFace={face}
      />
      <Carousel
        orientation="horizontal"
        aria-label="Carousel with one slide"
        noChildrenElem={EMPTY}
        currentFace={face}
      >
        <Face hue={HUES[0]}>Only face</Face>
      </Carousel>
      <Carousel
        orientation="horizontal"
        aria-label="Carousel with two slides"
        noChildrenElem={EMPTY}
        currentFace={face}
        transition="transform 0.6s ease"
      >
        <Face hue={HUES[1]}>Front</Face>
        <Face hue={HUES[3]}>Back</Face>
      </Carousel>
    </DemoSection>
  );
}
