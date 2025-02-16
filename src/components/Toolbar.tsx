import React, { useEffect } from "react";
import { useContextCanvas } from "../hooks/useContextCanvas";
import { EraserTool } from "./EraserTool";
import { Group } from "fabric";

interface ToolbarProps {
  top: number;
  left: number;
  width: number;
  height: number;
}

const Toolbar: React.FC<ToolbarProps> = ({ top, left, width, height }) => {
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
    background: "red",
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
    <div style={toolbarStyle}>
      <button className="toolbar-button" onClick={handleDeleteClick}>
        <span aria-hidden="true" style={{ color: "rgb(5, 113, 211)" }}>
          Delete
        </span>
      </button>
      <button className="toolbar-button">Duplicate</button>
      <button className="toolbar-button">Edit</button>
    </div>
  );
};

export default Toolbar;
