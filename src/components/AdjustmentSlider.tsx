interface Props {
  label: string;
  value: number;
  defaultValue: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  onReset: () => void;
}

const AdjustmentSlider = ({
  label,
  value,
  defaultValue,
  min,
  max,
  step,
  onChange,
  onReset,
}: Props) => {
  const isDefault = value === defaultValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-primary text-sm font-medium">{label}</label>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-secondary min-w-[36px] text-right">
            {value.toFixed(0)}
          </span>

          <button
            onClick={onReset}
            className={`p-1 text-secondary rounded-md transition-all duration-300 ${
              isDefault
                ? "text-accent2 cursor-default"
                : "text-primary hover:bg-surface"
            }`}
            disabled={isDefault}
            title={`Reset ${label} to default`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-full appearance-none h-1.5 bg-surface-hover rounded-full outline-none slider-thumb"
      />
    </div>
  );
};

export default AdjustmentSlider;
