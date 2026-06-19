import { useContextCanvas } from "../hooks/useContextCanvas";
import { ColorField, FieldRow, NumberField, SettingCard } from "./SettingControls";

function TypographySetting() {
  const { contentState, setContentState } = useContextCanvas();

  const handlePropertyChange = (
    property: string,
    value: string | number | boolean
  ) => {
    const canvas = contentState.canvas;
    if (!canvas) return;

    setContentState((prev) => ({
      ...prev,
      [property]: value,
    }));

    const activeObject = canvas.getActiveObject();

    if (activeObject) {
      activeObject.set(property === "fontColor" ? "fill" : property, value);
      activeObject.setCoords();
      canvas.renderAll();
    }
  };

  return (
    <SettingCard title="Typography">
      <div className="flex flex-col gap-3">
        <FieldRow label="Font size">
          <NumberField
            suffix="px"
            value={contentState.fontSize || 16}
            onChange={(value) => handlePropertyChange("fontSize", parseInt(value))}
          />
        </FieldRow>
        <FieldRow label="Font family">
          <input
            type="text"
            value={contentState.fontFamily || "Arial"}
            onChange={(e) => handlePropertyChange("fontFamily", e.target.value)}
            className="flex-1 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </FieldRow>
        <FieldRow label="Font color">
          <ColorField
            value={contentState.fontColor || "#000000"}
            onChange={(value) => handlePropertyChange("fontColor", value)}
          />
        </FieldRow>
      </div>
    </SettingCard>
  );
}

export default TypographySetting;
