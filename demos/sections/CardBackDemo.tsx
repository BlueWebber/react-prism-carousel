import React from "react";
import Carousel from "../../src/Carousel";
import DemoSection from "../components/DemoSection";
import { Stepper, Toggle } from "../components/Controls";
import { EMPTY, HUES } from "../data";

interface CardProps {
  children: React.ReactNode;
  hue: number;
  hideContentOnBack: boolean;
}

// The card-back recipe: the card keeps its background from both sides,
// but its content is hidden when turned away. Needs preserve-3d on the
// card (the carousel already sets it on its own face wrapper) and
// backface-visibility: hidden on the content.
function Card({ children, hue, hideContentOnBack }: CardProps) {
  return (
    <div className="card" style={{ "--hue": hue } as React.CSSProperties}>
      <span className={hideContentOnBack ? "card-content" : undefined}>
        {children}
      </span>
    </div>
  );
}

export default function CardBackDemo() {
  const [face, setFace] = React.useState(0);
  const [hideBack, setHideBack] = React.useState(true);

  return (
    <DemoSection
      id="card-backs"
      title="Card backs"
      description={
        <>
          The cards are semi-transparent, so you can see the far side of the
          prism through the front. With the recipe on, the far cards show their
          coloured backs but no numbers. Turn it off to see the mirrored
          numbers you'd get otherwise.
        </>
      }
      controls={
        <>
          <Stepper value={face} onChange={setFace} />
          <Toggle
            label="hide content on the back"
            checked={hideBack}
            onChange={setHideBack}
          />
        </>
      }
    >
      <Carousel
        orientation="horizontal"
        aria-label="Card backs"
        noChildrenElem={EMPTY}
        currentFace={face}
        transition="transform 0.6s ease"
      >
        {HUES.slice(0, 6).map((hue, i) => (
          <Card key={i} hue={hue} hideContentOnBack={hideBack}>
            {i + 1}
          </Card>
        ))}
      </Carousel>
    </DemoSection>
  );
}
