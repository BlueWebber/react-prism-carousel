import React from "react";
import Carousel from "../../src/Carousel";
import Face from "../Face";
import DemoSection from "../components/DemoSection";
import { Range, Stepper } from "../components/Controls";
import { EMPTY, HUES, TITLES } from "../data";

// faceProps as a function: per-face labels, gaps via padding, and
// isFront-based styling, with no changes to the slides themselves.
export default function FacePropsDemo() {
  const [face, setFace] = React.useState(0);
  const [gap, setGap] = React.useState(12);

  return (
    <DemoSection
      id="face-props"
      title="Styling faces with faceProps"
      description={
        <>
          <code>faceProps</code> receives each face's index and whether it's in
          front. Here it replaces the default "3 of 8" labels with planet names
          for screen readers, adds padding to make gaps between faces (the face
          wrappers use <code>box-sizing: border-box</code>, so the geometry
          doesn't change), and dims every face except the front one.
        </>
      }
      controls={
        <>
          <Stepper value={face} onChange={setFace} />
          <Range
            label="gap"
            value={gap}
            onChange={setGap}
            min={0}
            max={60}
            unit="px"
          />
        </>
      }
    >
      <Carousel
        orientation="horizontal"
        aria-label="Planets"
        noChildrenElem={EMPTY}
        currentFace={face}
        transition="transform 0.6s ease"
        faceProps={(i, isFront) => ({
          "aria-label": TITLES[i],
          className: isFront ? "is-front" : "dimmed",
          style: { paddingInline: gap / 2 },
        })}
      >
        {TITLES.map((title, i) => (
          <Face key={title} hue={HUES[i]}>
            {title}
          </Face>
        ))}
      </Carousel>
    </DemoSection>
  );
}
