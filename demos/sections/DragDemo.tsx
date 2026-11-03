import React from "react";
import Carousel from "../../src/Carousel";
import Face from "../Face";
import DemoSection from "../components/DemoSection";
import { EMPTY, HUES } from "../data";

// Drag to rotate, built entirely by the consumer: pointer events on the root
// set a fractional currentFace, the transition is switched off while
// dragging, and releasing snaps to the nearest face.
export default function DragDemo() {
  const [position, setPosition] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const start = React.useRef<{ x: number; position: number } | null>(null);

  return (
    <DemoSection
      id="drag"
      title="Drag to rotate"
      description={
        <>
          Drag the carousel sideways. <code>currentFace</code> accepts fractions,
          so the prism follows the pointer exactly; on release it snaps to the
          nearest face. The transition is passed only when not dragging, so the
          drag itself isn't eased. Current position:{" "}
          <output>{position.toFixed(2)}</output>
        </>
      }
    >
      <Carousel
        orientation="horizontal"
        aria-label="Draggable carousel"
        noChildrenElem={EMPTY}
        currentFace={position}
        transition={dragging ? undefined : "transform 0.4s ease-out"}
        style={{ touchAction: "pan-y", cursor: dragging ? "grabbing" : "grab" }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          start.current = { x: e.clientX, position };
          setDragging(true);
        }}
        onPointerMove={(e) => {
          if (!start.current) return;
          // With 6 faces, one face is half the carousel's width wide.
          const faceWidth = e.currentTarget.clientWidth / 2;
          const dx = e.clientX - start.current.x;
          setPosition(start.current.position - dx / faceWidth);
        }}
        onPointerUp={() => {
          start.current = null;
          setDragging(false);
          setPosition((p) => Math.round(p));
        }}
        onPointerCancel={() => {
          start.current = null;
          setDragging(false);
          setPosition((p) => Math.round(p));
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
