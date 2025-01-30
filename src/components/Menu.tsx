import { useEffect, useState } from "react";
import { useContextCanvas } from "../context/Context";

function Menu() {
  const { contentState, setContentState } = useContextCanvas();
  const [selectedShape, setSelectedShape] = useState("");
  const [selectedColor, setSelectedColor] = useState("red");
  const [isFillShape, setFillShape] = useState<boolean>(true);
  const [strokeWidth, setStrokeWidth] = useState<number>(1);

  const handleShapeBtn = (event: React.MouseEvent<HTMLDivElement>) => {
    setContentState((prev) => ({
      ...prev,
      type: (event.target as HTMLElement).id,
      tool: "shape",
      colorShape: selectedColor,
      strokeWidth,
      fillShape: isFillShape,
      strokeColor: selectedColor,
    }));
    setSelectedShape((event.target as HTMLElement).id);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setContentState((prev) => ({
      ...prev,
      colorShape: color,
      strokeColor: color,
    }));
  };

  const handleFillShapeChange = () => {
    setFillShape(!isFillShape);
  };

  const handleStrokeWidthChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStrokeWidth(Number(event.target.value));
  };

  const handlePenBtn = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setContentState((prev) => ({
      ...prev,
      tool: "pen",
    }));
    console.log("Ali");
  };

  useEffect(() => {
    const canvas = contentState.canvas;

    const handleObjectSelected = () => {
      if (contentState.tool === "pen") return;
      const activeObject = canvas?.getActiveObject();
      if (activeObject) {
        activeObject.set({
          fill: isFillShape ? selectedColor : "transparent",
          stroke: selectedColor,
          strokeWidth,
        });

        canvas?.renderAll();
      }
    };

    canvas?.on("selection:created", handleObjectSelected);
    canvas?.on("selection:updated", handleObjectSelected);

    return () => {
      canvas?.off("selection:created", handleObjectSelected);
      // canvas?.off("selection:updated", handleObjectSelected);
    };
  }, [contentState]);
  return (
    <div className="h-screen bg-gray-800 text-white flex flex-col items-center p-4 shadow-lg">
      <h2 className="text-2xl mb-6">Shapes</h2>
      <div className="flex flex-col gap-4 w-full" onClick={handleShapeBtn}>
        <button
          className={`py-2 px-4 rounded cursor-pointer ${
            selectedShape === "rectangle" ? "bg-green-500" : "bg-gray-700"
          } hover:bg-green-500 text-white`}
          id="rectangle"
        >
          Rectangle
        </button>
        <button
          className={`py-2 px-4 rounded cursor-pointer ${
            selectedShape === "circle" ? "bg-green-500" : "bg-gray-700"
          } hover:bg-green-500 text-white`}
          id="circle"
        >
          Circle
        </button>
        <button
          className={`py-2 px-4 rounded cursor-pointer ${
            selectedShape === "triangle" ? "bg-green-500" : "bg-gray-700"
          } hover:bg-green-500 text-white`}
          id="triangle"
        >
          Triangle
        </button>
      </div>
      <button
        className={`py-2 px-4 rounded cursor-pointer ${
          selectedShape === "pen" ? "bg-green-500" : "bg-gray-700"
        } hover:bg-green-500 text-white`}
        onClick={handlePenBtn}
        id="pen"
      >
        Pen
      </button>
      <h2 className="text-2xl mt-6 mb-4">Colors</h2>
      <div className="flex flex-col justify-center gap-2">
        {["red", "green", "blue", "yellow", "purple"].map((color) => (
          <button
            key={color}
            className={`w-8 h-8 rounded-full cursor-pointer ${
              selectedColor === color ? "ring-2 ring-white" : ""
            }`}
            style={{ backgroundColor: color }}
            onClick={() => handleColorChange(color)}
          />
        ))}
      </div>
      <h2 className="text-base mt-6 mb-4">Change fill shape</h2>
      <input
        type="checkbox"
        checked={isFillShape}
        onChange={handleFillShapeChange}
      />
      <h2 className="text-xl mt-6 mb-4">Stroke Width</h2>
      <input
        type="range"
        min="1"
        max="10"
        value={strokeWidth}
        onChange={handleStrokeWidthChange}
        className="w-full"
      />
      <span>{strokeWidth}</span>
    </div>
  );
}

export default Menu;
