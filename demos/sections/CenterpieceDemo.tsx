import React from "react";
import Carousel from "../../src/Carousel";
import DemoSection from "../components/DemoSection";
import { Stepper } from "../components/Controls";
import { EMPTY, HUES, TITLES } from "../data";

// A logo at the centre with slides circling it. The slides are shorter than
// the carousel and semi-transparent, so the logo shows above, below and
// through the ring.
export default function CenterpieceDemo() {
  const [face, setFace] = React.useState(0);

  return (
    <DemoSection
      id="centerpiece"
      title="Centerpiece"
      description={
        <>
          <code>centerpieceElem</code> sits on the prism's axis, so slides in
          front of it cover it and it covers slides behind it. The slides are
          made shorter than the carousel with <code>faceProps</code>, and the
          camera is raised with <code>perspective-origin</code> so the ring is
          seen slightly from above.
        </>
      }
      controls={<Stepper value={face} onChange={setFace} />}
    >
      <Carousel
        orientation="horizontal"
        aria-label="Products around a logo"
        noChildrenElem={EMPTY}
        currentFace={face}
        transition="transform 0.8s ease"
        faceSize="22cqw"
        style={{ perspectiveOrigin: "50% -40%" }}
        faceProps={{ style: { height: "40%", padding: "0 8px" } }}
        centerpieceElem={
          <div className="logo-stage">
            <div className="logo">◆ Prism</div>
          </div>
        }
      >
        {TITLES.map((title, i) => (
          <div
            key={title}
            className="glass"
            style={{ "--hue": HUES[i] } as React.CSSProperties}
          >
            {title}
          </div>
        ))}
      </Carousel>
    </DemoSection>
  );
}
