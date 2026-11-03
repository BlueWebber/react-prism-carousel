interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

// Previous / Next buttons for currentFace. Without min/max the value is
// unbounded, which is how a closed prism keeps turning the short way round.
export function Stepper({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
}: StepperProps) {
  return (
    <div className="stepper">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
      >
        ◀ Previous
      </button>
      <output>
        currentFace = {Number.isInteger(value) ? value : value.toFixed(2)}
      </output>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
      >
        Next ▶
      </button>
    </div>
  );
}

interface RangeProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

export function Range({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = "",
}: RangeProps) {
  return (
    <label className="range">
      <span>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <output>
        {value}
        {unit}
      </output>
    </label>
  );
}

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <label className="toggle">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}
