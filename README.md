[![npm version](https://shields.io)](https://npmjs.com)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-prism-carousel)](https://bundlephobia.com)

# react-prism-carousel

A 3D prism carousel for React. Every child becomes one face of a regular prism, and the geometry is done entirely in CSS: no measuring, no animation loop, no JavaScript per frame.

The component only **draws** the prism. Deciding which face is in front, and when and how it turns (buttons, keys, drag, autoplay), is up to you.

- [Requirements](#requirements)
- [Installation](#installation)
- [Quick start](#quick-start)
- [How it works](#how-it-works)
- [Props](#props)
- [Sizing](#sizing)
- [Rotation and animation](#rotation-and-animation)
- [Camera](#camera)
- [Styling faces](#styling-faces)
- [Centerpiece](#centerpiece)
- [Clicks, focus and accessibility](#clicks-focus-and-accessibility)
- [Edge cases](#edge-cases)
- [Overriding styles](#overriding-styles)
- [TypeScript](#typescript)
- [Known issues](#known-issues)
- [Developing](#developing)

## Requirements

- React 19.
- A bundler that supports CSS Modules (Vite, Next.js, webpack with `css-loader`, …).
- A browser that supports `sibling-index()`, `sin()`/`cos()`, container queries (`container-type`, `cqw`/`cqh`), CSS nesting, `@layer`, and the individual `translate`/`rotate` properties. `sibling-index()` is the newest of these, so check its support first.

## Installation

```sh
npm install react-prism-carousel
```

Import the component, and import the stylesheet once anywhere in your app (next to your root component, for example):

```tsx
import Carousel from "react-prism-carousel";
import "react-prism-carousel/style.css";
```

The package is ESM-only.

### Using an AI coding assistant

The package includes a reference written for AI assistants, at `node_modules/react-prism-carousel/FOR-AI.md`, which always matches the version you installed. Assistants don't look inside `node_modules` on their own, so add this line to your project's agent instructions (`AGENTS.md`, `CLAUDE.md`, Cursor rules, …):

```md
Before writing code that uses react-prism-carousel, read node_modules/react-prism-carousel/FOR-AI.md.
```

It's also online at <https://unpkg.com/react-prism-carousel/FOR-AI.md>.

## Quick start

```tsx
import { useState } from "react";
import Carousel from "react-prism-carousel";
import "react-prism-carousel/style.css";

function Featured({ slides }) {
  const [face, setFace] = useState(0);

  return (
    <>
      {/* The carousel fills its parent, so the parent needs a height. */}
      <div style={{ height: 320 }}>
        <Carousel
          orientation="horizontal"
          aria-label="Featured products"
          noChildrenElem={<p>Nothing to show yet.</p>}
          currentFace={face}
          transition="transform 0.6s ease"
        >
          {slides.map((slide) => (
            <Slide key={slide.id} {...slide} />
          ))}
        </Carousel>
      </div>

      <button onClick={() => setFace((f) => f - 1)}>Previous</button>
      <button onClick={() => setFace((f) => f + 1)}>Next</button>
    </>
  );
}
```

There are two things to remember:

1. **Give it a height.** The carousel is `100%` of its parent's width and height and doesn't grow with its content.
2. **You own the rotation.** Change `currentFace` however you like. The component turns the prism to match.

## How it works

With `n` sides (your children plus any `numEmptyFaces`), each child is wrapped in a `<span>` and placed on one side of a regular `n`-sided prism:

- **`orientation="horizontal"`** spins around the vertical axis. Faces sit side by side, each as tall as the carousel.
- **`orientation="vertical"`** spins around the horizontal axis. Faces are stacked, each as wide as the carousel.

By default the prism's corners touch the carousel's edges: the radius is half the carousel's width (or height, when vertical), so each face is `width × sin(180° / n)` wide. With 6 faces, each face is half the carousel's width; with 4, about 71%.

`currentFace` turns the whole prism so that face is at the front.

The rendered DOM:

```
div   role="region" aria-roledescription="carousel"   ← the root: your other props go here
  div                                                 ← the prism: prismProps go here
    span  role="group" aria-roledescription="slide"   ← face wrapper: faceProps go here
      {your child}
    span …
    div                                               ← centerpiece wrapper
      {centerpieceElem}
```

## Props

| Prop | Type | Default | |
|---|---|---|---|
| `orientation` | `"horizontal" \| "vertical"` | **required** | Which axis the prism spins around. |
| `noChildrenElem` | `ReactNode` | **required** | Shown, full size, when there are no children. |
| `children` | `ReactNode` | | One face per child. |
| `currentFace` | `number` | `0` | The face to bring to the front. Fractions and out-of-range values are allowed (see [Rotation](#rotation-and-animation)). |
| `numEmptyFaces` | `number` | `0` | Adds empty sides, turning the closed prism into an arc. Rounded down; negative values count as 0. |
| `faceSize` | `string` (CSS length) | | Each face's width (horizontal) or height (vertical). Sets the prism's radius instead of the default. |
| `concave` | `boolean` | `false` | Faces point inward, as if you were inside the prism. |
| `cameraOffset` | `string` (CSS length) | | Moves the camera: positive values bring it closer, negative values move it away. |
| `transition` | `string` | none | A CSS `transition` value for the prism. |
| `centerpieceElem` | `ReactNode` | | Content placed on the prism's axis, which the faces circle around. |
| `faceProps` | `FaceProps` or `(index, isFront) => FaceProps` | | HTML attributes for every face wrapper. |
| `prismProps` | `PrismProps` | | HTML attributes for the prism element. |
| any other prop | `HTMLAttributes<HTMLDivElement>` | | Passed to the root element. |

**Children.** Arrays are flattened. `null`, `undefined` and booleans are skipped, so `{cond && <Slide/>}` doesn't leave an empty face. A Fragment counts as one face. Children's `key`s are kept.

**Root props.** `className` is added to the component's own class. `style`, event handlers, `tabIndex`, `aria-*` and the rest are passed through unchanged. This is where CSS `perspective` and `perspective-origin` go (see [Camera](#camera)).

**`prismProps`.** `className` is merged. `style` is merged too, but the component's own CSS variables are applied after yours.

**`faceProps`.** Applied after the component's default `role`, `aria-roledescription` and `aria-label`, so you can override them. As a function, it receives the face's index and `isFront`: whether that face is the one at the front right now.

## Sizing

The carousel is `100%` of its parent's width and height and uses `container-type: size`, which means **its size never depends on its content**. If its parent has no height, the carousel is 0px tall.

To make it a specific size, set `width`, `height`, `min-width` or `min-height` on the root with `style` or `className`. It can be bigger than its parent.

**`faceSize`** fixes the size of each face instead. The radius is then calculated from it: `radius = faceSize / (2 × sin(180° / n))`. Use it when faces must stay the same size however many sides there are (for example in an [arc](#arcs-and-scrollers)).

- Use any length: `px`, `rem`, or `cqw`/`cqh` to size relative to the carousel (`30cqw` is 30% of the carousel's width).
- **Don't use `%`.** The prism's depth is set with `transform-origin`, which doesn't accept percentages for Z, so the prism collapses. In development, the component warns about it in the console.
- A big `faceSize` makes a big prism, whose front face can come very close to the camera. Pull the camera back with a negative `cameraOffset`.

Anything outside the carousel's box is clipped (`contain: paint`). To show more of a large prism, make the carousel bigger.

**Gaps between faces:** add padding through `faceProps`. The wrappers use `box-sizing: border-box`, so padding shrinks your content, not the geometry.

```tsx
faceProps={{ style: { paddingInline: 8 } }}
```

## Rotation and animation

### `currentFace`

- **It isn't wrapped.** With 6 faces, `currentFace={6}` shows face 0 again and `-1` shows face 5. To loop smoothly, keep counting up (`f + 1`) instead of resetting to 0. Going from 5 back to 0 would spin the prism backwards through every face.
- **Fractions work.** `2.5` shows the prism halfway between faces 2 and 3, which is what you want for dragging (see below).
- **With `numEmptyFaces`, it's clamped** to `0 … children − 1`, so an empty side can never come to the front.
- `isFront` in `faceProps` uses the nearest whole face, wrapped into range.

### `transition`

A plain CSS `transition` value, applied to the prism. The rotation is its `transform` and `cameraOffset` is its `translate`:

```tsx
transition="transform 0.6s ease"
transition="transform 0.6s ease, translate 0.3s ease"
```

The default is no transition: changes are instant.

For users with `prefers-reduced-motion: reduce`, the transition is switched off. A `transition` you set yourself in `prismProps.style` still applies; that's treated as your explicit choice.

### Dragging

Drive `currentFace` with a fraction while dragging, turn the transition off during the drag, and round on release:

```tsx
const [position, setPosition] = useState(0);
const [dragging, setDragging] = useState(false);
const start = useRef(null);

<Carousel
  orientation="horizontal"
  aria-label="Draggable carousel"
  noChildrenElem={null}
  currentFace={position}
  transition={dragging ? undefined : "transform 0.4s ease-out"}
  style={{ touchAction: "pan-y" }}
  onPointerDown={(e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    start.current = { x: e.clientX, position };
    setDragging(true);
  }}
  onPointerMove={(e) => {
    if (!start.current) return;
    const faceWidth = e.currentTarget.clientWidth / 2; // 6 faces: half the width
    setPosition(start.current.position - (e.clientX - start.current.x) / faceWidth);
  }}
  onPointerUp={() => {
    start.current = null;
    setDragging(false);
    setPosition((p) => Math.round(p));
  }}
>
  {slides}
</Carousel>
```

### Arcs and scrollers

`numEmptyFaces` adds invisible sides. A few real faces on a prism with many sides form a gentle arc, which works as a scroller with several faces visible at once. Set `faceSize` too, so the faces don't shrink as you add sides:

```tsx
<Carousel
  orientation="horizontal"
  aria-label="Products"
  noChildrenElem={null}
  currentFace={face}
  numEmptyFaces={9}
  faceSize="30cqw"
  transition="transform 0.5s ease"
  faceProps={(i) => ({ onClick: () => setFace(i) })}
>
  {products}
</Carousel>
```

## Camera

Three settings control what the viewer sees. Two of them are plain CSS on the root:

| | Set with | |
|---|---|---|
| Lens (field of view) | CSS `perspective` on the root | Default `1000px`. Smaller values give a wider view and stronger distortion. |
| Camera position, sideways and up/down | CSS `perspective-origin` on the root | Default `50% 50%`. `"50% -40%"` looks down on the prism from above. |
| Camera distance | the `cameraOffset` prop | Positive values bring the camera closer, negative values move it away. |

```tsx
<Carousel
  style={{ perspective: "600px", perspectiveOrigin: "50% -40%" }}
  cameraOffset="-200px"
  …
/>
```

`perspective-origin` moves the camera, but it keeps looking straight ahead, like a shifted lens. It doesn't turn to aim at the prism.

### What the camera can see

- **From outside a convex prism**, you see the near half. The far half is turned away from you.
- **From outside a concave prism**, you see the inside of the far half. The near half is turned away from you.
- **From inside**, you only see what's in front of the camera. How much of the ring that is depends on `perspective`: at `1000px` on a carousel about 900px wide, the view is about 50° wide, roughly one face out of eight. Anything behind the camera isn't drawn.

Faces turned away from the camera are still drawn, mirrored, unless you hide their backs (see [Backfaces](#backfaces-and-card-backs)).

### Putting the camera inside the prism

With `n` sides and radius `r` (half the carousel's width by default), the distance from the axis to each face is `a = r × cos(180° / n)`. To put the camera exactly on the axis:

- **convex:** `cameraOffset = perspective + a`
- **concave:** `cameraOffset = perspective − a`

For example, take 8 concave faces on a 918px-wide carousel: `r = 459px` and `a ≈ 424px`. With `perspective: 300px`, `cameraOffset="-124px"` puts the camera on the axis. A small `perspective` like that gives a wide enough view to see several faces around you.

### Concave mode

`concave` turns every face inward. Because you're now looking at the inside of the ring, increasing `currentFace` turns the prism the other way on screen than in convex mode.

## Styling faces

`faceProps` sets attributes on every face wrapper. Use an object for all faces, or a function for per-face values:

```tsx
faceProps={(i, isFront) => ({
  className: isFront ? "front" : "behind",
  "aria-label": slides[i].title,
  onClick: () => setFace(i),
})}
```

**Dimming faces that aren't at the front:**

```css
.behind > * {
  filter: brightness(0.45);
}
```

This styles your slide inside the wrapper rather than the wrapper itself. That matters for slides that use 3D themselves (card backs): `filter`, `opacity` and similar properties flatten 3D on the element they're applied to.

**Face height** (horizontal) or **width** (vertical) isn't part of the geometry, so you can change it. Faces stay centred:

```tsx
faceProps={{ style: { height: "40%" } }}
```

### Backfaces and card backs

The browser draws faces that are turned away as their mirror image. You have three options:

- **Hide them completely:** set `backface-visibility: hidden` on your slide.
- **Show them mirrored:** do nothing.
- **Show a "card back"**, where the slide's background shows from both sides but its content only from the front. Set `transform-style: preserve-3d` on the slide and `backface-visibility: hidden` on its content:

  ```css
  .card {
    transform-style: preserve-3d;
  }
  .card-content {
    backface-visibility: hidden;
  }
  ```

  ```tsx
  <div className="card">
    <span className="card-content">{title}</span>
  </div>
  ```

## Centerpiece

`centerpieceElem` is placed on the prism's axis, with the faces circling around it. It turns against the prism's rotation, so it always faces the viewer. Faces in front of it cover it, and it covers faces behind it.

Its wrapper spans the carousel's whole box, so centre your content yourself:

```tsx
<Carousel
  orientation="horizontal"
  aria-label="Products around a logo"
  noChildrenElem={null}
  currentFace={face}
  faceSize="22cqw"
  style={{ perspectiveOrigin: "50% -40%" }}
  faceProps={{ style: { height: "40%" } }}
  centerpieceElem={
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
      <Logo />
    </div>
  }
>
  {products}
</Carousel>
```

Shorter faces and a raised camera, as in this example, let the centerpiece show above and below the ring.

## Clicks, focus and accessibility

### Clicks

Only what's inside the carousel's box is drawn and clickable (`contain: paint`). Faces that stick out of the box never cover or block neighbouring elements on the page.

Faces turned away from the viewer aren't made inert: in a scroller, several faces can be visible and clickable at once. (In 0.1.0, see [Known issues](#known-issues) for clicks that reach the wrong face.) If only the front face should be interactive and focusable:

```tsx
faceProps={(i, isFront) => ({ inert: !isFront })}
```

### Keyboard

There's no built-in keyboard handling. Add it on the root:

```tsx
<Carousel
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === "ArrowRight") setFace((f) => f + 1);
    if (e.key === "ArrowLeft") setFace((f) => f - 1);
  }}
  …
/>
```

### ARIA

The component follows the WAI-ARIA carousel pattern:

- The root has `role="region"` and `aria-roledescription="carousel"`. **Pass an `aria-label`** (or `aria-labelledby`) naming the carousel.
- Each face wrapper has `role="group"`, `aria-roledescription="slide"` and `aria-label="1 of 6"`. Override any of them through `faceProps`, for example to use the slide's title as its label.

All faces stay in the accessibility tree. Use the `inert` example above to hide all but the front face from screen readers too.

## Edge cases

| Children | `numEmptyFaces` | Result |
|---|---|---|
| 0 | any | `noChildrenElem`, flat and full size. |
| 1 | 0 | The single face, flat and full size, with no rotation. |
| 1 | > 0 | One face on an arc. |
| 2 | 0 | A two-sided card: both faces are full size, back to back, and each turn flips it 180°. Hide backfaces so you don't see the other face mirrored. |

## Overriding styles

The component's CSS lives in the cascade layer `react-prism-carousel.components`, so any CSS of yours that isn't in a layer overrides it. That includes CSS that breaks the prism. Avoid setting these:

- **On the prism and the face wrappers:** `position`, `inset`, `margin`, `transform`, `rotate`, `translate`, `transform-origin`, `transform-style`. On the face wrappers, also the width (horizontal) or height (vertical).
- **Properties that flatten 3D**, applied to the prism or the face wrappers: `overflow` other than `visible`, `opacity` below 1, `filter`, `clip-path`, `mask`, `mix-blend-mode`, `isolation: isolate`. On the prism, they flatten the whole carousel. On a face wrapper, they only affect slides that use 3D themselves. Put these effects on your slides instead.

Inside your slides, `cqw` and `cqh` refer to the carousel's root, since it's the nearest size container.

The `--prism-*` custom properties are internal and may change.

## TypeScript

Types ship with the package:

```ts
import Carousel, { type CarouselProps, type FaceProps, type PrismProps } from "react-prism-carousel";
// or the named export: import { Carousel } from "react-prism-carousel";
```

- `CarouselProps`: every prop above, plus the root's HTML attributes.
- `FaceProps`: `React.HTMLAttributes<HTMLSpanElement>`.
- `PrismProps`: `React.HTMLAttributes<HTMLDivElement>`.

Every prop has a doc comment, so your editor shows its description on hover.

## Known issues

These are known in 0.1.0 and will be fixed in a later version.

- **Clicks can reach the wrong face.** In a concave prism, a click on a visible face lands on the wrapper of the face opposite it, so that face's `faceProps` handlers run instead. In a convex prism, clicks on faces angled away from the viewer (every face but the front one) can land on the prism element instead. Clicks on the front face of a convex prism work. As a workaround, give the prism a class and add this unlayered CSS:

  ```tsx
  <Carousel prismProps={{ className: "prism-hit-fix" }} … />
  ```

  ```css
  .prism-hit-fix { pointer-events: none; }
  .prism-hit-fix > * { pointer-events: auto; backface-visibility: hidden; }
  /* the centerpiece wrapper is always the prism's last child */
  .prism-hit-fix > :last-child { pointer-events: none; }
  .prism-hit-fix > :last-child > * { pointer-events: auto; }
  ```

  `backface-visibility` here applies only to the face wrappers, not to your slides, so it doesn't change what you see.
- **With `prefers-reduced-motion`, the centerpiece still animates** its turn while the prism changes instantly. Workaround, with the class above: `@media (prefers-reduced-motion: reduce) { .prism-hit-fix > :last-child { transition: none; } }`.
- **With exactly one face** (and no `numEmptyFaces`), changing `currentFace` with a transition spins the centerpiece a full turn. Keep `currentFace` at 0 when there's only one face.

## Developing

```sh
npm install --legacy-peer-deps   # typescript-eslint doesn't accept TypeScript 7 as a peer yet
npm run dev                      # the demo page
npm run build                    # the package, into dist/
```

The demo page in `demos/` has one section per feature: horizontal and vertical prisms, an arc scroller, dragging, `faceProps`, concave mode and the camera, card backs, the centerpiece, and the 0-, 1- and 2-face edge cases.
