import { useContextCanvas } from "../hooks/useContextCanvas";

function TypographySetting() {
  const { contentState, setContentState } = useContextCanvas();

  const handlePropertyChange = (
    property: string,
    value: string | number | boolean
  ) => {
    const canvas = contentState.canvas;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();

    if (activeObject) {
      activeObject.set(property, value);
      activeObject.setCoords();
      canvas.renderAll();
      setContentState((prev) => ({
        ...prev,
        selectedObject: activeObject,
      }));
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-4">
      <h3 className="text-base font-semibold">Typography Settings</h3>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Font Size</label>
        <input
          type="number"
          className="bg-gray-100 p-2 rounded"
          value={contentState.selectedObject?.fontSize || 16}
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
          value={contentState.selectedObject?.fontFamily || "Arial"}
          onChange={(e) => handlePropertyChange("fontFamily", e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Font Color</label>
        <input
          type="color"
          className="bg-gray-100 p-2 rounded"
          value={contentState.selectedObject?.fill || "#000000"}
          onChange={(e) => handlePropertyChange("fill", e.target.value)}
        />
      </div>
    </div>
  );
}

export default TypographySetting;
