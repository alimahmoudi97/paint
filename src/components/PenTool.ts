import { PencilBrush, CircleBrush, SprayBrush, PatternBrush } from "fabric";
import { BaseProps } from "../types/types";

function PenTool({ canvas, contentState, setContentState }: BaseProps) {
  const setBrush = (brushType: string) => {
    switch (brushType) {
      case "pencil":
        canvas.freeDrawingBrush = new PencilBrush(canvas);
        break;
      case "marker":
        canvas.freeDrawingBrush = new CircleBrush(canvas);
        break;
      case "highlighter":
        canvas.freeDrawingBrush = new SprayBrush(canvas);
        break;
      case "pattern":
        canvas.freeDrawingBrush = new PatternBrush(canvas);
        break;
      default:
        canvas.freeDrawingBrush = new PencilBrush(canvas);
    }

    if (canvas.freeDrawingBrush) {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.color = contentState.colorShape;
      canvas.freeDrawingBrush.width = contentState.strokeWidth;
    }
  };

  if (contentState.tool === "pen") {
    setBrush(contentState.brushType);
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
