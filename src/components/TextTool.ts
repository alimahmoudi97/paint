import { TPointerEventInfo, IText } from "fabric";
import { BaseProps } from "../types/types";

export const TextTool = ({
  canvas,
  contentState,
  setContentState,
}: BaseProps) => {
  const onMouseDown = (e: TPointerEventInfo) => {
    // console.log(e);
    if (contentState.tool !== "text") return;

    const text = new IText("type here!", {
      left: e.viewportPoint.x,
      top: e.viewportPoint.y,
      fill: contentState.fontColor,
      fontSize: contentState.fontSize,
      fontFamily: contentState.fontFamily,
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

  canvas.on("mouse:down", onMouseDown);

  return {
    textEventListener: function () {
      canvas.off("mouse:down", onMouseDown);
    },
  };
};
