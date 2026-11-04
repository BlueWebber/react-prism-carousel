# react-prism-carousel: reference for AI coding assistants

This file is for AI assistants writing code that **uses** this component in another project. Read all of it before writing or changing a `<Carousel>`. The human-oriented docs are in `README.md`.

## What it is

`Carousel` is a React 19 component that renders its children as the faces of a regular 3D prism, using pure CSS (`preserve-3d`, `sin()`/`cos()`, container query units, `sibling-index()`).

**It draws; it does not control.** It has no internal state, no autoplay, no buttons, no keyboard or drag handling. The consuming code owns `currentFace` in its own state and changes it in response to input.

## Install and import

`npm install react-prism-carousel`. The package is ESM-only, has a peer dependency on `react@^19`, and ships its own types.

```ts
import Carousel from "react-prism-carousel";               // or: import { Carousel } from …
import type { CarouselProps, FaceProps, PrismProps } from "react-prism-carousel";
```

**No CSS import is needed.** The package's JS imports its own stylesheet, and the bundler includes it. (Up to 0.1.2 consumers had to import `react-prism-carousel/style.css`; that import still works, is harmless, and doesn't duplicate the CSS.)

**Server rendering and tests.** Node can't import `.css`, so anything that runs the package unbundled in Node fails with `ERR_UNKNOWN_FILE_EXTENSION` / `Unknown file extension ".css"`. Make the tool bundle the package:

| Tool | Setting |
|---|---|
| Vite SSR (and frameworks built on Vite) | `ssr: { noExternal: ["react-prism-carousel"] }` in the Vite config |
| Vitest | `test: { server: { deps: { inline: ["react-prism-carousel"] } } }` |
| Next.js | `transpilePackages: ["react-prism-carousel"]` in `next.config.js` |
| Jest | `moduleNameMapper: { "\\.css$": "<rootDir>/styleStub.js" }` (stub: `module.exports = {};`), and allow Jest to transform the package (it's ESM-only) |

Client-only apps need none of these.

## Minimal correct usage

```tsx
const [face, setFace] = useState(0);

<div style={{ height: 320 }}>                     {/* REQUIRED: a parent with a definite height */}
  <Carousel
    orientation="horizontal"                      // required
    noChildrenElem={<p>No items</p>}              // required (null is allowed)
    aria-label="Featured products"                // always pass a label
    currentFace={face}
    transition="transform 0.6s ease"              // optional; the default is no animation
  >
    {items.map((item) => <Slide key={item.id} {...item} />)}
  </Carousel>
</div>
<button onClick={() => setFace((f) => f + 1)}>Next</button>
```

## Props

| Prop | Type | Default | Exact semantics |
|---|---|---|---|
| `orientation` | `"horizontal" \| "vertical"` | required | Horizontal spins around the Y axis (faces side by side, each 100% of the root's height). Vertical spins around the X axis (faces stacked, each 100% of the root's width). |
| `noChildrenElem` | `ReactNode` | required | Rendered, flat and full size, when there are 0 children. |
| `children` | `ReactNode` | | Processed with `Children.toArray`: arrays are flattened, `null`/`undefined`/booleans are dropped, a Fragment is ONE face. Each child becomes one face. Keys are preserved. |
| `currentFace` | `number` | `0` | Rotation in face units. Unbounded: with 6 faces, `6` shows face 0 and `-1` shows face 5. Fractions rotate partway. If `numEmptyFaces > 0`, clamped to `[0, childCount − 1]`. |
| `numEmptyFaces` | `number` | `0` | Extra invisible sides (rounded down, minimum 0). Total sides `n = childCount + numEmptyFaces`. Used to make an arc or scroller. |
| `faceSize` | `string` | | A CSS length: face width (horizontal) or height (vertical). The radius becomes `faceSize / (2·sin(180°/n))`. Use `px`, `rem`, `cqw` or `cqh`. **Never `%`**: it breaks the depth and triggers a dev warning. |
| `concave` | `boolean` | `false` | Faces point inward. The on-screen rotation direction is mirrored compared with convex. |
| `cameraOffset` | `string` | | A CSS length. Translates the prism along Z: **positive moves the camera closer**, negative moves it away. |
| `transition` | `string` | none | A CSS `transition` value applied to the prism. Rotation animates `transform`; `cameraOffset` animates `translate`. Forced to `none` under `prefers-reduced-motion: reduce`. |
| `centerpieceElem` | `ReactNode` | | Rendered on the prism's axis and counter-rotated so it always faces the viewer. Its wrapper fills the root's box: centre the content yourself. |
| `faceProps` | `FaceProps \| (index: number, isFront: boolean) => FaceProps` | | Spread onto every face wrapper `<span>`, AFTER the default `role`/`aria-*`, so it can override them. `isFront` = this face is the one nearest the front (`currentFace` rounded and wrapped). |
| `prismProps` | `PrismProps` | | Spread onto the prism `<div>`. `className` is merged. `style` is merged, but the component's CSS variables win. The `data-*` attributes can't be overridden. |
| other props | `HTMLAttributes<HTMLDivElement>` | | Spread onto the root `<div>`. `className` is merged; `style` passes through as is. Put `tabIndex`, `onKeyDown`, pointer handlers, `aria-label`, `perspective` and `perspectiveOrigin` here. |

## DOM structure

```
div.root     role=region aria-roledescription=carousel  {...rest props}   container-type:size; perspective:1000px; contain:paint
  div.prism  {...prismProps} data-orientation …                           preserve-3d; rotated by currentFace
    span     role=group aria-roledescription=slide aria-label="i+1 of N" {...faceProps(i, isFront)}
      child
    …one span per child…
    div.centerpiece
      centerpieceElem
```

## Hard rules

1. **The root needs a definite size.** It is `width: 100%; height: 100%` with `container-type: size`, so its content never sizes it. Put it in a parent with a height, or set `height`/`minHeight` on it with `style` or `className`. A carousel with no visible output is almost always 0px tall.
2. **To advance, increment or decrement; never wrap `currentFace` yourself.** Use `f + 1`, not `(f + 1) % n`. Wrapping makes the prism spin backwards through every face when the transition is on. The component wraps internally for `isFront`. Exception: with `numEmptyFaces > 0` the value is clamped, so clamp it in your own state too (`Math.min(Math.max(f, 0), count - 1)`), or "next" will appear stuck at the ends.
3. **Turn the transition off while dragging** (`transition={dragging ? undefined : "transform 0.4s ease-out"}`), feed a fractional `currentFace` during the drag, and `Math.round` it on release.
4. **The camera lens is CSS, not a prop.** Set `style={{ perspective: "600px" }}` and/or `perspectiveOrigin` on the root. There is no `lens` or `cameraOrigin` prop.
5. **Never `%` in `faceSize`.** Use `cqw` (horizontal) or `cqh` (vertical) for sizes relative to the carousel.
6. **Don't override geometry.** On the prism or face wrappers, don't set `position`, `inset`, `margin`, `transform`, `rotate`, `translate`, `transform-origin` or `transform-style`. On face wrappers, also leave the width (horizontal) or height (vertical) alone. Safe to change: face `height` (horizontal) or `width` (vertical), `padding`, `cursor`, colours, classes.
7. **Don't flatten 3D.** Don't put `overflow` (other than `visible`), `opacity < 1`, `filter`, `clip-path`, `mask`, `mix-blend-mode` or `isolation: isolate` on the prism; any of these collapses the carousel. For effects like dimming, style the slide inside the wrapper (`.dimmed > * { filter: … }`), not the wrapper.
8. **The component's CSS is in `@layer react-prism-carousel.components`.** Any unlayered consumer CSS beats it, including CSS that breaks rules 6–7.
9. **Always pass `aria-label`** (or `aria-labelledby`) on the root.
10. **The `--prism-*` custom properties are internal.** Don't read or set them.

## Geometry

- `n = childCount + numEmptyFaces`, `θ = 360° / n`.
- Default radius `r` = 50% of the root's width (horizontal) or height (vertical); with `faceSize`, `r = faceSize / (2·sin(θ/2))`.
- Face size = `2r·sin(θ/2)`. Defaults: 6 faces are each 50% of the width, 4 faces about 70.7%, 8 faces about 38.3%.
- Apothem (axis-to-face distance) `a = r·cos(θ/2)`.
- Camera on the axis: **convex** `cameraOffset = perspective + a`; **concave** `cameraOffset = perspective − a`.
- From outside, a convex prism shows its near half and a concave prism shows the inside of its far half. From inside, only the field of view in front of the camera is drawn (set by `perspective`; smaller = wider), and nothing behind the camera.

## Behaviour to rely on

- **0 children:** `noChildrenElem`, flat, full size.
- **1 child and no empty faces:** flat, full size, no rotation.
- **2 children:** a two-sided card at full size, back to back; each step flips it 180°.
- **Clicks and painting** are limited to the root's box (`contain: paint`). Faces outside it never overlap or block neighbouring elements.
- **Faces are not made `inert`** when turned away. If only the front face should be interactive or reachable by screen readers: `faceProps={(i, isFront) => ({ inert: !isFront })}`.
- **Backfaces are visible (mirrored) by default.** Hide them with `backface-visibility: hidden` on the slide.
- Inside slides, `cqw`/`cqh` resolve against the carousel root.
- `prefers-reduced-motion` disables the `transition` prop. An inline `prismProps.style.transition` still overrides that.

## Known issues in this version

This file ships inside the package, so this section always matches the installed version.

- **Clicks can reach the wrong element.** In a concave prism, a click on a visible face lands on the wrapper of the face opposite it, so the wrong `faceProps` handler runs. In a convex prism, clicks on faces other than the front one can land on the prism element instead. **Whenever faces have click handlers, or concave mode is used with interactive content, apply this workaround.** The CSS must be unlayered:

  ```tsx
  <Carousel prismProps={{ className: "prism-hit-fix" }} … />
  ```

  ```css
  .prism-hit-fix { pointer-events: none; }
  .prism-hit-fix > * { pointer-events: auto; backface-visibility: hidden; }
  .prism-hit-fix > :last-child { pointer-events: none; }           /* the centerpiece wrapper is always the last child */
  .prism-hit-fix > :last-child > * { pointer-events: auto; }
  @media (prefers-reduced-motion: reduce) { .prism-hit-fix > :last-child { transition: none; } }  /* next issue */
  ```

- **Under `prefers-reduced-motion`, the centerpiece still animates** its counter-rotation. The last rule above fixes it.
- **With exactly one face and no empty faces**, changing `currentFace` while a transition is set spins the centerpiece a full turn. Keep `currentFace` at 0 when there's only one face.

## Recipes

### Keyboard

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

### Drag

```tsx
const [pos, setPos] = useState(0);
const [dragging, setDragging] = useState(false);
const start = useRef<{ x: number; pos: number } | null>(null);
const end = () => { start.current = null; setDragging(false); setPos((p) => Math.round(p)); };

<Carousel
  currentFace={pos}
  transition={dragging ? undefined : "transform 0.4s ease-out"}
  style={{ touchAction: "pan-y" }}
  onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); start.current = { x: e.clientX, pos }; setDragging(true); }}
  onPointerMove={(e) => {
    if (!start.current) return;
    // n = total sides. With default sizing, face width = width·sin(180°/n)
    const facePx = e.currentTarget.clientWidth * Math.sin(Math.PI / n);
    setPos(start.current.pos - (e.clientX - start.current.x) / facePx);
  }}
  onPointerUp={end}
  onPointerCancel={end}
  …
/>
```

### Arc or scroller with clickable faces

```tsx
<Carousel
  orientation="horizontal"
  aria-label="Products"
  noChildrenElem={null}
  prismProps={{ className: "prism-hit-fix" }}  // see "Known issues"
  currentFace={face}               // keep 0 … items.length − 1
  numEmptyFaces={9}
  faceSize="30cqw"                 // keeps faces the same size whatever numEmptyFaces is
  transition="transform 0.5s ease"
  faceProps={(i, isFront) => ({
    onClick: () => setFace(i),
    className: isFront ? "front" : "dimmed",
    style: { cursor: "pointer", paddingInline: 6 },  // padding = gap between faces
  })}
>
  {items.map((it) => <Card key={it.id} {...it} />)}
</Carousel>
```

### Per-face accessible names

```tsx
faceProps={(i) => ({ "aria-label": items[i].title })}
```

### Card backs (background from both sides, content only from the front)

```css
.card { transform-style: preserve-3d; }
.card-content { backface-visibility: hidden; }
```

```tsx
<div className="card"><span className="card-content">{title}</span></div>
```

### Logo in the middle

```tsx
<Carousel
  faceSize="22cqw"
  style={{ perspectiveOrigin: "50% -40%" }}        // view from slightly above
  faceProps={{ style: { height: "40%" } }}          // shorter faces reveal the centerpiece
  centerpieceElem={
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
      <Logo />
    </div>
  }
  …
/>
```

### Camera inside the prism

```tsx
// 8 faces on a 918px-wide root: r = 459, a = 459·cos(22.5°) ≈ 424
<Carousel concave style={{ perspective: "300px" }} cameraOffset="-124px" … />  // 300 − 424
```

## Common mistakes

| Symptom | Cause | Fix |
|---|---|---|
| Nothing renders | The root is 0px tall | Give the parent (or the root) a height. |
| `ERR_UNKNOWN_FILE_EXTENSION` / `Unknown file extension ".css"` on the server or in tests | Node loaded the package unbundled | The setting for that tool in "Install and import". |
| A click runs the wrong face's handler, or side faces ignore clicks | The hit-testing known issue | Apply the workaround in "Known issues". |
| Prism collapses or looks flat | `%` in `faceSize`, or a 3D-flattening property on the prism | Use `cqw`/`cqh`/`px`; move effects onto the slides. |
| It spins backwards through every face at the end | `currentFace` wrapped with `%` | Keep incrementing. |
| "Next" seems stuck in an arc | Value clamped by `numEmptyFaces` while your state keeps growing | Clamp your state too. |
| Mirrored text on the back faces | Backfaces are visible by default | `backface-visibility: hidden` on the slide, or the card-back recipe. |
| Front face is huge | Large `faceSize` brings the front face near the camera | Negative `cameraOffset`, or a larger `perspective`. |
| Dragging feels laggy | Transition still on during the drag | `transition={dragging ? undefined : …}`. |
| Only one face is visible from inside | Narrow field of view | A smaller `perspective` (e.g. `300px`). |
