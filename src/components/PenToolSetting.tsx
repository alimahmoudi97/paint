import { useEffect } from "react";
import { useContextCanvas } from "../hooks/useContextCanvas";

function PenToolSetting() {
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
  };

  return (
    <div className="flex flex-col gap-2 mt-4">
      <h3 className="text-base font-semibold">Pen Settings</h3>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Pen Size</label>
        <input
          type="number"
          className="bg-gray-100 p-2 rounded"
          value={contentState.strokeWidth || 1}
          onChange={(e) =>
            handlePropertyChange("strokeWidth", parseInt(e.target.value))
          }
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Pen Color</label>
        <input
          type="color"
          className="bg-gray-100 w-8 rounded"
          value={contentState.colorShape || "#000000"}
          onChange={(e) => handlePropertyChange("colorShape", e.target.value)}
        />
        <input
          type="text"
          value={contentState.colorShape}
          onChange={(e) => handlePropertyChange("colorShape", e.target.value)}
          placeholder={contentState.colorShape}
          className="focus:outline-0 w-16"
        />
      </div>
    </div>
  );
}

export default PenToolSetting;
