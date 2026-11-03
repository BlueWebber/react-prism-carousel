import BasicDemo from "./sections/BasicDemo";
import VerticalDemo from "./sections/VerticalDemo";
import ArcDemo from "./sections/ArcDemo";
import DragDemo from "./sections/DragDemo";
import FacePropsDemo from "./sections/FacePropsDemo";
import CameraDemo from "./sections/CameraDemo";
import CardBackDemo from "./sections/CardBackDemo";
import CenterpieceDemo from "./sections/CenterpieceDemo";
import EdgeCasesDemo from "./sections/EdgeCasesDemo";

// Order = order on the page and in the table of contents.
const DEMOS = [
  { id: "basic", label: "Horizontal prism", Component: BasicDemo },
  { id: "vertical", label: "Vertical prism", Component: VerticalDemo },
  { id: "arc", label: "Arc scroller", Component: ArcDemo },
  { id: "drag", label: "Drag to rotate", Component: DragDemo },
  { id: "face-props", label: "Styling faces", Component: FacePropsDemo },
  { id: "camera", label: "Concave and camera", Component: CameraDemo },
  { id: "card-backs", label: "Card backs", Component: CardBackDemo },
  { id: "centerpiece", label: "Centerpiece", Component: CenterpieceDemo },
  { id: "edge-cases", label: "0, 1 and 2 faces", Component: EdgeCasesDemo },
];

export default function App() {
  return (
    <div className="page">
      <header className="page-header">
        <h1>react-prism-carousel</h1>
        <p>
          A 3D prism carousel for React. The component draws the prism; you
          decide how it turns.
        </p>
        <nav aria-label="Demos">
          <ul>
            {DEMOS.map(({ id, label }) => (
              <li key={id}>
                <a href={`#${id}`}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main>
        {DEMOS.map(({ id, Component }) => (
          <Component key={id} />
        ))}
      </main>
    </div>
  );
}
