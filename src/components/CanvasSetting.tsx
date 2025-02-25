import { useState } from "react";
import { useContextCanvas } from "../hooks/useContextCanvas";

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
        canvas.backgroundColor = backgroundColor;
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
    <div className="flex flex-col gap-2 mt-4">
      <h3 className="text-base font-semibold">Canvas Settings</h3>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Canvas Width</label>
        <input
          type="number"
          className="bg-gray-100 p-2 rounded"
          value={canvasWidth}
          onChange={(e) =>
            handleCanvasPropertyChange("width", parseInt(e.target.value))
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Canvas Height</label>
        <input
          type="number"
          className="bg-gray-100 p-2 rounded"
          value={canvasHeight}
          onChange={(e) =>
            handleCanvasPropertyChange("height", parseInt(e.target.value))
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Background Color</label>
        <input
          type="color"
          className="bg-gray-100  rounded"
          value={backgroundColor as string}
          onChange={(e) =>
            handleCanvasPropertyChange("backgroundColor", e.target.value)
          }
        />
      </div>
    </div>
  );
}
export default CanvasSetting;
