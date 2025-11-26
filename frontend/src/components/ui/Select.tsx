type Option = { label: string; value: string };

type Props = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
};

export default function Select({ label, value, onChange, options }: Props) {
  return (
    <label className="block">
      {label && <div className="mb-1 text-sm text-gray-700">{label}</div>}
      <select
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}


