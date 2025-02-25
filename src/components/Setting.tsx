import { useState } from "react";
import { useContextCanvas } from "../hooks/useContextCanvas";
import Layers from "./Layers";
import ObjectSetting from "./ObjectSetting";
import TypographySetting from "./TypographySetting";
import PenToolSetting from "./PenToolSetting";
import CanvasSetting from "./CanvasSetting";

function Setting() {
  const { contentState } = useContextCanvas();
  const [activeTab, setActiveTab] = useState("design");

  return (
    <div className="h-screen bg-white w-full flex flex-col px-2 py-4 shadow-lg relative">
      <h2 className="text-base mb-4 font-semibold">Settings</h2>
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 cursor-pointer ${
            activeTab === "design" ? "border-b-2 border-blue-500" : ""
          }`}
          onClick={() => setActiveTab("design")}
        >
          Design
        </button>
        <button
          className={`px-4 py-2 cursor-pointer ${
            activeTab === "canvas" ? "border-b-2 border-blue-500" : ""
          }`}
          onClick={() => setActiveTab("canvas")}
        >
          Canvas
        </button>
      </div>
      {activeTab === "design" ? (
        <>
          <h2 className="border-b text-base font-semibold border-gray-300">
            {contentState.selectedObject?.type
              ? contentState.selectedObject.type.charAt(0).toUpperCase() +
                contentState.selectedObject.type.slice(1)
              : ""}
          </h2>
          {contentState.tool === "text" ||
          contentState.selectedObject?.type === "i-text" ? (
            <TypographySetting />
          ) : contentState.tool === "pen" ||
            contentState.selectedObject?.type === "path" ? (
            <PenToolSetting />
          ) : (
            <>
              <ObjectSetting />
              <Layers />
            </>
          )}
        </>
      ) : (
        <CanvasSetting />
      )}
    </div>
  );
}

export default Setting;
