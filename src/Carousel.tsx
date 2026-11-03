import React from "react";
import styles from "./index.module.css";

// Consumers' bundlers replace process.env.NODE_ENV at build time (Vite library mode
// deliberately leaves it in for them). Declared here so it type-checks without @types/node.
declare const process: { env: { NODE_ENV?: string } };

export type FaceProps = React.HTMLAttributes<HTMLSpanElement>;
export type PrismProps = React.HTMLAttributes<HTMLDivElement>;

interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  orientation: "horizontal" | "vertical";
  noChildrenElem: React.ReactNode;
  centerpieceElem?: React.ReactNode;
  currentFace?: number; //index of the current face to show, default is 0
  numEmptyFaces?: number; //number of empty faces to add to the carousel, default is 0
  // props for each face's wrapper: one object for every face, or a function for per-face props
  // isFront: whether this face is the one currently facing the viewer
  faceProps?: FaceProps | ((index: number, isFront: boolean) => FaceProps);
  prismProps?: PrismProps; //props for the prism itself
  faceSize?: string; //size of each face
  concave?: boolean;
  cameraOffset?: string; // negative values move the camera away from the prism, positive values move it closer
  transition?: string; // CSS transition for the prism transform
}

function Carousel({
  children,
  orientation,
  noChildrenElem,
  centerpieceElem,
  faceProps,
  prismProps,
  currentFace = 0,
  numEmptyFaces = 0,
  faceSize,
  concave = false,
  cameraOffset,
  transition,
  ...props
}: CarouselProps) {
  // Dev-only warning: % works for the face size but is invalid in the
  // transform-origin Z value, so the prism silently collapses.
  // In an effect so it logs once per faceSize change, not on every render.
  React.useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" &&
      faceSize?.trim().endsWith("%")
    ) {
      console.warn(
        `Carousel: faceSize "${faceSize}" uses %, which the 3D depth (transform-origin Z) doesn't accept. ` +
          `Use cqw (horizontal) or cqh (vertical) for sizes relative to the carousel.`,
      );
    }
  }, [faceSize]);

  const faces = React.Children.toArray(children);
  const childCount = faces.length;

  const emptyFaces = Number.isFinite(numEmptyFaces)
    ? Math.max(0, Math.floor(numEmptyFaces))
    : 0;

  const isFlat = childCount === 0 || childCount + emptyFaces === 1;

  let transformedCurrentFace = currentFace;
  if (emptyFaces && childCount > 0) {
    transformedCurrentFace = Math.min(Math.max(currentFace, 0), childCount - 1);
  }

  // Index of the face currently facing the viewer, or -1 if none.
  // round: fractional positions (dragging) show the nearest face.
  // wrap: a closed prism accepts any value (13 with 10 faces = face 3, -1 = face 9).
  //   For an arc the value is already clamped, so the wrap changes nothing there.
  // >= childCount: the nearest slot is an empty face (can't happen after the arc clamp,
  //   kept so the result is always a real child index or -1).
  const totalSides = childCount + emptyFaces;
  let frontFace = -1;
  if (childCount > 0 && Number.isFinite(transformedCurrentFace)) {
    const rounded = Math.round(transformedCurrentFace);
    const wrapped = ((rounded % totalSides) + totalSides) % totalSides;
    frontFace = wrapped < childCount ? wrapped : -1;
  }

  return (
    <div
      // ARIA (WAI-ARIA carousel pattern). Before the spread so consumers can
      // override them; they should also pass an aria-label naming the carousel.
      role="region"
      aria-roledescription="carousel"
      {...props}
      className={[styles.carouselContainer, props.className]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        {...prismProps}
        data-orientation={orientation}
        data-flat={isFlat || undefined}
        data-facesize={faceSize ? "manual" : undefined}
        data-concave={concave || undefined}
        style={
          {
            ...prismProps?.style,
            "--prism-current-face": transformedCurrentFace,
            "--prism-face-count": childCount,
            "--prism-num-empty-faces": emptyFaces,
            "--prism-face-size": faceSize,
            "--prism-camera-offset": cameraOffset,
            "--prism-transition": transition,
          } as React.CSSProperties
        }
        className={[styles.carousel, prismProps?.className]
          .filter(Boolean)
          .join(" ")}
      >
        {childCount === 0
          ? noChildrenElem
          : faces.map((child, i) => (
              <span
                key={
                  React.isValidElement(child) && child.key != null
                    ? child.key
                    : i
                }
                // ARIA for each slide. Before the faceProps spread so consumers can
                // replace the label (e.g. with the slide's title) or the roles.
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${childCount}`}
                {...(typeof faceProps === "function"
                  ? faceProps(i, i === frontFace)
                  : faceProps)}
              >
                {child}
              </span>
            ))}
        <div className={styles.centerpiece}>{centerpieceElem}</div>
      </div>
    </div>
  );
}

export default Carousel;
