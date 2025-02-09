import { useEffect, useState } from "react";
import { useContextCanvas } from "../context/Context";
import {
  FaCircle,
  FaEraser,
  FaPen,
  FaSquare,
  FaTextHeight,
} from "react-icons/fa";
import { FiTriangle } from "react-icons/fi";

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
      tool: "color",
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

  const handleExport = () => {
    if (contentState.canvas) {
      const dataURL = contentState.canvas.toDataURL({
        format: "png",
        quality: 1.0,
        multiplier: 1,
      });
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "canvas.png";
      link.click();
    }
  };

  const handleEraserBtn = () => {
    setContentState((prev) => ({ ...prev, tool: "eraser" }));
  };

  const handleTextBtn = () => {
    setContentState((prev) => ({ ...prev, tool: "text" }));
  };

  useEffect(() => {
    const canvas = contentState.canvas;

    const handleObjectSelected = () => {
      if (contentState.tool === "eraser") return;
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
      <div className="flex flex-wrap gap-4 w-full" onClick={handleShapeBtn}>
        <button
          className={`py-2 px-4 rounded cursor-pointer ${
            selectedShape === "rectangle" ? "bg-green-500" : "bg-gray-700"
          } hover:bg-green-500 text-white`}
          id="rectangle"
        >
          <FaSquare />
        </button>
        <button
          className={`py-2 px-4 rounded cursor-pointer ${
            selectedShape === "circle" ? "bg-green-500" : "bg-gray-700"
          } hover:bg-green-500 text-white`}
          id="circle"
        >
          <FaCircle />
        </button>
        <button
          className={`py-2 px-4 rounded cursor-pointer ${
            selectedShape === "triangle" ? "bg-green-500" : "bg-gray-700"
          } hover:bg-green-500 text-white`}
          id="triangle"
        >
          <FiTriangle />
        </button>
      </div>
      <h2 className="text-2xl my-2">Tools</h2>

      <div className="flex flex-wrap gap-4 w-full">
        <button
          className={`py-2 px-4 rounded cursor-pointer ${
            contentState.tool === "pen" ? "bg-green-500" : "bg-gray-700"
          } hover:bg-green-500 text-white`}
          onClick={handlePenBtn}
          id="pen"
        >
          <FaPen />
        </button>
        <button
          className={`py-2 px-4 rounded cursor-pointer ${
            contentState.tool === "eraser" ? "bg-green-500" : "bg-gray-700"
          } hover:bg-green-500 text-white`}
          onClick={handleEraserBtn}
          id="eraser"
        >
          <FaEraser />
        </button>
        <button
          className={`py-2 px-4 rounded cursor-pointer ${
            contentState.tool === "text" ? "bg-green-500" : "bg-gray-700"
          } hover:bg-green-500 text-white`}
          onClick={handleTextBtn}
          id="eraser"
        >
          <FaTextHeight />
        </button>
      </div>
      <h2 className="text-2xl mt-6 mb-4">Colors</h2>
      <div className="flex flex-wrap justify-center gap-2">
        {["red", "green", "blue", "yellow", "purple"].map((color) => (
          <button
            key={color}
            className={`w-6 h-6 rounded-full cursor-pointer ${
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
      <button
        className="text-base py-2 px-1 mt-6 rounded cursor-pointer bg-blue-500 hover:bg-blue-700 text-white"
        onClick={handleExport}
      >
        Export as Image
      </button>
    </div>
  );
}

export default Menu;
