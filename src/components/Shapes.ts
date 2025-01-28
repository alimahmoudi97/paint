import { Canvas, Circle, Rect, Triangle } from "fabric";

interface ShapeProps {
  canvas: Canvas;
  contentState: {
    tool: string;
    canvas: Canvas | undefined;
    type: string;
  };
  setContentState: React.Dispatch<
    React.SetStateAction<{
      tool: string;
      canvas: Canvas | undefined;
      type: string;
    }>
  >;
}

export const Shape = ({
  canvas,
  contentState,
  setContentState,
}: ShapeProps) => {
  const addShape = ({ x, y }) => {
    let shape;
    if (contentState.tool === "selected") return;
    switch (contentState.type) {
      case "rectangle":
        shape = new Rect({
          left: x,
          top: y,
          originX: "center",
          originY: "center",
          fill: "red",
          width: 50,
          height: 50,
        });
        break;
      case "circle":
        shape = new Circle({
          left: x,
          top: y,
          originX: "center",
          originY: "center",
          fill: "green",
          radius: 50,
        });
        break;
      case "triangle":
        shape = new Triangle({
          left: x,
          top: y,
          originX: "center",
          originY: "center",
          fill: "blue",
          width: 50,
          height: 50,
        });
        break;
      default:
        return;
    }
    canvas.add(shape);
    setContentState((prev) => ({ ...prev, tool: "selected" }));
  };

  const onMouseDown = (event) => {
    addShape({ x: event.pointer.x, y: event.pointer.y });
    console.log({ x: event.pointer.x, y: event.pointer.y });
  };

  canvas.on("mouse:down", onMouseDown);

  return {
    removeEventListener: function () {
      canvas.off("mouse:down", onMouseDown);
    },
  };
};
