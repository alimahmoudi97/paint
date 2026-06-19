import { ReactNode } from "react";

export function SettingCard({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-gray-50 border border-gray-100 rounded-xl p-3.5 ${className}`}>
      {title && (
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

export function ColorField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-2 py-1.5 flex-1 focus-within:ring-2 focus-within:ring-purple-400">
      <label
        className="relative w-6 h-6 rounded-md overflow-hidden border border-gray-200 shrink-0 cursor-pointer"
        style={{ backgroundColor: value }}
      >
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm text-gray-700 focus:outline-none bg-transparent w-full uppercase"
      />
    </div>
  );
}

export function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full shrink-0 cursor-pointer transition-colors duration-200 ${
        checked ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
          checked ? "translate-x-4" : ""
        }`}
      />
    </button>
  );
}

export function IconButton({
  active,
  title,
  onClick,
  children,
}: {
  active?: boolean;
  title?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer transition-all duration-200 ${
        active
          ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/30"
          : "bg-white border border-gray-200 text-gray-500 hover:bg-purple-50 hover:text-purple-500 hover:border-purple-200"
      }`}
    >
      {children}
    </button>
  );
}

export function NumberField({
  value,
  onChange,
  suffix,
  className = "w-20",
  min,
  max,
}: {
  value: number | string;
  onChange: (value: string) => void;
  suffix?: string;
  className?: string;
  min?: number;
  max?: number;
}) {
  return (
    <div
      className={`flex items-center bg-white border border-gray-200 rounded-lg px-2 py-1.5 focus-within:ring-2 focus-within:ring-purple-400 ${className}`}
    >
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm text-gray-700 focus:outline-none bg-transparent"
      />
      {suffix && <span className="text-xs text-gray-400">{suffix}</span>}
    </div>
  );
}

export function FieldRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <label className="text-xs text-gray-500 shrink-0">{label}</label>
      {children}
    </div>
  );
}
