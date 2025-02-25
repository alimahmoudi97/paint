import {
  Circle,
  Ellipse,
  Line,
  Polygon,
  Rect,
  TPointerEventInfo,
  Triangle,
} from "fabric";
import { BaseProps } from "../types/types";

export const Shape = ({ canvas, contentState, setContentState }: BaseProps) => {
  let shape: Rect | Circle | Triangle;
  let originX: number;
  let originY: number;
  let isDrawing = false;

  const addShape = ({ x, y }: { x: number; y: number }) => {
    if (contentState.tool === "selected" || contentState.tool === "pen") return;
    canvas.isDrawingMode = false;
    if (canvas.getActiveObject()) return;
    switch (contentState.type) {
      case "rectangle":
        shape = new Rect({
          left: x,
          top: y,
          originX: "left",
          originY: "top",
          fill: contentState.fillShape
            ? contentState.colorShape
            : "transparent",
          stroke: contentState.strokeColor,
          strokeWidth: contentState.strokeWidth * 4,
          width: 0,
          height: 0,
        });
        break;
      case "circle":
        shape = new Circle({
          left: x,
          top: y,
          originX: "left",
          originY: "top",
          fill: contentState.fillShape
            ? contentState.colorShape
            : "transparent",
          stroke: contentState.strokeColor,
          strokeWidth: contentState.strokeWidth * 4,
          radius: 0,
        });
        break;
      case "triangle":
        shape = new Triangle({
          left: x,
          top: y,
          originX: "left",
          originY: "top",
          fill: contentState.fillShape
            ? contentState.colorShape
            : "transparent",
          stroke: contentState.strokeColor,
          strokeWidth: contentState.strokeWidth * 4,
          width: 0,
          height: 0,
        });
        break;
      case "ellipse":
        shape = new Ellipse({
          left: x,
          top: y,
          originX: "left",
          originY: "top",
          fill: contentState.fillShape
            ? contentState.colorShape
            : "transparent",
          stroke: contentState.strokeColor,
          strokeWidth: contentState.strokeWidth * 4,
          rx: 0,
          ry: 0,
        });
        break;
      case "line":
        shape = new Line([x, y, x, y], {
          stroke: contentState.strokeColor,
          strokeWidth: contentState.strokeWidth * 4,
        });
        break;
      case "polygon":
        shape = new Polygon(
          [
            { x: x, y: y },
            { x: x + 50, y: y },
            { x: x + 25, y: y + 50 },
          ],
          {
            fill: contentState.fillShape
              ? contentState.colorShape
              : "transparent",
            stroke: contentState.strokeColor,
            strokeWidth: contentState.strokeWidth * 4,
          }
        );
        break;
      default:
        return;
    }
    canvas.add(shape);
    setContentState((prev) => ({ ...prev, tool: "select" }));
    isDrawing = true;
  };

  const onMouseDown = (event: TPointerEventInfo) => {
    if (contentState.tool !== "shape") return;
    originX = event.viewportPoint.x;
    originY = event.viewportPoint.y;
    addShape({ x: originX, y: originY });
  };
  const onMouseMove = (event: TPointerEventInfo) => {
    if (contentState.tool !== "shape") return;
    if (!isDrawing) return;
    const currentX = event.pointer.x;
    const currentY = event.pointer.y;
    const width = currentX - originX;
    const height = currentY - originY;

    switch (contentState.type) {
      case "rectangle":
        shape.set({ width: Math.abs(width), height: Math.abs(height) });
        if (width < 0) shape.set({ left: currentX });
        if (height < 0) shape.set({ top: currentY });
        break;
      case "circle": {
        const radius = Math.sqrt(width * width + height * height) / 2;
        shape.set({ radius: radius / 2 });
        break;
      }
      case "triangle":
        shape.set({ width: Math.abs(width), height: Math.abs(height) });
        if (width < 0) shape.set({ left: currentX });
        if (height < 0) shape.set({ top: currentY });
        break;
      case "ellipse":
        shape.set({ rx: Math.abs(width) / 2, ry: Math.abs(height) / 2 });
        if (width < 0) shape.set({ left: currentX });
        if (height < 0) shape.set({ top: currentY });
        break;
      case "line":
        shape.set({ x2: currentX, y2: currentY });
        break;
      case "polygon": {
        const points = [
          { x: originX, y: originY },
          { x: currentX, y: originY },
          { x: (originX + currentX) / 2, y: currentY },
        ];
        shape.set({ points });
        break;
      }
    }
    canvas.renderAll();
  };
  const onMouseUp = () => {
    if (contentState.tool !== "shape") return;
    isDrawing = false;

    canvas.isDrawingMode = false;

    setContentState((prev) => ({ ...prev, tool: "select" }));
  };

  canvas.on("mouse:down", onMouseDown);
  canvas.on("mouse:move", onMouseMove);
  canvas.on("mouse:up", onMouseUp);

  return {
    removeEventListener: function () {
      canvas.off("mouse:down", onMouseDown);
      canvas.on("mouse:move", onMouseMove);
      canvas.on("mouse:up", onMouseUp);
    },
  };
};
