import { Canvas, PencilBrush } from "fabric";

interface PenTollProps {
  canvas: Canvas;
  contentState: {
    tool: string;
    canvas: Canvas | undefined;
    type: string;
    colorShape: string;
    strokeWidth: number;
    strokeColor: string;
    fillShape: boolean;
  };
  setContentState: React.Dispatch<
    React.SetStateAction<{
      tool: string;
      canvas: Canvas | undefined;
      type: string;
      colorShape: string;
      strokeWidth: number;
      strokeColor: string;
      fillShape: boolean;
    }>
  >;
}

function PenTool({ canvas, contentState, setContentState }: PenTollProps) {
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
