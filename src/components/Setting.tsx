import { useState } from "react";
import { useContextCanvas } from "../hooks/useContextCanvas";
import Layers from "./Layers";
import ObjectSetting from "./ObjectSetting";
import TypographySetting from "./TypographySetting";
import PenToolSetting from "./PenToolSetting";
import CanvasSetting from "./CanvasSetting";
import ImageFilterSetting from "./ImageFilterSetting";

function Setting() {
  const { contentState } = useContextCanvas();
  const [activeTab, setActiveTab] = useState("design");

  const objectLabel = contentState.selectedObject?.type
    ? contentState.selectedObject.type.charAt(0).toUpperCase() +
      contentState.selectedObject.type.slice(1)
    : "No selection";

  return (
    <div className="h-screen bg-white w-full flex flex-col border-l border-gray-100 shadow-sm relative">
      <div className="px-4 py-3.5 border-b border-gray-100">
        <h2 className="text-base font-bold text-gray-800">Settings</h2>
      </div>

      <div className="px-4 pt-4">
        <div className="flex items-center bg-gray-100 rounded-full p-1 gap-1">
          <button
            className={`flex-1 text-sm font-medium py-1.5 rounded-full cursor-pointer transition-all duration-200 ${
              activeTab === "design"
                ? "bg-white text-purple-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("design")}
          >
            Design
          </button>
          <button
            className={`flex-1 text-sm font-medium py-1.5 rounded-full cursor-pointer transition-all duration-200 ${
              activeTab === "canvas"
                ? "bg-white text-purple-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("canvas")}
          >
            Canvas
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar px-4 py-4">
        {activeTab === "design" ? (
          <div className="flex flex-col gap-3">
            <span
              className={`inline-flex items-center self-start text-xs font-semibold px-2.5 py-1 rounded-full ${
                contentState.selectedObject
                  ? "bg-purple-100 text-purple-600"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {objectLabel}
            </span>
            {contentState.tool === "text" ||
            contentState.selectedObject?.type === "i-text" ? (
              <TypographySetting />
            ) : contentState.tool === "pen" ||
              contentState.selectedObject?.type === "path" ? (
              <PenToolSetting />
            ) : (
              <>
                <ObjectSetting />
                <ImageFilterSetting />
                <Layers />
              </>
            )}
          </div>
        ) : (
          <CanvasSetting />
        )}
      </div>
    </div>
  );
}

export default Setting;
