import React, { useEffect } from "react";
import { useContextCanvas } from "../hooks/useContextCanvas";
import { EraserTool } from "./EraserTool";
import { RiDeleteBin5Line } from "react-icons/ri";
import { IoDuplicateOutline } from "react-icons/io5";

interface ToolbarProps {
  top: number;
  left: number;
  width: number;
  height: number;
}

const Toolbar: React.FC<ToolbarProps> = ({ top, left, width }) => {
  const { contentState, setContentState } = useContextCanvas();

  const toolbarStyle: React.CSSProperties = {
    position: "absolute",
    top: top - 40, // Position the toolbar above the object
    left: left + width / 2 - 50, // Center the toolbar horizontally
    transform: "translateX(-50%)",
    backgroundColor: "white",
    padding: "5px",
    borderRadius: "5px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
    zIndex: 1000000,
    background: "white",
  };

  const handleDeleteClick = () => {
    const canvas = contentState.canvas;

    if (!canvas) return;
    const objectsToSelect = canvas.getActiveObject();

    if (objectsToSelect) {
      canvas.remove(objectsToSelect);
    }

    canvas.forEachObject((object) => {
      object.set({ selectable: true, perPixelTargetFind: true });
    });

    setContentState((prev) => ({ ...prev, tool: "select" }));
    canvas.renderAll();
  };

  const handleDuplicateClick = async () => {
    const canvas = contentState.canvas;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();

    if (activeObject) {
      const cloned = await activeObject.clone();
      canvas.discardActiveObject();
      cloned.set({
        left: activeObject.left + 10,
        top: activeObject.top + 10,
        evented: true,
      });
      // if (cloned.type === "activeSelection") {
      //   cloned.canvas = canvas;
      //   cloned.forEachObject((object) => {
      //     canvas.add(object);
      //   });

      // }
      cloned.setCoords();
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.requestRenderAll();
    }
  };

  useEffect(() => {
    if (contentState.canvas) {
      const eraserEventListener = EraserTool({
        canvas: contentState.canvas,
        contentState,
        setContentState,
      });
      return () => {
        eraserEventListener.removeEventListener();
      };
    }
  }, [contentState]);

  return (
    <div style={toolbarStyle} className="flex gap-2">
      <button className="toolbar-button" onClick={handleDeleteClick}>
        <span aria-hidden="true" style={{ color: "rgb(5, 113, 211)" }}>
          <RiDeleteBin5Line className="w-6 h-6" />
        </span>
      </button>
      <button className="toolbar-button" onClick={handleDuplicateClick}>
        <span aria-hidden="true" style={{ color: "rgb(5, 113, 211)" }}>
          <IoDuplicateOutline className="w-6 h-6" />
        </span>
      </button>
    </div>
  );
};

export default Toolbar;
