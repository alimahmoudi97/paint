import { Canvas } from "fabric";
import { useEffect, useRef } from "react";
import { useContextCanvas } from "../context/Context";
import { Shape } from "./Shapes";
import PenTool from "./PenTool";
import { EraserTool } from "./EraserTool";
import { TextTool } from "./TextTool";

const CELL_SIZE = 30;

function snapToGrid(point) {
  return Math.round(point / CELL_SIZE) * CELL_SIZE;
}

function CanvasWrapper() {
  const { contentState, setContentState } = useContextCanvas();
  const canvasRef = useRef(null);
  const fabricRef = useRef<Canvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    // if (fabricRef.current) return;

    const canvas = new Canvas(canvasRef.current, { perPixelTargetFind: true });
    fabricRef.current = canvas;

    canvas._renderBackground = function (ctx) {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const zoom = this.getZoom();
      const offsetX = this.viewportTransform[4];
      const offsetY = this.viewportTransform[5];

      ctx.strokeStyle = "#e6fbff";
      ctx.lineWidth = 1;

      const gridSize = CELL_SIZE * zoom;

      const numCellsX = Math.ceil(canvas.width / gridSize);
      const numCellsY = Math.ceil(canvas.height / gridSize);

      const gridOffsetX = offsetX % gridSize;
      const gridOffsetY = offsetY % gridSize;

      ctx.save();
      ctx.beginPath();

      for (let i = 0; i <= numCellsX; i++) {
        const x = gridOffsetX + i * gridSize;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }

      for (let i = 0; i <= numCellsY; i++) {
        const y = gridOffsetY + i * gridSize;
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }

      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    };

    canvas.setWidth(Math.floor(window.document.body.offsetWidth * 0.9));
    canvas.setHeight(Math.floor(window.innerHeight * 0.9));

    setContentState((prev) => ({ ...prev, canvas: canvas }));

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricRef.current) return;
    const shapeEventListener = Shape({
      canvas: fabricRef.current,
      contentState,
      setContentState,
    });

    const eraserEventListener = EraserTool({
      canvas: fabricRef.current,
      contentState,
      setContentState,
    });

    const textEventListener = TextTool({
      canvas: fabricRef.current,
      contentState,
      setContentState,
    });

    const penEventListener = PenTool({
      canvas: fabricRef.current,
      contentState,
      setContentState,
    });

    return () => {
      shapeEventListener.removeEventListener();
      eraserEventListener.removeEventListener();
      textEventListener.textEventListener();
      penEventListener.removeEventListeners();
    };
  }, [contentState]);

  // useEffect(() => {
  //   if (fabricRef.current && contentState.tool == "pen") {
  //     PenTool({ canvas: fabricRef.current, contentState, setContentState });
  //     console.log(contentState.tool);
  //   }
  // }, [contentState.tool]);

  useEffect(() => {
    if (!canvasRef.current) return;
    console.log(contentState.tool);
  }, [contentState]);

  return (
    <div>
      <canvas ref={canvasRef} id="canvas" className="border border-amber-300" />
    </div>
  );
}
export default CanvasWrapper;
