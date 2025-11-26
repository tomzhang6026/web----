type Props = {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

export default function Button({
  label,
  onClick,
  type = "button",
  disabled,
}: Props) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800 disabled:opacity-50"
    >
      {label}
    </button>
  );
}


