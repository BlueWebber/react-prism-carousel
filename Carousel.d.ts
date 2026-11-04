import React from "react";
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
declare function Carousel({ children, orientation, noChildrenElem, centerpieceElem, faceProps, prismProps, currentFace, numEmptyFaces, faceSize, concave, cameraOffset, transition, ...props }: CarouselProps): React.JSX.Element;
export default Carousel;
