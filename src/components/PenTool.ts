import { PencilBrush } from "fabric";
import { BaseProps } from "../types/types";

function PenTool({ canvas }: BaseProps) {
  console.log("canvas:", canvas);
  canvas.freeDrawingBrush = new PencilBrush(canvas);
  if (canvas.freeDrawingBrush) {
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush.color = "#000000";
    canvas.freeDrawingBrush.width = 5;
  }

  //   setContentState((prev) => ({ ...prev, canvas }));
}

export default PenTool;
