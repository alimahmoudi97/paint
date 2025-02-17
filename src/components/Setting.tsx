import { useEffect } from "react";
import { useContextCanvas } from "../hooks/useContextCanvas";
import {
  BsAlignBottom,
  BsAlignCenter,
  BsAlignEnd,
  BsAlignMiddle,
  BsAlignStart,
  BsAlignTop,
} from "react-icons/bs";

function Setting() {
  const { contentState, setContentState } = useContextCanvas();

  const alignObject = (alignment: string) => {
    const canvas = contentState.canvas;
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      switch (alignment) {
        case "vertical-start":
          activeObject.set({ top: 0 });
          break;
        case "vertical-middle":
          activeObject.set({
            top: canvas.height / 2 - activeObject.height / 2,
          });
          break;
        case "vertical-end":
          activeObject.set({ top: canvas.height - activeObject.height });
          break;
        case "horizontal-start":
          activeObject.set({ left: 0 });
          break;
        case "horizontal-middle":
          activeObject.set({ left: canvas.width / 2 - activeObject.width / 2 });
          break;
        case "horizontal-end":
          activeObject.set({ left: canvas.width - activeObject.width });
          break;
        default:
          break;
      }
      activeObject.setCoords();
      canvas.renderAll();
      setContentState((prev) => ({
        ...prev,
        selectedObject: activeObject,
      }));
    }
  };

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
      if (property === "fill") {
        setContentState((prev) => ({
          ...prev,
          selectedObject: activeObject,
          colorShape: value as string,
        }));
      } else {
        setContentState((prev) => ({
          ...prev,
          selectedObject: activeObject,
        }));
      }
    }
  };

  useEffect(() => {
    console.log("active object:", contentState);
  }, [contentState]);

  return (
    <div className="h-screen bg-gray-800 text-white w-full flex flex-col px-2 py-4 z-100 shadow-lg relative">
      <h2 className="text-2xl mb-4">Object Properties</h2>
      {contentState.selectedObject ? (
        <div className="text-left">
          <div className="flex items-center justify-evenly">
            <div className="flex flex-col gap-2">
              <span>Top</span>
              <span className="bg-gray-600 w-24 p-2">
                {contentState.selectedObject.top.toFixed(0)}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span>Left</span>
              <span className="bg-gray-600 w-24 p-2">
                {contentState.selectedObject.left.toFixed(0)}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-evenly mt-2">
            <div className="flex flex-col gap-2">
              <span>Width</span>
              <span className="bg-gray-600 w-24 p-2">
                {contentState.selectedObject.width.toFixed(2)}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span>Height</span>
              <span className="bg-gray-600 w-24 p-2">
                {contentState.selectedObject.height.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-evenly mt-2">
            <div className="flex flex-col gap-2">
              <span>Stroke Width</span>
              <input
                type="number"
                className="bg-gray-600 w-24 p-2"
                value={contentState.selectedObject.strokeWidth || 1}
                onChange={(e) =>
                  handlePropertyChange("strokeWidth", e.target.value)
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <span>Fill Color</span>
              <input
                type="color"
                className="bg-gray-600 w-24 p-2"
                value={
                  typeof contentState.selectedObject.fill === "string"
                    ? contentState.selectedObject.fill
                    : "#000000"
                }
                onChange={(e) => handlePropertyChange("fill", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <span>Stroke Color</span>
              <input
                type="color"
                className="bg-gray-600 w-24 p-2"
                value={
                  typeof contentState.selectedObject.stroke === "string"
                    ? contentState.selectedObject.stroke
                    : "#000000"
                }
                onChange={(e) => handlePropertyChange("stroke", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <span>Fill Shape</span>
              <input
                type="checkbox"
                className="bg-gray-600 w-24 p-2"
                checked={contentState.fillShape || false}
                onChange={(e) =>
                  setContentState((prev) => ({
                    ...prev,
                    fillShape: e.target.checked,
                  }))
                }
              />
            </div>
          </div>
          <div className="flex flex-col items-center mt-4">
            <h3 className="text-xl mb-2">Align Object</h3>
            <div className="flex gap-2">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => alignObject("vertical-start")}
              >
                <BsAlignTop />
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => alignObject("vertical-middle")}
              >
                <BsAlignMiddle />
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => alignObject("vertical-end")}
              >
                <BsAlignBottom />
              </button>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => alignObject("horizontal-start")}
              >
                <BsAlignStart />
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => alignObject("horizontal-middle")}
              >
                <BsAlignCenter />
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => alignObject("horizontal-end")}
              >
                <BsAlignEnd />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p>No object selected</p>
      )}
    </div>
  );
}

export default Setting;
