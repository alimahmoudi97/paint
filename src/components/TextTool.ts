import { Canvas, IText } from "fabric";

interface ShapeProps {
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

export const TextTool = ({
  canvas,
  contentState,
  setContentState,
}: ShapeProps) => {
  let isDown = false;

  const onMouseDown = (e) => {
    console.log(contentState.tool);
    if (contentState.tool !== "text") return;

    const text = new IText("", {
      left: e.pointer.x,
      top: e.pointer.y,
      fill: "#000000",
      fontSize: 20,
    });
    text.on("editing:entered", () => {
      text.borderColor = "#0D99FF";
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    text.enterEditing();
    canvas.renderAll();
  };

  //   const onMouseMove = (e) => {
  //     if (contentState.tool !== "text") return;
  //   };

  //   const onMouseUp = (e) => {
  //     if (contentState.tool !== "text") return;
  //   };

  canvas.on("mouse:down", onMouseDown);
  //   canvas.on("mouse:move", onMouseMove);
  //   canvas.on("mouse:up", onMouseUp);

  return {
    textEventListener: function () {
      canvas.off("mouse:down", onMouseDown);
      //   canvas.off("mouse:move", onMouseMove);
      //   canvas.off("mouse:up", onMouseUp);
    },
  };
};
