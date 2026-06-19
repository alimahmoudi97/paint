import { useContextCanvas } from "../hooks/useContextCanvas";
import { ColorField, FieldRow, NumberField, SettingCard } from "./SettingControls";

function PenToolSetting() {
  const { contentState, setContentState } = useContextCanvas();

  const handlePropertyChange = (
    property: string,
    value: string | number | boolean
  ) => {
    setContentState((prev) => ({
      ...prev,
      [property]: value,
    }));
  };

  return (
    <SettingCard title="Pen">
      <div className="flex flex-col gap-3">
        <FieldRow label="Pen size">
          <NumberField
            suffix="px"
            min={1}
            value={contentState.strokeWidth || 1}
            onChange={(value) => handlePropertyChange("strokeWidth", parseInt(value))}
          />
        </FieldRow>
        <FieldRow label="Pen color">
          <ColorField
            value={contentState.colorShape || "#000000"}
            onChange={(value) => handlePropertyChange("colorShape", value)}
          />
        </FieldRow>
      </div>
    </SettingCard>
  );
}

export default PenToolSetting;
