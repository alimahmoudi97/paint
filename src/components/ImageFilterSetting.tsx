import { FabricImage, filters } from "fabric";
import { useContextCanvas } from "../hooks/useContextCanvas";
import { SettingCard, ToggleSwitch } from "./SettingControls";
import { useState, useEffect } from "react";

interface FilterValues {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  grayscale: boolean;
}

function FilterSlider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-16 shrink-0">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="flex-1 h-1.5 accent-purple-500 cursor-pointer"
      />
      <span className="text-xs text-gray-500 w-8 text-right font-mono">
        {value}
      </span>
    </div>
  );
}

function ImageFilterSetting() {
  const { contentState, setContentState } = useContextCanvas();
  const [filterValues, setFilterValues] = useState<FilterValues>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    blur: 0,
    grayscale: false,
  });

  const selectedObject = contentState.selectedObject;

  useEffect(() => {
    if (!selectedObject || selectedObject.type !== "image") return;
    const img = selectedObject as FabricImage;
    const list = img.filters || [];

    const b = list.find((f) => f instanceof filters.Brightness) as any;
    const c = list.find((f) => f instanceof filters.Contrast) as any;
    const s = list.find((f) => f instanceof filters.Saturation) as any;
    const bl = list.find((f) => f instanceof filters.Blur) as any;
    const g = list.some((f) => f instanceof filters.Grayscale);

    setFilterValues({
      brightness: b ? Math.round(b.brightness * 100) : 0,
      contrast: c ? Math.round(c.contrast * 100) : 0,
      saturation: s ? Math.round(s.saturation * 100) : 0,
      blur: bl ? Math.round(bl.blur * 100) : 0,
      grayscale: g,
    });
  }, [selectedObject]);

  const applyFilters = (vals: FilterValues) => {
    const canvas = contentState.canvas;
    if (!canvas || !selectedObject || selectedObject.type !== "image") return;

    const img = selectedObject as FabricImage;
    const list: InstanceType<typeof filters.BaseFilter>[] = [];

    if (vals.brightness !== 0)
      list.push(new filters.Brightness({ brightness: vals.brightness / 100 }));
    if (vals.contrast !== 0)
      list.push(new filters.Contrast({ contrast: vals.contrast / 100 }));
    if (vals.saturation !== 0)
      list.push(new filters.Saturation({ saturation: vals.saturation / 100 }));
    if (vals.blur !== 0)
      list.push(new filters.Blur({ blur: vals.blur / 100 }));
    if (vals.grayscale) list.push(new filters.Grayscale());

    img.filters = list;
    img.applyFilters();
    canvas.renderAll();
    setContentState((prev) => ({ ...prev, selectedObject: img }));
  };

  const handleChange = (key: keyof FilterValues, value: number | boolean) => {
    const next = { ...filterValues, [key]: value };
    setFilterValues(next);
    applyFilters(next);
  };

  if (!selectedObject || selectedObject.type !== "image") return null;

  return (
    <SettingCard title="Image Filters">
      <div className="flex flex-col gap-3">
        <FilterSlider
          label="Bright"
          min={-100}
          max={100}
          value={filterValues.brightness}
          onChange={(v) => handleChange("brightness", v)}
        />
        <FilterSlider
          label="Contrast"
          min={-100}
          max={100}
          value={filterValues.contrast}
          onChange={(v) => handleChange("contrast", v)}
        />
        <FilterSlider
          label="Saturate"
          min={-100}
          max={100}
          value={filterValues.saturation}
          onChange={(v) => handleChange("saturation", v)}
        />
        <FilterSlider
          label="Blur"
          min={0}
          max={100}
          value={filterValues.blur}
          onChange={(v) => handleChange("blur", v)}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Grayscale</span>
          <ToggleSwitch
            checked={filterValues.grayscale}
            onChange={(checked) => handleChange("grayscale", checked)}
          />
        </div>
      </div>
    </SettingCard>
  );
}

export default ImageFilterSetting;
