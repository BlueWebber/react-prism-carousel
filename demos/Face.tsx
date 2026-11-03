import type React from "react";

interface FaceProps {
  children: React.ReactNode;
  // hue of the face's background colour (0–360)
  hue?: number;
  className?: string;
}

// A solid slide. Its content sits in its own element so recipes like
// card backs (see CardBackDemo) can target the content separately.
const Face = ({ children, hue = 220, className }: FaceProps) => {
  return (
    <div
      className={["face", className].filter(Boolean).join(" ")}
      style={{ "--hue": hue } as React.CSSProperties}
    >
      <span className="face-content">{children}</span>
    </div>
  );
};

export default Face;
