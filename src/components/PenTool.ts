import { PencilBrush } from "fabric";
import { BaseProps } from "../types/types";

function PenTool({ canvas, contentState, setContentState }: BaseProps) {
  if (contentState.tool == "pen") {
    // console.log("canvas:", canvas);
    canvas.freeDrawingBrush = new PencilBrush(canvas);
    if (canvas.freeDrawingBrush) {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.color = "#000000";
      canvas.freeDrawingBrush.width = 5;
    }
  }

  const onMouseUp = () => {
    if (contentState.tool !== "pen") return;
    setContentState((prev) => ({ ...prev, tool: "pen" }));
  };

  canvas.on("mouse:up", onMouseUp);

  return {
    removeEventListeners: () => {
      canvas.off("mouse:up", onMouseUp);
    },
  };
  //   setContentState((prev) => ({ ...prev, canvas }));
}

export default PenTool;
