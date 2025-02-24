import { useEffect } from "react";
import { useContextCanvas } from "../hooks/useContextCanvas";

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

  useEffect(() => {
    console.log("contentState:", contentState);
  }, [contentState]);

  return (
    <div className="flex flex-col gap-2 mt-4">
      <h3 className="text-base font-semibold">Typography Settings</h3>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Font Size</label>
        <input
          type="number"
          className="bg-gray-100 p-2 rounded"
          value={contentState.fontSize || 16}
          onChange={(e) =>
            handlePropertyChange("fontSize", parseInt(e.target.value))
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Font Family</label>
        <input
          type="text"
          className="bg-gray-100 p-2 rounded"
          value={contentState.fontFamily || "Arial"}
          onChange={(e) => handlePropertyChange("fontFamily", e.target.value)}
        />
      </div>
      <label className="text-sm font-medium">Font Color</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          className="bg-gray-100 w-8 rounded"
          value={contentState.fontColor || "#000000"}
          onChange={(e) => handlePropertyChange("fontColor", e.target.value)}
        />
        <input
          type="text"
          value={contentState.fontColor}
          onChange={(e) => handlePropertyChange("fontColor", e.target.value)}
          placeholder={contentState.strokeColor}
          className="focus:outline-0 w-16"
        />
      </div>
    </div>
  );
}

export default TypographySetting;
