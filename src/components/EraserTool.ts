import { Object, Group } from "fabric";
import { BaseProps } from "../types/types";

export const EraserTool = ({
  canvas,
  contentState,
  setContentState,
}: BaseProps) => {
  let isDown = false;
  let objectToRemove: Object[] = [];

  if (contentState.tool === "eraser") {
    canvas.forEachObject((object) => {
      object.set({ selectable: false, perPixelTargetFind: true });
    });

    canvas.renderAll();
  }

  const onMouseDown = (e) => {
    console.log("onMouseDown:", contentState.tool);
    if (contentState.tool !== "eraser") return;
    objectToRemove = [];

    isDown = true;

    if (!e.target) return;

    canvas.forEachObject((object) => {
      object.set({ selectable: false, perPixelTargetFind: true });
    });

    objectToRemove.push(e.target);
    e.target.set({ opacity: 0.5 });
    console.log(objectToRemove);

    canvas.renderAll();
  };

  const onMouseMove = (e) => {
    if (contentState.tool !== "eraser") return;

    canvas.forEachObject((object) => {
      object.set({ selectable: false, perPixelTargetFind: true });
    });

    if (!isDown) return;
    if (!e.target) return;

    objectToRemove.push(e.target);
    e.target.set({ opacity: 0.5 });
    canvas.renderAll();
  };

  const onMouseUp = (e) => {
    if (contentState.tool !== "eraser") return;

    objectToRemove.forEach((object) => {
      if (object.type === "group") {
        (object as Group).forEachObject((object: Object) => {
          canvas.remove(object);
        });
        canvas.remove(object);
      } else {
        canvas.remove(object);
      }
    });

    canvas.remove(e.target);

    objectToRemove = [];
    isDown = false;

    canvas.forEachObject((object) => {
      object.set({ selectable: true, perPixelTargetFind: true });
    });
    canvas.renderAll();
  };

  canvas.on("mouse:down", onMouseDown);
  canvas.on("mouse:move", onMouseMove);
  canvas.on("mouse:up", onMouseUp);

  return {
    removeEventListener: function () {
      canvas.off("mouse:down", onMouseDown);
      canvas.off("mouse:move", onMouseMove);
      canvas.off("mouse:up", onMouseUp);
    },
  };
};
