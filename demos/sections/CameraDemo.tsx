import React from "react";
import Carousel from "../../src/Carousel";
import Face from "../Face";
import DemoSection from "../components/DemoSection";
import { Range, Stepper, Toggle } from "../components/Controls";
import { EMPTY, HUES } from "../data";

// Concave mode and the camera: perspective is the lens (field of view),
// cameraOffset moves the camera toward or away from the prism.
export default function CameraDemo() {
  const [face, setFace] = React.useState(0);
  const [concave, setConcave] = React.useState(true);
  const [lens, setLens] = React.useState(1000);
  const [offset, setOffset] = React.useState(0);

  return (
    <DemoSection
      id="camera"
      title="Concave mode and camera"
      description={
        <>
          <code>concave</code> turns every face inward, as if you were standing
          inside the carousel (note that "next" now turns the other way on
          screen). The lens is plain CSS <code>perspective</code> on the root;{" "}
          <code>cameraOffset</code> moves the camera: positive values bring it
          closer, eventually inside the prism, where faces behind the camera
          are clipped.
        </>
      }
      controls={
        <>
          <Stepper value={face} onChange={setFace} />
          <Toggle label="concave" checked={concave} onChange={setConcave} />
          <Range
            label="perspective (lens)"
            value={lens}
            onChange={setLens}
            min={200}
            max={3000}
            step={50}
            unit="px"
          />
          <Range
            label="cameraOffset"
            value={offset}
            onChange={setOffset}
            min={-1500}
            max={900}
            step={25}
            unit="px"
          />
        </>
      }
    >
      <Carousel
        orientation="horizontal"
        aria-label="Concave carousel"
        noChildrenElem={EMPTY}
        currentFace={face}
        concave={concave}
        cameraOffset={`${offset}px`}
        transition="transform 0.6s ease, translate 0.3s ease"
        style={{ perspective: `${lens}px` }}
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
