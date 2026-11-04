import React from "react";
import styles from "./index.module.css";

// Consumers' bundlers replace process.env.NODE_ENV at build time (Vite library mode
// deliberately leaves it in for them). Declared here so it type-checks without @types/node.
declare const process: { env: { NODE_ENV?: string } };

// Without a bundler `process` doesn't exist and reading it throws, so treat that as
// production. (A `typeof process` check would hide the warning in bundled apps too:
// bundlers replace the whole `process.env.NODE_ENV` text, but `process` itself stays
// undefined in the browser.)
function isDev() {
  try {
    return process.env.NODE_ENV !== "production";
  } catch {
    return false;
  }
}

/** HTML attributes for each face's wrapper `<span>`. */
export type FaceProps = React.HTMLAttributes<HTMLSpanElement>;
/** HTML attributes for the prism `<div>`. */
export type PrismProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Props for {@link Carousel}. Any other HTML attribute is passed to the root `<div>`
 * (`className` is merged, `style` is passed as is): put `aria-label`, `tabIndex`,
 * event handlers, and the CSS `perspective` / `perspectiveOrigin` there.
 */
export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * One face per child. Arrays are flattened, `null` / `undefined` / booleans are
   * skipped, and a Fragment counts as one face.
   */
  children?: React.ReactNode;
  /**
   * `"horizontal"` spins around the vertical axis (faces side by side, each as tall
   * as the carousel); `"vertical"` spins around the horizontal axis.
   */
  orientation: "horizontal" | "vertical";
  /** Shown, flat and full size, when there are no children. `null` is allowed. */
  noChildrenElem: React.ReactNode;
  /**
   * Content on the prism's axis, turned so it always faces the viewer. Its wrapper
   * fills the carousel's box, so centre the content yourself.
   */
  centerpieceElem?: React.ReactNode;
  /**
   * The face to bring to the front. Default 0. Not wrapped: with 6 faces, 6 shows
   * face 0 again, so keep incrementing to loop smoothly. Fractions rotate partway
   * (for dragging). Clamped to the real faces when `numEmptyFaces` > 0.
   */
  currentFace?: number;
  /**
   * Extra empty sides, which turn the closed prism into an arc. Default 0.
   * Rounded down; negative values count as 0.
   */
  numEmptyFaces?: number;
  /**
   * Attributes for every face's wrapper `<span>`: one object for all faces, or a
   * function for per-face values. Applied after the default ARIA attributes, so it
   * can override them. `isFront`: this face is the one nearest the front.
   */
  faceProps?: FaceProps | ((index: number, isFront: boolean) => FaceProps);
  /** Attributes for the prism `<div>`. `className` and `style` are merged. */
  prismProps?: PrismProps;
  /**
   * Width (horizontal) or height (vertical) of each face, as a CSS length. The
   * radius is calculated from it. Use px, rem, cqw or cqh, never % (the depth
   * can't use %, so the prism collapses).
   */
  faceSize?: string;
  /** Faces point inward, as if seen from inside the prism. Default false. */
  concave?: boolean;
  /**
   * Moves the camera, as a CSS length: positive values bring it closer (eventually
   * inside the prism), negative values move it away.
   */
  cameraOffset?: string;
  /**
   * CSS `transition` for the prism: rotation is `transform`, `cameraOffset` is
   * `translate`. Default none. Switched off under `prefers-reduced-motion`.
   */
  transition?: string;
}

/**
 * A 3D prism carousel: every child is one face. The component only draws the
 * prism; keep `currentFace` in your own state and change it to turn it.
 *
 * The parent must have a height: the carousel fills it and never grows with its
 * content. Import `react-prism-carousel/style.css` once.
 *
 * @see https://unpkg.com/react-prism-carousel/FOR-AI.md for AI coding assistants,
 * also at node_modules/react-prism-carousel/FOR-AI.md
 * @see https://github.com/BlueWebber/react-prism-carousel#readme
 */
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
    if (isDev() && faceSize?.trim().endsWith("%")) {
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
