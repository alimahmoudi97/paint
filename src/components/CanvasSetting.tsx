import { useState } from "react";
import { useContextCanvas } from "../hooks/useContextCanvas";
import { ColorField, FieldRow, NumberField, SettingCard } from "./SettingControls";

function CanvasSetting() {
  const { contentState, setContentState } = useContextCanvas();
  const [canvasWidth, setCanvasWidth] = useState(
    contentState.canvas?.width || 800
  );
  const [canvasHeight, setCanvasHeight] = useState(
    contentState.canvas?.height || 600
  );
  const [backgroundColor, setCanvasBgColor] = useState(
    contentState.canvasBackgroundColor || "#ff5fff"
  );

  const handleCanvasPropertyChange = (
    property: string,
    value: string | number
  ) => {
    const canvas = contentState.canvas;
    if (!canvas) return;

    switch (property) {
      case "width":
        canvas.setWidth(value as number);
        setCanvasWidth(value as number);
        break;
      case "height":
        canvas.setHeight(value as number);
        setCanvasHeight(value as number);
        break;
      case "backgroundColor":
        setContentState((prev) => ({
          ...prev,
          canvasBackgroundColor: value as string,
        }));
        canvas.backgroundColor = value as string;
        canvas.renderAll();
        setCanvasBgColor(value as string);
        break;
      default:
        break;
    }

    setContentState((prev) => ({
      ...prev,
      canvas,
    }));
  };

  return (
    <SettingCard title="Canvas">
      <div className="flex flex-col gap-3">
        <FieldRow label="Width">
          <NumberField
            suffix="px"
            className="w-24"
            value={canvasWidth}
            onChange={(value) =>
              handleCanvasPropertyChange("width", parseInt(value))
            }
          />
        </FieldRow>
        <FieldRow label="Height">
          <NumberField
            suffix="px"
            className="w-24"
            value={canvasHeight}
            onChange={(value) =>
              handleCanvasPropertyChange("height", parseInt(value))
            }
          />
        </FieldRow>
        <FieldRow label="Background">
          <ColorField
            value={backgroundColor as string}
            onChange={(value) => handleCanvasPropertyChange("backgroundColor", value)}
          />
        </FieldRow>
      </div>
    </SettingCard>
  );
}
export default CanvasSetting;
