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
import { RiApps2AddLine } from "react-icons/ri";
import { FaPencil } from "react-icons/fa6";

function Menu() {
  const { contentState, setContentState } = useContextCanvas();
  const [selectedShape, setSelectedShape] = useState("");
  const [selectedColor, setSelectedColor] = useState("red");
  const [isFillShape, setFillShape] = useState<boolean>(true);
  const [strokeWidth, setStrokeWidth] = useState<number>(1);

  const handleShapeBtn = (type: string) => {
    setContentState((prev) => ({
      ...prev,
      type,
      tool: "shape",
      colorShape: selectedColor,
      strokeWidth,
      fillShape: isFillShape,
      strokeColor: selectedColor,
    }));
    setSelectedShape(type);
    console.log("Selected Shape:", selectedShape);
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

  const handleElements = () => {
    setContentState((pre) => ({
      ...pre,
      expandDrawMenu: false,
      expandElementsMenu: !contentState.expandElementsMenu,
    }));
  };

  const handleDraw = () => {
    setContentState((pre) => ({
      ...pre,
      expandDrawMenu: !contentState.expandDrawMenu,
      expandElementsMenu: false,
    }));
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
      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={handleElements}
      >
        <RiApps2AddLine className="w-9 h-9" />
        <span className="text-base mb-6">Elements</span>
      </div>
      <div
        className={`absolute left-40 top-0 bottom-0 w-90 z-999999 border rounded-br-2xl
           rounded-tr-2xl bg-white transition-all duration-200 ease-in-out
           shadow shadow-blue-500
           flex flex-col items-center
            ${
              contentState.expandElementsMenu
                ? "opacity-100 visible"
                : "opacity-0 invisible"
            }`}
      >
        <h2 className="text-2xl mb-6 text-black">Shapes</h2>
        <div className="flex flex-wrap gap-4 w-full">
          <button
            className={`py-2 px-4 rounded cursor-pointer ${
              selectedShape === "rectangle" ? "bg-green-500" : "bg-gray-700"
            } hover:bg-green-500 text-white`}
            id="rectangle"
            onClick={() => handleShapeBtn("rectangle")}
          >
            <FaSquare />
          </button>
          <button
            className={`py-2 px-4 rounded cursor-pointer ${
              selectedShape === "circle" ? "bg-green-500" : "bg-gray-700"
            } hover:bg-green-500 text-white`}
            id="circle"
            onClick={() => handleShapeBtn("circle")}
          >
            <FaCircle />
          </button>
          <button
            className={`py-2 px-4 rounded cursor-pointer ${
              selectedShape === "triangle" ? "bg-green-500" : "bg-gray-700"
            } hover:bg-green-500 text-white`}
            id="triangle"
            onClick={() => handleShapeBtn("triangle")}
          >
            <FiTriangle />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 w-full text-black">
          <h2 className="text-xl mt-6 mb-4">Change fill shape</h2>
          <input
            type="checkbox"
            checked={isFillShape}
            onChange={handleFillShapeChange}
            className="w-4 h-4"
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-2 w-full text-black">
          <h2 className="text-xl mt-6 mb-4">Stroke Width</h2>
          <input
            type="range"
            min="1"
            max="10"
            value={strokeWidth}
            onChange={handleStrokeWidthChange}
          />
          <span>{strokeWidth}</span>
        </div>
      </div>
      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={handleDraw}
      >
        <FaPencil className="w-9 h-9" />
        <span className="text-base mb-6">Draw</span>
      </div>
      <div
        className={`absolute left-40 top-0 bottom-0 w-90 z-999999 border rounded-br-2xl
           rounded-tr-2xl bg-white transition-all duration-200 ease-in-out
           shadow shadow-blue-500
           flex flex-col items-center
            ${
              contentState.expandDrawMenu
                ? "opacity-100 visible"
                : "opacity-0 invisible"
            }`}
      >
        <h2 className="text-2xl mb-6 text-black">Tools</h2>
        <div
          className="flex justify-center gap-4 w-full"
          onClick={handleShapeBtn}
        >
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
        <h2 className="text-2xl mt-6 mb-4 text-black">Colors</h2>
        <div className="flex flex-wrap justify-center gap-2">
          {["red", "green", "blue", "yellow", "purple"].map((color) => (
            <button
              key={color}
              className={`w-9 h-9 rounded-full cursor-pointer ${
                selectedColor === color ? "ring-2 ring-white" : ""
              }`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorChange(color)}
            />
          ))}
        </div>
      </div>

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
