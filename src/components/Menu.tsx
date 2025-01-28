import { useEffect, useState } from "react";
import { useContextCanvas } from "../context/Context";

function Menu() {
  const { setContentState } = useContextCanvas();
  const [selectedColor, setSelectedColor] = useState("red");

  const handleShapeBtn = (event: React.MouseEvent<HTMLDivElement>) => {
    setContentState((prev) => ({
      ...prev,
      type: (event.target as HTMLElement).id,
      tool: "shape",
      colorShape: selectedColor,
      strokeWidth: 1,
    }));
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  return (
    <div className="h-screen bg-gray-800 text-white flex flex-col items-center p-4 shadow-lg">
      <h2 className="text-2xl mb-6">Shapes</h2>
      <div className="flex flex-col gap-4 w-full" onClick={handleShapeBtn}>
        <button
          className="bg-gray-700 hover:bg-green-500 text-white py-2 px-4 rounded"
          id="rectangle"
        >
          Rectangle
        </button>
        <button
          className="bg-gray-700 hover:bg-green-500 text-white py-2 px-4 rounded"
          id="circle"
        >
          Circle
        </button>
        <button
          className="bg-gray-700 hover:bg-green-500 text-white py-2 px-4 rounded"
          id="triangle"
        >
          Triangle
        </button>
      </div>
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
    </div>
  );
}

export default Menu;
