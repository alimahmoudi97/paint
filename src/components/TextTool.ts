import { IText, TPointerEventInfo } from "fabric";
import { BaseProps } from "../types/types";

export const TextTool = ({
  canvas,
  contentState,
  setContentState,
}: BaseProps) => {
  const onMouseDown = (e: TPointerEventInfo) => {
    console.log(e);
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
    text.selectAll();

    setContentState({ ...contentState, tool: "select" });

    canvas.on("mouse:down", () => {
      if (canvas.getActiveObject() !== text) {
        if (text.text === "") {
          canvas.remove(text);
        }
      }
    });
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
