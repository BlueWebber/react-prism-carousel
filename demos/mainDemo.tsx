import React from "react";
import Carousel from "../src/Carousel";
import Face from "./Face";

const MainDemo = () => {
  const [currentFace, setCurrentFace] = React.useState(0);
  return (
    <section>
      <Carousel
        orientation="vertical"
        style={{ width: "100%", height: "100%" }}
        noChildrenElem={<div>No children</div>}
        currentFace={currentFace}
        numEmptyFaces={2}
        faceProps={{
          style: {
            padding: "1rem",
            border: "1px solid black",
            backgroundColor: "blue",
          },
        }}
        transition="0.5s ease-in"
      >
        <Face>1</Face>
        <Face>2</Face>
        <Face>3</Face>
        <Face>4</Face>
        <Face>5</Face>
        <Face>6</Face>
        <Face>7</Face>
        <Face>8</Face>
        <Face>9</Face>
        <Face>10</Face>
      </Carousel>
      <div style={{ zIndex: 4 }}>
        <button onClick={() => setCurrentFace((prev) => Math.max(0, prev - 1))}>
          Previous
        </button>
        <button onClick={() => setCurrentFace((prev) => Math.min(9, prev + 1))}>
          Next
        </button>
      </div>
    </section>
  );
};

export default MainDemo;
