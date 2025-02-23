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
import Layers from "./Layers";

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
    <div className="h-screen bg-white w-full flex flex-col px-2 py-4 z-100 shadow-lg relative">
      <h2 className="text-base mb-4 font-semibold">Design</h2>
      <h2 className="border-b text-base font-semibold border-gray-300">
        {contentState.selectedObject?.type
          ? contentState.selectedObject.type.charAt(0).toUpperCase() +
            contentState.selectedObject.type.slice(1)
          : ""}
      </h2>
      {contentState.selectedObject ? (
        <div className="text-left">
          <div>
            <h3 className="my-2 font-semibold">Position</h3>
            <div className="flex items-center justify-evenly">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Top :</span>
                <span className="bg-gray-100 w-20 p-2 text-sm rounded-sm">
                  {contentState.selectedObject.top.toFixed(0)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Left :</span>
                <span className="bg-gray-100 w-20 p-2 text-sm rounded-sm">
                  {contentState.selectedObject.left.toFixed(0)}
                </span>
              </div>
            </div>
          </div>
          <div className="border-b border-gray-300 pb-2">
            <h3 className="font-semibold">layout</h3>
            <div className="flex items-center justify-evenly mt-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Width :</span>
                <span className="bg-gray-100 w-20 p-2 text-sm rounded-sm">
                  {contentState.selectedObject.width.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Height :</span>
                <span className="bg-gray-100 w-20 p-2 text-sm rounded-sm">
                  {contentState.selectedObject.height.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-evenly">
            <div className="flex flex-col gap-2 w-full border-b border-gray-300 py-2">
              <span className="font-semibold">Fill</span>
              <div className="flex gap-2">
                <span className="text-sm text-gray-600">Fill Shape</span>
                <input
                  type="checkbox"
                  className="bg-gray-100 w-24 p-2"
                  checked={contentState.fillShape || false}
                  onChange={(e) =>
                    setContentState((prev) => ({
                      ...prev,
                      fillShape: e.target.checked,
                    }))
                  }
                />
              </div>
              <div className="flex items-center bg-gray-100 rounded-sm p-1">
                <div>
                  <input
                    type="color"
                    className="bg-gray-100 w-8 h-8"
                    value={
                      typeof contentState.selectedObject.fill === "string"
                        ? contentState.selectedObject.fill
                        : "#000000"
                    }
                    onChange={(e) =>
                      handlePropertyChange("fill", e.target.value)
                    }
                  />
                </div>
                <input
                  type="text"
                  value={
                    typeof contentState.selectedObject.fill === "string"
                      ? contentState.selectedObject.fill
                      : "#000000"
                  }
                  onChange={(e) => handlePropertyChange("fill", e.target.value)}
                  placeholder={contentState.colorShape}
                  className="focus:outline-0  text-sm"
                />
                <span className="mr-0.5 text-sm text-gray-500">%</span>
                <input
                  className="w-8 focus:outline-0 text-gray-800 text-sm"
                  min="0"
                  max="100"
                  step="1"
                  value={
                    typeof contentState.selectedObject.opacity === "number"
                      ? contentState.selectedObject.opacity * 100
                      : 100
                  }
                  onChange={(e) =>
                    handlePropertyChange(
                      "opacity",
                      parseFloat(e.target.value) / 100
                    )
                  }
                  placeholder={contentState.selectedObject.opacity.toString()}
                />
              </div>
            </div>
            <div className="flex flex-col w-full p-1 border-b border-gray-300">
              <span className="font-semibold">Stroke</span>
              <div className="flex justify-between">
                <div className="flex items-center">
                  <span className="text-sm whitespace-nowrap mr-1 text-gray-500">
                    Color :
                  </span>
                  <div className="flex items-center bg-gray-100 rounded-sm p-1.5 w-full">
                    <div className="flex-1">
                      <input
                        type="color"
                        className="bg-gray-100 w-8 h-8"
                        value={
                          typeof contentState.selectedObject.stroke === "string"
                            ? contentState.selectedObject.stroke
                            : "#000000"
                        }
                        onChange={(e) =>
                          handlePropertyChange("stroke", e.target.value)
                        }
                      />
                    </div>
                    <input
                      type="text"
                      value={
                        typeof contentState.selectedObject.stroke === "string"
                          ? contentState.selectedObject.stroke
                          : "#000000"
                      }
                      onChange={(e) =>
                        handlePropertyChange("stroke", e.target.value)
                      }
                      placeholder={contentState.strokeColor}
                      className="focus:outline-0 w-14"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Width :</span>
                  <input
                    type="number"
                    className="bg-gray-100 w-12 p-2 text-sm"
                    value={contentState.selectedObject.strokeWidth || 1}
                    onChange={(e) =>
                      handlePropertyChange("strokeWidth", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start p-1 border-b border-gray-300">
            <h3 className="text-base font-semibold mb-2">Align</h3>
            <div className="flex items-center gap-2">
              <span className="mr-4 text-sm text-gray-600">vertical :</span>
              <div className="flex gap-2">
                <button
                  className="bg-gray-300 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded cursor-pointer"
                  onClick={() => alignObject("vertical-start")}
                >
                  <BsAlignTop />
                </button>
                <button
                  className="bg-gray-300 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded cursor-pointer"
                  onClick={() => alignObject("vertical-middle")}
                >
                  <BsAlignMiddle />
                </button>
                <button
                  className="bg-gray-300 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded cursor-pointer"
                  onClick={() => alignObject("vertical-end")}
                >
                  <BsAlignBottom />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">horizental :</span>
              <div className="flex gap-2 mt-2">
                <button
                  className="bg-gray-300 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded cursor-pointer"
                  onClick={() => alignObject("horizontal-start")}
                >
                  <BsAlignStart />
                </button>
                <button
                  className="bg-gray-300 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded cursor-pointer"
                  onClick={() => alignObject("horizontal-middle")}
                >
                  <BsAlignCenter />
                </button>
                <button
                  className="bg-gray-300 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded cursor-pointer"
                  onClick={() => alignObject("horizontal-end")}
                >
                  <BsAlignEnd />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>No object selected</p>
      )}
      <Layers />
    </div>
  );
}

export default Setting;
