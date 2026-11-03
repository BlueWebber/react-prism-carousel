import React from "react";
import Carousel from "../../src/Carousel";
import Face from "../Face";
import DemoSection from "../components/DemoSection";
import { Range, Stepper } from "../components/Controls";
import { EMPTY, HUES } from "../data";

const COUNT = 7;

// A scroller: a few faces on a large, mostly empty prism, so several faces
// are visible at once. Every face is clickable; isFront drives the styling.
export default function ArcDemo() {
  const [face, setFace] = React.useState(3);
  const [emptyFaces, setEmptyFaces] = React.useState(9);

  return (
    <DemoSection
      id="arc"
      title="Arc scroller"
      description={
        <>
          <code>numEmptyFaces</code> adds invisible sides, which flattens the
          curve into an arc. <code>faceSize="30cqw"</code> keeps the slides the
          same size however many sides there are. With empty faces,{" "}
          <code>currentFace</code> is clamped to the real slides. Click any face
          to bring it to the front; <code>faceProps(i, isFront)</code> dims the
          others.
        </>
      }
      controls={
        <>
          <Stepper value={face} onChange={setFace} min={0} max={COUNT - 1} />
          <Range
            label="numEmptyFaces"
            value={emptyFaces}
            onChange={setEmptyFaces}
            min={0}
            max={24}
          />
        </>
      }
    >
      <Carousel
        orientation="horizontal"
        aria-label="Arc scroller"
        noChildrenElem={EMPTY}
        currentFace={face}
        numEmptyFaces={emptyFaces}
        faceSize="30cqw"
        transition="transform 0.5s ease"
        faceProps={(i, isFront) => ({
          className: isFront ? "is-front" : "dimmed",
          onClick: () => setFace(i),
          style: { cursor: "pointer", padding: "0 6px" },
        })}
      >
        {HUES.slice(0, COUNT).map((hue, i) => (
          <Face key={i} hue={hue}>
            {i + 1}
          </Face>
        ))}
      </Carousel>
    </DemoSection>
  );
}
